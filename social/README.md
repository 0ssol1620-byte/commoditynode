# CommodityNode SNS 홍보 패키지 — April 2026

## 📁 폴더 구조

```
social/
├── reddit/
│   ├── post-gold-forecast-APR2026-FINAL.md      ← Gold 예측 분석 (r/commodities 최우선)
│   ├── post-oil-breakdown-APR2026-FINAL.md       ← 원유 베어케이스 (r/commodities)
│   └── post-supply-disruption-APR2026-FINAL.md  ← 10개 공급 차질 (r/commodities)
├── twitter/
│   ├── thread-gold-apr2026-FINAL.md              ← Gold 8트윗 스레드
│   ├── thread-oil-bearish-apr2026-FINAL.md       ← 원유 8트윗 스레드
│   └── thread-commodities-weekly-FINAL.md        ← 주간 요약 스레드 (매주 월요일)
├── threads/
│   ├── post-gold-apr2026-FINAL.md                ← Gold 단일 포스트
│   ├── post-oil-apr2026-FINAL.md                 ← 원유 단일 포스트
│   └── post-signals-apr2026-FINAL.md             ← 시그널 3연속 포스트
├── linkedin/
│   ├── post-commodity-intelligence-APR2026-FINAL.md  ← 전체 대시보드 소개
│   └── post-oil-analysis-APR2026-FINAL.md            ← 원유 전문가 분석
└── screenshots/                                   ← 실제 사이트 스크린샷 (Puppeteer 캡처)
    ├── home-forecast-section.png                  ★ 팬 차트 (Gold) — 최고 임팩트
    ├── home-guided-entry.png                      ★ 진입 경로 카드 — 기능 소개용
    ├── disruptions.png                            ★ 공급 차질 카드 — Reddit 포스트용
    ├── signals.png                                ★ 시그널 카드 — Twitter/LinkedIn용
    ├── correlation.png                            — 상관관계 히트맵
    ├── range-tracker.png                          — 52주 레인지 트래커
    └── home-full.png                              — 홈 전체 뷰
```

---

## 📅 게시 일정 (권장)

| 날짜 | 플랫폼 | 콘텐츠 | 이미지 |
|------|--------|--------|--------|
| **오늘 저녁 (KST 22:00)** | Reddit r/commodities | post-supply-disruption (공급차질) | disruptions.png |
| **내일 아침 (KST 09:00)** | Twitter/X | thread-gold-apr2026 (Gold 스레드) | home-forecast-section.png |
| **내일 저녁** | Threads | post-gold-apr2026 | home-forecast-section.png |
| **모레 아침** | Reddit r/commodities | post-gold-forecast (Gold 분석) | — |
| **모레 저녁** | Twitter/X | thread-oil-bearish (원유 스레드) | sns-oil-forecast.png |
| **주중 (목/금)** | LinkedIn | post-commodity-intelligence | sns-commodity-dashboard.png |
| **다음 주 월요일** | Twitter/X | thread-commodities-weekly (주간 요약) | sns-commodity-dashboard.png |

---

## ⚠️ 플랫폼별 주의사항

### Reddit
- **링크는 본문에 넣지 말 것** — 첫 번째 댓글에 추가 ("Source in first comment")
- 스팸 감지 방지: 새 계정은 r/commodities에서 며칠 lurk 먼저
- 마케팅 느낌 없이 진짜 커뮤니티 멤버처럼
- karma 없으면 r/commodities (제한 없음), r/investing (500+ karma 필요)

### Twitter/X
- 이미지는 첫 번째 트윗에만 첨부
- 링크는 마지막 트윗 또는 첫 번째 댓글
- 해시태그 2~3개 (첫 트윗엔 없이, 마지막 트윗에)

### Threads
- 500자 제한 엄수
- 이미지 반드시 첨부 (텍스트만이면 노출 낮음)
- 해시태그 7~8개 마지막에

### LinkedIn
- 표 형식은 LinkedIn에서 잘 안 보일 수 있음 → 텍스트 리스트로 대체 고려
- 오전 8~10시 또는 오후 12~2시 게시 권장

---

## 🖼️ 이미지 사용 가이드

| 포스트 | 권장 이미지 |
|--------|-------------|
| Gold 예측 관련 | `home-forecast-section.png` (팬 차트 직접) |
| 원유 분석 | `sns-oil-forecast.png` (AI 생성) or 사이트 캡처 |
| 공급 차질 | `disruptions.png` (실제 사이트) |
| 시그널 | `signals.png` (실제 사이트) |
| 주간 요약 | `sns-commodity-dashboard.png` (AI 생성) |
| 기능 소개 | `home-guided-entry.png` (실제 사이트) |

**실제 사이트 스크린샷 (screenshots/)이 AI 생성 이미지보다 신뢰도 높음**

---

## 📊 데이터 출처 (포스트 내 언급용)
- 가격 데이터: yfinance (실시간 선물 가격)
- 예측 모델: Amazon Chronos-2 (released Oct 2025, 120M params)
- 업데이트 주기: 매일 KST 10:00 자동 실행 (GitHub Actions)
