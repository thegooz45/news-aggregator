// __tests__/ai.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { summarizeAndEmbed, extractKeywords } from '@/lib/ai'
import type { RawArticle } from '@/lib/news-fetcher'

// --- MOCK OPENAI CLASS DIRECTLY ---
import OpenAI from 'openai'

const mockChatCreate = vi.fn()
const mockEmbeddingsCreate = vi.fn()

// Spy on the OpenAI constructor and return our mock
vi.spyOn(OpenAI.prototype, 'chat', 'get').mockReturnValue({
  completions: { create: mockChatCreate }
} as any)

vi.spyOn(OpenAI.prototype, 'embeddings', 'get').mockReturnValue({
  create: mockEmbeddingsCreate
} as any)

// Mock the constructor to return the instance with mocked methods
const MockOpenAI = vi.spyOn(OpenAI, 'prototype', 'get').mockImplementation(() => ({
  chat: { completions: { create: mockChatCreate } },
  embeddings: { create: mockEmbeddingsCreate }
} as any))

// Ensure `new OpenAI()` returns the mocked instance
vi.mocked(OpenAI).mockImplementation(() => {
  return new (OpenAI as any)({ apiKey: 'fake' })
})

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
    process.env.OPENAI_API_KEY = 'fake-key'
  })

  afterEach(() => {
    delete process.env.OPENAI_API_KEY
  })

  it('summarizes article in 2-3 sentences and extracts 5 keywords', async () => {
    mockChatCreate.mockResolvedValueOnce({
      choices: [{
        message: {
          content: `xAI's Grok-4 outperforms GPT-5. It was trained on 100k H100s.\n\nKeywords: xAI, Grok-4, GPT-5, reasoning, H100`
        }
      }]
    })

    mockEmbeddingsCreate.mockResolvedValueOnce({
      data: [{ embedding: new Array(1536).fill(0.1) }]
    })

    const result = await summarizeAndEmbed(mockArticle)

    expect(mockChatCreate).toHaveBeenCalled()
    expect(mockEmbeddingsCreate).toHaveBeenCalled()
    expect(result.summary).toContain('Grok-4')
    expect(result.summary.split('. ').length).toBeGreaterThanOrEqual(2)
    expect(result.summary.split('. ').length).toBeLessThanOrEqual(3)
    expect(result.keywords).toEqual(['xAI', 'Grok-4', 'GPT-5', 'reasoning', 'H100'])
    expect(result.embedding).toHaveLength(1536)
  })

  it('handles OpenAI error gracefully', async () => {
    mockChatCreate.mockRejectedValueOnce(new Error('Rate limit'))

    await expect(summarizeAndEmbed(mockArticle)).rejects.toThrow('OpenAI summarization failed')
  })

  it('extracts keywords from text', () => {
    const text = 'Keywords: AI, ML, NLP, DL, NN'
    const keywords = extractKeywords(text)
    expect(keywords).toEqual(['AI', 'ML', 'NLP', 'DL', 'NN'])
  })
})