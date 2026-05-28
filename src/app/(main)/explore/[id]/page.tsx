'use client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, Bookmark, Share2, ExternalLink } from 'lucide-react'
import { mockPatterns } from '@/lib/mockData'
import { useState } from 'react'
import Badge from '@/components/ui/Badge'

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
              <Heart size={20} className={liked ? 'text-primary fill-primary' : 'text-sub'} />
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

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 pb-6 pt-3 bg-white border-t border-border">
        <button className="btn-primary rounded-2xl py-4 flex items-center justify-center gap-2 text-base">
          {pattern.price === 0 ? '무료 다운로드' : `${pattern.price.toLocaleString()}원 구매하기`}
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  )
}
