'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

// 현재 달 기준 더미 활동일 (15~18 연속 4일)
const ACTIVITY_DAYS = new Set([15, 16, 17, 18])

const CHALLENGES = [
  { id: '1', title: '여름 가방 완성', participants: 200, progress: 60, reward: '여름 가방 배지' },
  { id: '2', title: '1000일 연속 뜨개', participants: 159, progress: 10, reward: '성실 대마왕 배지' },
  { id: '3', title: '코위찬 가디건 완성', participants: 93, progress: 40, reward: '코위찬 가디건 배지' },
]

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const firstDayMon = firstDay === 0 ? 6 : firstDay - 1 // Mon=0 ... Sun=6
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDayMon).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

function PeopleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#9a9a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="7" r="4" stroke="#9a9a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#9a9a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#9a9a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function BadgeCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.49 4.49 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.307 4.49 4.49 0 0 1-1.307-3.497A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        fill="#606060"
      />
    </svg>
  )
}

export default function StreakPage() {
  const router = useRouter()
  const today = new Date()
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [monthDropOpen, setMonthDropOpen] = useState(false)

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()

  const cells = useMemo(() => buildCalendar(year, month), [year, month])

  const activeCount = ACTIVITY_DAYS.size

  const isActive = (day: number | null) => isCurrentMonth && day !== null && ACTIVITY_DAYS.has(day)
  const isToday = (day: number | null) => isCurrentMonth && day === today.getDate()

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center px-4 pt-14 pb-4">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <h1 className="flex-1 text-center text-[18px] font-bold text-[#212121] tracking-[-0.5px]">내 뜨개 활동</h1>
        <div className="w-8" />
      </div>

      {/* 달력 카드 */}
      <div className="mx-4 mb-5 bg-white rounded-[12px] shadow-[0px_4px_20px_1px_rgba(0,0,0,0.04)] px-5 pt-5 pb-5">
        {/* 월 헤더 */}
        <div className="flex items-center justify-between mb-5">
          <div className="relative">
            <button
              onClick={() => setMonthDropOpen(v => !v)}
              className="flex items-center gap-1 text-[16px] font-bold text-[#212121]"
            >
              {month + 1}월
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="#212121" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {monthDropOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMonthDropOpen(false)} />
                <div className="absolute top-8 left-0 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] z-20 w-20 overflow-hidden">
                  {Array.from({ length: 12 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => { setViewDate(new Date(year, i, 1)); setMonthDropOpen(false) }}
                      className="w-full text-left px-3 py-2 text-[13px] font-medium"
                      style={{ color: month === i ? '#f72e00' : '#212121' }}
                    >
                      {i + 1}월
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewDate(new Date(year, month - 1, 1))}
              className="w-6 h-6 flex items-center justify-center"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M7 1L1 7l6 6" stroke="#f72e00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => setViewDate(new Date(year, month + 1, 1))}
              className="w-6 h-6 flex items-center justify-center"
            >
              <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
                <path d="M1 1l6 6-6 6" stroke="#f72e00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className="text-center text-[13px] font-semibold py-1"
              style={{ color: i === 6 ? '#f72e00' : '#212121' }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-y-1">
          {cells.map((day, idx) => {
            const active = isActive(day)
            const todayFlag = isToday(day)
            const isSun = idx % 7 === 6
            return (
              <div key={idx} className="flex items-center justify-center py-0.5">
                {day === null ? null : (
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium"
                    style={{
                      background: active && !todayFlag ? '#f72e00' : 'transparent',
                      color: active && !todayFlag
                        ? '#ffffff'
                        : todayFlag
                        ? '#f72e00'
                        : isSun
                        ? '#f72e00'
                        : '#7c7c7c',
                      border: todayFlag ? '1.5px solid #f72e00' : 'none',
                    }}
                  >
                    {day}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 구분선 */}
        <div className="h-px bg-[#f0f0f0] mt-4 mb-4" />

        {/* 요약 */}
        <p className="text-center text-[15px] text-[#575757]">
          이번 달{' '}
          <span className="font-bold text-[#202020]">{activeCount}일</span>{' '}
          연속 뜨개 중 🧶
        </p>
      </div>

      {/* 뜨개 챌린지 */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[18px] font-bold text-[#212121] tracking-[-0.5px]">뜨개 챌린지</p>
          <button className="text-[13px] font-medium text-[#828282]">더보기</button>
        </div>

        <div className="flex flex-col gap-3">
          {CHALLENGES.map(ch => (
            <div key={ch.id} className="bg-white rounded-[12px] p-4 flex flex-col gap-[12px] drop-shadow-[0px_4px_10px_rgba(0,0,0,0.04)]">
              {/* 제목 + 참여자 수 */}
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-semibold text-[#212121]">{ch.title}</p>
                <div className="flex items-center">
                  <PeopleIcon />
                  <span className="text-[14px] font-medium text-[#9a9a9a] tracking-[-0.28px]">{ch.participants}명 참여 중</span>
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-[#606060]">진행률</span>
                  <span className="font-bold text-[#f72e00]">{ch.progress}%</span>
                </div>
                <div className="h-[6px] bg-[#f0f0f0] rounded-[3px] overflow-hidden">
                  <div
                    className="h-full bg-[#ff461b]"
                    style={{ width: `${ch.progress}%` }}
                  />
                </div>
              </div>

              {/* 리워드 배지 */}
              <div className="flex items-center">
                <BadgeCheckIcon />
                <span className="text-[12px] font-medium text-[#606060]">{ch.reward}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
