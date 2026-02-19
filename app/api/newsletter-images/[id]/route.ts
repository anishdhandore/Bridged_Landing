import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    let { id } = await params
    id = id.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
    if (!id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const image = await prisma.newsletterImage.findUnique({
      where: { id },
      select: { data: true, mimeType: true },
    })

    if (!image) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const data = Buffer.isBuffer(image.data) ? image.data : Buffer.from(image.data as ArrayBuffer)
    return new NextResponse(data, {
      headers: {
        'Content-Type': image.mimeType,
        'Content-Length': String(data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Accept-Ranges': 'bytes',
      },
    })
  } catch (err) {
    console.error('Image serve error:', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
