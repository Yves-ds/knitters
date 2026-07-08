import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CommunityPost, COMMUNITY_POSTS } from '@/lib/communityData'

interface CommunityStore {
  posts: CommunityPost[]
  addPost: (post: Omit<CommunityPost, 'id' | 'time' | 'views' | 'likes' | 'comments' | 'date' | 'avatarColor'>) => string
}

const AVATAR_COLORS = ['#C9956C', '#E07B4F', '#A0785A', '#D4A373', '#B5838D', '#6B9080', '#E76F51', '#8B9D77']

function todayLabel() {
  const d = new Date()
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}

const safeStorage = {
  getItem: (key: string) => {
    try { return localStorage.getItem(key) } catch { return null }
  },
  setItem: (key: string, value: string) => {
    try { localStorage.setItem(key, value) } catch {}
  },
  removeItem: (key: string) => {
    try { localStorage.removeItem(key) } catch {}
  },
}

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set) => ({
      posts: COMMUNITY_POSTS,
      addPost: (post) => {
        const id = String(Date.now())
        const avatarColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
        const newPost: CommunityPost = {
          id,
          time: '방금 전',
          views: 0,
          likes: 0,
          comments: 0,
          date: todayLabel(),
          avatarColor,
          ...post,
        }
        set(s => ({ posts: [newPost, ...s.posts] }))
        return id
      },
    }),
    {
      name: 'community-store',
      storage: createJSONStorage(() => safeStorage),
    }
  )
)
