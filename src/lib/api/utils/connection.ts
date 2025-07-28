import { createClient } from "@supabase/supabase-js";
import { config } from "../../../config";
import { Database } from "./schema";

const supabaseUrl = config.supabaseCo;
const supabaseKey = config.supabaseAnon;
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export default supabase;
