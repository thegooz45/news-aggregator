// src/components/SaveButton.tsx
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toggleSave, isArticleSaved } from '@/lib/saved'
import { Button } from '@/components/ui/button'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface SaveButtonProps {
  articleId: number
  size?: 'sm' | 'default'
}

export function SaveButton({ articleId, size = 'default' }: SaveButtonProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: saved = false, isLoading } = useQuery({
    queryKey: ['saved', articleId],
    queryFn: () => isArticleSaved(articleId),
  })

  const mutation = useMutation({
    mutationFn: () => toggleSave(articleId),
    onSuccess: (status) => {
      queryClient.setQueryData(['saved', articleId], status === 'saved')
      toast({
        title: status === 'saved' ? 'Saved!' : 'Removed',
        description: status === 'saved' ? 'Article saved to your profile' : 'Removed from saved',
      })
    },
  })

  if (isLoading) return <Button variant="ghost" size={size} disabled><Bookmark className="h-4 w-4" /></Button>

  return (
    <Button
      variant={saved ? 'default' : 'outline'}
      size={size}
      onClick={() => mutation.mutate()}
      className="gap-2"
    >
      {saved ? (
        <>
          <BookmarkCheck className="h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Save
        </>
      )}
    </Button>
  )
}