"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGIN_MUTATION } from "../src/lib/graphql";
import { loginSuccess } from "../src/store/authSlice";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Eye, EyeOff, User, Check } from "lucide-react";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [login, { loading }] = useMutation(USER_LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log("Login response:", data);
      // Redux에 사용자 정보 저장
      dispatch(
        loginSuccess({
          user: data.userLogin.user,
          token: data.userLogin.token,
          refreshToken: data.userLogin.refreshToken,
          rememberMe: rememberMe,
          autoLogin: autoLogin,
        })
      );

      // 자동 로그인이 체크된 경우 로컬스토리지에 자동 로그인 정보 저장
      if (autoLogin) {
        localStorage.setItem("autoLoginEmail", email);
        localStorage.setItem("autoLoginPassword", password);
        localStorage.setItem("autoLoginEnabled", "true");
      } else {
        localStorage.removeItem("autoLoginEmail");
        localStorage.removeItem("autoLoginPassword");
        localStorage.removeItem("autoLoginEnabled");
      }

      router.push("/");
    },
    onError: (error) => {
      console.error("Login error:", error);
      setError(error.message);
    },
  });

  useEffect(() => {
    // 이미 로그인된 경우 홈으로 리디렉션
    if (isAuthenticated) {
      router.push("/");
      return;
    }

    // 자동 로그인 확인
    const autoLoginEnabled = localStorage.getItem("autoLoginEnabled");
    const savedEmail = localStorage.getItem("autoLoginEmail");
    const savedPassword = localStorage.getItem("autoLoginPassword");

    if (autoLoginEnabled === "true" && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setAutoLogin(true);
      setRememberMe(true);

      // 자동 로그인 실행
      login({
        variables: {
          input: {
            email: savedEmail,
            password: savedPassword,
            rememberMe: true,
            autoLogin: true,
          },
        },
      });
    }
  }, [isAuthenticated, router, login]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await login({
        variables: {
          input: {
            email,
            password,
            rememberMe,
            autoLogin,
          },
        },
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  if (isAuthenticated) {
    return null; // 로그인된 상태면 아무것도 렌더링하지 않음
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">로그인</CardTitle>
          <p className="text-gray-600 mt-2">계정에 로그인하세요</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

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
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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

            <Button type="submit" disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
              <button onClick={() => router.push("/register")} className="text-blue-600 hover:text-blue-700 font-medium">
                회원가입
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
