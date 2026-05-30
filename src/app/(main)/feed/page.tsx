'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { mockProjects } from '@/lib/mockData'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const STREAK = 2

const MAGAZINES = [
  { id: 1, season: '2026 S/S', title: '브랜드별 여름 콘사 모음', bg: 'linear-gradient(to bottom, #e8c4bc, #a06070)' },
  { id: 2, season: '이달의 브랜드', title: '바늘이야기 김대리님 초대석', bg: 'linear-gradient(to bottom, #c4b8e8, #6070a0)' },
]

const GUIDE_TABS = ['전체', '뜨개 기초', '도안', '실']

const GUIDES = [
  { id: 1, title: '해외 영문 도안 단어 정리집', desc: '이제 영문 도안도 어렵지 않아!', saved: false, emoji: '📖' },
  { id: 2, title: '겉뜨기, 안뜨기 마스터하기', desc: '이것만 익혀도 대부분 뜰 수 있어요', saved: true, emoji: '🧶' },
  { id: 3, title: '뜨개 실 고르는 꿀팁!', desc: '다양한 뜨개 실 고르는 기준 딱 알려드려요', saved: false, emoji: '🪡' },
]

export default function FeedPage() {
  const router = useRouter()
  const [guideTab, setGuideTab] = useState('전체')
  const [savedGuides, setSavedGuides] = useState<Record<number, boolean>>({ 2: true })
  const [hasNewNotification, setHasNewNotification] = useState(true)
  const currentProject = mockProjects[0]

  const toggleSave = (id: number) =>
    setSavedGuides(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="relative bg-[#fafafa] min-h-screen pb-24 overflow-x-hidden">
      {/* 장식 타원 — 모든 콘텐츠 아래 배경 레이어 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute left-[-17px] top-[45px] w-[267px] h-[267px] rounded-full bg-[#ffd6cc] opacity-70 blur-[60px]" />
        <div className="absolute left-[calc(50%-50px)] top-[135px] w-[244px] h-[244px] rounded-full bg-[#fecec4] opacity-50 blur-[70px]" />
      </div>

      {/* 콘텐츠 레이어 — 타원 위 */}
      <div className="relative" style={{ zIndex: 1 }}>

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-14 pb-3">
        <span
          className="text-[28px] text-[#f72e00] not-italic leading-normal"
          style={{ fontFamily: "'Rubik Bubbles', cursive" }}
        >
          Knitters
        </span>
        <div className="flex items-center gap-2">
          {/* 메시지 아이콘 */}
          <button className="w-8 h-8 flex items-center justify-center" onClick={() => router.push('/chat')}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.3" d="M12 4C16.4184 4 20 7.5816 20 12C20 16.4184 16.4184 20 12 20H5.6C5.17565 20 4.76869 19.8314 4.46863 19.5314C4.16857 19.2313 4 18.8243 4 18.4V12C4 7.5816 7.5816 4 12 4Z" fill="#F72E00"/>
              <path d="M14.2507 10H9.7501C9.55892 10.0002 9.37503 10.0816 9.23601 10.2274C9.09698 10.3732 9.01333 10.5725 9.00212 10.7845C8.99092 10.9965 9.05301 11.2053 9.17572 11.3682C9.29843 11.5311 9.47249 11.6357 9.66234 11.6608L9.7501 11.6667H14.2507C14.4419 11.6664 14.6258 11.5851 14.7648 11.4393C14.9038 11.2935 14.9875 11.0942 14.9987 10.8822C15.0099 10.6701 14.9478 10.4614 14.8251 10.2985C14.7024 10.1356 14.5283 10.0309 14.3385 10.0058L14.2507 10ZM12.0004 13.3333H9.7501C9.55116 13.3333 9.36037 13.4211 9.2197 13.5774C9.07903 13.7337 9 13.9457 9 14.1667C9 14.3877 9.07903 14.5996 9.2197 14.7559C9.36037 14.9122 9.55116 15 9.7501 15H12.0004C12.1994 15 12.3901 14.9122 12.5308 14.7559C12.6715 14.5996 12.7505 14.3877 12.7505 14.1667C12.7505 13.9457 12.6715 13.7337 12.5308 13.5774C12.3901 13.4211 12.1994 13.3333 12.0004 13.3333Z" fill="#F72E00"/>
            </svg>
          </button>
          {/* 알림 아이콘 */}
          <button className="w-8 h-8 flex items-center justify-center relative" onClick={() => { setHasNewNotification(false); router.push('/notifications') }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M10.1268 17.1C9.9746 17.4168 9.90526 17.7671 9.92524 18.118C9.94521 18.4689 10.0539 18.809 10.241 19.1065C10.4282 19.404 10.6877 19.6492 10.9954 19.8192C11.3031 19.9891 11.6488 20.0783 12.0003 20.0783C12.3518 20.0783 12.6975 19.9891 13.0052 19.8192C13.3128 19.6492 13.5724 19.404 13.7595 19.1065C13.9467 18.809 14.0553 18.4689 14.0753 18.118C14.0953 17.7671 14.026 17.4168 13.8738 17.1H10.1268Z" fill="#F72E00"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11.8883 5.1C10.6154 5.10003 9.39456 5.60571 8.49442 6.5058L8.30602 6.6942C7.40593 7.59434 6.90025 8.81515 6.90022 10.0881V10.9698C6.90022 12.5898 6.25672 14.1438 5.11072 15.2898C4.96246 15.4381 4.86151 15.6271 4.82064 15.8328C4.77976 16.0385 4.80078 16.2517 4.88106 16.4454C4.96133 16.6392 5.09724 16.8048 5.27162 16.9213C5.446 17.0378 5.651 17.1 5.86072 17.1H18.1397C18.3495 17.1 18.5546 17.0379 18.729 16.9213C18.9035 16.8048 19.0394 16.6392 19.1197 16.4454C19.2 16.2516 19.221 16.0383 19.1801 15.8325C19.1391 15.6268 19.0381 15.4378 18.8897 15.2895C18.3223 14.7222 17.8723 14.0488 17.5652 13.3075C17.2582 12.5663 17.1002 11.7718 17.1002 10.9695V10.0881C17.1002 8.81515 16.5945 7.59434 15.6944 6.6942L15.506 6.5058C14.6059 5.60571 13.3851 5.10003 12.1121 5.1H11.8883Z" fill="#FBB4A4"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12.6004 5.1249V4.2C12.6004 4.04087 12.5372 3.88826 12.4247 3.77573C12.3121 3.66321 12.1595 3.6 12.0004 3.6C11.8413 3.6 11.6886 3.66321 11.5761 3.77573C11.4636 3.88826 11.4004 4.04087 11.4004 4.2V5.1249C11.5626 5.10832 11.7255 5.1 11.8885 5.1H12.1123C12.2763 5.1 12.439 5.1083 12.6004 5.1249Z" fill="#FC6744"/>
            </svg>
            {hasNewNotification && <span className="absolute top-0 right-0 w-2 h-2 bg-[#f72e00] rounded-full border border-white" />}
          </button>
        </div>
      </div>

      {/* 인사말 */}
      <div className="relative z-10 px-4 mb-5">
        <p className="text-[#565656] text-[18px] tracking-[-0.54px] leading-[1.31]">안녕하세요, 익명의 니터님</p>
        <p className="text-[#212121] text-[20px] font-bold tracking-[-0.6px] leading-[1.31]">오늘의 뜨개를 시작해볼까요?</p>
      </div>

      {/* 진행 중 프로젝트 카드 */}
      <Link href={currentProject ? `/projects/${currentProject.id}` : '/projects'}>
        <div className="mx-4 mb-3 bg-white rounded-[10px] shadow-[4px_4px_8px_4px_rgba(0,0,0,0.04)] px-4 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[#212121] text-[14px] font-bold tracking-[-0.42px] mb-2 truncate">
              {currentProject?.title ?? '캔디 헨리넥 스웨터'}
            </p>
            <div className="flex items-center gap-3">
              <span className="bg-[#e8f2ff] text-[#148fff] text-[10px] font-semibold px-2.5 py-[3px] rounded-[10px] tracking-[-0.3px] whitespace-nowrap">
                진행 중
              </span>
              <span className="text-[#949494] text-[12px] font-semibold tracking-[0.36px]">00:00:00</span>
            </div>
          </div>
          <div className="w-[53px] h-[53px] rounded-[10px] bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center shrink-0">
            <span className="text-2xl">🧶</span>
          </div>
        </div>
      </Link>

      {/* 연속 뜨개 카드 */}
      <div className="mx-4 mb-6 bg-white rounded-[10px] shadow-[4px_4px_8px_4px_rgba(0,0,0,0.04)] px-4 py-4 flex items-center gap-3">
        <span className="text-[20px] shrink-0">🧶</span>
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[#212121] text-[20px] font-bold tracking-[-0.6px]">{STREAK}</span>
            <span className="text-[#5e5d5d] text-[12px] font-medium tracking-[-0.36px]">일 연속 뜨개 중</span>
          </div>
          <div className="flex gap-[6px]">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold"
                style={{
                  background: i < STREAK ? '#f72e00' : '#ededed',
                  color: i < STREAK ? '#ffefeb' : '#b8b8b8',
                }}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="shrink-0">
          <path d="M1 1l6 6-6 6" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* 니터즈 매거진 */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <p className="text-[#212121] text-[18px] font-bold tracking-[-0.54px]">니터즈 매거진</p>
        <Link href="/explore" className="text-[#a7a7a7] text-[14px] font-medium tracking-[-0.42px]">더보기</Link>
      </div>
      <div className="px-4 mb-6 grid grid-cols-2 gap-3">
        {MAGAZINES.map(mag => (
          <div key={mag.id} className="relative h-[237px] rounded-[10px] overflow-hidden" style={{ background: mag.bg }}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgba(9,2,0,0.6)]" />
            <div className="absolute bottom-4 left-4 right-2">
              <p className="text-[#fafafa] text-[12px] font-medium tracking-[-0.36px]">{mag.season}</p>
              <p className="text-[#fafafa] text-[12px] font-bold tracking-[-0.36px] leading-snug">{mag.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 뜨개 가이드 */}
      <div className="px-4 mb-3">
        <p className="text-[#212121] text-[18px] font-bold tracking-[-0.54px]">뜨개 가이드</p>
      </div>
      {/* 필터 탭 */}
      <div className="px-4 mb-1 flex gap-2 overflow-x-auto">
        {GUIDE_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setGuideTab(tab)}
            className="h-[30px] px-[10px] rounded-[10px] text-[12px] font-medium tracking-[-0.36px] whitespace-nowrap shrink-0 transition-colors"
            style={{
              background: guideTab === tab ? '#feeae5' : '#ededed',
              color: guideTab === tab ? '#f72e00' : '#141414',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      {/* 가이드 목록 */}
      <div className="px-4">
        {GUIDES.map((guide, i) => (
          <div key={guide.id}>
            <div className="flex items-center gap-4 py-4">
              <div className="w-[74px] h-[74px] rounded-[10px] bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center shrink-0">
                <span className="text-3xl">{guide.emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] text-black font-medium tracking-[-0.48px] mb-1 leading-snug">{guide.title}</p>
                <p className="text-[#848484] text-[12px] font-medium tracking-[-0.36px] leading-snug">{guide.desc}</p>
              </div>
              <button onClick={() => toggleSave(guide.id)} className="shrink-0 p-1">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={savedGuides[guide.id] ? '#f72e00' : 'none'}>
                  <path d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z"
                    stroke={savedGuides[guide.id] ? '#f72e00' : '#c8c8c8'}
                    strokeWidth="1.6" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            {i < GUIDES.length - 1 && <div className="h-px bg-[#efefef]" />}
          </div>
        ))}
      </div>

      {/* 뜨개 가이드 더보기 버튼 */}
      <div className="px-4 mt-2 mb-4">
        <button className="w-full bg-[#f72e00] text-[#fff2ef] font-semibold text-[14px] tracking-[-0.42px] py-5 rounded-[10px] active:opacity-80 transition-opacity">
          뜨개 가이드 더보기
        </button>
      </div>
      </div>
    </div>
  )
}
