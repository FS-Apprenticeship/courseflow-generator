// This file contains functions to interact directly with the supabase tables for this project
// These functions are never used directly in .vue files
// Imported into useUserStore and useCourseStore to be used

export async function dbUploadCourses(supa, user_id, course) {
  const { data, error } = await supa
    .from('courses')
    .insert({ user_id: user_id, course_data: course })
    .select()
  if (error) throw error;
  return data[0]
}

export async function dbGetCourses(supa, user_id) {
  const { data, error } = await supa
    .from('courses')
    .select()
    .eq('user_id', user_id)
  if (error) throw error;
  return data;
}

export async function dbUpdateCourse(supa, course_id, course) {
  const { data, error } = await supa
    .from('courses')
    .update({ course_data: course })
    .eq('id', course_id)
    .select()
  if (error) throw error;
  return data;
}

export async function dbDeleteCourse(supa, course_id) {
  const { data, error } = await supa
    .from('courses')
    .delete()
    .eq('id', course_id)
    .select()
  if (error) throw error
  return data;
}
