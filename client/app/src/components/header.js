'use client';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../store/languageSlice';
import { logout } from '../store/authSlice';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { currentLanguage } = useSelector((state) => state.language);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLanguageChange = (value) => {
    dispatch(setLanguage(value));
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <header className="bg-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-blue-600">
            Vietnam Visa
          </a>

          <div className="hidden md:flex items-center space-x-5">
            <Select value={currentLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
                <SelectItem value="vi">Vietnamese</SelectItem>
              </SelectContent>
            </Select>

            {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <User size={18} />
                    <span>{user?.name || '사용자'}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          router.push('/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <User size={16} />
                        <span>내 정보</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut size={16} />
                        <span>로그아웃</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3">
                  <button 
                    onClick={() => router.push('/login')}
                    className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    로그인
                  </button>
                  <button 
                    onClick={() => router.push('/register')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    회원가입
                  </button>
                </div>
              )}

              <button 
                onClick={() => router.push('/dashboard/login')}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                관리자
              </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-col space-y-3">
              <Select value={currentLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ko">Korean</SelectItem>
                  <SelectItem value="vi">Vietnamese</SelectItem>
                </SelectContent>
              </Select>

              {isAuthenticated ? (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">로그인됨</p>
                  <p className="font-semibold text-blue-800">{user?.name}</p>
                </div>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/profile');
                  }}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <User size={18} />
                  <span>내 정보</span>
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/login');
                  }}
                  className="w-full text-left px-4 py-3 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                >
                  로그인
                </button>
                <button 
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/register');
                  }}
                  className="w-full text-left px-4 py-3 bg-blue-600 text-white font-semibold hover:bg-blue-700 rounded-lg transition-colors"
                >
                  회원가입
                </button>
              </div>
            )}

            <button 
              onClick={() => {
                setIsMenuOpen(false);
                router.push('/dashboard/login');
              }}
              className="w-full text-left px-4 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-lg transition-colors"
            >
              관리자 로그인
            </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}