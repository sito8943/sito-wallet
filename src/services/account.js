import supabase from "../db/connection";

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
