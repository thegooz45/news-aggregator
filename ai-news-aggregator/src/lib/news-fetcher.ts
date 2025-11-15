export type RawArticle = {
  title: string
  content: string
  url: string
  publishedAt: string
  source: string
}

const NEWSAPI_BASE = 'https://newsapi.org/v2/everything'

export async function fetchFromNewsAPI(): Promise<RawArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY
  if (!apiKey) {
    throw new Error('NEWSAPI_KEY is required in .env.local')
  }

  const url = `${NEWSAPI_BASE}?q=technology&language=en&pageSize=50&apiKey=${apiKey}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`NewsAPI request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (data.status !== 'ok') {
    throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`)
  }

  return data.articles.map(normalizeNewsAPI)
}

export function normalizeNewsAPI(article: any): RawArticle {
  return {
    title: article.title || 'No title',
    content: article.description || article.content || '',
    url: article.url || '',
    publishedAt: article.publishedAt || new Date().toISOString(),
    source: article.source?.name || 'Unknown'
  }
}