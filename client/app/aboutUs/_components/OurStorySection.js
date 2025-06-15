'use client'
import React from 'react'
import { Card, CardContent } from '../../src/components/ui/card'

export default function OurStorySection() {
  return (
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
  )
}
