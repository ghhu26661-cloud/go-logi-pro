import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type AppRole = "admin" | "manager" | "chauffeur" | "client";

export function useUserRole() {
  const { user } = useAuth();
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRole() {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching role:", error);
          setRole("client"); // Default to client if error
        } else {
          setRole((data?.role as AppRole) || "client");
        }
      } catch (err) {
        console.error("Error fetching role:", err);
        setRole("client");
      } finally {
        setLoading(false);
      }
    }

    fetchRole();
  }, [user]);

  const isAdmin = role === "admin";
  const isManager = role === "manager";
  const isChauffeur = role === "chauffeur";
  const isClient = role === "client";
  const isStaff = isAdmin || isManager;

  return {
    role,
    loading,
    isAdmin,
    isManager,
    isChauffeur,
    isClient,
    isStaff,
  };
}
