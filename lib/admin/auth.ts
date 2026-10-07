import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/** Verifies the Auth user on the server before any private read or mutation. */
export async function requireAdminUser() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/admin/login");
  }

  return { supabase, user: data.user };
}
