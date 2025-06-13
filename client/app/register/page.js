"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { USER_REGISTER_MUTATION } from "../src/lib/graphql/mutation/auth";
import { loginSuccess } from "../src/store/authSlice";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Eye, EyeOff, UserPlus } from "lucide-react";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [register, { loading }] = useMutation(USER_REGISTER_MUTATION, {
    onCompleted: (data) => {
      dispatch(
        loginSuccess({
          user: data.userRegister.user,
          token: data.userRegister.token,
          rememberMe: false,
        })
      );
      router.push("/");
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (formData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      await register({
        variables: {
          input: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          },
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 to-emerald-100">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="pb-2 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">회원가입</CardTitle>
          <p className="mt-2 text-gray-600">새 계정을 만드세요</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && <div className="px-4 py-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이름</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="이름을 입력하세요"
                className="h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">이메일</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="이메일을 입력하세요"
                className="h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">전화번호</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="전화번호를 입력하세요"
                className="h-12 border-2 border-gray-200 focus:border-green-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="h-12 pr-12 border-2 border-gray-200 focus:border-green-500"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">비밀번호 확인</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="h-12 pr-12 border-2 border-gray-200 focus:border-green-500"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                  <span>가입 중...</span>
                </div>
              ) : (
                "회원가입"
              )}
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <button onClick={() => router.push("/login")} className="font-semibold text-green-600 hover:text-green-700">
                로그인
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
