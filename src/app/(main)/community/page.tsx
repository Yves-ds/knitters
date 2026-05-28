'use client'
import { useState } from 'react'
import { Plus, MessageSquare, Eye, ChevronRight } from 'lucide-react'
import { mockPosts, mockQnA } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import Link from 'next/link'

const TABS = ['작품 피드', 'Q&A'] as const

export default function CommunityPage() {
  const [tab, setTab] = useState<typeof TABS[number]>('작품 피드')

  return (
    <div className="page-container bg-bg-light">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-base font-bold text-dark">커뮤니티</h1>
          <Link href="/community/new" className="flex items-center gap-1.5 text-primary font-semibold text-sm">
            <Plus size={18} />글쓰기
          </Link>
        </div>
        <div className="flex px-4 gap-6">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${tab === t ? 'border-primary text-primary' : 'border-transparent text-sub'}`}>
              {t}
            </button>
          ))}
        </div>
      </header>

      {tab === '작품 피드' && (
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {mockPosts.map(post => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <div className="bg-white rounded-2xl overflow-hidden border border-border active:scale-[0.98] transition-all">
                  <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                    <span className="text-5xl opacity-30">🧶</span>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar name={post.user.name} size="sm" />
                      <span className="text-xs font-medium text-dark truncate">{post.user.name}</span>
                    </div>
                    <p className="text-xs text-sub line-clamp-2 leading-relaxed">{post.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-sub">❤️ {post.likes}</span>
                      <span className="text-xs text-sub">💬 {post.comments}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {tab === 'Q&A' && (
        <div className="divide-y divide-border bg-white mt-0">
          {mockQnA.map(q => (
            <Link key={q.id} href={`/community/qna/${q.id}`}>
              <div className="px-4 py-4 active:bg-bg-light transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar name={q.user.name} size="sm" />
                  <span className="text-xs text-sub">{q.user.name} · {q.createdAt}</span>
                </div>
                <h3 className="text-sm font-semibold text-dark mb-1 leading-snug">{q.title}</h3>
                <p className="text-xs text-sub mb-3 line-clamp-1">{q.content}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <MessageSquare size={13} className="text-sub" />
                    <span className="text-xs text-sub">{q.answers}개 답변</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={13} className="text-sub" />
                    <span className="text-xs text-sub">{q.views}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 ml-auto">
                    {q.tags.map(tag => <span key={tag} className="text-xs text-primary font-medium">#{tag}</span>)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link href="/community/new"
        className="fixed bottom-24 right-4 w-14 h-14 bg-primary rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center z-30 active:scale-95 transition-all">
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </Link>
    </div>
  )
}
