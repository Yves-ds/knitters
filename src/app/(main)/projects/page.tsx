'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { X, Plus } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

type SortKey = '생성일' | '제목' | '시작일' | '종료일'
type StatusDisplay = '전체' | '준비 중' | '뜨는 중' | '쉬는 중' | '완성'

const SORT_OPTIONS: SortKey[] = ['생성일', '제목', '시작일', '종료일']
const STATUS_OPTIONS: StatusDisplay[] = ['전체', '준비 중', '뜨는 중', '쉬는 중', '완성']

const STATUS_DATA: Record<StatusDisplay, string> = {
  '전체': '전체',
  '준비 중': '준비 중',
  '뜨는 중': '뜨는 중',
  '쉬는 중': '쉬는 중',
  '완성': '완성',
}

// 데이터값 → 카드 표시 이름
const STATUS_LABEL: Record<string, string> = {
  '준비 중': '준비 중',
  '뜨는 중': '뜨는 중',
  '쉬는 중': '쉬는 중',
  '완성': '완성',
}

const STATUS_COLOR: Record<string, string> = {
  '준비 중': '#b0b0b0',
  '뜨는 중': '#F72E00',
  '쉬는 중': '#FF8C69',
  '완성': '#3CB371',
}

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function formatDateRange(start: string, end: string, status: string) {
  if (!start && !end) return '날짜 미정'
  if (start && !end) return status === '완성' ? start : `${start} ~ 진행 중`
  return `${start} ~ ${end}`
}

function SearchIcon({ color = '#FFAF9D' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="5.5" stroke={color} strokeWidth="2"/>
      <path d="M15 15L19 19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
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
  const { projects } = useProjectStore()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('생성일')
  const [statusDisplay, setStatusDisplay] = useState<StatusDisplay>('전체')
  const [sortPanelOpen, setSortPanelOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchOpen])

  const filtered = useMemo(() => {
    const dataStatus = STATUS_DATA[statusDisplay]
    let list = [...projects]
    if (query.trim()) list = list.filter(p => p.title.includes(query.trim()))
    if (dataStatus !== '전체') list = list.filter(p => p.status === dataStatus)
    list.sort((a, b) => {
      if (sortKey === '제목') return a.title.localeCompare(b.title)
      if (sortKey === '시작일') return (a.startDate || '').localeCompare(b.startDate || '')
      if (sortKey === '종료일') return (a.endDate || '').localeCompare(b.endDate || '')
      return (b.createdAt ?? 0) - (a.createdAt ?? 0)
    })
    return list
  }, [projects, query, statusDisplay, sortKey])

  const closeSearch = () => { setSearchOpen(false); setQuery('') }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">

      {/* 헤더 */}
      <div className="px-4 pt-14 relative">
        {/* 버튼 — overflow/transform 컨테이너 바깥에 absolute로 배치 */}
        <div className="absolute top-14 right-4 flex items-center gap-2 pt-1 z-50" style={{ display: searchOpen ? 'none' : 'flex' }}>
          <button onClick={() => setSearchOpen(true)} className="w-8 h-8 flex items-center justify-center">
            <SearchIcon />
          </button>
          <div className="relative">
            <button onClick={() => setSortPanelOpen(v => !v)} className="w-8 h-8 flex items-center justify-center">
              <SortIcon />
            </button>
            {sortPanelOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSortPanelOpen(false)} />
                <div className="absolute top-10 right-0 bg-white rounded-[14px] shadow-[0_4px_24px_rgba(0,0,0,0.14)] z-50 w-44 overflow-hidden py-2">
                  <p className="text-[11px] font-semibold text-[#a7a7a7] px-4 pt-2 pb-1">날짜 · 제목 정렬</p>
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortKey(opt); setSortPanelOpen(false) }}
                      className="w-full text-left px-4 py-[8px] text-[15px] font-medium"
                      style={{ color: sortKey === opt ? '#f72e00' : '#212121' }}>
                      {opt}
                    </button>
                  ))}
                  <div className="mx-4 h-px bg-[#f0f0f0] my-1" />
                  <p className="text-[11px] font-semibold text-[#a7a7a7] px-4 pt-1 pb-1">진행상황 별 정렬</p>
                  {STATUS_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setStatusDisplay(opt); setSortPanelOpen(false) }}
                      className="w-full text-left px-4 py-[8px] text-[15px] font-medium"
                      style={{ color: statusDisplay === opt ? '#f72e00' : '#212121' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 타이틀 영역 — grid-template-rows 트릭으로 실제 높이에 맞게 부드럽게 접힘 */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: searchOpen ? '0fr' : '1fr',
            transition: 'grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              opacity: searchOpen ? 0 : 1,
              transform: searchOpen ? 'translateY(-6px)' : 'translateY(0)',
              transition: 'opacity 0.28s ease, transform 0.28s ease',
            }}
          >
          <div className="pb-3 pr-20">
            <p className="text-[26px] font-bold text-[#212121] tracking-[-0.5px] leading-tight">내 뜨개 프로젝트</p>
          </div>
          </div>
          </div>
        </div>

        {/* 검색창 — grid-template-rows 트릭으로 부드럽게 펼쳐짐 */}
        <div
          style={{
            display: 'grid',
            gridTemplateRows: searchOpen ? '1fr' : '0fr',
            transition: 'grid-template-rows 0.4s cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              opacity: searchOpen ? 1 : 0,
              transform: searchOpen ? 'translateY(0)' : 'translateY(-4px)',
              transition: 'opacity 0.3s ease 0.12s, transform 0.3s ease 0.12s',
            }}
          >
          <div className="flex items-center gap-2 pb-3">
            <div className="flex-1 flex items-center gap-2 bg-[#ededed] rounded-[10px] px-3 h-10">
              <SearchIcon color="#A2A2A2" />
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="프로젝트 이름을 입력하세요"
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
          </div>
          </div>
        </div>
      </div>

      {/* 라벨 + 카드 — 검색 시 위로 슬라이드 */}
      <div
        style={{
          paddingTop: searchOpen ? '12px' : '60px',
          transition: 'padding-top 0.42s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >

      {/* 검색 모드: '검색 결과' + 카드만 표시 */}
      {searchOpen ? (
        <>
          <div className="px-4 pb-4">
            <p className="text-[14px] font-bold text-[#212121]">검색 결과</p>
          </div>
          <div className="px-4">
            {filtered.length === 0 && query.trim() ? (
              <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-[14px] text-[#a7a7a7]">검색 결과가 없어요</p>
              </div>
            ) : filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filtered.map(project => {
                  const statusColor = STATUS_COLOR[project.status] ?? '#b0b0b0'
                  const statusLabel = STATUS_LABEL[project.status] ?? project.status
                  return (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all">
                        {project.coverPhoto ? (
                          <img src={project.coverPhoto} alt={project.title} className="aspect-square w-full object-cover" />
                        ) : (
                          <div className="aspect-square w-full bg-[#f0ede8] flex items-center justify-center text-6xl">
                            {project.emoji ?? '🧶'}
                          </div>
                        )}
                        <div className="px-3 pt-3 pb-3">
                          <p className="text-[15px] font-bold text-[#212121] mb-2 leading-snug line-clamp-1">{project.title}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                                <path d="M1 1.5L7 4.5L1 7.5V1.5Z" fill={statusColor} />
                              </svg>
                              <span className="text-[11px] font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
                            </div>
                            <span className="text-[13px] text-[#a7a7a7] font-medium tracking-wider">{formatTime(project.timerSecs ?? 0)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
        </>
      ) : (
        /* 일반 모드 */
        <>
          {projects.length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-[14px] text-[#565656]">
                <span className="font-bold text-[#212121]">{projects.length}</span>
                <span className="font-normal"> 개의 작품을 뜨고 있어요</span>
              </p>
            </div>
          )}
          <div className="px-4">
            {projects.length === 0 ? (
              <div className="relative" style={{ minHeight: '68vh' }}>
                {/* 고스트 카드 */}
                <div className="grid grid-cols-2 gap-3" style={{ opacity: 0.2, pointerEvents: 'none' }}>
                  {[
                    { emoji: '🧶', title: '리본 코어 스웨터', status: '완성', statusColor: '#3CB371', time: '02:34:10', bg: 'linear-gradient(135deg,#f8e8e0,#f0c8b8)' },
                    { emoji: '🌸', title: '코바늘 블랭킷', status: '뜨는 중', statusColor: '#F72E00', time: '08:29:40', bg: 'linear-gradient(135deg,#fce4ec,#f8bbd0)' },
                    { emoji: '🧣', title: '탠저린 니트', status: '쉬는 중', statusColor: '#FF8C69', time: '37:14:20', bg: 'linear-gradient(135deg,#fff3e0,#ffe0b2)' },
                    { emoji: '🐑', title: '올드 패션드 가디건', status: '준비 중', statusColor: '#b0b0b0', time: '42:10:00', bg: 'linear-gradient(135deg,#f3f0ec,#e8e4de)' },
                    { emoji: '💜', title: '퍼플 케이블 니트', status: '뜨는 중', statusColor: '#F72E00', time: '05:20:15', bg: 'linear-gradient(135deg,#f3e5f5,#e1bee7)' },
                    { emoji: '🌿', title: '그린 레이스 숄', status: '완성', statusColor: '#3CB371', time: '12:08:45', bg: 'linear-gradient(135deg,#e8f5e9,#c8e6c9)' },
                  ].map((card, i) => (
                    <div key={i} className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                      <div className="aspect-square w-full flex items-center justify-center text-6xl" style={{ background: card.bg }}>
                        {card.emoji}
                      </div>
                      <div className="px-3 pt-3 pb-3">
                        <p className="text-[15px] font-bold text-[#212121] mb-2 leading-snug line-clamp-1">{card.title}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                              <path d="M1 1.5L7 4.5L1 7.5V1.5Z" fill={card.statusColor} />
                            </svg>
                            <span className="text-[11px] font-semibold" style={{ color: card.statusColor }}>{card.status}</span>
                          </div>
                          <span className="text-[13px] text-[#a7a7a7] font-medium tracking-wider">{card.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 연한 오버레이 */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(250,248,246,0.72)' }} />

                {/* CTA 카드 */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ paddingBottom: 24 }}>
                  <div
                    className="bg-white rounded-[28px] px-8 py-9 flex flex-col items-center gap-4"
                    style={{
                      width: 'calc(100% - 32px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                    }}
                  >
                    <span className="text-[52px] leading-none">🧶</span>
                    <p className="text-[22px] font-bold text-[#212121] text-center leading-snug">
                      첫 뜨개 기록을<br />남겨보세요!
                    </p>
                    <p className="text-[14px] text-[#9CA3AF] text-center leading-relaxed">
                      새로 시작하는 작품부터 완성 작품까지<br />나의 뜨개 기록을 채워보세요.
                    </p>
                    <button
                      onClick={() => setSheetOpen(true)}
                      className="flex items-center gap-2 mt-1 h-[52px] px-10 rounded-full bg-[#F72E00] text-white text-[16px] font-bold active:opacity-80"
                    >
                      <Plus size={16} strokeWidth={2.5} />
                      기록하기
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filtered.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-[14px] text-[#a7a7a7]">
                    아직 기록된 작품이 없어요
                  </div>
                )}
                {filtered.map(project => {
                  const statusColor = STATUS_COLOR[project.status] ?? '#b0b0b0'
                  const statusLabel = STATUS_LABEL[project.status] ?? project.status
                  return (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <div className="bg-white rounded-[14px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all">
                        {project.coverPhoto ? (
                          <img src={project.coverPhoto} alt={project.title} className="aspect-square w-full object-cover" />
                        ) : (
                          <div className="aspect-square w-full bg-[#f0ede8] flex items-center justify-center text-6xl">
                            {project.emoji ?? '🧶'}
                          </div>
                        )}
                        <div className="px-3 pt-3 pb-3">
                          <p className="text-[15px] font-bold text-[#212121] mb-2 leading-snug line-clamp-1">{project.title}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                                <path d="M1 1.5L7 4.5L1 7.5V1.5Z" fill={statusColor} />
                              </svg>
                              <span className="text-[11px] font-semibold" style={{ color: statusColor }}>{statusLabel}</span>
                            </div>
                            <span className="text-[13px] text-[#a7a7a7] font-medium tracking-wider">{formatTime(project.timerSecs ?? 0)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
      </div>

      {/* FAB overlay */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setFabOpen(false)}
        />
      )}

      {/* FAB 플로팅 모달 */}
      {fabOpen && (
        <div
          className="fixed z-50 bg-white overflow-hidden"
          style={{
            bottom: '172px',
            right: 'max(16px, calc(50% - 181px))',
            borderRadius: '20px',
            minWidth: '210px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          }}
        >
          <button
            onClick={() => { setFabOpen(false); router.push('/projects/new') }}
            className="w-full flex items-center gap-3.5 px-5 py-4 active:bg-[#fafafa] text-left"
          >
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="3" y="9" width="22" height="18" rx="4" fill="#FFC0B0"/>
                <rect x="9" y="5" width="22" height="18" rx="4" fill="#F72E00"/>
                <path d="M14 13h12M14 16.5h8" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#212121]">도안 선택하기</span>
          </button>
          <div className="h-px bg-[#f0f0f0] mx-4" />
          <button
            onClick={() => { setFabOpen(false); router.push('/projects/new') }}
            className="w-full flex items-center gap-3.5 px-5 py-4 active:bg-[#fafafa] text-left"
          >
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="5" width="20" height="24" rx="4" fill="#FFC0B0"/>
                <rect x="10" y="7" width="20" height="24" rx="4" fill="#F72E00"/>
                <path d="M15 15h10M15 18.5h10M15 22h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[#212121]">직접 입력하기</span>
          </button>
        </div>
      )}

      {/* 빈 상태 액션 시트 overlay */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* 빈 상태 액션 시트 */}
      <div
        className="fixed left-1/2 w-full max-w-[393px] z-50"
        style={{
          bottom: 0,
          transform: `translateX(-50%) translateY(${sheetOpen ? '0' : '100%'})`,
          transition: 'transform 0.32s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div className="bg-white rounded-t-[24px] pb-8 pt-2" style={{ boxShadow: '0 -4px 32px rgba(0,0,0,0.12)' }}>
          <div className="flex justify-center pt-2 pb-4">
            <div className="w-9 h-1 rounded-full bg-[#e0e0e0]" />
          </div>
          <p className="text-[13px] font-semibold text-[#9a9a9a] px-6 mb-3">기록 방법 선택</p>
          <button
            onClick={() => { setSheetOpen(false); router.push('/projects/new') }}
            className="w-full flex items-center gap-4 px-6 py-4 active:bg-[#fafafa] text-left"
          >
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: '#fff0ee' }}>
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                <rect x="3" y="9" width="22" height="18" rx="4" fill="#FFC0B0"/>
                <rect x="9" y="5" width="22" height="18" rx="4" fill="#F72E00"/>
                <path d="M14 13h12M14 16.5h8" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#212121]">도안 선택하기</p>
              <p className="text-[12px] text-[#9a9a9a] mt-0.5">도안 파일이나 링크로 시작해요</p>
            </div>
          </button>
          <div className="h-px bg-[#f5f5f5] mx-6" />
          <button
            onClick={() => { setSheetOpen(false); router.push('/projects/new') }}
            className="w-full flex items-center gap-4 px-6 py-4 active:bg-[#fafafa] text-left"
          >
            <div className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: '#fff0ee' }}>
              <svg width="24" height="24" viewBox="0 0 36 36" fill="none">
                <rect x="4" y="5" width="20" height="24" rx="4" fill="#FFC0B0"/>
                <rect x="10" y="7" width="20" height="24" rx="4" fill="#F72E00"/>
                <path d="M15 15h10M15 18.5h10M15 22h6" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[#212121]">직접 입력하기</p>
              <p className="text-[12px] text-[#9a9a9a] mt-0.5">제목, 실, 바늘 등을 직접 입력해요</p>
            </div>
          </button>
        </div>
      </div>

      {/* FAB 버튼 — 기록이 있고 검색 모드가 아닐 때만 표시 */}
      {projects.length > 0 && !searchOpen && (
        <button
          onClick={() => setFabOpen(v => !v)}
          className="fixed bottom-[100px] flex items-center justify-center bg-[#f72e00] text-white font-semibold text-[14px] shadow-lg shadow-[#f72e00]/30 active:scale-95 z-50"
          style={{
            right: 'max(16px, calc(50% - 181px))',
            borderRadius: (fabOpen || scrolled) ? '50%' : '16px',
            width: (fabOpen || scrolled) ? '52px' : 'auto',
            height: (fabOpen || scrolled) ? '52px' : 'auto',
            padding: (fabOpen || scrolled) ? '0' : '14px 20px',
            gap: (fabOpen || scrolled) ? '0' : '8px',
            transition: 'border-radius 0.25s, width 0.25s, height 0.25s, padding 0.25s',
          }}
        >
          {fabOpen
            ? <X size={20} strokeWidth={2.5} />
            : (
              <>
                <Plus size={18} strokeWidth={2.5} />
                {!scrolled && '기록하기'}
              </>
            )
          }
        </button>
      )}
    </div>
  )
}
