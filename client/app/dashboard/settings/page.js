
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { 
  Settings,
  Bell,
  Mail,
  Shield,
  Database,
  Globe,
  Palette,
  Clock,
  Save,
  AlertTriangle,
  CheckCircle,
  Key,
  Monitor
} from 'lucide-react';

export default function SystemSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    companyName: '베트남 비자 서비스',
    companyEmail: 'admin@vietnamvisa.co.kr',
    companyPhone: '+82-2-1234-5678',
    companyAddress: '서울시 강남구 테헤란로 123',
    timezone: 'Asia/Seoul',
    language: 'ko',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    dailyReport: true,
    weeklyReport: true,
    monthlyReport: true,
    
    // Security Settings
    sessionTimeout: 30,
    passwordExpiry: 90,
    twoFactorAuth: false,
    ipWhitelist: '',
    
    // API Settings
    apiRateLimit: 1000,
    apiTimeout: 30,
    webhookUrl: '',
    
    // Visa Processing Settings
    defaultProcessingTime: 3,
    urgentProcessingTime: 1,
    autoStatusUpdate: true,
    autoEmailSend: true
  });

  const tabs = [
    { id: 'general', label: '일반 설정', icon: Settings },
    { id: 'notifications', label: '알림 설정', icon: Bell },
    { id: 'security', label: '보안 설정', icon: Shield },
    { id: 'processing', label: '처리 설정', icon: Clock },
    { id: 'api', label: 'API 설정', icon: Database },
    { id: 'appearance', label: '외관 설정', icon: Palette }
  ];

  const handleSave = () => {
    // Save settings logic
    alert('설정이 저장되었습니다.');
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  회사명
                </label>
                <Input
                  value={settings.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표 이메일
                </label>
                <Input
                  type="email"
                  value={settings.companyEmail}
                  onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  대표 전화번호
                </label>
                <Input
                  value={settings.companyPhone}
                  onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                <Input
                  value={settings.companyAddress}
                  onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간대
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => handleInputChange('timezone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
                  <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (UTC+7)</option>
                  <option value="UTC">UTC (UTC+0)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 언어
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ko">한국어</option>
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">알림 채널</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">이메일 알림</p>
                      <p className="text-sm text-gray-600">중요한 업데이트를 이메일로 받기</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium">푸시 알림</p>
                      <p className="text-sm text-gray-600">브라우저 푸시 알림 받기</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={(e) => handleInputChange('pushNotifications', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">리포트 알림</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">일일 리포트</p>
                    <p className="text-sm text-gray-600">매일 오후 6시에 일일 현황 리포트</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dailyReport}
                    onChange={(e) => handleInputChange('dailyReport', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">주간 리포트</p>
                    <p className="text-sm text-gray-600">매주 월요일 오전 9시에 주간 요약</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReport}
                    onChange={(e) => handleInputChange('weeklyReport', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">월간 리포트</p>
                    <p className="text-sm text-gray-600">매월 1일 오전 10시에 월간 분석</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.monthlyReport}
                    onChange={(e) => handleInputChange('monthlyReport', e.target.checked)}
                    className="w-4 h-4 text-blue-600"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  세션 타임아웃 (분)
                </label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  비밀번호 만료 주기 (일)
                </label>
                <Input
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleInputChange('passwordExpiry', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Key className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">2단계 인증</p>
                  <p className="text-sm text-gray-600">추가 보안을 위한 2FA 활성화</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                className="w-4 h-4 text-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                IP 화이트리스트
              </label>
              <textarea
                rows={4}
                value={settings.ipWhitelist}
                onChange={(e) => handleInputChange('ipWhitelist', e.target.value)}
                placeholder="허용할 IP 주소를 한 줄에 하나씩 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  기본 처리 시간 (일)
                </label>
                <Input
                  type="number"
                  value={settings.defaultProcessingTime}
                  onChange={(e) => handleInputChange('defaultProcessingTime', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  긴급 처리 시간 (일)
                </label>
                <Input
                  type="number"
                  value={settings.urgentProcessingTime}
                  onChange={(e) => handleInputChange('urgentProcessingTime', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">자동 상태 업데이트</p>
                  <p className="text-sm text-gray-600">진행 상황에 따라 자동으로 상태 변경</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoStatusUpdate}
                  onChange={(e) => handleInputChange('autoStatusUpdate', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">자동 이메일 발송</p>
                  <p className="text-sm text-gray-600">상태 변경 시 고객에게 자동 알림</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoEmailSend}
                  onChange={(e) => handleInputChange('autoEmailSend', e.target.checked)}
                  className="w-4 h-4 text-blue-600"
                />
              </div>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API 요청 제한 (시간당)
                </label>
                <Input
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API 타임아웃 (초)
                </label>
                <Input
                  type="number"
                  value={settings.apiTimeout}
                  onChange={(e) => handleInputChange('apiTimeout', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                웹훅 URL
              </label>
              <Input
                type="url"
                value={settings.webhookUrl}
                onChange={(e) => handleInputChange('webhookUrl', e.target.value)}
                placeholder="https://your-server.com/webhook"
              />
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">외관 설정</h3>
              <p className="text-gray-600">테마, 색상, 레이아웃 등 UI 커스터마이징 옵션</p>
              <Button className="mt-4" variant="outline">
                곧 출시 예정
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            시스템 설정
          </h1>
          <p className="text-gray-600 mt-2">
            시스템 동작을 관리하고 환경을 구성합니다.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          설정 저장
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                {tabs.find(tab => tab.id === activeTab)?.icon && 
                  React.createElement(tabs.find(tab => tab.id === activeTab).icon, { className: "h-5 w-5 mr-2" })
                }
                {tabs.find(tab => tab.id === activeTab)?.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {renderTabContent()}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Monitor className="h-5 w-5 mr-2" />
            시스템 상태
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium text-green-800">데이터베이스</p>
                <p className="text-sm text-green-600">정상 동작</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-medium text-green-800">API 서버</p>
                <p className="text-sm text-green-600">정상 동작</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-800">이메일 서비스</p>
                <p className="text-sm text-yellow-600">점검 중</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
