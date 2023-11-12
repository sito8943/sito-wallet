import { createClient } from "@supabase/supabase-js";
import config from "../config";

const supabaseUrl = config.supabaseCO;
const supabaseKey = config.supabaseANON;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
