'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { MEETINGS } from '@/lib/meetingData'

function HeartIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="22" height="22" viewBox="0 0 18 19" fill="none">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#FBB4A4"/>
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

export default function MeetingDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const meeting = MEETINGS.find(m => m.id === Number(id)) ?? MEETINGS[0]
  const [liked, setLiked] = useState(false)

  const ratio = Math.round((meeting.currentCount / meeting.maxCount) * 100)

  return (
    <div className="min-h-screen bg-white max-w-[393px] mx-auto pb-28">

      {/* 헤더 이미지 영역 */}
      <div
        className="w-full h-[260px] relative flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#fff0ee,#ffd6cc)' }}
      >
        <span className="text-[80px]">🧶</span>

        {/* 뒤로가기 */}
        <button
          onClick={() => router.back()}
          className="absolute top-14 left-4 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center active:opacity-60 shadow-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#212121" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* 좋아요 */}
        <button
          onClick={() => setLiked(l => !l)}
          className="absolute top-14 right-4 w-9 h-9 rounded-full bg-white/80 flex items-center justify-center active:opacity-60 shadow-sm"
        >
          <HeartIcon active={liked} />
        </button>

        {/* 배지 */}
        <div
          className="absolute bottom-4 left-4 h-[26px] px-3 rounded-full flex items-center"
          style={{
            background: meeting.type === '온라인' ? 'rgba(190,255,111,0.3)' : 'rgba(253,146,156,0.2)',
          }}
        >
          <span
            className="text-[11px] font-semibold"
            style={{ color: meeting.type === '온라인' ? '#81bf54' : '#fd929c' }}
          >
            {meeting.type}
          </span>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="px-5 pt-5">

        {/* 제목 */}
        <h1 className="text-[22px] font-bold text-[#212121] tracking-[-0.5px] leading-snug mb-1">
          {meeting.title}
        </h1>
        <p className="text-[13px] text-[#9a9a9a] mb-5">{meeting.category}</p>

        {/* 정보 카드 */}
        <div className="bg-[#fafafa] rounded-[16px] px-4 py-4 flex flex-col gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fff0ee] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#F72E00" strokeWidth="1.8"/>
                <path d="M3 9h18M8 2v4M16 2v4" stroke="#F72E00" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="text-[12px] text-[#9a9a9a]">날짜 및 시간</p>
              <p className="text-[14px] font-semibold text-[#212121]">{meeting.date} {meeting.time}</p>
            </div>
          </div>
          <div className="h-px bg-[#f0f0f0]" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fff0ee] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#F72E00"/>
              </svg>
            </div>
            <div>
              <p className="text-[12px] text-[#9a9a9a]">장소</p>
              <p className="text-[14px] font-semibold text-[#212121]">{meeting.location}</p>
            </div>
          </div>
          <div className="h-px bg-[#f0f0f0]" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#fff0ee] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#F72E00"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-[#9a9a9a]">참여 현황</p>
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-semibold text-[#212121]">{meeting.currentCount} / {meeting.maxCount}명</p>
                <span className="text-[12px] font-semibold" style={{ color: '#F72E00' }}>{ratio}%</span>
              </div>
              <div className="mt-1.5 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${ratio}%`, background: '#F72E00' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 호스트 */}
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-white text-[16px] font-bold shrink-0"
            style={{ background: meeting.hostAvatar }}
          >
            {meeting.host[0]}
          </div>
          <div>
            <p className="text-[12px] text-[#9a9a9a]">호스트</p>
            <p className="text-[15px] font-semibold text-[#212121]">{meeting.host}</p>
          </div>
        </div>

        <div className="h-px bg-[#f0f0f0] mb-5" />

        {/* 모임 소개 */}
        <div className="mb-5">
          <p className="text-[16px] font-bold text-[#212121] mb-2">모임 소개</p>
          <p className="text-[14px] text-[#555] leading-relaxed">{meeting.description}</p>
        </div>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2">
          {meeting.tags.map(tag => (
            <span
              key={tag}
              className="h-[30px] px-3 rounded-full text-[12px] font-medium flex items-center"
              style={{ background: '#fff0ee', color: '#F72E00' }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 하단 참여 버튼 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-[#f0f0f0] px-5 py-4 z-20">
        <button
          className="w-full h-[52px] rounded-[14px] flex items-center justify-center active:opacity-80"
          style={{ background: '#F72E00' }}
        >
          <span className="text-[16px] font-bold text-white">모임 참여하기</span>
        </button>
      </div>
    </div>
  )
}
