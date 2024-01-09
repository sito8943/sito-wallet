import supabase from "../db/connection";

// auth utils
import { getUser } from "../utils/auth";

export const fetchYears = async () =>
  await supabase
    .from("walletLogs")
    .select("year")
    .eq("owner", getUser().user.id);
