import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const supabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not set.");
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

export const client = supabaseClient();
