import supabase from "../db/connection";

export const fetchUserData = async (userId) =>
  await supabase.from("settingsUser").select().eq("id", userId);

export const createSettingsUser = async (userId) =>
  await supabase
    .from("settingsUser")
    .insert({
      id: userId,
      photo: {},
      created_at: new Date().getTime(),
      cash: 0,
    });
