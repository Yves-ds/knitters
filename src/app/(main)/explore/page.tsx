'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function HeartIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="24" height="24" viewBox="0 0 18 19" fill="none">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#FBB4A4"/>
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="10.5" cy="10.5" r="5.5" stroke="#FFAF9D" strokeWidth="2"/>
      <path d="M15 15L19 19" stroke="#FFAF9D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.1268 17.1C9.9746 17.4168 9.90526 17.7671 9.92524 18.118C9.94521 18.4689 10.0539 18.809 10.241 19.1065C10.4282 19.404 10.6877 19.6492 10.9954 19.8192C11.3031 19.9891 11.6488 20.0783 12.0003 20.0783C12.3518 20.0783 12.6975 19.9891 13.0052 19.8192C13.3128 19.6492 13.5724 19.404 13.7595 19.1065C13.9467 18.809 14.0553 18.4689 14.0753 18.118C14.0953 17.7671 14.026 17.4168 13.8738 17.1H10.1268Z" fill="#F72E00"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.8883 5.1C10.6154 5.10003 9.39456 5.60571 8.49442 6.5058L8.30602 6.6942C7.40593 7.59434 6.90025 8.81515 6.90022 10.0881V10.9698C6.90022 12.5898 6.25672 14.1438 5.11072 15.2898C4.96246 15.4381 4.86151 15.6271 4.82064 15.8328C4.77976 16.0385 4.80078 16.2517 4.88106 16.4454C4.96133 16.6392 5.09724 16.8048 5.27162 16.9213C5.446 17.0378 5.651 17.1 5.86072 17.1H18.1397C18.3495 17.1 18.5546 17.0379 18.729 16.9213C18.9035 16.8048 19.0394 16.6392 19.1197 16.4454C19.2 16.2516 19.221 16.0383 19.1801 15.8325C19.1391 15.6268 19.0381 15.4378 18.8897 15.2895C18.3223 14.7222 17.8723 14.0488 17.5652 13.3075C17.2582 12.5663 17.1002 11.7718 17.1002 10.9695V10.0881C17.1002 8.81515 16.5945 7.59434 15.6944 6.6942L15.506 6.5058C14.6059 5.60571 13.3851 5.10003 12.1121 5.1H11.8883Z" fill="#FBB4A4"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.6004 5.1249V4.2C12.6004 4.04087 12.5372 3.88826 12.4247 3.77573C12.3121 3.66321 12.1595 3.6 12.0004 3.6C11.8413 3.6 11.6886 3.66321 11.5761 3.77573C11.4636 3.88826 11.4004 4.04087 11.4004 4.2V5.1249C11.5626 5.10832 11.7255 5.1 11.8885 5.1H12.1123C12.2763 5.1 12.439 5.1083 12.6004 5.1249Z" fill="#FC6744"/>
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#6f6f6f"/>
    </svg>
  )
}

function PersonIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="#9a9a9a"/>
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
      <path d="M2 1.5L5 4L2 6.5" stroke="#f72e00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

const CATEGORIES = [
  { label: '온라인 모임' },
  { label: '오프라인 모임' },
  { label: '주말 모임' },
  { label: '평일 모임' },
  { label: '소규모 모임' },
  { label: '대규모 모임' },
  { label: '동네 모임' },
  { label: '뜨개 원데이' },
]

const RECOMMENDED = [
  {
    id: 1,
    title: '자기 전 힐링 뜨개',
    type: '온라인',
    location: '마포구',
    date: '11/19 (화) 오후 8:00',
    participants: '10명 참여',
    liked: false,
  },
  {
    id: 2,
    title: '요뜨: 뜨개 요가',
    type: '오프라인',
    location: '성북구',
    date: '11/19 (화) 오후 8:00',
    participants: '3자리 남음 · 진행 확정',
    liked: false,
  },
]

const DAYS = [
  { date: 16, day: '일' },
  { date: 17, day: '월' },
  { date: 18, day: '화' },
  { date: 19, day: '수' },
  { date: 20, day: '목' },
  { date: 21, day: '금' },
  { date: 22, day: '토' },
]

const DAY_MEETINGS = [
  {
    id: 1,
    title: 'CGV 뜨개 상영회',
    type: '오프라인',
    location: '마포구',
    time: '오늘 17:00',
    participants: '25명 참석중',
  },
  {
    id: 2,
    title: '차와 함께 뜨뜨 🍵 + 🧶',
    type: '오프라인',
    location: '종로구',
    time: '오늘 14:00',
    participants: '3자리 남음',
  },
]

export default function ExplorePage() {
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState(0)
  const [likes, setLikes] = useState<Record<number, boolean>>({})
  const [carouselPage, setCarouselPage] = useState(0)

  const toggleLike = (id: number) =>
    setLikes(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto overflow-x-hidden">

      {/* 헤더 */}
      <div className="bg-white px-4 pt-14 pb-3 flex items-center justify-between sticky top-0 z-10">
        <span className="text-[20px] font-bold tracking-[-0.6px]" style={{ color: '#313131' }}>함뜨해요</span>
        <div className="flex items-center gap-2">
          <button><SearchIcon /></button>
          <button onClick={() => router.push('/notifications')}><BellIcon /></button>
        </div>
      </div>

      {/* 히어로 캐러셀 */}
      <div className="bg-white pt-3 pb-4">
        <div
          className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory px-[42px] gap-3"
          onScroll={e => {
            const el = e.currentTarget
            setCarouselPage(Math.round(el.scrollLeft / (el.clientWidth - 84)))
          }}
        >
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="shrink-0 w-[308px] h-[292px] bg-[#d9d9d9] rounded-[10px] snap-center" />
          ))}
        </div>
        <div className="flex items-center justify-center gap-[6px] mt-3">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-[2px] rounded-[10px] transition-all duration-300"
              style={{ width: 17, background: i === carouselPage ? '#f72e00' : '#ead2cc' }}
            />
          ))}
        </div>
      </div>

      {/* 카테고리 */}
      <div className="bg-white pt-5 pb-5 px-4">
        <div className="grid grid-cols-4 gap-y-4">
          {CATEGORIES.map(cat => (
            <button key={cat.label} className="flex flex-col items-center gap-2">
              <div className="w-[40px] h-[40px] bg-[#d9d9d9] rounded-[12px]" />
              <span className="text-[12px] font-medium text-[#6f6f6f] tracking-[-0.24px] leading-[1.4] text-center">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-2 bg-[#f5f5f5]" />

      {/* 추천 함뜨 */}
      <div className="bg-white pt-5 px-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <p className="text-[20px] font-semibold text-[#2d2b2a] tracking-[-0.6px] leading-[1.31]">추천 함뜨</p>
            <p className="text-[12px] font-medium text-[#6b6b6b] tracking-[-0.24px] leading-[1.4] mt-[2px]">니터즈를 대표하는 호스트와 함께</p>
          </div>
          <button className="text-[12px] font-medium text-[#b1b1b1] tracking-[-0.24px]">전체보기</button>
        </div>

        <div className="flex flex-col gap-3 mt-4 pb-4">
          {RECOMMENDED.map(item => (
            <div key={item.id} className="bg-[#fff0ed] rounded-[10px] h-[127px] relative flex items-stretch overflow-hidden">
              {/* 이미지 영역 */}
              <div className="w-[106px] shrink-0 bg-[#d9d9d9] rounded-l-[10px]" />
              {/* 정보 영역 */}
              <div className="flex-1 px-3 pt-3 pb-3 flex flex-col justify-between">
                {/* 배지 + 하트 */}
                <div className="flex items-center justify-between">
                  <div
                    className="h-[23px] px-3 rounded-full flex items-center"
                    style={{
                      background: item.type === '온라인' ? 'rgba(190,255,111,0.3)' : 'rgba(253,146,156,0.2)',
                    }}
                  >
                    <span
                      className="text-[10px] font-medium tracking-[-0.2px]"
                      style={{ color: item.type === '온라인' ? '#81bf54' : '#fd929c' }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <button onClick={() => toggleLike(item.id)}>
                    <HeartIcon active={likes[item.id] ?? false} />
                  </button>
                </div>
                {/* 제목 */}
                <p className="text-[16px] font-semibold text-black tracking-[-0.32px] leading-[1.4]">{item.title}</p>
                {/* 위치 */}
                <div className="flex items-center gap-1">
                  <LocationIcon />
                  <span className="text-[13px] font-medium text-[#6f6f6f] tracking-[-0.26px]">{item.location} · {item.date}</span>
                </div>
                {/* 참여 */}
                <div className="flex items-center gap-1">
                  <PersonIcon />
                  <span className="text-[13px] font-medium text-[#9a9a9a] tracking-[-0.26px]">{item.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 더보기 버튼 */}
        <button className="w-full h-[52px] bg-[#ffccc1] rounded-[10px] flex items-center justify-center gap-[4px] mb-5">
          <span className="text-[16px] font-semibold text-[#f72e00] tracking-[-0.32px]">추천 함뜨 더보기</span>
          <ChevronIcon />
        </button>
      </div>

      <div className="h-2 bg-[#f5f5f5]" />

      {/* 요일별 함뜨 */}
      <div className="bg-white pt-5 px-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[20px] font-semibold text-[#2d2b2a] tracking-[-0.6px] leading-[1.31]">요일별 함뜨</p>
            <p className="text-[12px] font-medium text-[#6b6b6b] tracking-[-0.24px] leading-[1.4] mt-[2px]">내가 원하는 요일에 가능한 함뜨</p>
          </div>
          <button className="text-[12px] font-medium text-[#b1b1b1] tracking-[-0.24px]">전체보기</button>
        </div>

        {/* 날짜 선택 */}
        <div className="flex gap-[6px] mb-5">
          {DAYS.map((d, i) => (
            <button
              key={d.date}
              onClick={() => setSelectedDay(i)}
              className="flex-1 h-[52px] rounded-[20px] flex flex-col items-center justify-center gap-[2px]"
              style={{ background: i === selectedDay ? '#f72e00' : '#f2f2f2' }}
            >
              <span
                className="text-[16px] font-semibold tracking-[-0.32px] leading-[1.4]"
                style={{ color: i === selectedDay ? '#f7f7f7' : '#8d8d8d' }}
              >
                {d.date}
              </span>
              <span
                className="text-[11px] font-medium tracking-[-0.22px] leading-[1.4]"
                style={{ color: i === selectedDay ? '#f7f7f7' : '#acacac' }}
              >
                {d.day}
              </span>
            </button>
          ))}
        </div>

        {/* 요일별 모임 목록 */}
        <div className="flex flex-col pb-4">
          {DAY_MEETINGS.map((item, idx) => (
            <div key={item.id}>
              <div className="flex items-stretch gap-3 py-3">
                {/* 정보 */}
                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div
                    className="self-start h-[21px] px-3 rounded-full flex items-center"
                    style={{ background: 'rgba(253,146,156,0.2)' }}
                  >
                    <span className="text-[10px] font-medium text-[#fd929c] tracking-[-0.2px]">{item.type}</span>
                  </div>
                  <p className="text-[16px] font-semibold text-black tracking-[-0.32px] leading-[1.4]">{item.title}</p>
                  <span className="text-[13px] font-medium text-[#6f6f6f] tracking-[-0.26px]">{item.location} · {item.time} · {item.participants}</span>
                </div>
                {/* 이미지 */}
                <div className="w-[84px] shrink-0 bg-[#d9d9d9] rounded-[10px]" />
              </div>
              {idx < DAY_MEETINGS.length - 1 && (
                <div className="h-px bg-[#f0f0f0]" />
              )}
            </div>
          ))}
        </div>

        <button className="w-full h-[52px] bg-[#ffccc1] rounded-[10px] flex items-center justify-center gap-[4px] mb-5">
          <span className="text-[16px] font-semibold text-[#f72e00] tracking-[-0.32px]">더보기</span>
          <ChevronIcon />
        </button>
      </div>

      <div className="h-2 bg-[#f5f5f5]" />

      {/* 함뜨 인기 플레이스 */}
      <div className="bg-white pt-5 px-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[20px] font-semibold text-[#2d2b2a] tracking-[-0.6px] leading-[1.31]">함뜨 인기 플레이스</p>
            <p className="text-[12px] font-medium text-[#6b6b6b] tracking-[-0.24px] leading-[1.4] mt-[2px]">내가 원하는 요일에 가능한 함뜨</p>
          </div>
          <button className="text-[12px] font-medium text-[#b1b1b1] tracking-[-0.24px]">전체보기</button>
        </div>
        <div className="flex gap-3 pb-5">
          <div className="flex-1 h-[206px] bg-[#d9d9d9] rounded-[10px]" />
          <div className="flex-1 h-[206px] bg-[#d9d9d9] rounded-[10px]" />
        </div>
      </div>

      <div className="h-2 bg-[#f5f5f5]" />

      {/* 원하는 모임이 없나요? */}
      <div className="bg-white pt-5 px-4 pb-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[20px] font-semibold text-[#2d2b2a] tracking-[-0.6px] leading-[1.31]">원하는 모임이 없나요?</p>
            <p className="text-[12px] font-medium text-[#6b6b6b] tracking-[-0.24px] leading-[1.4] mt-[2px]">원하는 모임을 직접 만들어보세요</p>
          </div>
          <button className="text-[12px] font-medium text-[#b1b1b1] tracking-[-0.24px]">전체보기</button>
        </div>
        <div className="bg-[#f72e00] rounded-[10px] h-[101px] px-5 flex flex-col justify-center gap-2 relative overflow-hidden">
          <p className="text-[#f9f9f9] text-[16px] font-bold tracking-[-0.32px] leading-[1.54]">
            관심사에 맞는 모임을 직접{'\n'}만들어 보는 건 어때요?
          </p>
          <div className="self-start">
            <div className="bg-[#ffccc1] rounded-[20px] h-[29px] px-4 flex items-center gap-1">
              <span className="text-[#f72e00] text-[12px] font-medium tracking-[-0.24px]">나만의 함뜨 모임 만들기</span>
              <ChevronIcon />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
