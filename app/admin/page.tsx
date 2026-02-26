'use client'

import React, { useMemo, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send, LogOut, Users, Loader2, Eye, EyeOff, Search, X, Upload } from 'lucide-react'
import { toast } from 'sonner'
import { buildNewsletterHtml, type NewsletterTemplateData } from '@/lib/newsletter-template'

export default function AdminPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null)
  const [subject, setSubject] = useState('')
  const [templateData, setTemplateData] = useState<NewsletterTemplateData>({
    welcomeLine: 'Welcome to the',
    mainTitle: 'BRIDGED INSIDER',
    heroImageUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=600&auto=format&fit=crop',
    year: new Date().getFullYear().toString(),
    welcomeBadgeText: 'WELCOME',
    headline: 'THE END OF ONE-OFF NIL.',
    subheadline: 'BEGINNING OF CAREER PIPELINES.',
    introCopy: "NIL opened the door. But it didn't build a pathway.",
    athletesLabel: 'Athletes,',
    athletesCopy: "You practice for hours.\nYou study film.\nYou show up disciplined every day. But when it comes to your career? There's no structured system helping you prepare.",
    companiesLabel: 'Companies,',
    companiesCopy: "You're looking for motivated, coachable, high-performance talent.\nThey're already building the discipline your company hires for.\nWhat if athletes didn't just promote your brand but worked inside it?",
    heroTagline: 'All managed and handled by one platform!',
    whatIsBridgedTitle: 'WHAT IS BRIDGED?',
    whatIsBridgedSubtitle: "YOU'RE EARLY. THAT MATTERS.",
    whatIsBridgedP1: 'Get ready to turn NIL-style marketing budgets into structured, paid internships for student-athletes.',
    whatIsBridgedP2: 'Instead of one-time posts, companies invest in guided, project-based work that builds real experience. Where we manage the vetting, structure, deliverables, and reporting ensuring measurable value on both sides.',
    whatIsBridgedP3: 'Athletes gain resume-ready experience. Companies build a disciplined, high-performance talent pipeline.',
    founderSectionTitle: 'BUILT BY STUDENT ATHLETES.',
    founderImageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop',
    founderName: 'CO-Founder Natalia Bowles',
    founderQuote: "As a college athlete, I saw teammates struggle after their playing days ended. We give our all to the game, but no one prepares us for what's next. Every athlete deserves more than a season, they deserve a future. That's why we created a platform connecting athletes to opportunities, mentorship, and purpose beyond the field.",
    lookoutTitle: 'BE ON THE LOOKOUT FOR …',
    interestedCardUrl: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?q=80&w=600&auto=format&fit=crop',
    whatsComingTitle: "WHAT'S COMING\nBEFORE LAUNCH.",
    whatsComingIntro: "Over the next few weeks, we'll be sharing:",
    whatsComingBullets: 'Athlete spotlight features\nBrand onboarding updates\nEarly internship pilot opportunities\nFounding member access\nMasterclass guest appearances\nLaunch date announcement',
    whatsComingClosing: "We are building this intentionally.\nAnd we're building it for longevity.",
    partnershipTitle: 'PARTNERSHIP SPOTLIGHTS',
    partnershipSubtitle: "WE'RE PROUD TO BEGIN ONBOARDING EARLY PARTNERS WHO BELIEVE IN THE FUTURE OF ATHLETE-DRIVEN TALENT.",
    partner1Name: 'ZENITH PREP ACADEMY',
    partner1Founder: 'FOUNDER DOMINIC HUERTA',
    partner1Copy: 'Zenith Prep Academy has been ranked multiple times as the #1 College Consulting & Education Company in America. Through this partnership, Bridged expands its pipeline to academically driven, career-focused students early in their journey.',
    partner1LogoUrl: '/zenith.png',
    partner2Name: 'REGGIE STEPHENS',
    partner2Founder: 'FOUNDER REGGIE STEPHENS X NFL',
    partner2Copy: 'Founded by former NFL player Reggie Stephens, the Reggie Stephens Foundation empowers youth through sports, education, mentorship, and community programming — aligning directly with Bridged\'s mission to prepare the next generation for long-term career success.',
    partner2LogoUrl: '/reggie-logo.png',
    footerHandle: '@bridgedplatform',
    contactEmail: 'nbowles@bridged.agency',
    websiteUrl: 'www.bridgedplatform.com',
  })
  const [sending, setSending] = useState(false)
  const [sendMode, setSendMode] = useState<'all' | 'selected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [searching, setSearching] = useState(false)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  const handleImageUpload = async (field: keyof NewsletterTemplateData, file: File) => {
    setUploadingField(field)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.details ?? data.error ?? 'Upload failed')
      setTemplateData((prev) => ({ ...prev, [field]: data.url }))
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploadingField(null)
    }
  }

  useEffect(() => {
    fetch('/api/admin/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json()
        throw new Error('Not authenticated')
      })
      .then((data) => {
        setAuthenticated(data.authenticated)
        setAdminEmail(data.email ?? null)
      })
      .catch(() => setAuthenticated(false))
      .finally(() => setCheckingAuth(false))
  }, [])

  useEffect(() => {
    if (!authenticated) return
    fetch('/api/admin/subscribers', { credentials: 'include' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('Failed')))
      .then((data) => setSubscriberCount(data.count))
      .catch(() => setSubscriberCount(null))
  }, [authenticated])

  useEffect(() => {
    if (!authenticated || sendMode !== 'selected') return
    const query = searchQuery.trim()
    if (!query) {
      setSearchResults([])
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      setSearching(true)
      fetch(`/api/admin/subscribers/list?query=${encodeURIComponent(query)}`, {
        credentials: 'include',
        signal: controller.signal,
      })
        .then((res) => res.ok ? res.json() : Promise.reject(new Error('Failed')))
        .then((data) => {
          const results = Array.isArray(data.results) ? data.results : []
          setSearchResults(results.filter((email: string) => !selectedRecipients.includes(email)))
        })
        .catch(() => setSearchResults([]))
        .finally(() => setSearching(false))
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [authenticated, sendMode, searchQuery, selectedRecipients])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Invalid email or password')
        return
      }
      setAuthenticated(true)
      setAdminEmail(data.email)
      setEmail('')
      setPassword('')
      toast.success('Welcome back!')
    } catch {
      toast.error('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setAuthenticated(false)
    setAdminEmail(null)
    setSubscriberCount(null)
    toast.success('Logged out')
  }

  const newsletterHtml = useMemo(() => {
    return buildNewsletterHtml(templateData)
  }, [templateData])

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim()) {
      toast.error('Subject is required')
      return
    }
    if (!templateData.heroImageUrl.trim() || !templateData.headline.trim()) {
      toast.error('Hero image and headline are required')
      return
    }
    if (sendMode === 'selected' && selectedRecipients.length === 0) {
      toast.error('Please select at least one recipient')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/admin/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject: subject.trim(),
          html: newsletterHtml,
          recipients: sendMode === 'selected' ? selectedRecipients : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || data.details || 'Failed to send')
        return
      }
      toast.success(`Newsletter sent to ${data.sent} subscribers!`)
      setSubject('')
      setSearchQuery('')
      setSearchResults([])
      setSelectedRecipients([])
    } catch {
      toast.error('Failed to send newsletter')
    } finally {
      setSending(false)
    }
  }

  const addRecipient = (recipient: string) => {
    if (selectedRecipients.includes(recipient)) return
    setSelectedRecipients((prev) => [...prev, recipient])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeRecipient = (recipient: string) => {
    setSelectedRecipients((prev) => prev.filter((email) => email !== recipient))
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1C2E45]" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F8F5F2] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-[#E7E0DA] bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-[#1C2E45] heading-font text-2xl">
              Admin Login
            </CardTitle>
            <p className="text-[#333333] text-sm">
              Sign in with your admin email and password.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C2E45] mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-[#E7E0DA] focus:border-[#946b56]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C2E45] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#E7E0DA] focus:border-[#946b56] pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#666666] hover:text-[#1C2E45] focus:outline-none focus:ring-2 focus:ring-[#946b56]/30 rounded p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1C2E45] hover:bg-[#2A3F5F] text-white"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#1C2E45] heading-font">
            Admin Dashboard
          </h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-[#E7E0DA] text-[#1C2E45] hover:bg-[#E7E0DA]"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </Button>
        </div>

        <Card className="mb-8 border-[#E7E0DA] bg-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-[#333333]">
              <Users className="w-6 h-6 text-[#946b56]" />
              <div>
                <p className="font-medium text-[#1C2E45]">Newsletter subscribers</p>
                <p className="text-2xl font-bold text-[#1C2E45]">
                  {subscriberCount ?? '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E7E0DA] bg-white">
          <CardHeader>
            <CardTitle className="text-[#1C2E45] heading-font flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send newsletter update
            </CardTitle>
            <p className="text-sm text-[#333333]">
              Choose recipients or send to everyone on the newsletter list.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendNewsletter} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1C2E45] mb-2">
                  Recipients
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <Button
                    type="button"
                    variant={sendMode === 'all' ? 'default' : 'outline'}
                    className={sendMode === 'all'
                      ? 'bg-[#1C2E45] text-white'
                      : 'border-[#E7E0DA] text-[#1C2E45]'}
                    onClick={() => setSendMode('all')}
                  >
                    Send to all
                  </Button>
                  <Button
                    type="button"
                    variant={sendMode === 'selected' ? 'default' : 'outline'}
                    className={sendMode === 'selected'
                      ? 'bg-[#1C2E45] text-white'
                      : 'border-[#E7E0DA] text-[#1C2E45]'}
                    onClick={() => setSendMode('selected')}
                  >
                    Choose recipients
                  </Button>
                </div>

                {sendMode === 'selected' && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search subscriber emails"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-[#E7E0DA] focus:border-[#946b56] pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#946b56]" />
                      {searching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-[#946b56]" />
                      )}
                    </div>

                    {searchResults.length > 0 && (
                      <div className="border border-[#E7E0DA] rounded-md bg-white shadow-sm max-h-48 overflow-auto">
                        {searchResults.map((result) => (
                          <button
                            key={result}
                            type="button"
                            onClick={() => addRecipient(result)}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#F8F5F2]"
                          >
                            {result}
                          </button>
                        ))}
                      </div>
                    )}

                    {selectedRecipients.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedRecipients.map((recipient) => (
                          <span
                            key={recipient}
                            className="inline-flex items-center gap-1 rounded-full bg-[#E7E0DA] text-[#1C2E45] px-3 py-1 text-xs"
                          >
                            {recipient}
                            <button
                              type="button"
                              onClick={() => removeRecipient(recipient)}
                              className="text-[#1C2E45] hover:text-[#946b56]"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C2E45] mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="Your newsletter subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="border-[#E7E0DA] focus:border-[#946b56]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1C2E45] mb-2">
                  Newsletter content (Canva template)
                </label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="border-t border-[#E7E0DA] pt-4 mt-0">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 1</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Field 1</label>
                        <Input type="text" value={templateData.welcomeLine} onChange={(e) => setTemplateData((prev) => ({ ...prev, welcomeLine: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. Welcome to the" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Field 2</label>
                        <Input type="text" value={templateData.mainTitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, mainTitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. BRIDGED INSIDER" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 2</h4>
                    <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Image</label>
                    <label className="inline-flex items-center gap-2 cursor-pointer h-10 px-4 rounded-md border border-[#E7E0DA] hover:bg-[#F8F5F2] text-sm">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleImageUpload('heroImageUrl', f)
                          e.target.value = ''
                        }}
                      />
                      {uploadingField === 'heroImageUrl' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      Upload image
                    </label>
                    {templateData.heroImageUrl?.includes('/api/newsletter-images/') && (
                      <p className="text-xs text-green-600 mt-1.5">Image uploaded</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Year</label>
                    <Input type="text" placeholder="e.g. 2026" value={templateData.year} onChange={(e) => setTemplateData((prev) => ({ ...prev, year: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Badge</label>
                    <Input type="text" value={templateData.welcomeBadgeText} onChange={(e) => setTemplateData((prev) => ({ ...prev, welcomeBadgeText: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. WELCOME" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Headline</label>
                    <Input
                      type="text"
                      placeholder="Main headline"
                      value={templateData.headline}
                      onChange={(e) => setTemplateData((prev) => ({ ...prev, headline: e.target.value }))}
                      className="border-[#E7E0DA] focus:border-[#946b56]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Subheadline</label>
                    <Input
                      type="text"
                      placeholder="Secondary headline"
                      value={templateData.subheadline}
                      onChange={(e) => setTemplateData((prev) => ({ ...prev, subheadline: e.target.value }))}
                      className="border-[#E7E0DA] focus:border-[#946b56]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Intro copy</label>
                    <textarea
                      placeholder="Opening paragraph"
                      value={templateData.introCopy}
                      onChange={(e) => setTemplateData((prev) => ({ ...prev, introCopy: e.target.value }))}
                      className="w-full min-h-[120px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Label 1</label>
                    <Input type="text" value={templateData.athletesLabel} onChange={(e) => setTemplateData((prev) => ({ ...prev, athletesLabel: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. Athletes," />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Copy 1</label>
                    <textarea
                      placeholder="Body copy under Athletes label"
                      value={templateData.athletesCopy}
                      onChange={(e) => setTemplateData((prev) => ({ ...prev, athletesCopy: e.target.value }))}
                      className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Label 2</label>
                    <Input type="text" value={templateData.companiesLabel} onChange={(e) => setTemplateData((prev) => ({ ...prev, companiesLabel: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. Companies," />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Copy 2</label>
                    <textarea
                      placeholder="Body copy under Companies label"
                      value={templateData.companiesCopy}
                      onChange={(e) => setTemplateData((prev) => ({ ...prev, companiesCopy: e.target.value }))}
                      className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1C2E45] mb-2">Tagline</label>
                    <Input type="text" value={templateData.heroTagline} onChange={(e) => setTemplateData((prev) => ({ ...prev, heroTagline: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. All managed and handled by one platform!" />
                  </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 3</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Title</label>
                        <Input type="text" value={templateData.whatIsBridgedTitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, whatIsBridgedTitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. WHAT IS BRIDGED?" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Subtitle</label>
                        <Input type="text" value={templateData.whatIsBridgedSubtitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, whatIsBridgedSubtitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. YOU'RE EARLY. THAT MATTERS." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Paragraph 1</label>
                        <textarea
                          placeholder="First paragraph"
                          value={templateData.whatIsBridgedP1}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, whatIsBridgedP1: e.target.value }))}
                          className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Paragraph 2</label>
                        <textarea
                          placeholder="Second paragraph"
                          value={templateData.whatIsBridgedP2}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, whatIsBridgedP2: e.target.value }))}
                          className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Paragraph 3</label>
                        <textarea
                          placeholder="Third paragraph"
                          value={templateData.whatIsBridgedP3}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, whatIsBridgedP3: e.target.value }))}
                          className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 4</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Title</label>
                        <Input type="text" value={templateData.lookoutTitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, lookoutTitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. BE ON THE LOOKOUT FOR …" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Image</label>
                        <label className="inline-flex items-center gap-2 cursor-pointer h-10 px-4 rounded-md border border-[#E7E0DA] hover:bg-[#F8F5F2] text-sm">
                          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload('interestedCardUrl', f); e.target.value = '' }} />
                          {uploadingField === 'interestedCardUrl' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Upload image
                        </label>
                        {templateData.interestedCardUrl?.includes('/api/newsletter-images/') && (
                          <p className="text-xs text-green-600 mt-1.5">Image uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 5</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Title</label>
                        <textarea value={templateData.whatsComingTitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, whatsComingTitle: e.target.value }))} className="w-full min-h-[60px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm" placeholder="One or two lines (Enter for break)" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Intro</label>
                        <Input type="text" value={templateData.whatsComingIntro} onChange={(e) => setTemplateData((prev) => ({ ...prev, whatsComingIntro: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. Over the next few weeks, we'll be sharing:" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Bullets (one per line)</label>
                        <textarea value={templateData.whatsComingBullets} onChange={(e) => setTemplateData((prev) => ({ ...prev, whatsComingBullets: e.target.value }))} className="w-full min-h-[120px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm" placeholder="One item per line" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Closing</label>
                        <textarea value={templateData.whatsComingClosing} onChange={(e) => setTemplateData((prev) => ({ ...prev, whatsComingClosing: e.target.value }))} className="w-full min-h-[60px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm" placeholder="Use Enter for line breaks" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 6</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Title</label>
                        <Input type="text" value={templateData.founderSectionTitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, founderSectionTitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. BUILT BY STUDENT ATHLETES." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Image</label>
                        <label className="inline-flex items-center gap-2 cursor-pointer h-10 px-4 rounded-md border border-[#E7E0DA] hover:bg-[#F8F5F2] text-sm">
                          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload('founderImageUrl', f); e.target.value = '' }} />
                          {uploadingField === 'founderImageUrl' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Upload image
                        </label>
                        {templateData.founderImageUrl?.includes('/api/newsletter-images/') && (
                          <p className="text-xs text-green-600 mt-1.5">Image uploaded</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Name</label>
                        <Input
                          type="text"
                          placeholder="e.g. CO-Founder Name"
                          value={templateData.founderName}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, founderName: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Quote</label>
                        <textarea
                          placeholder="Quote from the founder"
                          value={templateData.founderQuote}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, founderQuote: e.target.value }))}
                          className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 7</h4>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Title</label>
                        <Input type="text" value={templateData.partnershipTitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, partnershipTitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. PARTNERSHIP SPOTLIGHTS" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Subtitle</label>
                        <Input type="text" value={templateData.partnershipSubtitle} onChange={(e) => setTemplateData((prev) => ({ ...prev, partnershipSubtitle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. WE'RE PROUD TO BEGIN..." />
                      </div>
                    </div>
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Subsection 7.1</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Name</label>
                        <Input
                          type="text"
                          placeholder="e.g. ZENITH PREP ACADEMY"
                          value={templateData.partner1Name}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, partner1Name: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Attribution</label>
                        <Input
                          type="text"
                          placeholder="e.g. FOUNDER NAME"
                          value={templateData.partner1Founder}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, partner1Founder: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Copy</label>
                        <textarea
                          placeholder="Description of the partnership"
                          value={templateData.partner1Copy}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, partner1Copy: e.target.value }))}
                          className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Logo</label>
                        <label className="inline-flex items-center gap-2 cursor-pointer h-10 px-4 rounded-md border border-[#E7E0DA] hover:bg-[#F8F5F2] text-sm">
                          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload('partner1LogoUrl', f); e.target.value = '' }} />
                          {uploadingField === 'partner1LogoUrl' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Upload image
                        </label>
                        {templateData.partner1LogoUrl?.includes('/api/newsletter-images/') && (
                          <p className="text-xs text-green-600 mt-1.5">Image uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4 mt-2">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Subsection 7.2</h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Name</label>
                        <Input
                          type="text"
                          placeholder="e.g. REGGIE STEPHENS"
                          value={templateData.partner2Name}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, partner2Name: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Attribution</label>
                        <Input
                          type="text"
                          placeholder="e.g. FOUNDER NAME"
                          value={templateData.partner2Founder}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, partner2Founder: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Copy</label>
                        <textarea
                          placeholder="Description of the partnership"
                          value={templateData.partner2Copy}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, partner2Copy: e.target.value }))}
                          className="w-full min-h-[80px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Logo</label>
                        <label className="inline-flex items-center gap-2 cursor-pointer h-10 px-4 rounded-md border border-[#E7E0DA] hover:bg-[#F8F5F2] text-sm">
                          <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload('partner2LogoUrl', f); e.target.value = '' }} />
                          {uploadingField === 'partner2LogoUrl' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                          Upload image
                        </label>
                        {templateData.partner2LogoUrl?.includes('/api/newsletter-images/') && (
                          <p className="text-xs text-green-600 mt-1.5">Image uploaded</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#E7E0DA] pt-4 mt-2">
                    <h4 className="text-sm font-semibold text-[#1C2E45] mb-3">Section 8</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Handle</label>
                        <Input type="text" value={templateData.footerHandle} onChange={(e) => setTemplateData((prev) => ({ ...prev, footerHandle: e.target.value }))} className="border-[#E7E0DA] focus:border-[#946b56]" placeholder="e.g. @bridgedplatform" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Email</label>
                        <Input
                          type="text"
                          placeholder="e.g. nbowles@bridged.agency"
                          value={templateData.contactEmail}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, contactEmail: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#1C2E45] mb-2">Website</label>
                        <Input
                          type="text"
                          placeholder="e.g. www.bridgedplatform.com"
                          value={templateData.websiteUrl}
                          onChange={(e) => setTemplateData((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                          className="border-[#E7E0DA] focus:border-[#946b56]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[#666666] mt-2">
                  Enter your content below — it populates the newsletter template when you send. Use the upload buttons for images. The design (fonts, layout, colors) is fixed. Preview updates live above.
                </p>
              </div>
              <div className="border border-[#E7E0DA] rounded-md bg-white">
                <div className="px-4 py-2 border-b border-[#E7E0DA] text-sm font-medium text-[#1C2E45]">
                  Live preview
                </div>
                <div className="p-4 bg-[#F8F5F2]">
                  <div className="bg-white border border-[#E7E0DA] rounded-md overflow-hidden">
                    <div
                      className="max-h-[500px] overflow-auto"
                      dangerouslySetInnerHTML={{ __html: newsletterHtml }}
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                className="bg-[#946b56] hover:bg-[#a98471] text-white"
                disabled={sending}
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send to {sendMode === 'selected' ? selectedRecipients.length : (subscriberCount ?? 0)} subscribers
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
