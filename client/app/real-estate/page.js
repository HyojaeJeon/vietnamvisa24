
'use client'

import React from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Building, Home, MapPin, Phone, MessageCircle, Users, Shield } from 'lucide-react';

export default function RealEstate() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 font-sans">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              <span>VietnamVisa24</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 font-sans">호치민 부동산</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto font-sans">
              호치민 부동산 임대<br />
              호치민 부동산 매매<br />
              아파트 단기 장기 렌트 & 매매
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100 font-medium px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                KAKAO 상담
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-amber-600 font-medium px-8 py-3">
                <Phone className="h-5 w-5 mr-2" />
                Zalo 상담
              </Button>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-sans">부동산 서비스</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Building className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <CardTitle className="font-sans">매매 중개</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-sans">아파트, 빌라, 상가 매매 전문 중개</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <Home className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle className="font-sans">임대 관리</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-sans">단기/장기 임대차 계약 및 관리 서비스</p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="font-sans">투자 컨설팅</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 font-sans">수익성 분석 및 투자 전략 컨설팅</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Platform Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 font-sans">부동산 홈페이지 안내사항</h2>
            <div className="max-w-4xl mx-auto">
              <Card className="mb-8">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <Users className="h-16 w-16 text-amber-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 font-sans">직접 연결 서비스</h3>
                    <p className="text-lg text-gray-600 font-sans">
                      고객이 원하는 매물을 찾으시면, 공급자와 직접 연결해 보다 정확하고 자세한 정보를 확인할 수 있도록 오프라인 상담까지 지원합니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4 text-gray-800 font-sans">신뢰할 수 있는 플랫폼</h3>
                    <div className="space-y-4 text-gray-600 font-sans">
                      <p>
                        호방넷은 정식 약정을 맺은 개인 및 기업 에이전트가 자유롭게 부동산 매물을 등록할 수 있는 열린 플랫폼입니다.
                      </p>
                      <p>
                        투명하고 신뢰할 수 있는 거래 환경을 제공하며,
                      </p>
                      <p>
                        고객과 공급자가 직접 연결되는 효율적인 부동산 생태계를 지향합니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gradient-to-r from-amber-600 to-yellow-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 font-sans">부동산 상담 문의</h2>
            <p className="text-xl mb-8 font-sans">
              전문 부동산 상담사가 고객님의 요구에 맞는 최적의 매물을 찾아드립니다.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-medium px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                KAKAO : hcm2424
              </Button>
              <Button size="lg" className="bg-blue-500 text-white hover:bg-blue-400 font-medium px-8 py-3">
                <Phone className="h-5 w-5 mr-2" />
                Zalo : 093 721 7284
              </Button>
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-8 bg-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-sans">VietnamVisa24</h3>
              <p className="text-gray-300 font-sans">사업자 등록번호 : 79-1252/2021</p>
              <p className="text-gray-300 font-sans">
                Address : 93 Cao Trieu Phat. Tan Phong Ward, District 7, Phu My Hung, HCMC.
              </p>
              <p className="text-gray-400 text-sm font-sans">
                Copyright ⓒ 2025 VietnamVisa24 All rights reserved.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
