'use client'
import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Users, Gift } from 'lucide-react'
import { mockChallenges } from '@/lib/mockData'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// 이번 달 기준 더미 활동일 (고정 seed)
const ACTIVITY_DAYS = new Set([1, 2, 3, 5, 7, 8, 10, 12, 14, 15, 16, 19, 21, 22, 24, 26, 28, 29, 30])

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  '진행 중': { bg: '#FEF3C7', text: '#F59E0B', label: '진행 중' },
  '예정':    { bg: '#EFF6FF', text: '#3B86FB', label: '예정' },
  '완료':    { bg: '#F3F4F6', text: '#9CA3AF', label: '완료' },
}

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay() // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // pad to full rows
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
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

  const activeCount = isCurrentMonth
    ? ACTIVITY_DAYS.size
    : 0

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1))
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1))
  const selectMonth = (m: number) => { setViewDate(new Date(year, m, 1)); setMonthDropOpen(false) }

  const isActive = (day: number | null) => isCurrentMonth && day !== null && ACTIVITY_DAYS.has(day)
  const isToday = (day: number | null) => isCurrentMonth && day === today.getDate()

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center px-4 pt-14 pb-4">
        <button onClick={() => router.push('/feed')} className="w-8 h-8 flex items-center justify-center mr-2">
          <ChevronLeft size={24} className="text-[#212121]" />
        </button>
        <h1 className="flex-1 text-center text-[18px] font-bold text-[#212121] tracking-[-0.5px]">뜨개 스트릭</h1>
        <div className="w-8" />
      </div>

      {/* ── 달력 섹션 ── */}
      <div className="mx-4 mb-4 bg-white rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-4 pt-4 pb-5">
        {/* 달력 상단 */}
        <div className="flex items-center justify-between mb-4">
          {/* 월 선택 */}
          <div className="relative">
            <button
              onClick={() => setMonthDropOpen(v => !v)}
              className="flex items-center gap-1 text-[18px] font-bold text-[#212121]"
            >
              {month + 1}월
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="mt-0.5">
                <path d="M1 1l4 4 4-4" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {monthDropOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMonthDropOpen(false)} />
                <div className="absolute top-8 left-0 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] z-20 w-24 overflow-hidden">
                  {Array.from({ length: 12 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => selectMonth(i)}
                      className="w-full text-left px-4 py-2 text-[14px] font-medium"
                      style={{ color: month === i ? '#f72e00' : '#212121' }}
                    >
                      {i + 1}월
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 이전 / 다음 버튼 */}
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5]">
              <ChevronLeft size={18} className="text-[#646464]" />
            </button>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5]">
              <ChevronRight size={18} className="text-[#646464]" />
            </button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 mb-1">
          {WEEKDAYS.map((d, i) => (
            <div
              key={d}
              className="text-center text-[12px] font-semibold py-1"
              style={{ color: i === 0 ? '#f72e00' : '#9CA3AF' }}
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
            const isSun = idx % 7 === 0
            return (
              <div key={idx} className="flex items-center justify-center py-0.5">
                {day === null ? null : (
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-medium transition-all"
                    style={{
                      background: active ? '#f72e00' : 'transparent',
                      color: active ? '#fff' : todayFlag ? '#f72e00' : isSun ? '#f72e00' : '#9CA3AF',
                      border: todayFlag && !active ? '1.5px solid #f72e00' : 'none',
                    }}
                  >
                    {day}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* 달력 하단 요약 */}
        <div className="mt-4 pt-4 border-t border-[#f0f0f0] text-center">
          <p className="text-[14px] text-[#565656]">
            {isCurrentMonth
              ? <><span className="font-bold text-[#212121]">이번 달 {activeCount}일</span> 뜨개했어요 🧶</>
              : <span className="text-[#a7a7a7]">활동 기록이 없어요</span>
            }
          </p>
        </div>
      </div>

      {/* ── 뜨개 챌린지 섹션 ── */}
      <div className="px-4">
        <p className="text-[18px] font-bold text-[#212121] mb-3 tracking-[-0.5px]">뜨개 챌린지</p>

        {mockChallenges.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <span className="text-4xl">🏆</span>
            <p className="text-[14px] text-[#a7a7a7] text-center">
              참여 중인 챌린지가 없어요.<br />챌린지에 참여해보세요!
            </p>
            <Link href="/explore" className="mt-1 px-5 py-2.5 bg-[#f72e00] text-white text-[14px] font-semibold rounded-[10px]">
              챌린지 둘러보기
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mockChallenges.map(ch => {
              const s = STATUS_STYLE[ch.status]
              const isActive = ch.status === '진행 중'
              const isPending = ch.status === '예정'
              return (
                <div key={ch.id} className="bg-white rounded-[14px] px-4 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
                  {/* 상단: 배지 + 제목 */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-[20px]">{ch.emoji}</span>
                      <p className="text-[15px] font-bold text-[#212121] truncate">{ch.title}</p>
                    </div>
                    <span
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: s.bg, color: s.text }}
                    >
                      {s.label}
                    </span>
                  </div>

                  {/* 기간 */}
                  <p className="text-[12px] text-[#a7a7a7] mb-3">{ch.period}</p>

                  {/* 달성률 프로그레스 (진행 중만) */}
                  {isActive && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] text-[#565656]">달성률</span>
                        <span className="text-[12px] font-semibold text-[#f72e00]">{ch.achievement}%</span>
                      </div>
                      <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#f72e00] transition-all"
                          style={{ width: `${ch.achievement}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* 참여자 + 리워드 */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1 text-[12px] text-[#9CA3AF]">
                      <Users size={12} />
                      <span>{ch.participants.toLocaleString()}명 참여</span>
                    </div>
                    {ch.reward !== '완료' && (
                      <div className="flex items-center gap-1 text-[12px] text-[#9CA3AF]">
                        <Gift size={12} />
                        <span>{ch.reward}</span>
                      </div>
                    )}
                  </div>

                  {/* 버튼 */}
                  <button
                    disabled={ch.status === '완료'}
                    className="w-full py-2.5 rounded-[10px] text-[14px] font-semibold transition-all active:scale-[0.98]"
                    style={
                      ch.status === '완료'
                        ? { background: '#f3f4f6', color: '#9CA3AF' }
                        : { background: '#f72e00', color: '#fff' }
                    }
                  >
                    {isActive ? '참여하기' : isPending ? '사전 신청' : '마감됨'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
