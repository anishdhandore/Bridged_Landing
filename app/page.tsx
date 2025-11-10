'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useMutation } from '@tanstack/react-query'
import { Mail, CheckCircle2, Sparkles, Users, Briefcase, Handshake, ArrowRight, Target, Award } from 'lucide-react'
import { toast } from 'sonner'

export default function LandingPage() {
  const [email, setEmail] = useState('')

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to subscribe')
      }
      return res.json()
    },
    onSuccess: () => {
      toast.success('Thank you! We\'ll notify you when we launch.')
      setEmail('')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Something went wrong. Please try again.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    subscribeMutation.mutate(email)
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1C2E45] via-[#2A3F5F] to-[#1C2E45]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI0RFRDRDNCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-20 md:pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="relative inline-flex items-center justify-center mb-8">
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#DED4C4]/20 to-[#946b56]/20 rounded-full blur-xl w-32 h-32 -z-10"></div>
              {/* Logo container with subtle border */}
              <div className="relative inline-flex items-center justify-center p-4 bg-[#DED4C4]/10 rounded-2xl backdrop-blur-sm border border-[#DED4C4]/20 shadow-lg">
                <img 
                  src="/TransparentLogo.png" 
                  alt="Bridged Logo" 
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
                />
              </div>
              {/* Decorative sparkles around logo */}
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-5 h-5 text-[#DED4C4]/60 animate-pulse" />
              </div>
              <div className="absolute -bottom-2 -left-2">
                <Sparkles className="w-4 h-4 text-[#DED4C4]/40 animate-pulse delay-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight opacity-90 heading-font">
              Bridged
              <span className="text-[#DED4C4]"> is Coming Soon</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#DED4C4] mb-4 leading-relaxed text-medium">
              Connect talented student-athletes with meaningful opportunities
            </p>
            <p className="text-lg text-[#DED4C4]/80 mb-12 max-w-2xl mx-auto text-medium">
              Be the first to know when we launch. Join our waitlist and get early access to the platform that's bridging the gap between athletics and career success.
            </p>

            {/* Email Signup Form */}
            <Card className="max-w-2xl mx-auto border-2 border-[#DED4C4]/30 bg-white/95 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C2E45]/40" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 text-lg border-2 border-[#E7E0DA] focus:border-[#946b56] rounded-xl bg-white"
                        disabled={subscribeMutation.isPending}
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-[#946b56] hover:bg-[#a98471] text-white text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-14 whitespace-nowrap"
                    disabled={subscribeMutation.isPending}
                  >
                    {subscribeMutation.isPending ? (
                      'Subscribing...'
                    ) : (
                      <>
                        Notify Me <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
                {subscribeMutation.isSuccess && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-[#946b56]">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="text-medium">You're on the list! We'll be in touch soon.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What's Coming Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C2E45] mb-4 heading-font">
              What's Coming
            </h2>
            <p className="text-xl text-[#333333] max-w-2xl mx-auto text-medium">
              A platform designed to connect student-athletes with real opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border border-[#E7E0DA] shadow-lg hover:shadow-xl transition-all duration-300 bg-[#F8F5F2]">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1C2E45] to-[#2A3F5F] rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1C2E45] mb-4 heading-font">
                  For Athletes
                </h3>
                <ul className="space-y-3 text-[#333333] text-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Create a professional profile showcasing your achievements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Discover internship and partnership opportunities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Get verified by your athletic department</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#E7E0DA] shadow-lg hover:shadow-xl transition-all duration-300 bg-[#F8F5F2]">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#DED4C4] to-[#E7E0DA] rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  <Briefcase className="w-8 h-8 text-[#1C2E45]" />
                </div>
                <h3 className="text-2xl font-bold text-[#1C2E45] mb-4 heading-font">
                  For Companies
                </h3>
                <ul className="space-y-3 text-[#333333] text-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Access verified student-athlete talent pool</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Post internships and affiliate partnerships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Manage partnerships with built-in tools</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border border-[#E7E0DA] shadow-lg hover:shadow-xl transition-all duration-300 bg-[#F8F5F2]">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#946b56] to-[#a98471] rounded-2xl flex items-center justify-center mb-6 shadow-md">
                  <Handshake className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1C2E45] mb-4 heading-font">
                  The Platform
                </h3>
                <ul className="space-y-3 text-[#333333] text-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>End-to-end partnership management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Secure payments and automated payouts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#946b56] mt-0.5 flex-shrink-0" />
                    <span>Built-in messaging and task tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-[#F8F5F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C2E45] mb-4 heading-font">
              Why Join the Waitlist?
            </h2>
            <p className="text-xl text-[#333333] max-w-3xl mx-auto text-medium">
              Get exclusive early access and be part of something special
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, text: "Early access to the platform" },
              { icon: Target, text: "First to see new opportunities" },
              { icon: Sparkles, text: "Exclusive launch benefits" },
              { icon: Mail, text: "Updates on our progress" },
            ].map((item, index) => (
              <Card key={index} className="border border-[#E7E0DA] bg-white hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#DED4C4] to-[#E7E0DA] rounded-xl flex items-center justify-center mb-4 shadow-sm">
                    <item.icon className="w-7 h-7 text-[#1C2E45]" />
                  </div>
                  <p className="text-[#333333] leading-relaxed text-medium">{item.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#1C2E45] to-[#2A3F5F]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 heading-font">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-[#DED4C4] mb-8 text-medium">
            Join thousands of others who are already on the waitlist
          </p>
          
          {/* Email Signup Form (Second Location) */}
          <Card className="max-w-xl mx-auto border-2 border-[#DED4C4]/30 bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#1C2E45]/40" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 h-12 border-2 border-[#E7E0DA] focus:border-[#946b56] rounded-xl bg-white"
                      disabled={subscribeMutation.isPending}
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-[#946b56] hover:bg-[#a98471] text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all h-12 whitespace-nowrap"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? '...' : 'Join Waitlist'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
