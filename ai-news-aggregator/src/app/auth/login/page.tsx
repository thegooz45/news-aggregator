// src/app/(auth)/login/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Github, Mail } from 'lucide-react'

export default function Login() {
  const supabase = createClientComponentClient()

  const signIn = (provider: 'github' | 'google') => {
    supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>
        <p className="text-center text-gray-600">Sign in to save articles and personalize your feed</p>
        
        <div className="space-y-3">
          <Button onClick={() => signIn('github')} className="w-full" variant="outline">
            <Github className="mr-2 h-5 w-5" /> Continue with GitHub
          </Button>
          <Button onClick={() => signIn('google')} className="w-full" variant="outline">
            <Mail className="mr-2 h-5 w-5" /> Continue with Google
          </Button>
        </div>
      </Card>
    </div>
  )
}