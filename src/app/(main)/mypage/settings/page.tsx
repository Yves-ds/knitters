'use client'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const SETTINGS_SECTIONS: Array<{ title: string; items: Array<{ label: string; desc?: string }> }> = [
  {
    title: '알림',
    items: [
      { label: '좋아요 알림', desc: '내 게시글에 좋아요가 달릴 때' },
      { label: '댓글 알림', desc: '내 게시글에 댓글이 달릴 때' },
      { label: '팔로우 알림', desc: '새 팔로워가 생길 때' },
    ]
  },
  {
    title: '계정',
    items: [
      { label: '비밀번호 변경' },
      { label: '연결된 소셜 계정' },
      { label: '개인정보 처리방침' },
      { label: '서비스 이용약관' },
    ]
  },
]

export default function SettingsPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-bg-light pb-8">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center h-14 px-4 gap-2">
          <button onClick={() => router.back()} className="p-2 -ml-2"><ArrowLeft size={22} className="text-dark" /></button>
          <h1 className="text-base font-bold text-dark">설정</h1>
        </div>
      </header>
      <div className="px-4 pt-4 space-y-4">
        {SETTINGS_SECTIONS.map(section => (
          <div key={section.title} className="bg-white rounded-2xl overflow-hidden border border-border">
            <div className="px-4 py-3 border-b border-border">
              <h2 className="text-xs font-bold text-sub uppercase tracking-wide">{section.title}</h2>
            </div>
            {section.items.map(item => (
              <button key={item.label} className="w-full flex items-center gap-3 px-4 py-4 border-b border-border last:border-0 active:bg-bg-light text-left">
                <div className="flex-1">
                  <p className="text-sm font-medium text-dark">{item.label}</p>
                  {item.desc && <p className="text-xs text-sub mt-0.5">{item.desc}</p>}
                </div>
                <ChevronRight size={16} className="text-sub" />
              </button>
            ))}
          </div>
        ))}
        <div className="bg-white rounded-2xl overflow-hidden border border-border">
          <button className="w-full px-4 py-4 text-sm font-medium text-red-400 text-left active:bg-bg-light">
            계정 삭제
          </button>
        </div>
        <p className="text-center text-xs text-sub py-2">knitters v1.0.0</p>
      </div>
    </div>
  )
}
