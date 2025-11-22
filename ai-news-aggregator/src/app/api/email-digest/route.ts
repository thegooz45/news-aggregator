// src/app/api/email-digest/route.ts
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET() {
  const { data: users } = await supabase.from('auth.users').select('id, email')

  for (const user of users || []) {
    const { data: saved } = await supabase
      .from('saved_articles')
      .select('articles(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!saved?.length) continue

    await resend.emails.send({
      from: 'AI Digest <digest@yourapp.com>',
      to: user.email!,
      subject: `Your Daily AI Digest – ${new Date().toLocaleDateString()}`,
      html: `
        <h1>Your Saved Articles</h1>
        ${saved.map(s => `<h2><a href="${s.articles.url}">${s.articles.title}</a></h2><p>${s.articles.summary}</p><hr>`).join('')}
      `,
    })
  }

  return Response.json({ sent: users?.length || 0 })
}