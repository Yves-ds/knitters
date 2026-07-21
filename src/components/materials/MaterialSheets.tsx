'use client'
import { useState, useEffect, useRef } from 'react'
import { YarnItem, NeedleItem, GaugeItem } from '@/store/projectStore'

export function uid() { return Math.random().toString(36).slice(2) }

/* ── 점 3개 메뉴 ── */
export function DotMenu({ items }: { items: { label: string; danger?: boolean; onClick: () => void }[] }) {
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
              <button key={i} onClick={() => { item.onClick(); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-[14px] font-medium active:bg-[#F5F5F5]"
                style={{ color: item.danger ? '#F72E00' : '#212121' }}>
                {item.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── 실 추가/수정 시트 ── */
export function YarnSheet({ isOpen, onClose, initial, onSave }: {
  isOpen: boolean; onClose: () => void; initial?: YarnItem; onSave: (item: YarnItem) => void
}) {
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [weight, setWeight] = useState('')
  const [photo, setPhoto] = useState<string | undefined>()
  const photoRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setName(initial?.name ?? ''); setBrand(initial?.brand ?? '')
      setColor(initial?.color ?? ''); setWeight(initial?.weight ?? '')
      setPhoto(initial?.photo)
    }
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
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)', pointerEvents: isOpen ? 'auto' : 'none', maxHeight: '90vh' }}>
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[20px] font-bold">{initial ? '실 수정' : '실 추가'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="px-5 flex flex-col gap-4 pb-8 overflow-y-auto">
          <button onClick={() => photoRef.current?.click()} className="w-full rounded-[14px] overflow-hidden relative" style={{ aspectRatio: '3/2', background: '#F5F5F5' }}>
            {photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photo} alt="" className="w-full h-full object-cover" />
              : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /></svg>
                  <span className="text-[13px] text-[#C8C8C8]">사진 추가</span>
                </div>
            }
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
          <button onClick={handleSave} disabled={!canSave}
            className="w-full h-[52px] rounded-[12px] text-[15px] font-semibold text-white mt-1 active:opacity-80"
            style={{ background: canSave ? '#F72E00' : '#E0E0E0' }}>
            저장
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 바늘 추가/수정 시트 ── */
export function NeedleSheet({ isOpen, onClose, initial, onSave }: {
  isOpen: boolean; onClose: () => void; initial?: NeedleItem; onSave: (item: NeedleItem) => void
}) {
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
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)', pointerEvents: isOpen ? 'auto' : 'none', maxHeight: '90vh' }}>
        <div className="w-10 h-1 bg-[#E0E0E0] rounded-full mx-auto mt-3 flex-shrink-0" />
        <div className="px-5 pt-5 pb-4 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[20px] font-bold">{initial ? '바늘 수정' : '바늘 추가'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 2L14 14M14 2L2 14" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" /></svg>
          </button>
        </div>
        <div className="px-5 flex flex-col gap-4 pb-8 overflow-y-auto">
          <button onClick={() => photoRef.current?.click()} className="w-full rounded-[14px] overflow-hidden relative" style={{ aspectRatio: '3/2', background: '#F5F5F5' }}>
            {photo
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={photo} alt="" className="w-full h-full object-cover" />
              : <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="#C8C8C8" strokeWidth="1.5" /><circle cx="12" cy="12" r="3.5" stroke="#C8C8C8" strokeWidth="1.5" /></svg>
                  <span className="text-[13px] text-[#C8C8C8]">사진 추가</span>
                </div>
            }
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
          <button onClick={handleSave} disabled={!canSave}
            className="w-full h-[52px] rounded-[12px] text-[15px] font-semibold text-white mt-1 active:opacity-80"
            style={{ background: canSave ? '#F72E00' : '#E0E0E0' }}>
            저장
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 게이지 추가/수정 시트 ── */
export function GaugeSheet({ isOpen, onClose, initial, onSave }: {
  isOpen: boolean; onClose: () => void; initial?: GaugeItem; onSave: (item: GaugeItem) => void
}) {
  const [stitches, setStitches] = useState('')
  const [rows, setRows] = useState('')
  const [swatchWidth, setSwatchWidth] = useState('')
  const [swatchHeight, setSwatchHeight] = useState('')
  const [stitchType, setStitchType] = useState('')
  const [washing, setWashing] = useState('')

  useEffect(() => {
    if (isOpen) {
      setStitches(initial?.stitches ?? ''); setRows(initial?.rows ?? '')
      setSwatchWidth(initial?.swatchWidth ?? ''); setSwatchHeight(initial?.swatchHeight ?? '')
      setStitchType(initial?.stitchType ?? ''); setWashing(initial?.washing ?? '')
    }
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
        style={{ left: '50%', transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`, transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)', pointerEvents: isOpen ? 'auto' : 'none', maxHeight: '90vh' }}>
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
          <button onClick={handleSave} disabled={!canSave}
            className="w-full h-[52px] rounded-[12px] text-[15px] font-semibold text-white mt-1 active:opacity-80"
            style={{ background: canSave ? '#F72E00' : '#E0E0E0' }}>
            저장
          </button>
        </div>
      </div>
    </>
  )
}

/* ── 재료 카드 (실/바늘 공통) ── */
export function MaterialCard({ thumbnail, title, sub1, sub2, menuItems }: {
  thumbnail?: string
  title: string
  sub1?: string
  sub2?: string
  menuItems: { label: string; danger?: boolean; onClick: () => void }[]
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
      <div className="w-[60px] h-[60px] rounded-[10px] bg-[#EBEBEB] flex-shrink-0 overflow-hidden">
        {thumbnail && <img src={thumbnail} alt="" className="w-full h-full object-cover" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[#212121] leading-snug line-clamp-1">{title}</p>
        {sub1 && <p className="text-[12px] text-[#9A9A9A] mt-0.5 truncate">{sub1}</p>}
        {sub2 && <p className="text-[12px] text-[#B0B0B0] truncate">{sub2}</p>}
      </div>
      <DotMenu items={menuItems} />
    </div>
  )
}

/* ── 게이지 카드 ── */
export function GaugeCard({ gauge, menuItems }: {
  gauge: GaugeItem
  menuItems: { label: string; danger?: boolean; onClick: () => void }[]
}) {
  return (
    <div className="p-3 rounded-[14px]" style={{ background: '#FAFAFA', border: '1px solid #F0F0F0' }}>
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
        <DotMenu items={menuItems} />
      </div>
    </div>
  )
}

/* ── 섹션 헤더 ── */
export function SectionHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-[17px] font-bold text-[#212121]">{title}</span>
      <button onClick={onAdd} className="w-8 h-8 flex items-center justify-center active:opacity-60">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M1 8h14" stroke="#F72E00" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </div>
  )
}

/* ── 섹션 빈 상태 버튼 ── */
export function EmptyAddButton({ label, onClick, dashed }: { label: string; onClick: () => void; dashed?: boolean }) {
  return (
    <button onClick={onClick} className="w-full rounded-[14px] flex items-center justify-center gap-2 py-6 active:opacity-70"
      style={dashed
        ? { border: '1.5px dashed #D0D0D0', background: 'white' }
        : { background: '#F5F5F5' }
      }>
      <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
        <path d="M12 1H3a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2V8L12 1z" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 1v7h7" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[14px] font-medium text-[#B0B0B0]">{label}</span>
    </button>
  )
}
