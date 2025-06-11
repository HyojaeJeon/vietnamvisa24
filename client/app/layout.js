import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "베트남 비자 센터 | Vietnam Visa Center",
  description: "신뢰할 수 있는 베트남 비자 전문 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}