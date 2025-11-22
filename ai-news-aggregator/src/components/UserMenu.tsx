'use client'

import { useUser, useSupabase } from '@supabase/auth-helpers-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { LogOut, User, Bookmark } from 'lucide-react'
import Link from 'next/link'

export function UserMenu() {
  const user = useUser()
  const supabase = useSupabase()

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost">Sign In</Button>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/saved" className="flex items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Saved Articles</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => supabase.auth.signOut()}
          className="text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}