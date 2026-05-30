'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Heart, MessageCircle, UserPlus, Bell } from 'lucide-react'

type NotiType = 'like' | 'comment' | 'follow' | 'system'

interface Notification {
  id: number
  type: NotiType
  avatar?: string
  avatarColor?: string
  name?: string
  content: string
  time: string
  read: boolean
}

const INITIAL_NOTIS: Notification[] = [
  { id: 1, type: 'like', avatar: '홍', avatarColor: '#f72e00', name: '홍길동', content: '님이 회원님의 게시물을 좋아해요', time: '5분 전', read: false },
  { id: 2, type: 'comment', avatar: '김', avatarColor: '#4A90D9', name: '김뜨개', content: '님이 댓글을 남겼어요: "너무 예뻐요! 어떤 실 쓰셨어요? 🧶"', time: '30분 전', read: false },
  { id: 3, type: 'follow', avatar: '이', avatarColor: '#7B68EE', name: '이니터', content: '님이 팔로우를 시작했어요', time: '1시간 전', read: false },
  { id: 4, type: 'system', content: '새로운 뜨개 가이드가 업로드됐어요 — "해외 영문 도안 단어 정리집"', time: '3시간 전', read: true },
  { id: 5, type: 'like', avatar: '박', avatarColor: '#3CB371', name: '박코바늘', content: '님이 회원님의 댓글을 좋아해요', time: '어제', read: true },
  { id: 6, type: 'comment', avatar: '최', avatarColor: '#FF8C69', name: '최실타래', content: '님이 댓글을 남겼어요: "저도 따라 만들어볼게요!"', time: '어제', read: true },
  { id: 7, type: 'system', content: '뜨개 챌린지 3일 연속 달성! 오늘도 뜨개를 기록해보세요 🎉', time: '2일 전', read: true },
  { id: 8, type: 'follow', avatar: '정', avatarColor: '#FF6B6B', name: '정캐스트온', content: '님이 팔로우를 시작했어요', time: '3일 전', read: true },
]

const TYPE_ICON: Record<NotiType, React.ReactNode> = {
  like: <Heart size={12} className="text-white" fill="white" />,
  comment: <MessageCircle size={12} className="text-white" fill="white" />,
  follow: <UserPlus size={12} className="text-white" />,
  system: <Bell size={12} className="text-white" />,
}

const TYPE_BADGE_COLOR: Record<NotiType, string> = {
  like: '#f72e00',
  comment: '#4A90D9',
  follow: '#7B68EE',
  system: '#FF8C69',
}

const AVATAR_BG = '#ededed'

export default function NotificationsPage() {
  const router = useRouter()
  const [notis, setNotis] = useState<Notification[]>(INITIAL_NOTIS)

  const unreadCount = notis.filter(n => !n.read).length

  const markAllRead = () => setNotis(prev => prev.map(n => ({ ...n, read: true })))
  const markRead = (id: number) => setNotis(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">
      {/* 헤더 */}
      <div className="flex items-center gap-2 px-4 pt-14 pb-3 bg-white sticky top-0 z-10 border-b border-[#f0f0f0]">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center shrink-0">
          <ChevronLeft size={24} className="text-[#212121]" />
        </button>
        <h1 className="flex-1 text-[18px] font-bold text-[#212121]">
          알림
          {unreadCount > 0 && (
            <span className="ml-2 text-[13px] text-[#f72e00] font-semibold">{unreadCount}</span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-[13px] text-[#a7a7a7] font-medium">
            모두 읽음
          </button>
        )}
      </div>

      {/* 알림 목록 */}
      <div className="flex-1 divide-y divide-[#f5f5f5]">
        {notis.map(noti => (
          <button
            key={noti.id}
            onClick={() => markRead(noti.id)}
            className="w-full flex items-start gap-3 px-4 py-4 text-left active:bg-[#fafafa] transition-colors"
            style={{ background: noti.read ? 'white' : '#fff9f8' }}
          >
            {/* 아바타 or 시스템 아이콘 */}
            <div className="relative shrink-0 mt-0.5">
              {noti.type === 'system' ? (
                <div className="w-11 h-11 rounded-full bg-[#feeae5] flex items-center justify-center">
                  <Bell size={20} className="text-[#f72e00]" />
                </div>
              ) : (
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[15px] font-bold"
                  style={{ background: noti.avatarColor }}
                >
                  {noti.avatar}
                </div>
              )}
              {/* 타입 뱃지 */}
              {noti.type !== 'system' && (
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white"
                  style={{ background: TYPE_BADGE_COLOR[noti.type] }}
                >
                  {TYPE_ICON[noti.type]}
                </div>
              )}
            </div>

            {/* 내용 */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-[#212121] leading-snug">
                {noti.name && <span className="font-semibold">{noti.name}</span>}
                {noti.content}
              </p>
              <p className="text-[12px] text-[#b0b0b0] mt-1">{noti.time}</p>
            </div>

            {/* 안읽음 점 */}
            {!noti.read && (
              <div className="w-2 h-2 rounded-full bg-[#f72e00] shrink-0 mt-2" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
