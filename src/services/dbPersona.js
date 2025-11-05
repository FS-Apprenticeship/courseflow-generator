// This file contains functions to interact directly with the supabase tables for this project
// These functions are never used directly in .vue files
// Imported into useUserStore and useCourseStore to be used

export async function dbUploadPersona(supa, user_id, persona_name, age, reading_level, interests, learning_style) {
  const { data, error } = await supa
    .from('personas')
    .insert({ user_id: user_id, persona_name: persona_name, age: age, reading_level: reading_level, interests: interests, learning_style: learning_style })
    .select()
  if (error) throw error;
  return data[0]
}

export async function dbGetPersonas(supa) {
  const { data, error } = await supa
    .from('personas')
    .select()
  if (error) throw error;
  return data;
}
