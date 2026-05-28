'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'

export default function EditProfilePage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '내 닉네임', username: 'my_knitters', bio: '뜨개질로 일상을 따뜻하게 🧶' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen bg-bg-light pb-8">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => router.back()} className="p-2 -ml-2"><ArrowLeft size={22} className="text-dark" /></button>
          <h1 className="text-base font-bold text-dark">프로필 편집</h1>
          <button onClick={() => router.back()} className="text-primary font-semibold text-sm">저장</button>
        </div>
      </header>
      <div className="px-4 pt-6 space-y-4">
        {/* Avatar */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl">🧶</div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-sm">
              <Camera size={13} className="text-white" />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 space-y-4">
          <div>
            <label className="text-xs text-sub mb-1.5 block">닉네임</label>
            <input className="input-field" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div>
            <label className="text-xs text-sub mb-1.5 block">아이디</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sub text-sm">@</span>
              <input className="input-field pl-8" value={form.username} onChange={e => update('username', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="text-xs text-sub mb-1.5 block">소개</label>
            <textarea className="input-field resize-none" rows={3} value={form.bio} onChange={e => update('bio', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  )
}
