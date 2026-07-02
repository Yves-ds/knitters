'use client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Bookmark, Share2, ExternalLink } from 'lucide-react'
import { mockPatterns } from '@/lib/mockData'
import { useState } from 'react'
import Badge from '@/components/ui/Badge'

function HeartIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="20" height="20" viewBox="0 0 18 19" fill="none">
      <path d="M15.3931 10.716C13.5181 14.9989 8.92815 17.2076 8.73315 17.3026C8.58368 17.3644 8.41762 17.3644 8.26815 17.3026C8.08065 17.2076 3.48315 14.9989 1.60815 10.716C0.445649 8.04806 1.09065 5.17431 2.35815 3.93931C2.80212 3.53771 3.32999 3.25298 3.89842 3.10848C4.46685 2.96398 5.05965 2.96384 5.62815 3.10806C6.7914 3.38717 7.80728 4.13042 8.46315 5.18222C9.12023 4.12816 10.1393 3.38453 11.3056 3.10806C11.8741 2.96384 12.4669 2.96398 13.0354 3.10848C13.6038 3.25298 14.1317 3.53771 14.5756 3.93931C15.9106 5.17431 16.5631 8.04806 15.3931 10.716Z" fill="#FBB4A4"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21.1894 12.6826C18.6894 18.0926 12.5694 20.8826 12.3094 21.0026C12.1101 21.0806 11.8887 21.0806 11.6894 21.0026C11.4394 20.8826 5.3094 18.0926 2.8094 12.6826C1.2594 9.31256 2.1194 5.68256 3.8094 4.12256C4.40136 3.61528 5.10518 3.25562 5.8631 3.0731C6.62101 2.89057 7.4114 2.89039 8.1694 3.07256C9.7204 3.42512 11.0749 4.36396 11.9494 5.69256C12.8255 4.36111 14.1843 3.42179 15.7394 3.07256C16.4974 2.89039 17.2878 2.89057 18.0457 3.0731C18.8036 3.25562 19.5074 3.61528 20.0994 4.12256C21.8794 5.68256 22.7494 9.31256 21.1894 12.6826Z" fill="#E3E2E2"/>
    </svg>
  )
}

const DIFFICULTY_VARIANT: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  '입문': 'success', '초급': 'default', '중급': 'warning', '고급': 'primary'
}

export default function PatternDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const pattern = mockPatterns.find(p => p.id === id) ?? mockPatterns[0]
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(pattern.likes)
  const [saved, setSaved] = useState(false)

  const toggleLike = () => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1) }

  return (
    <div className="min-h-screen bg-bg-light pb-24">
      <div className="relative w-full aspect-square bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
        <span className="text-8xl opacity-20">🧶</span>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
            <ArrowLeft size={20} className="text-dark" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setSaved(s => !s)} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
              <Bookmark size={18} className={saved ? 'text-primary fill-primary' : 'text-dark'} />
            </button>
            <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
              <Share2 size={18} className="text-dark" />
            </button>
          </div>
        </div>
        {pattern.price === 0 && (
          <span className="absolute top-4 left-16 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">FREE</span>
        )}
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h1 className="text-lg font-bold text-dark leading-tight mb-1">{pattern.title}</h1>
              <p className="text-sm text-sub">by {pattern.author}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-primary">{pattern.price === 0 ? '무료' : `${pattern.price.toLocaleString()}원`}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Badge label={pattern.difficulty} variant={DIFFICULTY_VARIANT[pattern.difficulty]} />
            <span className="tag">{pattern.category}</span>
            {pattern.tags.map(tag => <span key={tag} className="text-xs text-primary font-medium">#{tag}</span>)}
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <button onClick={toggleLike} className="flex items-center gap-2">
              <HeartIcon active={liked} />
              <span className="text-sm text-sub">{likes.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-2">
              <Bookmark size={20} className={saved ? 'text-primary fill-primary' : 'text-sub'} />
              <span className="text-sm text-sub">저장</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-dark mb-4">도안 정보</h2>
          <div className="space-y-3">
            {[
              { label: '카테고리', value: pattern.category },
              { label: '난이도', value: pattern.difficulty },
              { label: '작성자', value: pattern.author },
              { label: '가격', value: pattern.price === 0 ? '무료' : `${pattern.price.toLocaleString()}원` },
            ].map(item => (
              <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-sub">{item.label}</span>
                <span className="text-sm font-medium text-dark">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-dark mb-3">도안 설명</h2>
          <p className="text-sm text-dark leading-relaxed">
            초보자도 쉽게 따라 할 수 있는 기초 패턴으로 구성되어 있습니다.
            상세한 단계별 설명과 함께 제공되며, 완성 시 완성도 높은 작품을 만들 수 있습니다.
            필요한 실과 바늘 정보는 도안 내에 상세히 안내되어 있습니다.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 pb-6 pt-3 bg-white border-t border-border">
        <button className="btn-primary rounded-2xl py-4 flex items-center justify-center gap-2 text-base">
          {pattern.price === 0 ? '무료 다운로드' : `${pattern.price.toLocaleString()}원 구매하기`}
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  )
}
