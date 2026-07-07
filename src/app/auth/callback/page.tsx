'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    const url = new URL(window.location.href)
    const code = url.searchParams.get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.replace('/login')
        } else {
          router.replace('/feed')
        }
      })
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        router.replace(session ? '/feed' : '/login')
      })
    }
  }, [router])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fdfcf8',
      }}
    >
      <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '15px', color: '#9CA3AF' }}>
        로그인 처리 중...
      </p>
    </div>
  )
}
