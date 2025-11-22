import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toggleSave, isArticleSaved } from '@/lib/saved'

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: { getUser: vi.fn() },
  },
}))

describe('Saved Articles - TDD', () => {
  const mockUser = { id: 'user-123' }

  beforeEach(async () => {
    vi.resetAllMocks()
    ;(await import('@/lib/supabase')).supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  it('toggles save on/off', async () => {
    const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null })
    const mockInsert = vi.fn().mockResolvedValue({ error: null })
    const mockDelete = vi.fn().mockResolvedValue({ error: null })

    const mockFrom = vi.fn()
      .mockReturnValueOnce({ select: mockSelect })     // check exists
      .mockReturnValueOnce({ insert: mockInsert })     // save
      .mockReturnValueOnce({ delete: mockDelete })     // unsave

    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    await toggleSave(999) // save
    await toggleSave(999) // unsave

    expect(mockInsert).toHaveBeenCalled()
    expect(mockDelete).toHaveBeenCalled()
  })

  it('checks if article is saved', async () => {
    const mockSelect = vi.fn().mockResolvedValue({
      data: [{ article_id: 999 }],
      error: null,
    })
    const mockFrom = vi.fn().mockReturnValue({ select: mockSelect })
    ;(await import('@/lib/supabase')).supabase.from.mockImplementation(mockFrom)

    const saved = await isArticleSaved(999)
    expect(saved).toBe(true)
  })
})