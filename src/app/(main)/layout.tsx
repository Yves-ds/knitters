'use client'
import { usePathname } from 'next/navigation'
import BottomNav from '@/components/layout/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = pathname === '/projects/new' || pathname.startsWith('/projects/') || pathname.startsWith('/explore/meeting/') || (/^\/community\/[^/]+$/.test(pathname) && pathname !== '/community/feed' && pathname !== '/community/new' && pathname !== '/community/search' && pathname !== '/community/together')
  return (
    <div className="relative">
      {children}
      {!hideNav && <BottomNav />}
    </div>
  )
}
