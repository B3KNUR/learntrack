import { supabase } from './supabaseClient'

export async function getLessonById(lessonId) {
  return supabase
    .from('lessons')
    .select(
      'id, course_id, module_title, title, description, video_url, practice_instructions, lesson_order',
    )
    .eq('id', lessonId)
    .single()
}

export async function getCompletedLessons(userId) {
  return supabase
    .from('progress')
    .select('id, user_id, lesson_id, completed')
    .eq('user_id', userId)
    .eq('completed', true)
}

export async function isLessonCompleted(userId, lessonId) {
  const { data, error } = await supabase
    .from('progress')
    .select('id, user_id, lesson_id, completed')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .eq('completed', true)
    .maybeSingle()

  return { data: Boolean(data), error }
}

export async function markLessonCompleted(userId, lessonId) {
  return supabase
    .from('progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        completed: true,
      },
      { onConflict: 'user_id,lesson_id' },
    )
    .select()
    .single()
}

export async function unmarkLessonCompleted(userId, lessonId) {
  return supabase
    .from('progress')
    .delete()
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
}

export async function getCourseProgress(userId, courseId) {
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  if (lessonsError) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      percentage: 0,
      error: lessonsError,
    }
  }

  const totalLessons = lessons.length

  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      percentage: 0,
      error: null,
    }
  }

  const lessonIds = lessons.map((lesson) => lesson.id)

  const { data: completedRows, error: completedError } = await supabase
    .from('progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('completed', true)
    .in('lesson_id', lessonIds)

  if (completedError) {
    return {
      totalLessons,
      completedLessons: 0,
      percentage: 0,
      error: completedError,
    }
  }

  const completedLessonIds = new Set(
    completedRows.map((progress) => progress.lesson_id),
  )
  const completedLessons = completedLessonIds.size
  const percentage = Math.round((completedLessons / totalLessons) * 100)

  return {
    totalLessons,
    completedLessons,
    percentage,
    error: null,
  }
}
