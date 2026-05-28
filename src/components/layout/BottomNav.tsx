'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, FolderOpen, Users, Compass, User } from 'lucide-react'

const navItems = [
  { href: '/feed', icon: Home, label: '홈' },
  { href: '/projects', icon: FolderOpen, label: '프로젝트' },
  { href: '/community', icon: Users, label: '커뮤니티' },
  { href: '/explore', icon: Compass, label: '탐색' },
  { href: '/mypage', icon: User, label: '마이' },
]

export default function BottomNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 py-2 px-4 min-w-[44px]">
              <Icon size={22} className={isActive ? 'text-primary' : 'text-sub'} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-sub'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
