// src/app/profile/page.tsx
'use client'

import { useUser } from '@supabase/auth-helpers-react'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Mail, Github } from 'lucide-react'

export default function Profile() {
  const user = useUser()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user.email}</h1>
              <p className="text-gray-600">Member since {new Date(user.created_at!).toLocaleDateString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
          <div className="space-y-2">
            {user.identities?.map((id) => (
              <div key={id.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {id.provider === 'github' ? <Github /> : <Mail />}
                  <span className="capitalize">{id.provider}</span>
                </div>
                <Button variant="ghost" size="sm">Revoke</Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}