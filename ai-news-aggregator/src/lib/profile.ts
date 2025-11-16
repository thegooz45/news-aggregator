// src/lib/profile.ts
import { supabase } from './supabase'

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Not authenticated')
  return data.user
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
    .eq('user_id', user.id)
  if (error) throw error
  return data.map((row: any) => row.articles)
}

export async function unsaveArticle(articleId: number) {
  const user = await getCurrentUser()
  const { error } = await supabase
    .from('saved_articles')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .delete()
  if (error) throw error
}