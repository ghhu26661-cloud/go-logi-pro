import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DEMO_ACCOUNTS = [
  { email: "admin@logitrack.com", password: "demo123456", fullName: "Admin Demo", role: "admin" },
  { email: "manager@logitrack.com", password: "demo123456", fullName: "Manager Demo", role: "manager" },
  { email: "chauffeur@logitrack.com", password: "demo123456", fullName: "Chauffeur Demo", role: "chauffeur" },
  { email: "client@logitrack.com", password: "demo123456", fullName: "Client Demo", role: "client" },
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the seed token for security
    const { token } = await req.json();
    const expectedToken = Deno.env.get('DEMO_SEED_TOKEN');
    
    if (!expectedToken || token !== expectedToken) {
      console.error("Invalid or missing seed token");
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid token" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase admin client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const results: { email: string; success: boolean; message: string }[] = [];

    for (const account of DEMO_ACCOUNTS) {
      console.log(`Processing account: ${account.email}`);
      
      try {
        // Check if user already exists
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          console.error(`Error listing users: ${listError.message}`);
          throw listError;
        }

        const existingUser = existingUsers.users.find(u => u.email === account.email);

        if (existingUser) {
          console.log(`User ${account.email} already exists, updating role...`);
          
          // Update the role in user_roles table
          const { error: deleteRoleError } = await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', existingUser.id);
          
          if (deleteRoleError) {
            console.log(`No existing role to delete or error: ${deleteRoleError.message}`);
          }

          const { error: insertRoleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: existingUser.id, role: account.role });

          if (insertRoleError) {
            console.error(`Error setting role for ${account.email}: ${insertRoleError.message}`);
            results.push({ 
              email: account.email, 
              success: false, 
              message: `User exists but role update failed: ${insertRoleError.message}` 
            });
          } else {
            results.push({ 
              email: account.email, 
              success: true, 
              message: `User already exists, role updated to ${account.role}` 
            });
          }
          continue;
        }

        // Create new user
        console.log(`Creating new user: ${account.email}`);
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true, // Auto-confirm email
          user_metadata: {
            full_name: account.fullName,
            role: account.role,
          },
        });

        if (createError) {
          console.error(`Error creating user ${account.email}: ${createError.message}`);
          results.push({ 
            email: account.email, 
            success: false, 
            message: `Creation failed: ${createError.message}` 
          });
          continue;
        }

        console.log(`User ${account.email} created successfully with ID: ${newUser.user.id}`);

        // The trigger should handle profile and role creation, but let's ensure the role is correct
        // Wait a bit for the trigger to execute
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify and update role if needed
        const { data: existingRole } = await supabaseAdmin
          .from('user_roles')
          .select('role')
          .eq('user_id', newUser.user.id)
          .single();

        if (!existingRole || existingRole.role !== account.role) {
          // Delete any existing role and insert the correct one
          await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', newUser.user.id);

          const { error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({ user_id: newUser.user.id, role: account.role });

          if (roleError) {
            console.error(`Error setting role for ${account.email}: ${roleError.message}`);
          }
        }

        // Also update the profiles table
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: newUser.user.id,
            full_name: account.fullName,
            role: account.role,
          });

        if (profileError) {
          console.error(`Error updating profile for ${account.email}: ${profileError.message}`);
        }

        results.push({ 
          email: account.email, 
          success: true, 
          message: `Created successfully with role: ${account.role}` 
        });

      } catch (accountError: unknown) {
        const errorMessage = accountError instanceof Error ? accountError.message : String(accountError);
        console.error(`Error processing ${account.email}:`, accountError);
        results.push({ 
          email: account.email, 
          success: false, 
          message: `Error: ${errorMessage}` 
        });
      }
    }

    console.log("Seed completed. Results:", JSON.stringify(results));

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Demo accounts seeded",
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error in seed-demo-accounts function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
