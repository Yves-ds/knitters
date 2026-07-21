'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useProjectStore, YarnItem, NeedleItem, GaugeItem } from '@/store/projectStore'
import { Pattern, MOCK_PATTERNS } from '@/lib/mockPatterns'
import { PatternInfoCard, PatternDetailSheet, parseSizes } from '@/components/pattern/PatternDetailSheet'
import PatternSelectSheet from '@/components/pattern/PatternSelectSheet'
import {
  DotMenu, YarnSheet, NeedleSheet, GaugeSheet,
  MaterialCard, GaugeCard, SectionHeader, EmptyAddButton, uid,
} from '@/components/materials/MaterialSheets'

type Tab = '정보' | '도안' | '기록'
type PageMode = 'tabs' | 'direct'
const STATUS_OPTIONS = ['준비 중', '뜨는 중', '쉬는 중', '완성']

interface Counter { id: number; name: string; count: number }
interface TimelineEntry { id: number; text: string; createdAt: number; photo?: string }

/* ── 상태 배지 ── */
function StatusBadge({ status }: { status: string }) {
  if (status === '뜨는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#DDEDFF' }}>
      <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
        {[1, 0.5, 1].map((op, i) => <span key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF', opacity: op }} />)}
      </div>
      <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: '#209BFF' }}>뜨는 중</span>
    </div>
  )
  if (status === '쉬는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#FFEEEA' }}>
      <div className="flex items-center gap-[5px]">
        <span className="w-2 h-2 rounded-full" style={{ background: '#F72E00' }} />
        <span className="w-2 h-2 rounded-full" style={{ background: '#F72E00' }} />
      </div>
      <span className="text-[14px] font-semibold" style={{ color: '#F72E00' }}>쉬는 중</span>
    </div>
  )
  if (status === '완성') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#E9FFE6' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#13C100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="text-[14px] font-semibold" style={{ color: '#13C100' }}>완성</span>
    </div>
  )
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#EDEDED' }}>
      <div className="flex items-center gap-[3px]">
        {[1, 0.5, 1].map((op, i) => <span key={i} className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B', opacity: op }} />)}
      </div>
      <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: '#3B3B3B' }}>준비 중</span>
    </div>
  )
}

/* ── 달력 아이콘 ── */
function CalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#646464" strokeWidth="1.5" />
      <path d="M3 9h18" stroke="#646464" strokeWidth="1.5" />
      <path d="M8 2v2M16 2v2" stroke="#646464" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/* ── 달력 피커 ── */
function CalendarPicker({ value, onChange, onClose }: { value?: string; onChange: (d: string) => void; onClose: () => void }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(value ? parseInt(value.split('-')[0]) : today.getFullYear())
  const [viewMonth, setViewMonth] = useState(value ? parseInt(value.split('-')[1]) - 1 : today.getMonth())
  const DAYS = ['일', '월', '화', '수', '목', '금', '토']
  const pad = (n: number) => String(n).padStart(2, '0')
  const toISO = (day: number) => `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white rounded-t-[20px] z-50 px-5 pt-3 pb-8">
        <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-3 px-1">
          <button onClick={() => { viewMonth === 0 ? (setViewYear(y => y - 1), setViewMonth(11)) : setViewMonth(m => m - 1) }} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#F0F0F0]">
            <ChevronLeft size={20} className="text-[#646464]" />
          </button>
          <span className="text-[16px] font-bold text-[#212121]">{viewYear}년 {viewMonth + 1}월</span>
          <button onClick={() => { viewMonth === 11 ? (setViewYear(y => y + 1), setViewMonth(0)) : setViewMonth(m => m + 1) }} className="w-9 h-9 flex items-center justify-center rounded-full active:bg-[#F0F0F0]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#646464" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d, i) => <div key={d} className="text-center text-[12px] font-semibold py-1" style={{ color: i === 0 ? '#F72E00' : i === 6 ? '#3B86FB' : '#9A9A9A' }}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            const col = idx % 7
            const sel = day !== null && value === toISO(day)
            const isT = day !== null && today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day
            return (
              <div key={idx} className="flex items-center justify-center">
                {day !== null && (
                  <button onClick={() => onChange(toISO(day))} className="w-9 h-9 flex items-center justify-center rounded-full text-[14px]"
                    style={{ background: sel ? '#F72E00' : 'transparent', color: sel ? '#fff' : isT ? '#F72E00' : col === 0 ? '#F72E00' : col === 6 ? '#3B86FB' : '#212121', fontWeight: sel || isT ? 700 : 400 }}>
                    {day}
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <button onClick={onClose} className="mt-5 w-full py-3.5 bg-[#F72E00] text-white text-[15px] font-semibold rounded-[12px] active:opacity-80">확인</button>
      </div>
    </>
  )
}

/* ══════════════════════════════════════════════ */
export default function NewProjectPage() {
  const router = useRouter()
  const addProject = useProjectStore(s => s.addProject)

  /* ── 모드 ── */
  const [pageMode, setPageMode] = useState<PageMode>('tabs')

  /* ── 공통 상태 ── */
  const [title, setTitle] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('정보')
  const [status, setStatus] = useState('준비 중')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [coverPhoto, setCoverPhoto] = useState<string | undefined>()
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [patternSelectOpen, setPatternSelectOpen] = useState(false)
  const [patternDetailOpen, setPatternDetailOpen] = useState(false)
  const [datePickerTarget, setDatePickerTarget] = useState<'start' | 'end' | null>(null)
  const [statusDropOpen, setStatusDropOpen] = useState(false)
  const [infoSizeDropOpen, setInfoSizeDropOpen] = useState(false)
  const statusBtnRef = useRef<HTMLDivElement>(null)

  /* ── 직접 입력 전용 상태 ── */
  const [directSize, setDirectSize] = useState('')
  const [directYarns, setDirectYarns] = useState<YarnItem[]>([])
  const [directNeedles, setDirectNeedles] = useState<NeedleItem[]>([])
  const [directGauges, setDirectGauges] = useState<GaugeItem[]>([])
  const [yarnOpen, setYarnOpen] = useState(false)
  const [editingYarn, setEditingYarn] = useState<YarnItem | undefined>()
  const [needleOpen, setNeedleOpen] = useState(false)
  const [editingNeedle, setEditingNeedle] = useState<NeedleItem | undefined>()
  const [gaugeOpen, setGaugeOpen] = useState(false)
  const [editingGauge, setEditingGauge] = useState<GaugeItem | undefined>()

  /* ── 기록 탭: 타이머 ── */
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSecs, setTimerSecs] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── 기록 탭: 단수 카운터 ── */
  const [counters, setCounters] = useState<Counter[]>([{ id: 1, name: '단수', count: 0 }, { id: 2, name: '단수 2', count: 0 }])
  const [editingCounterName, setEditingCounterName] = useState<number | null>(null)
  const counterIdRef = useRef(3)

  /* ── 기록 탭: 타임라인 ── */
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([])
  const [newEntryText, setNewEntryText] = useState('')
  const [newEntryPhoto, setNewEntryPhoto] = useState<string | undefined>()
  const entryIdRef = useRef(1)
  const entryInputRef = useRef<HTMLTextAreaElement>(null)
  const entryPhotoInputRef = useRef<HTMLInputElement>(null)
  const timelineEndRef = useRef<HTMLDivElement>(null)

  /* ── refs ── */
  const photoInputRef = useRef<HTMLInputElement>(null)

  /* ── URL 파라미터 ── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('selectPattern') === '1') setPatternSelectOpen(true)
    if (params.get('direct') === '1') setPageMode('direct')
    const pid = params.get('patternId')
    if (pid) {
      const found = MOCK_PATTERNS.find(p => p.id === pid)
      if (found) handleSelectPatternOnce(found)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectPatternOnce = (pattern: Pattern) => {
    setSelectedPattern(pattern)
    const sizes = parseSizes(pattern.size)
    setSelectedSize(sizes[0] || '')
    setTitle(pattern.name)
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setStartDate(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`)
    setStatus('뜨는 중')
    setPageMode('direct')
  }

  /* ── 상태 드롭다운 외부 클릭 닫기 ── */
  useEffect(() => {
    if (!statusDropOpen) return
    const h = (e: MouseEvent) => { if (!statusBtnRef.current?.contains(e.target as Node)) setStatusDropOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [statusDropOpen])

  /* ── 타이머 ── */
  useEffect(() => {
    if (timerRunning) { intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000) }
    else { if (intervalRef.current) clearInterval(intervalRef.current) }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  /* ── 타임라인 스크롤 ── */
  useEffect(() => { timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [timelineEntries])

  const formatTimer = (secs: number) => {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSelectPattern = (pattern: Pattern) => {
    setSelectedPattern(pattern)
    setPatternSelectOpen(false)
    const sizes = parseSizes(pattern.size)
    setSelectedSize(sizes[0] || '')
    setPageMode('direct')
    setTitle(pattern.name)
    const today = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    setStartDate(`${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`)
    setStatus('뜨는 중')
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => { if (ev.target?.result) setCoverPhoto(ev.target.result as string) }
    reader.readAsDataURL(file); e.target.value = ''
  }
  const handleEntryPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => { if (ev.target?.result) setNewEntryPhoto(ev.target.result as string) }; r.readAsDataURL(f); e.target.value = ''
  }

  const formatDate = (iso: string) => { if (!iso) return ''; const [y, m, d] = iso.split('-'); return `${y}.${m}.${d}` }
  const formatEntryDate = (ts: number) => { const d = new Date(ts); const p = (n: number) => String(n).padStart(2, '0'); return `${d.getMonth() + 1}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}` }

  /* ── 카운터 ── */
  const addCounter = () => { const id = counterIdRef.current++; setCounters(prev => [...prev, { id, name: `단수 ${id}`, count: 0 }]) }
  const changeCounter = (id: number, delta: number) => setCounters(prev => prev.map(c => c.id === id ? { ...c, count: Math.max(0, c.count + delta) } : c))
  const resetCounter = (id: number) => setCounters(prev => prev.map(c => c.id === id ? { ...c, count: 0 } : c))
  const renameCounter = (id: number, name: string) => setCounters(prev => prev.map(c => c.id === id ? { ...c, name } : c))
  const removeCounter = (id: number) => setCounters(prev => prev.filter(c => c.id !== id))

  /* ── 타임라인 ── */
  const addEntry = () => {
    const text = newEntryText.trim()
    if (!text && !newEntryPhoto) return
    setTimelineEntries(prev => [...prev, { id: entryIdRef.current++, text, createdAt: Date.now(), photo: newEntryPhoto }])
    setNewEntryText(''); setNewEntryPhoto(undefined); entryInputRef.current?.focus()
  }
  const removeEntry = (id: number) => setTimelineEntries(prev => prev.filter(e => e.id !== id))

  /* ── 직접 입력: 재료 조작 ── */
  const saveYarn = (item: YarnItem) => setDirectYarns(prev => prev.find(y => y.id === item.id) ? prev.map(y => y.id === item.id ? item : y) : [...prev, item])
  const removeYarn = (id: string) => setDirectYarns(prev => prev.filter(y => y.id !== id))
  const saveNeedle = (item: NeedleItem) => setDirectNeedles(prev => prev.find(n => n.id === item.id) ? prev.map(n => n.id === item.id ? item : n) : [...prev, item])
  const removeNeedle = (id: string) => setDirectNeedles(prev => prev.filter(n => n.id !== id))
  const saveGauge = (item: GaugeItem) => setDirectGauges(prev => prev.find(g => g.id === item.id) ? prev.map(g => g.id === item.id ? item : g) : [...prev, item])
  const removeGauge = (id: string) => setDirectGauges(prev => prev.filter(g => g.id !== id))

  const canSubmit = title.trim().length > 0
  const patternSizes = selectedPattern ? parseSizes(selectedPattern.size) : []
  const hasMultipleSizes = patternSizes.length > 1

  const handleSave = () => {
    if (!canSubmit) return
    addProject({
      title: title.trim(), status, startDate, endDate,
      content: timelineEntries.map(e => `[${formatEntryDate(e.createdAt)}] ${e.text}`).join('\n'),
      emoji: '🧶', timerSecs, coverPhoto, videos: [], pdfUrl: null,
      patternId: selectedPattern?.id,
      patternName: selectedPattern?.name || undefined,
      patternAuthor: selectedPattern?.author || undefined,
      patternSelectedSize: pageMode === 'direct' ? (directSize.trim() || undefined) : (selectedSize || undefined),
      yarns: pageMode === 'direct' ? directYarns : undefined,
      needles: pageMode === 'direct' ? directNeedles : undefined,
      gauges: pageMode === 'direct' ? directGauges : undefined,
    })
    router.push('/projects')
  }

  /* ── 공통 헤더 ── */
  const header = (
    <div className="flex items-center gap-2 px-4 pt-14 pb-0">
      <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center active:opacity-60">
        <ChevronLeft size={22} className="text-[#646464]" />
      </button>
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder={pageMode === 'direct' ? '프로젝트 제목 *' : '프로젝트 제목'}
        className="flex-1 text-center text-[17px] font-medium text-[#212121] placeholder:text-[#C8C8C8] outline-none bg-transparent"
      />
      <button onClick={handleSave} disabled={!canSubmit}
        className="shrink-0 text-[15px] font-medium w-8 text-right transition-colors"
        style={{ color: canSubmit ? '#212121' : '#C8C8C8' }}>
        저장
      </button>
    </div>
  )

  /* ── 공통: 커버 사진 영역 ── */
  const coverBlock = (
    <div className="w-full bg-[#EBEBEB] cursor-pointer relative overflow-hidden flex-shrink-0"
      style={{ aspectRatio: '4/3' }}
      onClick={() => photoInputRef.current?.click()}>
      {coverPhoto
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={coverPhoto} alt="" className="w-full h-full object-cover" />
        : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="#B0B0B0" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3.5" stroke="#B0B0B0" strokeWidth="1.5" />
              <path d="M9 5l1.5-2h3L15 5" stroke="#B0B0B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[14px] text-[#B0B0B0] font-medium">사진 추가하기</span>
          </div>
      }
    </div>
  )

  /* ── 공통: 상태 + 날짜 배지 행 ── */
  const statusDateRow = (
    <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
      <div className="relative" ref={statusBtnRef}>
        <button onClick={() => setStatusDropOpen(v => !v)}><StatusBadge status={status} /></button>
        {statusDropOpen && (
          <div className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-[14px] z-30 py-1.5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 140 }}>
            {STATUS_OPTIONS.map(opt => (
              <button key={opt} onClick={() => { setStatus(opt); setStatusDropOpen(false) }}
                className="w-full flex items-center justify-between px-3 py-2 gap-2 active:bg-[#F5F5F5]"
                style={{ background: status === opt ? '#F9F9F9' : 'transparent' }}>
                <StatusBadge status={opt} />
                {status === opt && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </button>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => setDatePickerTarget('start')}
        className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[14px] font-semibold border border-[#e0e0e0] bg-white text-[#646464] active:opacity-70">
        <CalIcon />{startDate ? formatDate(startDate) : '시작일'}
      </button>
      {status === '완성' && (
        <button onClick={() => setDatePickerTarget('end')}
          className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[14px] font-semibold border border-[#e0e0e0] bg-white text-[#646464] active:opacity-70">
          <CalIcon />{endDate ? formatDate(endDate) : '완성일'}
        </button>
      )}
    </div>
  )

  /* ══════ 직접 입력 모드 렌더 ══════ */
  if (pageMode === 'direct') {
    return (
      <>
        <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">
          {header}
          <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

          <div className="flex-1 overflow-y-auto pb-10">
            {coverBlock}
            {statusDateRow}

            {/* 사이즈 자유 입력 행 */}
            <div className="flex items-center px-4 py-2 border-t border-b border-[#F5F5F5]">
              <span className="text-[15px] font-bold text-[#212121] w-16 flex-shrink-0">사이즈</span>
              <input
                value={directSize}
                onChange={e => setDirectSize(e.target.value)}
                placeholder="사이즈를 입력해주세요"
                className="flex-1 text-[14px] text-[#212121] placeholder:text-[#C8C8C8] outline-none bg-transparent py-2"
              />
            </div>

            {/* 도안 섹션 */}
            <div className="px-4 pt-5">
              <SectionHeader title="도안" onAdd={() => setPatternSelectOpen(true)} />
              {selectedPattern ? (
                <div className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: '#FFF8F7', border: '1px solid #FFE0D9' }}>
                  <div className="w-[60px] h-[60px] rounded-[10px] bg-[#F0EDEA] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#212121] line-clamp-1">{selectedPattern.name}</p>
                    <p className="text-[12px] text-[#9A9A9A] mt-0.5">{selectedPattern.author}</p>
                  </div>
                  <DotMenu items={[
                    { label: '도안 정보', onClick: () => setPatternDetailOpen(true) },
                    { label: '변경', onClick: () => setPatternSelectOpen(true) },
                    { label: '삭제', danger: true, onClick: () => setSelectedPattern(null) },
                  ]} />
                </div>
              ) : (
                <EmptyAddButton label="도안 추가하기" onClick={() => setPatternSelectOpen(true)} dashed />
              )}
            </div>

            {/* 실 섹션 */}
            <div className="px-4 pt-5">
              <SectionHeader title="실" onAdd={() => { setEditingYarn(undefined); setYarnOpen(true) }} />
              {directYarns.length === 0 ? (
                <EmptyAddButton label="실 추가하기" onClick={() => { setEditingYarn(undefined); setYarnOpen(true) }} dashed />
              ) : (
                <div className="flex flex-col gap-2">
                  {directYarns.map(yarn => (
                    <MaterialCard key={yarn.id} thumbnail={yarn.photo} title={yarn.name} sub1={yarn.brand} sub2={yarn.color}
                      menuItems={[
                        { label: '수정', onClick: () => { setEditingYarn(yarn); setYarnOpen(true) } },
                        { label: '삭제', danger: true, onClick: () => removeYarn(yarn.id) },
                      ]} />
                  ))}
                  <button onClick={() => { setEditingYarn(undefined); setYarnOpen(true) }} className="w-full h-11 rounded-[12px] text-[14px] font-semibold active:opacity-70" style={{ border: '1.5px dashed #D0D0D0', color: '#B0B0B0' }}>
                    + 실 추가
                  </button>
                </div>
              )}
            </div>

            {/* 바늘 섹션 */}
            <div className="px-4 pt-5">
              <SectionHeader title="바늘" onAdd={() => { setEditingNeedle(undefined); setNeedleOpen(true) }} />
              {directNeedles.length === 0 ? (
                <EmptyAddButton label="바늘 추가하기" onClick={() => { setEditingNeedle(undefined); setNeedleOpen(true) }} dashed />
              ) : (
                <div className="flex flex-col gap-2">
                  {directNeedles.map(needle => (
                    <MaterialCard key={needle.id} thumbnail={needle.photo} title={needle.name} sub1={needle.brand} sub2={needle.size}
                      menuItems={[
                        { label: '수정', onClick: () => { setEditingNeedle(needle); setNeedleOpen(true) } },
                        { label: '삭제', danger: true, onClick: () => removeNeedle(needle.id) },
                      ]} />
                  ))}
                  <button onClick={() => { setEditingNeedle(undefined); setNeedleOpen(true) }} className="w-full h-11 rounded-[12px] text-[14px] font-semibold active:opacity-70" style={{ border: '1.5px dashed #D0D0D0', color: '#B0B0B0' }}>
                    + 바늘 추가
                  </button>
                </div>
              )}
            </div>

            {/* 게이지 섹션 */}
            <div className="px-4 pt-5 pb-4">
              <SectionHeader title="게이지" onAdd={() => { setEditingGauge(undefined); setGaugeOpen(true) }} />
              {directGauges.length === 0 ? (
                <EmptyAddButton label="게이지 추가하기" onClick={() => { setEditingGauge(undefined); setGaugeOpen(true) }} dashed />
              ) : (
                <div className="flex flex-col gap-2">
                  {directGauges.map(gauge => (
                    <GaugeCard key={gauge.id} gauge={gauge}
                      menuItems={[
                        { label: '수정', onClick: () => { setEditingGauge(gauge); setGaugeOpen(true) } },
                        { label: '삭제', danger: true, onClick: () => removeGauge(gauge.id) },
                      ]} />
                  ))}
                  <button onClick={() => { setEditingGauge(undefined); setGaugeOpen(true) }} className="w-full h-11 rounded-[12px] text-[14px] font-semibold active:opacity-70" style={{ border: '1.5px dashed #D0D0D0', color: '#B0B0B0' }}>
                    + 게이지 추가
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {datePickerTarget && (
          <CalendarPicker value={datePickerTarget === 'start' ? startDate : endDate}
            onChange={d => { if (datePickerTarget === 'start') setStartDate(d); else setEndDate(d); setDatePickerTarget(null) }}
            onClose={() => setDatePickerTarget(null)} />
        )}
        <PatternSelectSheet isOpen={patternSelectOpen} onClose={() => setPatternSelectOpen(false)} onSelectPattern={handleSelectPattern} />
        <PatternDetailSheet isOpen={patternDetailOpen} onClose={() => setPatternDetailOpen(false)} pattern={selectedPattern} />
        <YarnSheet isOpen={yarnOpen} onClose={() => setYarnOpen(false)} initial={editingYarn} onSave={saveYarn} />
        <NeedleSheet isOpen={needleOpen} onClose={() => setNeedleOpen(false)} initial={editingNeedle} onSave={saveNeedle} />
        <GaugeSheet isOpen={gaugeOpen} onClose={() => setGaugeOpen(false)} initial={editingGauge} onSave={saveGauge} />
      </>
    )
  }

  /* ══════ 탭 모드 렌더 (기존) ══════ */
  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">
        {header}
        <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />

        {/* 탭 바 */}
        <div className="flex mt-4 border-b border-[#F0F0F0]">
          {(['정보', '도안', '기록'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="flex-1 py-3 text-[15px] font-medium relative transition-colors"
              style={{ color: activeTab === tab ? '#F72E00' : '#9A9A9A' }}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F72E00]" />}
            </button>
          ))}
        </div>

        {/* ══ 정보 탭 ══ */}
        {activeTab === '정보' && (
          <div className="flex-1 overflow-y-auto pb-10">
            {coverBlock}

            {statusDateRow}

            {/* 사이즈 드롭다운 (다중 사이즈 도안) */}
            {selectedPattern && hasMultipleSizes && (
              <div className="flex items-center px-4 py-2 border-t border-[#F5F5F5]">
                <span className="text-[15px] font-bold text-[#212121] w-16">사이즈</span>
                <div className="relative">
                  <button onClick={() => setInfoSizeDropOpen(v => !v)} className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[14px] font-semibold active:opacity-70" style={{ background: '#FFF0ED', border: '1px solid #FFD4CC' }}>
                    <span style={{ color: '#9A9A9A' }}>사이즈</span>
                    <span style={{ color: '#F72E00' }}>{selectedSize}</span>
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none"><path d="M1 1l3 3 3-3" stroke="#F72E00" strokeWidth="1.2" strokeLinecap="round" /></svg>
                  </button>
                  {infoSizeDropOpen && (
                    <>
                      <div className="fixed inset-0 z-[25]" onClick={() => setInfoSizeDropOpen(false)} />
                      <div className="absolute top-full left-0 mt-1 bg-white rounded-[10px] z-[26] py-1 min-w-[80px]" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                        {patternSizes.map(size => (
                          <button key={size} onClick={() => { setSelectedSize(size); setInfoSizeDropOpen(false) }}
                            className="w-full text-left px-3 py-2 text-[13px] font-medium"
                            style={{ color: selectedSize === size ? '#F72E00' : '#212121', background: selectedSize === size ? '#FFF8F7' : 'transparent' }}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {selectedPattern && <button onClick={() => setPatternDetailOpen(true)} className="ml-auto flex items-center gap-1 active:opacity-60">
                  <span className="text-[14px] text-[#646464]">도안 정보</span>
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none"><path d="M1 1l4 4-4 4" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>}
              </div>
            )}

            {/* 재료 섹션 (탭 모드에서는 플레이스홀더) */}
            <div className="px-4 flex flex-col gap-6 pt-4">
              {['실', '바늘', '게이지'].map((label, i) => (
                <div key={label}>
                  <h3 className="text-[17px] font-bold text-[#212121] mb-3">{label}</h3>
                  <button className="w-full rounded-[14px] py-[22px] text-center text-[14px] font-semibold active:opacity-70" style={{ background: '#F5F5F5', color: '#F72E00' }}>
                    + {i === 2 ? '게이지 추가하기' : `사용한 ${label} 추가하기`}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ 도안 탭 ══ */}
        {activeTab === '도안' && (
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {selectedPattern ? (
              <PatternInfoCard pattern={selectedPattern} selectedSize={selectedSize} onSizeChange={setSelectedSize}
                onDetailOpen={() => setPatternDetailOpen(true)} onChangePattern={() => setPatternSelectOpen(true)} />
            ) : (
              <div className="flex flex-col items-center gap-3 pt-16">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#F5F5F5" /><path d="M16 24h16M24 16v16" stroke="#C8C8C8" strokeWidth="2.5" strokeLinecap="round" /></svg>
                <p className="text-[15px] text-[#9A9A9A] font-medium">선택된 도안이 없어요</p>
                <button onClick={() => setPatternSelectOpen(true)} className="mt-1 px-6 py-3 rounded-[12px] text-[14px] font-semibold text-white active:opacity-80" style={{ background: '#F72E00' }}>
                  도안 선택하기
                </button>
                {/* 직접 입력 전환 */}
                <button onClick={() => setPageMode('direct')} className="mt-1 text-[14px] text-[#9A9A9A] active:opacity-60 py-2 px-4">
                  직접 입력하기
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══ 기록 탭 ══ */}
        {activeTab === '기록' && (
          <div className="flex-1 overflow-y-auto pb-10">
            {/* 커버 사진 */}
            <div className="w-full bg-[#EBEBEB] cursor-pointer relative overflow-hidden flex-shrink-0" style={{ aspectRatio: '4/3' }} onClick={() => photoInputRef.current?.click()}>
              {coverPhoto
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={coverPhoto} alt="" className="w-full h-full object-cover" />
                : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /></svg>
                    <span className="text-[13px] text-[#C8C8C8] font-medium">커버 사진 추가</span>
                  </div>
              }
            </div>

            {/* 타이머 */}
            <div className="px-4 pt-5 pb-5 border-b border-[#F5F5F5]">
              <p className="text-[13px] font-semibold text-[#9A9A9A] mb-3 tracking-wide">타이머</p>
              <div className="w-full rounded-[18px] py-6 flex items-center justify-center" style={{ background: '#F9F9F9' }}>
                <span className="text-[42px] font-bold tracking-widest" style={{ color: timerRunning ? '#F72E00' : '#212121', fontVariantNumeric: 'tabular-nums' }}>{formatTimer(timerSecs)}</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setTimerRunning(v => !v)} className="flex-1 py-3.5 rounded-[12px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 active:opacity-80" style={{ background: timerRunning ? '#FF6B3D' : '#F72E00' }}>
                  {timerRunning ? (<><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="0" y="0" width="5" height="16" rx="2" fill="white" /><rect x="9" y="0" width="5" height="16" rx="2" fill="white" /></svg>일시 정지</>) : (<><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M2 1l11 7-11 7V1z" fill="white" /></svg>{timerSecs > 0 ? '계속하기' : '시작'}</>)}
                </button>
                <button onClick={() => { setTimerRunning(false); setTimerSecs(0) }} className="w-14 py-3.5 rounded-[12px] flex items-center justify-center active:opacity-70" style={{ background: '#EDEDED' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4v5h.582m15.356 2A8 8 0 004.582 9m0 0H9M20 20v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15" stroke="#646464" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>

            {/* 단수 카운터 */}
            <div className="px-4 pt-5 pb-5 border-b border-[#F5F5F5]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-semibold text-[#9A9A9A] tracking-wide">단수 카운터</p>
                <button onClick={addCounter} className="flex items-center gap-1 active:opacity-60">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="#F72E00" strokeWidth="2" strokeLinecap="round" /></svg>
                  <span className="text-[13px] font-semibold text-[#F72E00]">추가</span>
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {counters.map(counter => (
                  <div key={counter.id} className="rounded-[16px] overflow-hidden" style={{ background: '#F9F9F9' }}>
                    <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
                      {editingCounterName === counter.id ? (
                        <input autoFocus value={counter.name} onChange={e => renameCounter(counter.id, e.target.value)}
                          onBlur={() => setEditingCounterName(null)} onKeyDown={e => e.key === 'Enter' && setEditingCounterName(null)}
                          className="text-[15px] font-bold text-[#212121] bg-transparent outline-none border-b border-[#F72E00] min-w-0 flex-1 mr-2" />
                      ) : (
                        <button onClick={() => setEditingCounterName(counter.id)} className="text-[15px] font-bold text-[#212121] active:opacity-60 text-left flex-1 min-w-0 mr-2 truncate">{counter.name}</button>
                      )}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => resetCounter(counter.id)} className="text-[12px] text-[#9A9A9A] active:opacity-60 flex items-center gap-0.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 4v5h.582m15.356 2A8 8 0 004.582 9m0 0H9M20 20v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          초기화
                        </button>
                        {counters.length > 1 && (
                          <button onClick={() => removeCounter(counter.id)} className="w-5 h-5 flex items-center justify-center active:opacity-60">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2L12 12M12 2L2 12" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 pb-4">
                      <button onClick={() => changeCounter(counter.id, -1)} disabled={counter.count === 0} className="w-14 h-14 rounded-[12px] flex items-center justify-center text-[28px] font-light active:opacity-60" style={{ background: 'white', color: counter.count === 0 ? '#D0D0D0' : '#212121', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>−</button>
                      <span className="text-[40px] font-bold tabular-nums" style={{ color: '#212121', minWidth: 80, textAlign: 'center' }}>{counter.count}</span>
                      <button onClick={() => changeCounter(counter.id, +1)} className="w-14 h-14 rounded-[12px] flex items-center justify-center text-[28px] font-light active:opacity-60" style={{ background: '#F72E00', color: 'white', boxShadow: '0 2px 8px rgba(247,46,0,0.3)' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 타임라인 */}
            <div className="px-4 pt-5">
              <p className="text-[13px] font-semibold text-[#9A9A9A] mb-4 tracking-wide">타임라인</p>
              <div className="mb-6">
                {newEntryPhoto && (
                  <div className="relative mb-2 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={newEntryPhoto} alt="" className="h-24 rounded-[10px] object-cover" style={{ maxWidth: '100%' }} />
                    <button onClick={() => setNewEntryPhoto(undefined)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#212121' }}>
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 1L8 8M8 1L1 8" stroke="white" strokeWidth="1.4" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button onClick={() => entryPhotoInputRef.current?.click()} className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0 self-end active:opacity-70" style={{ background: '#F0F0F0' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#9A9A9A" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#9A9A9A" strokeWidth="1.5" /><path d="M9 5l1.5-2h3L15 5" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </button>
                  <input ref={entryPhotoInputRef} type="file" accept="image/*" className="hidden" onChange={handleEntryPhotoChange} />
                  <textarea ref={entryInputRef} value={newEntryText}
                    onChange={e => { setNewEntryText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addEntry() } }}
                    placeholder="기록을 남겨보세요..." rows={1}
                    className="flex-1 resize-none rounded-[12px] px-3.5 py-3 text-[14px] text-[#212121] placeholder:text-[#C8C8C8] outline-none leading-relaxed"
                    style={{ background: '#F5F5F5', overflow: 'hidden', minHeight: 46 }} />
                  <button onClick={addEntry} disabled={!newEntryText.trim() && !newEntryPhoto}
                    className="w-11 h-11 rounded-[12px] flex items-center justify-center self-end flex-shrink-0 active:opacity-70 transition-colors"
                    style={{ background: (newEntryText.trim() || newEntryPhoto) ? '#F72E00' : '#EDEDED' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke={(newEntryText.trim() || newEntryPhoto) ? 'white' : '#C8C8C8'} strokeWidth="2" strokeLinecap="round" /></svg>
                  </button>
                </div>
              </div>
              {timelineEntries.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-10">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="17" stroke="#EBEBEB" strokeWidth="2" /><path d="M18 10v8l5 3" stroke="#C8C8C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <p className="text-[13px] text-[#C8C8C8]">아직 기록이 없어요</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-[6px] top-2 bottom-2 w-[2px] rounded-full" style={{ background: '#F0F0F0' }} />
                  {timelineEntries.map((entry, idx) => (
                    <div key={entry.id} className="relative pl-6 pb-5">
                      <div className="absolute left-0 top-[5px] w-[14px] h-[14px] rounded-full border-2 border-white" style={{ background: idx === timelineEntries.length - 1 ? '#F72E00' : '#D0D0D0', boxShadow: '0 0 0 2px #F0F0F0' }} />
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[#B0B0B0] mb-1 font-medium">{formatEntryDate(entry.createdAt)}</p>
                          {entry.text && <p className="text-[14px] text-[#212121] leading-relaxed whitespace-pre-wrap mb-2">{entry.text}</p>}
                          {entry.photo && <img src={entry.photo} alt="" className="rounded-[10px] object-cover max-w-full" style={{ maxHeight: 200, width: 'auto' }} />}
                        </div>
                        <button onClick={() => removeEntry(entry.id)} className="w-6 h-6 flex items-center justify-center active:opacity-60 flex-shrink-0 mt-0.5">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2L10 10M10 2L2 10" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                  <div ref={timelineEndRef} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {datePickerTarget && (
        <CalendarPicker value={datePickerTarget === 'start' ? startDate : endDate}
          onChange={d => { if (datePickerTarget === 'start') setStartDate(d); else setEndDate(d); setDatePickerTarget(null) }}
          onClose={() => setDatePickerTarget(null)} />
      )}
      <PatternSelectSheet isOpen={patternSelectOpen} onClose={() => setPatternSelectOpen(false)} onSelectPattern={handleSelectPattern} />
      <PatternDetailSheet isOpen={patternDetailOpen} onClose={() => setPatternDetailOpen(false)} pattern={selectedPattern} />
    </>
  )
}
