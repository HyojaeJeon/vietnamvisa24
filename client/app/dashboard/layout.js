'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ADMIN_ME_QUERY } from '../../lib/graphql';
import { 
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  BarChart3,
  CreditCard,
  CheckSquare,
  Eye,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  FolderOpen,
  ChevronDown,
  Home,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const { data, loading, error } = useQuery(GET_ADMIN_ME_QUERY, {
    errorPolicy: 'all'
  });

  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/dashboard/login');
      return;
    }

    if (error && error.message.includes('Authentication')) {
      localStorage.removeItem('adminToken');
      router.push('/dashboard/login');
    }
  }, [router, error]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/dashboard/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      name: '대시보드',
      href: '/dashboard',
      icon: LayoutDashboard,
      active: pathname === '/dashboard',
      color: 'text-blue-600'
    },
    {
      name: '비자 신청 관리',
      href: '/dashboard/applications',
      icon: FileText,
      active: pathname.startsWith('/dashboard/applications'),
      color: 'text-green-600'
    },
    {
      name: '고객 상담',
      href: '/dashboard/consultations',
      icon: MessageSquare,
      active: pathname.startsWith('/dashboard/consultations'),
      color: 'text-purple-600'
    },
    {
      name: '서류 관리',
      href: '/dashboard/documents',
      icon: FolderOpen,
      active: pathname.startsWith('/dashboard/documents'),
      color: 'text-orange-600'
    },
    {
      name: '알림 관리',
      href: '/dashboard/notifications',
      icon: Bell,
      active: pathname.startsWith('/dashboard/notifications'),
      color: 'text-yellow-600'
    },
    {
      name: '유저 관리',
      href: '/dashboard/users',
      icon: Users,
      active: pathname.startsWith('/dashboard/users'),
      color: 'text-indigo-600'
    },
    {
      name: '통계 및 리포트',
      href: '/dashboard/reports',
      icon: BarChart3,
      active: pathname.startsWith('/dashboard/reports'),
      color: 'text-red-600'
    },
    {
      name: '결제 관리',
      href: '/dashboard/payments',
      icon: CreditCard,
      active: pathname.startsWith('/dashboard/payments'),
      color: 'text-teal-600'
    },
    {
      name: '워크플로우',
      href: '/dashboard/workflows',
      icon: CheckSquare,
      active: pathname.startsWith('/dashboard/workflows'),
      color: 'text-lime-600'
    },
    {
      name: '고객 화면',
      href: '/dashboard/customer-preview',
      icon: Eye,
      active: pathname.startsWith('/dashboard/customer-preview'),
      color: 'text-pink-600'
    },
    {
      name: '시스템 설정',
      href: '/dashboard/settings',
      icon: Settings,
      active: pathname.startsWith('/dashboard/settings'),
      color: 'text-gray-600'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">시스템을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (pathname === '/dashboard/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 
        ${sidebarOpen ? 'w-72' : 'w-0 lg:w-16'} 
        bg-white shadow-2xl 
        transform transition-all duration-300 ease-in-out 
        ${isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        border-r border-gray-200 overflow-hidden
      `}>
        {/* Sidebar header */}
        <div className={`relative flex items-center justify-between h-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 ${!sidebarOpen && !isMobile ? 'px-2' : ''}`}>
          {sidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="h-7 w-7 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">VietnamVisa</h2>
                <p className="text-blue-100 text-sm font-medium">관리자 시스템</p>
              </div>
            </div>
          )}

          {!sidebarOpen && !isMobile && (
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Shield className="h-7 w-7 text-blue-600" />
            </div>
          )}

          {/* Desktop toggle button */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </button>
          )}

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Admin info */}
        {data?.adminMe && sidebarOpen && (
          <div className="px-6 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {data.adminMe.name.charAt(0)}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-gray-900">{data.adminMe.name}</p>
                <p className="text-sm text-gray-600 mb-2">{data.adminMe.email}</p>
                <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                  data.adminMe.role === 'SUPER_ADMIN' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  data.adminMe.role === 'MANAGER' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-green-100 text-green-800 border border-green-200'
                }`}>
                  {data.adminMe.role === 'SUPER_ADMIN' ? '최고관리자' :
                   data.adminMe.role === 'MANAGER' ? '매니저' : '스태프'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Collapsed admin info */}
        {data?.adminMe && !sidebarOpen && !isMobile && (
          <div className="px-2 py-4 border-b border-gray-200">
            <div className="flex justify-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">
                  {data.adminMe.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-2 overflow-y-auto ${sidebarOpen ? 'px-4' : 'px-2'}`}>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full group flex items-center text-sm font-medium rounded-xl transition-all duration-200 ${
                  sidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'
                } ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-50 hover:text-blue-700'
                }`}
                title={!sidebarOpen ? item.name : ''}
              >
                <IconComponent className={`h-5 w-5 transition-colors ${
                  sidebarOpen ? 'mr-3' : ''
                } ${
                  item.active ? 'text-white' : item.color + ' group-hover:text-blue-600'
                }`} />
                {sidebarOpen && (
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.active && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className={`border-t border-gray-200 bg-gray-50 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group ${
              sidebarOpen ? 'px-4 py-3' : 'px-3 py-3 justify-center'
            }`}
            title={!sidebarOpen ? '로그아웃' : ''}
          >
            <LogOut className={`h-5 w-5 text-gray-500 group-hover:text-red-600 transition-colors ${
              sidebarOpen ? 'mr-3' : ''
            }`} />
            {sidebarOpen && <span className="font-medium">로그아웃</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
        !isMobile && !sidebarOpen ? 'ml-0' : ''
      }`}>
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:flex items-center space-x-2">
              <Home className="h-4 w-4 text-gray-400" />
              <ChevronDown className="h-4 w-4 text-gray-400 rotate-[-90deg]" />
              <span className="text-sm font-medium text-gray-600">
                {menuItems.find(item => item.active)?.name || '대시보드'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>

            <div className="hidden sm:block text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
              {new Date().toLocaleDateString('ko-KR', { 
                month: 'short', 
                day: 'numeric',
                weekday: 'short'
              })}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}