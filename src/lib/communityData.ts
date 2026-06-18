export type CommunityPost = {
  id: string
  category: string
  author: string
  avatarColor: string
  time: string
  views: number
  title: string
  content: string
  likes: number
  comments: number
  date: string
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    category: '뜨개 질문',
    author: '뜨뜨뜨',
    avatarColor: '#C9956C',
    time: '22분 전',
    views: 210,
    title: '이사벨 니트 소매 폭 좁게 변경 해보신분?',
    content: `이사벨 니트 도안 진행 중인데요, 원작은 소매가 꽤 넓은 편이라서 좀 더 슬림하게 변경하고 싶어요.

코 수를 줄이면 비율이 맞지 않을 것 같기도 하고... 변경해보신 분 계시면 어떻게 하셨는지 공유해주실 수 있나요? 특히 소매 밑단에서 겨드랑이까지 라인이 자연스러우려면 어떻게 해야 할지 궁금해요.`,
    likes: 210,
    comments: 13,
    date: '6월 21일',
  },
  {
    id: '2',
    category: '테스터 모집',
    author: '타래언니',
    avatarColor: '#E07B4F',
    time: '1시간 전',
    views: 300,
    title: '보카시 가디건 테스트 니터 5분 모집해용!',
    content: `안녕하세요! 제가 새로 만든 보카시 가디건 도안 테스트 니터를 모집합니다 🧶

난이도는 중급 정도이고, 사이즈는 S/M/L 세 가지 제공해요. 테스트 기간은 약 3주이며, 참가하시면 도안 무료 제공 + 완성 사진 SNS 게재 동의 부탁드려요. 관심 있으신 분은 댓글 또는 DM 주세요!`,
    likes: 120,
    comments: 32,
    date: '6월 11일',
  },
  {
    id: '3',
    category: '뜨개 질문',
    author: '뜨개하는날',
    avatarColor: '#A0785A',
    time: '3시간 전',
    views: 185,
    title: '코튼사 추천해주세요! 여름 민소매 뜨려고요',
    content: `여름 민소매 니트를 뜨려고 코튼사를 찾고 있는데요, 처음 코튼사를 써봐서 어떤 걸 골라야 할지 모르겠어요.

100% 코튼이 좋을지, 코튼 혼방이 좋을지, 그리고 어떤 브랜드가 관리하기 편한지 알고 싶어요. 여름 내내 입을 거라 세탁도 자주 해야 할 것 같아서요. 다들 어떤 실 쓰시나요?`,
    likes: 87,
    comments: 9,
    date: '6월 18일',
  },
  {
    id: '4',
    category: '뜨개 질문',
    author: '실타래',
    avatarColor: '#D4A373',
    time: '5시간 전',
    views: 422,
    title: '대바늘 초보인데 어떤 도안부터 시작할까요?',
    content: `코바늘은 어느 정도 해봤는데 대바늘은 정말 처음이에요. 코 잡는 것부터 어렵더라고요 ㅠㅠ

머플러나 코스터처럼 단순한 것부터 하라고들 하시는데, 그것도 종류가 너무 많아서 어떤 도안을 고르면 좋을지 막막해요. 초보 입장에서 처음 완성했을 때 뿌듯하고 실용적인 아이템이 뭔지 추천해주시면 너무 좋겠어요!`,
    likes: 195,
    comments: 41,
    date: '6월 17일',
  },
  {
    id: '5',
    category: '뜨개 잡담',
    author: '니팅러버',
    avatarColor: '#B5838D',
    time: '어제',
    views: 98,
    title: '뜨개 모임 같이 하실 분 구해요 (서울 마포)',
    content: `서울 마포 합정 쪽에서 정기적으로 뜨개 모임을 하고 싶어요. 매주 1회, 카페에서 2-3시간 정도 함께 뜨면서 수다 떠는 모임이에요.

레벨 무관하고 코바늘, 대바늘 모두 환영해요. 초보도 괜찮고, 서로 가르쳐줄 수 있으면 더 좋구요! 관심 있으신 분 댓글 남겨주세요 🙌`,
    likes: 63,
    comments: 27,
    date: '6월 15일',
  },
  {
    id: '6',
    category: '뜨개 잡담',
    author: '울덕후',
    avatarColor: '#6B9080',
    time: '2일 전',
    views: 310,
    title: '메리노울 vs 알파카, 어떤 실이 더 좋아요?',
    content: `겨울 스웨터를 뜨려고 실을 고르고 있는데, 메리노울과 알파카 사이에서 너무 고민돼요.

메리노울은 탄력이 있고 세탁이 편하다는데, 알파카는 엄청 부드럽고 따뜻하다고 하잖아요. 가격도 알파카가 훨씬 비싸던데, 그만큼 가치가 있는지 궁금해요. 두 가지 다 써보신 분 계시면 장단점 공유해 주세요!`,
    likes: 144,
    comments: 18,
    date: '6월 14일',
  },
]
