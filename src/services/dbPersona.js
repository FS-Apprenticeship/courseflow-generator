// This file contains functions to interact directly with the supabase tables for this project
// These functions are never used directly in .vue files
// Imported into useUserStore and useCourseStore to be used

export async function dbUploadPersona(supa, user_id, persona_name, age, reading_level, interests, learning_style) {
  const { data, error } = await supa
    .from('personas')
    .insert({ user_id: user_id, name: persona_name, age: age, readingLevel: reading_level, interests: interests, learningStyle: learning_style })
    .select()
  if (error) throw error;
  return data[0]
}

export async function dbGetPersonas(supa, user_id) {
  const { data, error } = await supa
    .from('personas')
    .select()
    .eq('user_id', user_id)
  if (error) throw error;
  return data;
}

export async function dbGetSpecificPersona(supa, user_id, persona_id) {
  const { data, error } = await supa
    .from('personas')
    .select()
    .eq('id', persona_id)
    .single()
  if (error) throw error
  return data;
}

export async function dbDeletePersona(supa, user_id, persona_id) {
  const { data, error } = await supa
    .from('personas')
    .delete()
    .eq('id', persona_id)
  if (error) throw error;
  return data;
}
