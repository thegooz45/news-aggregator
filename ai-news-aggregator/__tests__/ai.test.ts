// __tests__/ai.test.ts
import { vi } from 'vitest'

// MOCK OPENAI FIRST — BEFORE ANY IMPORT
vi.mock('openai', async (importOriginal) => {
  const actual = await importOriginal<any>()

  const mockChatCreate = vi.fn()
  const mockEmbeddingsCreate = vi.fn()

  return {
    ...actual,
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: mockChatCreate,
        },
      },
      embeddings: {
        create: mockEmbeddingsCreate,
      },
    })),
  }
})

// NOW IMPORT AFTER MOCK
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { summarizeAndEmbed, extractKeywords } from '@/lib/ai'
import type { RawArticle } from '@/lib/news-fetcher'

describe('AI Module - TDD', () => {
  const mockArticle: RawArticle = {
    title: 'AI Breakthrough',
    content: 'Researchers at xAI developed Grok-4, surpassing GPT-5 in reasoning.',
    url: 'https://example.com/ai',
    publishedAt: '2025-11-11T10:00:00Z',
    source: 'xAI Blog'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.OPENAI_API_KEY = 'fake-key-123'
  })

  afterEach(() => {
    delete process.env.OPENAI_API_KEY
  })

  it('summarizes article in 2-3 sentences and extracts 5 keywords', async () => {
    const OpenAIApi = require('openai')
    const OpenAI = OpenAIApi.default
    const client = new OpenAI({ apiKey: 'fake'})

    client.chat.completions.create.arguments({
      choices: [{
        message: {
          content: `xAI's Grok-4 outperforms GPT-5. It was trained on 100k H100s.\n\nKeywords: xAI, Grok-4, GPT-5, reasoning, H100`
        }
      }]
    })

    client.embeddings.create.arguments({
      data: [{ embedding: new Array(1536).fill(0.1) }]
    })

    const result = await summarizeAndEmbed(mockArticle)

    expect(result.summary).toContain('Grok-4')
    expect(result.summary.split('. ').length).toBeGreaterThanOrEqual(2)
    expect(result.summary.split('. ').length).toBeLessThanOrEqual(3)
    expect(result.keywords).toEqual(['xAI', 'Grok-4', 'GPT-5', 'reasoning', 'H100'])
    expect(result.embedding).toHaveLength(1536)
  })

  it('handles OpenAI error gracefully', async () => {
    const OpenAIApi = require('openai')
    const OpenAI = OpenAIApi.default
    const client = new OpenAI({ apiKey: 'fake'})

    client.chat.completions.create.arguments(new Error('Rate limit'))

    await expect(summarizeAndEmbed(mockArticle)).rejects.toThrow('OpenAI summarization failed')
  })

  it('extracts keywords from text', () => {
    const text = 'Keywords: AI, ML, NLP, DL, NN'
    const keywords = extractKeywords(text)
    expect(keywords).toEqual(['AI', 'ML', 'NLP', 'DL', 'NN'])
  })
})