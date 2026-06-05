'use client'
import { useState } from 'react'
import { MoreHorizontal, Heart, Bookmark, Bell } from 'lucide-react'
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

function SiljangoIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2H10C6.229 2 4.343 2 3.172 3.172C2.001 4.344 2 6.229 2 10V12C2 15.771 2 17.657 3.172 18.828C3.47877 19.133 3.84597 19.3704 4.25 19.525V22C4.25 22.1989 4.32902 22.3897 4.46967 22.5303C4.61032 22.671 4.80109 22.75 5 22.75C5.19891 22.75 5.38968 22.671 5.53033 22.5303C5.67098 22.3897 5.75 22.1989 5.75 22V19.871C6.82 20 8.194 20 10 20H12V2ZM9 8.25C9.19891 8.25 9.38968 8.32902 9.53033 8.46967C9.67098 8.61032 9.75 8.80109 9.75 9V13C9.75 13.1989 9.67098 13.3897 9.53033 13.5303C9.38968 13.671 9.19891 13.75 9 13.75C8.80109 13.75 8.61032 13.671 8.46967 13.5303C8.32902 13.3897 8.25 13.1989 8.25 13V9C8.25 8.80109 8.32902 8.61032 8.46967 8.46967C8.61032 8.32902 8.80109 8.25 9 8.25Z" fill="#FF552E"/>
      <path opacity="0.5" d="M14 20H12V2H14C17.771 2 19.657 2 20.828 3.172C21.999 4.344 22 6.229 22 10V12C22 15.771 22 17.657 20.828 18.828C20.5212 19.133 20.154 19.3704 19.75 19.525V22C19.75 22.1989 19.671 22.3897 19.5303 22.5303C19.3897 22.671 19.1989 22.75 19 22.75C18.8011 22.75 18.6103 22.671 18.4697 22.5303C18.329 22.3897 18.25 22.1989 18.25 22V19.871C17.18 20 15.806 20 14 20Z" fill="#FFAB95"/>
      <path d="M15.75 9C15.75 8.80109 15.671 8.61032 15.5303 8.46967C15.3897 8.32902 15.1989 8.25 15 8.25C14.8011 8.25 14.6103 8.32902 14.4697 8.46967C14.329 8.61032 14.25 8.80109 14.25 9V13C14.25 13.1989 14.329 13.3897 14.4697 13.5303C14.6103 13.671 14.8011 13.75 15 13.75C15.1989 13.75 15.3897 13.671 15.5303 13.5303C15.671 13.3897 15.75 13.1989 15.75 13V9Z" fill="#FF552E"/>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.94 2C7.356 2 7.693 2.324 7.693 2.724V4.184C8.361 4.172 9.11 4.172 9.953 4.172H13.968C14.81 4.172 15.559 4.172 16.227 4.185V2.725C16.227 2.325 16.564 2 16.98 2C17.396 2 17.733 2.324 17.733 2.724V4.25C19.178 4.361 20.127 4.634 20.823 5.305C21.521 5.975 21.805 6.887 21.92 8.277L22 9H2V8.276C2.116 6.886 2.4 5.974 3.097 5.304C3.794 4.634 4.742 4.36 6.187 4.249V2.724C6.187 2.324 6.524 2 6.94 2Z" fill="#FF552E"/>
      <path opacity="0.5" d="M22.0003 14V12C22.0003 11.161 21.9963 9.665 21.9833 9H2.0103C1.9973 9.665 2.0003 11.161 2.0003 12V14C2.0003 17.771 2.0003 19.657 3.1723 20.828C4.3443 21.999 6.2283 22 10.0003 22H14.0003C17.7703 22 19.6563 22 20.8283 20.828C22.0003 19.656 22.0003 17.772 22.0003 14Z" fill="#FFAB95"/>
      <path d="M18 17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18C16.7348 18 16.4804 17.8946 16.2929 17.7071C16.1054 17.5196 16 17.2652 16 17C16 16.7348 16.1054 16.4804 16.2929 16.2929C16.4804 16.1054 16.7348 16 17 16C17.2652 16 17.5196 16.1054 17.7071 16.2929C17.8946 16.4804 18 16.7348 18 17ZM18 13C18 13.2652 17.8946 13.5196 17.7071 13.7071C17.5196 13.8946 17.2652 14 17 14C16.7348 14 16.4804 13.8946 16.2929 13.7071C16.1054 13.5196 16 13.2652 16 13C16 12.7348 16.1054 12.4804 16.2929 12.2929C16.4804 12.1054 16.7348 12 17 12C17.2652 12 17.5196 12.1054 17.7071 12.2929C17.8946 12.4804 18 12.7348 18 13ZM13 17C13 17.2652 12.8946 17.5196 12.7071 17.7071C12.5196 17.8946 12.2652 18 12 18C11.7348 18 11.4804 17.8946 11.2929 17.7071C11.1054 17.5196 11 17.2652 11 17C11 16.7348 11.1054 16.4804 11.2929 16.2929C11.4804 16.1054 11.7348 16 12 16C12.2652 16 12.5196 16.1054 12.7071 16.2929C12.8946 16.4804 13 16.7348 13 17ZM13 13C13 13.2652 12.8946 13.5196 12.7071 13.7071C12.5196 13.8946 12.2652 14 12 14C11.7348 14 11.4804 13.8946 11.2929 13.7071C11.1054 13.5196 11 13.2652 11 13C11 12.7348 11.1054 12.4804 11.2929 12.2929C11.4804 12.1054 11.7348 12 12 12C12.2652 12 12.5196 12.1054 12.7071 12.2929C12.8946 12.4804 13 12.7348 13 13ZM8 17C8 17.2652 7.89464 17.5196 7.70711 17.7071C7.51957 17.8946 7.26522 18 7 18C6.73478 18 6.48043 17.8946 6.29289 17.7071C6.10536 17.5196 6 17.2652 6 17C6 16.7348 6.10536 16.4804 6.29289 16.2929C6.48043 16.1054 6.73478 16 7 16C7.26522 16 7.51957 16.1054 7.70711 16.2929C7.89464 16.4804 8 16.7348 8 17ZM8 13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13C6 12.7348 6.10536 12.4804 6.29289 12.2929C6.48043 12.1054 6.73478 12 7 12C7.26522 12 7.51957 12.1054 7.70711 12.2929C7.89464 12.4804 8 12.7348 8 13Z" fill="#FF552E"/>
    </svg>
  )
}

const ACTION_ITEMS = [
  { label: '좋아요',    icon: <Heart size={24} fill="#F72E00" className="text-[#F72E00]" /> },
  { label: '저장',      icon: <Bookmark size={24} fill="#FF8C5A" className="text-[#FF8C5A]" /> },
  { label: '실장고',    icon: <SiljangoIcon /> },
  { label: '함뜨 일정', icon: <CalendarIcon /> },
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
