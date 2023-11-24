import supabase from "../db/connection";
import { v4 } from "uuid";

// auth utils
import { getUser } from "../utils/auth";

export const fetchAccounts = async (options) => {
  const query = supabase
    .from("walletAccounts")
    .select()
    .eq("owner", options.user || getUser().user.id);
  if (options.sort) query.order([...options.sort]);
  return await query;
};

export const createAccount = async (options) =>
  await supabase
    .from("walletAccounts")
    .insert({
      id: v4(),
      created_at: new Date().getTime(),
      owner: options.user || getUser().user.id,
      name: "Mi Cuenta",
      type: true,
      updated_at: new Date().getTime(),
    })
    .select();
