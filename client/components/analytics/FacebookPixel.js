"use client";

import Script from "next/script";

// Facebook Pixel 컴포넌트
export default function FacebookPixel({ PIXEL_ID }) {
  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            
            // Standard events only to reduce warnings
            fbq('init', '${PIXEL_ID}', {
              'em': 'external_id'
            });
            fbq('track', 'PageView');
            
            // Optional: Advanced Matching for better tracking
            // fbq('init', '${PIXEL_ID}', {}, {
            //   "agent": "plnextjs"
            // });
          `,
        }}
      />
      <noscript>
        <img height="1" width="1" style={{ display: "none" }} src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`} alt="" loading="lazy" />
      </noscript>
    </>
  );
}
