import { supabase } from './supabase'

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user
}

// NEW: Pure filter
export function filterByUserId<T extends { user_id: string }>(
  rows: T[],
  userId: string
): T[] {
  return rows.filter(row => row.user_id === userId)
}

export async function saveArticle(articleId: number) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('saved_articles')
    .insert({ user_id: user.id, article_id: articleId })
  if (error) throw error
}

export async function getSavedArticles() {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('saved_articles')
    .select('article_id, articles(*)')
  if (error) throw error
  return filterByUserId(data || [], user.id).map((row: any) => row.articles)
}

export async function unsaveArticle(articleId: number) {
  const user = await getCurrentUser()
  const { data, error } = await supabase
    .from('saved_articles')
    .select('id')
  if (error) throw error

  const toDelete = filterByUserId(data || [], user.id)
    .filter(row => row.article_id === articleId)
    .map(row => row.id)

  if (toDelete.length === 0) return

  const { error: delError } = await supabase
    .from('saved_articles')
    .delete()
    .in('id', toDelete)
  if (delError) throw delError
}