import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/newsletter/subscribe - Subscribe to newsletter waitlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Normalize email (lowercase, trim)
    const normalizedEmail = email.toLowerCase().trim()

    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    })

    if (existing) {
      // If already subscribed and not unsubscribed, return success
      if (!existing.unsubscribed_date) {
        return NextResponse.json(
          { message: 'Email already subscribed', email: normalizedEmail },
          { status: 200 }
        )
      }
      // If previously unsubscribed, resubscribe them
      await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: {
          subscribed_date: new Date(),
          unsubscribed_date: null,
        },
      })
      return NextResponse.json(
        { message: 'Successfully resubscribed', email: normalizedEmail },
        { status: 200 }
      )
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        subscribed_date: new Date(),
      },
    })

    return NextResponse.json(
      { message: 'Successfully subscribed to waitlist', email: subscriber.email },
      { status: 201 }
    )
  } catch (error: any) {
    // Log full error details for debugging (visible in Vercel logs)
    console.error('Error subscribing to newsletter:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack,
      name: error?.name,
    })
    
    // Handle unique constraint violation
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'This email is already subscribed' },
        { status: 409 }
      )
    }

    // Handle Prisma connection errors
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database')) {
      console.error('Database connection error:', error)
      return NextResponse.json(
        { error: 'Database connection failed. Please check your DATABASE_URL.' },
        { status: 500 }
      )
    }

    // Handle missing database table (table doesn't exist)
    if (error?.code === 'P2021' || error?.message?.includes('does not exist')) {
      console.error('Database table missing error:', error)
      return NextResponse.json(
        { error: 'Database not set up. Please run migrations.' },
        { status: 500 }
      )
    }

    // Provide more detailed error in development
    const errorMessage = process.env.NODE_ENV === 'development' 
      ? error?.message || 'Unknown error occurred'
      : 'Failed to subscribe. Please try again later.'

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

