---
sitemap: false
---

# CommodityNode SEO 정밀 검사 보고서

**검사 일시:** 2026-03-26T19:33 KST  
**검사 범위:** 사이트 전체 (270 sitemap URLs, 92 posts, 54 commodities)  
**참조:** Google Search Console 크롤링됨-미색인 5페이지 + 전체 사이트 점검

---

## ❌ Critical — 즉시 수정 필요

### C1. 내부 문서가 Google에 노출됨 (sitemap + 인덱싱)

sitemap.xml에 **내부 관리용 페이지 4개**가 포함되어 있어 Google이 크롤링하고 있음:

| URL | 내용 | 문제 |
|---|---|---|
| `/AUDIT_REPORT/` | 전수검사 보고서 (한국어) | 내부 문서 노출 |
| `/CRON_SETUP/` | 자동화 크론 설정 문서 | 인프라 정보 노출 |
| `/ROADMAP/` | 개발 로드맵 + 수익 $0 언급 | 사업 전략 노출 |
| `/assets/images/` | "Images needed:" 빈 페이지 | 빈 페이지 크롤링 낭비 |

**수정:**
1. 각 파일 front matter에 `sitemap: false` 추가
2. `robots.txt`에 Disallow 추가:
```
Disallow: /AUDIT_REPORT/
Disallow: /CRON_SETUP/
Disallow: /ROADMAP/
Disallow: /assets/images/
```

### C2. `/silver-solar-electronics-impact/` → 404 (GSC 크롤링됨-미색인)

Google Search Console에서 보고된 URL이 **404**를 반환함.
- ❌ `https://commoditynode.com/silver-solar-electronics-impact/` → **404**
- ✅ `https://commoditynode.com/silver-price-impact-solar-electronics/` → 200 (실제 URL)

**원인:** 어딘가에서 잘못된 URL로 링크됨 (또는 이전 slug가 변경됨)
**수정:** 301 리디렉트 설정 — `silver-solar-electronics-impact` → `silver-price-impact-solar-electronics`  
Jekyll에서: `_redirects` 파일 또는 `jekyll-redirect-from` 플러그인 사용

### C3. `prices.json`이 sitemap.xml에 없지만 Google이 크롤링 (미색인)

- `/assets/data/prices.json` — JSON API 데이터 파일
- Google이 크롤링했지만 indexable content가 아님
- `robots.txt`에서 차단하지 않고 있음

**수정:** `robots.txt`에 추가:
```
Disallow: /assets/data/
```

### C4. 중복 콘텐츠 — oil-hormuz 2개 포스트

같은 날(3/23) 같은 주제로 2개 포스트 발행:
| 포스트 | 단어 수 | 제목 |
|---|---|---|
| `oil-hormuz-premium` | 411 | "Oil at $100: The Hormuz Premium..." |
| `crude-oil-strait-hormuz-geopolitical-premium` | 932 | "Oil's Geopolitical Premium: How the Strait of Hormuz..." |

**문제:** Google이 둘 다 크롤링 → 키워드 카니발라이제이션 + thin content (411단어)  
**수정:** `oil-hormuz-premium`(짧은 것) 삭제하고 301 리디렉트 → `crude-oil-strait-hormuz-geopolitical-premium`

### C5. description 누락 — 3개 포스트 (GSC 미색인 2개 포함!)

| 포스트 | 문제 |
|---|---|
| `coffee-price-crash-brazil-surplus` | ❌ description 완전 누락 — **GSC 미색인** |
| `crude-oil-strait-hormuz-geopolitical-premium` | ❌ description 완전 누락 — **GSC 미색인** |
| `diesel-transportation-inflation` | ❌ description 완전 누락 |

**description이 없으면** Google이 자동 생성하는데, 이게 종종 낮은 품질로 판단됨.  
**수정:** 각 파일 front matter에 120-160자 description 추가

---

## ⚠️ Important — SEO에 직접 영향

### I1. 전체 포스트의 78%가 canonical_url 누락 (69/92개)

- `_layouts/default.html`에서 `{{ page.url | absolute_url }}`로 canonical을 자동 생성하므로 **기능적으로는 작동**
- 하지만 `canonical_url`을 지정한 포스트(23개)에서는 **중복 canonical 태그** 발생:
  ```html
  <link rel="canonical" href="https://commoditynode.com/silver-price-impact-solar-electronics/" />
  <link rel="canonical" href="https://commoditynode.com/silver-price-impact-solar-electronics/">
  ```
- Google은 보통 첫 번째를 사용하지만, 중복은 "confusing signals"로 간주될 수 있음

**수정:** default.html의 canonical 로직을 수정:
```html
{% if page.canonical_url %}
  <link rel="canonical" href="{{ page.canonical_url }}">
{% else %}
  <link rel="canonical" href="{{ page.url | absolute_url }}">
{% endif %}
```
그리고 `canonical_url` front matter는 제거하거나, 위 로직으로 통일

### I2. 모든 포스트(92개)가 고립 페이지 (Orphan Pages)

**가장 심각한 구조적 문제.** 92개 포스트 중 다른 .md/.html 파일에서 직접 링크하는 곳이 **0개**.

- Jekyll 페이지네이션(`{% for post in paginator.posts %}`)으로 index/page/2/ 등에서 자동 나열됨
- commodity 레이아웃에서 관련 포스트를 동적으로 표시함
- **하지만** 이것은 JavaScript/Liquid 기반이라 Google 크롤러가 항상 팔로우하지 않음

**크롤링됨-미색인의 주요 원인일 가능성 높음:**
Google은 "이 페이지는 사이트 내에서 중요하지 않다"고 판단 → 색인 제외

**수정:**
1. 각 commodity 허브 페이지(예: `/commodities/coffee/`)에서 관련 포스트로의 **정적 HTML 링크** 추가
2. 포스트 하단에 "Related Reports" 섹션으로 같은 commodity의 다른 포스트 링크
3. 사이드바에 "Latest Reports" 위젯 추가

### I3. 새 원자재 8개 중 6개가 index.html에서 링크 없음

3/24에 추가된 새 commodity 허브 페이지:

| Commodity | index.html에서 링크 | 상태 |
|---|---|---|
| chromium | ❌ 없음 | 고립 |
| gallium | ✅ 있음 (1곳) | OK |
| germanium | ❌ 없음 | 고립 |
| helium | ✅ 있음 (1곳) | OK |
| molybdenum | ❌ 없음 | 고립 |
| phosphate | ❌ 없음 | 고립 |
| silicon | ❌ 없음 | 고립 |
| tungsten | ❌ 없음 | 고립 |

기존에 index.html에서 링크된 commodity는: cocoa, coffee, copper, crude-oil, gold, lithium, natural-gas, rice, silver, steel, uranium, wheat (12개만)

**수정:** index.html의 commodity 섹션에서 **전체 54개** 또는 최소 주요 카테고리별 commodity 링크 추가

### I4. `themes/food-inflation/` — GSC 미색인 분석

- ✅ title: "Food Inflation"
- ✅ description: 있음 (149자)
- ✅ canonical: 정상
- ❌ **본문이 대부분 Liquid 템플릿 + JavaScript** — Google 크롤러가 렌더링 못 할 수 있음
- 관련 포스트를 동적으로 불러오는 구조 → 크롤러에게는 "thin content"로 보일 수 있음

**수정:** theme 페이지에 **300단어 이상의 정적 텍스트** 콘텐츠를 추가 (현재 overview 텍스트만으로는 부족할 수 있음)

### I5. `description`이 너무 짧은 commodity 페이지 (3개)

| 파일 | 글자 수 | description |
|---|---|---|
| diesel.md | 90자 | "Diesel as the lifeblood of freight..." |
| jet-fuel.md | 92자 | "Jet fuel's outsized impact on airline..." |
| platinum.md | 89자 | "Platinum's pivot from diesel catalysts..." |

**권장:** 120-160자로 확장 (Google snippet에 최적화)

### I6. 콘텐츠 카니발라이제이션 위험 — 유사 주제 다수

같은 commodity에 대해 여러 각도로 포스트를 작성했지만, Google이 서로 경쟁할 수 있음:

**Copper (5개 포스트):**
- copper-economic-indicator
- copper-construction-housing-chain  
- copper-ev-infrastructure-impact
- copper-structural-deficit
- copper-hits-570-ev-infrastructure

**Lithium (4개 포스트):**
- lithium-ev-supply-chain
- lithium-ev-battery-auto-chain
- lithium-surplus-deficit-pivot
- albemarle-lithium-ev-battery

**Oil/Energy (6개+ 포스트):**
- crude-oil-industry-impact, oil-airlines-travel-ripple-chain, oil-price-surge-industry-impact, march-2026-oil-market-opec, oil-hormuz-premium, crude-oil-strait-hormuz-geopolitical-premium

**수정:** 유사 포스트끼리 내부 링크로 연결하고, 각 포스트의 고유한 angle을 title/description에 명확히 차별화

---

## 💡 Nice-to-have

### N1. `robots.txt` 개선

현재:
```
User-agent: *
Allow: /
Sitemap: https://commoditynode.com/sitemap.xml
Disallow: /page/
```

권장 추가:
```
Disallow: /AUDIT_REPORT/
Disallow: /CRON_SETUP/
Disallow: /ROADMAP/
Disallow: /assets/data/
Disallow: /assets/images/
Disallow: /tags/
```

`/tags/` 페이지는 검색 가치가 낮고 크롤링 버짓을 소비함 (39개 태그 페이지)

### N2. sitemap.xml에서 /page/ URL 제거

현재 `page/2` ~ `page/9` (8개 URL)이 sitemap에 포함됨.  
`robots.txt`에서 차단하고 있지만 sitemap에는 여전히 있어 모순.

**수정:** Jekyll 설정에서 pagination 페이지를 sitemap에서 제외

### N3. sitemap.xml에 `<lastmod>` 누락

- commodity 페이지 (54개): `<lastmod>` 없음
- tag/company/industry/theme 인덱스 페이지: `<lastmod>` 없음  
- 포스트만 `<lastmod>` 있음

**수정:** Jekyll sitemap 플러그인 설정에서 `<lastmod>` 자동 포함

### N4. 리디렉션 확인 ✅

- `http://commoditynode.com/` → `https://commoditynode.com/` (301) ✅
- `https://www.commoditynode.com/` → `https://commoditynode.com/` (301) ✅
- 리디렉션 체인 없음 ✅

### N5. OG Image 일관성

포스트에 `image: /assets/images/og-*.png` 설정이 있지만, 새 commodity 페이지 (8개)에 대한 OG 이미지 존재 여부 확인 필요.

---

## 📊 요약 통계

| 항목 | 수치 |
|---|---|
| Sitemap 총 URL | 270개 |
| 포스트 (\_posts/) | 92개 |
| Commodity 허브 (\_commodities/) | 54개 |
| **404 페이지** | **1개** (`/silver-solar-electronics-impact/`) |
| **description 누락** | **3개** 포스트 |
| **description 짧음** (<80자 기준) | **3개** commodity |
| **canonical_url 누락** | **69개** 포스트 (중복 canonical 23개) |
| **고립 페이지** | **92개** 포스트 전체 |
| **내부 문서 노출** | **4개** (AUDIT, CRON, ROADMAP, images) |
| **중복 콘텐츠** | **1쌍** (oil-hormuz) |
| **리디렉션** | ✅ 정상 |

---

## 🎯 우선순위별 액션 플랜

### 1순위 (오늘)
- [ ] `AUDIT_REPORT.md`, `CRON_SETUP.md`, `ROADMAP.md`에 `sitemap: false` 추가
- [ ] `robots.txt`에 내부 문서 + `/assets/data/` Disallow 추가
- [ ] `coffee-price-crash-brazil-surplus`, `crude-oil-strait-hormuz-geopolitical-premium`, `diesel-transportation-inflation`에 description 추가
- [ ] `oil-hormuz-premium` 삭제 또는 301 리디렉트

### 2순위 (이번 주)
- [ ] `silver-solar-electronics-impact` → `silver-price-impact-solar-electronics` 301 리디렉트
- [ ] `default.html` canonical 로직 수정 (중복 제거)
- [ ] index.html에 새 commodity 8개 링크 추가
- [ ] commodity 허브에서 관련 포스트 정적 링크 추가

### 3순위 (다음 주)
- [ ] 전체 포스트 간 내부 링크 강화
- [ ] sitemap에서 /page/ URL 제거
- [ ] 유사 주제 포스트 간 차별화 + 상호 링크
- [ ] theme 페이지에 정적 콘텐츠 보강
