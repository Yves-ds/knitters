import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mockProjects } from '@/lib/mockData'

// localStorage 용량 초과(QuotaExceededError) 시 에러가 addProject까지 전파되지 않도록 감쌈
const safeLocalStorage = {
  getItem: (name: string) => {
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string) => {
    try { localStorage.setItem(name, value) } catch { /* quota exceeded — 메모리에만 유지 */ }
  },
  removeItem: (name: string) => {
    try { localStorage.removeItem(name) } catch {}
  },
}

export interface Project {
  id: string
  title: string
  status: string       // '준비 중' | '뜨는 중' | '쉬는 중' | '완성'
  startDate: string
  endDate: string
  content: string
  emoji: string
  timerSecs: number
  createdAt: number    // Date.now()
  coverPhoto?: string  // 대표 사진 data URL
  videos: string[]     // YouTube URL 목록
  pdfUrl: string | null // 도안 PDF URL
  isShared?: boolean
}

// mockProjects를 스토어 초기값으로 변환
const initialProjects: Project[] = mockProjects.map(p => ({
  id: p.id,
  title: p.title,
  status: p.status,
  startDate: p.startDate ?? '',
  endDate: (p as any).endDate ?? '',
  content: p.memo ?? '',
  emoji: (p as any).emoji ?? '🧶',
  timerSecs: 0,
  createdAt: Date.now() - parseInt(p.id) * 1000,
  videos: [],
  pdfUrl: null,
}))

interface ProjectStore {
  projects: Project[]
  addProject: (p: Omit<Project, 'id' | 'createdAt'>) => string
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: initialProjects,
      addProject: (p) => {
        const id = String(Date.now())
        set((state) => ({
          projects: [
            { ...p, id, createdAt: Date.now() },
            ...state.projects,
          ],
        }))
        return id
      },
      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter(p => p.id !== id),
        })),
    }),
    { name: 'knitters-projects', storage: createJSONStorage(() => safeLocalStorage) }
  )
)
