# 니터즈 (Knitters) — Claude 작업 메모

이 문서는 세션이 바뀌어도 Claude가 자동으로 불러오는 프로젝트 메모입니다.
디자인 작업(비주얼/인터랙티브 디자인) 관련 요청 시 이 문서와 `DESIGN_SYSTEM.md`를 함께 참고하세요.

---

## 이미지 생성 프롬프트 라이브러리

앱 내 사용자 배지(뱃지) 등 에셋을 생성할 때 재사용하는 완성 프롬프트 모음입니다.
새 배지를 만들 때는 아래 템플릿의 `[배지 위 요소]` 텍스트/오브젝트, `[뒤로 삐져나온 도구]`만 바꿔서 재사용하세요.

### 배지: 손뜨개 픽셀아트 엠블럼 — "사전등록" 배지

**용도**: 앱에서 사용자에게 지급하는 배지(예: 사전등록 리워드)

**완성 프롬프트 (한글)**

```
픽셀아트 스타일의 단일 손뜨개 엠블럼 배지. 정면 플랫뷰, 순백색 배경 정중앙에 오브젝트 하나만.

[스타일]
- 중간 해상도 픽셀아트: 각진 사각 픽셀이 또렷하게 보이고 픽셀 클러스터마다 은은한 입체 음영
- 크리스프한 픽셀 에지, 안티에일리어싱 없음, 계단식 곡선
- 손뜨개 팝콘뜨기(방울뜨기) 질감을 동글동글한 픽셀 방울 무리로 표현

[배지 본체]
- 모서리가 둥근 방패형(아래쪽이 살짝 좁아짐), 손맛 나는 불규칙한 외곽선
- 바탕: 크림/오트밀색 방울뜨기 편물 픽셀 필드
- 테두리: 주황빨강 굵은 크로셰 마감단이 배지를 빙 두름

[배지 위 요소]
- 상단: 빨간 픽셀 자수 레터링 "사전등록" — 실로 떠 넣은 듯 러프하고 살짝 겹쳐진 손글씨체
- 중앙: 딸기 크림 레이어 케이크 (2단, 흰 크림, 위에 빨간 베리 몇 알) 픽셀아트
- 케이크 주변에 흩뿌린 작은 보석/꽃 모양 비즈 6~8개 (파랑, 분홍, 청록, 노랑, 초록, 주황, 빨강)

[뒤로 삐져나온 도구]
- 왼쪽: 금색/노란색 코바늘 1개가 배지 뒤에서 대각선으로 튀어나옴
- 오른쪽: 나무색 대바늘 2개가 배지 뒤에서 대각선으로 튀어나옴

[색상]
따뜻하고 포근한 톤, 크림 바탕 + 주황빨강 포인트 + 알록달록한 비즈. 중간 채도.

[조명]
부드럽고 균일한 확산광, 픽셀 방울 사이 은은한 셀프 섀도우만, 배경 그림자 없음

[출력 조건]
Canvas Size: 1080 x 1080 / Perfect Square Format / Centered Composition / No Cropping /
Single Object Only / Pure White Background / No Environment / No Scene /
No Background Objects / No Ground / No Overlay Text / No Watermark / No UI
※ 편물 자수로 표현한 픽셀 레터링은 오브젝트의 일부이므로 허용. 디지털 폰트·워터마크·UI만 금지.

[절대 금지 스타일]
Pokemon Style / Terraria Style / Stardew Valley Style / Ragnarok Online Style /
JRPG Battle Sprite / Octopath Traveler Style / Western Cartoon / Disney Style /
Concept Art / Splash Art / Poster / Wallpaper / Anime Illustration / Digital Painting /
Cinematic Lighting / Ultra Detailed / Smooth Gradient Shading / Airbrush Shading /
Plastic or Glossy Surface / Vector Flat Icon / 3D Render Look / Photorealistic
```

**짧은 영문 버전**

```
Pixel art of a single hand-crocheted emblem badge, front flat view, centered on a
pure white background, one object only.

STYLE: medium-resolution pixel art with crisp blocky square pixels and subtle
per-cluster dimensional shading, no anti-aliasing, stair-stepped curves. Crochet
popcorn/bobble stitch texture rendered as rounded pixel bobble clusters.

BADGE: rounded shield shape tapering slightly at the bottom, uneven handmade
outline. Body is a cream/oatmeal bobble-stitch pixel field, wrapped by a thick
orange-red crochet border.

ON THE BADGE:
- top: red pixel embroidered lettering "사전등록", rough hand-stitched look,
  slightly overlapping strokes (yarn-stitched, not printed type)
- center: a two-tier strawberry cream layer cake with white frosting and a few
  red berries on top, in pixel art
- 6-8 small gem/flower-shaped beads scattered around the cake (blue, pink, teal,
  yellow, green, orange, red)

TOOLS BEHIND: one gold/yellow crochet hook poking diagonally out from behind on
the left; two wood-brown knitting needles poking out from behind on the right.

COLOR: warm cozy palette, cream base + orange-red accent + colorful beads,
medium saturation.

LIGHT: soft even diffuse light, gentle self-shadow between bobbles only, no cast
shadow on background.

1080x1080, perfect square, centered, no cropping, single object only, pure white
background, no environment, no scene, no background objects, no ground, no overlay
text, no watermark, no UI. (Yarn-stitched pixel lettering is part of the object
and is allowed.)

Avoid: Pokemon / Terraria / Stardew Valley / Ragnarok / JRPG battle sprite /
Octopath Traveler / Western cartoon / Disney style / concept art / splash art /
poster / wallpaper / anime illustration / digital painting / cinematic lighting /
ultra-detailed / smooth gradient shading / airbrush shading / glossy surface /
flat vector icon / 3D render look / photorealistic.
```

**재사용 메모**:
- 이 배지 시리즈의 공통 뼈대: 손뜨개 픽셀아트 + 방패형 배지 + 크로셰 테두리 + 코바늘/대바늘이 뒤로 삐져나온 구도 + 순백 배경 1080x1080.
- 새 배지를 만들 때는 `[배지 위 요소]`의 레터링 문구와 중앙 오브젝트(케이크 → 다른 소재)만 교체하고 나머지 스타일/출력 조건/금지 스타일은 그대로 유지할 것.
