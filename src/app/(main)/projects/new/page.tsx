'use client'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

const STATUS_OPTIONS = ['준비 중', '뜨는 중', '쉬는 중', '완성']

/* ── 상태 배지 ── */
function StatusBadge({ status }: { status: string }) {
  if (status === '뜨는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#DDEDFF' }}>
      <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF' }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#209BFF' }}>뜨는 중</span>
    </div>
  )
  if (status === '쉬는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#FFEEEA' }}>
      <div className="flex items-center gap-[5px]">
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: '#F72E00' }} />
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: '#F72E00' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#F72E00' }}>쉬는 중</span>
    </div>
  )
  if (status === '완성') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#E9FFE6' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L19 7" stroke="#13C100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[13px] font-semibold" style={{ color: '#13C100' }}>완성</span>
    </div>
  )
  // 준비 중 (기본)
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#EDEDED' }}>
      <div className="flex items-center gap-[3px]">
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B' }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#3B3B3B' }}>준비 중</span>
    </div>
  )
}

/* ── 달력 피커 (단일 / 범위 선택 겸용) ── */
function CalendarPicker({
  value, onChange,
  rangeMode, rangeStart, rangeEnd, onRangeChange,
  onClose,
}: {
  value?: string; onChange?: (d: string) => void
  rangeMode?: boolean; rangeStart?: string; rangeEnd?: string
  onRangeChange?: (start: string, end: string) => void
  onClose: () => void
}) {
  const today = new Date()
  const base = rangeMode ? (rangeStart || value || '') : (value || '')
  const initYear  = base ? parseInt(base.split('-')[0]) : today.getFullYear()
  const initMonth = base ? parseInt(base.split('-')[1]) - 1 : today.getMonth()
  const [viewYear,  setViewYear]  = useState(initYear)
  const [viewMonth, setViewMonth] = useState(initMonth)
  // 범위 선택용 임시 상태
  const [tmpStart, setTmpStart] = useState(rangeStart || '')
  const [tmpEnd,   setTmpEnd]   = useState(rangeEnd   || '')
  const [step, setStep] = useState<'start' | 'end'>(rangeStart ? 'end' : 'start')

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
  const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
  const firstDay   = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday      = (day: number) => today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
  const isStart      = (day: number) => (rangeMode ? tmpStart : value) === toISO(day)
  const isEnd        = (day: number) => rangeMode && tmpEnd === toISO(day)
  const isInRange    = (day: number) => rangeMode && tmpStart && tmpEnd && toISO(day) > tmpStart && toISO(day) < tmpEnd
  // 종료일 선택 단계에서 오늘 이후 날짜 비활성화
  const isDisabled   = (day: number) => rangeMode && step === 'end' && toISO(day) > todayISO

  const handleDay = (day: number) => {
    if (isDisabled(day)) return
    const iso = toISO(day)
    if (!rangeMode) { onChange?.(iso); return }

    if (step === 'start') {
      setTmpStart(iso); setTmpEnd(''); setStep('end')
    } else {
      if (iso < tmpStart) {
        setTmpStart(iso); setTmpEnd(''); setStep('end')
      } else {
        setTmpEnd(iso)
        onRangeChange?.(tmpStart, iso)
        onClose()
      }
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[20px] z-50 px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-4" />

        {/* 범위 선택 스텝 표시 */}
        {rangeMode && (
          <div className="flex gap-2 mb-4">
            {(['start', 'end'] as const).map(s => (
              <div
                key={s}
                className="flex-1 py-2 rounded-[10px] text-center text-[13px] font-semibold transition-colors"
                style={{
                  background: step === s ? '#F72E00' : '#F5F5F5',
                  color: step === s ? '#fff' : '#9A9A9A',
                }}
              >
                {s === 'start' ? (tmpStart ? tmpStart.split('-').join('.') : '시작일') : (tmpEnd ? tmpEnd.split('-').join('.') : '종료일')}
              </div>
            ))}
          </div>
        )}

        {/* 월 네비게이션 */}
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

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d, i) => (
            <div key={d} className="text-center text-[12px] font-semibold py-1"
              style={{ color: i === 0 ? '#F72E00' : i === 6 ? '#3B86FB' : '#9A9A9A' }}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            const col      = idx % 7
            const selected = isStart(day ?? -1) || isEnd(day ?? -1)
            const inRange  = day !== null && isInRange(day)
            const disabled = day !== null && isDisabled(day)
            return (
              <div key={idx} className="flex items-center justify-center"
                style={{ background: inRange ? '#FFEEEA' : 'transparent' }}>
                {day !== null ? (
                  <button
                    onClick={() => handleDay(day)}
                    disabled={disabled}
                    className="w-9 h-9 flex items-center justify-center rounded-full text-[14px] transition-colors"
                    style={{
                      background: selected ? '#F72E00' : 'transparent',
                      color: disabled
                        ? '#D1D5DB'
                        : selected ? '#fff'
                        : isToday(day) ? '#F72E00'
                        : col === 0 ? '#F72E00'
                        : col === 6 ? '#3B86FB'
                        : '#212121',
                      border: isToday(day) && !selected && !disabled ? '1.5px solid #F72E00' : 'none',
                      fontWeight: selected || isToday(day) ? 700 : 400,
                      cursor: disabled ? 'default' : 'pointer',
                      opacity: disabled ? 0.4 : 1,
                    }}
                  >
                    {day}
                  </button>
                ) : null}
              </div>
            )
          })}
        </div>

        {!rangeMode && (
          <button onClick={onClose}
            className="mt-5 w-full py-3.5 bg-[#F72E00] text-white text-[15px] font-semibold rounded-[12px] active:opacity-80">
            확인
          </button>
        )}
      </div>
    </>
  )
}

/* ── 날짜 미설정 시 기본 달력 아이콘 ── */
function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#646464" strokeWidth="1.5"/>
      <path d="M3 9h18" stroke="#646464" strokeWidth="1.5"/>
      <path d="M8 2v2M16 2v2" stroke="#646464" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── 날짜 설정 시 calendar_start 아이콘 ── */
function CalendarStartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#cs_clip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.5 5C8.76522 5 9.01957 5.10536 9.20711 5.29289C9.39464 5.48043 9.5 5.73478 9.5 6V7H14.5V6C14.5 5.73478 14.6054 5.48043 14.7929 5.29289C14.9804 5.10536 15.2348 5 15.5 5C15.7652 5 16.0196 5.10536 16.2071 5.29289C16.3946 5.48043 16.5 5.73478 16.5 6V7H17.5C17.8978 7 18.2794 7.15804 18.5607 7.43934C18.842 7.72064 19 8.10218 19 8.5V9.5H5V8.5C5 8.10218 5.15804 7.72064 5.43934 7.43934C5.72064 7.15804 6.10218 7 6.5 7H7.5V6C7.5 5.73478 7.60536 5.48043 7.79289 5.29289C7.98043 5.10536 8.23478 5 8.5 5Z" fill="#F72E00"/>
        <path d="M5 9.5H19V17.5C19 17.8978 18.842 18.2794 18.5607 18.5607C18.2794 18.842 17.8978 19 17.5 19H6.5C6.10218 19 5.72064 18.842 5.43934 18.5607C5.15804 18.2794 5 17.8978 5 17.5V9.5Z" fill="#FFBAA9"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.4301 15.943C12.4301 16.0666 12.4668 16.1875 12.5354 16.2903C12.6041 16.3931 12.7017 16.4732 12.8159 16.5205C12.9302 16.5678 13.0558 16.5802 13.1771 16.5561C13.2983 16.532 13.4097 16.4724 13.4971 16.385L15.4061 14.476C15.4642 14.418 15.5102 14.3491 15.5417 14.2732C15.5731 14.1974 15.5892 14.1161 15.5892 14.034C15.5892 13.9519 15.5731 13.8706 15.5417 13.7948C15.5102 13.7189 15.4642 13.65 15.4061 13.592L13.4961 11.683C13.4087 11.5959 13.2974 11.5367 13.1763 11.5127C13.0552 11.4888 12.9298 11.5013 12.8157 11.5485C12.7017 11.5958 12.6043 11.6758 12.5356 11.7784C12.467 11.881 12.4303 12.0016 12.4301 12.125V13.285H9.03613C8.83722 13.285 8.64645 13.364 8.5058 13.5047C8.36515 13.6453 8.28613 13.8361 8.28613 14.035C8.28613 14.2339 8.36515 14.4247 8.5058 14.5653C8.64645 14.706 8.83722 14.785 9.03613 14.785H12.4301V15.943Z" fill="#F72E00"/>
      </g>
      <defs>
        <clipPath id="cs_clip">
          <rect width="14" height="14" fill="white" transform="translate(5 5)"/>
        </clipPath>
      </defs>
    </svg>
  )
}

/* ── YYYY.MM.DD 포맷 ── */
function formatDate(iso: string) {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${y}.${m}.${d}`
}

/* ── 단일 날짜 배지 ── */
function DateBadge({ date, label, onClick }: { date: string; label: string; onClick: () => void }) {
  const formatted = formatDate(date)
  if (formatted) {
    return (
      <button onClick={onClick} className="flex items-center gap-[4px] h-8 px-[8px] rounded-[10px] active:opacity-70" style={{ background: '#FFEEEA' }}>
        <CalendarStartIcon />
        <span className="text-[12px] text-black" style={{ letterSpacing: '0.6px', fontWeight: 500 }}>{formatted}</span>
      </button>
    )
  }
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[13px] font-semibold border border-[#e0e0e0] bg-white text-[#646464] active:opacity-70">
      <CalendarIcon />{label}
    </button>
  )
}

/* ── YouTube URL 파싱 헬퍼 ── */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}
function getEmbedUrl(url: string): string | null {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
function getThumbUrl(url: string): string | null {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

/* ── 도안 시트 ── */
function PatternSheet({ isOpen, onClose, pdfUrl, onPdfChange }: {
  isOpen: boolean
  onClose: () => void
  pdfUrl: string | null
  onPdfChange: (url: string | null) => void
}) {
  const [showMenu, setShowMenu] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (pdfUrl?.startsWith('blob:')) URL.revokeObjectURL(pdfUrl)
    onPdfChange(URL.createObjectURL(file))
    e.target.value = ''
  }

  return (
    <div
      className="fixed inset-y-0 w-full max-w-[480px] z-[60] bg-white flex flex-col"
      style={{
        left: '50%',
        transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
        transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
        {/* 헤더 */}
        <div className="flex items-center px-5 pt-14 pb-4 border-b border-[#F0F0F0] relative flex-shrink-0">
          {pdfUrl && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(v => !v)}
                className="w-8 h-8 flex items-center justify-center rounded-lg active:bg-[#F0F0F0]"
              >
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <circle cx="11" cy="5" r="1.5" fill="#374151"/>
                  <circle cx="11" cy="11" r="1.5" fill="#374151"/>
                  <circle cx="11" cy="17" r="1.5" fill="#374151"/>
                </svg>
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div
                    className="absolute top-9 left-0 bg-white rounded-[12px] overflow-hidden z-50"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)', minWidth: 140 }}
                  >
                    <button
                      onClick={() => { setShowMenu(false); fileInputRef.current?.click() }}
                      className="block w-full px-4 py-3.5 text-left text-[14px] text-[#111] active:bg-[#F4F6FB]"
                    >
                      PDF 변경
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onPdfChange(null) }}
                      className="block w-full px-4 py-3.5 text-left text-[14px] text-[#EF4444] active:bg-[#F4F6FB]"
                    >
                      PDF 삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111]">도안</span>
          <button
            onClick={() => { onClose(); setShowMenu(false) }}
            className="ml-auto w-8 h-8 flex items-center justify-center active:opacity-60"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* 바디 */}
        {pdfUrl ? (
          <div className="flex-1 relative overflow-hidden min-h-0">
            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              title="도안"
              style={{ background: '#fff' }}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <label className="flex items-center gap-2.5 bg-[#F4F6FB] rounded-[14px] px-6 py-4 cursor-pointer text-[15px] font-semibold text-[#3B86FB]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="4" y="2" width="12" height="16" rx="2" stroke="#3b86fb" strokeWidth="1.5" fill="none"/>
                <path d="M7 7H13M7 10H13M7 13H10" stroke="#3b86fb" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              PDF 파일 선택
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-[13px] text-[#9CA3AF]">PDF 도안 파일을 불러올 수 있어요</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={handleFileChange}
        />
    </div>
  )
}

/* ── 영상 시트 ── */
function VideoSheet({ isOpen, onClose, videos, onVideosChange }: {
  isOpen: boolean
  onClose: () => void
  videos: string[]
  onVideosChange: (v: string[]) => void
}) {
  const [showAddRow, setShowAddRow] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setShowAddRow(false)
      setUrlInput('')
    }
  }, [isOpen])

  const handleAdd = () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    if (!videos.includes(trimmed)) {
      onVideosChange([...videos, trimmed])
    }
    setSelectedUrl(trimmed)
    setUrlInput('')
    setShowAddRow(false)
  }

  const handleDelete = (url: string) => {
    onVideosChange(videos.filter(v => v !== url))
    if (selectedUrl === url) setSelectedUrl(null)
  }

  const embedUrl = selectedUrl ? (getEmbedUrl(selectedUrl) ?? selectedUrl) : null

  return (
    <div
      className="fixed inset-y-0 w-full max-w-[480px] z-[60] bg-white flex flex-col"
      style={{
        left: '50%',
        transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
        transition: 'transform 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
        {/* 헤더 */}
        <div className="flex items-center px-5 pt-14 pb-4 border-b border-[#F0F0F0] relative flex-shrink-0">
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2L16 16M16 2L2 16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111]">동영상</span>
        </div>

        {/* 플레이어 (16:9) */}
        <div className="w-full bg-black flex-shrink-0 relative" style={{ aspectRatio: '16/9' }}>
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              className="w-full h-full border-none"
              allowFullScreen
              title="동영상"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[#6B7280] text-[13px] gap-1.5">
              <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                <rect x="2" y="5" width="13" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.6" fill="none"/>
                <path d="M15 9L20 6V16L15 13" stroke="#9ca3af" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
              영상을 선택해주세요
            </div>
          )}
        </div>

        {/* 목록 */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[15px] font-bold text-[#111]">저장된 동영상</span>
            <button
              onClick={() => setShowAddRow(v => !v)}
              className="w-[30px] h-[30px] rounded-full bg-[#3B86FB] flex items-center justify-center active:opacity-70 flex-shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1V13M1 7H13" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {showAddRow && (
            <div className="flex gap-2 px-5 pb-3">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 border border-[#E5E7EB] rounded-[10px] px-3.5 py-2.5 text-[13px] text-[#111] outline-none focus:border-[#3B86FB]"
                autoFocus
              />
              <button
                onClick={handleAdd}
                className="px-4 py-2.5 bg-[#3B86FB] text-white text-[13px] font-semibold rounded-[10px] flex-shrink-0 active:opacity-70"
              >
                추가
              </button>
            </div>
          )}

          {videos.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-[#9CA3AF]">저장된 동영상이 없어요</p>
          ) : (
            videos.map((url, i) => {
              const thumb = getThumbUrl(url)
              const isSelected = selectedUrl === url
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-5 py-2.5 cursor-pointer active:bg-[#F9FAFB]"
                  style={{ background: isSelected ? '#FFF5F4' : undefined }}
                  onClick={() => setSelectedUrl(url)}
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt="" className="w-20 h-[52px] rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-[52px] rounded-lg bg-[#E5E7EB] flex-shrink-0 flex items-center justify-center">
                      <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                        <rect x="2" y="5" width="13" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.6" fill="none"/>
                        <path d="M15 9L20 6V16L15 13" stroke="#9ca3af" strokeWidth="1.6" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <span className="flex-1 text-[12px] text-[#6B7280] truncate">{url}</span>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(url) }}
                    className="w-8 h-8 flex items-center justify-center text-[#9CA3AF] active:opacity-60 flex-shrink-0"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 2L14 14M14 2L2 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )
            })
          )}
        </div>
    </div>
  )
}

/* ══════════════════════════════════════════════ */
export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('준비 중')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [content, setContent] = useState('')
  const [statusDropOpen, setStatusDropOpen] = useState(false)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSecs, setTimerSecs] = useState(0)
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const [patternOpen, setPatternOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [videos, setVideos] = useState<string[]>([])
  const [hasPhotos, setHasPhotos] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleSizerRef = useRef<HTMLSpanElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const draggedImgRef = useRef<HTMLElement | null>(null)
  const dropIndicatorRef = useRef<HTMLDivElement>(null)
  const coverBlockRef    = useRef<HTMLElement | null>(null)

  /* 대표 사진/대표 사진 설정 배지 갱신 — 블록별 개별 정리로 중복 방지 */
  const COVER_SVG = `<svg width="63" height="28" viewBox="0 0 63 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="63" height="28" rx="10" fill="#F72E00"/><path d="M17.3984 8.49609V18.9961H16.332V13.5703H14.9727V18.457H13.9531V8.70703H14.9727V12.6562H16.332V8.49609H17.3984ZM12.6758 9.76172V10.6641H9.85156V15.5273C11.1406 15.5156 12.1133 15.457 13.2383 15.2461L13.3203 16.1602C12.0547 16.418 10.9766 16.4648 9.44141 16.4766H8.73828V9.76172H12.6758ZM28.9672 16.8398V17.7539H19.3578V16.8398H21.9359V14.5078H20.2016V13.6055H21.7719V10.3359H20.1781V9.42188H28.0883V10.3359H26.4828V13.6055H28.0531V14.5078H26.3305V16.8398H28.9672ZM22.8734 13.6055H25.393V10.3359H22.8734V13.6055ZM23.0492 16.8398H25.2172V14.5078H23.0492V16.8398ZM37.5031 11.168C37.4914 13.0312 38.5695 14.9297 40.1398 15.6914L39.4484 16.582C38.3059 15.9902 37.4211 14.8125 36.9641 13.4062C36.4895 14.9062 35.5695 16.1602 34.3742 16.7812L33.6828 15.8789C35.3 15.1055 36.3898 13.0898 36.3898 11.168V9.375H37.5031V11.168ZM42.0383 8.49609V12.6797H43.7258V13.6289H42.0383V18.9961H40.925V8.49609H42.0383ZM48.7203 10.6875C48.7203 12.0469 49.7281 13.3242 51.3453 13.8398L50.7711 14.707C49.5641 14.3086 48.65 13.4824 48.1813 12.4336C47.7066 13.5762 46.775 14.4785 45.5211 14.918L44.9469 14.0391C46.5758 13.4883 47.5836 12.1289 47.5953 10.6875V10.2305H45.2398V9.32812H51.0289V10.2305H48.7203V10.6875ZM53.5367 8.50781V16.1719H52.4234V8.50781H53.5367ZM53.8531 17.8711V18.7734H46.6695V15.4453H47.7945V17.8711H53.8531Z" fill="#FFEEEA"/></svg>`

  const updateCoverBadge = (editor: HTMLDivElement) => {
    const blocks = Array.from(editor.querySelectorAll('.img-block')) as HTMLElement[]
    if (blocks.length === 0) { coverBlockRef.current = null; return }

    if (!coverBlockRef.current || !editor.contains(coverBlockRef.current)) {
      coverBlockRef.current = blocks[0]
    }

    blocks.forEach(block => {
      // 이 블록의 기존 배지만 제거 (전역 제거 대신 블록별 정리)
      block.querySelectorAll('.cover-badge, .set-cover-badge').forEach(b => b.remove())

      const badge = document.createElement('div')
      if (block === coverBlockRef.current) {
        badge.className = 'cover-badge'
        badge.style.cssText = 'position:absolute;top:8px;left:8px;pointer-events:none;z-index:2;line-height:0;'
        badge.innerHTML = COVER_SVG
      } else {
        badge.className = 'set-cover-badge'
        badge.dataset.action = 'set-cover'
        badge.textContent = '대표 사진 설정'
        badge.style.cssText =
          'position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.52);color:#FFFFFF;' +
          'font-size:12px;font-weight:500;padding:6px 8px;border-radius:10px;' +
          'cursor:pointer;z-index:2;letter-spacing:0.6px;white-space:nowrap;'
      }
      // firstChild는 정리 후 항상 img 요소 — 그 앞에 배지 삽입
      block.insertBefore(badge, block.firstChild)
    })
  }
  const statusBtnRef = useRef<HTMLDivElement>(null)

  /* 상태 드롭다운 외부 클릭 닫기 */
  useEffect(() => {
    if (!statusDropOpen) return
    const handler = (e: MouseEvent) => {
      if (!statusBtnRef.current?.contains(e.target as Node)) setStatusDropOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [statusDropOpen])

  /* 타이틀 입력창 너비 자동 조정 */
  useLayoutEffect(() => {
    if (titleSizerRef.current && titleInputRef.current) {
      titleInputRef.current.style.width = titleSizerRef.current.offsetWidth + 'px'
    }
  }, [title])

  /* 타이머 */
  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  /* 에디터 마운트 시 자동 포커스 — placeholder 위치에 커서 표시 */
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    const range = document.createRange()
    range.setStart(editor, 0)
    range.collapse(true)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [])

  /* 에디터 커서 저장 */
  const saveRange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  /* 커서 위치에 이미지 삽입 */
  const insertImageAtCursor = (src: string) => {
    const editor = editorRef.current
    if (!editor) return
    const sel = window.getSelection()
    let range: Range
    if (savedRangeRef.current) {
      range = savedRangeRef.current.cloneRange()
      sel?.removeAllRanges()
      sel?.addRange(range)
    } else {
      range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }

    // 이미지 + 삭제 버튼 래퍼
    const wrapper = document.createElement('div')
    wrapper.className = 'img-block'
    wrapper.contentEditable = 'false'
    wrapper.draggable = true
    wrapper.style.cssText = 'position:relative;display:block;margin:8px 0;line-height:0;'

    const img = document.createElement('img')
    img.src = src
    img.draggable = false  // 브라우저 기본 img 드래그 차단
    img.style.cssText = 'max-width:100%;border-radius:10px;display:block;'

    const delBtn = document.createElement('span')
    delBtn.dataset.action = 'delete-img'
    delBtn.style.cssText =
      'position:absolute;top:6px;right:6px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;'
    delBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.3" d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12Z" fill="#F72E00"/>
<path d="M8.97032 8.97C9.11094 8.82955 9.30157 8.75066 9.50032 8.75066C9.69907 8.75066 9.88969 8.82955 10.0303 8.97L12.0003 10.94L13.9703 8.97C14.039 8.89631 14.1218 8.83721 14.2138 8.79622C14.3058 8.75523 14.4051 8.73319 14.5058 8.73141C14.6065 8.72963 14.7065 8.74816 14.7999 8.78588C14.8933 8.8236 14.9781 8.87974 15.0494 8.95096C15.1206 9.02218 15.1767 9.10702 15.2144 9.2004C15.2522 9.29379 15.2707 9.39382 15.2689 9.49452C15.2671 9.59523 15.2451 9.69454 15.2041 9.78654C15.1631 9.87854 15.104 9.96134 15.0303 10.03L13.0603 12L15.0303 13.97C15.1628 14.1122 15.2349 14.3002 15.2315 14.4945C15.2281 14.6888 15.1494 14.8742 15.0119 15.0116C14.8745 15.149 14.6891 15.2277 14.4948 15.2312C14.3005 15.2346 14.1125 15.1625 13.9703 15.03L12.0003 13.06L10.0303 15.03C9.88814 15.1625 9.7001 15.2346 9.50579 15.2312C9.31149 15.2277 9.12611 15.149 8.9887 15.0116C8.85128 14.8742 8.77257 14.6888 8.76914 14.4945C8.76571 14.3002 8.83784 14.1122 8.97032 13.97L10.9403 12L8.97032 10.03C8.82987 9.88938 8.75098 9.69875 8.75098 9.5C8.75098 9.30125 8.82987 9.11063 8.97032 8.97Z" fill="#F72E00"/>
</svg>`

    wrapper.appendChild(img)
    wrapper.appendChild(delBtn)

    range.deleteContents()
    range.insertNode(wrapper)

    // 이미지 블록 바로 뒤에 텍스트 노드 확보 → 커서가 표시되게 함
    let afterNode = wrapper.nextSibling
    if (!afterNode || afterNode.nodeType !== Node.TEXT_NODE) {
      afterNode = document.createTextNode('')
      wrapper.parentNode?.insertBefore(afterNode, wrapper.nextSibling)
    }
    range.setStart(afterNode, 0)
    range.collapse(true)
    sel?.removeAllRanges()
    sel?.addRange(range)
    editor.focus()
    savedRangeRef.current = null
    updateCoverBadge(editor)
    setContent(editor.innerHTML)
    setIsEditorEmpty(false)
  }

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement

    // 삭제 버튼
    const delBtn = target.closest('[data-action="delete-img"]')
    if (delBtn) {
      e.preventDefault()
      e.stopPropagation()
      const block = delBtn.closest('.img-block')
      if (block && editorRef.current?.contains(block)) {
        block.remove()
        const el = editorRef.current
        updateCoverBadge(el!)
        setContent(el?.innerHTML || '')
        setIsEditorEmpty(!el?.textContent?.trim() && !el?.querySelector('img'))
        setHasPhotos(!!el?.querySelector('.img-block'))
      }
      return
    }

    // 대표 사진 설정 버튼
    const setCoverBtn = target.closest('[data-action="set-cover"]')
    if (setCoverBtn) {
      e.preventDefault()
      e.stopPropagation()
      const block = setCoverBtn.closest('.img-block') as HTMLElement | null
      if (block && editorRef.current?.contains(block)) {
        coverBlockRef.current = block
        updateCoverBadge(editorRef.current)
        setContent(editorRef.current.innerHTML)
      }
      return
    }
  }

  /* 드래그 이동: React 합성 이벤트 대신 네이티브 리스너로 처리
     (contenteditable 의 네이티브 drop 복사를 stopPropagation으로 차단) */
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return

    const onDragStart = (e: DragEvent) => {
      const block = (e.target as HTMLElement).closest('.img-block') as HTMLElement | null
      if (!block) return
      draggedImgRef.current = block
      e.dataTransfer!.effectAllowed = 'move'
      e.dataTransfer!.setData('text/plain', 'img-block')
    }

    // 드래그 Y 좌표 기준으로 삽입 위치 (블록 윗 행) 계산
    const getDropBefore = (clientY: number): Element | null => {
      const children = Array.from(editor.children)
      for (const child of children) {
        const rect = child.getBoundingClientRect()
        if (clientY < rect.top + rect.height / 2) return child
      }
      return null  // 맨 끝에 추가
    }

    const showIndicator = (clientY: number) => {
      const ind = dropIndicatorRef.current
      if (!ind) return
      const editorRect = editor.getBoundingClientRect()
      const before = getDropBefore(clientY)
      const top = before
        ? before.getBoundingClientRect().top - editorRect.top
        : editor.getBoundingClientRect().bottom - editorRect.top
      ind.style.display = 'block'
      ind.style.top     = `${top}px`
    }

    const hideIndicator = () => {
      if (dropIndicatorRef.current) dropIndicatorRef.current.style.display = 'none'
    }

    const onDragOver = (e: DragEvent) => {
      if (!draggedImgRef.current) return
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer!.dropEffect = 'move'
      showIndicator(e.clientY)
    }

    const onDrop = (e: DragEvent) => {
      if (!draggedImgRef.current) return
      e.preventDefault()
      e.stopPropagation()
      hideIndicator()

      const dragged = draggedImgRef.current
      const parent = dragged.parentNode
      const next   = dragged.nextSibling
      dragged.remove()

      const before = getDropBefore(e.clientY)
      if (before && editor.contains(before)) {
        editor.insertBefore(dragged, before)
      } else {
        editor.appendChild(dragged)
      }

      draggedImgRef.current = null
      updateCoverBadge(editor)
      setContent(editor.innerHTML)
      setIsEditorEmpty(!editor.textContent?.trim() && !editor.querySelector('img'))
    }

    const onDragEnd = () => { draggedImgRef.current = null; hideIndicator() }

    // capture:true — contenteditable 기본 드롭 처리보다 먼저 실행되어 배지 중복 차단
    editor.addEventListener('dragstart', onDragStart, { capture: true })
    editor.addEventListener('dragover',  onDragOver,  { capture: true })
    editor.addEventListener('drop',      onDrop,      { capture: true })
    editor.addEventListener('dragend',   onDragEnd,   { capture: true })
    return () => {
      editor.removeEventListener('dragstart', onDragStart, { capture: true })
      editor.removeEventListener('dragover',  onDragOver,  { capture: true })
      editor.removeEventListener('drop',      onDrop,      { capture: true })
      editor.removeEventListener('dragend',   onDragEnd,   { capture: true })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        if (ev.target?.result) insertImageAtCursor(ev.target.result as string)
      }
      reader.readAsDataURL(file)
    })
    setHasPhotos(true)
    e.target.value = ''
  }

  const addProject = useProjectStore(s => s.addProject)
  const canSubmit = title.trim().length > 0

  const handleRegister = () => {
    if (!canSubmit) return
    const coverImg = (
      coverBlockRef.current?.querySelector('img') ??
      editorRef.current?.querySelector('.img-block img')
    ) as HTMLImageElement | null
    addProject({
      title: title.trim(),
      status: status === '뜨는 중' ? '진행 중' : status === '준비 중' ? '시작 안 함' : status,
      startDate,
      endDate,
      content: editorRef.current?.innerHTML || content,
      emoji: '🧶',
      timerSecs,
      coverPhoto: coverImg?.src || undefined,
    })
    router.push('/projects')
  }

  return (
    <>

      <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">

        {/* 헤더 */}
        <div className="flex items-center px-4 pt-14 pb-3">
          <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center">
            <ChevronLeft size={22} className="text-[#646464]" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-[2px]">
            {/* 너비 측정용 숨김 span */}
            <span
              ref={titleSizerRef}
              aria-hidden
              className="text-[18px] font-semibold"
              style={{ position: 'absolute', visibility: 'hidden', whiteSpace: 'pre', pointerEvents: 'none', fontFamily: 'inherit' }}
            >
              {title || '프로젝트 제목'}
            </span>
            <input
              ref={titleInputRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="프로젝트 제목"
              className="text-[18px] font-semibold text-[#212121] text-center bg-transparent outline-none placeholder:text-[#c8c8c8] p-0"
              style={{ width: 0, caretColor: 'transparent' }}
            />
            <span className="text-[#F72E00] text-[18px] font-semibold leading-none shrink-0">*</span>
          </div>
          <button
            onClick={handleRegister}
            disabled={!canSubmit}
            className="text-[15px] font-semibold shrink-0 transition-colors"
            style={{ color: canSubmit ? '#F72E00' : '#c8c8c8' }}
          >
            등록
          </button>
        </div>

        {/* 상태·날짜 배지 */}
        <div className="flex items-center gap-2 px-4 pb-4">
          {/* 상태 배지 + 드롭다운 */}
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

          {/* 시작일 배지 — 뜨는 중·쉬는 중: 단일 날짜 */}
          {(status === '뜨는 중' || status === '쉬는 중') && (
            <DateBadge date={startDate} label="시작일" onClick={() => setDatePickerOpen(true)} />
          )}
          {/* 범위 배지 — 완성: yyyy.mm.dd ~ yyyy.mm.dd */}
          {status === '완성' && (() => {
            const s = formatDate(startDate)
            const e = formatDate(endDate)
            const label = s ? `${s} ~ ${e ?? ''}` : '날짜 선택'
            const hasDate = !!s
            return (
              <button
                onClick={() => setDatePickerOpen(true)}
                className="flex items-center gap-[4px] h-8 px-[8px] rounded-[10px] active:opacity-70"
                style={{ background: hasDate ? '#FFEEEA' : 'transparent', border: hasDate ? 'none' : '1px solid #e0e0e0' }}
              >
                {hasDate ? <CalendarStartIcon /> : <CalendarIcon />}
                <span className={hasDate ? 'text-[12px] text-black' : 'text-[13px] font-semibold text-[#646464]'}
                  style={hasDate ? { letterSpacing: '0.6px', fontWeight: 500 } : {}}>
                  {label}
                </span>
              </button>
            )
          })()}
        </div>

        {/* 자유 입력 영역: 상태 배지 하단 ~ 하단 바 상단 전체 커버 */}
        <div
          className="relative flex-1 px-4 pb-[72px] cursor-text"
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('[data-action]') || target.closest('.img-block')) return

            const editor = editorRef.current
            if (!editor) return

            const sel = window.getSelection()

            // 기존 콘텐츠의 최하단 Y 좌표 파악 (비어있으면 에디터 상단 기준)
            let contentBottom: number | null = null
            if (editor.hasChildNodes()) {
              try {
                const r = document.createRange()
                r.selectNodeContents(editor)
                const rects = r.getClientRects()
                if (rects.length > 0) contentBottom = rects[rects.length - 1].bottom
              } catch { /* empty */ }
            }
            const baseY = contentBottom ?? editor.getBoundingClientRect().top
            const lh = parseFloat(getComputedStyle(editor).lineHeight) || 24

            if (e.clientY > baseY + 4) {
              // 콘텐츠 아래(또는 빈 에디터의 첫 줄 아래) 클릭 → <br> 삽입으로 줄 이동
              const lines = Math.max(1, Math.round((e.clientY - baseY) / lh))
              for (let i = 0; i < lines; i++) {
                editor.appendChild(document.createElement('br'))
              }
              const endRange = document.createRange()
              endRange.selectNodeContents(editor)
              endRange.collapse(false)
              sel?.removeAllRanges()
              sel?.addRange(endRange)
              setContent(editor.innerHTML)
            } else {
              // 콘텐츠 영역 내 클릭 → 정확한 위치에 커서 배치
              const caret = document.caretRangeFromPoint?.(e.clientX, e.clientY) ?? null
              if (caret && editor.contains(caret.startContainer)) {
                sel?.removeAllRanges()
                sel?.addRange(caret)
              } else {
                const endRange = document.createRange()
                endRange.selectNodeContents(editor)
                endRange.collapse(false)
                sel?.removeAllRanges()
                sel?.addRange(endRange)
              }
            }
            editor.focus()
          }}
        >
          {isEditorEmpty && (
            <p className="absolute top-0 left-4 text-[15px] text-[#c8c8c8] pointer-events-none select-none leading-relaxed">
              기록하고 싶은 내용을 자유롭게 입력해주세요
            </p>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={() => {
              const el = editorRef.current
              if (!el) return
              setContent(el.innerHTML)
              setIsEditorEmpty(!el.textContent?.trim() && !el.querySelector('img'))
            }}
            onClick={handleEditorClick}
            onMouseUp={saveRange}
            onKeyUp={saveRange}
            onTouchEnd={saveRange}
            className="w-full text-[15px] text-[#212121] outline-none leading-relaxed"
            style={{ wordBreak: 'break-word', minHeight: 200 }}
          />
          {/* 드래그 드롭 위치 — 블록 사이 가로 선 */}
          <div
            ref={dropIndicatorRef}
            style={{
              display: 'none',
              position: 'absolute',
              left: 0,
              right: 0,
              height: 2,
              background: '#F72E00',
              borderRadius: 1,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </div>

        {/* 하단 컨테이너: 네비게이션 바 + 정보 패널 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white z-20">
          {/* 네비게이션 바 */}
          <div className="border-t border-[#F0F0F0] flex items-center px-5" style={{ height: 72, gap: 12 }}>
            {/* 사진 버튼 */}
            <label className="flex items-center gap-[6px] cursor-pointer active:opacity-50" onMouseDown={saveRange} onTouchStart={saveRange}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9.778 21H14.222C17.343 21 18.904 21 20.025 20.265C20.5088 19.9481 20.9254 19.539 21.251 19.061C22 17.961 22 16.428 22 13.364C22 10.3 22 8.76699 21.251 7.66699C20.9254 7.18898 20.5088 6.77984 20.025 6.46299C19.305 5.98999 18.403 5.82099 17.022 5.76099C16.363 5.76099 15.796 5.27099 15.667 4.63599C15.5684 4.17085 15.3123 3.75402 14.9418 3.45594C14.5714 3.15785 14.1095 2.99679 13.634 2.99999H10.366C9.378 2.99999 8.527 3.68499 8.333 4.63599C8.204 5.27099 7.637 5.76099 6.978 5.76099C5.598 5.82099 4.696 5.99099 3.975 6.46299C3.49154 6.77995 3.07527 7.18907 2.75 7.66699C2 8.76699 2 10.299 2 13.364C2 16.429 2 17.96 2.749 19.061C3.073 19.537 3.489 19.946 3.975 20.265C5.096 21 6.657 21 9.778 21Z" fill={hasPhotos ? '#F72E00' : '#838383'}/>
                <path d="M17.5557 9.27201C17.4472 9.27109 17.3396 9.29154 17.239 9.3322C17.1385 9.37286 17.0469 9.43293 16.9695 9.50898C16.8922 9.58503 16.8306 9.67558 16.7882 9.77544C16.7458 9.87531 16.7236 9.98254 16.7227 10.091C16.7227 10.543 17.0957 10.909 17.5557 10.909H18.6667C19.1267 10.909 19.5007 10.542 19.5007 10.091C19.4997 9.98245 19.4774 9.87514 19.435 9.77521C19.3926 9.67528 19.3309 9.58469 19.2534 9.50863C19.176 9.43256 19.0843 9.37251 18.9836 9.33191C18.8829 9.29131 18.7752 9.27096 18.6667 9.27201H17.5557Z" fill={hasPhotos ? '#FFC2B4' : '#D2D2D2'}/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12 9.27197C9.69998 9.27197 7.83398 11.104 7.83398 13.363C7.83398 15.622 9.69898 17.454 12.001 17.454C14.301 17.454 16.167 15.623 16.167 13.364C16.167 11.105 14.302 9.27197 12.001 9.27197M12.001 10.909C10.621 10.909 9.50098 12.008 9.50098 13.363C9.50098 14.718 10.621 15.818 12.001 15.818C13.382 15.818 14.501 14.719 14.501 13.363C14.501 12.008 13.382 10.909 12.001 10.909Z" fill={hasPhotos ? '#FFC2B4' : '#D2D2D2'}/>
              </svg>
              <span className="text-[12px] font-normal" style={{ color: hasPhotos ? '#F72E00' : '#646464' }}>사진</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
            </label>
            {/* 영상 버튼 */}
            <button onClick={() => setVideoOpen(true)} className="flex items-center gap-[6px] active:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M15 9.649L20.646 7.512C20.7974 7.45469 20.9605 7.43499 21.1212 7.45462C21.2819 7.47424 21.4355 7.53259 21.5686 7.62466C21.7018 7.71673 21.8107 7.83975 21.8858 7.98317C21.9609 8.12658 22.0001 8.28609 22 8.448V15.557C21.9999 15.7185 21.9607 15.8777 21.8858 16.0207C21.8108 16.1638 21.7023 16.2866 21.5695 16.3786C21.4367 16.4706 21.2836 16.5291 21.1233 16.549C20.963 16.5689 20.8003 16.5497 20.649 16.493L15 14.375V16C15 16.5304 14.7893 17.0391 14.4142 17.4142C14.0391 17.7893 13.5304 18 13 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H13C13.5304 6 14.0391 6.21071 14.4142 6.58579C14.7893 6.96086 15 7.46957 15 8V9.649Z" fill={videos.length > 0 ? '#F72E00' : '#838383'}/>
              </svg>
              <span className="text-[12px] font-normal" style={{ color: videos.length > 0 ? '#F72E00' : '#646464' }}>영상</span>
            </button>
            {/* 도안 버튼 */}
            <button onClick={() => setPatternOpen(true)} className="flex items-center gap-[6px] active:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <g clipPath="url(#clip0_pattern)">
                  <path d="M7.5 5C7.10218 5 6.72064 5.15804 6.43934 5.43934C6.15804 5.72065 6 6.10218 6 6.5V17.5C6 17.8978 6.15804 18.2794 6.43934 18.5607C6.72064 18.842 7.10218 19 7.5 19H16.5C16.8978 19 17.2794 18.842 17.5607 18.5607C17.842 18.2794 18 17.8978 18 17.5V10C18.0001 9.9343 17.9873 9.86921 17.9622 9.80847C17.9372 9.74773 17.9004 9.69252 17.854 9.646L13.354 5.146C13.3075 5.0996 13.2523 5.06282 13.1915 5.03777C13.1308 5.01272 13.0657 4.99988 13 5H7.5Z" fill={pdfUrl ? '#F72E00' : '#838383'}/>
                  <path d="M18 10C18.0001 9.9343 17.9873 9.86921 17.9622 9.80847C17.9372 9.74773 17.9004 9.69252 17.854 9.646L13.354 5.146C13.3075 5.0996 13.2523 5.06282 13.1915 5.03777C13.1308 5.01272 13.0657 4.99988 13 5V9.5C13 9.63261 13.0527 9.75979 13.1464 9.85355C13.2402 9.94732 13.3674 10 13.5 10H18Z" fill={pdfUrl ? '#FFC2B4' : '#D2D2D2'}/>
                </g>
                <defs>
                  <clipPath id="clip0_pattern">
                    <rect width="14" height="14" fill="white" transform="translate(5 5)"/>
                  </clipPath>
                </defs>
              </svg>
              <span className="text-[12px] font-normal" style={{ color: pdfUrl ? '#F72E00' : '#646464' }}>도안</span>
            </button>
            {/* 정보 버튼 */}
            <button onClick={() => setInfoOpen(v => !v)} className="flex items-center gap-[6px] active:opacity-50">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M20 12C20 16.4184 16.4184 20 12 20C7.5816 20 4 16.4184 4 12C4 7.5816 7.5816 4 12 4C16.4184 4 20 7.5816 20 12Z" fill="#D2D2D2"/>
                <path d="M14.845 10.3821L13.6281 9.16451C12.797 8.33174 12.3809 7.91576 11.9346 8.01422C11.4882 8.11267 11.2864 8.66567 10.881 9.77001L10.607 10.5183C10.4987 10.8136 10.4453 10.9605 10.3477 11.0737C10.3042 11.125 10.2546 11.1708 10.2 11.2099C10.0786 11.2977 9.9276 11.3396 9.62565 11.4232C8.94461 11.6103 8.60328 11.7038 8.47528 11.927C8.42002 12.0234 8.39115 12.1326 8.39159 12.2437C8.39323 12.5013 8.64266 12.7508 9.14236 13.2512L9.50913 13.6188L8.17989 14.9496C8.06455 15.0652 7.99985 15.2218 8 15.385C8.00015 15.5483 8.06516 15.7048 8.18071 15.8201C8.29627 15.9354 8.4529 16.0002 8.61617 16C8.77943 15.9998 8.93595 15.9348 9.05128 15.8193L10.3789 14.4893L10.767 14.8774C11.27 15.3804 11.5219 15.6322 11.7803 15.6322C11.8894 15.6325 11.9966 15.6043 12.0913 15.5502C12.3161 15.4222 12.4105 15.0792 12.5992 14.3933C12.6813 14.0914 12.7239 13.9404 12.8109 13.819C12.8492 13.7654 12.893 13.7173 12.9422 13.6746C13.0554 13.5761 13.2015 13.5212 13.4944 13.4121L14.2509 13.1274C15.3438 12.7171 15.8903 12.512 15.9863 12.0665C16.0823 11.621 15.6704 11.2083 14.845 10.3821Z" fill="#838383"/>
              </svg>
              <span className="text-[12px] font-normal text-[#646464]">정보</span>
            </button>
          </div>

          {/* 정보 그리드 패널 — 네비게이션 바 아래 슬라이드다운 */}
          <div
            style={{
              maxHeight: infoOpen ? 240 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className="border-t border-[#F0F0F0] px-8 pt-6 pb-8 grid grid-cols-4 gap-y-6">
              {[
                { emoji: '🧶', label: '실' },
                { emoji: '🪡', label: '바늘' },
                { emoji: '📏', label: '게이지' },
                { emoji: '🔗', label: '링크' },
                { emoji: '📍', label: '장소' },
                { emoji: '📎', label: '파일' },
              ].map(item => (
                <button
                  key={item.label}
                  className="flex flex-col items-center gap-2 active:opacity-50"
                >
                  <span className="text-[36px] leading-none">{item.emoji}</span>
                  <span className="text-[13px] text-[#343434]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 달력 날짜 선택 */}
        {datePickerOpen && status === '완성' ? (
          <CalendarPicker
            rangeMode
            rangeStart={startDate}
            rangeEnd={endDate}
            onRangeChange={(s, e) => { setStartDate(s); setEndDate(e) }}
            onClose={() => setDatePickerOpen(false)}
          />
        ) : datePickerOpen ? (
          <CalendarPicker
            value={startDate}
            onChange={date => { setStartDate(date); setDatePickerOpen(false) }}
            onClose={() => setDatePickerOpen(false)}
          />
        ) : null}
      </div>

      {/* 도안 시트 */}
      <PatternSheet
        isOpen={patternOpen}
        onClose={() => setPatternOpen(false)}
        pdfUrl={pdfUrl}
        onPdfChange={setPdfUrl}
      />

      {/* 영상 시트 */}
      <VideoSheet
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videos={videos}
        onVideosChange={setVideos}
      />

    </>
  )
}
