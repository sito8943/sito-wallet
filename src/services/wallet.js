import supabase from "../db/connection";

export const fetchFirstLog = async () =>
  await supabase
    .from("walletLogs")
    .select()
    .gte("initial", 1)
    .order("created_at");

export const fetchBills = async (date = undefined) => {
  const now = date ?? new Date();
  return await supabase
    .from("bills")
    .select()
    .eq("year", now.getFullYear())
    .eq("month", now.getMonth())
    .eq("day", now.getDate());
};

export const fetchDay = async (date = undefined) => {
  const now = date ?? new Date();
  return await supabase
    .from("walletLogs")
    .select()
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

export const initDay = async () => {
  const now = new Date();
  return await supabase.from("walletLogs").insert({
    created_at: now.getTime(),
    year: now.getFullYear(),
    month: now.getMonth(),
    day: now.getDate(),
    spent: 0,
    initial: 1,
  });
};
