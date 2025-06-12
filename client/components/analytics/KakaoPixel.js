"use client";

import Script from "next/script";

// Kakao Pixel 컴포넌트
export default function KakaoPixel({ PIXEL_ID }) {
  return (
    <Script
      id="kakao-pixel"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          !function(e,n,t,a,k,o,r,i){e.kakaoPixel=e.kakaoPixel||function(){
          (e.kakaoPixel.q=e.kakaoPixel.q||[]).push(arguments)};
          o=n.createElement(t);o.async=1;o.src=a;
          r=n.getElementsByTagName(t)[0];r.parentNode.insertBefore(o,r);
          e.kakaoPixel('config','${PIXEL_ID}');
          }(window,document,'script','//t1.daumcdn.net/kas/static/kp.js');
          kakaoPixel('pageView');
        `,
      }}
    />
  );
}
