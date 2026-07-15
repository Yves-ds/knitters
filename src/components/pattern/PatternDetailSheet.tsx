'use client'
import { useState } from 'react'
import { Pattern } from '@/lib/mockPatterns'

export function parseSizes(sizeStr: string): string[] {
  return sizeStr.split(' · ').map(s => s.trim())
}

export function PatternInfoCard({ pattern, selectedSize, onSizeChange, onDetailOpen, onChangePattern }: {
  pattern: Pattern
  selectedSize: string
  onSizeChange?: (size: string) => void
  onDetailOpen: () => void
  onChangePattern?: () => void
}) {
  const sizes = parseSizes(pattern.size)
  const hasMultipleSizes = sizes.length > 1
  const [sizeDropOpen, setSizeDropOpen] = useState(false)
  const displaySize = selectedSize || sizes[0]

  return (
    <div className="rounded-[14px] p-4" style={{ background: '#FFF8F7', border: '1px solid #FFE0D9' }}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-[52px] h-[52px] rounded-[10px] bg-[#F0EDEA] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#212121] leading-snug line-clamp-1">{pattern.name}</p>
          <p className="text-[12px] text-[#9A9A9A] mt-0.5">{pattern.author}</p>
        </div>
        <button onClick={onDetailOpen} className="flex items-center gap-1 flex-shrink-0 active:opacity-60">
          <span className="text-[12px] font-medium text-[#F72E00]">상세 정보</span>
          <svg width="5" height="9" viewBox="0 0 5 9" fill="none">
            <path d="M1 1l3 3.5-3 3.5" stroke="#F72E00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {pattern.needleSize && (
          <div className="flex items-center gap-1.5 bg-white rounded-[8px] px-2.5 py-1.5" style={{ border: '1px solid #F0F0F0' }}>
            <span className="text-[11px] font-semibold text-[#9A9A9A]">바늘</span>
            <span className="text-[11px] text-[#212121]">{pattern.needleSize}</span>
          </div>
        )}
        {pattern.yarn && (
          <div className="flex items-center gap-1.5 bg-white rounded-[8px] px-2.5 py-1.5" style={{ border: '1px solid #F0F0F0' }}>
            <span className="text-[11px] font-semibold text-[#9A9A9A]">실</span>
            <span className="text-[11px] text-[#212121]">{pattern.yarn}</span>
          </div>
        )}
        <div className="relative">
          {hasMultipleSizes && onSizeChange ? (
            <>
              <button
                onClick={() => setSizeDropOpen(v => !v)}
                className="flex items-center gap-1.5 bg-white rounded-[8px] px-2.5 py-1.5 active:opacity-70"
                style={{ border: '1px solid #F72E00' }}
              >
                <span className="text-[11px] font-semibold text-[#9A9A9A]">사이즈</span>
                <span className="text-[11px] font-semibold text-[#F72E00]">{displaySize}</span>
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                  <path d="M1 1l3 3 3-3" stroke="#F72E00" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              {sizeDropOpen && (
                <>
                  <div className="fixed inset-0 z-[25]" onClick={() => setSizeDropOpen(false)} />
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-[10px] z-[26] py-1 min-w-[80px]" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
                    {sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => { onSizeChange(size); setSizeDropOpen(false) }}
                        className="w-full text-left px-3 py-2 text-[13px] font-medium"
                        style={{
                          color: displaySize === size ? '#F72E00' : '#212121',
                          background: displaySize === size ? '#FFF8F7' : 'transparent',
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center gap-1.5 bg-white rounded-[8px] px-2.5 py-1.5" style={{ border: '1px solid #F0F0F0' }}>
              <span className="text-[11px] font-semibold text-[#9A9A9A]">사이즈</span>
              <span className="text-[11px] text-[#212121]">{displaySize}</span>
            </div>
          )}
        </div>
        {onChangePattern && (
          <button
            onClick={onChangePattern}
            className="flex items-center gap-1 bg-white rounded-[8px] px-2.5 py-1.5 active:opacity-60"
            style={{ border: '1px solid #F0F0F0' }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1v8M1 5h8" stroke="#9A9A9A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px] text-[#9A9A9A]">변경</span>
          </button>
        )}
      </div>
    </div>
  )
}

export function PatternDetailSheet({ isOpen, onClose, pattern }: {
  isOpen: boolean
  onClose: () => void
  pattern: Pattern | null
}) {
  if (!pattern) return null

  const details = [
    { label: '카테고리', value: pattern.category },
    { label: '사이즈', value: pattern.size },
    { label: '바늘 사이즈', value: pattern.needleSize },
    { label: '권장 실', value: pattern.yarn },
    { label: '난이도', value: pattern.difficulty },
    { label: '가격', value: pattern.price },
    { label: '판매처', value: pattern.seller },
  ]

  return (
    <div
      className="fixed inset-y-0 w-full max-w-[393px] z-[70] bg-white flex flex-col"
      style={{
        left: '50%',
        transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
        transition: 'transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center px-5 pt-14 pb-4 border-b border-[#F0F0F0] relative flex-shrink-0">
        <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111]">도안 정보</span>
        <button onClick={onClose} className="ml-auto w-8 h-8 flex items-center justify-center active:opacity-60">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="w-full rounded-[16px] bg-[#F0EDEA] flex items-center justify-center mb-5" style={{ height: 180 }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <rect width="56" height="56" rx="14" fill="#E0D9D0"/>
            <path d="M18 28c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10-10-4.477-10-10z" fill="#C8BEB2"/>
          </svg>
        </div>

        <h2 className="text-[22px] font-bold text-[#212121] leading-snug">{pattern.name}</h2>
        <p className="text-[15px] text-[#646464] mt-1 mb-3">{pattern.author}</p>
        <span className="inline-block px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFEEEA] text-[#F72E00] mb-5">
          {pattern.category}
        </span>

        <div className="h-px bg-[#F0F0F0] mb-4" />
        <p className="text-[14px] text-[#646464] leading-relaxed mb-5">{pattern.description}</p>

        <div className="flex flex-col gap-3.5">
          {details.map(({ label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="text-[13px] font-semibold text-[#9A9A9A] flex-shrink-0 pt-px" style={{ width: 72 }}>{label}</span>
              <span className="text-[14px] text-[#212121] flex-1 leading-snug">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
