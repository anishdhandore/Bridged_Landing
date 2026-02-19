import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/** Rewrite localhost newsletter-image URLs to production so images display in emails (Gmail etc block data URIs) */
function rewriteImageUrlsForEmail(html: string): string {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://bridgedplatform.com').replace(/\/$/, '')
  return html.replace(
    /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api\/newsletter-images\/([a-zA-Z0-9_-]+)(\.(jpg|jpeg|png|gif|webp))?/gi,
    `${baseUrl}/api/newsletter-images/$3$4`
  )
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { subject, html, text, recipients } = body

    if (!subject || (!html && !text)) {
      return NextResponse.json(
        { error: 'Subject and content (html or text) are required' },
        { status: 400 }
      )
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const isSelective = Array.isArray(recipients) && recipients.length > 0

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: {
        unsubscribed_date: null,
        ...(isSelective ? { email: { in: recipients } } : {}),
      },
      select: { email: true },
    })

    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers to send to' },
        { status: 400 }
      )
    }

    if (isSelective) {
      const allowedEmails = new Set(subscribers.map((s) => s.email))
      const missing = recipients.filter((email: string) => !allowedEmails.has(email))
      if (missing.length > 0) {
        return NextResponse.json(
          {
            error: 'Some recipients are not valid subscribers',
            missing,
          },
          { status: 400 }
        )
      }
    }

    let content = html || (text ? `<pre style="white-space:pre-wrap;font-family:sans-serif;">${text}</pre>` : '')
    if (content && html) {
      content = rewriteImageUrlsForEmail(content)
    }
    const emails = subscribers.map((s) => s.email)
    const from = process.env.RESEND_FROM_NAME
      ? `${process.env.RESEND_FROM_NAME} <${fromEmail}>`
      : fromEmail

    // Send one email per recipient (so they don't see each other's addresses). Resend batch allows up to 100 per request.
    const BATCH_SIZE = 100
    let sent = 0
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE)
      const batchPayload = batch.map((to) => ({
        from,
        to: [to],
        subject,
        html: content,
      }))
      const { data, error } = await resend.batch.send(batchPayload)
      if (error) {
        console.error('Resend error:', error)
        return NextResponse.json(
          { error: 'Failed to send emails', details: error.message },
          { status: 500 }
        )
      }
      sent += batch.length
    }

    return NextResponse.json({
      success: true,
      sent,
      total: subscribers.length,
    })
  } catch (error: unknown) {
    console.error('Send newsletter error:', error)
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    )
  }
}
