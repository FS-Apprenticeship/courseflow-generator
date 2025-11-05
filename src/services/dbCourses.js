// This file contains functions to interact directly with the supabase tables for this project
// These functions are never used directly in .vue files
// Imported into useUserStore and useCourseStore to be used

export async function dbUploadCourses(supa, user_id, goal, duration, total_hours) {
  const { data, error } = await supa
    .from('courses')
    .insert({ user_id: user_id, goal: goal, duration: duration, total_hours: total_hours })
    .select()
  if (error) throw error;
  return data[0]
}

// not sure where im using this
// TODO check if needed
export async function dbGetCourses(supa) {
  const { data, error } = await supa
    .from('courses')
    .select()
  if (error) throw error;
  return data;
}
