import { supabase } from './supabaseClient'

export async function getUserEnrollments(userId) {
  const { data, error } = await supabase
    .from('enrollments')
    .select(
      `
        id,
        course_id,
        courses (
          id,
          title,
          description,
          level
        )
      `,
    )
    .eq('user_id', userId)

  if (error) {
    return { data: [], error }
  }

  const enrolledCourses = data.map((enrollment) => ({
    enrollmentId: enrollment.id,
    ...enrollment.courses,
  }))

  return { data: enrolledCourses, error: null }
}

export async function getEnrollment(userId, courseId) {
  return supabase
    .from('enrollments')
    .select('id, user_id, course_id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()
}

export async function enrollInCourse(userId, courseId) {
  const { data: existingEnrollment, error: existingError } =
    await getEnrollment(userId, courseId)

  if (existingError) {
    return { data: null, error: existingError }
  }

  if (existingEnrollment) {
    return { data: existingEnrollment, error: null }
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert({
      user_id: userId,
      course_id: courseId,
    })
    .select()
    .single()

  if (error && error.code === '23505') {
    return getEnrollment(userId, courseId)
  }

  return { data, error }
}

export async function unenrollFromCourse(userId, courseId) {
  return supabase
    .from('enrollments')
    .delete()
    .eq('user_id', userId)
    .eq('course_id', courseId)
}
