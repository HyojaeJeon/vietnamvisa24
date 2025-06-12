# SEO 및 마케팅 추적 구현 가이드

vietnamvisa24 클라이언트 프로젝트에 SEO 최적화와 다양한 마케팅 추적 도구를 성공적으로 구현했습니다.

## 🎯 구현된 기능

### 1. SEO 최적화

- **메타데이터 확장**: Open Graph, Twitter Cards, 다국어 지원
- **구조화된 데이터**: JSON-LD 스키마로 비즈니스 정보, 서비스 정보 구조화
- **사이트맵**: 정적/동적 사이트맵 생성 유틸리티
- **PWA 매니페스트**: 앱 설치 지원 및 바로가기 제공
- **robots.txt**: 검색엔진 크롤링 최적화

### 2. 마케팅 추적

- **Google Analytics 4**: 페이지뷰, 이벤트, 전환 추적
- **Google Tag Manager**: 통합 태그 관리
- **Facebook Pixel**: 페이스북 광고 최적화
- **네이버 애널리틱스**: 국내 검색 최적화
- **카카오 픽셀**: 카카오 광고 플랫폼 연동

### 3. 이벤트 추적 시스템

- **커스텀 훅**: `useTracking` 훅으로 통합 이벤트 관리
- **자동 추적**: 페이지뷰, 비자 신청, 상담 요청 등
- **추적 컴포넌트**: 버튼 클릭, 전화 걸기, 카카오톡 상담 등

## 📁 새로 추가된 파일들

```
client/
├── components/
│   ├── analytics/
│   │   ├── GoogleAnalytics.js      # GA4 추적
│   │   ├── GoogleTagManager.js     # GTM 설정
│   │   ├── FacebookPixel.js        # Facebook 픽셀
│   │   ├── NaverAnalytics.js       # 네이버 분석
│   │   ├── KakaoPixel.js          # 카카오 픽셀
│   │   └── index.js               # 통합 추적 스크립트
│   ├── seo/
│   │   └── StructuredData.js      # JSON-LD 구조화 데이터
│   └── tracking/
│       └── TrackingButtons.js     # 추적 기능이 포함된 버튼들
├── hooks/
│   └── useTracking.js             # 이벤트 추적 훅
├── lib/
│   ├── seo.js                     # SEO 메타데이터 유틸리티
│   └── sitemap.js                 # 사이트맵 생성 유틸리티
├── public/
│   ├── manifest.json              # PWA 매니페스트
│   ├── robots.txt                 # 검색엔진 크롤링 규칙
│   └── sitemap.xml               # 정적 사이트맵
└── app/
    ├── layout.js                  # 업데이트: 추적 스크립트 통합
    └── e-visa/
        └── metadata.js            # E-visa 페이지 메타데이터
```

## 🔧 환경변수 설정

`.env.local` 파일에 다음 변수들을 설정하세요:

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://vietnamvisa24.com

# Analytics & Tracking
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
NEXT_PUBLIC_NAVER_ANALYTICS_ID=your_naver_id
NEXT_PUBLIC_KAKAO_PIXEL_ID=your_kakao_id

# SEO Verification
NEXT_PUBLIC_GOOGLE_VERIFICATION=google_verification_code
NEXT_PUBLIC_NAVER_VERIFICATION=naver_verification_code
```

## 📊 사용 방법

### 1. 기본 이벤트 추적

```jsx
import { useTracking } from "../../hooks/useTracking";

function MyComponent() {
  const { trackVisaApplicationStart } = useTracking();

  const handleApply = () => {
    trackVisaApplicationStart("E-비자");
    // 신청 로직
  };
}
```

### 2. 추적 버튼 컴포넌트 사용

```jsx
import { VisaApplicationButton, ConsultationButton } from "../../components/tracking/TrackingButtons";

function ServicePage() {
  return (
    <div>
      <VisaApplicationButton visaType="E-비자">지금 신청하기</VisaApplicationButton>

      <ConsultationButton serviceType="E-비자">상담 신청</ConsultationButton>
    </div>
  );
}
```

### 3. 페이지별 메타데이터 설정

```jsx
// app/your-page/page.js
import { generateMetadata as generateSEOMetadata } from "../../lib/seo";

export function generateMetadata() {
  return generateSEOMetadata({
    title: "페이지 제목",
    description: "페이지 설명",
    keywords: ["키워드1", "키워드2"],
    path: "/your-page",
  });
}
```

## 🎯 추적되는 이벤트들

1. **비자 신청 관련**

   - 신청 시작 (`visa_application_start`)
   - 신청 완료 (`visa_application_complete`)

2. **상담 및 문의**

   - 상담 신청 (`consultation_request`)
   - 서비스 문의 (`service_inquiry`)

3. **연락처 클릭**

   - 전화 클릭 (`phone_click`)
   - 카카오톡 상담 (`kakao_chat`)

4. **페이지 추적**
   - 자동 페이지뷰 추적
   - 사용자 행동 분석

## 🚀 다음 단계

1. **실제 추적 ID 설정**: 개발용 주석 처리된 추적 ID들을 실제 값으로 교체
2. **이미지 최적화**: OG 이미지, 파비콘, PWA 아이콘들 추가
3. **A/B 테스트**: GTM을 통한 A/B 테스트 설정
4. **전환 목표**: Google Ads, Facebook Ads 전환 목표 설정
5. **성능 모니터링**: Core Web Vitals 및 사용자 경험 최적화

이제 vietnamvisa24는 완전한 SEO 최적화와 마케팅 추적 시스템을 갖추게 되었습니다! 📈
