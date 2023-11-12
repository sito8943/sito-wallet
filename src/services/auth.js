import config from "../config";

import md5 from "md5";

// db
import supabase from "../db/connection";

export const validateUser = async () => {
  return await supabase.auth.getUser();
};

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns
 */
export const register = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password: md5(password),
  });
  return { data, error };
};

/**
 * Takes a user object and sends it to the backend to be authenticated
 * @param {string} user - the user name
 * @param {string} password - the user password
 * @returns The response from the server.
 */
export const login = async (user, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user,
    password: md5(password),
  });
  return { data, error };
};

/**
 *
 * @returns
 */
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return error;
};

/**
 * Sends a POST request to the API with the email address of the user who wants to reset their
 * password
 * @param {string} email - The email address of the user who wants to reset their password.
 * @returns The response from the server.
 */
export const passwordRecovery = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${config.thisUrl}reset-password`,
  });
  return { data, error };
};
