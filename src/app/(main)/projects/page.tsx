'use client'
import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { X, Plus } from 'lucide-react'
import { mockProjects } from '@/lib/mockData'

type SortKey = '생성일' | '제목' | '시작일' | '종료일'
type StatusDisplay = '전체' | '시작 안 함' | '열뜨 중' | '쉬는 중' | '완성'

const SORT_OPTIONS: SortKey[] = ['생성일', '제목', '시작일', '종료일']
const STATUS_OPTIONS: StatusDisplay[] = ['전체', '시작 안 함', '열뜨 중', '쉬는 중', '완성']

// 표시 이름 → 데이터 값 매핑
const STATUS_DATA: Record<StatusDisplay, string> = {
  '전체': '전체',
  '시작 안 함': '시작 안 함',
  '열뜨 중': '진행 중',
  '쉬는 중': '쉬는 중',
  '완성': '완성',
}

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

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="5.5" stroke="#FFAF9D" strokeWidth="2"/>
      <path d="M15 15L19 19" stroke="#FFAF9D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function SortIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5.00245C8.73478 5.00245 8.48043 5.10781 8.29289 5.29534C8.10536 5.48288 8 5.73723 8 6.00245C8 6.26767 8.10536 6.52202 8.29289 6.70956C8.48043 6.89709 8.73478 7.00245 9 7.00245C9.26522 7.00245 9.51957 6.89709 9.70711 6.70956C9.89464 6.52202 10 6.26767 10 6.00245C10 5.73723 9.89464 5.48288 9.70711 5.29534C9.51957 5.10781 9.26522 5.00245 9 5.00245ZM6.17 5.00245C6.3766 4.41692 6.75974 3.90988 7.2666 3.55124C7.77346 3.1926 8.37909 3 9 3C9.62091 3 10.2265 3.1926 10.7334 3.55124C11.2403 3.90988 11.6234 4.41692 11.83 5.00245H19C19.2652 5.00245 19.5196 5.10781 19.7071 5.29534C19.8946 5.48288 20 5.73723 20 6.00245C20 6.26767 19.8946 6.52202 19.7071 6.70956C19.5196 6.89709 19.2652 7.00245 19 7.00245H11.83C11.6234 7.58798 11.2403 8.09502 10.7334 8.45366C10.2265 8.81231 9.62091 9.0049 9 9.0049C8.37909 9.0049 7.77346 8.81231 7.2666 8.45366C6.75974 8.09502 6.3766 7.58798 6.17 7.00245H5C4.73478 7.00245 4.48043 6.89709 4.29289 6.70956C4.10536 6.52202 4 6.26767 4 6.00245C4 5.73723 4.10536 5.48288 4.29289 5.29534C4.48043 5.10781 4.73478 5.00245 5 5.00245H6.17ZM15 11.0025C14.7348 11.0025 14.4804 11.1078 14.2929 11.2953C14.1054 11.4829 14 11.7372 14 12.0025C14 12.2677 14.1054 12.522 14.2929 12.7096C14.4804 12.8971 14.7348 13.0025 15 13.0025C15.2652 13.0025 15.5196 12.8971 15.7071 12.7096C15.8946 12.522 16 12.2677 16 12.0025C16 11.7372 15.8946 11.4829 15.7071 11.2953C15.5196 11.1078 15.2652 11.0025 15 11.0025ZM12.17 11.0025C12.3766 10.4169 12.7597 9.90988 13.2666 9.55124C13.7735 9.1926 14.3791 9 15 9C15.6209 9 16.2265 9.1926 16.7334 9.55124C17.2403 9.90988 17.6234 10.4169 17.83 11.0025H19C19.2652 11.0025 19.5196 11.1078 19.7071 11.2953C19.8946 11.4829 20 11.7372 20 12.0025C20 12.2677 19.8946 12.522 19.7071 12.7096C19.5196 12.8971 19.2652 13.0025 19 13.0025H17.83C17.6234 13.588 17.2403 14.095 16.7334 14.4537C16.2265 14.8123 15.6209 15.0049 15 15.0049C14.3791 15.0049 13.7735 14.8123 13.2666 14.4537C12.7597 14.095 12.3766 13.588 12.17 13.0025H5C4.73478 13.0025 4.48043 12.8971 4.29289 12.7096C4.10536 12.522 4 12.2677 4 12.0025C4 11.7372 4.10536 11.4829 4.29289 11.2953C4.48043 11.1078 4.73478 11.0025 5 11.0025H12.17ZM9 17.0025C8.73478 17.0025 8.48043 17.1078 8.29289 17.2953C8.10536 17.4829 8 17.7372 8 18.0025C8 18.2677 8.10536 18.522 8.29289 18.7096C8.48043 18.8971 8.73478 19.0025 9 19.0025C9.26522 19.0025 9.51957 18.8971 9.70711 18.7096C9.89464 18.522 10 18.2677 10 18.0025C10 17.7372 9.89464 17.4829 9.70711 17.2953C9.51957 17.1078 9.26522 17.0025 9 17.0025ZM6.17 17.0025C6.3766 16.4169 6.75974 15.9099 7.2666 15.5512C7.77346 15.1926 8.37909 15 9 15C9.62091 15 10.2265 15.1926 10.7334 15.5512C11.2403 15.9099 11.6234 16.4169 11.83 17.0025H19C19.2652 17.0025 19.5196 17.1078 19.7071 17.2953C19.8946 17.4829 20 17.7372 20 18.0025C20 18.2677 19.8946 18.522 19.7071 18.7096C19.5196 18.8971 19.2652 19.0025 19 19.0025H11.83C11.6234 19.588 11.2403 20.095 10.7334 20.4537C10.2265 20.8123 9.62091 21.0049 9 21.0049C8.37909 21.0049 7.77346 20.8123 7.2666 20.4537C6.75974 20.095 6.3766 19.588 6.17 19.0025H5C4.73478 19.0025 4.48043 18.8971 4.29289 18.7096C4.10536 18.522 4 18.2677 4 18.0025C4 17.7372 4.10536 17.4829 4.29289 17.2953C4.48043 17.1078 4.73478 17.0025 5 17.0025H6.17Z" fill="#FFAF9D"/>
    </svg>
  )
}

export default function ProjectsPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('생성일')
  const [statusDisplay, setStatusDisplay] = useState<StatusDisplay>('전체')
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = useMemo(() => {
    const dataStatus = STATUS_DATA[statusDisplay]
    let list = [...mockProjects]
    if (query.trim()) list = list.filter(p => p.title.includes(query.trim()))
    if (dataStatus !== '전체') list = list.filter(p => p.status === dataStatus)
    list.sort((a, b) => {
      if (sortKey === '제목') return a.title.localeCompare(b.title)
      if (sortKey === '시작일') return (a.startDate || '').localeCompare(b.startDate || '')
      if (sortKey === '종료일') return (a.endDate || '').localeCompare(b.endDate || '')
      return parseInt(a.id) - parseInt(b.id)
    })
    return list
  }, [query, statusDisplay, sortKey])

  const closeSearch = () => { setSearchOpen(false); setQuery('') }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28">

      {/* 헤더 */}
      <div className="px-4 pt-14 pb-3">
        {searchOpen ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#ededed] rounded-[10px] px-3 h-10">
              <SearchIcon />
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
          <div className="flex items-start justify-between">
            <p className="text-[30px] font-bold text-[#212121] tracking-[-0.5px] leading-tight">오늘은 어떤 작품을<br />떠볼까요?</p>
            <div className="flex items-center gap-2 pt-1">
              <button onClick={() => setSearchOpen(true)} className="w-8 h-8 flex items-center justify-center">
                <SearchIcon />
              </button>
              <button onClick={() => setSortPanelOpen(true)} className="w-8 h-8 flex items-center justify-center">
                <SortIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 총 작품 수 */}
      <div className="px-4 pb-4 pt-[60px]">
        <p className="text-[14px] text-[#565656]">
          <span className="font-bold text-[#212121]">{mockProjects.length}</span>
          <span className="font-normal"> 개의 작품을 뜨고 있어요</span>
        </p>
      </div>

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
                  <div className="aspect-square w-full bg-[#f5f5f5] flex items-center justify-center text-5xl">
                    {(project as any).emoji ?? '🧶'}
                  </div>
                  <div className="px-3 py-2.5">
                    <div className="flex items-center gap-1.5 mb-1 min-w-0">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] shrink-0"
                        style={{
                          color: STATUS_DOT[project.status] ?? '#b0b0b0',
                          background: `${STATUS_DOT[project.status] ?? '#b0b0b0'}1a`,
                        }}
                      >
                        {project.status}
                      </span>
                      <p className="text-[13px] font-semibold text-[#212121] truncate">{project.title}</p>
                    </div>
                    <p className="text-[12px] text-[#a7a7a7] font-medium tracking-wide">00:00:00</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 정렬 패널 */}
      {sortPanelOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSortPanelOpen(false)}
          />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[20px] z-50 pb-10">
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#e0e0e0] rounded-full" />
            </div>

            {/* 날짜·제목 정렬 */}
            <div className="px-6 pt-3 pb-2">
              <p className="text-[13px] font-semibold text-[#a7a7a7] mb-3">날짜 · 제목 정렬</p>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSortKey(opt); setSortPanelOpen(false) }}
                  className="w-full text-left py-3 text-[18px] font-medium transition-colors"
                  style={{ color: sortKey === opt ? '#f72e00' : '#212121' }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="mx-6 h-px bg-[#f0f0f0] my-2" />

            {/* 진행상황 별 정렬 */}
            <div className="px-6 pt-2 pb-2">
              <p className="text-[13px] font-semibold text-[#a7a7a7] mb-3">진행상황 별 정렬</p>
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setStatusDisplay(opt); setSortPanelOpen(false) }}
                  className="w-full text-left py-3 text-[18px] font-medium transition-colors"
                  style={{ color: statusDisplay === opt ? '#f72e00' : '#212121' }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      <Link
        href="/projects/new"
        className="fixed bottom-[100px] flex items-center justify-center bg-[#f72e00] text-white font-semibold text-[14px] shadow-lg shadow-[#f72e00]/30 active:scale-95 z-30"
        style={{
          right: 'max(16px, calc(50% - 224px))',
          borderRadius: scrolled ? '50%' : '16px',
          width: scrolled ? '52px' : 'auto',
          height: scrolled ? '52px' : 'auto',
          padding: scrolled ? '0' : '14px 20px',
          gap: scrolled ? '0' : '8px',
          transition: 'border-radius 0.25s, width 0.25s, height 0.25s, padding 0.25s',
        }}
      >
        <Plus size={18} strokeWidth={2.5} />
        {!scrolled && '기록하기'}
      </Link>
    </div>
  )
}
