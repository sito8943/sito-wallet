import supabase from "../db/connection";

export const fetchCurrentBills = async () => {
  const now = new Date();
  return await supabase
    .from("bills")
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

export const fetchCurrentDay = async () => {
  const now = new Date();
  return await supabase
    .from("walletLogs")
    .select()
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
