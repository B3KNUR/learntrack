import { supabase } from './supabaseClient'

export async function createCourse(courseData) {
  return supabase.from('courses').insert(courseData).select().single()
}

export async function updateCourse(courseId, courseData) {
  return supabase
    .from('courses')
    .update(courseData)
    .eq('id', courseId)
    .select()
    .single()
}

export async function deleteCourse(courseId) {
  return supabase.from('courses').delete().eq('id', courseId)
}

export async function createLesson(lessonData) {
  return supabase.from('lessons').insert(lessonData).select().single()
}

export async function updateLesson(lessonId, lessonData) {
  return supabase
    .from('lessons')
    .update(lessonData)
    .eq('id', lessonId)
    .select()
    .single()
}

export async function deleteLesson(lessonId) {
  return supabase.from('lessons').delete().eq('id', lessonId)
}
