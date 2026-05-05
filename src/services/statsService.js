import { supabase } from './supabaseClient'

export async function getUserStats(userId) {
  const { count: enrolledCoursesCount, error: enrollmentError } = await supabase
    .from('enrollments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (enrollmentError) {
    return { data: null, error: enrollmentError }
  }

  const { count: completedLessonsCount, error: progressError } = await supabase
    .from('progress')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)

  if (progressError) {
    return { data: null, error: progressError }
  }

  return {
    data: {
      enrolledCoursesCount: enrolledCoursesCount ?? 0,
      completedLessonsCount: completedLessonsCount ?? 0,
    },
    error: null,
  }
}
