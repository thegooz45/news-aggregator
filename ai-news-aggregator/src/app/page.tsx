// src/app/page.tsx
'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchBar } from '@/components/SearchBar'
import { ArticleCard } from '@/components/ArticleCard'
import { searchArticles, getQueryEmbedding } from '@/lib/search'
import { Skeleton } from '@/components/ui/skeleton'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (!query.trim()) return []
      const embedding = await getQueryEmbedding(query)
      return searchArticles(query, embedding)
    },
    enabled: !!query,
  })

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">AI News Digest</h1>
        
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search AI, Grok, xAI..."
        />

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))
          ) : data?.length ? (
            data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : query ? (
            <p className="text-center text-gray-500">No results found.</p>
          ) : (
            <p className="text-center text-gray-500">Start typing to search.</p>
          )}
        </div>
      </div>
    </main>
  )
}