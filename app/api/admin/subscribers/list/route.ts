import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('query') || '').trim()
  if (!query) {
    return NextResponse.json({ results: [] })
  }

  const rawResults = await prisma.newsletterSubscriber.findMany({
    where: {
      unsubscribed_date: null,
      email: {
        contains: query,
        mode: 'insensitive',
      },
    },
    select: { email: true },
    take: 20,
  })

  const results = rawResults
    .map((r) => r.email)
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(query.toLowerCase())
      const bStarts = b.toLowerCase().startsWith(query.toLowerCase())
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return a.localeCompare(b)
    })

  return NextResponse.json({ results })
}
