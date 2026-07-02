'use client'
import { useState } from 'react'
import { mockExploreItems, mockBrands } from '@/lib/mockData'

type Tab = '도안' | '실' | '바늘' | '브랜드'
const TABS: Tab[] = ['도안', '실', '바늘', '브랜드']

type PriceFilter = '전체' | '무료' | '유료'
type SortFilter = '인기순' | '최신순'

/* ── 아이콘 ── */
function HeartIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 18 19" fill="none">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#FBB4A4"/>
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="#9A9A9A" strokeWidth="1.8" />
      <path d="M15.5 15.5L20 20" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M7 12h10M10 18h4" stroke="#343434" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3h6v6M10 14L21 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
        fill={active ? '#FBB4A4' : 'none'}
        stroke={active ? '#F72E00' : '#CFCFCF'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SmallHeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

/* ── 필터 바텀 시트 ── */
function FilterSheet({
  isOpen,
  onClose,
  price,
  onPriceChange,
  sort,
  onSortChange,
}: {
  isOpen: boolean
  onClose: () => void
  price: PriceFilter
  onPriceChange: (v: PriceFilter) => void
  sort: SortFilter
  onSortChange: (v: SortFilter) => void
}) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      )}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white rounded-t-[20px] z-50 px-5 pt-3 pb-10"
        style={{
          transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div className="w-10 h-1 bg-[#E0DCD3] rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-6">
          <span className="text-[18px] font-bold text-[#2A0B04]">필터</span>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="#343434" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 가격 */}
        <div className="mb-6">
          <p className="text-[14px] font-semibold text-[#2A0B04] mb-3">가격</p>
          <div className="flex gap-2">
            {(['전체', '무료', '유료'] as PriceFilter[]).map(opt => (
              <button
                key={opt}
                onClick={() => onPriceChange(opt)}
                className="h-8 px-4 rounded-[10px] text-[13px] font-medium transition-colors"
                style={
                  price === opt
                    ? { background: '#F72E00', color: '#fff' }
                    : { background: '#F0F0F0', color: '#646464' }
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 정렬 */}
        <div className="mb-8">
          <p className="text-[14px] font-semibold text-[#2A0B04] mb-3">정렬</p>
          <div className="flex gap-2">
            {(['인기순', '최신순'] as SortFilter[]).map(opt => (
              <button
                key={opt}
                onClick={() => onSortChange(opt)}
                className="h-8 px-4 rounded-[10px] text-[13px] font-medium transition-colors"
                style={
                  sort === opt
                    ? { background: '#F72E00', color: '#fff' }
                    : { background: '#F0F0F0', color: '#646464' }
                }
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full h-[52px] rounded-[10px] bg-[#F72E00] text-white text-[15px] font-semibold active:opacity-80"
        >
          적용하기
        </button>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════ */
export default function ExplorePage() {
  const [tab, setTab] = useState<Tab>('도안')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [heartActive, setHeartActive] = useState(false)
  const [price, setPrice] = useState<PriceFilter>('전체')
  const [sort, setSort] = useState<SortFilter>('인기순')
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(
    Object.fromEntries(mockBrands.map(b => [b.id, b.bookmarked]))
  )

  const toggleBookmark = (id: string) =>
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }))

  const productItems = tab !== '브랜드' ? mockExploreItems[tab as '도안' | '실' | '바늘'] : []
  const filteredItems = productItems.filter(item => {
    if (search && !item.name.includes(search) && !item.brand.includes(search)) return false
    return true
  })
  const sortedItems = [...filteredItems].sort((a, b) =>
    sort === '인기순' ? b.likes - a.likes : 0
  )

  const filteredBrands = mockBrands.filter(b =>
    !search || b.nameKo.includes(search) || b.nameEn.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white pb-28 max-w-[393px] mx-auto">

      {/* 헤더 */}
      <div className="bg-white px-4 pt-14 pb-3 flex items-center justify-between">
        <span className="text-[24px] font-bold text-[#2A0B04]">탐색</span>
        <button onClick={() => setHeartActive(v => !v)} className="active:opacity-60">
          <HeartIcon active={heartActive} />
        </button>
      </div>

      {/* 텍스트 탭 */}
      <div className="bg-white border-b border-[#F0F0F0] flex px-4">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearch('') }}
            className="flex-1 py-3 text-[15px] font-semibold transition-colors relative"
            style={{ color: tab === t ? '#F72E00' : '#9A9A9A' }}
          >
            {t}
            {tab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F72E00] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 검색 + 필터 */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-[#F0F0F0]">
        <div className="flex-1 flex items-center gap-2 bg-[#F6F6F6] rounded-[10px] px-3 h-[42px]">
          <SearchIcon />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="키워드 검색"
            className="flex-1 bg-transparent text-[14px] text-[#343434] placeholder-[#9A9A9A] outline-none"
          />
        </div>
        <button
          onClick={() => setFilterOpen(true)}
          className="w-[42px] h-[42px] flex items-center justify-center bg-[#F6F6F6] rounded-[10px] active:opacity-60 shrink-0"
        >
          <FilterIcon />
        </button>
      </div>

      {/* 상품 피드 — 도안/실/바늘 (3열 그리드) */}
      {tab !== '브랜드' && (
        <div className="px-4 pt-4">
          {sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <span className="text-[32px]">🔍</span>
              <p className="text-[15px] font-semibold text-[#2A0B04]">검색 결과가 없어요</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {sortedItems.map(item => (
                <div key={item.id} className="flex flex-col">
                  {/* 정사각 이미지 */}
                  <div
                    className="relative w-full rounded-[10px] overflow-hidden"
                    style={{ aspectRatio: '1/1', background: item.bg }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[28px] opacity-40">🧶</span>
                    </div>
                    {/* 외부 링크 버튼 */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="absolute top-[6px] right-[6px] w-[22px] h-[22px] rounded-full bg-black/40 flex items-center justify-center active:opacity-70"
                    >
                      <ExternalLinkIcon />
                    </a>
                  </div>
                  {/* 텍스트 */}
                  <div className="mt-[6px]">
                    <p className="text-[13px] font-semibold text-[#2A0B04] leading-snug line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#9A9A9A] mt-0.5">{item.brand}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <SmallHeartIcon />
                      <span className="text-[11px] text-[#9A9A9A]">
                        {item.likes.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 브랜드 피드 — 1행 리스트 */}
      {tab === '브랜드' && (
        <div className="px-4 pt-2">
          {filteredBrands.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <span className="text-[32px]">🔍</span>
              <p className="text-[15px] font-semibold text-[#2A0B04]">검색 결과가 없어요</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {filteredBrands.map((brand, idx) => (
                <div key={brand.id}>
                  {idx > 0 && <div className="h-px bg-[#F0F0F0]" />}
                  <div className="flex items-center gap-4 py-4">
                    {/* 정사각 이미지 */}
                    <div
                      className="w-[60px] h-[60px] rounded-[10px] flex items-center justify-center shrink-0"
                      style={{ background: brand.bg }}
                    >
                      <span className="text-[24px] opacity-50">🏷️</span>
                    </div>
                    {/* 텍스트 */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold text-[#2A0B04]">{brand.nameKo}</p>
                      <p className="text-[13px] text-[#9A9A9A] mt-0.5">{brand.nameEn}</p>
                    </div>
                    {/* 즐겨찾기 버튼 */}
                    <button
                      onClick={() => toggleBookmark(brand.id)}
                      className="shrink-0 active:opacity-60"
                    >
                      <BookmarkIcon active={bookmarks[brand.id]} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 필터 바텀 시트 */}
      <FilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        price={price}
        onPriceChange={setPrice}
        sort={sort}
        onSortChange={setSort}
      />
    </div>
  )
}
