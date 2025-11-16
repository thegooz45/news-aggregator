// __tests__/search.test.ts
import { describe, it, expect, vi } from 'vitest'
import { searchArticles } from '@/lib/search'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}))

describe('Search Module - TDD', () => {
  const mockEmbedding = new Array(1536).fill(0.1)

  it('searches by keyword', async () => {
    const mockRpc = vi.fn().mockResolvedValue({
      data: [{ id: 1, title: 'Grok-4', similarity: 0.95 }],
      error: null,
    })
    ;(await import('@/lib/supabase')).supabase.rpc.mockImplementation(mockRpc)

    const results = await searchArticles('Grok', mockEmbedding)

    expect(mockRpc).toHaveBeenCalledWith('match_articles', {
      query_embedding: mockEmbedding,
      match_threshold: 0.7,
      match_count: 10,
    })
    expect(results[0].title).toBe('Grok-4')
  })

  it('falls back to keyword when no embedding', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockResolvedValue({
        data: [{ id: 2, title: 'xAI News' }],
        error: null,
      }),
    })
    const supabase = (await import('@/lib/supabase')).supabase
    supabase.from = mockFrom

    const results = await searchArticles('xAI')

    expect(mockFrom).toHaveBeenCalledWith('articles')
    expect(results[0].title).toBe('xAI News')
  })
})