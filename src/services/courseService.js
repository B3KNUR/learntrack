import { supabase } from './supabaseClient'

export async function getCourses() {
  return supabase
    .from('courses')
    .select('id, title, description, level')
    .order('created_at', { ascending: true })
}

export async function getCourseById(courseId) {
  return supabase
    .from('courses')
    .select('id, title, description, level')
    .eq('id', courseId)
    .single()
}

export async function getLessonsByCourseId(courseId) {
  return supabase
    .from('lessons')
    .select('id, title, module_title, lesson_order, course_id')
    .eq('course_id', courseId)
    .order('lesson_order', { ascending: true })
}
