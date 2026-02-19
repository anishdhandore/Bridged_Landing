# Testing Newsletter Images

This branch is for testing newsletter image display in emails.

## How to test via Vercel preview

1. **Push this branch** to trigger a Vercel preview deployment:
   ```bash
   git add -A
   git commit -m "Test newsletter images via preview deployment"
   git push -u origin test/newsletter-images
   ```

2. **Get the preview URL** from your Vercel dashboard (or the deployment link in your PR). It will look like:
   `https://bridged-landing-xxxx.vercel.app`

3. **Use the preview URL** (not localhost):
   - Open `https://bridged-landing-xxxx.vercel.app/admin`
   - Log in
   - Upload images (they'll use the preview URL, which is public)
   - Send a test newsletter to yourself

4. **Check your email** — images should display because the preview URL is publicly accessible.

## Vercel environment variables

Make sure these are set in your Vercel project (Settings → Environment Variables):

- `DATABASE_URL`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_FROM_NAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `NEXT_PUBLIC_APP_URL` (optional for preview; use `https://bridgedplatform.com` for production)

## After testing

If images work in the preview email, merge to `main` and deploy to production. Production will use `https://bridgedplatform.com` for image URLs.
