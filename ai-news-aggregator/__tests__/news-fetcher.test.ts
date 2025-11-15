import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchFromNewsAPI, normalizeNewsAPI, type RawArticle } from '@/lib/news-fetcher'

// Mock global fetch
const mockFetch = vi.spyOn(global, 'fetch')

// Save original env
const originalEnv = process.env

describe('News Fetcher - TDD', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    // Reset env and set fake key
    process.env = { ...originalEnv, NEWSAPI_KEY: 'fake-key-123' }
  })

  afterEach(() => {
    process.env = originalEnv // Restore
  })

  it('fetches articles from NewsAPI and normalizes them', async () => {
    const mockResponse = {
      status: 'ok',
      totalResults: 1,
      articles: [
        {
          source: { name: 'TechCrunch' },
          title: 'AI startup raises $100M',
          description: 'New AI model beats GPT-4...',
          url: 'https://techcrunch.com/ai-100m',
          publishedAt: '2025-11-11T10:00:00Z',
        }
      ]
    }

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response)

    const articles = await fetchFromNewsAPI()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('newsapi.org')
    )
    expect(articles).toHaveLength(1)
    expect(articles[0]).toMatchObject({
      title: 'AI startup raises $100M',
      content: 'New AI model beats GPT-4...',
      url: 'https://techcrunch.com/ai-100m',
      publishedAt: '2025-11-11T10:00:00Z',
      source: 'TechCrunch'
    })
  })

  it('throws error when API key missing', async () => {
    delete process.env.NEWSAPI_KEY
    await expect(fetchFromNewsAPI()).rejects.toThrow('NEWSAPI_KEY is required')
  })

  it('handles API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized'
    } as Response)

    await expect(fetchFromNewsAPI()).rejects.toThrow('NewsAPI request failed: 401 Unauthorized')
  })

  it('normalizes article with missing fields', () => {
    const raw = {
      title: 'Test',
      url: 'https://test.com',
      publishedAt: '2025-01-01T00:00:00Z',
      source: { name: 'Source' }
    }
    const result = normalizeNewsAPI(raw)
    expect(result.content).toBe('')
    expect(result.source).toBe('Source')
  })
})