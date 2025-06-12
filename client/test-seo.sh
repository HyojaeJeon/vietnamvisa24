#!/bin/bash

# SEO 및 성능 테스트 스크립트

echo "🧪 vietnamvisa24 SEO 및 성능 테스트 시작..."

# 환경 변수 확인
echo "📋 환경 변수 확인..."
if [ -z "$NEXT_PUBLIC_GA_MEASUREMENT_ID" ]; then
    echo "⚠️ Google Analytics ID가 설정되지 않았습니다."
else
    echo "✅ Google Analytics ID: $NEXT_PUBLIC_GA_MEASUREMENT_ID"
fi

if [ -z "$NEXT_PUBLIC_GTM_ID" ]; then
    echo "⚠️ Google Tag Manager ID가 설정되지 않았습니다."
else
    echo "✅ Google Tag Manager ID: $NEXT_PUBLIC_GTM_ID"
fi

if [ -z "$NEXT_PUBLIC_FACEBOOK_PIXEL_ID" ]; then
    echo "⚠️ Facebook Pixel ID가 설정되지 않았습니다."
else
    echo "✅ Facebook Pixel ID: $NEXT_PUBLIC_FACEBOOK_PIXEL_ID"
fi

# 파일 존재 확인
echo "📁 필수 파일 확인..."
files=(
    "public/robots.txt"
    "public/sitemap.xml"
    "public/manifest.json"
    "public/favicon.svg"
    "public/apple-touch-icon.svg"
    "public/images/og-image.svg"
    "components/analytics/index.js"
    "components/seo/StructuredData.js"
    "hooks/useTracking.js"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 파일이 없습니다."
    fi
done

# robots.txt 검증
echo "🤖 robots.txt 검증..."
if grep -q "Sitemap:" public/robots.txt; then
    echo "✅ 사이트맵 URL이 robots.txt에 포함되어 있습니다."
else
    echo "❌ robots.txt에 사이트맵 URL이 없습니다."
fi

# 사이트맵 검증
echo "🗺️ sitemap.xml 검증..."
if grep -q "<urlset" public/sitemap.xml; then
    echo "✅ 유효한 XML 사이트맵입니다."
else
    echo "❌ 잘못된 사이트맵 형식입니다."
fi

# 매니페스트 검증
echo "📱 manifest.json 검증..."
if [ -f "public/manifest.json" ]; then
    if jq empty public/manifest.json 2>/dev/null; then
        echo "✅ 유효한 JSON 매니페스트입니다."
    else
        echo "❌ 잘못된 JSON 매니페스트 형식입니다."
    fi
fi

# Next.js 빌드 테스트
echo "🏗️ Next.js 빌드 테스트..."
if npm run build 2>/dev/null; then
    echo "✅ 빌드가 성공했습니다."
else
    echo "❌ 빌드에 실패했습니다."
fi

# 성능 권장사항
echo "🚀 성능 최적화 권장사항:"
echo "1. 이미지를 WebP 또는 AVIF 형식으로 변환하세요"
echo "2. 폰트를 preload하여 CLS를 줄이세요"
echo "3. Critical CSS를 인라인으로 포함하세요"
echo "4. JavaScript 번들 크기를 모니터링하세요"

echo "✅ 테스트 완료!"
