'use client'
import React from 'react'
import { Button } from '../../src/components/ui/button'
import Link from 'next/link'
import { Building, ArrowRight, Phone } from 'lucide-react'

export default function HeroSection() {
  return (
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
  )
}
