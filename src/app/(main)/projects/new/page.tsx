'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Camera, Video, FileText } from 'lucide-react'

const STATUS_OPTIONS = ['뜨는 중', '쉬는 중', '완성', '시작 안 함']

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
  const [status, setStatus] = useState('뜨는 중')
  const [startDate, setStartDate] = useState('')
  const [content, setContent] = useState('')
  const [statusSheetOpen, setStatusSheetOpen] = useState(false)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerSecs, setTimerSecs] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
        <div className="flex-1 flex items-center justify-center gap-0.5">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="프로젝트 제목"
            className="text-[18px] font-bold text-[#212121] text-center bg-transparent outline-none placeholder:text-[#c8c8c8] min-w-0 max-w-[200px]"
          />
          <span className="text-[#F72E00] text-[18px] font-bold leading-none">*</span>
        </div>
        <button
          onClick={() => router.push('/projects')}
          className="text-[15px] font-semibold text-[#646464] shrink-0"
        >
          등록
        </button>
      </div>

      {/* 상태·날짜 배지 */}
      <div className="flex items-center gap-2 px-4 pb-4">
        {/* 상태 배지 */}
        <button
          onClick={() => setStatusSheetOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] font-semibold"
          style={{ background: '#feeae5', color: '#F72E00' }}
        >
          <span className="flex items-center gap-[3px]">
            {[0, 150, 300].map(delay => (
              <span
                key={delay}
                className="w-[5px] h-[5px] rounded-full bg-[#F72E00] inline-block animate-bounce"
                style={{ animationDelay: `${delay}ms`, animationDuration: '0.9s' }}
              />
            ))}
          </span>
          {status}
        </button>

        {/* 시작일 배지 */}
        <button
          onClick={() => setDateSheetOpen(true)}
          className="flex items-center gap-1.5 h-8 px-3 rounded-full text-[13px] font-semibold border border-[#e0e0e0] bg-white text-[#646464]"
        >
          <CalendarIcon />
          {startDate || '시작일'}
        </button>
      </div>

      {/* 자유 입력 영역 */}
      <div className="flex-1 px-4">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="기록하고 싶은 내용을 자유롭게 입력해주세요"
          className="w-full h-full min-h-[400px] text-[15px] text-[#212121] placeholder:text-[#c8c8c8] outline-none resize-none leading-relaxed"
        />
      </div>

      {/* 하단 툴바 */}
      <div className="sticky bottom-0 bg-white border-t border-[#f0f0f0] px-5 py-3 flex items-center gap-5">
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#646464]">
          <Camera size={20} className="text-[#F72E00]" />
          사진
        </button>
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#646464]">
          <Video size={20} className="text-[#F72E00]" />
          영상
        </button>
        <button className="flex items-center gap-1.5 text-[13px] font-medium text-[#646464]">
          <FileText size={20} className="text-[#F72E00]" />
          도안
        </button>
        {/* 타이머 */}
        <div className="flex-1 flex items-center justify-end gap-2">
          <button
            onClick={() => setTimerRunning(v => !v)}
            className="w-7 h-7 flex items-center justify-center"
          >
            {timerRunning ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F72E00">
                <rect x="6" y="4" width="4" height="16" rx="1"/>
                <rect x="14" y="4" width="4" height="16" rx="1"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#F72E00">
                <path d="M5 3l14 9-14 9V3z"/>
              </svg>
            )}
          </button>
          <span className="text-[14px] font-semibold tabular-nums" style={{ color: '#F72E00' }}>
            {formatTimer(timerSecs)}
          </span>
        </div>
      </div>

      {/* 상태 선택 바텀시트 */}
      {statusSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setStatusSheetOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[20px] z-50 pb-10 px-6 pt-3">
            <div className="w-10 h-1 bg-[#e0e0e0] rounded-full mx-auto mb-5" />
            <p className="text-[17px] font-bold text-[#212121] mb-3">상태 선택</p>
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt}
                onClick={() => { setStatus(opt); setStatusSheetOpen(false) }}
                className="w-full text-left py-3.5 text-[16px] font-medium border-b border-[#f5f5f5] last:border-0 flex items-center justify-between"
                style={{ color: status === opt ? '#F72E00' : '#212121' }}
              >
                {opt}
                {status === opt && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12l5 5L19 7" stroke="#F72E00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 시작일 선택 바텀시트 */}
      {dateSheetOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setDateSheetOpen(false)} />
          <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white rounded-t-[20px] z-50 pb-10 px-6 pt-3">
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
