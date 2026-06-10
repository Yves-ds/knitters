'use client'
import Link from 'next/link'
import { useProjectStore } from '@/store/projectStore'

const ME = {
  name: '이브방',
  username: 'yves_knit',
  bio: '대바늘 러버 · 출퇴근길 프로 뜨개러의 기록장',
  followers: 22,
  following: 40,
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke="#2A0B04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
        stroke="#2A0B04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const QUICK_MENU = [
  {
    emoji: '❤️',
    label: '좋아요',
    desc: '도안·실·바늘·브랜드',
    href: '/mypage/settings',
  },
  {
    emoji: '📝',
    label: '내 활동',
    desc: '게시글·댓글',
    href: '/mypage/settings',
  },
  {
    emoji: '🧺',
    label: '니팅박스',
    desc: '실·바늘 모음',
    href: '/mypage/settings',
  },
]

export default function MyPage() {
  const { projects } = useProjectStore()
  const displayProjects = projects.slice(0, 4)
  const hasMore = projects.length > 4

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28">

      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4 bg-white">
        <h1 className="text-[22px] font-bold text-[#2A0B04]">마이 페이지</h1>
        <Link href="/mypage/settings" className="w-8 h-8 flex items-center justify-center">
          <SettingsIcon />
        </Link>
      </div>

      {/* 프로필 카드 */}
      <div className="mx-4 mt-4 mb-4 bg-[#feeae5] rounded-[16px] px-4 pt-5 pb-5">
        {/* 아바타 + 이름 + 통계 */}
        <div className="flex items-center gap-4 mb-3">
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[#f4c8b0] to-[#e88060] flex items-center justify-center text-3xl shrink-0 overflow-hidden border-2 border-white shadow-sm">
            🧶
          </div>
          <div className="flex-1">
            <p className="text-[18px] font-bold text-[#212121] mb-2">{ME.name}</p>
            <div className="flex items-center gap-5">
              <div className="text-center">
                <p className="text-[16px] font-bold text-[#212121] leading-none">{projects.length}</p>
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

        {/* 한 줄 소개 */}
        <p className="text-[13px] text-[#565656] leading-relaxed mb-4">{ME.bio}</p>

        {/* 프로필 수정 버튼 */}
        <Link
          href="/mypage/edit"
          className="flex items-center justify-center h-9 rounded-[10px] bg-white/70 text-[13px] font-semibold text-[#2A0B04] active:opacity-70"
        >
          프로필 수정
        </Link>
      </div>

      {/* 퀵 메뉴 */}
      <div className="mx-4 mb-4 grid grid-cols-3 gap-3">
        {QUICK_MENU.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="bg-white rounded-[14px] px-3 py-4 flex flex-col items-center gap-1.5 active:opacity-70"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
          >
            <span className="text-[28px] leading-none">{item.emoji}</span>
            <p className="text-[13px] font-bold text-[#2A0B04]">{item.label}</p>
            <p className="text-[11px] text-[#9A9A9A] text-center leading-tight">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* 프로젝트 기록 */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-[#2A0B04]">프로젝트 기록</span>
            <span className="text-[14px] text-[#9A9A9A]">{projects.length}</span>
          </div>
          <Link href="/projects" className="flex items-center gap-0.5 text-[13px] text-[#9A9A9A] active:opacity-60">
            더보기 <ChevronRightIcon />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="mx-4 bg-white rounded-[14px] py-10 flex flex-col items-center gap-2"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <span className="text-[32px]">🧶</span>
            <p className="text-[14px] text-[#9A9A9A]">아직 기록된 프로젝트가 없어요</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-none px-4">
            {displayProjects.map(project => (
              <Link key={project.id} href={`/projects/${project.id}`} className="shrink-0 w-[110px]">
                <div
                  className="w-[110px] h-[110px] rounded-[12px] flex items-center justify-center text-4xl overflow-hidden mb-2"
                  style={{ background: '#f0ede8' }}
                >
                  {project.coverPhoto
                    ? <img src={project.coverPhoto} alt={project.title} className="w-full h-full object-cover" />
                    : project.emoji ?? '🧶'
                  }
                </div>
                <p className="text-[12px] font-semibold text-[#2A0B04] leading-snug line-clamp-2">
                  {project.title}
                </p>
              </Link>
            ))}

            {/* 4개 초과 시 '...' 카드 */}
            {hasMore && (
              <Link href="/projects" className="shrink-0 w-[110px]">
                <div className="w-[110px] h-[110px] rounded-[12px] bg-[#F0F0F0] flex items-center justify-center mb-2">
                  <span className="text-[22px] font-bold text-[#9A9A9A]">···</span>
                </div>
                <p className="text-[12px] text-[#9A9A9A] text-center">
                  +{projects.length - 4}개 더보기
                </p>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* 활동 배지 */}
      <div className="mx-4">
        <Link
          href="/mypage/settings"
          className="flex items-center justify-between bg-white rounded-[14px] px-4 py-4 active:opacity-70"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-[28px] leading-none">🏅</span>
            <div>
              <p className="text-[14px] font-bold text-[#2A0B04]">활동 배지</p>
              <p className="text-[12px] text-[#9A9A9A] mt-0.5">내가 모은 배지를 확인해보세요</p>
            </div>
          </div>
          <ChevronRightIcon />
        </Link>
      </div>
    </div>
  )
}
