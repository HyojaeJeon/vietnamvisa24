"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_USERS_QUERY, CREATE_USER_MUTATION, UPDATE_USER_ROLE_MUTATION, DEACTIVATE_USER_MUTATION } from "@/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Shield, Edit, Trash2, CheckCircle, XCircle, Crown, Briefcase, User } from "lucide-react";

export default function UserManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    name: "",
    role: "STAFF",
  });

  const { data, loading, refetch } = useQuery(GET_ALL_USERS_QUERY);

  const [createUser, { loading: creating }] = useMutation(CREATE_USER_MUTATION, {
    onCompleted: () => {
      setShowCreateForm(false);
      setNewUser({ email: "", password: "", name: "", role: "STAFF" });
      refetch();
    },
  });

  const [updateUserRole] = useMutation(UPDATE_USER_ROLE_MUTATION, {
    onCompleted: () => refetch(),
  });

  const [deactivateUser] = useMutation(DEACTIVATE_USER_MUTATION, {
    onCompleted: () => refetch(),
  });

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUser({
        variables: { input: newUser },
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole({
        variables: { id: userId, role: newRole },
      });
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleDeactivate = async (userId) => {
    if (window.confirm("정말로 이 사용자를 비활성화하시겠습니까?")) {
      try {
        await deactivateUser({
          variables: { id: userId },
        });
      } catch (error) {
        console.error("Error deactivating user:", error);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case "MANAGER":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "STAFF":
        return <User className="w-4 h-4 text-green-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "최고관리자";
      case "MANAGER":
        return "매니저";
      case "STAFF":
        return "스태프";
      default:
        return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "MANAGER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "STAFF":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center text-3xl font-bold text-gray-900">
            <Users className="w-8 h-8 mr-3" />
            유저 관리
          </h1>
          <p className="mt-2 text-gray-600">유저 계정을 생성하고 권한을 관리합니다.</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />새 유저 추가
        </Button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 유저 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">이름</label>
                  <Input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="유저 이름" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">이메일</label>
                  <Input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="user@example.com" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">비밀번호</label>
                  <Input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder="8자리 이상" required />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">권한</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="STAFF">스태프</option>
                    <option value="MANAGER">매니저</option>
                    <option value="SUPER_ADMIN">최고관리자</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button type="submit" disabled={creating}>
                  {creating ? "생성 중..." : "유저 생성"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* User List */}
      <Card>
        <CardHeader>
          <CardTitle>유저 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.getAllUsers?.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-xs text-gray-500">가입일: {new Date(user.created_at).toLocaleDateString("ko-KR")}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Role Badge */}
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getRoleColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span>{getRoleName(user.role)}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-1">
                    {user.is_active ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />}
                    <span className={`text-sm ${user.is_active ? "text-green-600" : "text-red-600"}`}>{user.is_active ? "활성" : "비활성"}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={user.role === "SUPER_ADMIN"}
                    >
                      <option value="STAFF">스태프</option>
                      <option value="MANAGER">매니저</option>
                      <option value="SUPER_ADMIN">최고관리자</option>
                    </select>

                    {user.is_active && user.role !== "SUPER_ADMIN" && (
                      <Button variant="outline" size="sm" onClick={() => handleDeactivate(user.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!data?.getAllUsers || data.getAllUsers.length === 0) && (
            <div className="py-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">등록된 유저가 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>권한 설명</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2 space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold">최고관리자</h4>
              </div>
              <p className="text-sm text-gray-600">모든 기능에 대한 완전한 접근 권한. 시스템 설정 및 다른 유저 계정 관리 가능.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2 space-x-2">
                <Briefcase className="w-5 h-5 text-blue-500" />
                <h4 className="font-semibold">매니저</h4>
              </div>
              <p className="text-sm text-gray-600">비자 신청 관리, 고객 상담, 보고서 조회 등 대부분의 업무 기능 사용 가능.</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center mb-2 space-x-2">
                <User className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold">스태프</h4>
              </div>
              <p className="text-sm text-gray-600">기본적인 비자 신청 처리 및 고객 상담 업무. 제한된 권한으로 운영.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
