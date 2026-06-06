'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Camera, Video, FileText } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

const STATUS_OPTIONS = ['준비 중', '뜨는 중', '쉬는 중', '완성']

// 상태별 배지 컴포넌트
function StatusBadge({ status }: { status: string }) {
  if (status === '뜨는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#DDEDFF' }}>
      <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
        <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#209BFF', marginBottom: 0 }} />
        <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#209BFF', opacity: 0.5, marginBottom: 3 }} />
        <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#209BFF', marginBottom: 6 }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#209BFF' }}>뜨는 중</span>
    </div>
  )
  if (status === '쉬는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#FFEEEA' }}>
      <div className="flex items-center gap-[5px]">
        <span className="w-[8px] h-[8px] rounded-full inline-block" style={{ background: '#F72E00' }} />
        <span className="w-[8px] h-[8px] rounded-full inline-block" style={{ background: '#F72E00' }} />
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
        <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#3B3B3B' }} />
        <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#3B3B3B', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full inline-block" style={{ background: '#3B3B3B' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#3B3B3B' }}>준비 중</span>
    </div>
  )
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="#646464" strokeWidth="1.5"/>
      <path d="M3 9h18" stroke="#646464" strokeWidth="1.5"/>
      <path d="M8 2v2M16 2v2" stroke="#646464" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('준비 중')
  const [startDate, setStartDate] = useState('')
  const [content, setContent] = useState('')
  const [statusSheetOpen, setStatusSheetOpen] = useState(false)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSecs, setTimerSecs] = useState(0)
  const [inputFocused, setInputFocused] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const addProject = useProjectStore(s => s.addProject)
  const canSubmit = title.trim().length > 0

  const handleRegister = () => {
    if (!canSubmit) return
    addProject({
      title: title.trim(),
      status: status === '뜨는 중' ? '진행 중' : status === '준비 중' ? '시작 안 함' : status,
      startDate,
      endDate: '',
      content,
      emoji: '🧶',
      timerSecs,
    })
    router.push('/projects')
  }

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  const formatTimer = (s: number) => {
    const h = String(Math.floor(s / 3600)).padStart(2, '0')
    const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">

      {/* 헤더 */}
      <div className="flex items-center px-4 pt-14 pb-3">
        <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center">
          <ChevronLeft size={22} className="text-[#646464]" />
        </button>
        <div className="flex-1 flex items-center justify-center" style={{ gap: '2px' }}>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="프로젝트 제목"
            className="text-[18px] font-semibold text-[#212121] text-center bg-transparent outline-none placeholder:text-[#c8c8c8] min-w-0 max-w-[200px] p-0"
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
        {/* 상태 배지 */}
        <button onClick={() => setStatusSheetOpen(true)}>
          <StatusBadge status={status} />
        </button>

        {/* 시작일 배지 — 준비 중일 때 숨김 */}
        {status !== '준비 중' && (
          <button
            onClick={() => setDateSheetOpen(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] text-[13px] font-semibold border border-[#e0e0e0] bg-white text-[#646464]"
          >
            <CalendarIcon />
            {startDate || '시작일'}
          </button>
        )}
      </div>

      {/* 자유 입력 영역 — 네비게이션 바 높이만큼 하단 패딩 확보 */}
      <div className="flex-1 px-4 pb-[72px]">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          placeholder="기록하고 싶은 내용을 자유롭게 입력해주세요"
          className="w-full h-full min-h-[400px] text-[15px] text-[#212121] placeholder:text-[#c8c8c8] outline-none resize-none leading-relaxed"
        />
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-[#F0F0F0] z-20 flex items-center px-5" style={{ height: 72, gap: 12 }}>
        <label className="flex items-center gap-[6px] cursor-pointer active:opacity-50">
          <Camera size={24} color="#646464" />
          <span className="text-[12px] font-normal text-[#646464]">사진</span>
          <input type="file" accept="image/*" multiple className="hidden" />
        </label>
        <button className="flex items-center gap-[6px] active:opacity-50">
          <Video size={24} color="#646464" />
          <span className="text-[12px] font-normal text-[#646464]">영상</span>
        </button>
        <button className="flex items-center gap-[6px] active:opacity-50">
          <FileText size={24} color="#646464" />
          <span className="text-[12px] font-normal text-[#646464]">도안</span>
        </button>
        <button className="flex items-center gap-[6px] active:opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2Z" stroke="#646464" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M12 12V21" stroke="#646464" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M9 21H15" stroke="#646464" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <span className="text-[12px] font-normal text-[#646464]">정보</span>
        </button>
      </div>

      {/* 상태 선택 바텀시트 */}
      {statusSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setStatusSheetOpen(false)} />
          <div
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[20px] z-50 px-6 pt-3"
            style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))' }}
          >
            <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-5" />
            <p className="text-[17px] font-bold text-[#212121] mb-4">상태 선택</p>
            <div className="flex flex-wrap gap-3">
              {STATUS_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setStatus(opt); setStatusSheetOpen(false) }}
                  className="relative"
                >
                  <StatusBadge status={opt} />
                  {status === opt && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#212121] rounded-full flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* 시작일 선택 바텀시트 */}
      {dateSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDateSheetOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[20px] z-50 px-6 pt-3" style={{ paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))' }}>
            <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-5" />
            <p className="text-[17px] font-bold text-[#212121] mb-4">시작일</p>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full border border-[#e0e0e0] rounded-[10px] px-4 py-3 text-[15px] text-[#212121] outline-none focus:border-[#F72E00]"
            />
            <button
              onClick={() => setDateSheetOpen(false)}
              className="mt-4 w-full py-3.5 bg-[#F72E00] text-white text-[15px] font-semibold rounded-[12px] active:opacity-80"
            >
              확인
            </button>
          </div>
        </>
      )}
    </div>
  )
}
