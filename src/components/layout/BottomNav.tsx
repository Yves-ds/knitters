'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FolderOpen, Users, Compass, User } from 'lucide-react'

function HomeIconActive() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z" fill="#646464"/>
    </svg>
  )
}

function HomeIconInactive() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 16.2462V11.1541C19 10.6637 18.9996 10.4183 18.9387 10.1901C18.8847 9.98786 18.7961 9.79647 18.6762 9.62353C18.5408 9.42837 18.3527 9.26653 17.9757 8.94358L13.4757 5.08866C12.7758 4.48905 12.4258 4.18939 12.0319 4.07536C11.6849 3.97488 11.3149 3.97488 10.9679 4.07536C10.5743 4.18931 10.2249 4.48868 9.52597 5.08738L5.02448 8.94358C4.64748 9.26654 4.45941 9.42837 4.3241 9.62353C4.20418 9.79647 4.11489 9.98786 4.06091 10.1901C4 10.4183 4 10.6637 4 11.1541V16.2462C4 17.1015 4 17.529 4.14273 17.8664C4.33303 18.3162 4.6978 18.674 5.15723 18.8603C5.5018 19 5.93862 19 6.81226 19C7.6859 19 8.1232 19 8.46777 18.8603C8.9272 18.674 9.29188 18.3162 9.48218 17.8665C9.6249 17.5291 9.625 17.1014 9.625 16.2461V15.3283C9.625 14.3145 10.4645 13.4926 11.5 13.4926C12.5355 13.4926 13.375 14.3145 13.375 15.3283V16.2461C13.375 17.1014 13.375 17.5291 13.5177 17.8665C13.708 18.3162 14.0728 18.674 14.5322 18.8603C14.8768 19 15.3136 19 16.1873 19C17.0609 19 17.4982 19 17.8428 18.8603C18.3022 18.674 18.6669 18.3162 18.8572 17.8664C18.9999 17.529 19 17.1015 19 16.2462Z" stroke="#BFBEB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const navItems = [
  { href: '/feed', label: '홈' },
  { href: '/projects', icon: FolderOpen, label: '기록' },
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
          const isHome = href === '/feed'
          return (
            <Link key={href} href={href} className="flex flex-col items-center gap-1 py-2 px-4 min-w-[44px]">
              {isHome ? (
                isActive ? <HomeIconActive /> : <HomeIconInactive />
              ) : (
                Icon && <Icon size={22} className={isActive ? 'text-primary' : 'text-sub'} strokeWidth={isActive ? 2.5 : 1.8} />
              )}
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-sub'}`}>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
