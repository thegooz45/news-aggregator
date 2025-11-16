import { describe, it, expect, vi, beforeEach } from 'vitest'
import { upsertArticle, getRecentArticles } from '@/lib/db'
import { supabase } from '@/lib/supabase'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}))

describe('DB Module - TDD', () => {
  const mockArticle = {
    url: 'https://example.com/ai',
    title: 'AI Breakthrough',
    summary: 'xAI launches Grok-4.',
    source: 'xAI Blog',
    published_at: '2025-11-15T10:00:00Z',
    keywords: ['xAI', 'Grok-4'],
    embedding: new Array(1536).fill(0.1),
  }

  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('upserts article with vector', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null })
    const mockFrom = vi.fn().mockReturnValue({ upsert: mockUpsert })
    ;(supabase.from as any).mockImplementation(() => mockFrom())

    await upsertArticle(mockArticle)

    expect(supabase.from).toHaveBeenCalledWith('articles')
    expect(mockUpsert).toHaveBeenCalledWith(mockArticle, { onConflict: 'url' })
  })

  it('gets recent articles', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: '1', title: 'Test' }],
      error: null,
    })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    ;(supabase.from as any).mockImplementation(() => mockFrom())

    const articles = await getRecentArticles()

    expect(supabase.from).toHaveBeenCalledWith('articles')
    expect(mockSelect).toHaveBeenCalledWith('*')
    expect(articles).toHaveLength(1)
  })

  it('handles upsert error', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: new Error('DB error') })
    const mockFrom = vi.fn().mockReturnValue({ upsert: mockUpsert })
    ;(supabase.from as any).mockImplementation(() => mockFrom())

    await expect(upsertArticle(mockArticle)).rejects.toThrow('Failed to upsert article')
  })
})