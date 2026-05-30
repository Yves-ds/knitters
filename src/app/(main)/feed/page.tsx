'use client'
import { useState } from 'react'
import Link from 'next/link'
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
  const [guideTab, setGuideTab] = useState('전체')
  const [savedGuides, setSavedGuides] = useState<Record<number, boolean>>({ 2: true })
  const currentProject = mockProjects[0]

  const toggleSave = (id: number) =>
    setSavedGuides(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="relative bg-[#fafafa] min-h-screen pb-24 overflow-x-hidden">
      {/* 장식 타원 */}
      <div className="pointer-events-none absolute left-[-17px] top-[45px] w-[267px] h-[267px] rounded-full bg-[#ffd6cc] opacity-70 blur-[60px]" />
      <div className="pointer-events-none absolute left-[calc(50%-50px)] top-[135px] w-[244px] h-[244px] rounded-full bg-[#fecec4] opacity-50 blur-[70px]" />

      {/* 헤더 */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-14 pb-3">
        <span
          className="text-[28px] text-[#f72e00] not-italic leading-normal"
          style={{ fontFamily: "'Rubik Bubbles', cursive" }}
        >
          Knitters
        </span>
        <div className="flex items-center gap-2">
          {/* 메시지 아이콘 */}
          <button className="w-6 h-6 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#333" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </button>
          {/* 알림 아이콘 */}
          <button className="w-6 h-6 flex items-center justify-center relative">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z" fill="#111827"/>
              <path d="M12 3C12 3 7 5 7 12V16L5 18V19H19V18L17 16V12C17 5 12 3 12 3Z" stroke="#111827" strokeWidth="1.8" strokeLinejoin="round" fill="none"/>
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#f72e00] rounded-full border border-white" />
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
  )
}
