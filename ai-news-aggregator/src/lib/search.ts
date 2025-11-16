// src/lib/search.ts
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

export async function searchArticles(
  query: string,
  embedding?: number[]
): Promise<any[]> {
  // Vector search
  if (embedding) {
    const { data, error } = await supabase.rpc('match_articles', {
      query_embedding: embedding,
      match_threshold: 0.7,
      match_count: 10,
    })
    if (error) throw error
    return data || []
  }

  // Fallback: keyword search
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .ilike('title', `%${query}%`)
    .limit(10)

  if (error) throw error
  return data || []
}