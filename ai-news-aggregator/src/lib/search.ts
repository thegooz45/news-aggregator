import { supabase } from './supabase'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function getQueryEmbedding(query: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  })
  return res.data[0].embedding
}

// NEW: Pure filter
export function filterByTitle<T extends { title: string }>(
  articles: T[],
  query: string
): T[] {
  const q = query.toLowerCase()
  return articles.filter(a => a.title.toLowerCase().includes(q))
}

export async function searchArticles(
  query: string,
  embedding?: number[]
): Promise<any[]> {
  if (embedding) {
    const { data, error } = await supabase.rpc('match_articles', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 10,
    })
    if (error) throw error
    return data || []
  }

  const { data, error } = await supabase
    .from('articles')
    .select('*')
  if (error) throw error

  return filterByTitle(data || [], query).slice(0, 10)
}