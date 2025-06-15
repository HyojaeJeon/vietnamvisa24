'use client'
import React from 'react'
import { Card, CardContent } from '../../src/components/ui/card'
import { Target, Shield, Headphones } from 'lucide-react'
import { team } from '../_utils/constants'

const iconMap = { Target, Shield, Headphones }

export default function TeamSection() {
  return (
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
            const IconComponent = iconMap[member.icon]
            return (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${member.gradient} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-10 w-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 mb-4">{member.role}</h3>
                      <blockquote className="text-lg text-slate-700 leading-relaxed italic">"{member.message}"</blockquote>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
