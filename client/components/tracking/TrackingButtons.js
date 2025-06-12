"use client";

import { useTracking } from "../../hooks/useTracking";
import { Button } from "../src/components/ui/button";

// 추적이 포함된 버튼 컴포넌트들
export function TrackingButton({ children, onClick, eventName, eventCategory, eventLabel, className, ...props }) {
  const { trackEvent } = useTracking();

  const handleClick = (e) => {
    // 추적 이벤트 발생
    trackEvent(eventName, eventCategory, eventLabel);

    // 원래 onClick 핸들러 실행
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Button onClick={handleClick} className={className} {...props}>
      {children}
    </Button>
  );
}

// 비자 신청 시작 버튼
export function VisaApplicationButton({ visaType, children, ...props }) {
  const { trackVisaApplicationStart } = useTracking();

  const handleClick = () => {
    trackVisaApplicationStart(visaType);
    // 신청 페이지로 이동 로직
    window.location.href = "/apply";
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

// 상담 신청 버튼
export function ConsultationButton({ serviceType, children, ...props }) {
  const { trackConsultationRequest } = useTracking();

  const handleClick = () => {
    trackConsultationRequest(serviceType);
    // 상담 신청 로직 또는 카카오톡 링크
    window.open("https://pf.kakao.com/_your_kakao_id", "_blank");
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

// 전화 클릭 버튼
export function PhoneButton({ phoneNumber, children, ...props }) {
  const { trackPhoneClick } = useTracking();

  const handleClick = () => {
    trackPhoneClick();
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}

// 카카오톡 상담 버튼
export function KakaoButton({ kakaoId, children, ...props }) {
  const { trackKakaoChat } = useTracking();

  const handleClick = () => {
    trackKakaoChat();
    window.open(`https://pf.kakao.com/${kakaoId}`, "_blank");
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
