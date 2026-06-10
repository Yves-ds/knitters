export const mockUsers = [
  { id: '1', name: '실뭉치언니', username: 'yarnlover_', avatar: '', followers: 1240, following: 380 },
  { id: '2', name: '니팅러버', username: 'knitting.lover', avatar: '', followers: 890, following: 210 },
  { id: '3', name: '코바늘김씨', username: 'crochet_kim', avatar: '', followers: 2300, following: 520 },
  { id: '4', name: '뜨개마을', username: 'knit_village', avatar: '', followers: 560, following: 180 },
]

export const mockProjects = [
  { id: '1', title: '아이보리 케이블 니트 스웨터', status: '진행 중', progress: 65, yarn: 'Drops Lima / 아이보리', needle: '5.0mm 대바늘', startDate: '2026-04-12', endDate: '', imageUrl: '', emoji: '🧶', tags: ['스웨터','케이블','대바늘'], memo: '소매 부분이 까다롭다. 조금씩 진행 중.', rows: 142, targetRows: 220 },
  { id: '2', title: '핑크 버킷햇', status: '완성', progress: 100, yarn: 'Scheepjes Catona / Rose', needle: '3.5mm 코바늘', startDate: '2026-03-01', endDate: '2026-03-18', imageUrl: '', emoji: '👒', tags: ['모자','코바늘','봄'], memo: '', rows: 60, targetRows: 60 },
  { id: '3', title: '머스타드 숄더백', status: '시작 안 함', progress: 0, yarn: 'Paintbox Simply DK / Mustard', needle: '4.0mm 코바늘', startDate: '', endDate: '', imageUrl: '', emoji: '👜', tags: ['가방','코바늘'], memo: '', rows: 0, targetRows: 180 },
  { id: '4', title: '그레이 터틀넥 풀오버', status: '쉬는 중', progress: 30, yarn: 'Lang Yarns Merino 150 / Grey', needle: '4.5mm 대바늘', startDate: '2026-02-10', endDate: '', imageUrl: '', emoji: '🩶', tags: ['스웨터','대바늘','겨울'], memo: '잠시 쉬는 중. 봄이 지나면 다시 시작할 예정.', rows: 66, targetRows: 220 },
  { id: '5', title: '민트 레이스 숄', status: '완성', progress: 100, yarn: 'Drops Kid-Silk / Mint', needle: '4.0mm 대바늘', startDate: '2026-01-05', endDate: '2026-02-01', imageUrl: '', emoji: '🌿', tags: ['숄','레이스','대바늘'], memo: '', rows: 95, targetRows: 95 },
]

export const mockNotices = [
  { id: 'n1', title: '커뮤니티 이용 규칙 (*활동 전 필독)', date: '11월 21일', views: 210, likes: 2, comments: 13 },
  { id: 'n2', title: '자투리 마켓 거래 유의사항 안내', date: '11월 21일', views: 210, likes: 8, comments: 20 },
]

export const mockPosts = [
  { id: '1', category: '뜨개 잡담', title: '민트', user: { id:'1', name:'뜨뜨미지근', username:'kknitter_', avatar:'', avatarColor:'#C9956C', following: false }, imageUrl: '', description: '민트색 니트 만들고 싶은데, 원하는 색 실이 없어서 합사 고민이에요. 실 합사 많이들 하시던데 다들 자랑해주세요!', likes: 2, comments: 13, views: 210, saved: false, liked: false, tags: ['합사','실추천'], createdAt: '11월 21일' },
  { id: '2', category: '뜨개 질문', title: '니트 소매 폭 좁게 변경 가능할까요?', user: { id:'2', name:'푸르시오지욱', username:'purr_knit', avatar:'', avatarColor:'#E07B4F', following: true }, imageUrl: '', description: '원작 도안은 소매가 좀 넓넓한 편인데, 제가 쫀쫀한 소매를 선호해서 좁게 변형하면 어떨까요? 변경해보신 분 후기 궁금해요!', likes: 2, comments: 13, views: 210, saved: false, liked: true, tags: ['도안수정','소매'], createdAt: '11월 21일' },
  { id: '3', category: '뜨개 질문', title: '도안 다들 어디서 찾아보세요?', user: { id:'3', name:'타래비', username:'tarae_b', avatar:'', avatarColor:'#A0785A', following: true }, imageUrl: '', description: '원작 도안은 소매가 좀 넓넓한 편인데, 제가 쫀쫀한 소매를 선호해서 좁게 변형하면 어떨까요? 변경해보신 분 후기 궁금해요!', likes: 5, comments: 8, views: 143, saved: false, liked: false, tags: ['도안','추천'], createdAt: '11월 21일' },
  { id: '4', category: '완성 인증', title: '드디어 첫 스웨터 완성했어요 🎉', user: { id:'4', name:'실뭉치언니', username:'yarnlover_', avatar:'', avatarColor:'#D4A373', following: true }, imageUrl: '', description: '3주 만에 완성한 케이블 스웨터! 처음 도전한 케이블 패턴이었는데 생각보다 어렵지 않았어요. 다음엔 카디건에 도전해볼까 해요!', likes: 342, comments: 28, views: 1204, saved: false, liked: false, tags: ['스웨터','케이블니트','뜨개완성'], createdAt: '2시간 전' },
  { id: '5', category: '실속 장터', title: '메리노울 실 나눔합니다 (무료)', user: { id:'5', name:'니팅러버', username:'knitting.lover', avatar:'', avatarColor:'#B5838D', following: false }, imageUrl: '', description: '봄 맞이 정리하다 보니 메리노울 실이 남았어요. 필요하신 분 댓글 달아주세요. 직거래 우선, 택배 가능!', likes: 89, comments: 54, views: 620, saved: false, liked: true, tags: ['실나눔','메리노울'], createdAt: '5시간 전' },
  { id: '6', category: '뜨개 잡담', title: '그래니스퀘어 색 조합 어떻게 생각하세요?', user: { id:'6', name:'코바늘김씨', username:'crochet_kim', avatar:'', avatarColor:'#6B9080', following: true }, imageUrl: '', description: '진행 중인 그래니스퀘어 담요인데요 🌈 색 조합이 너무 어렵네요. 다들 어떻게 정하세요? 추천 부탁드려요!', likes: 95, comments: 19, views: 388, saved: true, liked: false, tags: ['담요','그래니스퀘어','코바늘'], createdAt: '어제' },
]

export const mockPatterns = [
  { id: '1', title: '베이직 리브 비니', author: '니팅러버', category: '모자', difficulty: '입문', price: 0, likes: 1230, imageUrl: '', tags: ['비니','대바늘','무료'] },
  { id: '2', title: '클래식 케이블 스웨터', author: '뜨개마을', category: '의류', difficulty: '중급', price: 3500, likes: 876, imageUrl: '', tags: ['스웨터','케이블','대바늘'] },
  { id: '3', title: '미니 토트백', author: '실뭉치언니', category: '가방', difficulty: '초급', price: 0, likes: 2100, imageUrl: '', tags: ['가방','코바늘','무료'] },
  { id: '4', title: '그래니스퀘어 담요', author: '코바늘김씨', category: '홈데코', difficulty: '초급', price: 2000, likes: 654, imageUrl: '', tags: ['담요','그래니스퀘어','코바늘'] },
  { id: '5', title: '마켓백', author: '니팅러버', category: '가방', difficulty: '입문', price: 0, likes: 1870, imageUrl: '', tags: ['가방','코바늘','무료'] },
  { id: '6', title: '버킷햇', author: '뜨개마을', category: '모자', difficulty: '초급', price: 1500, likes: 430, imageUrl: '', tags: ['모자','코바늘'] },
]

export const mockChallenges = [
  {
    id: '1',
    title: '30일 매일 뜨개 챌린지',
    period: '2026.05.01 ~ 2026.05.30',
    status: '진행 중',
    achievement: 67,
    participants: 1240,
    reward: '뜨개 키트 증정',
    emoji: '🔥',
  },
  {
    id: '2',
    title: '여름 니트 완성 챌린지',
    period: '2026.06.01 ~ 2026.06.30',
    status: '예정',
    achievement: 0,
    participants: 382,
    reward: '실 할인 쿠폰 30%',
    emoji: '☀️',
  },
  {
    id: '3',
    title: '코바늘 입문자 챌린지',
    period: '2026.03.01 ~ 2026.03.31',
    status: '완료',
    achievement: 100,
    participants: 2104,
    reward: '완료',
    emoji: '🪡',
  },
  {
    id: '4',
    title: '숄·스톨 한 달 완성',
    period: '2026.07.01 ~ 2026.07.31',
    status: '예정',
    achievement: 0,
    participants: 95,
    reward: '작품 인증 배지',
    emoji: '🧣',
  },
]

export const mockExploreItems: Record<'도안' | '실' | '바늘', { id: string; name: string; brand: string; likes: number; link: string; bg: string }[]> = {
  도안: [
    { id: 'd1', name: '베이직 리브 비니', brand: '니팅러버', likes: 1230, link: 'https://www.ravelry.com', bg: '#F5EDE8' },
    { id: 'd2', name: '클래식 케이블 스웨터', brand: '뜨개마을', likes: 876, link: 'https://www.ravelry.com', bg: '#EAF0F5' },
    { id: 'd3', name: '미니 토트백', brand: '실뭉치언니', likes: 2100, link: 'https://www.ravelry.com', bg: '#F0EDF5' },
    { id: 'd4', name: '그래니스퀘어 담요', brand: '코바늘김씨', likes: 654, link: 'https://www.ravelry.com', bg: '#EDF5EE' },
    { id: 'd5', name: '마켓백', brand: '니팅러버', likes: 1870, link: 'https://www.ravelry.com', bg: '#F5F0E8' },
    { id: 'd6', name: '버킷햇', brand: '뜨개마을', likes: 430, link: 'https://www.ravelry.com', bg: '#F5E8EC' },
    { id: 'd7', name: '레이스 숄', brand: '실뭉치언니', likes: 970, link: 'https://www.ravelry.com', bg: '#E8F0F5' },
    { id: 'd8', name: '케이블 카디건', brand: '뜨개마을', likes: 1120, link: 'https://www.ravelry.com', bg: '#F5EBE8' },
    { id: 'd9', name: '코튼 탑', brand: '코바늘김씨', likes: 760, link: 'https://www.ravelry.com', bg: '#EEF5E8' },
  ],
  실: [
    { id: 'y1', name: '메리노울 DK', brand: 'Drops Design', likes: 2340, link: 'https://www.garnstudio.com', bg: '#F5EDE8' },
    { id: 'y2', name: 'Alpaca Silk', brand: 'Drops Design', likes: 1870, link: 'https://www.garnstudio.com', bg: '#EAF0F5' },
    { id: 'y3', name: 'Soft Tweed', brand: 'Scheepjes', likes: 1450, link: 'https://www.scheepjes.com', bg: '#EDF5EE' },
    { id: 'y4', name: 'Catona 100g', brand: 'Scheepjes', likes: 980, link: 'https://www.scheepjes.com', bg: '#F5F0E8' },
    { id: 'y5', name: 'Merino Extrafine', brand: 'Lana Grossa', likes: 760, link: 'https://www.lanagrossa.com', bg: '#F0EDF5' },
    { id: 'y6', name: 'Cool Wool Big', brand: 'Lana Grossa', likes: 630, link: 'https://www.lanagrossa.com', bg: '#F5E8EC' },
  ],
  바늘: [
    { id: 'n1', name: '인터체인지블 세트', brand: 'Clover', likes: 890, link: 'https://www.clover.co.jp', bg: '#EAF0F5' },
    { id: 'n2', name: '대나무 코바늘 세트', brand: 'Clover', likes: 1230, link: 'https://www.clover.co.jp', bg: '#F5EDE8' },
    { id: 'n3', name: 'Symfonie Wood 세트', brand: 'KnitPro', likes: 1560, link: 'https://www.knitpro.eu', bg: '#F5F0E8' },
    { id: 'n4', name: 'Nova Metal 줄바늘', brand: 'KnitPro', likes: 740, link: 'https://www.knitpro.eu', bg: '#EDF5EE' },
    { id: 'n5', name: '스틸 코바늘 세트', brand: 'Tulip', likes: 520, link: 'https://www.tulip-japan.co.jp', bg: '#F0EDF5' },
    { id: 'n6', name: '에티모 로즈 세트', brand: 'Tulip', likes: 2100, link: 'https://www.tulip-japan.co.jp', bg: '#F5E8EC' },
  ],
}

export const mockBrands = [
  { id: 'b1', nameKo: '드롭스 디자인', nameEn: 'Drops Design', bg: '#F5EDE8', bookmarked: true },
  { id: 'b2', nameKo: '스헤이프헤스', nameEn: 'Scheepjes', bg: '#EAF0F5', bookmarked: false },
  { id: 'b3', nameKo: '라나그로사', nameEn: 'Lana Grossa', bg: '#EDF5EE', bookmarked: true },
  { id: 'b4', nameKo: '클로버', nameEn: 'Clover', bg: '#F5F0E8', bookmarked: false },
  { id: 'b5', nameKo: '니트프로', nameEn: 'KnitPro', bg: '#F0EDF5', bookmarked: false },
  { id: 'b6', nameKo: '튤립', nameEn: 'Tulip', bg: '#F5E8EC', bookmarked: true },
  { id: 'b7', nameKo: '퍼피', nameEn: 'Puppy', bg: '#EEF5E8', bookmarked: false },
]

export const mockQnA = [
  { id: '1', user: { name:'초보니터', username:'beginner_knit' }, title: '코바늘 시작코 잡는 방법이 헷갈려요 ㅠㅠ', content: '매직링이랑 사슬뜨기 시작 중 어떤 게 나을까요?', answers: 5, views: 142, createdAt: '1시간 전', tags: ['코바늘','입문'] },
  { id: '2', user: { name:'뜨개마을', username:'knit_village' }, title: '울 실 세탁 어떻게 하시나요?', content: '손세탁 vs 울코스 세탁기 의견 궁금합니다!', answers: 12, views: 380, createdAt: '3시간 전', tags: ['실관리','세탁'] },
  { id: '3', user: { name:'실뭉치언니', username:'yarnlover_' }, title: '장갑 엄지 부분 어떻게 연결하나요?', content: '엄지 거셋 방법을 잘 모르겠어서요 ㅠ', answers: 8, views: 210, createdAt: '어제', tags: ['장갑','대바늘','고수도움요청'] },
]
