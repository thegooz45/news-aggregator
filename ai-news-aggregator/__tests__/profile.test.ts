// __tests__/profile.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveArticle, getSavedArticles, unsaveArticle } from '@/lib/profile'

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: { getUser: vi.fn() },
  },
}))

describe('Profile Module - TDD', () => {
  const mockUser = { id: 'user-123' }
  const mockArticle = { id: 1, title: 'Grok-4', url: 'https://x.ai' }

  beforeEach(() => {
    vi.resetAllMocks()
    ;(await import('@/lib/supabase')).supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  it('saves article for user', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert })
    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    await saveArticle(mockArticle.id)

    expect(mockFrom).toHaveBeenCalledWith('saved_articles')
    expect(mockInsert).toHaveBeenCalledWith({
      user_id: mockUser.id,
      article_id: mockArticle.id,
    })
  })

  it('gets saved articles with details', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ article_id: 1, articles: mockArticle }],
      error: null,
    })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    const saved = await getSavedArticles()

    expect(mockSelect).toHaveBeenCalledWith('article_id, articles(*)')
    expect(saved[0].articles.title).toBe('Grok-4')
  })

  it('unsaves article', async () => {
    const mockDelete = vi.fn().mockResolvedValue({ error: null })
    const mockEq = vi.fn().mockReturnValue({ delete: mockDelete })
    const mockFrom = vi.fn().mockReturnValue({ eq: mockEq })
    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    await unsaveArticle(mockArticle.id)

    expect(mockEq).toHaveBeenCalledWith('article_id', mockArticle.id)
    expect(mockDelete).toHaveBeenCalled()
  })
})