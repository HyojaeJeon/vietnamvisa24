'use client'
import React from 'react'
import { Card, CardContent } from '../../src/components/ui/card'
import { MapPin, Phone, Globe } from 'lucide-react'
import { Button } from '../../src/components/ui/button'

export default function OfficeLocationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-800 mb-6">우리가 일하는 공간</h2>
            <p className="text-xl text-slate-600">베트남 호치민 중심가에 위치한 저희 사무실에서 직접 상담받으실 수 있습니다.</p>
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
                      <p className="text-slate-700">71 Nguyen Chi Thanh, District 5,<br />Ho Chi Minh City, Vietnam</p>
                      <p className="text-sm text-slate-600 mt-2">(정확한 주소는 문의 시 안내)</p>
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
                      <p className="text-slate-700">'Vietnam Visa Service'로 검색하시면<br />위치를 확인하실 수 있습니다.</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">방문 안내</h3>
                  <p className="text-slate-700 leading-relaxed mb-6">온라인 상담뿐만 아니라 직접 방문하셔서 편안하게 상담받으실 수 있는 열린 공간입니다. 방문 전 미리 연락 주시면 더욱 편리하게 상담받으실 수 있습니다.</p>
                  <p className="text-lg font-semibold text-blue-600 mb-6">따뜻한 차 한잔과 함께 고객님의 이야기에 귀 기울이겠습니다.</p>
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
  )
}
