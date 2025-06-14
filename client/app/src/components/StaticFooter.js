import React from "react";
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Clock, Shield, Award, Star } from "lucide-react";

// 서버 사이드 렌더링을 위한 정적 Footer 컴포넌트
function StaticFooter() {
  const footerSections = {
    company: {
      title: "회사 정보",
      links: [
        { name: "회사소개", href: "#about" },
        { name: "비전과 미션", href: "#" },
        { name: "채용정보", href: "#" },
        { name: "언론보도", href: "#" },
      ],
    },
    services: {
      title: "서비스",
      links: [
        { name: "관광비자", href: "#services" },
        { name: "상용비자", href: "#services" },
        { name: "전자비자", href: "#services" },
        { name: "초청장 발급", href: "#additional-services" },
      ],
    },
    support: {
      title: "고객지원",
      links: [
        { name: "FAQ", href: "#faq" },
        { name: "문의하기", href: "#contact" },
        { name: "이용약관", href: "#" },
        { name: "개인정보처리방침", href: "#" },
      ],
    },
  };

  const contactInfo = [
    { icon: Phone, label: "전화", value: "1588-0000", desc: "24시간 상담 가능" },
    { icon: Mail, label: "이메일", value: "info@vietnamvisa24.com", desc: "빠른 답변 보장" },
    { icon: MapPin, label: "주소", value: "서울시 강남구 테헤란로 123", desc: "방문 상담 가능" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Youtube, href: "#", name: "YouTube" },
  ];

  const certifications = [
    { icon: Award, text: "정부 공인 대행업체" },
    { icon: Shield, text: "ISO 27001 인증" },
    { icon: Star, text: "5성급 고객 서비스" },
  ];

  return (
    <footer className="bg-[#003366] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-400 to-purple-400"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="container px-4 mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
              {/* Company Info */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 shadow-lg bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <span className="text-xl font-bold text-white">VV</span>
                  </div>
                  <span className="text-2xl font-bold">Vietnam Visa</span>
                </div>

                <p className="leading-relaxed text-blue-200">베트남 비자 전문 대행 서비스로 99.8%의 높은 승인률과 빠른 처리로 고객님의 소중한 시간을 절약해드립니다.</p>

                {/* Certifications */}
                <div className="space-y-3">
                  {certifications.map((cert, index) => {
                    const IconComponent = cert.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3">
                        <IconComponent className="flex-shrink-0 w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-blue-200">{cert.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const IconComponent = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.href}
                        className="flex items-center justify-center w-10 h-10 transition-all duration-300 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 group"
                        aria-label={social.name}
                      >
                        <IconComponent className="w-5 h-5 text-blue-200 transition-colors group-hover:text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Links Sections */}
              {Object.entries(footerSections).map(([key, section]) => (
                <div key={key} className="space-y-6">
                  <h3 className="pb-2 text-lg font-semibold text-white border-b border-blue-400/30">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, index) => (
                      <li key={index}>
                        <a href={link.href} className="flex items-center text-blue-200 transition-colors duration-300 hover:text-white group">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Contact Info */}
              <div className="space-y-6">
                <h3 className="pb-2 text-lg font-semibold text-white border-b border-blue-400/30">연락처</h3>

                <div className="space-y-4">
                  {contactInfo.map((contact, index) => {
                    const IconComponent = contact.icon;
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                            <IconComponent className="w-4 h-4 text-blue-300" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{contact.value}</div>
                            <div className="text-sm text-blue-200">{contact.desc}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Business Hours */}
                <div className="p-4 border bg-white/5 backdrop-blur-sm rounded-xl border-white/10">
                  <div className="flex items-center mb-3 space-x-2">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span className="font-medium text-white">운영시간</span>
                  </div>
                  <div className="space-y-1 text-sm text-blue-200">
                    <div>평일: 09:00 - 18:00</div>
                    <div>토요일: 09:00 - 13:00</div>
                    <div className="font-medium text-green-400">24시간 온라인 상담</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-blue-400/20">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
              <div className="text-sm text-blue-200">© 2024 Vietnam Visa. All rights reserved. | 사업자등록번호: 123-45-67890</div>

              <div className="flex items-center space-x-6 text-sm text-blue-200">
                <span>개인정보처리방침</span>
                <span>이용약관</span>
                <span>사이트맵</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default StaticFooter;
