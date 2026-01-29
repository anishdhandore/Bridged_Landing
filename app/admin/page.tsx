'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Send, LogOut, Users, Loader2, Eye, EyeOff, Search, X } from 'lucide-react'
import { toast } from 'sonner'

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
  const [html, setHtml] = useState('')
  const [sending, setSending] = useState(false)
  const [sendMode, setSendMode] = useState<'all' | 'selected'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [searching, setSearching] = useState(false)

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

  const handleSendNewsletter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !html.trim()) {
      toast.error('Subject and message are required')
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
          html: html.trim(),
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
      setHtml('')
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
                  Message (HTML)
                </label>
                <textarea
                  placeholder="<p>Hello subscribers!</p><p>Your update here...</p>"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="w-full min-h-[200px] rounded-md border border-[#E7E0DA] bg-white px-3 py-2 text-sm focus:border-[#946b56] focus:outline-none focus:ring-2 focus:ring-[#946b56]/20"
                  required
                />
                <p className="text-xs text-[#666666] mt-1">
                  You can use simple HTML: &lt;p&gt;, &lt;a href="..."&gt;, &lt;strong&gt;, etc.
                </p>
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
