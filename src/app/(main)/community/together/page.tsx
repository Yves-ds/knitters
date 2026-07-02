'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10.5" cy="10.5" r="5.5" stroke="#FFAF9D" strokeWidth="2"/>
      <path d="M15 15L19 19" stroke="#FFAF9D" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.1268 17.1C9.9746 17.4168 9.90526 17.7671 9.92524 18.118C9.94521 18.4689 10.0539 18.809 10.241 19.1065C10.4282 19.404 10.6877 19.6492 10.9954 19.8192C11.3031 19.9891 11.6488 20.0783 12.0003 20.0783C12.3518 20.0783 12.6975 19.9891 13.0052 19.8192C13.3128 19.6492 13.5724 19.404 13.7595 19.1065C13.9467 18.809 14.0553 18.4689 14.0753 18.118C14.0953 17.7671 14.026 17.4168 13.8738 17.1H10.1268Z" fill="#F72E00"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.8883 5.1C10.6154 5.10003 9.39456 5.60571 8.49442 6.5058L8.30602 6.6942C7.40593 7.59434 6.90025 8.81515 6.90022 10.0881V10.9698C6.90022 12.5898 6.25672 14.1438 5.11072 15.2898C4.96246 15.4381 4.86151 15.6271 4.82064 15.8328C4.77976 16.0385 4.80078 16.2517 4.88106 16.4454C4.96133 16.6392 5.09724 16.8048 5.27162 16.9213C5.446 17.0378 5.651 17.1 5.86072 17.1H18.1397C18.3495 17.1 18.5546 17.0379 18.729 16.9213C18.9035 16.8048 19.0394 16.6392 19.1197 16.4454C19.2 16.2516 19.221 16.0383 19.1801 15.8325C19.1391 15.6268 19.0381 15.4378 18.8897 15.2895C18.3223 14.7222 17.8723 14.0488 17.5652 13.3075C17.2582 12.5663 17.1002 11.7718 17.1002 10.9695V10.0881C17.1002 8.81515 16.5945 7.59434 15.6944 6.6942L15.506 6.5058C14.6059 5.60571 13.3851 5.10003 12.1121 5.1H11.8883Z" fill="#FBB4A4"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.6004 5.1249V4.2C12.6004 4.04087 12.5372 3.88826 12.4247 3.77573C12.3121 3.66321 12.1595 3.6 12.0004 3.6C11.8413 3.6 11.6886 3.66321 11.5761 3.77573C11.4636 3.88826 11.4004 4.04087 11.4004 4.2V5.1249C11.5626 5.10832 11.7255 5.1 11.8885 5.1H12.1123C12.2763 5.1 12.439 5.1083 12.6004 5.1249Z" fill="#FC6744"/>
    </svg>
  )
}

export default function TogetherPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28 max-w-[393px] mx-auto">

      {/* 헤더 */}
      <div className="bg-white px-4 pt-14 pb-0 border-b border-[#F0F0F0] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 pb-3">
            <button
              onClick={() => router.push('/community')}
              className="text-[24px] font-bold active:opacity-60"
              style={{ color: '#9A9A9A' }}
            >
              커뮤니티
            </button>
            <span className="text-[24px] font-bold" style={{ color: '#F72E00' }}>함뜨해요</span>
            <button
              onClick={() => router.push('/community/feed')}
              className="text-[24px] font-bold active:opacity-60"
              style={{ color: '#9A9A9A' }}
            >
              피드
            </button>
          </div>
          <div className="flex items-center gap-3 pb-3">
            <Link href="/community/search?tab=함뜨해요">
              <SearchIcon />
            </Link>
            <button onClick={() => router.push('/notifications')}>
              <BellIcon />
            </button>
          </div>
        </div>
      </div>

      {/* 빈 상태 */}
      <div className="flex flex-col items-center justify-center py-28 px-8 gap-4">
        <span className="text-[56px]">🧶</span>
        <p className="text-[16px] font-semibold text-[#212121] text-center">함께 뜨개해요!</p>
        <p className="text-[14px] text-[#9A9A9A] text-center leading-relaxed">
          같이 뜨개질할 메이트를 찾거나{'\n'}함께할 프로젝트를 올려보세요.
        </p>
      </div>

    </div>
  )
}
