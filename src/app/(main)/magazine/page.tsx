'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MAGAZINE_ARTICLES } from '@/lib/magazineData'

type Tab = '전체' | '추천' | '트렌드' | '인터뷰'
const TABS: Tab[] = ['전체', '추천', '트렌드', '인터뷰']

const SERIES_OPTIONS = ['전체', '도안', '실', '바늘', '인터뷰']
const SORT_OPTIONS = ['최신순', '인기순']

export default function MagazinePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('전체')
  const [seriesOpen, setSeriesOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)
  const [selectedSeries, setSelectedSeries] = useState('시리즈')
  const [selectedSort, setSelectedSort] = useState('최신순')

  const filtered = MAGAZINE_ARTICLES.filter(a => activeTab === '전체' || a.tab === activeTab)

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">
      {/* 헤더 */}
      <div className="relative flex items-center h-[60px] px-4 pt-14">
        <button
          onClick={() => router.push('/feed')}
          className="absolute left-4 flex items-center justify-center w-8 h-8"
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <p className="flex-1 text-center text-[20px] font-bold text-[#2a0b04]">니터즈 매거진</p>
      </div>

      {/* 탭 바 */}
      <div className="flex px-4 border-b border-[#f0f0f0] mt-3">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="relative py-3 mr-4 text-[16px] tracking-[-0.48px] font-semibold"
            style={{ color: activeTab === tab ? '#f72e00' : '#9d9d9d' }}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f72e00] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 필터 행 */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* 시리즈 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => { setSeriesOpen(v => !v); setSortOpen(false) }}
            className="flex items-center gap-[6px] h-[30px] px-[10px] bg-[#eff0f0] rounded-[10px]"
          >
            <span className="text-[12px] font-medium text-[#6a6a6a] tracking-[-0.36px]">{selectedSeries}</span>
            <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
              <path d="M1 1l2.5 2.5L6 1" stroke="#6a6a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {seriesOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSeriesOpen(false)} />
              <div className="absolute top-9 left-0 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] z-20 w-24 overflow-hidden">
                {SERIES_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedSeries(opt === '전체' ? '시리즈' : opt); setSeriesOpen(false) }}
                    className="w-full text-left px-3 py-2 text-[13px] font-medium"
                    style={{ color: (opt === '전체' ? '시리즈' : opt) === selectedSeries ? '#f72e00' : '#212121' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* 최신순 드롭다운 */}
        <div className="relative">
          <button
            onClick={() => { setSortOpen(v => !v); setSeriesOpen(false) }}
            className="flex items-center gap-[6px] h-[30px] px-[10px]"
          >
            <span className="text-[12px] font-medium text-[#6a6a6a] tracking-[-0.36px]">{selectedSort}</span>
            <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
              <path d="M1 1l2.5 2.5L6 1" stroke="#6a6a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {sortOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
              <div className="absolute top-9 right-0 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] z-20 w-24 overflow-hidden">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSelectedSort(opt); setSortOpen(false) }}
                    className="w-full text-left px-3 py-2 text-[13px] font-medium"
                    style={{ color: opt === selectedSort ? '#f72e00' : '#212121' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 아티클 리스트 */}
      <div className="flex flex-col gap-8 px-4">
        {filtered.map(article => (
          <button
            key={article.id}
            onClick={() => router.push(`/magazine/${article.id}`)}
            className="flex flex-col gap-3 text-left"
          >
            <div className="w-full h-[240px] bg-[#d9d9d9] rounded-[10px]" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="text-[12px] font-semibold text-[#6a6a6a] tracking-[-0.36px]">{article.series}</span>
                <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                  <path d="M1 1l3 3.5-3 3.5" stroke="#6a6a6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-[#212121] tracking-[-0.48px] leading-[1.31]">{article.title}</p>
              <p className="text-[14px] font-medium text-[#212121] tracking-[-0.42px] leading-[1.31]">{article.subtitle}</p>
              <p className="text-[12px] text-[#9d9d9d] tracking-[-0.36px] leading-[1.31]">{article.date}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
