'use client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Send } from 'lucide-react'
import { mockPosts } from '@/lib/mockData'
import Avatar from '@/components/ui/Avatar'
import { useState } from 'react'

const MOCK_COMMENTS = [
  { id: '1', user: { name: '니팅러버', username: 'knitting.lover' }, text: '너무 예쁘다!! 실 정보 알 수 있을까요? 🧡', time: '1시간 전' },
  { id: '2', user: { name: '뜨개마을', username: 'knit_village' }, text: '케이블 패턴이 정말 섬세하네요. 도전해보고 싶어요!', time: '30분 전' },
]

export default function CommunityDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const post = mockPosts.find(p => p.id === id) ?? mockPosts[0]
  const [liked, setLiked] = useState(post.liked)
  const [likes, setLikes] = useState(post.likes)
  const [saved, setSaved] = useState(post.saved)
  const [comment, setComment] = useState('')

  const toggleLike = () => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1) }

  return (
    <div className="min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => router.back()} className="p-2 -ml-2"><ArrowLeft size={22} className="text-dark" /></button>
          <h1 className="text-sm font-bold text-dark">게시글</h1>
          <button className="p-2 -mr-2 text-sub">···</button>
        </div>
      </header>

      {/* Author */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar name={post.user.name} size="md" />
          <div>
            <p className="text-sm font-semibold text-dark">{post.user.name}</p>
            <p className="text-xs text-sub">@{post.user.username} · {post.createdAt}</p>
          </div>
        </div>
        <button className="px-4 py-1.5 border border-primary text-primary text-xs font-semibold rounded-full">팔로우</button>
      </div>

      {/* Image */}
      <div className="w-full aspect-square bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
        <span className="text-8xl opacity-25">🧶</span>
      </div>

      {/* Actions */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <button onClick={toggleLike} className="flex items-center gap-1.5">
              <Heart size={24} className={liked ? 'text-primary fill-primary' : 'text-dark'} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <button className="flex items-center gap-1.5">
              <MessageCircle size={24} className="text-dark" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            <Share2 size={24} className="text-dark" />
          </div>
          <button onClick={() => setSaved(s => !s)}>
            <Bookmark size={24} className={saved ? 'text-primary fill-primary' : 'text-dark'} />
          </button>
        </div>
        <p className="text-sm text-dark leading-relaxed mb-2">
          <span className="font-semibold">{post.user.name}</span> {post.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map(tag => <span key={tag} className="text-xs text-primary font-medium">#{tag}</span>)}
        </div>
      </div>

      {/* Comments */}
      <div className="border-t border-border px-4 pt-4 space-y-4">
        <h3 className="text-sm font-bold text-dark">댓글 {post.comments}개</h3>
        {MOCK_COMMENTS.map(c => (
          <div key={c.id} className="flex gap-3">
            <Avatar name={c.user.name} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-dark">{c.user.name}</span>
                <span className="text-xs text-sub">{c.time}</span>
              </div>
              <p className="text-sm text-dark leading-relaxed">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-border px-4 py-3 flex gap-3 items-center">
        <Avatar name="나" size="sm" />
        <input
          className="flex-1 bg-bg-light rounded-full px-4 py-2.5 text-sm focus:outline-none"
          placeholder="댓글을 입력하세요..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button className={`w-8 h-8 rounded-full flex items-center justify-center ${comment ? 'bg-primary' : 'bg-bg-light'} transition-colors`}>
          <Send size={15} className={comment ? 'text-white' : 'text-sub'} />
        </button>
      </div>
    </div>
  )
}
