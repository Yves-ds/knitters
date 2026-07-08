'use client'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useCommunityStore } from '@/store/communityStore'

function ShareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 6l-4-4-4 4" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2v13" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

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

function SmallHeartIcon() {
  return (
    <svg width="18" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

function SmallCommentIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.956 5.915C3.833 7.037 3.833 8.845 3.833 12.459V17.812C3.833 18.665 4.865 19.093 5.469 18.49L7.526 16.432C7.595 16.363 7.63 16.328 7.674 16.31C7.718 16.292 7.767 16.292 7.866 16.292H13.416C15.203 16.292 16.096 16.292 16.799 15.9C17.739 15.511 18.485 14.865 18.874 13.926C19.166 13.221 19.166 12.328 19.166 10.542C19.166 8.756 19.166 7.862 18.874 7.159C18.682 6.694 18.399 6.271 18.044 5.915C17.688 5.559 17.265 5.276 16.8 5.083C16.096 4.792 15.203 4.792 13.416 4.792H11.5C7.886 4.792 6.078 4.792 4.956 5.915Z" stroke="#9A9A9A" strokeWidth="1.3"/>
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 14l1.5-5L11 1.5l3.5 3.5-7.5 7.5L2 14z" stroke="#6a6a6a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M9.5 3l3.5 3.5" stroke="#6a6a6a" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M9 3H7L5 7H3a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2l-2-4h-2" stroke="#9a9a9a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="13" r="3" stroke="#9a9a9a" strokeWidth="1.6"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 2L11 13" stroke="#9a9a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke="#9a9a9a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function CommunityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const posts = useCommunityStore(s => s.posts)
  const post = posts.find(p => p.id === String(id)) ?? posts[0]
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  const [comment, setComment] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const relatedPosts = posts.filter(p => p.id !== post.id).slice(0, 2)

  const toggleLike = () => {
    setLiked(l => !l)
    setLikes(n => liked ? n - 1 : n + 1)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-[106px] max-w-[393px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 pt-14 pb-4">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center">
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9l8 8" stroke="#212121" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <svg width="4" height="18" viewBox="0 0 4 18" fill="none">
              <circle cx="2" cy="2" r="2" fill="#212121"/>
              <circle cx="2" cy="9" r="2" fill="#212121"/>
              <circle cx="2" cy="16" r="2" fill="#212121"/>
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.14)] overflow-hidden min-w-[160px]">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#212121] hover:bg-[#fafafa] active:bg-[#f5f5f5]"
                >
                  이 사용자의 글 보지 않기
                </button>
                <div className="h-px bg-[#f0f0f0]" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-[14px] font-medium text-[#f72e00] hover:bg-[#fafafa] active:bg-[#f5f5f5]"
                >
                  신고
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 카테고리 배지 */}
      <div className="px-4 mb-3">
        <span className="inline-flex items-center bg-[#eff0f0] rounded-[4px] px-2 py-1 text-[12px] font-medium text-[#6a6a6a] tracking-[-0.24px]">
          {post.category}
        </span>
      </div>

      {/* 작성자 정보 */}
      <div className="px-4 mb-3 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-[15px] font-bold"
          style={{ background: post.avatarColor }}
        >
          {post.author[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-semibold text-black tracking-[-0.32px] leading-[1.4]">
            {post.author}
          </span>
          <span className="text-[12px] font-normal text-[#6b6b6b] tracking-[-0.24px] leading-[1.4]">
            {post.time} · 조회 {post.views}
          </span>
        </div>
      </div>

      {/* 제목 */}
      <p className="px-4 mb-3 text-[20px] font-medium text-black tracking-[-0.4px] leading-[1.4]">
        {post.title}
      </p>

      {/* 본문 */}
      <div className="px-4 mb-4">
        <p className="text-[14px] font-normal text-[#474747] tracking-[-0.28px] leading-[1.4] whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-[#ebebeb] mb-4" />

      {/* 공유 + 좋아요 */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <button className="flex items-center justify-center">
          <ShareIcon />
        </button>
        <button onClick={toggleLike} className="flex items-center gap-1">
          <HeartIcon active={liked} />
          <span className="text-[14px] font-medium text-[#9a9a9a] tracking-[-0.28px]">{likes}</span>
        </button>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-[#ebebeb] mb-4" />

      {/* 댓글 헤더 */}
      <div className="px-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-[12px] font-medium text-black tracking-[-0.24px]">댓글</span>
          <span className="text-[12px] font-normal text-black tracking-[-0.24px]">0</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-black tracking-[-0.24px]">최신순</span>
          <span className="text-[12px] font-medium text-[#6a6a6a] tracking-[-0.24px]">등록순</span>
        </div>
      </div>

      {/* 빈 댓글 */}
      <div className="flex flex-col items-center gap-3 py-6">
        <p className="text-[16px] font-medium text-[#aeaeae] tracking-[-0.32px]">
          첫 댓글을 남겨보세요.
        </p>
        <button className="flex items-center gap-1 bg-[#eff0f0] rounded-[4px] px-2 py-[6px]">
          <PencilIcon />
          <span className="text-[12px] font-medium text-[#6a6a6a] tracking-[-0.36px]">댓글 쓰기</span>
        </button>
      </div>

      {/* 구분선 */}
      <div className="h-px bg-[#ebebeb] mb-4" />

      {/* 이 글과 비슷한 게시글 */}
      <div className="px-4">
        <p className="text-[18px] font-bold text-[#212121] tracking-[-0.54px] mb-4">
          이 글과  비슷한 게시글
        </p>
        <div className="flex flex-col">
          {relatedPosts.map((related, idx) => (
            <div key={related.id}>
              {idx > 0 && <div className="h-px bg-[#f0f0f0] my-3" />}
              <button
                onClick={() => router.push(`/community/${related.id}`)}
                className="w-full text-left"
              >
                <span className="inline-flex items-center bg-[#eff0f0] rounded-[4px] px-2 py-1 text-[12px] font-medium text-[#6a6a6a] tracking-[-0.24px] mb-2">
                  {related.category}
                </span>
                <div className="flex flex-col gap-1 mb-2">
                  <p className="text-[15px] font-medium text-[#2d2d2d] tracking-[-0.3px] leading-[1.4]">
                    {related.title}
                  </p>
                  <p className="text-[14px] font-normal text-[#474747] tracking-[-0.28px] leading-[1.4] line-clamp-1">
                    {related.content.split('\n')[0]}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-normal text-[#6f6f6f] tracking-[-0.24px]">
                    {related.date} · 조회 {related.views}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <SmallHeartIcon />
                      <span className="text-[11px] font-medium text-[#9a9a9a] tracking-[-0.22px]">{related.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SmallCommentIcon />
                      <span className="text-[11px] font-medium text-[#9a9a9a] tracking-[-0.22px]">{related.comments}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 댓글 입력창 (고정) */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-[#f0f0f0]">
        <div className="flex items-center gap-4 px-4 py-[11px]">
          <button className="shrink-0">
            <CameraIcon />
          </button>
          <div className="flex-1 bg-[#eff0f0] rounded-[10px] px-[10px] py-[10px]">
            <input
              className="w-full bg-transparent text-[12px] font-medium text-[#bcbcbc] tracking-[0.6px] outline-none"
              placeholder="댓글을 입력해주세요."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </div>
          <button className="shrink-0">
            <SendIcon />
          </button>
        </div>
        <div className="h-[26px] flex items-end justify-center pb-2">
          <div className="w-36 h-[5px] bg-black rounded-full" />
        </div>
      </div>
    </div>
  )
}
