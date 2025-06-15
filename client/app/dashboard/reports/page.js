
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Download,
  Calendar,
  Filter,
  Eye,
  Globe,
  Clock,
  CheckCircle
} from 'lucide-react';

export default function ReportsAndAnalytics() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Mock data for charts and reports
  const overviewStats = [
    {
      title: '총 신청 건수',
      value: '1,234',
      change: '+12.5%',
      changeType: 'increase',
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: '승인률',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600'
    },
    {
      title: '평균 처리 시간',
      value: '3.2일',
      change: '-0.8일',
      changeType: 'decrease',
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: '총 매출',
      value: '₩125M',
      change: '+18.3%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const visaTypeStats = [
    { type: 'E-visa', count: 658, percentage: 53.3, revenue: '₩45M' },
    { type: 'Business Visa', count: 312, percentage: 25.3, revenue: '₩38M' },
    { type: '노동허가서', count: 186, percentage: 15.1, revenue: '₩32M' },
    { type: '기타', count: 78, percentage: 6.3, revenue: '₩10M' }
  ];

  const monthlyData = [
    { month: '1월', applications: 89, approvals: 84, revenue: 8900000 },
    { month: '2월', applications: 95, approvals: 89, revenue: 9500000 },
    { month: '3월', applications: 102, approvals: 97, revenue: 10200000 },
    { month: '4월', applications: 118, approvals: 112, revenue: 11800000 },
    { month: '5월', applications: 134, approvals: 128, revenue: 13400000 },
    { month: '6월', applications: 142, approvals: 134, revenue: 14200000 }
  ];

  const topCountries = [
    { country: '대한민국', count: 1089, percentage: 88.2 },
    { country: '일본', count: 67, percentage: 5.4 },
    { country: '중국', count: 45, percentage: 3.6 },
    { country: '미국', count: 23, percentage: 1.9 },
    { country: '기타', count: 10, percentage: 0.9 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3" />
            통계 및 리포트
          </h1>
          <p className="text-gray-600 mt-2">
            비즈니스 성과를 분석하고 데이터 기반 의사결정을 지원합니다.
          </p>
        </div>
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">최근 1주</option>
            <option value="month">최근 1개월</option>
            <option value="quarter">최근 3개월</option>
            <option value="year">최근 1년</option>
          </select>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">전월 대비</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              월별 신청 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((data, index) => {
                const maxApplications = Math.max(...monthlyData.map(d => d.applications));
                const width = (data.applications / maxApplications) * 100;
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{data.month}</span>
                      <span className="text-sm text-gray-600">{data.applications}건</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>승인: {data.approvals}건</span>
                      <span>매출: ₩{(data.revenue / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Visa Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              비자 유형별 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visaTypeStats.map((visa, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{visa.type}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{visa.count}건</span>
                      <span className="text-xs text-gray-500 ml-2">({visa.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${visa.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-green-600 font-medium">{visa.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              국가별 신청 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCountries.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{country.country}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{country.count}</div>
                    <div className="text-xs text-gray-500">{country.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Processing Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              처리 시간 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-green-800">1일 이내</span>
                <span className="text-sm font-bold text-green-900">245건 (19.8%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-blue-800">2-3일</span>
                <span className="text-sm font-bold text-blue-900">567건 (46.0%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-yellow-800">4-7일</span>
                <span className="text-sm font-bold text-yellow-900">298건 (24.1%)</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-red-800">7일 초과</span>
                <span className="text-sm font-bold text-red-900">124건 (10.1%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              매출 요약
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">₩125,000,000</div>
                <div className="text-sm text-gray-600">이번 달 총 매출</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">평균 건당 매출</span>
                  <span className="text-sm font-semibold">₩101,300</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">목표 달성률</span>
                  <span className="text-sm font-semibold text-green-600">118.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">전월 대비</span>
                  <span className="text-sm font-semibold text-blue-600">+18.3%</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <div className="text-xs text-gray-500 text-center">
                  목표: ₩105M | 달성: ₩125M
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-green-500 to-blue-600 h-2 rounded-full" style={{ width: '118%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle>상세 리포트</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6" />
              <span>신청 현황 리포트</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6" />
              <span>고객 분석 리포트</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <DollarSign className="h-6 w-6" />
              <span>매출 분석 리포트</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
