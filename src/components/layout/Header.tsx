'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell } from 'lucide-react'

interface HeaderProps {
  title?: string
  showBack?: boolean
  showNotification?: boolean
  right?: React.ReactNode
}

export default function Header({ title, showBack, showNotification, right }: HeaderProps) {
  const router = useRouter()
  return (
    <header className="sticky top-0 bg-white z-40 border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={() => router.back()} className="p-2 -ml-2 text-dark">
              <ArrowLeft size={22} />
            </button>
          )}
          {title && <h1 className="text-base font-bold text-dark">{title}</h1>}
        </div>
        <div className="flex items-center gap-2">
          {right}
          {showNotification && (
            <button className="p-2 -mr-2 text-dark relative">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
