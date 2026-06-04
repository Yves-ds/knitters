'use client'
import { useState, Suspense } from 'react'
import { Plus, Search, ChevronDown } from 'lucide-react'
import { mockPosts, mockNotices } from '@/lib/mockData'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const MAIN_TABS = ['커뮤니티', '함뜨해요'] as const
type MainTab = typeof MAIN_TABS[number]

const CATEGORIES = ['전체', '뜨개 질문', '뜨개 잡담', '실속 장터', '구매 후기', '완성 인증'] as const

// 알림 벨 아이콘 (기존 feed 페이지와 동일)
function BellIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.1268 17.1C9.9746 17.4168 9.90526 17.7671 9.92524 18.118C9.94521 18.4689 10.0539 18.809 10.241 19.1065C10.4282 19.404 10.6877 19.6492 10.9954 19.8192C11.3031 19.9891 11.6488 20.0783 12.0003 20.0783C12.3518 20.0783 12.6975 19.9891 13.0052 19.8192C13.3128 19.6492 13.5724 19.404 13.7595 19.1065C13.9467 18.809 14.0553 18.4689 14.0753 18.118C14.0953 17.7671 14.026 17.4168 13.8738 17.1H10.1268Z" fill="#F72E00"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.8883 5.1C10.6154 5.10003 9.39456 5.60571 8.49442 6.5058L8.30602 6.6942C7.40593 7.59434 6.90025 8.81515 6.90022 10.0881V10.9698C6.90022 12.5898 6.25672 14.1438 5.11072 15.2898C4.96246 15.4381 4.86151 15.6271 4.82064 15.8328C4.77976 16.0385 4.80078 16.2517 4.88106 16.4454C4.96133 16.6392 5.09724 16.8048 5.27162 16.9213C5.446 17.0378 5.651 17.1 5.86072 17.1H18.1397C18.3495 17.1 18.5546 17.0379 18.729 16.9213C18.9035 16.8048 19.0394 16.6392 19.1197 16.4454C19.2 16.2516 19.221 16.0383 19.1801 15.8325C19.1391 15.6268 19.0381 15.4378 18.8897 15.2895C18.3223 14.7222 17.8723 14.0488 17.5652 13.3075C17.2582 12.5663 17.1002 11.7718 17.1002 10.9695V10.0881C17.1002 8.81515 16.5945 7.59434 15.6944 6.6942L15.506 6.5058C14.6059 5.60571 13.3851 5.10003 12.1121 5.1H11.8883Z" fill="#FBB4A4"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.6004 5.1249V4.2C12.6004 4.04087 12.5372 3.88826 12.4247 3.77573C12.3121 3.66321 12.1595 3.6 12.0004 3.6C11.8413 3.6 11.6886 3.66321 11.5761 3.77573C11.4636 3.88826 11.4004 4.04087 11.4004 4.2V5.1249C11.5626 5.10832 11.7255 5.1 11.8885 5.1H12.1123C12.2763 5.1 12.439 5.1083 12.6004 5.1249Z" fill="#FC6744"/>
    </svg>
  )
}

function LoudspeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.0727 13.9474C19.3873 13.9474 19.6989 13.8854 19.9895 13.765C20.2802 13.6446 20.5443 13.4681 20.7668 13.2456C20.9893 13.0232 21.1657 12.7591 21.2861 12.4684C21.4065 12.1777 21.4685 11.8662 21.4685 11.5516C21.4685 11.2369 21.4065 10.9254 21.2861 10.6347C21.1657 10.3441 20.9893 10.0799 20.7668 9.85748C20.5443 9.635 20.2802 9.45853 19.9895 9.33813C19.6989 9.21773 19.3873 9.15576 19.0727 9.15576C18.4373 9.15576 17.8279 9.40818 17.3786 9.85748C16.9293 10.3068 16.6769 10.9162 16.6769 11.5516C16.6769 12.187 16.9293 12.7964 17.3786 13.2456C17.8279 13.6949 18.4373 13.9474 19.0727 13.9474Z" fill="#F72E00"/>
      <path d="M9.29629 8.40219L9.73423 7.75816C10.5393 7.75816 11.3379 7.57139 12.0592 7.22361L16.0908 5.23999V17.8759L12.0592 15.8923C11.3356 15.5369 10.5403 15.3518 9.73423 15.3513L9.29629 14.1985V8.40219ZM6.21524 19.9999H7.87298C8.30448 19.9999 8.65226 19.6522 8.65226 19.2206V14.1276H5.43596V19.2206C5.43596 19.6522 5.78374 19.9999 6.21524 19.9999Z" fill="#FBB4A4"/>
      <path d="M17.7138 3.25C17.1894 3.25 16.6865 3.45831 16.3157 3.8291C15.9449 4.1999 15.7366 4.7028 15.7366 5.22718V17.8824C15.7366 18.4068 15.9449 18.9097 16.3157 19.2805C16.6865 19.6513 17.1894 19.8596 17.7138 19.8596C18.2382 19.8596 18.7411 19.6513 19.1119 19.2805C19.4827 18.9097 19.691 18.4068 19.691 17.8824V5.22718C19.6898 4.70317 19.4811 4.20095 19.1106 3.83042C18.74 3.45988 18.2378 3.25119 17.7138 3.25Z" fill="#FF7454"/>
      <path d="M4.61224 7.7583H9.94033V15.345H4.61224C3.99591 15.345 3.5 14.862 3.5 14.2695V8.84028C3.5 8.24133 3.99591 7.7583 4.61224 7.7583Z" fill="#F72E00"/>
    </svg>
  )
}

function HeartIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="15" height="15" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#FBB4A4"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#D8C4BF"/>
    </svg>
  )
}

function CommentIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="16" height="16" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.95617 5.91516C3.83301 7.03737 3.83301 8.84478 3.83301 12.4587V17.8119C3.83301 18.6648 4.86513 19.0932 5.46888 18.4894L7.52642 16.4319C7.59542 16.3629 7.62992 16.3284 7.67401 16.3102C7.71809 16.292 7.76697 16.292 7.86567 16.292H13.4163C15.2027 16.292 16.0958 16.292 16.7993 15.9997C17.7385 15.6109 18.4848 14.8649 18.874 13.9259C19.1663 13.2215 19.1663 12.3283 19.1663 10.542C19.1663 8.75566 19.1663 7.86249 18.874 7.15908C18.6816 6.69385 18.3994 6.27108 18.0436 5.91492C17.6878 5.55876 17.2653 5.27618 16.8002 5.08333C16.0958 4.79199 15.2027 4.79199 13.4163 4.79199H11.4997C7.8858 4.79199 6.07838 4.79199 4.95617 5.91516Z" fill="#FBB4A4"/>
      <path d="M8.14551 9.10449H14.8538M8.14551 11.9795H12.9372" stroke="#FA8B72" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.95617 5.91516C3.83301 7.03737 3.83301 8.84478 3.83301 12.4587V17.8119C3.83301 18.6648 4.86513 19.0932 5.46888 18.4894L7.52642 16.4319C7.59542 16.3629 7.62992 16.3284 7.67401 16.3102C7.71809 16.292 7.76697 16.292 7.86567 16.292H13.4163C15.2027 16.292 16.0958 16.292 16.7993 15.9997C17.7385 15.6109 18.4848 14.8649 18.874 13.9259C19.1663 13.2215 19.1663 12.3283 19.1663 10.542C19.1663 8.75566 19.1663 7.86249 18.874 7.15908C18.6816 6.69385 18.3994 6.27108 18.0436 5.91492C17.6878 5.55876 17.2653 5.27618 16.8002 5.08333C16.0958 4.79199 15.2027 4.79199 13.4163 4.79199H11.4997C7.8858 4.79199 6.07838 4.79199 4.95617 5.91516Z" fill="#D8C4BF"/>
      <path d="M8.14551 9.10449H14.8538M8.14551 11.9795H12.9372" stroke="#B7A39E" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

type SortKey = '최신순' | '인기순'

function CommunityPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialTab = (searchParams.get('tab') === '함뜨해요' ? '함뜨해요' : '커뮤니티') as MainTab
  const [mainTab, setMainTab] = useState<MainTab>(initialTab)
  const [category, setCategory] = useState('전체')
  const [sortKey, setSortKey] = useState<SortKey>('최신순')
  const [sortOpen, setSortOpen] = useState(false)

  const filtered = (() => {
    let list = category === '전체' ? [...mockPosts] : mockPosts.filter(p => (p as any).category === category)
    if (sortKey === '인기순') list.sort((a, b) => b.likes - a.likes)
    // 최신순: mockPosts 순서가 최신순이므로 기본 순서 유지 (id 역순)
    else list.sort((a, b) => parseInt(b.id) - parseInt(a.id))
    return list
  })()

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28">

      {/* 헤더 */}
      <div className="bg-white px-4 pt-14 pb-0">
        <div className="flex items-center justify-between">
          {/* 메인 탭 */}
          <div className="flex items-end gap-4">
            {MAIN_TABS.map(t => (
              <button
                key={t}
                onClick={() => setMainTab(t)}
                className="text-[24px] font-bold pb-3 transition-colors"
                style={{ color: mainTab === t ? '#F72E00' : '#E0DCD3' }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* 우측 아이콘 */}
          <div className="flex items-center gap-3 pb-3">
            <Link href={`/community/search?tab=${mainTab === '함뜨해요' ? '함뜨해요' : '커뮤니티'}`}>
              <Search size={22} className="text-[#f72e00]" />
            </Link>
            <button onClick={() => router.push('/notifications')}>
              <BellIcon />
            </button>
          </div>
        </div>
      </div>

      {/* ── 커뮤니티 탭 콘텐츠 ── */}
      {mainTab === '커뮤니티' && (
        <>
          {/* 공지사항 */}
          <div className="bg-white px-4 pt-5 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <LoudspeakerIcon />
                <span className="text-[16px] font-bold text-[#212121]">니터즈 공지사항</span>
              </div>
              <button className="text-[13px] text-[#a7a7a7]">전체보기</button>
            </div>
            <div className="flex flex-col gap-2">
              {mockNotices.map(notice => (
                <div key={notice.id} className="bg-[#feeae5] rounded-[10px] px-4 py-3">
                  <p className="text-[14px] font-semibold text-[#212121] mb-1.5">{notice.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#a7a7a7]">{notice.date} · 조회 {notice.views}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <HeartIcon active={notice.likes > 5} />
                        <span className="text-[12px] text-[#b0b0b0]">{notice.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CommentIcon active={false} />
                        <span className="text-[12px] text-[#b0b0b0]">{notice.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 필터 바 — 정렬 버튼 + 카테고리 칩 같은 행 */}
          <div className="bg-white flex items-center py-3">
            {/* 정렬 버튼: shrink-0으로 고정, overflow 바깥에 relative 유지 */}
            <div className="relative shrink-0 pl-4 pr-2">
              <button
                onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1 h-8 px-3 rounded-full text-[13px] font-semibold"
                style={{ background: '#feeae5', color: '#f72e00' }}
              >
                {sortKey} <ChevronDown size={13} />
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                  <div className="absolute top-10 left-4 bg-white rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-50 w-24 overflow-hidden">
                    {(['최신순', '인기순'] as SortKey[]).map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortKey(opt); setSortOpen(false) }}
                        className="w-full text-left px-4 py-2.5 text-[13px] font-medium"
                        style={{ color: sortKey === opt ? '#f72e00' : '#212121' }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* 카테고리 칩: 나머지 영역에서 가로 스크롤 */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pr-4">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className="h-8 px-3 rounded-full shrink-0 text-[13px] font-medium transition-colors"
                  style={
                    category === cat
                      ? { background: '#f72e00', color: '#fff' }
                      : { background: 'white', color: '#646464', border: '1px solid #e0e0e0' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className="bg-white divide-y divide-[#f5f5f5]">
            {filtered.map(post => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <div className="px-4 py-5 active:bg-[#fafafa] transition-colors">
                  {/* 카테고리 배지 */}
                  <span className="inline-block text-[12px] font-medium text-[#646464] border border-[#e0e0e0] rounded-[6px] px-2 py-0.5 mb-3">
                    {(post as any).category ?? '일반'}
                  </span>

                  {/* 작성자 */}
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                      style={{ background: (post as any).user?.avatarColor ?? '#c9956c' }}
                    >
                      {post.user.name[0]}
                    </div>
                    <span className="text-[14px] font-semibold text-[#212121]">{post.user.name}</span>
                    {(post as any).user?.following && (
                      <span className="text-[12px] font-semibold text-[#f72e00]">팔로우</span>
                    )}
                  </div>

                  {/* 제목 */}
                  <p className="text-[16px] font-bold text-[#212121] mb-1.5 leading-snug">
                    {(post as any).title ?? post.user.name}
                  </p>

                  {/* 내용 */}
                  <p className="text-[13px] text-[#888] line-clamp-2 leading-relaxed mb-3">
                    {post.description}
                  </p>

                  {/* 푸터 */}
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#b0b0b0]">
                      {post.createdAt} · 조회 {(post as any).views ?? 0}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <HeartIcon active={post.liked} />
                        <span className="text-[12px] text-[#b0b0b0]">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CommentIcon active={false} />
                        <span className="text-[12px] text-[#b0b0b0]">{post.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* ── 함뜨해요 탭 콘텐츠 ── */}
      {mainTab === '함뜨해요' && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span className="text-5xl">🧶</span>
          <p className="text-[15px] font-semibold text-[#212121]">함께 뜨개할 모임을 찾아보세요</p>
          <p className="text-[13px] text-[#a7a7a7]">검색 아이콘으로 원하는 모임을 찾을 수 있어요</p>
        </div>
      )}

      {/* FAB */}
      <Link
        href="/community/new"
        className="fixed bottom-[100px] w-14 h-14 bg-[#f72e00] rounded-2xl shadow-lg shadow-[#f72e00]/30 flex items-center justify-center z-30 active:scale-95 transition-all"
        style={{ right: 'max(16px, calc(50% - 224px))' }}
      >
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </Link>
    </div>
  )
}

export default function CommunityPage() {
  return (
    <Suspense>
      <CommunityPageInner />
    </Suspense>
  )
}
