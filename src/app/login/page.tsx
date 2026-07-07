'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function KakaoIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path
        d="M10 0C4.477 0 0 3.358 0 7.5c0 2.688 1.71 5.044 4.29 6.394L3.2 17.5l4.47-2.548C8.1 15.146 9.035 15.25 10 15.25 15.523 15.25 20 11.642 20 7.5S15.523 0 10 0z"
        fill="#191600"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="none">
      <path
        d="M13.9 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.7-3-1.9-3.7-2-1.6-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9C3.5 4.8 1.2 6 0 8c-2.5 4.3-.6 10.7 1.8 14.2 1.2 1.7 2.6 3.6 4.4 3.5 1.8-.1 2.4-1.1 4.6-1.1 2.1 0 2.7 1.1 4.6 1.1 1.9 0 3.1-1.7 4.3-3.4 1.3-1.9 1.9-3.8 1.9-3.9-.1-.1-3.7-1.4-3.7-5.8z"
        fill="white"
        transform="scale(0.85) translate(1, 0)"
      />
      <path
        d="M11.5 2.7c1-1.2 1.7-2.8 1.5-4.4-1.4.1-3.2.9-4.2 2.1-1 1.1-1.8 2.8-1.5 4.4 1.5.1 3.2-.8 4.2-2.1z"
        fill="white"
        transform="scale(0.85) translate(1, 0)"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
      <rect x="0.5" y="0.5" width="19" height="15" rx="2.5" stroke="#374151" />
      <path d="M1 1l9 8 9-8" stroke="#374151" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <circle cx="28" cy="28" r="28" fill="#FFF0EE" />
      <path d="M17 28l8 8 14-16" stroke="#F72E00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [view, setView] = useState<'main' | 'email' | 'sent'>('main')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendMagicLink = async () => {
    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아니에요.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: supabaseError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (supabaseError) {
        setError('Supabase 오류: ' + supabaseError.message)
      } else {
        setView('sent')
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setError('오류: ' + msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col max-w-[393px] mx-auto" style={{ backgroundColor: '#fdfcf8' }}>

      {/* 이메일 입력 뷰 */}
      {view === 'email' && (
        <div className="flex-1 flex flex-col px-7 pt-14">
          {/* 뒤로가기 */}
          <button
            onClick={() => { setView('main'); setError(''); setEmail('') }}
            className="mb-8 self-start active:opacity-60"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: '22px', color: '#111827', marginBottom: 8 }}>
            이메일로 시작하기
          </h2>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '14px', color: '#9CA3AF', marginBottom: 36, lineHeight: '1.5' }}>
            입력한 이메일로 로그인 링크를 보내드려요.
          </p>

          {/* 이메일 입력 */}
          <div className="mb-3">
            <label style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSendMagicLink()}
              placeholder="example@email.com"
              autoFocus
              className="w-full h-[52px] rounded-[14px] px-4 outline-none border transition-colors"
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontSize: '15px',
                color: '#111827',
                backgroundColor: '#ffffff',
                borderColor: error ? '#F72E00' : '#E5E7EB',
              }}
            />
            {error && (
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '12px', color: '#F72E00', marginTop: 6 }}>
                {error}
              </p>
            )}
          </div>

          {/* 링크 보내기 버튼 */}
          <button
            onClick={handleSendMagicLink}
            disabled={loading}
            className="w-full h-[52px] rounded-[14px] flex items-center justify-center transition-opacity active:opacity-80 mt-2"
            style={{ backgroundColor: '#F72E00', opacity: loading ? 0.6 : 1 }}
          >
            <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: '15px', color: '#ffffff' }}>
              {loading ? '전송 중...' : '링크 받기'}
            </span>
          </button>
        </div>
      )}

      {/* 전송 완료 뷰 */}
      {view === 'sent' && (
        <div className="flex-1 flex flex-col items-center justify-center px-7 text-center">
          <div className="mb-6">
            <CheckCircleIcon />
          </div>
          <h2 style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: '22px', color: '#111827', marginBottom: 12 }}>
            이메일을 확인해주세요
          </h2>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6', marginBottom: 8 }}>
            <span style={{ color: '#F72E00', fontWeight: 600 }}>{email}</span>으로<br />
            로그인 링크를 보냈어요.
          </p>
          <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '13px', color: '#C4C4C4', lineHeight: '1.6' }}>
            링크는 1시간 동안 유효해요.
          </p>

          <button
            onClick={() => { setView('email'); setError('') }}
            className="mt-10 active:opacity-60"
            style={{ fontFamily: "'Pretendard', sans-serif", fontSize: '13px', color: '#9CA3AF', textDecoration: 'underline' }}
          >
            이메일 다시 입력하기
          </button>
        </div>
      )}

      {/* 메인 로그인 뷰 */}
      {view === 'main' && (
        <>
          <div className="flex-1 flex flex-col items-center justify-center px-7">
            {/* 로고 */}
            <div className="mb-1">
              <span
                style={{
                  fontFamily: "'Rubik Bubbles', cursive",
                  color: '#f72e00',
                  fontSize: '40px',
                  lineHeight: 'normal',
                }}
              >
                Knitters
              </span>
            </div>

            {/* 서브타이틀 */}
            <div className="mb-[52px]">
              <span
                style={{
                  fontFamily: "'Pretendard', sans-serif",
                  color: '#ff7a5b',
                  fontSize: '14px',
                  letterSpacing: '0.3px',
                }}
              >
                니터들을 위한 뜨개 커뮤니티
              </span>
            </div>

            {/* 로그인 버튼 목록 */}
            <div className="w-full flex flex-col gap-3">
              {/* 카카오 */}
              <button
                onClick={() => router.push('/feed')}
                className="w-full flex items-center justify-center gap-[10px] h-[52px] rounded-[14px] transition-opacity active:opacity-80"
                style={{ backgroundColor: '#fee500' }}
              >
                <KakaoIcon />
                <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: '15px', color: '#191600' }}>
                  카카오로 시작하기
                </span>
              </button>

              {/* Apple */}
              <button
                onClick={() => router.push('/feed')}
                className="w-full flex items-center justify-center gap-[10px] h-[52px] rounded-[14px] transition-opacity active:opacity-80"
                style={{ backgroundColor: '#111827' }}
              >
                <AppleIcon />
                <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: '15px', color: '#ffffff' }}>
                  Apple로 시작하기
                </span>
              </button>

              {/* 이메일 */}
              <button
                onClick={() => setView('email')}
                className="w-full flex items-center justify-center gap-[10px] h-[52px] rounded-[14px] bg-white border transition-opacity active:opacity-80"
                style={{ borderColor: '#e5e7eb' }}
              >
                <EmailIcon />
                <span style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: '15px', color: '#374151' }}>
                  이메일로 시작하기
                </span>
              </button>
            </div>

            {/* 아이디/비밀번호 찾기 */}
            <div className="mt-6">
              <button
                style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 600, fontSize: '13px', color: '#aeaeae' }}
              >
                아이디/비밀번호 찾기
              </button>
            </div>
          </div>

          {/* 고객센터 */}
          <div className="pb-8 flex justify-center">
            <button
              style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 500, fontSize: '12px', color: '#aeaeae', textDecoration: 'underline' }}
            >
              고객센터
            </button>
          </div>
        </>
      )}
    </div>
  )
}
