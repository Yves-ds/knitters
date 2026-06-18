'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProjectStore } from '@/store/projectStore'

function formatTime(s: number) {
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function HeartFilled() {
  return (
    <svg width="26" height="26" viewBox="0 0 18 19" fill="none">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#F72E00"/>
    </svg>
  )
}

function HeartOutline() {
  return (
    <svg width="26" height="26" viewBox="0 0 18 19" fill="none">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" stroke="#212121" strokeWidth="1.3" fill="none"/>
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 23 23" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.956 5.915C3.833 7.037 3.833 8.845 3.833 12.459V17.812C3.833 18.665 4.865 19.093 5.469 18.49L7.526 16.432C7.595 16.363 7.63 16.328 7.674 16.31C7.718 16.292 7.767 16.292 7.866 16.292H13.416C15.203 16.292 16.096 16.292 16.799 15.9C17.739 15.511 18.485 14.865 18.874 13.926C19.166 13.221 19.166 12.328 19.166 10.542C19.166 8.756 19.166 7.862 18.874 7.159C18.682 6.694 18.399 6.271 18.044 5.915C17.688 5.559 17.265 5.276 16.8 5.083C16.096 4.792 15.203 4.792 13.416 4.792H11.5C7.886 4.792 6.078 4.792 4.956 5.915Z" stroke="#212121" strokeWidth="1.3" fill="none"/>
      <path d="M8.146 9.104H14.854M8.146 11.98H12.937" stroke="#212121" strokeLinecap="round"/>
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3.5H19C19.8284 3.5 20.5 4.17157 20.5 5V20.5L17 18L14 20.5L12 18.5L10 20.5L7 18L3.5 20.5V5C3.5 4.17157 4.17157 3.5 5 3.5Z"
        fill={active ? '#212121' : 'none'}
        stroke="#212121"
        strokeWidth="1.5"
      />
    </svg>
  )
}

const GRAD_PRESETS = [
  'linear-gradient(135deg, #FFF0EE 0%, #FFD5CC 100%)',
  'linear-gradient(135deg, #EEF4FF 0%, #C8DCFF 100%)',
  'linear-gradient(135deg, #F0FFF0 0%, #C2EEC2 100%)',
  'linear-gradient(135deg, #FFFBEE 0%, #FFE9A0 100%)',
]

export default function CommunityFeedPage() {
  const router = useRouter()
  const projects = useProjectStore(s => s.projects)
  const sharedProjects = projects.filter(p => p.isShared)

  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [likeCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(sharedProjects.map((p, i) => [p.id, 4 + i]))
  )
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})

  const toggleLike = (id: string) =>
    setLiked(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleBookmark = (id: string) =>
    setBookmarked(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="min-h-screen bg-white max-w-[393px] mx-auto pb-24">

      {/* 헤더 */}
      <div className="bg-white px-4 pt-14 pb-0 border-b border-[#F0F0F0] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 pb-3">
            <button
              onClick={() => router.push('/community')}
              className="text-[24px] font-bold active:opacity-60"
              style={{ color: '#9A9A9A' }}
            >
              커뮤니티
            </button>
            <span className="text-[24px] font-bold" style={{ color: '#F72E00' }}>피드</span>
          </div>
          {/* 검색 */}
          <div className="pb-3">
            <Link href="/community/search?tab=피드">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="10.5" cy="10.5" r="5.5" stroke="#FFAF9D" strokeWidth="2"/>
                <path d="M15 15L19 19" stroke="#FFAF9D" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* 피드 컨텐츠 */}
      {sharedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 px-8 gap-4">
          <span className="text-[56px]">🧶</span>
          <p className="text-[15px] font-semibold text-[#9A9A9A] text-center">아직 공유된 기록이 없어요.</p>
          <p className="text-[13px] text-[#C4C4C4] text-center leading-relaxed">
            프로젝트 기록 하단의 공유 버튼을 눌러{'\n'}피드에 공유해보세요!
          </p>
        </div>
      ) : (
        <div>
          {sharedProjects.map((project, idx) => {
            const isLiked = liked[project.id] ?? false
            const isBookmarked = bookmarked[project.id] ?? false
            const likeCount = (likeCounts[project.id] ?? 4) + (isLiked ? 1 : 0)
            const gradBg = GRAD_PRESETS[idx % GRAD_PRESETS.length]

            return (
              <div key={project.id} className="border-b border-[#F5F5F5]">

                {/* 포스트 헤더 */}
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FFAF9D, #F72E00)' }}
                    >
                      니
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[#212121] leading-tight">익명의 니터님</p>
                      <p className="text-[11px] text-[#B0B0B0] leading-tight mt-0.5">방금 전</p>
                    </div>
                  </div>
                  <button className="w-8 h-8 flex items-center justify-center active:opacity-60">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <circle cx="4" cy="10" r="1.5" fill="#646464"/>
                      <circle cx="10" cy="10" r="1.5" fill="#646464"/>
                      <circle cx="16" cy="10" r="1.5" fill="#646464"/>
                    </svg>
                  </button>
                </div>

                {/* 이미지 영역 */}
                <Link href={`/projects/${project.id}`}>
                  <div
                    className="w-full flex items-center justify-center overflow-hidden"
                    style={{ aspectRatio: '1/1', background: gradBg }}
                  >
                    {project.coverPhoto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.coverPhoto}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span style={{ fontSize: 80 }}>{project.emoji ?? '🧶'}</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* 액션 바 */}
                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleLike(project.id)}
                      className="active:scale-110 transition-transform"
                    >
                      {isLiked ? <HeartFilled /> : <HeartOutline />}
                    </button>
                    <button className="active:opacity-60">
                      <CommentIcon />
                    </button>
                    <button className="active:opacity-60">
                      <ShareIcon />
                    </button>
                  </div>
                  <button onClick={() => toggleBookmark(project.id)} className="active:opacity-60">
                    <BookmarkIcon active={isBookmarked} />
                  </button>
                </div>

                {/* 좋아요 수 */}
                <p className="px-4 text-[13px] font-semibold text-[#212121] mb-1.5">
                  좋아요 {likeCount}개
                </p>

                {/* 캡션 */}
                <div className="px-4 pb-4">
                  <p className="text-[13px] text-[#212121] leading-snug">
                    <span className="font-semibold">익명의 니터님</span>
                    <span className="ml-1.5">{project.title}</span>
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: '#FFEEEA', color: '#F72E00' }}
                    >
                      {project.status}
                    </span>
                    {(project.timerSecs ?? 0) > 0 && (
                      <span className="text-[11px] text-[#B0B0B0]">
                        {formatTime(project.timerSecs ?? 0)}
                      </span>
                    )}
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
