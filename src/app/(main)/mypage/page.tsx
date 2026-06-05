'use client'
import { useState } from 'react'
import { MoreHorizontal, Heart, Bookmark, Package, CalendarDays, Bell } from 'lucide-react'
import { mockProjects } from '@/lib/mockData'
import Link from 'next/link'

const ME = {
  name: '이브방',
  username: 'yves_knit',
  bio: '안녕하세요 대바늘 러버입니다.\n출퇴근길 프로 뜨개러의 기록장 ◡‿◡ *',
  followers: 22,
  following: 40,
}

const TABS = ['피드', '태그', '게시글'] as const
type Tab = typeof TABS[number]

const ACTION_ITEMS = [
  { label: '좋아요',   icon: <Heart    size={24} fill="#F72E00" className="text-[#F72E00]" /> },
  { label: '저장',     icon: <Bookmark size={24} fill="#FF8C5A" className="text-[#FF8C5A]" /> },
  { label: '실장고',   icon: <Package  size={24} className="text-[#FF8C5A]" /> },
  { label: '함뜨 일정', icon: <CalendarDays size={24} className="text-[#F72E00]" /> },
]

export default function MyPage() {
  const [tab, setTab] = useState<Tab>('피드')
  const projectCount = mockProjects.length

  return (
    <div className="min-h-screen bg-white pb-28">

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <h1 className="text-[22px] font-bold text-[#212121]">마이페이지</h1>
        <button className="w-8 h-8 flex items-center justify-center">
          <MoreHorizontal size={22} className="text-[#212121]" />
        </button>
      </div>

      {/* 프로필 카드 */}
      <div className="mx-4 mb-4 bg-[#feeae5] rounded-[16px] px-4 pt-5 pb-5">
        {/* 아바타 + 이름 + 통계 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#f4c8b0] to-[#e88060] flex items-center justify-center text-3xl shrink-0 overflow-hidden border-2 border-white shadow-sm">
            🧶
          </div>
          <div className="flex-1">
            <p className="text-[18px] font-bold text-[#212121] mb-2">{ME.name}</p>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#212121] leading-none">{projectCount}</p>
                <p className="text-[12px] text-[#9e9e9e] mt-0.5">프로젝트</p>
              </div>
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#212121] leading-none">{ME.followers}</p>
                <p className="text-[12px] text-[#9e9e9e] mt-0.5">팔로워</p>
              </div>
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#212121] leading-none">{ME.following}</p>
                <p className="text-[12px] text-[#9e9e9e] mt-0.5">팔로잉</p>
              </div>
            </div>
          </div>
        </div>

        {/* 바이오 */}
        <p className="text-[13px] text-[#565656] leading-relaxed mb-4 whitespace-pre-line">{ME.bio}</p>

        {/* 구분선 */}
        <div className="h-px bg-[#f5c9bc] mb-4" />

        {/* 액션 아이콘 4개 */}
        <div className="flex items-stretch">
          {ACTION_ITEMS.map((item, i) => (
            <div key={item.label} className="flex items-stretch flex-1">
              {i > 0 && <div className="w-px bg-[#f5c9bc] self-stretch" />}
              <button className="flex-1 flex flex-col items-center gap-1.5 py-1">
                {item.icon}
                <span className="text-[11px] text-[#9e9e9e] font-medium">{item.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 탭 */}
      <div className="border-b border-[#f0f0f0]">
        <div className="flex">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-3 text-[14px] font-semibold transition-colors"
              style={{
                color: tab === t ? '#F72E00' : '#a7a7a7',
                borderBottom: tab === t ? '2px solid #F72E00' : '2px solid transparent',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {tab === '피드' && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Bell size={48} className="text-[#d0d0d0]" strokeWidth={1.5} />
          <p className="text-[17px] font-bold text-[#212121] mt-2">아직 공유된 기록이 없어요</p>
          <p className="text-[13px] text-[#a7a7a7]">새로운 뜨개 프로젝트를 기록해 보세요</p>
          <Link
            href="/projects/new"
            className="mt-3 px-6 py-3 bg-[#F72E00] text-white text-[14px] font-semibold rounded-full active:opacity-80 transition-opacity"
          >
            + 기록하기
          </Link>
        </div>
      )}

      {tab === '태그' && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Bell size={48} className="text-[#d0d0d0]" strokeWidth={1.5} />
          <p className="text-[17px] font-bold text-[#212121] mt-2">태그된 게시물이 없어요</p>
          <p className="text-[13px] text-[#a7a7a7]">커뮤니티에서 활동을 시작해보세요</p>
        </div>
      )}

      {tab === '게시글' && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Bell size={48} className="text-[#d0d0d0]" strokeWidth={1.5} />
          <p className="text-[17px] font-bold text-[#212121] mt-2">작성한 게시글이 없어요</p>
          <p className="text-[13px] text-[#a7a7a7]">커뮤니티에 첫 글을 작성해보세요</p>
          <Link
            href="/community/new"
            className="mt-3 px-6 py-3 bg-[#F72E00] text-white text-[14px] font-semibold rounded-full active:opacity-80 transition-opacity"
          >
            글쓰기
          </Link>
        </div>
      )}
    </div>
  )
}
