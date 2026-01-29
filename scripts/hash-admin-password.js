/**
 * Generate a bcrypt hash for your admin password.
 * Run: node scripts/hash-admin-password.js "YourPassword"
 * Then set ADMIN_PASSWORD_HASH=<output> in .env.local and Vercel (remove ADMIN_PASSWORD).
 */
const { hashSync } = require('bcryptjs')
const password = process.argv[2]
if (!password) {
  console.error('Usage: node scripts/hash-admin-password.js "YourPassword"')
  process.exit(1)
}
const hash = hashSync(password, 10)
console.log(hash)
