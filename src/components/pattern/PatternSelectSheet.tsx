'use client'
import { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Pattern, MOCK_PATTERNS } from '@/lib/mockPatterns'

const CATEGORIES = ['전체', '스웨터', '베스트', '모자', '가디건', '소품', '숄/스카프', '양말/장갑']
const BRANDS = ['전체', ...Array.from(new Set(MOCK_PATTERNS.map(p => p.brand)))]

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelectPattern: (p: Pattern) => void
}

export default function PatternSelectSheet({ isOpen, onClose, onSelectPattern }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('전체')
  const [activeBrand, setActiveBrand] = useState('전체')
  const [categoryDropOpen, setCategoryDropOpen] = useState(false)
  const [brandDropOpen, setBrandDropOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) { setSearch(''); setActiveCategory('전체'); setActiveBrand('전체') }
  }, [isOpen])

  const isAllActive = activeCategory === '전체' && activeBrand === '전체'
  const filtered = MOCK_PATTERNS.filter(p => {
    const q = search.trim().toLowerCase()
    return (!q || p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q))
      && (activeCategory === '전체' || p.category === activeCategory)
      && (activeBrand === '전체' || p.brand === activeBrand)
  })

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[64]" onClick={onClose} />}
      <div
        className="fixed bottom-0 w-full max-w-[393px] bg-white rounded-t-[24px] z-[65] flex flex-col"
        style={{
          left: '50%',
          transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
          transition: 'transform 0.42s cubic-bezier(0.32,0.72,0,1)',
          height: '80vh',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />

        <div className="px-5 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-[22px] font-bold text-[#212121]">도안 선택하기</h2>
        </div>

        {/* 검색 */}
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-[12px] h-[44px] px-3.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#9A9A9A" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="작가 / 도안 이름을 입력해주세요"
              className="flex-1 bg-transparent text-[14px] placeholder:text-[#A2A2A2] outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" fill="#D0D0D0"/>
                  <path d="M6 6L12 12M12 6L6 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 필터 */}
        <div className="px-4 pb-3 flex items-center gap-2 flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none">
              <path d="M1 1.5h15M4 7h9M6.5 12.5h4" stroke="#212121" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="w-px h-5 bg-[#E0E0E0] flex-shrink-0" />
          <button
            onClick={() => { setActiveCategory('전체'); setActiveBrand('전체') }}
            className="h-8 px-3.5 rounded-full text-[13px] font-semibold flex-shrink-0"
            style={{ background: isAllActive ? '#F72E00' : '#F0F0F0', color: isAllActive ? '#fff' : '#212121' }}
          >전체</button>

          {/* 카테고리 */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setCategoryDropOpen(v => !v); setBrandDropOpen(false) }}
              className="h-8 px-3 rounded-full text-[13px] font-semibold flex items-center gap-1"
              style={{ background: activeCategory !== '전체' ? '#212121' : '#F0F0F0', color: activeCategory !== '전체' ? '#fff' : '#212121' }}
            >
              {activeCategory === '전체' ? '카테고리' : activeCategory}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            {categoryDropOpen && (
              <>
                <div className="fixed inset-0 z-[66]" onClick={() => setCategoryDropOpen(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white rounded-[12px] z-[67] py-1 min-w-[130px]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => { setActiveCategory(cat); setCategoryDropOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-medium"
                      style={{ color: activeCategory === cat ? '#F72E00' : '#212121' }}>
                      {cat}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 브랜드 */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setBrandDropOpen(v => !v); setCategoryDropOpen(false) }}
              className="h-8 px-3 rounded-full text-[13px] font-semibold flex items-center gap-1"
              style={{ background: activeBrand !== '전체' ? '#212121' : '#F0F0F0', color: activeBrand !== '전체' ? '#fff' : '#212121' }}
            >
              {activeBrand === '전체' ? '브랜드' : activeBrand}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            {brandDropOpen && (
              <>
                <div className="fixed inset-0 z-[66]" onClick={() => setBrandDropOpen(false)} />
                <div className="absolute top-full left-0 mt-1 bg-white rounded-[12px] z-[67] py-1 min-w-[150px]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                  {BRANDS.map(brand => (
                    <button key={brand} onClick={() => { setActiveBrand(brand); setBrandDropOpen(false) }}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-medium"
                      style={{ color: activeBrand === brand ? '#F72E00' : '#212121' }}>
                      {brand}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button onClick={() => { setActiveCategory('전체'); setActiveBrand('전체'); setSearch('') }} className="ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M4 4v5h.582m15.356 2A8 8 0 004.582 9m0 0H9M20 20v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto pb-8">
          {filtered.length === 0 ? (
            <div className="py-16 flex items-center justify-center">
              <p className="text-[14px] text-[#9A9A9A]">검색 결과가 없어요</p>
            </div>
          ) : filtered.map(pattern => (
            <button key={pattern.id} onClick={() => onSelectPattern(pattern)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#F9F9F9] text-left border-b border-[#F5F5F5]">
              <div className="w-[72px] h-[72px] rounded-[12px] bg-[#E8E8E8] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#212121] leading-snug">{pattern.name}</p>
                <p className="text-[13px] text-[#9A9A9A] mt-0.5">{pattern.author}</p>
              </div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="flex-shrink-0">
                <path d="M1 1l5 5-5 5" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
