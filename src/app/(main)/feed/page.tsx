'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const STREAK = 2

const MAGAZINES = [
  { id: 1, title: '진짜 예쁜 여름 뜨개 옷 담아왔어요 (상의 ver.)' },
  { id: 2, title: '가을 분위기 물씬~ 코지 니트 컬렉션' },
  { id: 3, title: '초보자도 쉽게 따라하는 손뜨개 기초' },
  { id: 4, title: '겨울 준비! 따뜻한 뜨개 소품 모음' },
  { id: 5, title: '2026 S/S 뜨개 컬러 트렌드 리포트' },
]

const COMMUNITY_POSTS = [
  { id: 1, author: '뜨뜨뜨',   title: '이사벨 니트 소매 폭 좁게 변경 해보신분?',      date: '6월 21일', views: 210, likes: 210, comments: 13 },
  { id: 2, author: '타래언니',  title: '보카시 가디건 테스트 니터 5분 모집해용!',      date: '6월 11일', views: 300, likes: 120, comments: 32 },
  { id: 3, author: '뜨개하는날', title: '코튼사 추천해주세요! 여름 민소매 뜨려고요', date: '6월 18일', views: 185, likes:  87, comments:  9 },
  { id: 4, author: '실타래',    title: '대바늘 초보인데 어떤 도안부터 시작할까요?', date: '6월 17일', views: 422, likes: 195, comments: 41 },
  { id: 5, author: '니팅러버',  title: '뜨개 모임 같이 하실 분 구해요 (서울 마포)',  date: '6월 15일', views:  98, likes:  63, comments: 27 },
  { id: 6, author: '울덕후',    title: '메리노울 vs 알파카, 어떤 실이 더 좋아요?',  date: '6월 14일', views: 310, likes: 144, comments: 18 },
]

const EVENTS = [
  { id: 1, title: '연희동 뜨개거리',  date: '2026. 06. 12(금) ~ 06. 14(일)', location: '서울 연희동',           ended: true  },
  { id: 2, title: '베른샵 뜨개 팝업', date: '2026. 06. 19(금) ~ 07. 02(목)', location: '롯데백화점 전주점 1F', ended: false },
  { id: 3, title: '핸드페어',         date: '2026. 06. 19(금) ~ 07. 02(목)', location: '서울 삼성동',           ended: false },
  { id: 4, title: '니팅 페스타',       date: '2026. 07. 05(토) ~ 07. 06(일)', location: '서울 성수동',           ended: false },
  { id: 5, title: '울 마켓',           date: '2026. 07. 12(토)',               location: '서울 마포구',           ended: false },
]

function HeartIcon() {
  return (
    <svg width="18" height="19" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 23 23" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M4.956 5.915C3.833 7.037 3.833 8.845 3.833 12.459V17.812C3.833 18.665 4.865 19.093 5.469 18.49L7.526 16.432C7.595 16.363 7.63 16.328 7.674 16.31C7.718 16.292 7.767 16.292 7.866 16.292H13.416C15.203 16.292 16.096 16.292 16.799 15.9C17.739 15.511 18.485 14.865 18.874 13.926C19.166 13.221 19.166 12.328 19.166 10.542C19.166 8.756 19.166 7.862 18.874 7.159C18.682 6.694 18.399 6.271 18.044 5.915C17.688 5.559 17.265 5.276 16.8 5.083C16.096 4.792 15.203 4.792 13.416 4.792H11.5C7.886 4.792 6.078 4.792 4.956 5.915Z" stroke="#9A9A9A" strokeWidth="1.3" fill="none"/>
    </svg>
  )
}

export default function FeedPage() {
  const router = useRouter()
  const [hasNewNotification, setHasNewNotification] = useState(true)
  const [communityPage, setCommunityPage] = useState(0)
  const communityScrollRef = useRef<HTMLDivElement>(null)

  const handleCommunityScroll = () => {
    if (!communityScrollRef.current) return
    const { scrollLeft, clientWidth } = communityScrollRef.current
    setCommunityPage(Math.round(scrollLeft / clientWidth))
  }

  return (
    <div className="relative bg-[#fafafa] min-h-screen pb-28 overflow-x-hidden max-w-[393px] mx-auto">

      {/* 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute rounded-full opacity-70 blur-[60px]"
          style={{ left: -17, top: 45, width: 267, height: 267, background: '#ffd6cc' }} />
        <div className="absolute rounded-full opacity-50 blur-[70px]"
          style={{ left: 'calc(50% - 50px)', top: 135, width: 244, height: 244, background: '#fecec4' }} />
      </div>

      <div className="relative max-w-[393px] mx-auto" style={{ zIndex: 1 }}>

        {/* ── 헤더 ── */}
        <div className="flex items-center justify-between px-4 pt-14 pb-0">
          <span style={{ fontFamily: "'Rubik Bubbles', cursive", color: '#f72e00', fontSize: 28 }}>Knitters</span>
          <div className="flex items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center" onClick={() => router.push('/chat')}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path opacity="0.3" d="M12 4C16.4184 4 20 7.5816 20 12C20 16.4184 16.4184 20 12 20H5.6C5.17565 20 4.76869 19.8314 4.46863 19.5314C4.16857 19.2313 4 18.8243 4 18.4V12C4 7.5816 7.5816 4 12 4Z" fill="#F72E00"/>
                <path d="M14.2507 10H9.7501C9.55892 10.0002 9.37503 10.0816 9.23601 10.2274C9.09698 10.3732 9.01333 10.5725 9.00212 10.7845C8.99092 10.9965 9.05301 11.2053 9.17572 11.3682C9.29843 11.5311 9.47249 11.6357 9.66234 11.6608L9.7501 11.6667H14.2507C14.4419 11.6664 14.6258 11.5851 14.7648 11.4393C14.9038 11.2935 14.9875 11.0942 14.9987 10.8822C15.0099 10.6701 14.9478 10.4614 14.8251 10.2985C14.7024 10.1356 14.5283 10.0309 14.3385 10.0058L14.2507 10ZM12.0004 13.3333H9.7501C9.55116 13.3333 9.36037 13.4211 9.2197 13.5774C9.07903 13.7337 9 13.9457 9 14.1667C9 14.3877 9.07903 14.5996 9.2197 14.7559C9.36037 14.9122 9.55116 15 9.7501 15H12.0004C12.1994 15 12.3901 14.9122 12.5308 14.7559C12.6715 14.5996 12.7505 14.3877 12.7505 14.1667C12.7505 13.9457 12.6715 13.7337 12.5308 13.5774C12.3901 13.4211 12.1994 13.3333 12.0004 13.3333Z" fill="#F72E00"/>
              </svg>
            </button>
            <button className="w-8 h-8 flex items-center justify-center relative"
              onClick={() => { setHasNewNotification(false); router.push('/notifications') }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.1268 17.1C9.9746 17.4168 9.90526 17.7671 9.92524 18.118C9.94521 18.4689 10.0539 18.809 10.241 19.1065C10.4282 19.404 10.6877 19.6492 10.9954 19.8192C11.3031 19.9891 11.6488 20.0783 12.0003 20.0783C12.3518 20.0783 12.6975 19.9891 13.0052 19.8192C13.3128 19.6492 13.5724 19.404 13.7595 19.1065C13.9467 18.809 14.0553 18.4689 14.0753 18.118C14.0953 17.7671 14.026 17.4168 13.8738 17.1H10.1268Z" fill="#F72E00"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.8883 5.1C10.6154 5.10003 9.39456 5.60571 8.49442 6.5058L8.30602 6.6942C7.40593 7.59434 6.90025 8.81515 6.90022 10.0881V10.9698C6.90022 12.5898 6.25672 14.1438 5.11072 15.2898C4.96246 15.4381 4.86151 15.6271 4.82064 15.8328C4.77976 16.0385 4.80078 16.2517 4.88106 16.4454C4.96133 16.6392 5.09724 16.8048 5.27162 16.9213C5.446 17.0378 5.651 17.1 5.86072 17.1H18.1397C18.3495 17.1 18.5546 17.0379 18.729 16.9213C18.9035 16.8048 19.0394 16.6392 19.1197 16.4454C19.2 16.2516 19.221 16.0383 19.1801 15.8325C19.1391 15.6268 19.0381 15.4378 18.8897 15.2895C18.3223 14.7222 17.8723 14.0488 17.5652 13.3075C17.2582 12.5663 17.1002 11.7718 17.1002 10.9695V10.0881C17.1002 8.81515 16.5945 7.59434 15.6944 6.6942L15.506 6.5058C14.6059 5.60571 13.3851 5.10003 12.1121 5.1H11.8883Z" fill="#FBB4A4"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M12.6004 5.1249V4.2C12.6004 4.04087 12.5372 3.88826 12.4247 3.77573C12.3121 3.66321 12.1595 3.6 12.0004 3.6C11.8413 3.6 11.6886 3.66321 11.5761 3.77573C11.4636 3.88826 11.4004 4.04087 11.4004 4.2V5.1249C11.5626 5.10832 11.7255 5.1 11.8885 5.1H12.1123C12.2763 5.1 12.439 5.1083 12.6004 5.1249Z" fill="#FC6744"/>
              </svg>
              {hasNewNotification && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#f72e00] rounded-full border border-white" />
              )}
            </button>
          </div>
        </div>

        {/* ── 인사말 ── */}
        <div className="px-4 mb-[30px] mt-[80px]">
          <p className="text-[#565656] text-[18px] tracking-[-0.54px] leading-[1.31]">안녕하세요, 이브님</p>
          <p className="text-[#212121] text-[20px] font-bold tracking-[-0.6px] leading-[1.31]">오늘의 뜨개를 시작해볼까요?</p>
        </div>

        {/* ── 연속 뜨개 카드 ── */}
        <Link href="/streak">
          <div className="mx-4 mb-[30px] bg-white rounded-[10px] shadow-[0px_4px_20px_1px_rgba(0,0,0,0.04)] px-4 py-4 flex items-center gap-3">
            <svg width="42" height="42" viewBox="0 0 42 42" fill="none" className="shrink-0">
              <path opacity="0.5" d="M22.456 38.1518C27.9265 37.0563 35 33.1205 35 22.9442C35 13.685 28.2223 7.518 23.3485 4.68475C22.2652 4.05475 21 4.8825 21 6.13375V9.33275C21 11.8563 19.9395 16.4622 16.9925 18.3785C15.4875 19.3567 13.86 17.892 13.678 16.107L13.5275 14.6405C13.3525 12.936 11.6165 11.9018 10.255 12.9413C7.80675 14.805 5.25 18.0775 5.25 22.9425C5.25 35.3867 14.5057 38.5 19.1327 38.5C19.4034 38.5 19.6857 38.4913 19.9797 38.4738C20.7602 38.3758 19.9797 38.647 22.456 38.15" fill="#F72E00"/>
              <path d="M14 32.277C14 36.862 17.6942 38.2795 19.9797 38.4755C20.7602 38.3775 19.9797 38.6488 22.456 38.1518C24.2742 37.5095 26.25 35.861 26.25 32.277C26.25 30.0073 24.8167 28.6055 23.695 27.9493C23.352 27.748 22.953 28.0018 22.9232 28.3973C22.8252 29.6538 21.6177 30.6548 20.797 29.6993C20.0707 28.8558 19.7645 27.622 19.7645 26.8328V25.8003C19.7645 25.1808 19.1397 24.7678 18.6042 25.0863C16.6162 26.264 14 28.6895 14 32.277Z" fill="#F72E00"/>
            </svg>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-[#212121] text-[20px] font-bold tracking-[-0.6px]">{STREAK}</span>
                <span className="text-[#5e5d5d] text-[12px] font-medium tracking-[-0.36px]">일 연속 뜨개 중</span>
              </div>
              <div className="flex gap-[6px]">
                {DAYS.map((day, i) => (
                  <div key={day}
                    className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                    style={{ background: i < STREAK ? '#f72e00' : '#ededed', color: i < STREAK ? '#ffefeb' : '#b8b8b8' }}>
                    {day}
                  </div>
                ))}
              </div>
            </div>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="shrink-0">
              <path d="M1 1l6 6-6 6" stroke="#212121" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </Link>

        {/* ── 니터즈 매거진 ── */}
        <div className="px-4 mb-3 flex items-center justify-between">
          <p className="text-[#212121] text-[18px] font-bold tracking-[-0.54px]">니터즈 매거진</p>
          <button onClick={() => router.push('/magazine')} className="text-[#828282] text-[12px] font-medium tracking-[-0.36px]">더보기</button>
        </div>
        <div className="px-4 mb-[30px] flex gap-3 overflow-x-auto scrollbar-none">
          {MAGAZINES.map(mag => (
            <button key={mag.id} onClick={() => router.push(`/magazine/${mag.id}`)} className="w-[173px] shrink-0 text-left">
              <div className="relative bg-[#d9d9d9] rounded-[10px] h-[124px] mb-2 w-[173px]">
                <div className="absolute top-[8px] left-[12px] bg-[#feeae5] rounded-[10px] h-[24px] px-[10px] flex items-center">
                  <span className="text-[#f72e00] text-[12px] font-medium tracking-[-0.36px]">도안</span>
                </div>
              </div>
              <p className="text-[#212121] text-[16px] font-semibold tracking-[-0.48px] leading-[1.31]">{mag.title}</p>
            </button>
          ))}
        </div>

        {/* ── 커뮤니티 인기글 ── */}
        <div className="bg-[#ffeeeb] pt-6 pb-6 mb-[30px]">
          <div className="px-4 mb-3 flex items-center justify-between">
            <p className="text-[#212121] text-[18px] font-bold tracking-[-0.54px]">커뮤니티 인기글</p>
            <Link href="/community" className="text-[#828282] text-[12px] font-medium tracking-[-0.36px]">더보기</Link>
          </div>
          <div
            ref={communityScrollRef}
            onScroll={handleCommunityScroll}
            className="overflow-x-auto scrollbar-none flex snap-x snap-mandatory"
          >
            {Array.from({ length: Math.ceil(COMMUNITY_POSTS.length / 2) }, (_, pageIdx) =>
              COMMUNITY_POSTS.slice(pageIdx * 2, pageIdx * 2 + 2)
            ).map((pagePosts, pageIdx) => (
              <div key={pageIdx} className="min-w-full shrink-0 snap-start px-4">
                <div className="flex flex-col gap-2">
                  {pagePosts.map(post => (
                    <div key={post.id} className="bg-white rounded-[10px] shadow-[0px_4px_20px_1px_rgba(0,0,0,0.04)] px-4 pt-3 pb-3 cursor-pointer active:bg-[#fafafa]" onClick={() => router.push(`/community/${post.id}`)}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-[27px] h-[27px] rounded-full bg-gradient-to-br from-[#FFAF9D] to-[#F72E00] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                          {post.author[0]}
                        </div>
                        <span className="text-[15px] font-semibold text-black tracking-[-0.3px]">{post.author}</span>
                      </div>
                      <p className="text-[15px] font-medium text-[#2d2d2d] tracking-[-0.3px] leading-[1.4] mb-2">{post.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] text-[#6f6f6f] tracking-[-0.24px]">{post.date} · 조회 {post.views}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <HeartIcon />
                            <span className="text-[11px] text-[#9a9a9a] tracking-[-0.22px]">{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CommentIcon />
                            <span className="text-[11px] text-[#9a9a9a] tracking-[-0.22px]">{post.comments}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* 페이지 도트 — 모두 원형 */}
          <div className="flex items-center justify-center gap-[5px] mt-3">
            {Array.from({ length: Math.ceil(COMMUNITY_POSTS.length / 2) }, (_, i) => (
              <div
                key={i}
                className="w-[6px] h-[6px] rounded-full transition-all duration-300"
                style={{ background: i === communityPage ? '#f72e00' : '#d9d9d9' }}
              />
            ))}
          </div>
        </div>

        {/* ── 팝업 / 이벤트 소식 ── */}
        <div className="pt-6 pb-6 mb-[30px]">
          <div className="px-4 mb-3 flex items-center justify-between">
            <p className="text-[#212121] text-[18px] font-bold tracking-[-0.54px]">팝업 / 이벤트 소식</p>
            <button className="text-[#828282] text-[12px] font-medium tracking-[-0.36px]">더보기</button>
          </div>
          <div className="px-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {EVENTS.map(event => (
              <div key={event.id} className="shrink-0 w-[160px]">
                <div className="relative bg-[#d9d9d9] rounded-[10px] h-[200px] mb-2">
                  {event.ended && (
                    <div className="absolute top-[12px] left-[12px] bg-[#f72e00] rounded-[4px] h-[21px] px-[10px] flex items-center">
                      <span className="text-white text-[12px] font-medium tracking-[-0.36px]">종료</span>
                    </div>
                  )}
                </div>
                <p className="text-black text-[16px] font-bold tracking-[-0.54px] leading-[1.31] mb-[2px]">{event.title}</p>
                <p className="text-black text-[12px] font-medium tracking-[-0.36px] leading-[1.31]">{event.date}</p>
                <p className="text-black text-[12px] font-medium tracking-[-0.36px] leading-[1.31]">{event.location}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── 함께 만들어가는 니터즈 배너 ── */}
        <div className="px-4 pb-4">
          <div className="bg-[#fcebe8] rounded-[10px] h-[100px] flex items-center px-5 relative overflow-hidden">
            <div className="flex-1">
              <p className="text-[#f72e00] text-[20px] font-bold tracking-[-0.6px] leading-[1.31]">함께 만들어가는 니터즈</p>
              <p className="text-[#3e0c00] text-[20px] font-bold tracking-[-0.6px] leading-[1.31]">여러분의 다양한 의견을 기다려요.</p>
            </div>
            <span className="absolute right-4 bottom-3 text-[40px]" style={{ transform: 'rotate(-10deg)' }}>✏️</span>
          </div>
        </div>

      </div>
    </div>
  )
}
