import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

interface Article {
  title: string
  summary: string
  source: string
  url: string
  keywords: string[]
  similarity?: number
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl line-clamp-2">{article.title}</CardTitle>
          {article.similarity && (
            <Badge variant="secondary">
              {(article.similarity * 100).toFixed(0)}% match
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-600 line-clamp-3">{article.summary}</p>
        
        <div className="flex flex-wrap gap-1">
          {article.keywords.slice(0, 5).map((kw) => (
            <Badge key={kw} variant="outline" className="text-xs">
              {kw}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <SaveButton articleId={article.id} />
          <a href={article.url} target="_blank" className="text-blue-600 text-sm">
          Read full article →
         </a>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{article.source}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-600"
          >
            Read more <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  )
}