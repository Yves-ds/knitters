'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const [visible, setVisible] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), 1800)
    const navTimer = setTimeout(() => router.replace('/login'), 2300)
    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(navTimer)
    }
  }, [router])

  return (
    <div
      className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ backgroundColor: '#fdfcf8', opacity: visible ? 1 : 0 }}
    >
      <div className="flex flex-col items-center text-center w-[258px]" style={{ gap: '4px' }}>
        <span style={{ fontFamily: "'Rubik Bubbles', cursive", color: '#ff461b', fontSize: '40px', letterSpacing: '-1.2px', lineHeight: '1.31' }}>
          Knitters
        </span>
        <span style={{ fontFamily: "'Pretendard', sans-serif", color: '#ff5831', fontSize: '14px', letterSpacing: '0.56px', lineHeight: '1.31' }}>
          니터들을 위한 뜨개 커뮤니티
        </span>
      </div>
    </div>
  )
}
