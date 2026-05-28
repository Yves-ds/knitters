'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, X } from 'lucide-react'

const POST_TYPES = ['작품 공유', 'WIP 공유', 'Q&A']

export default function NewPostPage() {
  const router = useRouter()
  const [postType, setPostType] = useState('작품 공유')
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(t => [...t, tagInput.trim().replace('#', '')])
      setTagInput('')
    }
  }
  const removeTag = (tag: string) => setTags(t => t.filter(t2 => t2 !== tag))

  return (
    <div className="min-h-screen bg-bg-light pb-8">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => router.back()} className="p-2 -ml-2"><ArrowLeft size={22} className="text-dark" /></button>
          <h1 className="text-base font-bold text-dark">새 게시글</h1>
          <button onClick={() => router.push('/community')} className="text-primary font-semibold text-sm px-3 py-1.5 bg-primary/10 rounded-full">
            게시
          </button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        {/* Post Type */}
        <div className="flex gap-2">
          {POST_TYPES.map(t => (
            <button key={t} onClick={() => setPostType(t)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${postType === t ? 'border-primary bg-primary/5 text-primary' : 'border-border text-sub bg-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer">
          <div className="w-12 h-12 bg-bg-light rounded-xl flex items-center justify-center">
            <Camera size={22} className="text-sub" />
          </div>
          <p className="text-sm text-sub">사진 추가하기</p>
          <p className="text-xs text-sub opacity-60">최대 10장</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-4">
          <textarea
            className="w-full text-sm text-dark leading-relaxed resize-none focus:outline-none min-h-[120px] placeholder-sub"
            placeholder={postType === 'Q&A' ? '궁금한 점을 자유롭게 질문해보세요!' : '작품에 대해 소개해주세요. 사용한 실, 도안, 팁 등을 공유해보세요 🧶'}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="border-t border-border pt-3 mt-3">
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  #{tag}
                  <button onClick={() => removeTag(tag)}><X size={12} /></button>
                </span>
              ))}
            </div>
            <input
              className="w-full text-sm text-dark focus:outline-none placeholder-sub"
              placeholder="#태그 추가 (Enter)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={addTag}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
