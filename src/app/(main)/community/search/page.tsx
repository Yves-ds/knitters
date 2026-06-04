'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, ChevronLeft, ChevronDown } from 'lucide-react'

const SEARCH_TABS = ['커뮤니티', '함뜨해요'] as const
type SearchTab = typeof SEARCH_TABS[number]

const INITIAL_RECENT = ['단추', '울 니트 키트']

const RECOMMENDED: Record<SearchTab, string[]> = {
  '커뮤니티': ['실 추천', '초보 추천', '가디건 도안', '코바늘 팁', '뜨개 완성', '대바늘 입문', '실 풀림', '도안 보는 법'],
  '함뜨해요': ['온라인 뜨개', '초보 환영', '숄 뜨기', '주말 뜨개 모임', '오프라인 모임', '케이블 니트', '요가', '함뜨 카페'],
}

const POPULAR = [
  { rank: 1, keyword: '도안 가이드' },
  { rank: 2, keyword: '실 추천' },
  { rank: 3, keyword: '코 줍는 방법' },
  { rank: 4, keyword: '초보 질문' },
  { rank: 5, keyword: '완성 인증' },
  { rank: 6, keyword: '실 합사 방법' },
  { rank: 7, keyword: '뜨개 슬럼프' },
  { rank: 8, keyword: '코튼사' },
  { rank: 9, keyword: '여름 콘사' },
  { rank: 10, keyword: '뷔스티에 도안' },
]

const FILTER_CATEGORIES = ['전체', '뜨개 질문', '뜨개 잡담', '자투리 마켓', '구매 후기', '완성 인증']

function CommunitySearchInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') === '함뜨해요' ? '함뜨해요' : '커뮤니티') as SearchTab

  const [tab, setTab] = useState<SearchTab>(initialTab)
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT)
  const [saveEnabled, setSaveEnabled] = useState(true)
  const [activeFilter, setActiveFilter] = useState('전체')

  const isResultView = submittedQuery.length > 0
  const isHamtto = tab === '함뜨해요'

  const removeRecent = (keyword: string) =>
    setRecentSearches(prev => prev.filter(k => k !== keyword))

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return
    if (saveEnabled && !recentSearches.includes(keyword)) {
      setRecentSearches(prev => [keyword, ...prev].slice(0, 10))
    }
    setQuery(keyword)
    setSubmittedQuery(keyword)
  }

  const handleClear = () => {
    setQuery('')
    setSubmittedQuery('')
    setActiveFilter('전체')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 검색바 */}
      <div className="flex items-center gap-2 px-4 pt-14 pb-3">
        {isResultView && (
          <button onClick={handleClear} className="shrink-0">
            <ChevronLeft size={24} className="text-[#212121]" />
          </button>
        )}
        <div className="flex-1 flex items-center gap-2 bg-[#ededed] rounded-[10px] px-3 h-10">
          <Search size={16} className="text-[#9e9e9e] shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => { setQuery(e.target.value); if (!e.target.value) setSubmittedQuery('') }}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder="검색어를 입력해주세요"
            className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#9e9e9e] outline-none"
          />
          {query.length > 0 && (
            <button onClick={handleClear}>
              <X size={15} className="text-[#9e9e9e]" />
            </button>
          )}
        </div>
        <button
          onClick={() => router.push(`/community?tab=${initialTab}`)}
          className="text-[#f72e00] text-[14px] font-medium shrink-0"
        >
          취소
        </button>
      </div>

      {/* ── 결과 뷰 ── */}
      {isResultView ? (
        <>
          {/* 필터 칩 */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-none">
            {/* 정렬 버튼 */}
            <button className="flex items-center gap-1 h-8 px-3 rounded-full shrink-0 text-[13px] font-medium"
              style={{ background: '#feeae5', color: '#f72e00' }}>
              최신순 <ChevronDown size={13} />
            </button>
            {FILTER_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="h-8 px-3 rounded-full shrink-0 text-[13px] font-medium transition-colors"
                style={
                  activeFilter === cat
                    ? { background: '#feeae5', color: '#f72e00' }
                    : { background: 'white', color: '#212121', border: '1px solid #e0e0e0' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 빈 결과 */}
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span className="text-5xl mb-2">🔍</span>
            <p className="text-[15px] text-[#212121] font-medium text-center">
              <span className="font-bold">{submittedQuery}</span>에 대한 검색 결과가 없어요
            </p>
            <p className="text-[13px] text-[#a7a7a7]">다른 검색어를 입력해보세요</p>
          </div>

          <div className="h-px bg-[#efefef] mx-4" />

          {/* 추천 키워드 */}
          <div className="px-4 pt-5 pb-4">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[16px] font-bold text-[#212121]">추천 키워드</span>
              <span className="text-[12px] text-[#a7a7a7]">최근 검색 내역 기반으로 골라봤어요.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDED[tab].map(keyword => (
                <button
                  key={keyword}
                  onClick={() => handleSearch(keyword)}
                  className="h-8 px-3 rounded-full text-[13px] font-medium"
                  style={{ background: '#feeae5', color: '#f72e00' }}
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#efefef] mx-4" />

          {/* 인기 검색어 */}
          <div className="px-4 pt-5 pb-8">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[16px] font-bold text-[#212121]">인기 검색어</span>
              <span className="text-[12px] text-[#a7a7a7]">17시 기준</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8">
              {POPULAR.map(item => (
                <button
                  key={item.rank}
                  onClick={() => handleSearch(item.keyword)}
                  className="flex items-center gap-3 py-2.5 text-left"
                >
                  <span
                    className="text-[14px] font-bold w-5 shrink-0"
                    style={{ color: item.rank <= 3 ? '#f72e00' : '#a7a7a7' }}
                  >
                    {item.rank}
                  </span>
                  <span className="text-[14px] text-[#212121] truncate">{item.keyword}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      ) : (
        /* ── 제안 뷰 ── */
        <>
          {/* 탭 */}
          <div className="flex border-b border-[#efefef]">
            {SEARCH_TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 pb-3 text-[14px] font-semibold transition-all"
                style={{
                  color: tab === t ? '#f72e00' : '#a7a7a7',
                  borderBottom: tab === t ? '2px solid #f72e00' : '2px solid transparent',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 최근 검색어 */}
          <div className="px-4 pt-5 pb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[16px] font-bold text-[#212121]">최근 검색어</span>
              <button
                onClick={() => setSaveEnabled(prev => !prev)}
                className="text-[12px] text-[#a7a7a7]"
              >
                {saveEnabled ? '저장 기능 끄기' : '저장 기능 켜기'}
              </button>
            </div>
            {recentSearches.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(keyword => (
                  <button
                    key={keyword}
                    onClick={() => handleSearch(keyword)}
                    className="flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#e0e0e0] text-[13px] text-[#212121] bg-white"
                  >
                    {keyword}
                    <span
                      className="text-[#9e9e9e]"
                      onClick={e => { e.stopPropagation(); removeRecent(keyword) }}
                    >
                      <X size={13} />
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#a7a7a7]">최근 검색어가 없습니다.</p>
            )}
          </div>

          <div className="h-px bg-[#efefef] mx-4" />

          {/* 추천 키워드 */}
          <div className="px-4 pt-5 pb-4">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[16px] font-bold text-[#212121]">추천 키워드</span>
              <span className="text-[12px] text-[#a7a7a7]">최근 검색 내역 기반으로 골라봤어요.</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECOMMENDED[tab].map(keyword => (
                <button
                  key={keyword}
                  onClick={() => handleSearch(keyword)}
                  className="h-8 px-3 rounded-full text-[13px] transition-colors"
                  style={
                    isHamtto
                      ? { background: '#feeae5', color: '#f72e00' }
                      : { background: 'white', color: '#212121', border: '1px solid #e0e0e0' }
                  }
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#efefef] mx-4" />

          {/* 인기 검색어 */}
          <div className="px-4 pt-5 pb-8">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-[16px] font-bold text-[#212121]">인기 검색어</span>
              <span className="text-[12px] text-[#a7a7a7]">17시 기준</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8">
              {POPULAR.map(item => (
                <button
                  key={item.rank}
                  onClick={() => handleSearch(item.keyword)}
                  className="flex items-center gap-3 py-2.5 text-left"
                >
                  <span
                    className="text-[14px] font-bold w-5 shrink-0"
                    style={{ color: item.rank <= 3 ? '#f72e00' : '#a7a7a7' }}
                  >
                    {item.rank}
                  </span>
                  <span className="text-[14px] text-[#212121] truncate">{item.keyword}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function CommunitySearchPage() {
  return (
    <Suspense>
      <CommunitySearchInner />
    </Suspense>
  )
}
