'use client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Camera, Plus, Minus } from 'lucide-react'
import { mockProjects } from '@/lib/mockData'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { useState } from 'react'

const statusVariant: Record<string, 'default' | 'primary' | 'success' | 'warning'> = {
  '진행 중': 'primary', '완료': 'success', '시작 전': 'warning',
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const project = mockProjects.find(p => p.id === id) ?? mockProjects[0]
  const [rows, setRows] = useState(project.rows)

  return (
    <div className="min-h-screen bg-bg-light pb-8">
      <div className="relative w-full aspect-square bg-gradient-to-br from-primary/10 to-primary/25 flex items-center justify-center">
        <span className="text-8xl opacity-25">🧶</span>
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => router.back()} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
            <ArrowLeft size={20} className="text-dark" />
          </button>
          <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
            <Edit size={18} className="text-dark" />
          </button>
        </div>
        <button className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
          <Camera size={18} className="text-dark" />
        </button>
      </div>

      <div className="px-4 -mt-4 relative z-10 space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <h1 className="text-lg font-bold text-dark flex-1 pr-2 leading-tight">{project.title}</h1>
            <Badge label={project.status} variant={statusVariant[project.status]} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
          </div>
        </div>

        {project.status !== '시작 전' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-bold text-dark mb-4">진행 현황</h2>
            <ProgressBar value={project.progress} showLabel />
            <div className="mt-5 flex items-center justify-between">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{rows}</p>
                <p className="text-xs text-sub mt-1">완료 단수</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setRows(r => Math.max(0, r - 1))} className="w-10 h-10 bg-bg-light rounded-full flex items-center justify-center active:scale-95">
                  <Minus size={16} className="text-dark" />
                </button>
                <button onClick={() => setRows(r => r + 1)} className="w-10 h-10 bg-primary rounded-full flex items-center justify-center active:scale-95 shadow-sm shadow-primary/30">
                  <Plus size={16} className="text-white" strokeWidth={2.5} />
                </button>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-sub">{project.targetRows}</p>
                <p className="text-xs text-sub mt-1">목표 단수</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-dark mb-4">재료 정보</h2>
          <div className="space-y-3">
            {[
              { label: '사용 실', value: project.yarn },
              { label: '바늘 사이즈', value: project.needle },
              { label: '시작일', value: project.startDate || '미정' },
            ].map(info => (
              <div key={info.label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-sub">{info.label}</span>
                <span className="text-sm font-medium text-dark">{info.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-dark mb-3">메모</h2>
          {project.memo
            ? <p className="text-sm text-dark leading-relaxed">{project.memo}</p>
            : <button className="w-full py-4 border-2 border-dashed border-border rounded-xl text-sm text-sub text-center">+ 메모 추가하기</button>
          }
        </div>
      </div>
    </div>
  )
}
