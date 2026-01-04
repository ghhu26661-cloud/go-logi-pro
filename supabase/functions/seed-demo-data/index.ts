import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEMO_CLIENTS = [
  { company_name: "TransExpress SARL", contact_name: "Marie Dupont", email: "marie@transexpress.fr", phone: "01 23 45 67 89", address: "15 Rue de la Logistique", city: "Paris", postal_code: "75001" },
  { company_name: "LogiStock SA", contact_name: "Jean Martin", email: "jean@logistock.fr", phone: "01 98 76 54 32", address: "42 Avenue du Commerce", city: "Lyon", postal_code: "69001" },
  { company_name: "RapidFret", contact_name: "Sophie Bernard", email: "sophie@rapidfret.fr", phone: "04 56 78 90 12", address: "8 Boulevard des Transports", city: "Marseille", postal_code: "13001" },
  { company_name: "EcoTransit", contact_name: "Pierre Leroy", email: "pierre@ecotransit.fr", phone: "03 21 43 65 87", address: "25 Rue Verte", city: "Lille", postal_code: "59000" },
  { company_name: "CargoPlus", contact_name: "Isabelle Moreau", email: "isabelle@cargoplus.fr", phone: "05 67 89 01 23", address: "100 Zone Industrielle", city: "Bordeaux", postal_code: "33000" },
];

const PICKUP_ADDRESSES = [
  "Zone Industrielle Nord, 95200 Sarcelles",
  "Entrepôt Central, 93100 Montreuil",
  "Port de Gennevilliers, 92230 Gennevilliers",
  "Plateforme Logistique, 77550 Moissy-Cramayel",
  "Dépôt Principal, 91200 Athis-Mons",
];

const DELIVERY_ADDRESSES = [
  "45 Rue du Commerce, 75015 Paris",
  "12 Avenue Jean Jaurès, 69007 Lyon",
  "88 Boulevard Michelet, 13008 Marseille",
  "3 Place de la République, 59800 Lille",
  "67 Cours de l'Intendance, 33000 Bordeaux",
  "22 Rue Nationale, 44000 Nantes",
  "15 Avenue Foch, 31000 Toulouse",
  "9 Rue de la Liberté, 21000 Dijon",
];

const ORDER_STATUSES = ['pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'];
const DELIVERY_STATUSES = ['assigned', 'in_progress', 'completed', 'failed'];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();
    const expectedToken = Deno.env.get('DEMO_SEED_TOKEN');
    
    if (!expectedToken || token !== expectedToken) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get chauffeur user ID
    const { data: chauffeurRole } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('role', 'chauffeur')
      .limit(1)
      .single();

    const chauffeurId = chauffeurRole?.user_id;

    // Create clients
    console.log("Creating demo clients...");
    const { data: createdClients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .upsert(DEMO_CLIENTS, { onConflict: 'email' })
      .select();

    if (clientsError) {
      console.error("Error creating clients:", clientsError);
      throw clientsError;
    }

    console.log(`Created ${createdClients?.length || 0} clients`);

    // Create orders for each client
    const orders = [];
    const now = new Date();
    
    for (const client of createdClients || []) {
      const numOrders = Math.floor(Math.random() * 4) + 2; // 2-5 orders per client
      
      for (let i = 0; i < numOrders; i++) {
        const daysAgo = Math.floor(Math.random() * 30);
        const pickupDate = new Date(now);
        pickupDate.setDate(pickupDate.getDate() - daysAgo);
        
        const deliveryDate = new Date(pickupDate);
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 1);
        
        const status = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];
        
        orders.push({
          client_id: client.id,
          pickup_address: PICKUP_ADDRESSES[Math.floor(Math.random() * PICKUP_ADDRESSES.length)],
          delivery_address: DELIVERY_ADDRESSES[Math.floor(Math.random() * DELIVERY_ADDRESSES.length)],
          pickup_date: pickupDate.toISOString(),
          delivery_date: deliveryDate.toISOString(),
          status,
          price: Math.floor(Math.random() * 2000) + 200, // 200-2200€
          weight_kg: Math.floor(Math.random() * 500) + 10, // 10-510 kg
          volume_m3: Math.round((Math.random() * 10 + 0.5) * 10) / 10, // 0.5-10.5 m³
          notes: Math.random() > 0.7 ? "Fragile - Manipuler avec précaution" : null,
        });
      }
    }

    console.log(`Creating ${orders.length} orders...`);
    const { data: createdOrders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .insert(orders)
      .select();

    if (ordersError) {
      console.error("Error creating orders:", ordersError);
      throw ordersError;
    }

    console.log(`Created ${createdOrders?.length || 0} orders`);

    // Create deliveries for orders that are in_transit or delivered
    const deliveries = [];
    const eligibleOrders = createdOrders?.filter(o => ['in_transit', 'delivered', 'confirmed'].includes(o.status)) || [];

    for (const order of eligibleOrders) {
      if (!chauffeurId) continue;
      
      const scheduledDate = new Date(order.pickup_date);
      const isCompleted = order.status === 'delivered';
      
      deliveries.push({
        order_id: order.id,
        chauffeur_id: chauffeurId,
        scheduled_date: scheduledDate.toISOString().split('T')[0],
        start_time: '08:00',
        end_time: isCompleted ? '16:30' : null,
        distance_km: Math.floor(Math.random() * 200) + 20, // 20-220 km
        status: isCompleted ? 'completed' : (order.status === 'in_transit' ? 'in_progress' : 'assigned'),
        completed_at: isCompleted ? new Date().toISOString() : null,
        notes: Math.random() > 0.8 ? "Livraison effectuée sans problème" : null,
      });
    }

    console.log(`Creating ${deliveries.length} deliveries...`);
    const { data: createdDeliveries, error: deliveriesError } = await supabaseAdmin
      .from('deliveries')
      .insert(deliveries)
      .select();

    if (deliveriesError) {
      console.error("Error creating deliveries:", deliveriesError);
      throw deliveriesError;
    }

    console.log(`Created ${createdDeliveries?.length || 0} deliveries`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Demo data seeded successfully",
        stats: {
          clients: createdClients?.length || 0,
          orders: createdOrders?.length || 0,
          deliveries: createdDeliveries?.length || 0,
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in seed-demo-data function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
