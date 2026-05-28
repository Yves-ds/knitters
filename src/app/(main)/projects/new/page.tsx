'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera } from 'lucide-react'

const CATEGORIES = ['스웨터','카디건','모자','장갑','양말','가방','담요','인형','소품','기타']
const NEEDLE_TYPES = ['대바늘','코바늘','튜닝바늘']

export default function NewProjectPage() {
  const router = useRouter()
  const [form, setForm] = useState({ title:'', yarn:'', needle:'', needleSize:'', status:'시작 전', targetRows:'', memo:'', category:'' })
  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen bg-bg-light pb-8">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => router.back()} className="p-2 -ml-2"><ArrowLeft size={22} className="text-dark" /></button>
          <h1 className="text-base font-bold text-dark">새 프로젝트</h1>
          <button onClick={() => router.push('/projects')} className="text-primary font-semibold text-sm">저장</button>
        </div>
      </header>

      <div className="px-4 pt-4 space-y-4">
        <div className="bg-white rounded-2xl border-2 border-dashed border-border aspect-video flex flex-col items-center justify-center gap-3 cursor-pointer active:bg-bg-light">
          <div className="w-12 h-12 bg-bg-light rounded-xl flex items-center justify-center">
            <Camera size={22} className="text-sub" />
          </div>
          <p className="text-sm text-sub">사진 추가하기</p>
        </div>

        <div className="bg-white rounded-2xl p-4 space-y-4">
          <h2 className="text-sm font-bold text-dark">기본 정보</h2>
          <input className="input-field" placeholder="프로젝트 이름 (예: 아이보리 스웨터)" value={form.title} onChange={e => update('title', e.target.value)} />
          <div>
            <label className="text-xs text-sub mb-2 block">진행 상태</label>
            <div className="flex gap-2">
              {['시작 전','진행 중','완료'].map(s => (
                <button key={s} onClick={() => update('status', s)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.status === s ? 'border-primary bg-primary/5 text-primary' : 'border-border text-sub'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-sub mb-2 block">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => update('category', c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${form.category === c ? 'border-primary bg-primary/5 text-primary' : 'border-border text-sub'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 space-y-4">
          <h2 className="text-sm font-bold text-dark">재료 정보</h2>
          <input className="input-field" placeholder="사용 실 (예: Drops Lima / 아이보리)" value={form.yarn} onChange={e => update('yarn', e.target.value)} />
          <div className="grid grid-cols-2 gap-3">
            <select className="input-field" value={form.needle} onChange={e => update('needle', e.target.value)}>
              <option value="">바늘 종류</option>
              {NEEDLE_TYPES.map(n => <option key={n}>{n}</option>)}
            </select>
            <input className="input-field" placeholder="사이즈 (예: 4.5mm)" value={form.needleSize} onChange={e => update('needleSize', e.target.value)} />
          </div>
          <input className="input-field" type="number" placeholder="목표 단수 (선택)" value={form.targetRows} onChange={e => update('targetRows', e.target.value)} />
        </div>

        <div className="bg-white rounded-2xl p-4">
          <h2 className="text-sm font-bold text-dark mb-3">메모</h2>
          <textarea className="input-field resize-none" rows={4} placeholder="도안 메모, 수정 사항 등을 기록해보세요" value={form.memo} onChange={e => update('memo', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
