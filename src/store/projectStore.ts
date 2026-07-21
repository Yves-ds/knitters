import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { mockProjects } from '@/lib/mockData'

const safeLocalStorage = {
  getItem: (name: string) => {
    try { return localStorage.getItem(name) } catch { return null }
  },
  setItem: (name: string, value: string) => {
    try { localStorage.setItem(name, value) } catch {}
  },
  removeItem: (name: string) => {
    try { localStorage.removeItem(name) } catch {}
  },
}

export interface YarnItem {
  id: string
  name: string
  brand: string
  color: string
  weight?: string
  photo?: string
}

export interface NeedleItem {
  id: string
  name: string
  brand: string
  size: string
  photo?: string
}

export interface GaugeItem {
  id: string
  stitches: string
  rows: string
  swatchWidth: string
  swatchHeight: string
  stitchType: string
  washing: string
}

export interface Project {
  id: string
  title: string
  status: string
  startDate: string
  endDate: string
  content: string
  emoji: string
  timerSecs: number
  createdAt: number
  coverPhoto?: string
  videos: string[]
  pdfUrl: string | null
  isShared?: boolean
  patternId?: string
  patternName?: string
  patternAuthor?: string
  patternSelectedSize?: string
  yarns?: YarnItem[]
  needles?: NeedleItem[]
  gauges?: GaugeItem[]
}

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
          projects: [{ ...p, id, createdAt: Date.now() }, ...state.projects],
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
