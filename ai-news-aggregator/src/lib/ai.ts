// src/lib/ai.ts
import OpenAI from 'openai'
import type { RawArticle } from './news-fetcher'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true
})

export async function summarizeAndEmbed(article: RawArticle) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is required')
  }

  const prompt = `
Summarize this article in exactly 2-3 sentences. Then list exactly 5 keywords.

Title: ${article.title}
Content: ${article.content.slice(0, 6000)}
`.trim()

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    const text = completion.choices[0]?.message?.content || ''
    const [summary, keywordLine] = text.split('\n\n')
    const keywords = extractKeywords(keywordLine || '')

    const embeddingRes = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: `${article.title} ${summary}`,
    })

    return {
      summary: summary.trim(),
      keywords: keywords.slice(0, 5),
      embedding: embeddingRes.data[0].embedding,
    }
  } catch (error) {
    throw new Error(`OpenAI summarization failed: ${error instanceof Error ? error.message : 'Unknown'}`)
  }
}

export function extractKeywords(text: string): string[] {
  const match = text.match(/Keywords?:?\s*(.+)/i)
  if (!match) return []
  return match[1].split(',').map(k => k.trim()).filter(Boolean)
}