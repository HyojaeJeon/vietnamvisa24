"use client";

import Script from "next/script";

// 네이버 애널리틱스 컴포넌트
export default function NaverAnalytics({ ANALYTICS_ID }) {
  return (
    <Script
      id="naver-analytics"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(window, document, dataLayer, id) {
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', id);
            function loadGtagScript() {
              var gtagScript = document.createElement('script');
              gtagScript.async = true;
              gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
              document.head.appendChild(gtagScript);
            }
            window.dataLayer = window.dataLayer || [];
            loadGtagScript();
          })(window, document, window.dataLayer || [], '${ANALYTICS_ID}');
        `,
      }}
    />
  );
}
