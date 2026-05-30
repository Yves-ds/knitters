'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, X, ChevronDown, Plus } from 'lucide-react'
import { mockProjects } from '@/lib/mockData'

type Status = '전체' | '시작 안 함' | '진행 중' | '쉬는 중' | '완성'
type SortKey = '생성일' | '제목' | '시작일' | '종료일'

const STATUS_FILTERS: Status[] = ['전체', '시작 안 함', '진행 중', '쉬는 중', '완성']
const SORT_OPTIONS: SortKey[] = ['생성일', '제목', '시작일', '종료일']

const STATUS_DOT: Record<string, string> = {
  '시작 안 함': '#b0b0b0',
  '진행 중':    '#4A90D9',
  '쉬는 중':    '#FF8C69',
  '완성':       '#3CB371',
}

function formatDateRange(start: string, end: string, status: string) {
  if (!start && !end) return '날짜 미정'
  if (start && !end) return status === '완성' ? start : `${start} ~ 진행 중`
  return `${start} ~ ${end}`
}

export default function ProjectsPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Status>('전체')
  const [sortKey, setSortKey] = useState<SortKey>('생성일')
  const [sortOpen, setSortOpen] = useState(false)

  const filtered = useMemo(() => {
    let list = [...mockProjects]
    if (query.trim()) list = list.filter(p => p.title.includes(query.trim()))
    if (statusFilter !== '전체') list = list.filter(p => p.status === statusFilter)
    list.sort((a, b) => {
      if (sortKey === '제목') return a.title.localeCompare(b.title)
      if (sortKey === '시작일') return (a.startDate || '').localeCompare(b.startDate || '')
      if (sortKey === '종료일') return (a.endDate || '').localeCompare(b.endDate || '')
      return parseInt(a.id) - parseInt(b.id)
    })
    return list
  }, [query, statusFilter, sortKey])

  const closeSearch = () => { setSearchOpen(false); setQuery('') }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28">

      {/* 헤더 */}
      <div className="px-4 pt-14 pb-3">
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#ededed] rounded-[10px] px-3 h-10">
              <Search size={15} className="text-[#9e9e9e] shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="프로젝트 이름 검색"
                className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#b0b0b0] outline-none"
              />
              {query && (
                <button onClick={() => setQuery('')}>
                  <X size={14} className="text-[#9e9e9e]" />
                </button>
              )}
            </div>
            <button onClick={closeSearch} className="text-[14px] font-medium text-[#f72e00] shrink-0">취소</button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-[22px] font-bold text-[#212121] tracking-[-0.5px]">오늘은 어떤 작품을 떠볼까요?</p>
            <button onClick={() => setSearchOpen(true)} className="w-8 h-8 flex items-center justify-center">
              <Search size={20} className="text-[#212121]" />
            </button>
          </div>
        )}
      </div>

      {/* 총 작품 수 */}
      <div className="px-4 pb-3">
        <p className="text-[14px] text-[#565656]">
          <span className="font-bold text-[#212121]">{mockProjects.length}</span>
          <span className="font-normal"> 개의 작품을 뜨고 있어요</span>
        </p>
      </div>

      {/* 정렬 + 상태 필터 */}
      <div className="px-4 pb-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <div className="relative shrink-0">
          <button
            onClick={() => setSortOpen(v => !v)}
            className="flex items-center gap-1 h-8 px-3 rounded-full text-[13px] font-medium border border-[#e0e0e0] bg-white text-[#212121]"
          >
            {sortKey} <ChevronDown size={13} />
          </button>
          {sortOpen && (
            <div className="absolute top-10 left-0 bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] z-20 w-28 overflow-hidden">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSortKey(opt); setSortOpen(false) }}
                  className="w-full text-left px-4 py-2.5 text-[13px] font-medium"
                  style={{ color: sortKey === opt ? '#f72e00' : '#212121' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
        {STATUS_FILTERS.map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="h-8 px-3 rounded-full shrink-0 text-[13px] font-medium transition-colors"
            style={
              statusFilter === s
                ? { background: '#f72e00', color: '#fff' }
                : { background: 'white', color: '#646464', border: '1px solid #e0e0e0' }
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* 드롭다운 오버레이 */}
      {sortOpen && <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />}

      {/* 프로젝트 카드 2열 그리드 */}
      <div className="px-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">🧶</span>
            <p className="text-[14px] text-[#a7a7a7]">
              {query ? `"${query}"에 해당하는 작품이 없어요` : '해당하는 작품이 없어요'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05)] active:scale-[0.98] transition-all">
                  {/* 이미지 / 이모지 영역 — 정사각형 */}
                  <div className="aspect-square w-full bg-[#f5f5f5] flex items-center justify-center text-5xl">
                    {(project as any).emoji ?? '🧶'}
                  </div>
                  {/* 프로젝트 이름 + 타이머 */}
                  <div className="px-3 py-2.5">
                    <p className="text-[13px] font-semibold text-[#212121] truncate mb-1">{project.title}</p>
                    <p className="text-[12px] text-[#a7a7a7] font-medium tracking-wide">00:00:00</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/projects/new"
        className="fixed bottom-[100px] flex items-center gap-2 bg-[#f72e00] text-white font-semibold text-[14px] px-5 py-3.5 rounded-2xl shadow-lg shadow-[#f72e00]/30 active:scale-95 transition-all z-30"
        style={{ right: 'max(16px, calc(50% - 224px))' }}
      >
        <Plus size={18} strokeWidth={2.5} />
        기록하기
      </Link>
    </div>
  )
}
