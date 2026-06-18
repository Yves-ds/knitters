'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, MoreVertical, Send, Image as ImageIcon } from 'lucide-react'

const MOCK_CHATS = [
  { id: 1,  name: '홍길동',   avatar: '홍', color: '#f72e00', online: true },
  { id: 2,  name: '김뜨개',   avatar: '김', color: '#FF8C69', online: true },
  { id: 3,  name: '이니터',   avatar: '이', color: '#4A90D9', online: false },
  { id: 4,  name: '박코바늘', avatar: '박', color: '#7B68EE', online: false },
  { id: 5,  name: '최실타래', avatar: '최', color: '#3CB371', online: false },
  { id: 6,  name: '정캐스트온', avatar: '정', color: '#FF6B6B', online: false },
]

const MOCK_MESSAGES: Record<number, { id: number; text: string; mine: boolean; time: string }[]> = {
  1: [
    { id: 1, text: '안녕하세요! 지난번에 올리신 뜨개 패턴 궁금해서요 🧶', mine: false, time: '오후 2:10' },
    { id: 2, text: '아 네 안녕하세요! 어떤 패턴이 궁금하신가요?', mine: true, time: '오후 2:11' },
    { id: 3, text: '케이블 니트 스웨터요! 소매 부분 단수가 얼마나 되나요?', mine: false, time: '오후 2:12' },
    { id: 4, text: '소매는 총 60단이에요. 10단마다 감소코 1회씩 줬어요', mine: true, time: '오후 2:13' },
    { id: 5, text: '오 감사합니다! 제 사이즈로 조금 조정해서 떠봐야겠어요 ㅎㅎ', mine: false, time: '오후 2:14' },
    { id: 6, text: '잘 되길 바랍니다 :) 완성하시면 꼭 보여주세요!', mine: true, time: '오후 2:15' },
  ],
  2: [
    { id: 1, text: '실 추천 해주셔서 감사해요 💕', mine: false, time: '오전 11:05' },
    { id: 2, text: '아니에요~ 결과물 잘 나오길 바라요!', mine: true, time: '오전 11:06' },
    { id: 3, text: '메리노울이 이렇게 부드러운 줄 몰랐어요', mine: false, time: '오전 11:08' },
  ],
  3: [
    { id: 1, text: '오늘 함뜨 모임 몇시에 시작해요?', mine: false, time: '오후 1:00' },
    { id: 2, text: '오후 3시예요! 카페 2층으로 오시면 돼요 :)', mine: true, time: '오후 1:03' },
    { id: 3, text: '네 알겠어요! 조금 늦을 수도 있는데 기다려주세요', mine: false, time: '오후 1:05' },
  ],
  4: [
    { id: 1, text: '도안 공유 부탁드려도 될까요?', mine: false, time: '어제 오후 4:20' },
    { id: 2, text: '물론이죠! 어떤 도안이 필요하세요?', mine: true, time: '어제 오후 4:22' },
  ],
  5: [
    { id: 1, text: '완성했어요! 너무 예쁘게 됐죠? ㅎㅎ', mine: false, time: '2일 전 오후 7:00' },
    { id: 2, text: '와 진짜 예뻐요!! 색감이 너무 좋네요', mine: true, time: '2일 전 오후 7:05' },
    { id: 3, text: '칭찬 감사해요 ㅎㅎ 다음엔 같이 함뜨 해요!', mine: false, time: '2일 전 오후 7:06' },
  ],
  6: [
    { id: 1, text: '목도리 패턴 어디서 구하셨어요?', mine: false, time: '3일 전 오전 10:00' },
    { id: 2, text: 'Ravelry에서 찾았어요! 검색해보시면 비슷한 것들 많이 있을 거예요', mine: true, time: '3일 전 오전 10:15' },
  ],
}

export default function ChatDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const chatId = Number(id)
  const user = MOCK_CHATS.find(c => c.id === chatId) ?? MOCK_CHATS[0]
  const initialMessages = MOCK_MESSAGES[chatId] ?? MOCK_MESSAGES[1]

  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text) return
    const now = new Date()
    const time = `오후 ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages(prev => [...prev, { id: Date.now(), text, mine: true, time }])
    setInput('')
  }

  return (
    <div className="flex flex-col h-screen bg-[#fafafa] max-w-[393px] mx-auto">

      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-14 pb-3 bg-white border-b border-[#f0f0f0] shrink-0">
        <button onClick={() => router.back()} className="w-8 h-8 flex items-center justify-center shrink-0">
          <ChevronLeft size={24} className="text-[#212121]" />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0 relative"
          style={{ background: user.color }}
        >
          {user.avatar}
          {user.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[16px] font-bold text-[#212121] leading-none">{user.name}</p>
          <p className="text-[12px] mt-0.5" style={{ color: user.online ? '#3CB371' : '#b0b0b0' }}>
            {user.online ? '온라인' : '오프라인'}
          </p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center">
          <MoreVertical size={20} className="text-[#646464]" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((msg, i) => {
          const showAvatar = !msg.mine && (i === 0 || messages[i - 1].mine)
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${msg.mine ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* 상대방 아바타 */}
              {!msg.mine && (
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                  style={{ background: showAvatar ? user.color : 'transparent' }}
                >
                  {showAvatar ? user.avatar : ''}
                </div>
              )}

              <div className={`flex flex-col gap-1 max-w-[72%] ${msg.mine ? 'items-end' : 'items-start'}`}>
                {/* 말풍선 */}
                <div
                  className="px-4 py-2.5 rounded-[18px] text-[14px] leading-relaxed"
                  style={
                    msg.mine
                      ? { background: '#f72e00', color: '#fff', borderBottomRightRadius: 4 }
                      : { background: '#fff', color: '#212121', borderBottomLeftRadius: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }
                  }
                >
                  {msg.text}
                </div>
                {/* 시간 */}
                <span className="text-[11px] text-[#b0b0b0] px-1">{msg.time}</span>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="shrink-0 bg-white border-t border-[#f0f0f0] px-4 py-3 flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center shrink-0">
          <ImageIcon size={22} className="text-[#a7a7a7]" />
        </button>
        <div className="flex-1 flex items-center bg-[#f4f4f4] rounded-[22px] px-4 min-h-[40px]">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="메시지를 입력하세요"
            className="flex-1 bg-transparent text-[14px] text-[#212121] placeholder:text-[#b0b0b0] outline-none py-2"
          />
        </div>
        <button
          onClick={sendMessage}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
          style={{ background: input.trim() ? '#f72e00' : '#ededed' }}
        >
          <Send size={16} className={input.trim() ? 'text-white' : 'text-[#b0b0b0]'} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
