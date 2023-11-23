import supabase from "../db/connection";

export const fetchUserData = async (userId) =>
  await supabase.from("settingUser").select().eq("id", userId);

export const createSettingsUser = async (userId) =>
  await supabase.from("settingUser").insert({
    id: userId,
    photo: {},
    created_at: new Date().getTime(),
  });
