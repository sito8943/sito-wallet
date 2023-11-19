import supabase from "../db/connection";

export const fetchUserData = async (userId) =>
  await supabase.from("walletUser").select().eq("id", userId);

export const createWalletUser = async (userId) =>
  await supabase
    .from("walletUser")
    .insert({
      id: userId,
      photo: {},
      created_at: new Date().getTime(),
      cash: 0,
    });
