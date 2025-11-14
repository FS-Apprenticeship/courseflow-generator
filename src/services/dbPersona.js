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

// Function to check if ANY personas exist
// If none exist, upload default profile
// Otherwise return
export async function dbDefaultProfile(supa, user_id) {
  const data = await dbGetPersonas(supa, user_id);

  if (data.length == 0) {
    console.log("Creating default persona");
    const { error } = await dbUploadPersona(supa, user_id, "Default Persona", "18", "High School", [], "Conceptual");
    if (error) throw error;
  }
}
