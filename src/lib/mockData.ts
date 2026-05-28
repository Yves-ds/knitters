export const mockUsers = [
  { id: '1', name: '실뭉치언니', username: 'yarnlover_', avatar: '', followers: 1240, following: 380 },
  { id: '2', name: '니팅러버', username: 'knitting.lover', avatar: '', followers: 890, following: 210 },
  { id: '3', name: '코바늘김씨', username: 'crochet_kim', avatar: '', followers: 2300, following: 520 },
  { id: '4', name: '뜨개마을', username: 'knit_village', avatar: '', followers: 560, following: 180 },
]

export const mockProjects = [
  { id: '1', title: '아이보리 케이블 니트 스웨터', status: '진행 중', progress: 65, yarn: 'Drops Lima / 아이보리', needle: '5.0mm 대바늘', startDate: '2026-04-12', imageUrl: '', tags: ['스웨터','케이블','대바늘'], memo: '소매 부분이 까다롭다. 조금씩 진행 중.', rows: 142, targetRows: 220 },
  { id: '2', title: '핑크 버킷햇', status: '완료', progress: 100, yarn: 'Scheepjes Catona / Rose', needle: '3.5mm 코바늘', startDate: '2026-03-01', endDate: '2026-03-18', imageUrl: '', tags: ['모자','코바늘','봄'], memo: '', rows: 60, targetRows: 60 },
  { id: '3', title: '머스타드 숄더백', status: '시작 전', progress: 0, yarn: 'Paintbox Simply DK / Mustard', needle: '4.0mm 코바늘', startDate: '', imageUrl: '', tags: ['가방','코바늘'], memo: '', rows: 0, targetRows: 180 },
]

export const mockPosts = [
  { id: '1', user: { id:'1', name:'실뭉치언니', username:'yarnlover_', avatar:'' }, imageUrl: '', description: '3주 만에 완성한 케이블 스웨터! 처음 도전한 케이블 패턴이었는데 생각보다 어렵지 않았어요 🧶', likes: 342, comments: 28, saved: false, liked: false, tags: ['스웨터','케이블니트','뜨개완성'], createdAt: '2시간 전' },
  { id: '2', user: { id:'2', name:'니팅러버', username:'knitting.lover', avatar:'' }, imageUrl: '', description: '봄 맞이 파스텔 토트백 완성 ✨ 도안 공유 원하시는 분 댓글 남겨주세요!', likes: 189, comments: 54, saved: false, liked: true, tags: ['토트백','코바늘','봄뜨개'], createdAt: '5시간 전' },
  { id: '3', user: { id:'3', name:'코바늘김씨', username:'crochet_kim', avatar:'' }, imageUrl: '', description: '진행 중인 그래니스퀘어 담요 WIP 🌈 색 조합 어떤가요?', likes: 95, comments: 19, saved: true, liked: false, tags: ['담요','그래니스퀘어','WIP'], createdAt: '어제' },
]

export const mockPatterns = [
  { id: '1', title: '베이직 리브 비니', author: '니팅러버', category: '모자', difficulty: '입문', price: 0, likes: 1230, imageUrl: '', tags: ['비니','대바늘','무료'] },
  { id: '2', title: '클래식 케이블 스웨터', author: '뜨개마을', category: '의류', difficulty: '중급', price: 3500, likes: 876, imageUrl: '', tags: ['스웨터','케이블','대바늘'] },
  { id: '3', title: '미니 토트백', author: '실뭉치언니', category: '가방', difficulty: '초급', price: 0, likes: 2100, imageUrl: '', tags: ['가방','코바늘','무료'] },
  { id: '4', title: '그래니스퀘어 담요', author: '코바늘김씨', category: '홈데코', difficulty: '초급', price: 2000, likes: 654, imageUrl: '', tags: ['담요','그래니스퀘어','코바늘'] },
  { id: '5', title: '마켓백', author: '니팅러버', category: '가방', difficulty: '입문', price: 0, likes: 1870, imageUrl: '', tags: ['가방','코바늘','무료'] },
  { id: '6', title: '버킷햇', author: '뜨개마을', category: '모자', difficulty: '초급', price: 1500, likes: 430, imageUrl: '', tags: ['모자','코바늘'] },
]

export const mockQnA = [
  { id: '1', user: { name:'초보니터', username:'beginner_knit' }, title: '코바늘 시작코 잡는 방법이 헷갈려요 ㅠㅠ', content: '매직링이랑 사슬뜨기 시작 중 어떤 게 나을까요?', answers: 5, views: 142, createdAt: '1시간 전', tags: ['코바늘','입문'] },
  { id: '2', user: { name:'뜨개마을', username:'knit_village' }, title: '울 실 세탁 어떻게 하시나요?', content: '손세탁 vs 울코스 세탁기 의견 궁금합니다!', answers: 12, views: 380, createdAt: '3시간 전', tags: ['실관리','세탁'] },
  { id: '3', user: { name:'실뭉치언니', username:'yarnlover_' }, title: '장갑 엄지 부분 어떻게 연결하나요?', content: '엄지 거셋 방법을 잘 모르겠어서요 ㅠ', answers: 8, views: 210, createdAt: '어제', tags: ['장갑','대바늘','고수도움요청'] },
]
