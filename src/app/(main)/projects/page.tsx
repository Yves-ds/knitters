'use client'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { mockProjects } from '@/lib/mockData'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

const STATUS_FILTER = ['전체', '진행 중', '완료', '시작 전']
const statusVariant: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  '진행 중': 'primary', '완료': 'success', '시작 전': 'warning',
}
const STATUS_EMOJI: Record<string, string> = { '진행 중': '🧶', '완료': '✅', '시작 전': '⏳' }

export default function ProjectsPage() {
  const [filter, setFilter] = useState('전체')
  const filtered = filter === '전체' ? mockProjects : mockProjects.filter(p => p.status === filter)
  const stats = {
    total: mockProjects.length,
    inProgress: mockProjects.filter(p => p.status === '진행 중').length,
    done: mockProjects.filter(p => p.status === '완료').length,
  }

  return (
    <div className="page-container bg-bg-light">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-base font-bold text-dark">내 프로젝트</h1>
          <Link href="/projects/new" className="flex items-center gap-1.5 text-primary font-semibold text-sm">
            <Plus size={18} />새 프로젝트
          </Link>
        </div>
      </header>

      <div className="bg-white px-4 py-5 border-b border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-2xl font-bold text-dark">{stats.total}</p><p className="text-xs text-sub mt-1">전체</p></div>
          <div><p className="text-2xl font-bold text-primary">{stats.inProgress}</p><p className="text-xs text-sub mt-1">진행 중</p></div>
          <div><p className="text-2xl font-bold text-green-500">{stats.done}</p><p className="text-xs text-sub mt-1">완료</p></div>
        </div>
      </div>

      <div className="bg-white border-b border-border overflow-x-auto">
        <div className="flex gap-2 px-4 py-3" style={{ width: 'max-content' }}>
          {STATUS_FILTER.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === s ? 'bg-primary text-white' : 'bg-bg-light text-sub'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 space-y-3">
        {filtered.map(project => (
          <Link key={project.id} href={`/projects/${project.id}`}>
            <div className="bg-white rounded-2xl overflow-hidden border border-border active:scale-[0.99] transition-all">
              <div className="w-full h-36 bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center">
                <span className="text-5xl opacity-30">{STATUS_EMOJI[project.status]}</span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-bold text-dark flex-1 pr-2 leading-tight">{project.title}</h3>
                  <Badge label={project.status} variant={statusVariant[project.status]} />
                </div>
                <div className="space-y-1 mb-3">
                  <p className="text-xs text-sub">실: {project.yarn}</p>
                  <p className="text-xs text-sub">바늘: {project.needle}</p>
                  {project.startDate && <p className="text-xs text-sub">시작일: {project.startDate}</p>}
                </div>
                {project.status !== '시작 전' && <ProgressBar value={project.progress} showLabel />}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/projects/new"
        className="fixed bottom-[100px] w-14 h-14 bg-primary rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center z-30 active:scale-95 transition-all"
        style={{ right: 'max(16px, calc(50% - 224px))' }}>
        <Plus size={26} className="text-white" strokeWidth={2.5} />
      </Link>
    </div>
  )
}
