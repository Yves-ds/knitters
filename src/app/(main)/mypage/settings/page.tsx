'use client'
import { useRouter } from 'next/navigation'

function ChevronLeftIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M15 18l-6-6 6-6" stroke="#2A0B04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M9 18l6-6-6-6" stroke="#CFCFCF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const SECTIONS = [
  {
    title: '내 계정',
    items: ['로그인 정보', '본인인증'],
  },
  {
    title: '사용자 관리',
    items: ['차단한 사용자', '숨긴 사용자'],
  },
  {
    title: '앱 설정',
    items: ['알림 설정', '맞춤 설정', '버전 정보'],
  },
  {
    title: '고객센터',
    items: ['공지사항', '1:1 문의'],
  },
]

function SettingRow({ label, isLast }: { label: string; isLast: boolean }) {
  const isVersion = label === '버전 정보'
  return (
    <div>
      <button className="w-full flex items-center justify-between px-4 py-[15px] active:bg-[#fafafa] transition-colors">
        <span className="text-[15px] text-[#343434]">{label}</span>
        {isVersion
          ? <span className="text-[13px] text-[#9A9A9A]">v1.0.0</span>
          : <ChevronRightIcon />
        }
      </button>
      {!isLast && <div className="h-px bg-[#F0F0F0] mx-4" />}
    </div>
  )
}

export default function SettingsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fafafa] pb-12">

      {/* 헤더 */}
      <div className="bg-white flex items-center justify-center px-4 pt-14 pb-4 relative">
        <button
          onClick={() => router.back()}
          className="absolute left-4 w-8 h-8 flex items-center justify-center active:opacity-60"
        >
          <ChevronLeftIcon />
        </button>
        <h1 className="text-[17px] font-bold text-[#2A0B04]">설정</h1>
      </div>

      {/* 설정 섹션 목록 */}
      <div className="px-4 pt-5 flex flex-col gap-5">
        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-[12px] font-semibold text-[#9A9A9A] mb-2 px-1">{section.title}</p>
            <div className="bg-white rounded-[14px] overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              {section.items.map((item, idx) => (
                <SettingRow key={item} label={item} isLast={idx === section.items.length - 1} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 mt-8 flex flex-col gap-3">
        <button className="w-full h-[52px] bg-white rounded-[14px] text-[15px] font-semibold text-[#343434] active:opacity-70"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          로그아웃
        </button>
        <button className="w-full h-[52px] bg-white rounded-[14px] text-[15px] font-semibold text-[#9A9A9A] active:opacity-70"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          회원탈퇴
        </button>
      </div>
    </div>
  )
}
