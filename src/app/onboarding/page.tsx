import Link from 'next/link'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-8">
        <div className="mb-10">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-4 mx-auto shadow-lg shadow-primary/20">
            <span className="text-3xl">🧶</span>
          </div>
          <h1 className="text-3xl font-bold text-dark text-center tracking-tight">knitters</h1>
          <p className="text-sub text-center mt-2 text-sm">니터즈</p>
        </div>
        <div className="text-center mb-12">
          <h2 className="text-xl font-bold text-dark leading-relaxed mb-3">
            나의 뜨개 여정을<br />기록하고 공유하세요
          </h2>
          <p className="text-sub text-sm leading-relaxed">
            프로젝트 기록부터 도안 탐색,<br />뜨개 커뮤니티까지 한곳에서
          </p>
        </div>
        <div className="w-full space-y-3 mb-10">
          {[
            { emoji: '📒', title: '뜨개 프로젝트 기록', desc: '진행률, 실 정보, 사진을 체계적으로' },
            { emoji: '💬', title: '뜨개 커뮤니티', desc: '작품 공유하고 영감 받기' },
            { emoji: '🔍', title: '도안 & 아이템 탐색', desc: '무료/유료 도안을 한 곳에서' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 bg-bg-light rounded-2xl p-4">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-dark">{item.title}</p>
                <p className="text-xs text-sub mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-6 pb-12 space-y-3">
        <Link href="/login" className="btn-primary block text-center rounded-2xl py-4 text-base">
          시작하기
        </Link>
        <Link href="/feed" className="btn-secondary block text-center rounded-2xl py-4 text-base text-sub">
          둘러보기
        </Link>
      </div>
    </div>
  )
}
