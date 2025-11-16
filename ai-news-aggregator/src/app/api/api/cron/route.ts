import { NextResponse } from 'next/server'
import { fetchFromNewsAPI } from '@/lib/news-fetcher'
import { summarizeAndEmbed } from '@/lib/ai'
import { upsertArticle } from '@/lib/db'

export async function GET() {
  try {
    const articles = await fetchFromNewsAPI()
    let success = 0

    for (const article of articles.slice(0, 10)) {
      try {
        const { summary, keywords, embedding } = await summarizeAndEmbed(article)
        await upsertArticle({
          url: article.url,
          title: article.title,
          summary,
          source: article.source,
          published_at: article.publishedAt,
          keywords,
          embedding,
        })
        success++
      } catch (err) {
        console.error(`Failed to process ${article.url}`, err)
      }
    }

    return NextResponse.json({ success, processed: articles.length })
  } catch (error) {
    return NextResponse.json(
      { error: 'Cron job failed' },
      { status: 500 }
    )
  }
}