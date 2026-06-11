'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useProjectStore } from '@/store/projectStore'

/* ── 상태 배지 ── */
function StatusBadge({ status }: { status: string }) {
  if (status === '뜨는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#DDEDFF' }}>
      <div className="flex items-end gap-[3px]" style={{ height: 14 }}>
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF' }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#209BFF' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#209BFF' }}>뜨는 중</span>
    </div>
  )
  if (status === '쉬는 중') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#FFEEEA' }}>
      <div className="flex items-center gap-[5px]">
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: '#F72E00' }} />
        <span className="w-[8px] h-[8px] rounded-full" style={{ background: '#F72E00' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#F72E00' }}>쉬는 중</span>
    </div>
  )
  if (status === '완성') return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#E9FFE6' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L19 7" stroke="#13C100" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[13px] font-semibold" style={{ color: '#13C100' }}>완성</span>
    </div>
  )
  return (
    <div className="flex items-center gap-1.5 h-8 px-3 rounded-[10px]" style={{ background: '#EDEDED' }}>
      <div className="flex items-center gap-[3px]">
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B' }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B', opacity: 0.5 }} />
        <span className="w-[7px] h-[7px] rounded-full" style={{ background: '#3B3B3B' }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: '#3B3B3B' }}>준비 중</span>
    </div>
  )
}

function CalendarStartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#cs2_clip)">
        <path fillRule="evenodd" clipRule="evenodd" d="M8.5 5C8.76522 5 9.01957 5.10536 9.20711 5.29289C9.39464 5.48043 9.5 5.73478 9.5 6V7H14.5V6C14.5 5.73478 14.6054 5.48043 14.7929 5.29289C14.9804 5.10536 15.2348 5 15.5 5C15.7652 5 16.0196 5.10536 16.2071 5.29289C16.3946 5.48043 16.5 5.73478 16.5 6V7H17.5C17.8978 7 18.2794 7.15804 18.5607 7.43934C18.842 7.72064 19 8.10218 19 8.5V9.5H5V8.5C5 8.10218 5.15804 7.72064 5.43934 7.43934C5.72064 7.15804 6.10218 7 6.5 7H7.5V6C7.5 5.73478 7.60536 5.48043 7.79289 5.29289C7.98043 5.10536 8.23478 5 8.5 5Z" fill="#F72E00"/>
        <path d="M5 9.5H19V17.5C19 17.8978 18.842 18.2794 18.5607 18.5607C18.2794 18.842 17.8978 19 17.5 19H6.5C6.10218 19 5.72064 18.842 5.43934 18.5607C5.15804 18.2794 5 17.8978 5 17.5V9.5Z" fill="#FFBAA9"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M12.4301 15.943C12.4301 16.0666 12.4668 16.1875 12.5354 16.2903C12.6041 16.3931 12.7017 16.4732 12.8159 16.5205C12.9302 16.5678 13.0558 16.5802 13.1771 16.5561C13.2983 16.532 13.4097 16.4724 13.4971 16.385L15.4061 14.476C15.4642 14.418 15.5102 14.3491 15.5417 14.2732C15.5731 14.1974 15.5892 14.1161 15.5892 14.034C15.5892 13.9519 15.5731 13.8706 15.5417 13.7948C15.5102 13.7189 15.4642 13.65 15.4061 13.592L13.4961 11.683C13.4087 11.5959 13.2974 11.5367 13.1763 11.5127C13.0552 11.4888 12.9298 11.5013 12.8157 11.5485C12.7017 11.5958 12.6043 11.6758 12.5356 11.7784C12.467 11.881 12.4303 12.0016 12.4301 12.125V13.285H9.03613C8.83722 13.285 8.64645 13.364 8.5058 13.5047C8.36515 13.6453 8.28613 13.8361 8.28613 14.035C8.28613 14.2339 8.36515 14.4247 8.5058 14.5653C8.64645 14.706 8.83722 14.785 9.03613 14.785H12.4301V15.943Z" fill="#F72E00"/>
      </g>
      <defs>
        <clipPath id="cs2_clip">
          <rect width="14" height="14" fill="white" transform="translate(5 5)"/>
        </clipPath>
      </defs>
    </svg>
  )
}

function formatDate(iso: string) {
  if (!iso) return null
  const [y, m, d] = iso.split('-')
  return `${y}.${m}.${d}`
}

/* ── YouTube helpers ── */
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?.*v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}
function getEmbedUrl(url: string): string | null {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}
function getThumbUrl(url: string): string | null {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null
}

/* ── PDF.js CDN 로더 ── */
const PDFJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
const PDFJS_WORKER_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
let _pdfJsPromise: Promise<any> | null = null
function loadPdfJs(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject('no window')
  const w = window as any
  if (w.pdfjsLib) return Promise.resolve(w.pdfjsLib)
  if (_pdfJsPromise) return _pdfJsPromise
  _pdfJsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = PDFJS_CDN
    script.onload = () => { w.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN; resolve(w.pdfjsLib) }
    script.onerror = (e) => { _pdfJsPromise = null; reject(e) }
    document.head.appendChild(script)
  })
  return _pdfJsPromise
}

function PdfViewer({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!url) return
    let cancelled = false
    ;(async () => {
      try {
        const pdfjsLib = await loadPdfJs()
        const pdf = await pdfjsLib.getDocument(url).promise
        if (cancelled || !containerRef.current) return
        const container = containerRef.current
        container.innerHTML = ''
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          if (cancelled) return
          const page = await pdf.getPage(pageNum)
          const containerWidth = container.clientWidth || 390
          const defaultVp = page.getViewport({ scale: 1 })
          const dpr = window.devicePixelRatio || 1
          const scale = (containerWidth / defaultVp.width) * dpr
          const viewport = page.getViewport({ scale })
          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = '100%'
          canvas.style.height = `${(defaultVp.height * containerWidth) / defaultVp.width}px`
          canvas.style.display = 'block'
          if (pageNum < pdf.numPages) canvas.style.borderBottom = '8px solid #F0F0F0'
          container.appendChild(canvas)
          const ctx = canvas.getContext('2d')!
          await page.render({ canvasContext: ctx, viewport }).promise
        }
      } catch (err) { console.error('PDF render error', err) }
    })()
    return () => { cancelled = true }
  }, [url])
  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto"
      style={{ touchAction: 'pan-y pinch-zoom' } as React.CSSProperties} />
  )
}

/* ── 도안 시트 (읽기 전용) ── */
function PatternSheet({ isOpen, onClose, pdfUrl }: {
  isOpen: boolean; onClose: () => void; pdfUrl: string | null
}) {
  return (
    <div
      className="fixed inset-y-0 w-full max-w-[480px] z-[60] bg-white flex flex-col"
      style={{
        left: '50%',
        transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
        transition: 'transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center px-5 pt-14 pb-4 border-b border-[#F0F0F0] relative flex-shrink-0">
        <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111]">도안</span>
        <button onClick={onClose} className="ml-auto w-8 h-8 flex items-center justify-center active:opacity-60">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {pdfUrl ? (
        <div className="flex-1 overflow-hidden min-h-0">
          <PdfViewer url={pdfUrl} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[14px] text-[#9CA3AF]">등록된 도안이 없어요</p>
        </div>
      )}
    </div>
  )
}

/* ── 영상 시트 (읽기 전용) ── */
function VideoSheet({ isOpen, onClose, videos }: {
  isOpen: boolean; onClose: () => void; videos: string[]
}) {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [titles, setTitles] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen && videos.length > 0 && !selectedUrl) setSelectedUrl(videos[0])
  }, [isOpen, videos, selectedUrl])

  useEffect(() => {
    videos.forEach(url => {
      if (titles[url]) return
      const id = getYouTubeId(url)
      if (!id) return
      fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
        .then(r => r.json())
        .then(d => setTitles(prev => ({ ...prev, [url]: d.title })))
        .catch(() => {})
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videos])

  const embedUrl = selectedUrl ? (getEmbedUrl(selectedUrl) ?? selectedUrl) : null

  return (
    <div
      className="fixed inset-y-0 w-full max-w-[480px] z-[60] bg-white flex flex-col"
      style={{
        left: '50%',
        transform: `translateX(-50%) translateY(${isOpen ? '0%' : '100%'})`,
        transition: 'transform 0.55s cubic-bezier(0.32, 0.72, 0, 1)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center justify-end px-5 pt-14 pb-4 border-b border-[#F0F0F0] relative flex-shrink-0">
        <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111]">동영상</span>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center active:opacity-60">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="w-full bg-black flex-shrink-0" style={{ aspectRatio: '16/9' }}>
        {embedUrl ? (
          <iframe key={embedUrl} src={embedUrl} className="w-full h-full border-none" allowFullScreen title="동영상" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-[13px] gap-1.5">
            <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="5" width="13" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.6" fill="none"/>
              <path d="M15 9L20 6V16L15 13" stroke="#9ca3af" strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
            영상을 선택해주세요
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-5 py-4">
          <span className="text-[15px] font-bold text-[#111]">저장된 동영상</span>
        </div>
        {videos.length === 0 ? (
          <p className="px-5 py-8 text-center text-[13px] text-[#9CA3AF]">저장된 동영상이 없어요</p>
        ) : videos.map((url, i) => {
          const thumb = getThumbUrl(url)
          const isSelected = selectedUrl === url
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-5 py-2.5 cursor-pointer active:bg-[#F9FAFB]"
              style={{ background: isSelected ? '#FFF5F4' : undefined }}
              onClick={() => setSelectedUrl(url)}
            >
              {thumb ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={thumb} alt="" className="w-[112px] h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-[112px] h-16 rounded-lg bg-[#E5E7EB] flex-shrink-0 flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 22 22" fill="none">
                    <rect x="2" y="5" width="13" height="12" rx="2" stroke="#9ca3af" strokeWidth="1.6" fill="none"/>
                    <path d="M15 9L20 6V16L15 13" stroke="#9ca3af" strokeWidth="1.6" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
              <span className="flex-1 text-[13px] text-[#111] font-medium leading-snug line-clamp-2">
                {titles[url] || url}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════ */
export default function ProjectDetailPage() {
  const params = useParams()
  const rawId = params?.id
  const id = Array.isArray(rawId) ? rawId[0] : rawId
  const router = useRouter()

  const project = useProjectStore(s => s.projects.find(p => p.id === id))
  const updateProject = useProjectStore(s => s.updateProject)
  const deleteProject = useProjectStore(s => s.deleteProject)

  const [patternOpen, setPatternOpen] = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [showBubble, setShowBubble] = useState(false)
  const [timerSecs, setTimerSecs] = useState(0)
  const [timerRunning, setTimerRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 프로젝트 로드 시 타이머 초기화
  useEffect(() => {
    if (project) setTimerSecs(project.timerSecs)
  }, [project?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => setTimerSecs(s => s + 1), 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerRunning])

  // timerSecs가 바뀔 때마다 스토어에 즉시 저장 → 페이지 이탈해도 유실 없음
  useEffect(() => {
    if (id) updateProject(id, { timerSecs })
  }, [timerSecs]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleShareToggle = () => {
    if (!project) return
    const next = !project.isShared
    updateProject(project.id, { isShared: next })
    if (next) {
      setShowBubble(true)
      setTimeout(() => setShowBubble(false), 2000)
    }
  }

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white max-w-[480px] mx-auto">
        <p className="text-[14px] text-[#9CA3AF]">프로젝트를 찾을 수 없어요</p>
      </div>
    )
  }

  const dateLabel = (() => {
    const s = formatDate(project.startDate)
    const e = formatDate(project.endDate)
    if (s && e) return `${s} ~ ${e}`
    return s ?? null
  })()

  const hasVideos = (project.videos ?? []).length > 0
  const hasPdf = !!project.pdfUrl

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col max-w-[480px] mx-auto">

        {/* 헤더 */}
        <div className="flex items-center px-4 pt-14 pb-3">
          <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center">
            <ChevronLeft size={22} className="text-[#646464]" />
          </button>
          <h1 className="flex-1 text-center text-[18px] font-semibold text-[#212121] truncate px-2">
            {project.title}
          </h1>
          {/* 미트볼 메뉴 */}
          <div className="relative w-8 shrink-0">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-8 flex items-center justify-end active:opacity-60"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="4" cy="10" r="1.5" fill="#646464"/>
                <circle cx="10" cy="10" r="1.5" fill="#646464"/>
                <circle cx="16" cy="10" r="1.5" fill="#646464"/>
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div
                  className="absolute top-8 right-0 bg-white rounded-[14px] z-50 overflow-hidden"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.13)', minWidth: 140 }}
                >
                  <button
                    onClick={() => { setMenuOpen(false); router.push(`/projects/${id}/edit`) }}
                    className="w-full px-4 py-3.5 text-left text-[14px] text-[#212121] active:bg-[#F5F5F5]"
                  >
                    기록 수정
                  </button>
                  <div className="h-px bg-[#F5F5F5]" />
                  <button
                    onClick={() => { setMenuOpen(false); setDeleteOpen(true) }}
                    className="w-full px-4 py-3.5 text-left text-[14px] text-[#F72E00] active:bg-[#FFF5F4]"
                  >
                    기록 삭제
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* 상태·날짜 배지 */}
        <div className="flex items-center gap-2 px-4 pb-4">
          <StatusBadge status={project.status} />
          {dateLabel && (
            <div className="flex items-center gap-[4px] h-8 px-[8px] rounded-[10px]" style={{ background: '#FFEEEA' }}>
              <CalendarStartIcon />
              <span className="text-[12px] text-black" style={{ letterSpacing: '0.6px', fontWeight: 500 }}>
                {dateLabel}
              </span>
            </div>
          )}
        </div>

        {/* 콘텐츠 영역 */}
        <div
          className="flex-1 px-4 pb-[88px] overflow-y-auto detail-content"
          dangerouslySetInnerHTML={{ __html: project.content }}
          style={{ fontSize: 15, lineHeight: '1.6', color: '#212121', wordBreak: 'break-word' }}
        />

        {/* 하단 컨테이너 */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white z-20">
          <div className="border-t border-[#F0F0F0] flex items-center px-5" style={{ height: 80, gap: 16 }}>

            {/* 영상 버튼 */}
            <button
              onClick={() => setVideoOpen(true)}
              className="flex items-center gap-[8px] active:opacity-50"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M15 9.649L20.646 7.512C20.7974 7.45469 20.9605 7.43499 21.1212 7.45462C21.2819 7.47424 21.4355 7.53259 21.5686 7.62466C21.7018 7.71673 21.8107 7.83975 21.8858 7.98317C21.9609 8.12658 22.0001 8.28609 22 8.448V15.557C21.9999 15.7185 21.9607 15.8777 21.8858 16.0207C21.8108 16.1638 21.7023 16.2866 21.5695 16.3786C21.4367 16.4706 21.2836 16.5291 21.1233 16.549C20.963 16.5689 20.8003 16.5497 20.649 16.493L15 14.375V16C15 16.5304 14.7893 17.0391 14.4142 17.4142C14.0391 17.7893 13.5304 18 13 18H4C3.46957 18 2.96086 17.7893 2.58579 17.4142C2.21071 17.0391 2 16.5304 2 16V8C2 7.46957 2.21071 6.96086 2.58579 6.58579C2.96086 6.21071 3.46957 6 4 6H13C13.5304 6 14.0391 6.21071 14.4142 6.58579C14.7893 6.96086 15 7.46957 15 8V9.649Z" fill={hasVideos ? '#F72E00' : '#838383'}/>
              </svg>
              <span className="text-[15px] font-normal" style={{ color: hasVideos ? '#F72E00' : '#646464' }}>영상</span>
            </button>

            {/* 도안 버튼 */}
            <button
              onClick={() => setPatternOpen(true)}
              className="flex items-center gap-[8px] active:opacity-50"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M7.5 5C7.10218 5 6.72064 5.15804 6.43934 5.43934C6.15804 5.72065 6 6.10218 6 6.5V17.5C6 17.8978 6.15804 18.2794 6.43934 18.5607C6.72064 18.842 7.10218 19 7.5 19H16.5C16.8978 19 17.2794 18.842 17.5607 18.5607C17.842 18.2794 18 17.8978 18 17.5V10C18.0001 9.9343 17.9873 9.86921 17.9622 9.80847C17.9372 9.74773 17.9004 9.69252 17.854 9.646L13.354 5.146C13.3075 5.0996 13.2523 5.06282 13.1915 5.03777C13.1308 5.01272 13.0657 4.99988 13 5H7.5Z" fill={hasPdf ? '#F72E00' : '#838383'}/>
                <path d="M18 10C18.0001 9.9343 17.9873 9.86921 17.9622 9.80847C17.9372 9.74773 17.9004 9.69252 17.854 9.646L13.354 5.146C13.3075 5.0996 13.2523 5.06282 13.1915 5.03777C13.1308 5.01272 13.0657 4.99988 13 5V9.5C13 9.63261 13.0527 9.75979 13.1464 9.85355C13.2402 9.94732 13.3674 10 13.5 10H18Z" fill={hasPdf ? '#FFC2B4' : '#D2D2D2'}/>
              </svg>
              <span className="text-[15px] font-normal" style={{ color: hasPdf ? '#F72E00' : '#646464' }}>도안</span>
            </button>

            {/* 공유 버튼 + 말풍선 */}
            <div className="relative">
              {showBubble && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 px-3 py-2 rounded-[10px] whitespace-nowrap z-50"
                  style={{ bottom: 'calc(100% + 10px)', background: '#F72E00' }}
                >
                  <span className="text-[12px] font-medium text-white">피드에 이 기록이 공유됐어요.</span>
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #F72E00' }}
                  />
                </div>
              )}
              <button
                onClick={handleShareToggle}
                className="flex items-center gap-[8px] active:opacity-50"
              >
                <div
                  className="relative rounded-full"
                  style={{ width: 36, height: 20, background: project.isShared ? '#F72E00' : '#D1D5DB', transition: 'background 0.2s', flexShrink: 0 }}
                >
                  <div
                    className="absolute top-[2px] rounded-full bg-white"
                    style={{ width: 16, height: 16, left: project.isShared ? 18 : 2, transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
                  />
                </div>
                <span className="text-[15px] font-normal" style={{ color: project.isShared ? '#F72E00' : '#646464' }}>공유</span>
              </button>
            </div>

            {/* 타이머 (우측) */}
            <button
              onClick={() => setTimerRunning(r => !r)}
              className="ml-auto flex items-center gap-2 active:opacity-60 px-3 py-2 rounded-[10px]"
              style={{ background: timerRunning ? '#FFF5F4' : 'transparent' }}
            >
              {timerRunning ? (
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2.5" width="3.5" height="11" rx="1" fill="#F72E00"/>
                  <rect x="9.5" y="2.5" width="3.5" height="11" rx="1" fill="#F72E00"/>
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                  <path d="M4 2.5L13 8L4 13.5V2.5Z" fill={timerSecs > 0 ? '#F72E00' : '#646464'}/>
                </svg>
              )}
              <span
                className="text-[16px] font-semibold tabular-nums"
                style={{ color: timerRunning ? '#F72E00' : timerSecs > 0 ? '#2A0B04' : '#212121' }}
              >
                {formatTime(timerSecs)}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 도안 시트 */}
      <PatternSheet isOpen={patternOpen} onClose={() => setPatternOpen(false)} pdfUrl={project.pdfUrl ?? null} />

      {/* 영상 시트 */}
      <VideoSheet isOpen={videoOpen} onClose={() => setVideoOpen(false)} videos={project.videos ?? []} />

      {/* 콘텐츠 내 배지·핸들 숨김 */}
      <style>{`
        .detail-content .cover-badge,
        .detail-content .set-cover-badge,
        .detail-content [data-action],
        .detail-content .drag-handle { display: none !important; }
        .detail-content .img-block { position: relative; user-select: none; }
        .detail-content .img-block img { width: 100%; border-radius: 12px; display: block; }
      `}</style>

      {/* 기록 삭제 확인 모달 */}
      {deleteOpen && (
        <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-[80] flex items-center justify-center bg-black/40 px-8">
          <div className="w-full bg-white rounded-[20px] px-6 py-7 flex flex-col gap-6">
            <div className="text-center flex flex-col gap-1.5">
              <p className="text-[17px] font-bold text-[#212121]">기록을 삭제할까요?</p>
              <p className="text-[14px] text-[#9A9A9A]">삭제된 기록은 복구할 수 없어요.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteOpen(false)}
                className="flex-1 h-[52px] bg-[#F0F0F0] rounded-[12px] text-[15px] font-semibold text-[#646464] active:opacity-70"
              >
                취소
              </button>
              <button
                onClick={() => { deleteProject(project.id); router.replace('/projects') }}
                className="flex-1 h-[52px] bg-[#F72E00] rounded-[12px] text-[15px] font-semibold text-white active:opacity-70"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
