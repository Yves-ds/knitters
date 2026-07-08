'use client'
import { useParams, useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react'
import { MEETINGS } from '@/lib/meetingData'

const CATEGORIES = [
  '온라인 모임',
  '오프라인 모임',
  '주말 모임',
  '평일 모임',
  '소규모 모임',
  '대규모 모임',
  '동네 모임',
  '뜨개 원데이',
]

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9a9a9a"/>
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#9a9a9a"/>
    </svg>
  )
}

export default function CategoryPage() {
  const { slug } = useParams()
  const router = useRouter()
  const category = decodeURIComponent(String(slug))
  const filtered = MEETINGS.filter(m => m.category === category)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const tabListRef = useRef<HTMLDivElement>(null)

  // 현재 탭이 스크롤 뷰에 보이도록 자동 스크롤
  useEffect(() => {
    const idx = CATEGORIES.indexOf(category)
    if (idx !== -1 && tabRefs.current[idx] && tabListRef.current) {
      tabRefs.current[idx]?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
    }
  }, [category])

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">

      {/* 헤더 + 탭 */}
      <div className="bg-white sticky top-0 z-10">
        {/* 뒤로가기 + 타이틀 */}
        <div className="px-4 pt-14 pb-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="active:opacity-60 shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="text-[17px] font-bold text-[#212121]">모임 카테고리</span>
        </div>

        {/* 카테고리 탭 */}
        <div
          ref={tabListRef}
          className="flex overflow-x-auto scrollbar-none gap-1 px-4 pb-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((cat, i) => {
            const isActive = cat === category
            return (
              <button
                key={cat}
                ref={el => { tabRefs.current[i] = el }}
                onClick={() => router.replace(`/explore/category/${encodeURIComponent(cat)}`)}
                className="shrink-0 h-[36px] px-4 rounded-t-[0px] text-[13px] font-semibold transition-colors whitespace-nowrap relative"
                style={{ color: isActive ? '#F72E00' : '#9a9a9a' }}
              >
                {cat}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full" style={{ background: '#F72E00' }} />
                )}
              </button>
            )
          })}
        </div>
        <div className="h-px bg-[#F0F0F0]" />
      </div>

      {/* 모임 수 */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-[14px] text-[#9a9a9a]">
          <span className="font-bold text-[#212121]">{filtered.length}</span>개의 모임
        </p>
      </div>

      {/* 목록 */}
      <div className="px-4 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <span className="text-[48px]">🧶</span>
            <p className="text-[15px] font-semibold text-[#9a9a9a]">아직 모임이 없어요</p>
          </div>
        ) : (
          filtered.map(item => (
            <button
              key={item.id}
              onClick={() => router.push(`/explore/meeting/${item.id}`)}
              className="w-full text-left bg-white rounded-[14px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all"
            >
              <div className="flex items-stretch h-[120px]">
                {/* 이미지 */}
                <div
                  className="w-[110px] shrink-0 rounded-l-[14px] flex items-center justify-center text-4xl"
                  style={{ background: 'linear-gradient(135deg,#fff0ee,#ffd6cc)' }}
                >
                  🧶
                </div>
                {/* 정보 */}
                <div className="flex-1 px-4 py-3 flex flex-col justify-between">
                  <div
                    className="self-start h-[22px] px-2.5 rounded-full flex items-center"
                    style={{
                      background: item.type === '온라인' ? 'rgba(190,255,111,0.25)' : 'rgba(253,146,156,0.18)',
                    }}
                  >
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: item.type === '온라인' ? '#81bf54' : '#fd929c' }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-[15px] font-semibold text-[#212121] leading-snug line-clamp-1">{item.title}</p>
                  <div className="flex items-center gap-1">
                    <LocationIcon />
                    <span className="text-[12px] text-[#6f6f6f]">{item.location} · {item.date} {item.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <PersonIcon />
                    <span className="text-[12px] text-[#9a9a9a]">{item.participants}</span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
