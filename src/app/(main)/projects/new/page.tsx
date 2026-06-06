'use client'
import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
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
  const titleInputRef = useRef<HTMLInputElement>(null)
  const titleSizerRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (titleSizerRef.current && titleInputRef.current) {
      titleInputRef.current.style.width = titleSizerRef.current.offsetWidth + 'px'
    }
  }, [title])

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
        <div className="flex-1 flex items-center justify-center gap-[2px]">
          {/* 텍스트 너비 측정용 숨김 span */}
          <span
            ref={titleSizerRef}
            aria-hidden
            className="text-[18px] font-semibold"
            style={{
              position: 'absolute',
              visibility: 'hidden',
              whiteSpace: 'pre',
              pointerEvents: 'none',
              fontFamily: 'inherit',
            }}
          >
            {title || '프로젝트 제목'}
          </span>
          <input
            ref={titleInputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="프로젝트 제목"
            className="text-[18px] font-semibold text-[#212121] text-center bg-transparent outline-none placeholder:text-[#c8c8c8] p-0"
            style={{ width: 0 }}
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.778 21H14.222C17.343 21 18.904 21 20.025 20.265C20.5088 19.9482 20.9254 19.5391 21.251 19.061C22 17.961 22 16.428 22 13.364C22 10.3 22 8.76705 21.251 7.66705C20.9254 7.18904 20.5088 6.77991 20.025 6.46305C19.305 5.99005 18.403 5.82105 17.022 5.76105C16.363 5.76105 15.796 5.27105 15.667 4.63605C15.5684 4.17092 15.3123 3.75408 14.9418 3.456C14.5714 3.15791 14.1095 2.99686 13.634 3.00005H10.366C9.378 3.00005 8.527 3.68505 8.333 4.63605C8.204 5.27105 7.637 5.76105 6.978 5.76105C5.598 5.82105 4.696 5.99105 3.975 6.46305C3.49154 6.78001 3.07527 7.18914 2.75 7.66705C2 8.76705 2 10.299 2 13.364C2 16.429 2 17.96 2.749 19.061C3.073 19.537 3.489 19.946 3.975 20.265C5.096 21 6.657 21 9.778 21Z" fill="#838383"/>
            <path d="M17.5561 9.27201C17.4477 9.27109 17.3401 9.29154 17.2395 9.3322C17.1389 9.37286 17.0474 9.43293 16.97 9.50898C16.8927 9.58503 16.831 9.67558 16.7887 9.77544C16.7463 9.87531 16.7241 9.98254 16.7231 10.091C16.7231 10.543 17.0961 10.909 17.5561 10.909H18.6671C19.1271 10.909 19.5011 10.542 19.5011 10.091C19.5002 9.98245 19.4779 9.87514 19.4355 9.77521C19.3931 9.67528 19.3314 9.58469 19.2539 9.50863C19.1765 9.43256 19.0848 9.37251 18.9841 9.33191C18.8834 9.29131 18.7757 9.27096 18.6671 9.27201H17.5561Z" fill="#D2D2D2"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 9.27197C9.69998 9.27197 7.83398 11.104 7.83398 13.363C7.83398 15.622 9.69898 17.454 12.001 17.454C14.301 17.454 16.167 15.623 16.167 13.364C16.167 11.105 14.302 9.27197 12.001 9.27197M12.001 10.909C10.621 10.909 9.50098 12.008 9.50098 13.363C9.50098 14.718 10.621 15.818 12.001 15.818C13.382 15.818 14.501 14.719 14.501 13.363C14.501 12.008 13.382 10.909 12.001 10.909Z" fill="#D2D2D2"/>
          </svg>
          <span className="text-[12px] font-normal text-[#646464]">사진</span>
          <input type="file" accept="image/*" multiple className="hidden" />
        </label>
        <button className="flex items-center gap-[6px] active:opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M15 9.649L20.646 7.512C20.7974 7.45469 20.9605 7.43499 21.1212 7.45462C21.2819 7.47424 21.4355 7.53259 21.5686 7.62466C21.7018 7.71673 21.8107 7.83975 21.8858 7.98317C21.9609 8.12658 22.0001 8.28609 22 8.448V15.557C21.9999 15.7185 21.9607 15.8777 21.8858 16.0207C21.8108 16.1638 21.7023 16.2866 21.5695 16.3786C21.4367 16.4706 21.2836 16.5291 21.1233 16.549C20.963 16.5689 20.8003 16.5497 20.649 16.493L15 14.375V16C15 16.5304 14.7893 17.0391 14.4142 17.4142C14.0391 17.7893 13.5304 18 13 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H13C13.5304 6 14.0391 6.21071 14.4142 6.58579C14.7893 6.96086 15 7.46957 15 8V9.649Z" fill="#838383"/>
          </svg>
          <span className="text-[12px] font-normal text-[#646464]">영상</span>
        </button>
        <button className="flex items-center gap-[6px] active:opacity-50">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M20 12C20 16.4184 16.4184 20 12 20C7.5816 20 4 16.4184 4 12C4 7.5816 7.5816 4 12 4C16.4184 4 20 7.5816 20 12Z" fill="#D2D2D2"/>
            <path d="M14.845 10.3821L13.6281 9.16451C12.797 8.33174 12.3809 7.91576 11.9346 8.01422C11.4882 8.11267 11.2864 8.66567 10.881 9.77001L10.607 10.5183C10.4987 10.8136 10.4453 10.9605 10.3477 11.0737C10.3042 11.125 10.2546 11.1708 10.2 11.2099C10.0786 11.2977 9.9276 11.3396 9.62565 11.4232C8.94461 11.6103 8.60328 11.7038 8.47528 11.927C8.42002 12.0234 8.39115 12.1326 8.39159 12.2437C8.39323 12.5013 8.64266 12.7508 9.14236 13.2512L9.50913 13.6188L8.17989 14.9496C8.06455 15.0652 7.99985 15.2218 8 15.385C8.00015 15.5483 8.06516 15.7048 8.18071 15.8201C8.29627 15.9354 8.4529 16.0002 8.61617 16C8.77943 15.9998 8.93595 15.9348 9.05128 15.8193L10.3789 14.4893L10.767 14.8774C11.27 15.3804 11.5219 15.6322 11.7803 15.6322C11.8894 15.6325 11.9966 15.6043 12.0913 15.5502C12.3161 15.4222 12.4105 15.0792 12.5992 14.3933C12.6813 14.0914 12.7239 13.9404 12.8109 13.819C12.8492 13.7654 12.893 13.7173 12.9422 13.6746C13.0554 13.5761 13.2015 13.5212 13.4944 13.4121L14.2509 13.1274C15.3438 12.7171 15.8903 12.512 15.9863 12.0665C16.0823 11.621 15.6704 11.2083 14.845 10.3821Z" fill="#838383"/>
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
