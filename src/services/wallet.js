import supabase from "../db/connection";

// auth utils
import { getUser } from "../utils/auth";

export const fetchFirstLog = async (account) =>
  await supabase
    .from("walletLogs")
    .select()
    .eq("owner", getUser().user.id)
    .eq("account", account)
    .eq("month", new Date().getMonth())
    .gte("initial", 1)
    .order("created_at");

export const fetchBills = async (options) => {
  const now = options.date ?? new Date();
  const query = supabase
    .from("bills")
    .select("*, walletBalances(*)")
    .eq("owner", getUser().user.id);
  if (options.account) query.eq("account", options.account);
  if (options.year !== null)
    query.eq("year", options.year ?? now.getFullYear());
  if (options.month !== null)
    query.eq("month", options.month ?? now.getMonth());
  if (options.day !== null) query.eq("day", options.day ?? now.getDate());

  return await query;
};

export const fetchLog = async (options) => {
  const now = options.date ?? new Date();
  const query = supabase
    .from("walletLogs")
    .select()
    .eq("owner", getUser().user.id);
  if (options.account) query.eq("account", options.account);
  if (options.year !== null)
    query.eq("year", options.year ?? now.getFullYear());
  if (options.month !== null)
    query.eq("month", options.month ?? now.getMonth());
  if (options.day !== null) query.eq("day", options.day ?? now.getDate());

  return await query;
};

export const fetchBalances = async (id = undefined) => {
  const query = supabase
    .from("walletBalances")
    .select()
    .eq("owner", getUser().user.id);

  if (id) query.eq("id", id);
  return await query;
};

export const addBill = async (bill) =>
  await supabase
    .from("bills")
    .insert({ ...bill })
    .select("*,walletBalances(*)");

export const addBalance = async (balance) =>
  await supabase
    .from("walletBalances")
    .insert({ ...balance })
    .select();

export const addLog = async (log) =>
  await supabase
    .from("walletLogs")
    .insert({ ...log })
    .select();

export const updateBill = async (bill) =>
  await supabase
    .from("bills")
    .update({ ...bill })
    .eq("id", bill.id)
    .select("*, walletBalances(*)");

export const updateBalance = async (balance) =>
  await supabase
    .from("walletBalances")
    .update({ ...balance })
    .eq("id", balance.id)
    .select();

export const updateLog = async (log, date = undefined) => {
  const now = date ?? new Date();
  return await supabase
    .from("walletLogs")
    .update({ ...log })
    .eq("owner", getUser().user.id)
    .eq("year", now.getFullYear())
    .eq("month", now.getMonth())
    .eq("day", now.getDate());
};

export const initDay = async (
  account,
  initial = undefined,
  date = undefined
) => {
  const now = date ?? new Date();

  return await supabase.from("walletLogs").insert({
    created_at: now.getTime(),
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    initial: initial ?? 1,
    account,
  });
};

export const deleteBill = async (id) =>
  await supabase.from("bills").delete().eq("id", id);

export const deleteBalance = async (id) =>
  await supabase.from("walletBalance").delete().eq("id", id);
