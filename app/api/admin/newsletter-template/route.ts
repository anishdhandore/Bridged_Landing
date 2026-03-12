import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAdminSession } from '@/lib/admin-auth'
import type { NewsletterTemplateData } from '@/lib/newsletter-template'

const STATE_ID = 'default'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const state = await prisma.newsletterTemplateState.findUnique({
    where: { id: STATE_ID },
  })

  return NextResponse.json({
    template: (state?.data as NewsletterTemplateData) ?? null,
  })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as { data: NewsletterTemplateData }
    if (!body || !body.data) {
      return NextResponse.json(
        { error: 'Missing template data' },
        { status: 400 }
      )
    }

    await prisma.newsletterTemplateState.upsert({
      where: { id: STATE_ID },
      update: { data: body.data as unknown as object },
      create: {
        id: STATE_ID,
        data: body.data as unknown as object,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Save template error:', err)
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.newsletterTemplateState.delete({
      where: { id: STATE_ID },
    })
  } catch {
    // ignore if not found
  }

  return NextResponse.json({ success: true })
}

