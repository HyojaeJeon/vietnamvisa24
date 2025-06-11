
'use client'

import React from 'react';
import Header from '../src/components/header';
import Footer from '../src/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card';
import { Button } from '../src/components/ui/button';
import { Car, Shield, Users, MapPin, Clock, Phone, MessageCircle, CheckCircle, XCircle } from 'lucide-react';

export default function CarRental() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 font-sans">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              <span>VietnamVisa24</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 font-sans">호치민 렌트카</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto font-sans">
              하루 / 장기 렌트카<br />
              호치민투어<br />
              골프장왕복<br />
              골프장 부킹 서비스
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 font-medium px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                KAKAO 문의: hcm2424
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-600 font-medium px-8 py-3">
                <Phone className="h-5 w-5 mr-2" />
                Zalo 문의: 093 721 7284
              </Button>
            </div>
          </div>
        </section>

        {/* Service Description */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">렌터카 안내사항</h2>
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-700 mb-6">
                편리하고 안전한 렌터카 서비스 호치민을 비롯한 베트남 전역에서 자유로운 이동을 위한 렌터카 서비스를 제공합니다.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                운전기사 포함 차량부터 단기·장기 렌트까지, 여행, 출장, 생활 목적에 맞는 다양한 차량 옵션을 제공하며,
                예약부터 이용까지 전 과정에서 신속하고 친절한 지원을 약속드립니다.
              </p>
              <p className="text-lg text-gray-700">
                공식 등록된 차량과 보험이 포함된 안전한 서비스로, 처음 베트남을 방문하신 분들도 안심하고 이용하실 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* How to Use */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">렌터카 사용방법</h2>
            <div className="max-w-2xl mx-auto">
              <div className="grid gap-6">
                {[
                  { step: '1', title: '예약 방법 확인후 카톡 전송' },
                  { step: '2', title: '바우처 1일 내 발송' },
                  { step: '3', title: '현지 도착 후: 피켓 확인 후 담당 직원이 픽업 진행' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
                      {item.step}
                    </div>
                    <p className="text-lg">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Process */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">렌트카 예약방법</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-600">STEP 1 (기본정보)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">예약자 영문 성명 & 인원</h4>
                      <p className="text-gray-600">예) hong gil dong 외 1</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">픽업 날짜와 픽업시간</h4>
                      <p className="text-gray-600">예) 6월18일 07:00</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">핸드폰번호</h4>
                      <p className="text-gray-600">예) 010 2025 2025</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-600">STEP 2 (위치정보)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">픽업지 호텔 이름이나 주소</h4>
                      <p className="text-gray-600">예) 빈홈 랜드마크</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">드랍 장소</h4>
                      <p className="text-gray-600">예) 호치민 광장</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">렌트카 서비스</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <Car className="h-12 w-12 text-cyan-600 mx-auto mb-4" />
                  <CardTitle>다양한 차종</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>소형차부터 SUV까지 다양한 차종 보유</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <CardTitle>완전보험</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>종합보험 및 자차보험 완비</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <CardTitle>전문 기사</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>현지 전문 기사 동행 서비스</p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <MapPin className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle>픽업/반납</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>공항, 호텔 등 원하는 장소에서 픽업/반납</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Included/Not Included */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">렌트카 예약 포함 / 불포함 사항</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-600 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-2" />
                    포함사항
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      마중, 피켓 서비스
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      전문 운전기사
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      차량 사용비
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      톨게이트비
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      주유비
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      주차비
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      지연대기
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center">
                    <XCircle className="h-6 w-6 mr-2" />
                    불포함사항
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      팁
                    </li>
                    <li className="flex items-center">
                      <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      개인비용
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-700 mb-2">픽업방법</h4>
                    <p className="text-blue-600">피켓 확인 후 픽업</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Vehicle Types */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">차량 라인업</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  category: "이코노미",
                  models: ["Toyota Vios", "Hyundai Accent"],
                  price: "$25/일",
                  passengers: "4명",
                  luggage: "2개"
                },
                {
                  category: "컴팩트",
                  models: ["Honda Civic", "Toyota Altis"],
                  price: "$35/일",
                  passengers: "5명",
                  luggage: "3개"
                },
                {
                  category: "SUV",
                  models: ["Toyota Fortuner", "Ford Everest"],
                  price: "$55/일",
                  passengers: "7명",
                  luggage: "5개"
                }
              ].map((vehicle, index) => (
                <Card key={index}>
                  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                    <Car className="h-16 w-16 text-gray-500" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-center">{vehicle.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-center">
                      <p className="text-sm text-gray-600">{vehicle.models.join(", ")}</p>
                      <div className="flex justify-between">
                        <span>승객:</span>
                        <span>{vehicle.passengers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>수하물:</span>
                        <span>{vehicle.luggage}</span>
                      </div>
                      <div className="text-2xl font-bold text-cyan-600 mt-4">
                        {vehicle.price}
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">예약하기</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-cyan-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">렌트카 예약 문의</h2>
            <p className="text-xl mb-8">편리하고 안전한 호치민 렌트카 서비스</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Button size="lg" className="bg-white text-cyan-600 hover:bg-gray-100 font-medium px-8 py-3">
                <MessageCircle className="h-5 w-5 mr-2" />
                KAKAO: hcm2424
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-cyan-600 font-medium px-8 py-3">
                <Phone className="h-5 w-5 mr-2" />
                Zalo: 093 721 7284
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
