import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { compare } from 'bcryptjs'

const COOKIE_NAME = 'admin_session'
const DEFAULT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || 'change-me-in-production'
)

export async function createAdminToken(email: string): Promise<string> {
  const secret = process.env.ADMIN_SECRET
    ? new TextEncoder().encode(process.env.ADMIN_SECRET)
    : DEFAULT_SECRET
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyAdminToken(token: string): Promise<{ email: string } | null> {
  try {
    const secret = process.env.ADMIN_SECRET
      ? new TextEncoder().encode(process.env.ADMIN_SECRET)
      : DEFAULT_SECRET
    const { payload } = await jwtVerify(token, secret)
    if (payload.email && typeof payload.email === 'string') {
      return { email: payload.email }
    }
    return null
  } catch {
    return null
  }
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24h
    path: '/',
  })
}

export async function clearAdminCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Validates admin credentials.
 * Supports two modes:
 * 1. ADMIN_PASSWORD_HASH (recommended): store a bcrypt hash. In .env use single quotes so $ isn't expanded: ADMIN_PASSWORD_HASH='$2b$10$...'
 * 2. ADMIN_PASSWORD (legacy): plain text - avoid in production if env could be exposed
 */
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

export async function validateAdminCredentials(
  email: string,
  password: string
): Promise<boolean> {
  const adminEmail = stripWrappingQuotes(process.env.ADMIN_EMAIL || '')
    .trim()
    .toLowerCase()
  const adminPasswordHash = stripWrappingQuotes(
    process.env.ADMIN_PASSWORD_HASH || ''
  )
  const adminPasswordPlain = stripWrappingQuotes(
    process.env.ADMIN_PASSWORD || ''
  )

  if (!adminEmail) return false

  const emailMatch = email.trim().toLowerCase() === adminEmail

  if (adminPasswordHash && adminPasswordHash.startsWith('$2')) {
    return emailMatch && (await compare(password, adminPasswordHash))
  }
  if (adminPasswordPlain) {
    return emailMatch && password === adminPasswordPlain.trim()
  }
  return false
}
