import supabase from "../db/connection";
import { getUser } from "../utils/auth";

export const fetchFirstLog = async () =>
  await supabase
    .from("walletLogs")
    .select()
    .eq("owner", getUser().user.id)
    .gte("initial", 1)
    .order("created_at");

export const fetchBills = async (
  date = undefined,
  year = undefined,
  month = undefined,
  day = undefined
) => {
  const now = date ?? new Date();
  const query = supabase.from("bills").select().eq("owner", getUser().user.id);

  if (year !== null) query.eq("year", year ?? now.getFullYear());
  if (month !== null) query.eq("month", month ?? now.getMonth());
  if (day !== null) query.eq("day", day ?? now.getDate());

  return await query;
};

export const fetchLog = async (date = undefined) => {
  const now = date ?? new Date();
  return await supabase
    .from("walletLogs")
    .select()
    .eq("owner", getUser().user.id)
    .eq("year", now.getFullYear())
    .eq("month", now.getMonth())
    .eq("day", now.getDate());
};

export const addBill = async (bill) =>
  await supabase.from("bills").insert({ ...bill });

export const updateBill = async (bill) =>
  await supabase
    .from("bills")
    .update({ ...bill })
    .eq("id", bill.id);

export const updateLog = async (log, date = undefined) => {
  const now = date ?? new Date();
  return await supabase
    .from("walletLogs")
    .update({ ...log })
    .eq("year", now.getFullYear())
    .eq("month", now.getMonth())
    .eq("day", now.getDate());
};

export const initDay = async (
  initial = undefined,
  spent = undefined,
  date = undefined
) => {
  const now = date ?? new Date();

  return await supabase.from("walletLogs").insert({
    created_at: now.getTime(),
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    spent: spent ?? 0,
    initial: initial ?? 1,
  });
};

export const deleteBill = async (id) =>
  await supabase.from("bills").delete().eq("id", id);
