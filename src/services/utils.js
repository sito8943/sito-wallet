import supabase from "../db/connection";

// auth utils
import { getUser } from "../utils/auth";

export const fetchYears = async () =>
  await supabase
    .from("walletLogs")
    .select("year")
    .eq("owner", getUser().user.id);

export const fetchSpentByMonthNdYear = async () =>
  await supabase.rpc("get_total_spent_by_month_year");

export const fetchLogs = async () =>
  await supabase
    .from("bills")
    .select("*, walletBalances(*)")
    .eq("owner", getUser().user.id);
