import { supabase } from './supabase'
import type { RawArticle } from './news-fetcher'

export type DBArticle = {
  url: string
  title: string
  summary: string
  source: string
  published_at: string
  keywords: string[]
  embedding: number[]
}

export async function upsertArticle(article: DBArticle): Promise<void> {
  const { error } = await supabase
    .from('articles')
    .upsert(article, { onConflict: 'url' })

  if (error) {
    throw new Error(`Failed to upsert article: ${error.message}`)
  }
}

export async function getRecentArticles(): Promise<any[]> {
  const { data, error } = await supabase
    .from('articles').select('*')

  if (error) throw error
  return data || []
}

export function applyRecentFilter<T extends { published_at: string }>(
  articles: T[],
  limit = 20
): T[] {
  return articles
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, limit)
}