'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Search, X } from 'lucide-react'
import Link from 'next/link'

const MOCK_CHATS = [
  {
    id: 1,
    name: '홍길동',
    avatar: '홍',
    lastMessage: '안녕하세요! 지난번에 올리신 뜨개 패턴 궁금해서요 🧶',
    time: '방금',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: '김뜨개',
    avatar: '김',
    lastMessage: '실 추천 해주셔서 감사해요 💕',
    time: '10분 전',
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: '이니터',
    avatar: '이',
    lastMessage: '오늘 함뜨 모임 몇시에 시작해요?',
    time: '1시간 전',
    unread: 1,
    online: false,
  },
  {
    id: 4,
    name: '박코바늘',
    avatar: '박',
    lastMessage: '도안 공유 부탁드려도 될까요?',
    time: '어제',
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: '최실타래',
    avatar: '최',
    lastMessage: '완성했어요! 너무 예쁘게 됐죠? ㅎㅎ',
    time: '2일 전',
    unread: 0,
    online: false,
  },
  {
    id: 6,
    name: '정캐스트온',
    avatar: '정',
    lastMessage: '목도리 패턴 어디서 구하셨어요?',
    time: '3일 전',
    unread: 0,
    online: false,
  },
]

const AVATAR_COLORS = [
  '#f72e00', '#FF8C69', '#4A90D9', '#7B68EE', '#3CB371', '#FF6B6B',
]

export default function ChatPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const filtered = MOCK_CHATS.filter(c =>
    c.name.includes(query) || c.lastMessage.includes(query)
  )

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-4 pt-14 pb-3 bg-white sticky top-0 z-10 border-b border-[#f0f0f0]">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center shrink-0">
          <ChevronLeft size={24} className="text-[#212121]" />
        </button>
        <h1 className="flex-1 text-[18px] font-bold text-[#212121]">채팅</h1>
        <span className="text-[13px] text-[#a7a7a7] font-medium">{filtered.filter(c => c.unread > 0).length}개 안읽음</span>
      </div>

      {/* 검색 */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-[#f4f4f4] rounded-[10px] px-3 h-10">
          <Search size={15} className="text-[#9e9e9e] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="대화 검색"
            className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#b0b0b0] outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={14} className="text-[#9e9e9e]" />
            </button>
          )}
        </div>
      </div>

      {/* 채팅 목록 */}
      <div className="flex-1 divide-y divide-[#f5f5f5]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <span className="text-4xl">💬</span>
            <p className="text-[14px] text-[#a7a7a7]">검색 결과가 없어요</p>
          </div>
        ) : (
          filtered.map((chat, i) => (
            <Link key={chat.id} href={`/chat/${chat.id}`} className="w-full flex items-center gap-3 px-4 py-4 active:bg-[#fafafa] text-left">
              {/* 아바타 */}
              <div className="relative shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[16px] font-bold"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {chat.avatar}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                )}
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[15px] font-semibold text-[#212121]">{chat.name}</span>
                  <span className="text-[12px] text-[#b0b0b0] shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#888] truncate flex-1">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="ml-2 shrink-0 min-w-[18px] h-[18px] bg-[#f72e00] rounded-full text-white text-[11px] font-bold flex items-center justify-center px-1">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
