'use client'
import { useState } from 'react'
import { Settings, Grid, FolderOpen, Heart, ChevronRight, LogOut } from 'lucide-react'
import { mockProjects, mockPosts } from '@/lib/mockData'
import ProgressBar from '@/components/ui/ProgressBar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const ME = { name: '내 닉네임', username: 'my_knitters', bio: '뜨개질로 일상을 따뜻하게 🧶 대바늘/코바늘 모두 좋아해요', followers: 234, following: 128 }
const TABS = ['내 작품', '내 프로젝트', '저장'] as const

export default function MyPage() {
  const router = useRouter()
  const [tab, setTab] = useState<typeof TABS[number]>('내 작품')

  return (
    <div className="page-container bg-bg-light">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="text-base font-bold text-dark">마이페이지</span>
          <Link href="/mypage/settings"><Settings size={22} className="text-dark" /></Link>
        </div>
      </header>

      {/* Profile Section */}
      <div className="bg-white px-4 pt-6 pb-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-primary/10 flex items-center justify-center text-3xl flex-shrink-0">
            🧶
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-dark">{ME.name}</h2>
            <p className="text-sm text-sub">@{ME.username}</p>
          </div>
          <Link href="/mypage/edit" className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-dark">
            프로필 편집
          </Link>
        </div>

        <p className="text-sm text-dark leading-relaxed mb-4">{ME.bio}</p>

        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-lg font-bold text-dark">{mockProjects.length}</p>
            <p className="text-xs text-sub">프로젝트</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-dark">{ME.followers}</p>
            <p className="text-xs text-sub">팔로워</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-dark">{ME.following}</p>
            <p className="text-xs text-sub">팔로잉</p>
          </div>
        </div>
      </div>

      {/* Active Project */}
      {mockProjects.filter(p => p.status === '진행 중').length > 0 && (
        <div className="mx-4 mt-4 bg-white rounded-2xl p-4 border border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-sub uppercase tracking-wide">진행 중인 프로젝트</h3>
            <Link href="/projects" className="text-xs text-primary font-medium">전체 보기</Link>
          </div>
          {mockProjects.filter(p => p.status === '진행 중').slice(0, 1).map(p => (
            <Link key={p.id} href={`/projects/${p.id}`}>
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🧶</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-dark truncate mb-2">{p.title}</p>
                  <ProgressBar value={p.progress} showLabel />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Content Tabs */}
      <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden border border-border">
        <div className="flex border-b border-border">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-3 text-xs font-semibold transition-all ${tab === t ? 'text-primary border-b-2 border-primary' : 'text-sub'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === '내 작품' && (
          <div className="grid grid-cols-3 gap-0.5 bg-border">
            {mockPosts.map(post => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                  <span className="text-3xl opacity-30">🧶</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === '내 프로젝트' && (
          <div className="divide-y divide-border">
            {mockProjects.map(p => (
              <Link key={p.id} href={`/projects/${p.id}`}>
                <div className="flex items-center gap-3 px-4 py-3 active:bg-bg-light">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">🧶</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-dark truncate">{p.title}</p>
                    <p className="text-xs text-sub">{p.status} · {p.progress}%</p>
                  </div>
                  <ChevronRight size={16} className="text-sub" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {tab === '저장' && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-4xl mb-3">🔖</span>
            <p className="text-sm font-semibold text-dark mb-1">저장한 도안이 없어요</p>
            <p className="text-xs text-sub">마음에 드는 도안을 저장해보세요</p>
            <Link href="/explore" className="mt-4 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full">
              도안 탐색하기
            </Link>
          </div>
        )}
      </div>

      {/* Settings Menu */}
      <div className="mx-4 mt-4 mb-4 bg-white rounded-2xl overflow-hidden border border-border">
        {[
          { label: '알림 설정', icon: '🔔' },
          { label: '계정 설정', icon: '⚙️' },
          { label: '도움말', icon: '❓' },
        ].map(item => (
          <button key={item.label} className="w-full flex items-center gap-4 px-4 py-4 border-b border-border last:border-0 active:bg-bg-light">
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-medium text-dark flex-1 text-left">{item.label}</span>
            <ChevronRight size={16} className="text-sub" />
          </button>
        ))}
        <button
          onClick={() => router.push('/onboarding')}
          className="w-full flex items-center gap-4 px-4 py-4 active:bg-bg-light"
        >
          <LogOut size={18} className="text-red-400" />
          <span className="text-sm font-medium text-red-400 flex-1 text-left">로그아웃</span>
        </button>
      </div>
    </div>
  )
}
