'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'

const CATEGORIES = ['뜨개 잡담', '뜨개 질문', '테스터 모집'] as const
type Category = typeof CATEGORIES[number]

export default function NewPostPage() {
  const router = useRouter()
  const [category, setCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState('')
  const [isEditorEmpty, setIsEditorEmpty] = useState(true)
  const [infoOpen, setInfoOpen] = useState(false)

  const editorRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)

  const canSubmit = category !== null && title.trim().length > 0 && !isEditorEmpty

  /* 에디터 마운트 시 포커스 */
  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    editor.focus()
    const range = document.createRange()
    range.setStart(editor, 0)
    range.collapse(true)
    const sel = window.getSelection()
    sel?.removeAllRanges()
    sel?.addRange(range)
  }, [])

  /* 커서 저장 */
  const saveRange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  /* 커서 위치에 이미지 삽입 */
  const insertImageAtCursor = (src: string) => {
    const editor = editorRef.current
    if (!editor) return
    const sel = window.getSelection()
    let range: Range
    if (savedRangeRef.current) {
      range = savedRangeRef.current.cloneRange()
      sel?.removeAllRanges()
      sel?.addRange(range)
    } else {
      range = document.createRange()
      range.selectNodeContents(editor)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }

    const wrapper = document.createElement('div')
    wrapper.contentEditable = 'false'
    wrapper.style.cssText = 'position:relative;display:block;margin:8px 0;line-height:0;'

    const img = document.createElement('img')
    img.src = src
    img.draggable = false
    img.style.cssText = 'max-width:100%;border-radius:10px;display:block;'

    const delBtn = document.createElement('span')
    delBtn.dataset.action = 'delete-img'
    delBtn.style.cssText =
      'position:absolute;top:6px;right:6px;cursor:pointer;width:24px;height:24px;display:flex;align-items:center;justify-content:center;'
    delBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
<path opacity="0.3" d="M22 12C22 17.523 17.523 22 12 22C6.477 22 2 17.523 2 12C2 6.477 6.477 2 12 2C17.523 2 22 6.477 22 12Z" fill="#F72E00"/>
<path d="M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 1 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 1 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 1 1-1.06-1.06L10.94 12 8.97 10.03a.75.75 0 0 1 0-1.06z" fill="#F72E00"/>
</svg>`

    wrapper.appendChild(img)
    wrapper.appendChild(delBtn)

    range.deleteContents()
    range.insertNode(wrapper)

    let afterNode = wrapper.nextSibling
    if (!afterNode || afterNode.nodeType !== Node.TEXT_NODE) {
      afterNode = document.createTextNode('')
      wrapper.parentNode?.insertBefore(afterNode, wrapper.nextSibling)
    }
    range.setStart(afterNode, 0)
    range.collapse(true)
    sel?.removeAllRanges()
    sel?.addRange(range)
    editor.focus()
    savedRangeRef.current = null
    setIsEditorEmpty(false)
  }

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    const delBtn = target.closest('[data-action="delete-img"]')
    if (delBtn) {
      e.preventDefault()
      e.stopPropagation()
      const block = delBtn.closest('div[contenteditable="false"]')
      if (block && editorRef.current?.contains(block)) {
        block.remove()
        const el = editorRef.current
        setIsEditorEmpty(!el?.textContent?.trim() && !el?.querySelector('img'))
      }
    }
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => {
        if (ev.target?.result) insertImageAtCursor(ev.target.result as string)
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-[393px] mx-auto">

      {/* 헤더 */}
      <div className="flex items-center px-4 pt-14 pb-3">
        <button onClick={() => router.back()} className="w-8 shrink-0 flex items-center">
          <ChevronLeft size={22} className="text-[#646464]" />
        </button>
        <span className="flex-1 text-center text-[17px] font-bold text-[#212121]">게시글 작성</span>
        <button
          onClick={() => canSubmit && router.push('/community')}
          disabled={!canSubmit}
          className="text-[15px] font-semibold shrink-0 transition-colors"
          style={{ color: canSubmit ? '#F72E00' : '#c8c8c8' }}
        >
          등록
        </button>
      </div>

      {/* 카테고리 선택 */}
      <div className="flex items-center gap-2 px-4 pb-4">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="h-8 px-3 rounded-[10px] text-[13px] font-medium shrink-0 transition-colors"
            style={
              category === cat
                ? { background: '#F72E00', color: '#fff' }
                : { background: '#F0F0F0', color: '#646464' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="h-px bg-[#F0F0F0] mx-4" />

      {/* 제목 입력 */}
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="제목을 입력해주세요"
        className="w-full px-4 py-4 text-[17px] font-semibold text-[#212121] placeholder:text-[#c8c8c8] bg-transparent outline-none"
      />

      <div className="h-px bg-[#F0F0F0] mx-4" />

      {/* 본문 입력 */}
      <div
        className="relative flex-1 px-4 pt-4 pb-[72px] cursor-text"
        onClick={e => {
          const target = e.target as HTMLElement
          if (target.closest('[data-action]') || target.closest('[contenteditable="false"]')) return
          const editor = editorRef.current
          if (!editor) return
          const caret = document.caretRangeFromPoint?.(e.clientX, e.clientY) ?? null
          const sel = window.getSelection()
          if (caret && editor.contains(caret.startContainer)) {
            sel?.removeAllRanges()
            sel?.addRange(caret)
          } else {
            const r = document.createRange()
            r.selectNodeContents(editor)
            r.collapse(false)
            sel?.removeAllRanges()
            sel?.addRange(r)
          }
          editor.focus()
        }}
      >
        {isEditorEmpty && (
          <p className="absolute top-4 left-4 text-[15px] text-[#c8c8c8] pointer-events-none select-none leading-relaxed">
            본문을 입력해주세요
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={() => {
            const el = editorRef.current
            if (!el) return
            setIsEditorEmpty(!el.textContent?.trim() && !el.querySelector('img'))
          }}
          onClick={handleEditorClick}
          onMouseUp={saveRange}
          onKeyUp={saveRange}
          onTouchEnd={saveRange}
          className="w-full text-[15px] text-[#212121] outline-none leading-relaxed"
          style={{ wordBreak: 'break-word', minHeight: 200 }}
        />
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] bg-white border-t border-[#F0F0F0] z-20">
        <div className="flex items-center px-5" style={{ height: 80, gap: 16 }}>

          {/* 사진 버튼 */}
          <label
            className="flex items-center gap-[8px] cursor-pointer active:opacity-50"
            onMouseDown={saveRange}
            onTouchStart={saveRange}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M9.778 21H14.222C17.343 21 18.904 21 20.025 20.265C20.5088 19.9481 20.9254 19.539 21.251 19.061C22 17.961 22 16.428 22 13.364C22 10.3 22 8.76699 21.251 7.66699C20.9254 7.18898 20.5088 6.77984 20.025 6.46299C19.305 5.98999 18.403 5.82099 17.022 5.76099C16.363 5.76099 15.796 5.27099 15.667 4.63599C15.5684 4.17085 15.3123 3.75402 14.9418 3.45594C14.5714 3.15785 14.1095 2.99679 13.634 2.99999H10.366C9.378 2.99999 8.527 3.68499 8.333 4.63599C8.204 5.27099 7.637 5.76099 6.978 5.76099C5.598 5.82099 4.696 5.99099 3.975 6.46299C3.49154 6.77995 3.07527 7.18907 2.75 7.66699C2 8.76699 2 10.299 2 13.364C2 16.429 2 17.96 2.749 19.061C3.073 19.537 3.489 19.946 3.975 20.265C5.096 21 6.657 21 9.778 21Z" fill="#838383"/>
              <path d="M17.5557 9.27201C17.4472 9.27109 17.3396 9.29154 17.239 9.3322C17.1385 9.37286 17.0469 9.43293 16.9695 9.50898C16.8922 9.58503 16.8306 9.67558 16.7882 9.77544C16.7458 9.87531 16.7236 9.98254 16.7227 10.091C16.7227 10.543 17.0957 10.909 17.5557 10.909H18.6667C19.1267 10.909 19.5007 10.542 19.5007 10.091C19.4997 9.98245 19.4774 9.87514 19.435 9.77521C19.3926 9.67528 19.3309 9.58469 19.2534 9.50863C19.176 9.43256 19.0843 9.37251 18.9836 9.33191C18.8829 9.29131 18.7752 9.27096 18.6667 9.27201H17.5557Z" fill="#D2D2D2"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 9.27197C9.69998 9.27197 7.83398 11.104 7.83398 13.363C7.83398 15.622 9.69898 17.454 12.001 17.454C14.301 17.454 16.167 15.623 16.167 13.364C16.167 11.105 14.302 9.27197 12.001 9.27197M12.001 10.909C10.621 10.909 9.50098 12.008 9.50098 13.363C9.50098 14.718 10.621 15.818 12.001 15.818C13.382 15.818 14.501 14.719 14.501 13.363C14.501 12.008 13.382 10.909 12.001 10.909Z" fill="#D2D2D2"/>
            </svg>
            <span className="text-[14px] font-normal text-[#646464]">사진</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoChange} />
          </label>

          {/* 정보 버튼 */}
          <button
            onClick={() => setInfoOpen(v => !v)}
            className="flex items-center gap-[8px] active:opacity-50"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M20 12C20 16.4184 16.4184 20 12 20C7.5816 20 4 16.4184 4 12C4 7.5816 7.5816 4 12 4C16.4184 4 20 7.5816 20 12Z" fill="#D2D2D2"/>
              <path d="M14.845 10.3821L13.6281 9.16451C12.797 8.33174 12.3809 7.91576 11.9346 8.01422C11.4882 8.11267 11.2864 8.66567 10.881 9.77001L10.607 10.5183C10.4987 10.8136 10.4453 10.9605 10.3477 11.0737C10.3042 11.125 10.2546 11.1708 10.2 11.2099C10.0786 11.2977 9.9276 11.3396 9.62565 11.4232C8.94461 11.6103 8.60328 11.7038 8.47528 11.927C8.42002 12.0234 8.39115 12.1326 8.39159 12.2437C8.39323 12.5013 8.64266 12.7508 9.14236 13.2512L9.50913 13.6188L8.17989 14.9496C8.06455 15.0652 7.99985 15.2218 8 15.385C8.00015 15.5483 8.06516 15.7048 8.18071 15.8201C8.29627 15.9354 8.4529 16.0002 8.61617 16C8.77943 15.9998 8.93595 15.9348 9.05128 15.8193L10.3789 14.4893L10.767 14.8774C11.27 15.3804 11.5219 15.6322 11.7803 15.6322C11.8894 15.6325 11.9966 15.5502 12.0913 15.5502C12.3161 15.4222 12.4105 15.0792 12.5992 14.3933C12.6813 14.0914 12.7239 13.9404 12.8109 13.819C12.8492 13.7654 12.893 13.7173 12.9422 13.6746C13.0554 13.5761 13.2015 13.5212 13.4944 13.4121L14.2509 13.1274C15.3438 12.7171 15.8903 12.512 15.9863 12.0665C16.0823 11.621 15.6704 11.2083 14.845 10.3821Z" fill="#838383"/>
            </svg>
            <span className="text-[14px] font-normal text-[#646464]">정보</span>
          </button>
        </div>

        {/* 정보 패널 */}
        <div
          style={{
            maxHeight: infoOpen ? 120 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="border-t border-[#F0F0F0] px-8 pt-5 pb-6 flex gap-8 justify-center">
            {[
              { emoji: '🔗', label: '링크' },
              { emoji: '📍', label: '장소' },
            ].map(item => (
              <button key={item.label} className="flex flex-col items-center gap-2 active:opacity-50">
                <span className="text-[32px] leading-none">{item.emoji}</span>
                <span className="text-[13px] text-[#343434]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
