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

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleSizerRef = useRef<HTMLSpanElement>(null)
  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)
  const draggedImgRef = useRef<HTMLElement | null>(null)
  const dropIndicatorRef = useRef<HTMLDivElement>(null)
  const coverBlockRef    = useRef<HTMLElement | null>(null)

  /* 대표 사진/대표 사진 설정 배지 갱신 */
  const updateCoverBadge = (editor: HTMLDivElement) => {
    editor.querySelectorAll('.cover-badge, .set-cover-badge').forEach(b => b.remove())
    const blocks = Array.from(editor.querySelectorAll('.img-block')) as HTMLElement[]
    if (blocks.length === 0) { coverBlockRef.current = null; return }

    // 현재 대표 사진이 에디터 안에 없으면 첫 번째로 초기화
    if (!coverBlockRef.current || !editor.contains(coverBlockRef.current)) {
      coverBlockRef.current = blocks[0]
    }

    blocks.forEach(block => {
      if (block === coverBlockRef.current) {
        const badge = document.createElement('div')
        badge.className = 'cover-badge'
        badge.textContent = '대표 사진'
        badge.style.cssText =
          'position:absolute;top:8px;left:8px;background:#F72E00;color:#fff;' +
          'font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;' +
          'pointer-events:none;z-index:2;letter-spacing:0.3px;'
        block.insertBefore(badge, block.firstChild)
      } else {
        const badge = document.createElement('div')
        badge.className = 'set-cover-badge'
        badge.dataset.action = 'set-cover'
        badge.textContent = '대표 사진 설정'
        badge.style.cssText =
          'position:absolute;top:8px;left:8px;background:rgba(0,0,0,0.52);color:#fff;' +
          'font-size:11px;font-weight:700;padding:3px 8px;border-radius:4px;' +
          'cursor:pointer;z-index:2;letter-spacing:0.3px;'
        block.insertBefore(badge, block.firstChild)
      }
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
    range.setStartAfter(wrapper)
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

    const showIndicator = (x: number, y: number) => {
      const ind = dropIndicatorRef.current
      if (!ind) return
      const range = document.caretRangeFromPoint(x, y)
      if (range && editor.contains(range.startContainer)) {
        const rects = range.getClientRects()
        const editorRect = editor.getBoundingClientRect()
        const r = rects.length > 0 ? rects[0] : null
        if (r) {
          ind.style.display = 'block'
          ind.style.left    = `${r.left - editorRect.left}px`
          ind.style.top     = `${r.top  - editorRect.top}px`
          ind.style.height  = `${r.height || 18}px`
          return
        }
      }
      // 에디터 끝(하단 빈 공간) 드래그 → 마지막 위치에 표시
      const editorRect = editor.getBoundingClientRect()
      ind.style.display = 'block'
      ind.style.left    = `${x - editorRect.left}px`
      ind.style.top     = `${y - editorRect.top}px`
      ind.style.height  = '18px'
    }

    const hideIndicator = () => {
      if (dropIndicatorRef.current) dropIndicatorRef.current.style.display = 'none'
    }

    const onDragOver = (e: DragEvent) => {
      if (!draggedImgRef.current) return
      e.preventDefault()
      e.stopPropagation()
      e.dataTransfer!.dropEffect = 'move'
      showIndicator(e.clientX, e.clientY)
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

      const range = document.caretRangeFromPoint(e.clientX, e.clientY)
      if (range && editor.contains(range.startContainer)) {
        range.insertNode(dragged)
        range.setStartAfter(dragged)
        range.collapse(true)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
      } else {
        parent ? parent.insertBefore(dragged, next) : editor.appendChild(dragged)
      }

      draggedImgRef.current = null
      updateCoverBadge(editor)
      setContent(editor.innerHTML)
      setIsEditorEmpty(!editor.textContent?.trim() && !editor.querySelector('img'))
    }

    const onDragEnd = () => { draggedImgRef.current = null; hideIndicator() }

    editor.addEventListener('dragstart', onDragStart)
    editor.addEventListener('dragover',  onDragOver)
    editor.addEventListener('drop',      onDrop)
    editor.addEventListener('dragend',   onDragEnd)
    return () => {
      editor.removeEventListener('dragstart', onDragStart)
      editor.removeEventListener('dragover',  onDragOver)
      editor.removeEventListener('drop',      onDrop)
      editor.removeEventListener('dragend',   onDragEnd)
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
          className="relative flex-1 px-4 pb-[72px] flex flex-col cursor-text"
          onClick={(e) => {
            const target = e.target as HTMLElement
            if (target.closest('[data-action="delete-img"]')) return

            const editor = editorRef.current
            if (!editor) return
            editor.focus()

            const sel = window.getSelection()

            // 클릭 좌표로 커서 위치 결정
            const range = document.caretRangeFromPoint?.(e.clientX, e.clientY) ?? null

            if (range && editor.contains(range.startContainer)) {
              sel?.removeAllRanges()
              sel?.addRange(range)
            } else {
              // 에디터 하단 여백 클릭 → 맨 끝
              const endRange = document.createRange()
              endRange.selectNodeContents(editor)
              endRange.collapse(false)
              sel?.removeAllRanges()
              sel?.addRange(endRange)
            }

            // 클릭한 행의 맨 앞으로 커서 이동
            ;(sel as Selection & { modify?: (...a: string[]) => void })
              ?.modify?.('move', 'backward', 'lineBoundary')
          }}
        >
          {isEditorEmpty && (
            <p className="text-[15px] text-[#c8c8c8] pointer-events-none select-none leading-relaxed">
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
            className="flex-1 w-full text-[15px] text-[#212121] outline-none leading-relaxed"
            style={{ wordBreak: 'break-word', minHeight: 200 }}
          />
          {/* 드래그 드롭 위치 커서 표시 */}
          <div
            ref={dropIndicatorRef}
            style={{
              display: 'none',
              position: 'absolute',
              width: 2,
              background: '#F72E00',
              borderRadius: 1,
              pointerEvents: 'none',
              zIndex: 10,
            }}
          />
        </div>

        {/* 하단 네비게이션 바 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[#F0F0F0] z-20 flex items-center px-5" style={{ height: 72, gap: 12 }}>
          <label className="flex items-center gap-[6px] cursor-pointer active:opacity-50" onMouseDown={saveRange} onTouchStart={saveRange}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9.778 21H14.222C17.343 21 18.904 21 20.025 20.265C20.5088 19.9482 20.9254 19.5391 21.251 19.061C22 17.961 22 16.428 22 13.364C22 10.3 22 8.76705 21.251 7.66705C20.9254 7.18904 20.5088 6.77991 20.025 6.46305C19.305 5.99005 18.403 5.82105 17.022 5.76105C16.363 5.76105 15.796 5.27105 15.667 4.63605C15.5684 4.17092 15.3123 3.75408 14.9418 3.456C14.5714 3.15791 14.1095 2.99686 13.634 3.00005H10.366C9.378 3.00005 8.527 3.68505 8.333 4.63605C8.204 5.27105 7.637 5.76105 6.978 5.76105C5.598 5.82105 4.696 5.99105 3.975 6.46305C3.49154 6.78001 3.07527 7.18914 2.75 7.66705C2 8.76705 2 10.299 2 13.364C2 16.429 2 17.96 2.749 19.061C3.073 19.537 3.489 19.946 3.975 20.265C5.096 21 6.657 21 9.778 21Z" fill="#838383"/>
              <path d="M17.5561 9.27201C17.4477 9.27109 17.3401 9.29154 17.2395 9.3322C17.1389 9.37286 17.0474 9.43293 16.97 9.50898C16.8927 9.58503 16.831 9.67558 16.7887 9.77544C16.7463 9.87531 16.7241 9.98254 16.7231 10.091C16.7231 10.543 17.0961 10.909 17.5561 10.909H18.6671C19.1271 10.909 19.5011 10.542 19.5011 10.091C19.5002 9.98245 19.4779 9.87514 19.4355 9.77521C19.3931 9.67528 19.3314 9.58469 19.2539 9.50863C19.1765 9.43256 19.0848 9.37251 18.9841 9.33191C18.8834 9.29131 18.7757 9.27096 18.6671 9.27201H17.5561Z" fill="#D2D2D2"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 9.27197C9.69998 9.27197 7.83398 11.104 7.83398 13.363C7.83398 15.622 9.69898 17.454 12.001 17.454C14.301 17.454 16.167 15.623 16.167 13.364C16.167 11.105 14.302 9.27197 12.001 9.27197M12.001 10.909C10.621 10.909 9.50098 12.008 9.50098 13.363C9.50098 14.718 10.621 15.818 12.001 15.818C13.382 15.818 14.501 14.719 14.501 13.363C14.501 12.008 13.382 10.909 12.001 10.909Z" fill="#D2D2D2"/>
            </svg>
            <span className="text-[12px] font-normal text-[#646464]">사진</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
          </label>
          <button className="flex items-center gap-[6px] active:opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M15 9.649L20.646 7.512C20.7974 7.45469 20.9605 7.43499 21.1212 7.45462C21.2819 7.47424 21.4355 7.53259 21.5686 7.62466C21.7018 7.71673 21.8107 7.83975 21.8858 7.98317C21.9609 8.12658 22.0001 8.28609 22 8.448V15.557C21.9999 15.7185 21.9607 15.8777 21.8858 16.0207C21.8108 16.1638 21.7023 16.2866 21.5695 16.3786C21.4367 16.4706 21.2836 16.5291 21.1233 16.549C20.963 16.5689 20.8003 16.5497 20.649 16.493L15 14.375V16C15 16.5304 14.7893 17.0391 14.4142 17.4142C14.0391 17.7893 13.5304 18 13 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H13C13.5304 6 14.0391 6.21071 14.4142 6.58579C14.7893 6.96086 15 7.46957 15 8V9.649Z" fill="#838383"/>
            </svg>
            <span className="text-[12px] font-normal text-[#646464]">영상</span>
          </button>
          <button className="flex items-center gap-[6px] active:opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_pattern)">
                <path d="M7.5 5C7.10218 5 6.72064 5.15804 6.43934 5.43934C6.15804 5.72065 6 6.10218 6 6.5V17.5C6 17.8978 6.15804 18.2794 6.43934 18.5607C6.72064 18.842 7.10218 19 7.5 19H16.5C16.8978 19 17.2794 18.842 17.5607 18.5607C17.842 18.2794 18 17.8978 18 17.5V10C18.0001 9.9343 17.9873 9.86921 17.9622 9.80847C17.9372 9.74773 17.9004 9.69252 17.854 9.646L13.354 5.146C13.3075 5.0996 13.2523 5.06282 13.1915 5.03777C13.1308 5.01272 13.0657 4.99988 13 5H7.5Z" fill="#838383"/>
                <path d="M18 10C18.0001 9.9343 17.9873 9.86921 17.9622 9.80847C17.9372 9.74773 17.9004 9.69252 17.854 9.646L13.354 5.146C13.3075 5.0996 13.2523 5.06282 13.1915 5.03777C13.1308 5.01272 13.0657 4.99988 13 5V9.5C13 9.63261 13.0527 9.75979 13.1464 9.85355C13.2402 9.94732 13.3674 10 13.5 10H18Z" fill="#D2D2D2"/>
              </g>
              <defs>
                <clipPath id="clip0_pattern">
                  <rect width="14" height="14" fill="white" transform="translate(5 5)"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-[12px] font-normal text-[#646464]">도안</span>
          </button>
          <button className="flex items-center gap-[6px] active:opacity-50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20 12C20 16.4184 16.4184 20 12 20C7.5816 20 4 16.4184 4 12C4 7.5816 7.5816 4 12 4C16.4184 4 20 7.5816 20 12Z" fill="#D2D2D2"/>
              <path d="M14.845 10.3821L13.6281 9.16451C12.797 8.33174 12.3809 7.91576 11.9346 8.01422C11.4882 8.11267 11.2864 8.66567 10.881 9.77001L10.607 10.5183C10.4987 10.8136 10.4453 10.9605 10.3477 11.0737C10.3042 11.125 10.2546 11.1708 10.2 11.2099C10.0786 11.2977 9.9276 11.3396 9.62565 11.4232C8.94461 11.6103 8.60328 11.7038 8.47528 11.927C8.42002 12.0234 8.39115 12.1326 8.39159 12.2437C8.39323 12.5013 8.64266 12.7508 9.14236 13.2512L9.50913 13.6188L8.17989 14.9496C8.06455 15.0652 7.99985 15.2218 8 15.385C8.00015 15.5483 8.06516 15.7048 8.18071 15.8201C8.29627 15.9354 8.4529 16.0002 8.61617 16C8.77943 15.9998 8.93595 15.9348 9.05128 15.8193L10.3789 14.4893L10.767 14.8774C11.27 15.3804 11.5219 15.6322 11.7803 15.6322C11.8894 15.6325 11.9966 15.6043 12.0913 15.5502C12.3161 15.4222 12.4105 15.0792 12.5992 14.3933C12.6813 14.0914 12.7239 13.9404 12.8109 13.819C12.8492 13.7654 12.893 13.7173 12.9422 13.6746C13.0554 13.5761 13.2015 13.5212 13.4944 13.4121L14.2509 13.1274C15.3438 12.7171 15.8903 12.512 15.9863 12.0665C16.0823 11.621 15.6704 11.2083 14.845 10.3821Z" fill="#838383"/>
            </svg>
            <span className="text-[12px] font-normal text-[#646464]">정보</span>
          </button>
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
    </>
  )
}
