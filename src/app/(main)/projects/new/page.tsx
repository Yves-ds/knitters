'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'
import { Pattern, MOCK_PATTERNS } from '@/lib/mockPatterns'
import { PatternDetailSheet, parseSizes } from '@/components/pattern/PatternDetailSheet'

const CATEGORIES = ['전체', '스웨터', '베스트', '모자', '가디건', '소품', '숄/스카프', '양말/장갑']
const BRANDS = ['전체', ...Array.from(new Set(MOCK_PATTERNS.map(p => p.brand)))]

/* ── 달력 피커 ── */
function CalendarPicker({
  value, onChange, onClose,
}: {
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
  const firstDay   = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday    = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
  const isSelected = (day: number) => value === toISO(day)

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
            const col      = idx % 7
            const selected = day !== null && isSelected(day)
            return (
              <div key={idx} className="flex items-center justify-center">
                {day !== null ? (
                  <button
                    onClick={() => onChange(toISO(day))}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[14px] transition-colors"
                    style={{
                      background: selected ? '#F72E00' : 'transparent',
                      color: selected ? '#fff'
                        : isToday(day) ? '#F72E00'
                        : col === 0 ? '#F72E00'
                        : col === 6 ? '#3B86FB'
                        : '#212121',
                      fontWeight: selected || isToday(day) ? 700 : 400,
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
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    const matchCategory = activeCategory === '전체' || p.category === activeCategory
    const matchBrand = activeBrand === '전체' || p.brand === activeBrand
    return matchSearch && matchCategory && matchBrand
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
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="작가 / 도안 이름을 입력해주세요"
              className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#A2A2A2] outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="flex-shrink-0">
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
            className="h-8 px-3.5 rounded-full text-[13px] font-semibold flex-shrink-0 transition-colors"
            style={{ background: isAllActive ? '#F72E00' : '#F0F0F0', color: isAllActive ? '#fff' : '#212121' }}
          >
            전체
          </button>

          <div className="relative flex-shrink-0">
            <button
              onClick={() => { setCategoryDropOpen(v => !v); setBrandDropOpen(false) }}
              className="h-8 px-3 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-colors"
              style={{ background: activeCategory !== '전체' ? '#212121' : '#F0F0F0', color: activeCategory !== '전체' ? '#fff' : '#212121' }}
            >
              {activeCategory === '전체' ? '카테고리' : activeCategory}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
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
              className="h-8 px-3 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-colors"
              style={{ background: activeBrand !== '전체' ? '#212121' : '#F0F0F0', color: activeBrand !== '전체' ? '#fff' : '#212121' }}
            >
              {activeBrand === '전체' ? '브랜드' : activeBrand}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
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
          ) : (
            filtered.map(pattern => (
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
            ))
          )}
        </div>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════ */
export default function NewProjectPage() {
  const router = useRouter()
  const addProject = useProjectStore(s => s.addProject)

  const [title, setTitle] = useState('')
  const [authorInput, setAuthorInput] = useState('')
  const [sizeInput, setSizeInput] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [content, setContent] = useState('')
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
  const [patternSelectOpen, setPatternSelectOpen] = useState(false)
  const [patternDetailOpen, setPatternDetailOpen] = useState(false)
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end' | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('selectPattern') === '1') {
      setPatternSelectOpen(true)
    }
  }, [])

  const handleSelectPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern)
    setPatternSelectOpen(false)
    setTitle(pattern.name)
    setAuthorInput(pattern.author)
    const sizes = parseSizes(pattern.size)
    setSizeInput(sizes[0] || '')
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setStartDate(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`)
  }

  const formatDate = (iso: string) => {
    if (!iso) return ''
    const [y, m, d] = iso.split('-')
    return `${y}.${m}.${d}`
  }

  const canSubmit = title.trim().length > 0

  const handleRegister = () => {
    if (!canSubmit) return
    const newId = addProject({
      title: title.trim(),
      status: '준비 중',
      startDate,
      endDate,
      content,
      emoji: '🧶',
      timerSecs: 0,
      coverPhoto: undefined,
      videos: [],
      pdfUrl: null,
      patternId: selectedPattern?.id,
      patternName: selectedPattern?.name || undefined,
      patternAuthor: authorInput || undefined,
      patternSelectedSize: sizeInput || undefined,
    })
    router.replace(`/projects/${newId}`)
  }

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pt-14 pb-4">
          <button onClick={() => router.back()} className="w-8 flex items-center active:opacity-60">
            <ChevronLeft size={22} className="text-[#646464]" />
          </button>
          <button
            onClick={handleRegister}
            disabled={!canSubmit}
            className="text-[15px] font-semibold transition-colors"
            style={{ color: canSubmit ? '#F72E00' : '#C8C8C8' }}
          >
            등록
          </button>
        </div>

        {/* 프로젝트명 */}
        <div className="px-4 pb-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="프로젝트명"
            className="text-[28px] font-bold text-[#212121] w-full outline-none placeholder:text-[#D0D0D0] bg-transparent"
          />
        </div>

        <div className="h-px bg-[#F0F0F0]" />

        {/* 폼 행 */}
        <div>
          {/* 도안 */}
          <div className="flex items-center px-4 border-b border-[#F0F0F0]" style={{ minHeight: 52 }}>
            <span className="text-[15px] font-medium text-[#212121] w-[72px] flex-shrink-0">도안</span>
            <button
              onClick={() => setPatternSelectOpen(true)}
              className="flex-1 py-4 text-left active:opacity-60"
            >
              {selectedPattern ? (
                <span className="text-[15px] text-[#212121]">{selectedPattern.name}</span>
              ) : (
                <span className="text-[15px] text-[#C8C8C8]">선택</span>
              )}
            </button>
            {selectedPattern && (
              <button
                onClick={() => setPatternDetailOpen(true)}
                className="flex items-center gap-1 flex-shrink-0 active:opacity-60 py-4"
              >
                <span className="text-[12px] font-medium text-[#F72E00]">상세</span>
                <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
                  <path d="M1 1l3 3.5-3 3.5" stroke="#F72E00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* 작가 */}
          <div className="flex items-center px-4 border-b border-[#F0F0F0]" style={{ minHeight: 52 }}>
            <span className="text-[15px] font-medium text-[#212121] w-[72px] flex-shrink-0">작가</span>
            <input
              value={authorInput}
              onChange={e => setAuthorInput(e.target.value)}
              placeholder="비어있음"
              className="flex-1 py-4 text-[15px] text-[#212121] outline-none placeholder:text-[#C8C8C8] bg-transparent"
            />
          </div>

          {/* 사이즈 */}
          <div className="flex items-center px-4 border-b border-[#F0F0F0]" style={{ minHeight: 52 }}>
            <span className="text-[15px] font-medium text-[#212121] w-[72px] flex-shrink-0">사이즈</span>
            <input
              value={sizeInput}
              onChange={e => setSizeInput(e.target.value)}
              placeholder="비어있음"
              className="flex-1 py-4 text-[15px] text-[#212121] outline-none placeholder:text-[#C8C8C8] bg-transparent"
            />
          </div>

          {/* 시작일 */}
          <div className="flex items-center px-4 border-b border-[#F0F0F0]" style={{ minHeight: 52 }}>
            <span className="text-[15px] font-medium text-[#212121] w-[72px] flex-shrink-0">시작일</span>
            <button
              onClick={() => setDatePickerTarget('start')}
              className="flex-1 py-4 text-left active:opacity-60"
            >
              {startDate ? (
                <span className="text-[15px] text-[#212121]">{formatDate(startDate)}</span>
              ) : (
                <span className="text-[15px] text-[#C8C8C8]">비어있음</span>
              )}
            </button>
          </div>

          {/* 완성일 */}
          <div className="flex items-center px-4 border-b border-[#F0F0F0]" style={{ minHeight: 52 }}>
            <span className="text-[15px] font-medium text-[#212121] w-[72px] flex-shrink-0">완성일</span>
            <button
              onClick={() => setDatePickerTarget('end')}
              className="flex-1 py-4 text-left active:opacity-60"
            >
              {endDate ? (
                <span className="text-[15px] text-[#212121]">{formatDate(endDate)}</span>
              ) : (
                <span className="text-[15px] text-[#C8C8C8]">비어있음</span>
              )}
            </button>
          </div>
        </div>

        {/* 메모 */}
        <div className="flex-1 px-4 py-4">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="메모를 입력해보세요..."
            className="w-full outline-none text-[15px] text-[#212121] placeholder:text-[#C8C8C8] resize-none leading-relaxed bg-transparent"
            style={{ minHeight: 200 }}
          />
        </div>

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
