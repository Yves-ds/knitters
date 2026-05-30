'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

const SEARCH_TABS = ['커뮤니티', '함뜨해요'] as const

const INITIAL_RECENT = ['단추', '울 니트 키트']

const POPULAR = [
  { rank: 1, keyword: '코바늘 모티브' },
  { rank: 2, keyword: '대바늘 목폴라' },
  { rank: 3, keyword: '아이누 실' },
  { rank: 4, keyword: '게이지 맞추기' },
  { rank: 5, keyword: '스트라이프 양말' },
  { rank: 6, keyword: '메리야스 뜨기' },
  { rank: 7, keyword: '펠팅 실' },
  { rank: 8, keyword: '비즈 뜨개' },
  { rank: 9, keyword: '핑거링 실' },
  { rank: 10, keyword: '블로킹 방법' },
]

const RECOMMENDED = ['목도리', '미트장갑', '레이스 숄', '베이비 슈즈']

export default function CommunitySearchPage() {
  const router = useRouter()
  const [tab, setTab] = useState<typeof SEARCH_TABS[number]>('커뮤니티')
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>(INITIAL_RECENT)
  const [saveEnabled, setSaveEnabled] = useState(true)

  const removeRecent = (keyword: string) =>
    setRecentSearches(prev => prev.filter(k => k !== keyword))

  const handleSearch = (keyword: string) => {
    if (!keyword.trim()) return
    if (saveEnabled && !recentSearches.includes(keyword)) {
      setRecentSearches(prev => [keyword, ...prev].slice(0, 10))
    }
    setQuery(keyword)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 검색바 + 취소 */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-3">
        <div className="flex-1 flex items-center gap-2 bg-[#ededed] rounded-[10px] px-3 h-10">
          <Search size={16} className="text-[#9e9e9e] shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(query)}
            placeholder="검색어를 입력해주세요"
            className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#9e9e9e] outline-none"
          />
          {query.length > 0 && (
            <button onClick={() => setQuery('')}>
              <X size={15} className="text-[#9e9e9e]" />
            </button>
          )}
        </div>
        <button
          onClick={() => router.back()}
          className="text-[#f72e00] text-[14px] font-medium shrink-0"
        >
          취소
        </button>
      </div>

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
          {RECOMMENDED.map(keyword => (
            <button
              key={keyword}
              onClick={() => handleSearch(keyword)}
              className="h-8 px-3 rounded-full border border-[#e0e0e0] text-[13px] text-[#212121] bg-white"
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
    </div>
  )
}
