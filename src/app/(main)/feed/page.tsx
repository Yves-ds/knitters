'use client'
import { useState } from 'react'
import { Heart, MessageCircle, Bookmark, Share2, Plus } from 'lucide-react'
import { mockPosts } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import Link from 'next/link'

const STORY_USERS = [
  { id: '0', name: '내 스토리', isMe: true },
  { id: '1', name: '실뭉치언니' },
  { id: '2', name: '니팅러버' },
  { id: '3', name: '코바늘김씨' },
  { id: '4', name: '뜨개마을' },
]

export default function FeedPage() {
  const [posts, setPosts] = useState(mockPosts)
  const [activeTab, setActiveTab] = useState<'following' | 'explore'>('following')

  const toggleLike = (id: string) =>
    setPosts(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  const toggleSave = (id: string) =>
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p))

  return (
    <div className="page-container bg-white">
      <header className="sticky top-0 bg-white z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧶</span>
            <span className="text-lg font-bold text-dark">knitters</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/community/new" className="p-2 text-dark"><Plus size={22} /></Link>
            <button className="p-2 text-dark relative">
              <span className="text-xl">🔔</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
        <div className="flex px-4 gap-4">
          {(['following', 'explore'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-semibold border-b-2 transition-all ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-sub'}`}>
              {tab === 'following' ? '팔로잉' : '탐색'}
            </button>
          ))}
        </div>
      </header>

      {/* Stories */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 px-4 py-4" style={{ width: 'max-content' }}>
          {STORY_USERS.map((user, i) => (
            <div key={user.id} className="flex flex-col items-center gap-1.5 cursor-pointer">
              <div className={`w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 ${i === 0 ? 'border-dashed border-sub' : 'border-primary'}`}>
                {user.isMe ? <Plus size={22} className="text-sub" /> : <span className="text-xl">🧶</span>}
              </div>
              <span className="text-[10px] text-dark w-14 text-center truncate">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {posts.map(post => (
          <article key={post.id} className="bg-white">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar name={post.user.name} size="md" />
                <div>
                  <p className="text-sm font-semibold text-dark">{post.user.name}</p>
                  <p className="text-xs text-sub">@{post.user.username} · {post.createdAt}</p>
                </div>
              </div>
              <button className="text-sub px-2">···</button>
            </div>
            <div className="w-full aspect-square bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
              <span className="text-7xl opacity-30">🧶</span>
            </div>
            <div className="px-4 pt-3 pb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1.5">
                    <Heart size={22} className={post.liked ? 'text-primary fill-primary' : 'text-dark'} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5">
                    <MessageCircle size={22} className="text-dark" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  <Share2 size={22} className="text-dark" />
                </div>
                <button onClick={() => toggleSave(post.id)}>
                  <Bookmark size={22} className={post.saved ? 'text-primary fill-primary' : 'text-dark'} />
                </button>
              </div>
              <p className="text-sm text-dark leading-relaxed mb-2">
                <span className="font-semibold">{post.user.name}</span> {post.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map(tag => <span key={tag} className="text-xs text-primary font-medium">#{tag}</span>)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
