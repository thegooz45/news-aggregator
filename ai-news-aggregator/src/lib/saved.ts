// src/lib/saved.ts
import { supabase } from './supabase'

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser()
  if (!data.user) throw new Error('Not authenticated')
  return data.user
}

export async function isArticleSaved(articleId: number): Promise<boolean> {
  const user = await getCurrentUser()
  const { data } = await supabase
    .from('saved_articles')
    .select('article_id')
    .eq('user_id', user.id)
    .eq('article_id', articleId)
    .limit(1)
  return data.length > 0
}

export async function toggleSave(articleId: number): Promise<'saved' | 'unsaved'> {
  const user = await getCurrentUser()
  const exists = await isArticleSaved(articleId)

  if (exists) {
    await supabase
      .from('saved_articles')
      .delete()
      .eq('user_id', user.id)
      .eq('article_id', articleId)
    return 'unsaved'
  } else {
    await supabase
      .from('saved_articles')
      .insert({ user_id: user.id, article_id: articleId })
    return 'saved'
  }
}