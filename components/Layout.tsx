'use client'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  // Simplified layout for landing page - just render children
  return <>{children}</>
}

