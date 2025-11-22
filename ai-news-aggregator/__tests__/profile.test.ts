import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveArticle, getSavedArticles, unsaveArticle, filterByUserId } from '@/lib/profile'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: { getUser: vi.fn() },
  },
}))

describe('Profile Module - TDD', () => {
  const mockUser = { id: 'user-123' }
  const mockArticle = { id: 1, title: 'Grok-4', url: 'https://x.ai' }

  beforeEach(async () => {
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

    expect(mockInsert).toHaveBeenCalledWith({
      user_id: mockUser.id,
      article_id: mockArticle.id,
    })
  })

  it('gets saved articles with details', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [
        { article_id: 1, articles: mockArticle, user_id: mockUser.id },
        { article_id: 2, articles: { title: 'Other' }, user_id: 'other' },
      ],
      error: null,
    })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    const saved = await getSavedArticles()

    expect(saved).toHaveLength(1)
    expect(saved[0].title).toBe('Grok-4')
  })

  it('unsaves article', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ id: 99, article_id: 1, user_id: mockUser.id }],
      error: null,
    })
    const mockDelete = vi.fn().mockResolvedValue({ error: null })
    const mockIn = vi.fn().mockReturnValue({ delete: mockDelete })
    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockSelect })
      .mockReturnValueOnce({ in: mockIn })

    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    await unsaveArticle(mockArticle.id)

    expect(mockIn).toHaveBeenCalledWith('id', [99])
    expect(mockDelete).toHaveBeenCalled()
  })

  it('filters by user id', () => {
    const rows = [
      { user_id: 'user-123', value: 'mine' },
      { user_id: 'other', value: 'not' },
    ]
    expect(filterByUserId(rows, 'user-123')).toEqual([{ user_id: 'user-123', value: 'mine' }])
  })
})