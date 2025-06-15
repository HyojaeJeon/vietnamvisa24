'use client'
import React from 'react'
import { Card, CardContent } from '../../src/components/ui/card'
import { promises } from '../_utils/constants'
import { FileText, Award, Heart } from 'lucide-react'

const iconMap = { FileText, Award, Heart }

export default function PromisesSection() {
  return (
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
            const IconComponent = iconMap[promise.icon]
            return (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${promise.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-blue-600 transition-colors">
                    약속 {index + 1}: {promise.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">{promise.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
