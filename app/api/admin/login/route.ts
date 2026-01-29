import { NextRequest, NextResponse } from 'next/server'
import { createAdminToken, setAdminCookie, validateAdminCredentials } from '@/lib/admin-auth'

function stripWrappingQuotes(value: string): string {
  if (!value) return value
  const trimmed = value.trim()
  let unwrapped = trimmed
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    unwrapped = trimmed.slice(1, -1).trim()
  }
  // Normalize any repeated $ (dotenv expansion/escaping)
  return unwrapped.replace(/\$+/g, '$')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const adminEmail = stripWrappingQuotes(process.env.ADMIN_EMAIL || '').trim()
    const adminPasswordHash = stripWrappingQuotes(
      process.env.ADMIN_PASSWORD_HASH || ''
    )
    const adminPasswordPlain = stripWrappingQuotes(
      process.env.ADMIN_PASSWORD || ''
    )

    if (!adminEmail || (!adminPasswordHash && !adminPasswordPlain)) {
      const debug =
        process.env.NODE_ENV === 'development'
          ? {
              hasAdminEmail: Boolean(adminEmail),
              hasAdminPasswordHash: Boolean(adminPasswordHash),
              hasAdminPasswordPlain: Boolean(adminPasswordPlain),
            }
          : undefined
      return NextResponse.json(
        {
          error: 'Admin credentials are not configured on the server.',
          debug,
        },
        { status: 500 }
      )
    }

    if (adminPasswordHash && !adminPasswordHash.startsWith('$2')) {
      const debug =
        process.env.NODE_ENV === 'development'
          ? { hashStartsWith: adminPasswordHash.slice(0, 4) }
          : undefined
      return NextResponse.json(
        {
          error:
            'ADMIN_PASSWORD_HASH looks invalid. Wrap it in single quotes in .env.local and restart the server.',
          debug,
        },
        { status: 500 }
      )
    }

    if (!(await validateAdminCredentials(email, password))) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const token = await createAdminToken(email)
    await setAdminCookie(token)

    return NextResponse.json({ success: true, email })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
