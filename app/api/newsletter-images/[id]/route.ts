import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const image = await prisma.newsletterImage.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    })

    if (!image) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return new NextResponse(image.data, {
      headers: {
        'Content-Type': image.mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (err) {
    console.error('Image serve error:', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
