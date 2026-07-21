'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useProjectStore, YarnItem, NeedleItem, GaugeItem } from '@/store/projectStore'
import { MOCK_PATTERNS } from '@/lib/mockPatterns'
import { PatternInfoCard, PatternDetailSheet, parseSizes } from '@/components/pattern/PatternDetailSheet'
import { Pattern } from '@/lib/mockPatterns'

type Tab = '정보' | '도안' | '기록'
const STATUS_OPTIONS = ['준비 중', '뜨는 중', '쉬는 중', '완성']
const CATEGORIES = ['전체', '스웨터', '베스트', '모자', '가디건', '소품', '숄/스카프', '양말/장갑']
const BRANDS_LIST = ['전체', ...Array.from(new Set(MOCK_PATTERNS.map(p => p.brand)))]

function uid() { return Math.random().toString(36).slice(2) }
function fmtDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${y}. ${m}. ${d}`
}

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
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#13C100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
          <span className="text-[16px] font-bold">{viewYear}년 {viewMonth + 1}월</span>
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
                  <button onClick={() => { onChange(toISO(day)); onClose() }} className="w-9 h-9 flex items-center justify-center rounded-full text-[14px]"
                    style={{ background: sel ? '#F72E00' : 'transparent', color: sel ? '#fff' : isT ? '#F72E00' : col === 0 ? '#F72E00' : col === 6 ? '#3B86FB' : '#212121', fontWeight: sel || isT ? 700 : 400 }}>
                    {day}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

/* ── 도안 선택 시트 ── */
function PatternSelectSheet({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (p: Pattern) => void }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState('전체')
  const [brand, setBrand] = useState('전체')
  useEffect(() => { if (!isOpen) { setSearch(''); setCat('전체'); setBrand('전체') } }, [isOpen])
  const filtered = MOCK_PATTERNS.filter(p => {
    const q = search.trim().toLowerCase()
    return (!q || p.name.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)) && (cat === '전체' || p.category === cat) && (brand === '전체' || p.brand === brand)
  })
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[64]" onClick={onClose} />}
      <div className="fixed bottom-0 w-full max-w-[393px] bg-white rounded-t-[24px] z-[65] flex flex-col"
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.42s cubic-bezier(0.32,0.72,0,1)', height: '80vh', pointerEvents: isOpen ? 'auto' : 'none' }}>
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-3 flex-shrink-0"><h2 className="text-[22px] font-bold">도안 선택하기</h2></div>
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 bg-[#F0F0F0] rounded-[12px] h-[44px] px-3.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="#9A9A9A" strokeWidth="1.5" /><path d="M11 11L14 14" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="작가 / 도안 이름을 입력해주세요" className="flex-1 bg-transparent text-[14px] placeholder:text-[#A2A2A2] outline-none" />
          </div>
        </div>
        <div className="px-4 pb-3 flex gap-2 flex-shrink-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(c => <button key={c} onClick={() => setCat(c)} className="flex-shrink-0 h-8 px-3 rounded-full text-[13px] font-semibold" style={{ background: cat === c ? '#F72E00' : '#F0F0F0', color: cat === c ? '#fff' : '#212121' }}>{c}</button>)}
        </div>
        <div className="flex-1 overflow-y-auto pb-8">
          {filtered.map(pattern => (
            <button key={pattern.id} onClick={() => onSelect(pattern)} className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-[#F9F9F9] text-left border-b border-[#F5F5F5]">
              <div className="w-[72px] h-[72px] rounded-[12px] bg-[#E8E8E8] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-[#212121]">{pattern.name}</p>
                <p className="text-[13px] text-[#9A9A9A] mt-0.5">{pattern.author}</p>
              </div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="flex-shrink-0"><path d="M1 1l5 5-5 5" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

/* ── 실 추가/수정 시트 ── */
function YarnSheet({ isOpen, onClose, initial, onSave }: { isOpen: boolean; onClose: () => void; initial?: YarnItem; onSave: (item: YarnItem) => void }) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [weight, setWeight] = useState('')
  const [photo, setPhoto] = useState<string | undefined>()
  const photoRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) { setName(initial?.name ?? ''); setBrand(initial?.brand ?? ''); setColor(initial?.color ?? ''); setWeight(initial?.weight ?? ''); setPhoto(initial?.photo) }
  }, [isOpen, initial])
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => setPhoto(ev.target?.result as string); r.readAsDataURL(f); e.target.value = ''
  }
  const canSave = name.trim().length > 0
  const handleSave = () => {
    if (!canSave) return
    onSave({ id: initial?.id ?? uid(), name: name.trim(), brand: brand.trim(), color: color.trim(), weight: weight.trim() || undefined, photo })
    onClose()
  }
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[74]" onClick={onClose} />}
      <div className="fixed bottom-0 w-full max-w-[393px] bg-white rounded-t-[24px] z-[75] flex flex-col"
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)', pointerEvents: isOpen ? 'auto' : 'none' }}>
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[20px] font-bold">{initial ? '실 수정' : '실 추가'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="px-5 flex flex-col gap-4 pb-8 overflow-y-auto">
          {/* 사진 */}
          <button onClick={() => photoRef.current?.click()} className="w-full rounded-[14px] overflow-hidden relative flex-shrink-0" style={{ aspectRatio: '3/2', background: '#F5F5F5' }}>
            {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /></svg>
                <span className="text-[13px] text-[#C8C8C8]">사진 추가</span>
              </div>
            )}
          </button>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          {[
            { label: '실 이름 *', value: name, set: setName, placeholder: '예) 모후 (Mohoo)' },
            { label: '브랜드', value: brand, set: setBrand, placeholder: '예) 노츠앤노츠' },
            { label: '색상', value: color, set: setColor, placeholder: '예) 메론빵' },
            { label: '무게/합수', value: weight, set: setWeight, placeholder: '예) 2합, 100g' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <p className="text-[13px] font-semibold text-[#646464] mb-1.5">{label}</p>
              <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full h-12 rounded-[12px] px-4 text-[15px] text-[#212121] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
            </div>
          ))}
          <button onClick={handleSave} disabled={!canSave} className="w-full h-[52px] rounded-[12px] text-[15px] font-semibold text-white mt-1 active:opacity-80" style={{ background: canSave ? '#F72E00' : '#E0E0E0' }}>
            저장
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 바늘 추가/수정 시트 ── */
function NeedleSheet({ isOpen, onClose, initial, onSave }: { isOpen: boolean; onClose: () => void; initial?: NeedleItem; onSave: (item: NeedleItem) => void }) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [size, setSize] = useState('')
  const [photo, setPhoto] = useState<string | undefined>()
  const photoRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) { setName(initial?.name ?? ''); setBrand(initial?.brand ?? ''); setSize(initial?.size ?? ''); setPhoto(initial?.photo) }
  }, [isOpen, initial])
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    const r = new FileReader(); r.onload = ev => setPhoto(ev.target?.result as string); r.readAsDataURL(f); e.target.value = ''
  }
  const canSave = name.trim().length > 0
  const handleSave = () => {
    if (!canSave) return
    onSave({ id: initial?.id ?? uid(), name: name.trim(), brand: brand.trim(), size: size.trim(), photo })
    onClose()
  }
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[74]" onClick={onClose} />}
      <div className="fixed bottom-0 w-full max-w-[393px] bg-white rounded-t-[24px] z-[75] flex flex-col"
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)', pointerEvents: isOpen ? 'auto' : 'none' }}>
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[20px] font-bold">{initial ? '바늘 수정' : '바늘 추가'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="px-5 flex flex-col gap-4 pb-8 overflow-y-auto">
          <button onClick={() => photoRef.current?.click()} className="w-full rounded-[14px] overflow-hidden relative flex-shrink-0" style={{ aspectRatio: '3/2', background: '#F5F5F5' }}>
            {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /></svg>
                <span className="text-[13px] text-[#C8C8C8]">사진 추가</span>
              </div>
            )}
          </button>
          <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          {[
            { label: '바늘 이름 *', value: name, set: setName, placeholder: '예) 마인드폴 조립식 숏팁 세트' },
            { label: '브랜드', value: brand, set: setBrand, placeholder: '예) KnitPro' },
            { label: '사이즈', value: size, set: setSize, placeholder: '예) 6mm, 4.5mm' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <p className="text-[13px] font-semibold text-[#646464] mb-1.5">{label}</p>
              <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full h-12 rounded-[12px] px-4 text-[15px] text-[#212121] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
            </div>
          ))}
          <button onClick={handleSave} disabled={!canSave} className="w-full h-[52px] rounded-[12px] text-[15px] font-semibold text-white mt-1 active:opacity-80" style={{ background: canSave ? '#F72E00' : '#E0E0E0' }}>
            저장
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 게이지 추가/수정 시트 ── */
function GaugeSheet({ isOpen, onClose, initial, onSave }: { isOpen: boolean; onClose: () => void; initial?: GaugeItem; onSave: (item: GaugeItem) => void }) {
  const [stitches, setStitches] = useState('')
  const [rows, setRows] = useState('')
  const [swatchWidth, setSwatchWidth] = useState('')
  const [swatchHeight, setSwatchHeight] = useState('')
  const [stitchType, setStitchType] = useState('')
  const [washing, setWashing] = useState('')
  useEffect(() => {
    if (isOpen) { setStitches(initial?.stitches ?? ''); setRows(initial?.rows ?? ''); setSwatchWidth(initial?.swatchWidth ?? ''); setSwatchHeight(initial?.swatchHeight ?? ''); setStitchType(initial?.stitchType ?? ''); setWashing(initial?.washing ?? '') }
  }, [isOpen, initial])
  const canSave = stitches.trim().length > 0 || rows.trim().length > 0
  const handleSave = () => {
    if (!canSave) return
    onSave({ id: initial?.id ?? uid(), stitches: stitches.trim(), rows: rows.trim(), swatchWidth: swatchWidth.trim(), swatchHeight: swatchHeight.trim(), stitchType: stitchType.trim(), washing: washing.trim() })
    onClose()
  }
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[74]" onClick={onClose} />}
      <div className="fixed bottom-0 w-full max-w-[393px] bg-white rounded-t-[24px] z-[75] flex flex-col"
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)', pointerEvents: isOpen ? 'auto' : 'none' }}>
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[20px] font-bold">{initial ? '게이지 수정' : '게이지 추가'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="px-5 flex flex-col gap-4 pb-8 overflow-y-auto">
          <div className="flex gap-3">
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#646464] mb-1.5">코수</p>
              <input value={stitches} onChange={e => setStitches(e.target.value)} placeholder="예) 22코"
                className="w-full h-12 rounded-[12px] px-4 text-[15px] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-[#646464] mb-1.5">단수</p>
              <input value={rows} onChange={e => setRows(e.target.value)} placeholder="예) 30단"
                className="w-full h-12 rounded-[12px] px-4 text-[15px] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#646464] mb-1.5">스와치 크기</p>
            <div className="flex gap-3">
              <input value={swatchWidth} onChange={e => setSwatchWidth(e.target.value)} placeholder="가로 (예: 10cm)" className="flex-1 h-12 rounded-[12px] px-4 text-[15px] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
              <input value={swatchHeight} onChange={e => setSwatchHeight(e.target.value)} placeholder="세로 (예: 10cm)" className="flex-1 h-12 rounded-[12px] px-4 text-[15px] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
            </div>
          </div>
          {[
            { label: '뜨기 방식', value: stitchType, set: setStitchType, placeholder: '예) 메리아스' },
            { label: '세탁 방법', value: washing, set: setWashing, placeholder: '예) 세탁 유무, 손세탁' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <p className="text-[13px] font-semibold text-[#646464] mb-1.5">{label}</p>
              <input value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                className="w-full h-12 rounded-[12px] px-4 text-[15px] placeholder:text-[#C8C8C8] outline-none bg-[#F5F5F5]" />
            </div>
          ))}
          <button onClick={handleSave} disabled={!canSave} className="w-full h-[52px] rounded-[12px] text-[15px] font-semibold text-white mt-1 active:opacity-80" style={{ background: canSave ? '#F72E00' : '#E0E0E0' }}>
            저장
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 점 3개 메뉴 ── */
function DotMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="w-8 h-8 flex items-center justify-center active:opacity-60">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="5" cy="10" r="1.5" fill="#B0B0B0" /><circle cx="10" cy="10" r="1.5" fill="#B0B0B0" /><circle cx="15" cy="10" r="1.5" fill="#B0B0B0" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[30]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 bg-white rounded-[12px] z-[31] py-1 min-w-[120px]" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.14)' }}>
            {items.map((item, i) => (
              <button key={i} onClick={() => { item.onClick(); setOpen(false) }} className="w-full text-left px-4 py-2.5 text-[14px] font-medium active:bg-[#F5F5F5]" style={{ color: item.danger ? '#F72E00' : '#212121' }}>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════ */
export default function ProjectDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id
  const router = useRouter()

  const project = useProjectStore(s => s.projects.find(p => p.id === id))
  const updateProject = useProjectStore(s => s.updateProject)
  const deleteProject = useProjectStore(s => s.deleteProject)

  const [activeTab, setActiveTab] = useState<Tab>('정보')
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  /* ── 커버 사진 ── */
  const photoInputRef = useRef<HTMLInputElement>(null)
  const handleCoverPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f || !id) return
    const r = new FileReader(); r.onload = ev => { if (ev.target?.result) updateProject(id, { coverPhoto: ev.target.result as string }) }; r.readAsDataURL(f); e.target.value = ''
  }

  /* ── 상태 편집 ── */
  const [statusDropOpen, setStatusDropOpen] = useState(false)
  const statusRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!statusDropOpen) return
    const h = (e: MouseEvent) => { if (!statusRef.current?.contains(e.target as Node)) setStatusDropOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [statusDropOpen])

  /* ── 날짜 편집 ── */
  const [datePicker, setDatePicker] = useState<'start' | 'end' | null>(null)

  /* ── 사이즈 편집 ── */
  const [sizeDropOpen, setSizeDropOpen] = useState(false)
  const sizeRef = useRef<HTMLDivElement>(null)
  const [directSizeEditing, setDirectSizeEditing] = useState(false)
  const [directSizeDraft, setDirectSizeDraft] = useState('')
  useEffect(() => {
    if (!sizeDropOpen) return
    const h = (e: MouseEvent) => { if (!sizeRef.current?.contains(e.target as Node)) setSizeDropOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [sizeDropOpen])

  /* ── 도안 ── */
  const [patternSelectOpen, setPatternSelectOpen] = useState(false)
  const [patternDetailOpen, setPatternDetailOpen] = useState(false)
  const selectedPattern = project?.patternId ? MOCK_PATTERNS.find(p => p.id === project.patternId) ?? null : null
  const patternSizes = selectedPattern ? parseSizes(selectedPattern.size) : []

  /* ── 실/바늘/게이지 시트 ── */
  const [yarnOpen, setYarnOpen] = useState(false)
  const [editingYarn, setEditingYarn] = useState<YarnItem | undefined>()
  const [needleOpen, setNeedleOpen] = useState(false)
  const [editingNeedle, setEditingNeedle] = useState<NeedleItem | undefined>()
  const [gaugeOpen, setGaugeOpen] = useState(false)
  const [editingGauge, setEditingGauge] = useState<GaugeItem | undefined>()

  /* ── 타이머 (기록 탭) ── */
  const [timerRunning, setTimerRunning] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerSecsRef = useRef(project?.timerSecs ?? 0)
  useEffect(() => { if (project && !timerRunning) timerSecsRef.current = project.timerSecs ?? 0 }, [project?.timerSecs, timerRunning]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (timerRunning) { timerRef.current = setInterval(() => { timerSecsRef.current += 1; if (id) updateProject(id, { timerSecs: timerSecsRef.current }) }, 1000) }
    else { if (timerRef.current) clearInterval(timerRef.current) }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning]) // eslint-disable-line react-hooks/exhaustive-deps

  const formatTimer = (s: number) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  useEffect(() => {
    if (!menuOpen) return
    const h = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [menuOpen])

  if (!project) return (
    <div className="min-h-screen flex items-center justify-center bg-white max-w-[393px] mx-auto">
      <p className="text-[14px] text-[#9A9A9A]">프로젝트를 찾을 수 없어요</p>
    </div>
  )

  const yarns = project.yarns ?? []
  const needles = project.needles ?? []
  const gauges = project.gauges ?? []
  const dateLabel = (() => {
    const s = fmtDate(project.startDate), e = fmtDate(project.endDate)
    if (s && e) return `${s} ~ ${e}`; return s || null
  })()

  const saveYarn = (item: YarnItem) => {
    if (!id) return
    const prev = yarns; const exists = prev.find(y => y.id === item.id)
    updateProject(id, { yarns: exists ? prev.map(y => y.id === item.id ? item : y) : [...prev, item] })
  }
  const removeYarn = (yid: string) => { if (id) updateProject(id, { yarns: yarns.filter(y => y.id !== yid) }) }

  const saveNeedle = (item: NeedleItem) => {
    if (!id) return
    const prev = needles; const exists = prev.find(n => n.id === item.id)
    updateProject(id, { needles: exists ? prev.map(n => n.id === item.id ? item : n) : [...prev, item] })
  }
  const removeNeedle = (nid: string) => { if (id) updateProject(id, { needles: needles.filter(n => n.id !== nid) }) }

  const saveGauge = (item: GaugeItem) => {
    if (!id) return
    const prev = gauges; const exists = prev.find(g => g.id === item.id)
    updateProject(id, { gauges: exists ? prev.map(g => g.id === item.id ? item : g) : [...prev, item] })
  }
  const removeGauge = (gid: string) => { if (id) updateProject(id, { gauges: gauges.filter(g => g.id !== gid) }) }

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">

        {/* 헤더 */}
        <div className="flex items-center gap-2 px-4 pt-14 pb-0">
          <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center active:opacity-60">
            <ChevronLeft size={22} className="text-[#646464]" />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-semibold text-[#212121] truncate px-2">{project.title}</h1>
          <div className="relative w-8 shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen(v => !v)} className="w-8 h-8 flex items-center justify-end active:opacity-60">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="4" cy="10" r="1.5" fill="#646464" /><circle cx="10" cy="10" r="1.5" fill="#646464" /><circle cx="16" cy="10" r="1.5" fill="#646464" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute top-9 right-0 bg-white rounded-[14px] z-50 overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 140 }}>
                  <button onClick={() => { setMenuOpen(false); setDeleteOpen(true) }} className="w-full px-4 py-3.5 text-left text-[14px] text-[#F72E00] active:bg-[#FFF5F4]">기록 삭제</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 탭 */}
        <div className="flex mt-4 border-b border-[#F0F0F0]">
          {(['정보', '도안', '기록'] as Tab[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="flex-1 py-3 text-[15px] font-medium relative transition-colors" style={{ color: activeTab === tab ? '#F72E00' : '#9A9A9A' }}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#F72E00]" />}
            </button>
          ))}
        </div>

        {/* ══ 정보 탭 ══ */}
        {activeTab === '정보' && (
          <div className="flex-1 overflow-y-auto pb-28">

            {/* 커버 사진 */}
            <div className="relative w-full bg-[#EBEBEB]" style={{ aspectRatio: '4/3' }}>
              {project.coverPhoto
                ? <img src={project.coverPhoto} alt="" className="w-full h-full object-cover" />
                : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /><path d="M9 5l1.5-2h3L15 5" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <span className="text-[13px] text-[#C8C8C8]">커버 사진을 추가해보세요</span>
                  </div>
              }
              {/* 사진 편집 버튼 */}
              <button onClick={() => photoInputRef.current?.click()} className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center active:opacity-70" style={{ background: 'rgba(0,0,0,0.45)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverPhoto} />
            </div>

            {/* 상태 + 날짜 */}
            <div className="flex items-center gap-2 px-4 py-3 flex-wrap">
              {/* 상태 배지 */}
              <div className="relative" ref={statusRef}>
                <button onClick={() => setStatusDropOpen(v => !v)}><StatusBadge status={project.status} /></button>
                {statusDropOpen && (
                  <div className="absolute top-[calc(100%+6px)] left-0 bg-white rounded-[14px] z-30 py-1.5" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 140 }}>
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => { updateProject(id!, { status: opt }); setStatusDropOpen(false) }}
                        className="w-full flex items-center justify-between px-3 py-2 gap-2 active:bg-[#F5F5F5]" style={{ background: project.status === opt ? '#F9F9F9' : 'transparent' }}>
                        <StatusBadge status={opt} />
                        {project.status === opt && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* 날짜 배지 */}
              {dateLabel && (
                <button onClick={() => setDatePicker('start')} className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] active:opacity-70" style={{ background: '#FFEEEA' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" fill="#FFBAA9" /><path d="M3 9h18" stroke="#F72E00" strokeWidth="1.2" /><path d="M8 2v2M16 2v2" stroke="#F72E00" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <span className="text-[12px] font-medium" style={{ color: '#212121', letterSpacing: '0.3px' }}>{dateLabel}</span>
                </button>
              )}
              {!dateLabel && (
                <button onClick={() => setDatePicker('start')} className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] border border-[#E0E0E0] text-[13px] text-[#9A9A9A] active:opacity-70">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#9A9A9A" strokeWidth="1.5" /><path d="M3 9h18" stroke="#9A9A9A" strokeWidth="1.5" /><path d="M8 2v2M16 2v2" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  날짜 추가
                </button>
              )}
            </div>

            {/* 사이즈 행: 도안 다중 사이즈 or 직접 입력 */}
            {(selectedPattern && patternSizes.length > 1) ? (
              <div className="flex items-center px-4 py-2 border-t border-[#F5F5F5]">
                <span className="text-[15px] font-semibold text-[#212121] w-16">사이즈</span>
                <div className="relative flex-1" ref={sizeRef}>
                  <button onClick={() => setSizeDropOpen(v => !v)} className="flex items-center gap-1 active:opacity-70">
                    <span className="text-[15px] text-[#212121]">{project.patternSelectedSize || patternSizes[0]}</span>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="#9A9A9A" strokeWidth="1.3" strokeLinecap="round" /></svg>
                  </button>
                  {sizeDropOpen && (
                    <>
                      <div className="fixed inset-0 z-[25]" onClick={() => setSizeDropOpen(false)} />
                      <div className="absolute top-7 left-0 bg-white rounded-[10px] z-[26] py-1 min-w-[100px]" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                        {patternSizes.map(size => (
                          <button key={size} onClick={() => { updateProject(id!, { patternSelectedSize: size }); setSizeDropOpen(false) }}
                            className="w-full text-left px-3 py-2.5 text-[14px] font-medium" style={{ color: (project.patternSelectedSize || patternSizes[0]) === size ? '#F72E00' : '#212121' }}>
                            {size}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <span className="text-[13px] text-[#C8C8C8]">탭해서 변경</span>
              </div>
            ) : !selectedPattern && (
              /* 직접 입력 모드: 사이즈 자유 입력 행 */
              <div className="flex items-center px-4 py-2 border-t border-[#F5F5F5]">
                <span className="text-[15px] font-semibold text-[#212121] w-16 flex-shrink-0">사이즈</span>
                {directSizeEditing ? (
                  <input autoFocus
                    value={directSizeDraft}
                    onChange={e => setDirectSizeDraft(e.target.value)}
                    onBlur={() => { setDirectSizeEditing(false); if (id) updateProject(id, { patternSelectedSize: directSizeDraft.trim() || undefined }) }}
                    onKeyDown={e => { if (e.key === 'Enter') { setDirectSizeEditing(false); if (id) updateProject(id, { patternSelectedSize: directSizeDraft.trim() || undefined }) } }}
                    placeholder="예) M, 90cm, Free size"
                    className="flex-1 text-[14px] text-[#212121] placeholder:text-[#C8C8C8] outline-none bg-transparent py-2"
                  />
                ) : project.patternSelectedSize ? (
                  <button onClick={() => { setDirectSizeDraft(project.patternSelectedSize ?? ''); setDirectSizeEditing(true) }}
                    className="flex items-center gap-1.5 active:opacity-70">
                    <span className="text-[15px] text-[#212121]">{project.patternSelectedSize}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#C8C8C8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                ) : (
                  <button onClick={() => { setDirectSizeDraft(''); setDirectSizeEditing(true) }}
                    className="flex items-center gap-1 text-[14px] active:opacity-70" style={{ color: '#C8C8C8' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="#C8C8C8" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    사이즈 추가
                  </button>
                )}
              </div>
            )}

            {/* 도안 섹션 */}
            <div className="px-4 pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[17px] font-bold text-[#212121]">도안</span>
                <button onClick={() => setPatternSelectOpen(true)} className="w-8 h-8 flex items-center justify-center active:opacity-60">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#F72E00" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              {selectedPattern ? (
                <div className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: '#FFF8F7', border: '1px solid #FFE0D9' }}>
                  <div className="w-[60px] h-[60px] rounded-[10px] bg-[#F0EDEA] flex-shrink-0 overflow-hidden">
                    {/* pattern thumbnail placeholder */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-[#212121] leading-snug line-clamp-1">{selectedPattern.name}</p>
                    <p className="text-[12px] text-[#9A9A9A] mt-0.5">{selectedPattern.author}</p>
                  </div>
                  <DotMenu items={[
                    { label: '도안 정보', onClick: () => setPatternDetailOpen(true) },
                    { label: '도안 변경', onClick: () => setPatternSelectOpen(true) },
                    { label: '삭제', danger: true, onClick: () => { if (id) updateProject(id, { patternId: undefined, patternName: undefined, patternAuthor: undefined, patternSelectedSize: undefined }) } },
                  ]} />
                </div>
              ) : (
                <button onClick={() => setPatternSelectOpen(true)} className="w-full rounded-[14px] py-5 text-center text-[14px] font-semibold active:opacity-70" style={{ background: '#F5F5F5', color: '#F72E00' }}>
                  + 도안 선택하기
                </button>
              )}
            </div>

            {/* 실 섹션 */}
            <div className="px-4 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[17px] font-bold text-[#212121]">실</span>
                <button onClick={() => { setEditingYarn(undefined); setYarnOpen(true) }} className="w-8 h-8 flex items-center justify-center active:opacity-60">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#F72E00" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              {yarns.length === 0 ? (
                <button onClick={() => { setEditingYarn(undefined); setYarnOpen(true) }} className="w-full rounded-[14px] py-5 text-center text-[14px] font-semibold active:opacity-70" style={{ background: '#F5F5F5', color: '#F72E00' }}>
                  + 사용한 실 추가하기
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {yarns.map(yarn => (
                    <div key={yarn.id} className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
                      <div className="w-[60px] h-[60px] rounded-[10px] bg-[#EBEBEB] flex-shrink-0 overflow-hidden">
                        {yarn.photo && <img src={yarn.photo} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-[#212121] leading-snug line-clamp-1">{yarn.name}</p>
                        {yarn.brand && <p className="text-[12px] text-[#9A9A9A] mt-0.5 truncate">{yarn.brand}</p>}
                        {yarn.color && <p className="text-[12px] text-[#B0B0B0] truncate">{yarn.color}</p>}
                      </div>
                      <DotMenu items={[
                        { label: '수정', onClick: () => { setEditingYarn(yarn); setYarnOpen(true) } },
                        { label: '삭제', danger: true, onClick: () => removeYarn(yarn.id) },
                      ]} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 바늘 섹션 */}
            <div className="px-4 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[17px] font-bold text-[#212121]">바늘</span>
                <button onClick={() => { setEditingNeedle(undefined); setNeedleOpen(true) }} className="w-8 h-8 flex items-center justify-center active:opacity-60">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#F72E00" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              {needles.length === 0 ? (
                <button onClick={() => { setEditingNeedle(undefined); setNeedleOpen(true) }} className="w-full rounded-[14px] py-5 text-center text-[14px] font-semibold active:opacity-70" style={{ background: '#F5F5F5', color: '#F72E00' }}>
                  + 사용한 바늘 추가하기
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {needles.map(needle => (
                    <div key={needle.id} className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
                      <div className="w-[60px] h-[60px] rounded-[10px] bg-[#EBEBEB] flex-shrink-0 overflow-hidden">
                        {needle.photo && <img src={needle.photo} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-[#212121] leading-snug line-clamp-1">{needle.name}</p>
                        {needle.brand && <p className="text-[12px] text-[#9A9A9A] mt-0.5 truncate">{needle.brand}</p>}
                        {needle.size && <p className="text-[12px] text-[#B0B0B0] truncate">{needle.size}</p>}
                      </div>
                      <DotMenu items={[
                        { label: '수정', onClick: () => { setEditingNeedle(needle); setNeedleOpen(true) } },
                        { label: '삭제', danger: true, onClick: () => removeNeedle(needle.id) },
                      ]} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 게이지 섹션 */}
            <div className="px-4 pt-5 pb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[17px] font-bold text-[#212121]">게이지</span>
                <button onClick={() => { setEditingGauge(undefined); setGaugeOpen(true) }} className="w-8 h-8 flex items-center justify-center active:opacity-60">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#F72E00" strokeWidth="2" strokeLinecap="round" /></svg>
                </button>
              </div>
              {gauges.length === 0 ? (
                <button onClick={() => { setEditingGauge(undefined); setGaugeOpen(true) }} className="w-full rounded-[14px] py-5 text-center text-[14px] font-semibold active:opacity-70" style={{ background: '#F5F5F5', color: '#F72E00' }}>
                  + 게이지 추가하기
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  {gauges.map(gauge => (
                    <div key={gauge.id} className="p-3 rounded-[14px]" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {(gauge.stitches || gauge.rows) && (
                            <p className="text-[14px] font-bold text-[#212121]">
                              {[gauge.stitches, gauge.rows].filter(Boolean).join(' × ')}
                            </p>
                          )}
                          {(gauge.swatchWidth || gauge.swatchHeight || gauge.stitchType) && (
                            <p className="text-[12px] text-[#9A9A9A] mt-0.5">
                              {[gauge.swatchWidth && gauge.swatchHeight ? `${gauge.swatchWidth} x ${gauge.swatchHeight}` : gauge.swatchWidth || gauge.swatchHeight, gauge.stitchType].filter(Boolean).join(' · ')}
                            </p>
                          )}
                          {gauge.washing && <p className="text-[12px] text-[#B0B0B0] mt-0.5">{gauge.washing}</p>}
                        </div>
                        <DotMenu items={[
                          { label: '수정', onClick: () => { setEditingGauge(gauge); setGaugeOpen(true) } },
                          { label: '삭제', danger: true, onClick: () => removeGauge(gauge.id) },
                        ]} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ══ 도안 탭 ══ */}
        {activeTab === '도안' && (
          <div className="flex-1 overflow-y-auto px-4 py-5 pb-28">
            {selectedPattern ? (
              <PatternInfoCard
                pattern={selectedPattern}
                selectedSize={project.patternSelectedSize || ''}
                onSizeChange={size => { if (id) updateProject(id, { patternSelectedSize: size }) }}
                onDetailOpen={() => setPatternDetailOpen(true)}
                onChangePattern={() => setPatternSelectOpen(true)}
              />
            ) : (
              <div className="flex flex-col items-center gap-3 pt-20">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="14" fill="#F5F5F5" /><path d="M16 24h16M24 16v16" stroke="#C8C8C8" strokeWidth="2.5" strokeLinecap="round" /></svg>
                <p className="text-[15px] text-[#9A9A9A]">선택된 도안이 없어요</p>
                <button onClick={() => setPatternSelectOpen(true)} className="mt-1 px-6 py-3 rounded-[12px] text-[14px] font-semibold text-white active:opacity-80" style={{ background: '#F72E00' }}>도안 선택하기</button>
              </div>
            )}
          </div>
        )}

        {/* ══ 기록 탭 ══ */}
        {activeTab === '기록' && (
          <div className="flex-1 overflow-y-auto pb-28">
            {/* 커버 사진 */}
            <div className="relative w-full bg-[#EBEBEB]" style={{ aspectRatio: '4/3' }}>
              {project.coverPhoto ? <img src={project.coverPhoto} alt="" className="w-full h-full object-cover" /> : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /></svg>
                  <span className="text-[13px] text-[#C8C8C8]">커버 사진을 추가해보세요</span>
                </div>
              )}
              <button onClick={() => photoInputRef.current?.click()} className="absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center active:opacity-70" style={{ background: 'rgba(0,0,0,0.45)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            {/* 타이머 */}
            <div className="px-4 pt-5 pb-5 border-b border-[#F5F5F5]">
              <p className="text-[13px] font-semibold text-[#9A9A9A] mb-3 tracking-wide">타이머</p>
              <div className="w-full rounded-[18px] py-6 flex items-center justify-center mb-4" style={{ background: '#F9F9F9' }}>
                <span className="text-[42px] font-bold tracking-widest" style={{ color: timerRunning ? '#F72E00' : '#212121', fontVariantNumeric: 'tabular-nums' }}>
                  {formatTimer(project.timerSecs ?? 0)}
                </span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setTimerRunning(v => !v)} className="flex-1 py-3.5 rounded-[12px] text-[15px] font-semibold text-white flex items-center justify-center gap-2 active:opacity-80" style={{ background: timerRunning ? '#FF6B3D' : '#F72E00' }}>
                  {timerRunning ? (<><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="0" y="0" width="5" height="16" rx="2" fill="white" /><rect x="9" y="0" width="5" height="16" rx="2" fill="white" /></svg>일시 정지</>) : (<><svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M2 1l11 7-11 7V1z" fill="white" /></svg>{(project.timerSecs ?? 0) > 0 ? '계속하기' : '시작'}</>)}
                </button>
                <button onClick={() => { setTimerRunning(false); timerSecsRef.current = 0; if (id) updateProject(id, { timerSecs: 0 }) }} className="w-14 rounded-[12px] flex items-center justify-center active:opacity-70" style={{ background: '#EDEDED' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4v5h.582m15.356 2A8 8 0 004.582 9m0 0H9M20 20v-5h-.581m0 0a8 8 0 01-15.357-2m15.357 2H15" stroke="#646464" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>

            {/* 메모/타임라인 */}
            {project.content ? (
              <div className="px-4 pt-5">
                <p className="text-[13px] font-semibold text-[#9A9A9A] mb-4 tracking-wide">기록</p>
                <p className="text-[14px] text-[#212121] leading-relaxed whitespace-pre-wrap">{project.content}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-16">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="17" stroke="#EBEBEB" strokeWidth="2" /><path d="M18 10v8l5 3" stroke="#C8C8C8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="text-[13px] text-[#C8C8C8]">아직 기록이 없어요</p>
              </div>
            )}
          </div>
        )}

        {/* ══ 하단 고정 바 ══ */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white z-20 border-t border-[#F0F0F0]" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
          {yarns.length > 0 || needles.length > 0 ? (
            <div className="flex items-center px-5 h-[60px] gap-0">
              {yarns.length > 0 && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[13px] font-semibold text-[#9A9A9A] flex-shrink-0">실</span>
                  <span className="text-[13px] text-[#212121] truncate">
                    {yarns[0].name}{yarns[0].weight ? ` · ${yarns[0].weight}` : ''}
                  </span>
                </div>
              )}
              {yarns.length > 0 && needles.length > 0 && <div className="w-px h-4 bg-[#E0E0E0] mx-3 flex-shrink-0" />}
              {needles.length > 0 && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-[13px] font-semibold text-[#9A9A9A] flex-shrink-0">바늘</span>
                  <span className="text-[13px] text-[#212121] truncate">{needles[0].name}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[60px] gap-5">
              <button onClick={() => setActiveTab('정보')} className="flex items-center gap-1.5 text-[13px] text-[#9A9A9A] active:opacity-60">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#C8C8C8" strokeWidth="1.5" /><path d="M12 8v4l3 3" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                재료를 추가해보세요
              </button>
            </div>
          )}
        </div>

      </div>

      {/* 날짜 피커 */}
      {datePicker && (
        <CalendarPicker
          value={datePicker === 'start' ? project.startDate : project.endDate}
          onChange={d => { if (id) updateProject(id, datePicker === 'start' ? { startDate: d } : { endDate: d }) }}
          onClose={() => setDatePicker(null)}
        />
      )}

      {/* 도안 선택 */}
      <PatternSelectSheet isOpen={patternSelectOpen} onClose={() => setPatternSelectOpen(false)} onSelect={p => {
        if (id) updateProject(id, { patternId: p.id, patternName: p.name, patternAuthor: p.author, patternSelectedSize: parseSizes(p.size)[0] || '' })
        setPatternSelectOpen(false)
      }} />

      {/* 도안 상세 */}
      <PatternDetailSheet isOpen={patternDetailOpen} onClose={() => setPatternDetailOpen(false)} pattern={selectedPattern} />

      {/* 실 시트 */}
      <YarnSheet isOpen={yarnOpen} onClose={() => setYarnOpen(false)} initial={editingYarn} onSave={saveYarn} />

      {/* 바늘 시트 */}
      <NeedleSheet isOpen={needleOpen} onClose={() => setNeedleOpen(false)} initial={editingNeedle} onSave={saveNeedle} />

      {/* 게이지 시트 */}
      <GaugeSheet isOpen={gaugeOpen} onClose={() => setGaugeOpen(false)} initial={editingGauge} onSave={saveGauge} />

      {/* 삭제 확인 */}
      {deleteOpen && (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] z-[80] flex items-center justify-center bg-black/40 px-8">
          <div className="w-full bg-white rounded-[20px] px-6 py-7 flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1.5">
              <p className="text-[17px] font-bold text-[#212121]">기록을 삭제할까요?</p>
              <p className="text-[14px] text-[#9A9A9A]">삭제된 기록은 복구할 수 없어요.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteOpen(false)} className="flex-1 h-[52px] bg-[#F0F0F0] rounded-[12px] text-[15px] font-semibold text-[#646464] active:opacity-70">취소</button>
              <button onClick={() => { deleteProject(project.id); router.replace('/projects') }} className="flex-1 h-[52px] bg-[#F72E00] rounded-[12px] text-[15px] font-semibold text-white active:opacity-70">확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
