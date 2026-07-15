'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { Pattern, MOCK_PATTERNS } from '@/lib/mockPatterns'
import { PatternInfoCard, PatternDetailSheet, parseSizes } from '@/components/pattern/PatternDetailSheet'

type Tab = '정보' | '도안' | '기록'
const STATUS_OPTIONS = ['준비 중', '뜨는 중', '쉬는 중', '완성']
const CATEGORIES = ['전체', '스웨터', '베스트', '모자', '가디건', '소품', '숄/스카프', '양말/장갑']
const BRANDS = ['전체', ...Array.from(new Set(MOCK_PATTERNS.map(p => p.brand)))]

/* ── 상태 배지 ── */
function StatusBadge({ status }: { status: string }) {
  if (status === '뜨는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#DDEDFF' }}>
      <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF' }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF' }} />
      </div>
      <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: '#209BFF' }}>뜨는 중</span>
    </div>
  )
  if (status === '쉬는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#FFEEEA' }}>
      <div className="flex items-center gap-[5px]">
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: '#F72E00' }} />
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: '#F72E00' }} />
      </div>
      <span className="text-[14px] font-semibold" style={{ color: '#F72E00' }}>쉬는 중</span>
    </div>
  )
  if (status === '완성') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#E9FFE6' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L19 7" stroke="#13C100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[14px] font-semibold" style={{ color: '#13C100' }}>완성</span>
    </div>
  )
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#EDEDED' }}>
      <div className="flex items-center gap-[3px]">
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B' }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B' }} />
      </div>
      <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: '#3B3B3B' }}>준비 중</span>
    </div>
  )
}

/* ── 달력 아이콘 ── */
function CalendarIcon({ color = '#646464' }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M3 9h18" stroke={color} strokeWidth="1.5"/>
      <path d="M8 2v2M16 2v2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── 달력 피커 ── */
function CalendarPicker({ value, onChange, onClose }: {
  value?: string
  onChange: (d: string) => void
  onClose: () => void
}) {
  const today = new Date()
  const initYear  = value ? parseInt(value.split('-')[0]) : today.getFullYear()
  const initMonth = value ? parseInt(value.split('-')[1]) - 1 : today.getMonth()
  const [viewYear,  setViewYear]  = useState(initYear)
  const [viewMonth, setViewMonth] = useState(initMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  const DAYS = ['일', '월', '화', '수', '목', '금', '토']
  const pad = (n: number) => String(n).padStart(2, '0')
  const toISO = (day: number) => `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`
  const firstDay    = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday    = (d: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === d
  const isSelected = (d: number) => value === toISO(d)

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white rounded-t-[20px] z-50 px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-3 px-1">
          <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#F0F0F0]">
            <ChevronLeft size={20} className="text-[#646464]" />
          </button>
          <span className="text-[16px] font-bold text-[#212121]">{viewYear}년 {viewMonth + 1}월</span>
          <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#F0F0F0]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#646464" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d, i) => (
            <div key={d} className="text-center text-[12px] font-semibold py-1"
              style={{ color: i === 0 ? '#F72E00' : i === 6 ? '#3B86FB' : '#9A9A9A' }}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            const col = idx % 7
            const sel = day !== null && isSelected(day)
            return (
              <div key={idx} className="flex items-center justify-center">
                {day !== null ? (
                  <button
                    onClick={() => onChange(toISO(day))}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[14px] transition-colors"
                    style={{
                      background: sel ? '#F72E00' : 'transparent',
                      color: sel ? '#fff' : isToday(day) ? '#F72E00' : col === 0 ? '#F72E00' : col === 6 ? '#3B86FB' : '#212121',
                      fontWeight: sel || isToday(day) ? 700 : 400,
                    }}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>
        <button onClick={onClose}
          className="mt-5 w-full py-3.5 bg-[#F72E00] text-white text-[15px] font-semibold rounded-[12px] active:opacity-80">
          확인
        </button>
      </div>
    </>
  )
}

/* ── 도안 선택 시트 ── */
function PatternSelectSheet({ isOpen, onClose, onSelectPattern }: {
  isOpen: boolean
  onClose: () => void
  onSelectPattern: (pattern: Pattern) => void
}) {
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
          transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
          height: '80vh',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-3 flex-shrink-0">
          <h2 className="text-[22px] font-bold text-[#212121]">도안 선택하기</h2>
        </div>
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-[12px] h-[44px] px-3.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="5" stroke="#9A9A9A" strokeWidth="1.5"/>
              <path d="M11 11L14 14" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="작가 / 도안 이름을 입력해주세요"
              className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#A2A2A2] outline-none"
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
          <button
            onClick={() => { setActiveCategory('전체'); setActiveBrand('전체'); setSearch('') }}
            className="ml-auto flex-shrink-0 w-8 h-8 flex items-center justify-center"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M4 4v5h.582m15.356 2A8 8 0 004.582 9m0 0H9M20 20v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pb-8">
          {filtered.length === 0 ? (
            <div className="py-16 flex items-center justify-center">
              <p className="text-[14px] text-[#9A9A9A]">검색 결과가 없어요</p>
            </div>
          ) : filtered.map(pattern => (
            <button
              key={pattern.id}
              onClick={() => onSelectPattern(pattern)}
              className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#F9F9F9] text-left border-b border-[#F5F5F5]"
            >
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

/* ══════════════════════════════════════════════ */
export default function NewProjectPage() {
  const router = useRouter()
  const addProject = useProjectStore(s => s.addProject)

  const [title, setTitle]               = useState('')
  const [activeTab, setActiveTab]       = useState<Tab>('정보')
  const [status, setStatus]             = useState('준비 중')
  const [startDate, setStartDate]       = useState('')
  const [endDate, setEndDate]           = useState('')
  const [content, setContent]           = useState('')
  const [coverPhoto, setCoverPhoto]     = useState<string | undefined>()
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [patternSelectOpen, setPatternSelectOpen] = useState(false)
  const [patternDetailOpen, setPatternDetailOpen] = useState(false)
  const [datePickerTarget, setDatePickerTarget]   = useState<'start' | 'end' | null>(null)
  const [statusDropOpen, setStatusDropOpen]       = useState(false)

  const photoInputRef = useRef<HTMLInputElement>(null)
  const statusBtnRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('selectPattern') === '1') setPatternSelectOpen(true)
  }, [])

  useEffect(() => {
    if (!statusDropOpen) return
    const handler = (e: MouseEvent) => {
      if (!statusBtnRef.current?.contains(e.target as Node)) setStatusDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [statusDropOpen])

  const handleSelectPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern)
    setPatternSelectOpen(false)
    setTitle(pattern.name)
    const sizes = parseSizes(pattern.size)
    setSelectedSize(sizes[0] || '')
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setStartDate(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`)
    setStatus('뜨는 중')
    setActiveTab('도안')
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { if (ev.target?.result) setCoverPhoto(ev.target.result as string) }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const formatDate = (iso: string) => {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return `${y}.${m}.${d}`
  }

  const canSubmit = title.trim().length > 0

  const handleSave = () => {
    if (!canSubmit) return
    const newId = addProject({
      title: title.trim(),
      status,
      startDate,
      endDate,
      content,
      emoji: '🧶',
      timerSecs: 0,
      coverPhoto,
      videos: [],
      pdfUrl: null,
      patternId: selectedPattern?.id,
      patternName: selectedPattern?.name || undefined,
      patternAuthor: selectedPattern?.author || undefined,
      patternSelectedSize: selectedSize || undefined,
    })
    router.replace(`/projects/${newId}`)
  }

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">

        {/* 헤더 */}
        <div className="flex items-center gap-2 px-4 pt-14 pb-0">
          <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center active:opacity-60">
            <ChevronLeft size={22} className="text-[#646464]" />
          </button>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="프로젝트 제목"
            className="flex-1 text-center text-[17px] font-medium text-[#212121] placeholder:text-[#C8C8C8] outline-none bg-transparent"
          />
          <button
            onClick={handleSave}
            disabled={!canSubmit}
            className="shrink-0 text-[15px] font-medium w-8 text-right transition-colors"
            style={{ color: canSubmit ? '#212121' : '#C8C8C8' }}
          >
            저장
          </button>
        </div>

        {/* 탭 */}
        <div className="flex mt-4 border-b border-[#F0F0F0]">
          {(['정보', '도안', '기록'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-[15px] font-medium relative transition-colors"
              style={{ color: activeTab === tab ? '#F72E00' : '#9A9A9A' }}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F72E00]" />
              )}
            </button>
          ))}
        </div>

        {/* ── 정보 탭 ── */}
        {activeTab === '정보' && (
          <div className="flex-1 overflow-y-auto pb-10">
            {/* 커버 사진 */}
            <div
              className="w-full bg-[#EBEBEB] cursor-pointer relative overflow-hidden"
              style={{ aspectRatio: '4/3' }}
              onClick={() => photoInputRef.current?.click()}
            >
              {coverPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverPhoto} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            {/* 상태 · 날짜 · 도안 정보 */}
            <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
              {/* 상태 배지 드롭다운 */}
              <div className="relative" ref={statusBtnRef}>
                <button onClick={() => setStatusDropOpen(v => !v)}>
                  <StatusBadge status={status} />
                </button>
                {statusDropOpen && (
                  <div
                    className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-[14px] z-30 py-1.5"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 140 }}
                  >
                    {STATUS_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setStatus(opt); setStatusDropOpen(false) }}
                        className="w-full flex items-center justify-between px-3 py-2 gap-2 active:bg-[#F5F5F5]"
                        style={{ background: status === opt ? '#F9F9F9' : 'transparent' }}
                      >
                        <StatusBadge status={opt} />
                        {status === opt && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12l5 5L19 7" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 시작일 배지 */}
              <button
                onClick={() => setDatePickerTarget('start')}
                className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[14px] font-semibold border border-[#e0e0e0] bg-white text-[#646464] active:opacity-70"
              >
                <CalendarIcon />
                {startDate ? formatDate(startDate) : '시작일'}
              </button>

              {/* 완성일 배지 — 완성 상태일 때만 */}
              {status === '완성' && (
                <button
                  onClick={() => setDatePickerTarget('end')}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[14px] font-semibold border border-[#e0e0e0] bg-white text-[#646464] active:opacity-70"
                >
                  <CalendarIcon />
                  {endDate ? formatDate(endDate) : '완성일'}
                </button>
              )}

              {/* 도안 정보 링크 */}
              {selectedPattern && (
                <button
                  onClick={() => setPatternDetailOpen(true)}
                  className="ml-auto flex items-center gap-1 active:opacity-60"
                >
                  <span className="text-[14px] text-[#646464]">도안 정보</span>
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                    <path d="M1 1l4 4-4 4" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
            </div>

            {/* 재료 섹션 */}
            <div className="px-4 flex flex-col gap-6">
              <div>
                <h3 className="text-[17px] font-bold text-[#212121] mb-3">실</h3>
                <button
                  className="w-full rounded-[14px] py-[22px] text-center text-[14px] font-semibold active:opacity-70"
                  style={{ background: '#F5F5F5', color: '#F72E00' }}
                >
                  + 사용한 실 추가하기
                </button>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#212121] mb-3">바늘</h3>
                <button
                  className="w-full rounded-[14px] py-[22px] text-center text-[14px] font-semibold active:opacity-70"
                  style={{ background: '#F5F5F5', color: '#F72E00' }}
                >
                  + 사용한 바늘 추가하기
                </button>
              </div>
              <div>
                <h3 className="text-[17px] font-bold text-[#212121] mb-3">게이지</h3>
                <button
                  className="w-full rounded-[14px] py-[22px] text-center text-[14px] font-semibold active:opacity-70"
                  style={{ background: '#F5F5F5', color: '#F72E00' }}
                >
                  + 게이지 추가하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 도안 탭 ── */}
        {activeTab === '도안' && (
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {selectedPattern ? (
              <PatternInfoCard
                pattern={selectedPattern}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                onDetailOpen={() => setPatternDetailOpen(true)}
                onChangePattern={() => setPatternSelectOpen(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 pt-20">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="14" fill="#F5F5F5"/>
                  <path d="M16 24h16M24 16v16" stroke="#C8C8C8" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                <p className="text-[15px] text-[#9A9A9A] font-medium">선택된 도안이 없어요</p>
                <button
                  onClick={() => setPatternSelectOpen(true)}
                  className="mt-1 px-6 py-3 rounded-[12px] text-[14px] font-semibold text-white active:opacity-80"
                  style={{ background: '#F72E00' }}
                >
                  도안 선택하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 기록 탭 ── */}
        {activeTab === '기록' && (
          <div className="flex-1 px-4 py-4">
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="메모를 입력해보세요..."
              className="w-full outline-none text-[15px] text-[#212121] placeholder:text-[#C8C8C8] resize-none leading-relaxed bg-transparent"
              style={{ minHeight: 400 }}
            />
          </div>
        )}

      </div>

      {/* 달력 */}
      {datePickerTarget && (
        <CalendarPicker
          value={datePickerTarget === 'start' ? startDate : endDate}
          onChange={date => {
            if (datePickerTarget === 'start') setStartDate(date)
            else setEndDate(date)
            setDatePickerTarget(null)
          }}
          onClose={() => setDatePickerTarget(null)}
        />
      )}

      {/* 도안 선택 시트 */}
      <PatternSelectSheet
        isOpen={patternSelectOpen}
        onClose={() => setPatternSelectOpen(false)}
        onSelectPattern={handleSelectPattern}
      />

      {/* 도안 상세 정보 시트 */}
      <PatternDetailSheet
        isOpen={patternDetailOpen}
        onClose={() => setPatternDetailOpen(false)}
        pattern={selectedPattern}
      />
    </>
  )
}
