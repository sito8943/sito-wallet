import { createClient } from "@supabase/supabase-js";

// config
import { config } from "../../config";

export const supabase = createClient(
  String(config.supabaseCo),
  String(config.supabaseKey)
);

