'use client'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = pathname === '/projects/new' || /^\/projects\/[^/]+$/.test(pathname)
  return (
    <div className="relative">
      {children}
      {!hideNav && <BottomNav />}
    </div>
  )
}
