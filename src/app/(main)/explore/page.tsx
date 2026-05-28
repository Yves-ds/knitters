'use client'
import { useState } from 'react'
import { Search, Heart, SlidersHorizontal } from 'lucide-react'
import { mockPatterns } from '@/lib/mockData'
import Link from 'next/link'

const CATEGORIES = ['전체', '의류', '가방', '모자', '홈데코', '소품', '인형']
const DIFFICULTIES = ['전체', '입문', '초급', '중급', '고급']

export default function ExplorePage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('전체')
  const [difficulty, setDifficulty] = useState('전체')
  const [savedPatterns, setSavedPatterns] = useState<string[]>([])

  const filtered = mockPatterns.filter(p => {
    const matchSearch = !search || p.title.includes(search) || p.tags.some(t => t.includes(search))
    const matchCat = category === '전체' || p.category === category
    const matchDiff = difficulty === '전체' || p.difficulty === difficulty
    return matchSearch && matchCat && matchDiff
  })

  const toggleSave = (id: string) =>
    setSavedPatterns(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  return (
    <div className="page-container bg-bg-light">
      <header className="bg-white sticky top-0 z-40 border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-base font-bold text-dark">도안 탐색</h1>
          <button className="p-2 -mr-2 text-dark"><SlidersHorizontal size={20} /></button>
        </div>
        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-3 bg-bg-light rounded-xl px-4 py-2.5">
            <Search size={18} className="text-sub flex-shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm text-dark placeholder-sub focus:outline-none"
              placeholder="도안, 카테고리, 태그 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        {/* Category Filter */}
        <div className="overflow-x-auto">
          <div className="flex gap-2 px-4 pb-3" style={{ width: 'max-content' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${category === c ? 'bg-primary text-white' : 'bg-bg-light text-sub'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        {/* Difficulty Filter */}
        <div className="overflow-x-auto border-t border-border">
          <div className="flex gap-2 px-4 py-2" style={{ width: 'max-content' }}>
            <span className="text-xs text-sub py-1 flex items-center">난이도:</span>
            {DIFFICULTIES.map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${difficulty === d ? 'bg-dark text-white' : 'bg-bg-light text-sub'}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Pattern Grid */}
      <div className="p-4">
        <p className="text-xs text-sub mb-3">{filtered.length}개의 도안</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(pattern => (
            <Link key={pattern.id} href={`/explore/${pattern.id}`}>
              <div className="bg-white rounded-2xl overflow-hidden border border-border active:scale-[0.98] transition-all">
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-primary/15 flex items-center justify-center relative">
                  <span className="text-5xl opacity-25">🧶</span>
                  <button onClick={e => { e.preventDefault(); toggleSave(pattern.id) }}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm">
                    <Heart size={15} className={savedPatterns.includes(pattern.id) ? 'text-primary fill-primary' : 'text-sub'} />
                  </button>
                  {pattern.price === 0 && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">FREE</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-dark leading-tight mb-1">{pattern.title}</h3>
                  <p className="text-xs text-sub mb-2">{pattern.author}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      pattern.difficulty === '입문' ? 'bg-green-50 text-green-600' :
                      pattern.difficulty === '초급' ? 'bg-blue-50 text-blue-600' :
                      pattern.difficulty === '중급' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-red-50 text-red-600'
                    }`}>{pattern.difficulty}</span>
                    <span className="text-sm font-bold text-primary">
                      {pattern.price === 0 ? '무료' : `${pattern.price.toLocaleString()}원`}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Heart size={12} className="text-sub" />
                    <span className="text-xs text-sub">{pattern.likes.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
