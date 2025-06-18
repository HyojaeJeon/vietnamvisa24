"use client";

import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { USER_LOGIN_QUERY } from "../../src/lib/graphql";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../src/store/authSlice";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Check, Eye, EyeOff, User } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const [login, { loading }] = useLazyQuery(USER_LOGIN_QUERY, {
    context: { credentials: "include" },
    onCompleted: ({ userLogin }) => {
      if (!userLogin?.accessToken) {
        setError("로그인 실패: 서버 응답이 올바르지 않습니다.");
        return;
      }
      dispatch(loginSuccess({ user: userLogin.user, accessToken: userLogin.accessToken }));
      router.replace("/");
    },
    onError: ({ message }) => {
      setError(message);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    login({ variables: { input: { email, password } } });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-full">
            <User className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">로그인</CardTitle>
          <p className="mt-2 text-gray-600">계정에 로그인하세요</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이메일</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요" className="h-12 border-2 border-gray-200 focus:border-blue-500" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="h-12 pr-12 border-2 border-gray-200 focus:border-blue-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${rememberMe ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-400"}`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </button>
                <label onClick={() => setRememberMe(!rememberMe)} className="text-sm text-gray-600 cursor-pointer">
                  로그인 상태 유지
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setAutoLogin(!autoLogin)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${autoLogin ? "bg-green-600 border-green-600" : "border-gray-300 hover:border-green-400"}`}
                >
                  {autoLogin && <Check className="w-3 h-3 text-white" />}
                </button>
                <label onClick={() => setAutoLogin(!autoLogin)} className="text-sm text-gray-600 cursor-pointer">
                  자동 로그인 (다음에 자동으로 로그인)
                </label>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-12 font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span>로그인 중...</span>
                </div>
              ) : (
                "로그인"
              )}
            </Button>
          </form>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <button onClick={() => router.push("/register")} className="font-medium text-blue-600 hover:text-blue-700">
                회원가입
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
