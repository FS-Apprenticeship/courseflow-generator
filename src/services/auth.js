// This file handles creating and exporting the supabase-js client used throughout the rest of the project
// It also contains functions used to sign in/up/out.
// These functions are imported into useUserStore and useChallengeStore, not used directly in .vue files

import { createClient } from "@supabase/supabase-js";

export function syncStoreUsers(userStore, courseStore) {
  // courseStore.user.user_id = userStore.user?.id || null;
  courseStore.user = userStore.user;
}

function getClient() {
  const url = import.meta.env.VITE_APP_SUPABASE_URL;
  const key = import.meta.env.VITE_APP_SUPABASE_KEY;

  const supabase = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return supabase;
}

export const supa = getClient();

export async function dbSignUp(client, email, password) {
  const { data, error } = await client.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function dbSignIn(client, email, password) {
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function dbSignOut(client) {
  const { error } = await client.auth.signOut();
  if (error) {
    throw error;
  }
  return true;
}
