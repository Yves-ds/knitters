'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-white flex flex-col px-6 pt-16 pb-8">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <span className="text-xl">🧶</span>
        </div>
        <span className="text-xl font-bold text-dark">knitters</span>
      </div>
      <h2 className="text-2xl font-bold text-dark mb-2">
        {isLogin ? '다시 돌아왔군요! 👋' : '가입하고 시작하기 ✨'}
      </h2>
      <p className="text-sub text-sm mb-8">뜨개 기록과 커뮤니티를 함께해요</p>
      <div className="flex bg-bg-light rounded-xl p-1 mb-8">
        {(['로그인', '회원가입'] as const).map((tab, i) => (
          <button key={tab} onClick={() => setIsLogin(i === 0)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${(isLogin ? i===0 : i===1) ? 'bg-white text-dark shadow-sm' : 'text-sub'}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="space-y-4 mb-8">
        {!isLogin && <input className="input-field" type="text" placeholder="닉네임" />}
        <input className="input-field" type="email" placeholder="이메일" />
        <input className="input-field" type="password" placeholder="비밀번호" />
      </div>
      <button onClick={() => router.push('/feed')} className="btn-primary rounded-2xl py-4 text-base mb-6">
        {isLogin ? '로그인' : '가입하기'}
      </button>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" /><span className="text-xs text-sub">또는</span><div className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-3">
        <button onClick={() => router.push('/feed')} className="w-full bg-[#FEE500] text-[#3A1D1D] font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 text-sm">
          🟡 카카오로 계속하기
        </button>
        <button onClick={() => router.push('/feed')} className="w-full bg-white border border-border text-dark font-semibold py-4 rounded-2xl flex items-center justify-center gap-3 text-sm">
          🔵 Google로 계속하기
        </button>
      </div>
    </div>
  )
}
