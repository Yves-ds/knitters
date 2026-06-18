'use client'
import { useRouter } from 'next/navigation'
import { MAGAZINE_ARTICLES } from '@/lib/magazineData'

export default function MagazineDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const article = MAGAZINE_ARTICLES.find(a => a.id === Number(params.id))

  if (!article) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center max-w-[393px] mx-auto">
        <p className="text-[14px] text-[#9d9d9d]">아티클을 찾을 수 없어요.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-14 h-[60px]">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 flex items-center justify-center"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-8 h-8 flex items-center justify-center">
          <svg width="4" height="18" viewBox="0 0 4 18" fill="none">
            <circle cx="2" cy="2" r="2" fill="#212121"/>
            <circle cx="2" cy="9" r="2" fill="#212121"/>
            <circle cx="2" cy="16" r="2" fill="#212121"/>
          </svg>
        </button>
      </div>

      {/* 히어로 이미지 */}
      <div className="w-full h-[240px] bg-[#d9d9d9]" />

      {/* 본문 */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-1 mb-3">
          <span className="text-[12px] font-semibold text-[#6a6a6a] tracking-[-0.36px]">{article.series}</span>
          <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
            <path d="M1 1l3 3.5-3 3.5" stroke="#6a6a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-[20px] font-semibold text-[#212121] tracking-[-0.6px] leading-[1.31] mb-2">
          {article.title}
        </p>
        <p className="text-[14px] font-medium text-[#212121] tracking-[-0.42px] leading-[1.31] mb-2">
          {article.subtitle}
        </p>
        <p className="text-[12px] text-[#9d9d9d] tracking-[-0.36px] mb-4">{article.date}</p>
        <div className="h-px bg-[#f0f0f0] mb-5" />
        <p className="text-[16px] text-[#575757] leading-[1.8] tracking-[-0.32px] whitespace-pre-line">
          {article.content}
        </p>
      </div>
    </div>
  )
}
