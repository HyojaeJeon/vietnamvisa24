
'use client'

import React from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { 
  Heart, 
  Shield, 
  Clock, 
  Headphones, 
  MapPin, 
  Phone, 
  Mail,
  CheckCircle,
  Users,
  Award,
  Star,
  Building,
  Globe,
  FileText,
  Target,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function AboutUsPage() {
  const promises = [
    {
      icon: FileText,
      title: '과정의 투명성',
      description: '신청 과정 하나하나를 실시간으로 투명하게 공개합니다. 서류 접수부터 최종 승인까지 모든 단계를 온라인 대시보드와 알림을 통해 바로 확인하실 수 있습니다.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: '결과의 전문성',
      description: '10년 이상 집중해온 전문가들로 구성되어 있습니다. 가장 최신 법규를 정확히 이해하고, 수많은 성공 사례를 통해 쌓은 노하우로 안정적이고 확실하게 책임집니다.',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: '소통의 진정성',
      description: '베트남 현지 생활의 어려움을 이해하는 한국어 소통 전문가가 처음 문의부터 비자 수령까지 모든 과정을 직접 책임지고 함께합니다.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  const team = [
    {
      role: '대표 / 비자 전략 총괄',
      message: '베트남에서 비자 문제로 어려움을 겪는 한국 분들을 보며 "이건 아니다"라는 생각으로 이 일을 시작했습니다. 저희 팀은 오직 고객님의 불안감을 해소하고 신뢰를 드리는 데 모든 초점을 맞추고 있습니다.',
      icon: Target,
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      role: '노동허가서 & 거주증 전문 실무팀장',
      message: '15년 이상의 실무 경험을 통해 베트남 노동허가서와 거주증 발급 과정의 모든 변수와 노하우를 축적했습니다. 가장 복잡하고 까다로운 서류 준비부터 현지 관공서 소통까지 모든 전문성을 동원하겠습니다.',
      icon: Shield,
      gradient: 'from-green-600 to-emerald-600'
    },
    {
      role: '고객 소통 & 지원 팀',
      message: '비자 절차는 낯설고 어렵게 느껴질 수 있습니다. 저희 팀은 고객님의 입장에서 모든 질문에 성심껏 답변하고, 진행 상황을 가장 빠르고 정확하게 안내해 드리는 소통의 최전선입니다.',
      icon: Headphones,
      gradient: 'from-purple-600 to-pink-600'
    }
  ];

  const stats = [
    { value: '10+', label: '년 전문 경험', icon: Clock },
    { value: '99.8%', label: '비자 승인률', icon: CheckCircle },
    { value: '10,000+', label: '성공 사례', icon: Users },
    { value: '24/7', label: '고객 지원', icon: Headphones }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-cyan-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full text-blue-700 text-sm font-semibold mb-8">
                <Building className="h-5 w-5" />
                <span>Vietnam Visa Service</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 mb-8 leading-tight">
                베트남 비자, 더 이상<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  불안해하지 마세요
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                복잡한 절차, 불투명한 비용, 예측 불가능한 시간.<br />
                저희는 수많은 한국 분들이 겪는 고충을 해결하고자<br />
                <span className="font-semibold text-slate-800">10년 이상의 노하우를 바탕으로 설립된 '한국인을 위한 비자 전문 파트너'</span>입니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    지금 비자 신청하기
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                  <Phone className="h-5 w-5 mr-2" />
                  무료 상담 받기
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-8 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</div>
                      <div className="text-slate-600 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-800 mb-6">우리의 이야기</h2>
                <p className="text-xl text-slate-600">"답답함"에서 시작되었습니다.</p>
              </div>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
                <CardContent className="p-12">
                  <div className="space-y-8 text-lg text-slate-700 leading-relaxed">
                    <p>
                      베트남에서의 새로운 시작이나 중요한 비즈니스 일정을 앞두고, 가장 기본적인 행정 절차인 '비자' 때문에 발을 동동 구르는 분들을 너무나 많이 보아왔습니다. 어디서부터 시작해야 할지 모를 복잡한 서류들, 신청 후 감감무소식인 진행 상황, 처음 안내받은 비용보다 자꾸 추가되는 수수료…
                    </p>
                    <p>
                      저희 역시 베트남에서 생활하고 일하며 이러한 '답답함'을 직접 겪거나 주변에서 목격했습니다. 단순히 비자 서류를 대행하는 것을 넘어, <span className="font-semibold text-slate-800">한국인의 입장에서 생각하고 한국 문화에 맞는 정직하고 투명하며 예측 가능한 서비스</span>를 제공하는 파트너가 절실히 필요하다고 느꼈습니다.
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-l-4 border-blue-500">
                      <p className="font-semibold text-slate-800">
                        이러한 사명감 하나로 저희는 시작했습니다. 베트남에서 새로운 꿈을 꾸고 도전하는 한국 분들이 비자 문제로 귀한 시간과 에너지를 낭비하지 않도록, 가장 믿음직한 동반자가 되어드리겠다는 약속과 함께 말입니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Promises Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">우리의 약속</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                저희의 모든 서비스는 다음 세 가지 핵심 약속을 바탕으로 운영됩니다.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {promises.map((promise, index) => {
                const IconComponent = promise.icon;
                return (
                  <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 bg-gradient-to-br ${promise.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                        약속 {index + 1}: {promise.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        {promise.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-6">함께하는 전문가들</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                베트남 비자 및 행정 절차에 대한 깊이 있는 이해와 한국 고객에 대한 진심 어린 마음을 가진 전문가들로 구성되어 있습니다.
              </p>
            </div>

            <div className="space-y-8">
              {team.map((member, index) => {
                const IconComponent = member.icon;
                return (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                        <div className={`w-20 h-20 bg-gradient-to-br ${member.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-10 w-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-800 mb-4">{member.role}</h3>
                          <blockquote className="text-lg text-slate-700 leading-relaxed italic">
                            "{member.message}"
                          </blockquote>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Office Location Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-slate-800 mb-6">우리가 일하는 공간</h2>
                <p className="text-xl text-slate-600">
                  베트남 호치민 중심가에 위치한 저희 사무실에서 직접 상담받으실 수 있습니다.
                </p>
              </div>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-2xl">
                <CardContent className="p-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">주소</h3>
                          <p className="text-slate-700">
                            71 Nguyen Chi Thanh, District 5,<br />
                            Ho Chi Minh City, Vietnam
                          </p>
                          <p className="text-sm text-slate-600 mt-2">
                            (정확한 주소는 문의 시 안내)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Phone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">연락처</h3>
                          <p className="text-slate-700">+84 123 4567 890</p>
                          <p className="text-slate-700">Zalo: 093 721 7284</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-800 mb-2">Google 지도</h3>
                          <p className="text-slate-700">
                            'Vietnam Visa Service'로 검색하시면<br />
                            위치를 확인하실 수 있습니다.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl">
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">방문 안내</h3>
                      <p className="text-slate-700 leading-relaxed mb-6">
                        온라인 상담뿐만 아니라 직접 방문하셔서 편안하게 상담받으실 수 있는 열린 공간입니다. 방문 전 미리 연락 주시면 더욱 편리하게 상담받으실 수 있습니다.
                      </p>
                      <p className="text-lg font-semibold text-blue-600 mb-6">
                        따뜻한 차 한잔과 함께 고객님의 이야기에 귀 기울이겠습니다.
                      </p>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl">
                        <MapPin className="h-5 w-5 mr-2" />
                        방문 예약하기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm font-semibold mb-8">
                <Sparkles className="h-5 w-5" />
                <span>신뢰할 수 있는 파트너</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
                베트남 비자,<br />
                <span className="text-blue-200">저희와 함께 시작하세요</span>
              </h2>
              
              <p className="text-xl text-blue-100 mb-12 leading-relaxed">
                10년의 경험과 10,000건의 성공 사례로 증명된<br />
                가장 믿을 수 있는 베트남 비자 전문 서비스입니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/apply">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300">
                    <ArrowRight className="h-5 w-5 mr-2" />
                    지금 비자 신청하기
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300">
                    <Phone className="h-5 w-5 mr-2" />
                    무료 상담 받기
                  </Button>
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center space-x-8 text-white/80">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-medium">99.8% 승인률</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">안전 보장</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">24시간 처리</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
