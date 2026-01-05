import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format } from "date-fns";

interface DashboardStats {
  totalOrders: number;
  deliveredOrders: number;
  inProgressOrders: number;
  totalRevenue: number;
  activeClients: number;
  totalDrivers: number;
  totalVehicles: number;
  availableVehicles: number;
  deliveryRate: number;
  // Changes vs last month
  ordersChange: number;
  revenueChange: number;
  newClientsThisMonth: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface MonthlyOrderStats {
  month: string;
  livrees: number;
  enCours: number;
  annulees: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  client_name: string;
  destination: string;
  date: string;
  status: string;
  amount: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async (): Promise<DashboardStats> => {
      const now = new Date();
      const startOfThisMonth = startOfMonth(now);
      const startOfLastMonth = startOfMonth(subMonths(now, 1));

      // Fetch all orders
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("id, status, price, created_at");

      if (ordersError) throw ordersError;

      // Fetch clients
      const { data: clients, error: clientsError } = await supabase
        .from("clients")
        .select("id, created_at");

      if (clientsError) throw clientsError;

      // Fetch profiles (drivers = chauffeurs)
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, role");

      if (profilesError) throw profilesError;

      // Fetch vehicles
      const { data: vehicles, error: vehiclesError } = await supabase
        .from("vehicles")
        .select("id, status");

      if (vehiclesError) throw vehiclesError;

      // Fetch deliveries for delivery rate
      const { data: deliveries, error: deliveriesError } = await supabase
        .from("deliveries")
        .select("id, status");

      if (deliveriesError) throw deliveriesError;

      // Calculate stats
      const totalOrders = orders?.length || 0;
      const deliveredOrders = orders?.filter(o => o.status === "delivered").length || 0;
      const inProgressOrders = orders?.filter(o => ["in_transit", "assigned", "pending"].includes(o.status)).length || 0;
      const totalRevenue = orders?.reduce((sum, o) => sum + (o.price || 0), 0) || 0;

      // Orders this month vs last month
      const ordersThisMonth = orders?.filter(o => new Date(o.created_at) >= startOfThisMonth).length || 0;
      const ordersLastMonth = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date >= startOfLastMonth && date < startOfThisMonth;
      }).length || 0;
      const ordersChange = ordersLastMonth > 0 ? Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100) : 0;

      // Revenue this month vs last month
      const revenueThisMonth = orders?.filter(o => new Date(o.created_at) >= startOfThisMonth)
        .reduce((sum, o) => sum + (o.price || 0), 0) || 0;
      const revenueLastMonth = orders?.filter(o => {
        const date = new Date(o.created_at);
        return date >= startOfLastMonth && date < startOfThisMonth;
      }).reduce((sum, o) => sum + (o.price || 0), 0) || 0;
      const revenueChange = revenueLastMonth > 0 ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100) : 0;

      // Clients
      const activeClients = clients?.length || 0;
      const newClientsThisMonth = clients?.filter(c => new Date(c.created_at) >= startOfThisMonth).length || 0;

      // Drivers
      const totalDrivers = profiles?.filter(p => p.role === "chauffeur").length || 0;

      // Vehicles
      const totalVehicles = vehicles?.length || 0;
      const availableVehicles = vehicles?.filter(v => v.status === "available").length || 0;

      // Delivery rate
      const completedDeliveries = deliveries?.filter(d => d.status === "completed").length || 0;
      const totalDeliveries = deliveries?.length || 0;
      const deliveryRate = totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 1000) / 10 : 0;

      return {
        totalOrders,
        deliveredOrders,
        inProgressOrders,
        totalRevenue,
        activeClients,
        totalDrivers,
        totalVehicles,
        availableVehicles,
        deliveryRate,
        ordersChange,
        revenueChange,
        newClientsThisMonth,
      };
    },
  });
}

export function useMonthlyRevenue() {
  return useQuery({
    queryKey: ["monthly-revenue"],
    queryFn: async (): Promise<MonthlyRevenue[]> => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("price, created_at")
        .gte("created_at", subMonths(new Date(), 12).toISOString());

      if (error) throw error;

      // Group by month
      const monthlyData: Record<string, number> = {};
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthKey = format(date, "yyyy-MM");
        const monthLabel = format(date, "MMM");
        monthlyData[monthKey] = 0;
        months.push({ key: monthKey, label: monthLabel });
      }

      orders?.forEach(order => {
        const monthKey = format(new Date(order.created_at), "yyyy-MM");
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey] += order.price || 0;
        }
      });

      return months.map(m => ({
        month: m.label,
        revenue: monthlyData[m.key],
      }));
    },
  });
}

export function useMonthlyOrderStats() {
  return useQuery({
    queryKey: ["monthly-order-stats"],
    queryFn: async (): Promise<MonthlyOrderStats[]> => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select("status, created_at")
        .gte("created_at", subMonths(new Date(), 6).toISOString());

      if (error) throw error;

      // Group by month
      const monthlyData: Record<string, { livrees: number; enCours: number; annulees: number }> = {};
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthKey = format(date, "yyyy-MM");
        const monthLabel = format(date, "MMM");
        monthlyData[monthKey] = { livrees: 0, enCours: 0, annulees: 0 };
        months.push({ key: monthKey, label: monthLabel });
      }

      orders?.forEach(order => {
        const monthKey = format(new Date(order.created_at), "yyyy-MM");
        if (monthlyData[monthKey]) {
          if (order.status === "delivered") {
            monthlyData[monthKey].livrees++;
          } else if (order.status === "cancelled") {
            monthlyData[monthKey].annulees++;
          } else {
            monthlyData[monthKey].enCours++;
          }
        }
      });

      return months.map(m => ({
        month: m.label,
        ...monthlyData[m.key],
      }));
    },
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ["recent-orders"],
    queryFn: async (): Promise<RecentOrder[]> => {
      const { data: orders, error } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          delivery_address,
          created_at,
          status,
          price,
          clients(company_name, contact_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      return (orders || []).map(order => ({
        id: order.id,
        order_number: order.order_number,
        client_name: order.clients?.company_name || order.clients?.contact_name || "Client inconnu",
        destination: order.delivery_address,
        date: format(new Date(order.created_at), "yyyy-MM-dd"),
        status: order.status,
        amount: order.price || 0,
      }));
    },
  });
}
