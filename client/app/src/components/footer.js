import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage.js';
import { t } from '../lib/translations.js';

function Footer() {
  const { currentLanguage } = useLanguage();
  
  const footerSections = {
    company: {
      title: t('footer.company', currentLanguage),
      links: [
        { name: '회사소개', href: '#about' },
        { name: '비전과 미션', href: '#' },
        { name: '채용정보', href: '#' },
        { name: '언론보도', href: '#' }
      ]
    },
    services: {
      title: t('footer.services', currentLanguage),
      links: [
        { name: '관광비자', href: '#services' },
        { name: '상용비자', href: '#services' },
        { name: '전자비자', href: '#services' },
        { name: '초청장 발급', href: '#additional-services' }
      ]
    },
    support: {
      title: '고객지원',
      links: [
        { name: 'FAQ', href: '#faq' },
        { name: '문의하기', href: '#contact' },
        { name: '이용약관', href: '#' },
        { name: '개인정보처리방침', href: '#' }
      ]
    }
  };

  return (
    <footer className="bg-[#003366] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">VV</span>
              </div>
              <span className="text-xl font-bold">Vietnam Visa</span>
            </div>
            <p className="text-blue-200 leading-relaxed">
              베트남 비자 전문 대행 서비스로 빠르고 안전한 비자 발급을 도와드립니다.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">빠른 링크</h3>
            <ul className="space-y-2">
              <li><a href="#services" className="text-blue-200 hover:text-orange-300 transition-colors">비자 서비스</a></li>
              <li><a href="#process" className="text-blue-200 hover:text-orange-300 transition-colors">신청 절차</a></li>
              <li><a href="#additional" className="text-blue-200 hover:text-orange-300 transition-colors">부가 서비스</a></li>
              <li><a href="#faq" className="text-blue-200 hover:text-orange-300 transition-colors">자주 묻는 질문</a></li>
              <li><a href="#contact" className="text-blue-200 hover:text-orange-300 transition-colors">문의하기</a></li>
            </ul>
          </div>

          {/* Visa Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">비자 종류</h3>
            <ul className="space-y-2">
              <li><span className="text-blue-200">관광 비자 (DL)</span></li>
              <li><span className="text-blue-200">상용 비자 (DN)</span></li>
              <li><span className="text-blue-200">전자 비자 (EV)</span></li>
              <li><span className="text-blue-200">초청장 발급</span></li>
              <li><span className="text-blue-200">서류 번역/공증</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">연락처</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-400" />
                <span className="text-blue-200">02-1234-5678</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-orange-400" />
                <span className="text-blue-200">info@vietnamvisa.co.kr</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-1" />
                <span className="text-blue-200">서울특별시 강남구<br />테헤란로 123길 45</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-200 text-sm">
              © 2024 Vietnam Visa Service. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-blue-200 hover:text-orange-300 text-sm transition-colors">이용약관</a>
              <a href="#" className="text-blue-200 hover:text-orange-300 text-sm transition-colors">개인정보처리방침</a>
              <a href="#" className="text-blue-200 hover:text-orange-300 text-sm transition-colors">환불정책</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer