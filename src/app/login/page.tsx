'use client'
import { useRouter } from 'next/navigation'

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

export default function LoginPage() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen flex flex-col max-w-[393px] mx-auto" style={{ backgroundColor: '#fdfcf8' }}>
      {/* 중앙 콘텐츠 */}
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
            <span
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 600,
                fontSize: '15px',
                color: '#191600',
              }}
            >
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
            <span
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 600,
                fontSize: '15px',
                color: '#ffffff',
              }}
            >
              Apple로 시작하기
            </span>
          </button>

          {/* 이메일 */}
          <button
            onClick={() => router.push('/feed')}
            className="w-full flex items-center justify-center gap-[10px] h-[52px] rounded-[14px] bg-white border transition-opacity active:opacity-80"
            style={{ borderColor: '#e5e7eb' }}
          >
            <EmailIcon />
            <span
              style={{
                fontFamily: "'Pretendard', sans-serif",
                fontWeight: 600,
                fontSize: '15px',
                color: '#374151',
              }}
            >
              이메일로 시작하기
            </span>
          </button>
        </div>

        {/* 아이디/비밀번호 찾기 */}
        <div className="mt-6">
          <button
            style={{
              fontFamily: "'Pretendard', sans-serif",
              fontWeight: 600,
              fontSize: '13px',
              color: '#aeaeae',
            }}
          >
            아이디/비밀번호 찾기
          </button>
        </div>
      </div>

      {/* 고객센터 */}
      <div className="pb-8 flex justify-center">
        <button
          style={{
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 500,
            fontSize: '12px',
            color: '#aeaeae',
            textDecoration: 'underline',
          }}
        >
          고객센터
        </button>
      </div>
    </div>
  )
}
