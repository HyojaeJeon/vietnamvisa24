'use client'
import React from 'react'
import { Button } from '../../src/components/ui/button'
import { ArrowRight, Phone, Star, Shield, Clock } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white text-sm font-semibold mb-8">
            <Star className="h-5 w-5" />
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
  )
}
