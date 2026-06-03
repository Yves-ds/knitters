'use client'
import { useState } from 'react'
import { Plus, Search, Heart, MessageCircle, Eye, ChevronDown } from 'lucide-react'
import { mockPosts, mockNotices } from '@/lib/mockData'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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

export default function CommunityPage() {
  const router = useRouter()
  const [mainTab, setMainTab] = useState<MainTab>('커뮤니티')
  const [category, setCategory] = useState('전체')

  const filtered = category === '전체'
    ? mockPosts
    : mockPosts.filter(p => (p as any).category === category)

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
                style={{
                  color: mainTab === t ? '#f72e00' : '#c4c4c4',
                  borderBottom: mainTab === t ? '2.5px solid #f72e00' : '2.5px solid transparent',
                }}
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
          <div className="px-4 pt-5 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[18px]">📢</span>
                <span className="text-[16px] font-bold text-[#212121]">니터즈 공지사항</span>
              </div>
              <button className="text-[13px] text-[#a7a7a7]">전체보기</button>
            </div>
            <div className="flex flex-col gap-2">
              {mockNotices.map(notice => (
                <div key={notice.id} className="bg-[#fff3f0] rounded-[10px] px-4 py-3">
                  <p className="text-[14px] font-semibold text-[#212121] mb-1.5">{notice.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#a7a7a7]">{notice.date} · 조회 {notice.views}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-[#a7a7a7]" fill={notice.likes > 5 ? '#f72e00' : 'none'} style={{ color: notice.likes > 5 ? '#f72e00' : '#a7a7a7' }} />
                        <span className="text-[12px] text-[#a7a7a7]">{notice.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={12} className="text-[#a7a7a7]" />
                        <span className="text-[12px] text-[#a7a7a7]">{notice.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 필터 바 */}
          <div className="px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none bg-white mt-2">
            <button className="flex items-center gap-1 h-8 px-3 rounded-full shrink-0 text-[13px] font-semibold"
              style={{ background: '#feeae5', color: '#f72e00' }}>
              최신순 <ChevronDown size={13} />
            </button>
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
                        <Heart size={13} className="text-[#b0b0b0]" />
                        <span className="text-[12px] text-[#b0b0b0]">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={13} className="text-[#b0b0b0]" />
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
