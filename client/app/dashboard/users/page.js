'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_ALL_ADMINS_QUERY, 
  CREATE_ADMIN_MUTATION,
  UPDATE_ADMIN_ROLE_MUTATION,
  DEACTIVATE_ADMIN_MUTATION 
} from '../../src/lib/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card';
import { Button } from '../../src/components/ui/button';
import { Input } from '../../src/components/ui/input';
import { 
  Users, 
  Plus, 
  Shield, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Crown,
  Briefcase,
  User
} from 'lucide-react';

export default function UserManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    password: '',
    name: '',
    role: 'STAFF'
  });

  const { data, loading, refetch } = useQuery(GET_ALL_ADMINS_QUERY);

  const [createAdmin, { loading: creating }] = useMutation(CREATE_ADMIN_MUTATION, {
    onCompleted: () => {
      setShowCreateForm(false);
      setNewAdmin({ email: '', password: '', name: '', role: 'STAFF' });
      refetch();
    }
  });

  const [updateAdminRole] = useMutation(UPDATE_ADMIN_ROLE_MUTATION, {
    onCompleted: () => refetch()
  });

  const [deactivateAdmin] = useMutation(DEACTIVATE_ADMIN_MUTATION, {
    onCompleted: () => refetch()
  });

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await createAdmin({
        variables: { input: newAdmin }
      });
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  const handleRoleChange = async (adminId, newRole) => {
    try {
      await updateAdminRole({
        variables: { id: adminId, role: newRole }
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleDeactivate = async (adminId) => {
    if (window.confirm('정말로 이 관리자를 비활성화하시겠습니까?')) {
      try {
        await deactivateAdmin({
          variables: { id: adminId }
        });
      } catch (error) {
        console.error('Error deactivating admin:', error);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'MANAGER': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'STAFF': return <User className="h-4 w-4 text-green-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return '최고관리자';
      case 'MANAGER': return '매니저';
      case 'STAFF': return '스태프';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'MANAGER': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'STAFF': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3" />
            유저 관리
          </h1>
          <p className="text-gray-600 mt-2">
            관리자 계정을 생성하고 권한을 관리합니다.
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          새 관리자 추가
        </Button>
      </div>

      {/* Create Admin Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 관리자 추가</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이름
                  </label>
                  <Input
                    type="text"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    placeholder="관리자 이름"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이메일
                  </label>
                  <Input
                    type="email"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    placeholder="admin@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    비밀번호
                  </label>
                  <Input
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    placeholder="8자리 이상"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    권한
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
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
                  {creating ? '생성 중...' : '관리자 생성'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admin List */}
      <Card>
        <CardHeader>
          <CardTitle>관리자 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.getAllAdmins?.map((admin) => (
              <div 
                key={admin.id} 
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{admin.name}</h3>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-xs text-gray-500">
                      가입일: {new Date(admin.created_at).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Role Badge */}
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium flex items-center space-x-1 ${getRoleColor(admin.role)}`}>
                    {getRoleIcon(admin.role)}
                    <span>{getRoleName(admin.role)}</span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-1">
                    {admin.is_active ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className={`text-sm ${admin.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {admin.is_active ? '활성' : '비활성'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <select
                      value={admin.role}
                      onChange={(e) => handleRoleChange(admin.id, e.target.value)}
                      className="text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={admin.role === 'SUPER_ADMIN'}
                    >
                      <option value="STAFF">스태프</option>
                      <option value="MANAGER">매니저</option>
                      <option value="SUPER_ADMIN">최고관리자</option>
                    </select>

                    {admin.is_active && admin.role !== 'SUPER_ADMIN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeactivate(admin.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(!data?.getAllAdmins || data.getAllAdmins.length === 0) && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">등록된 관리자가 없습니다.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                <h4 className="font-semibold">최고관리자</h4>
              </div>
              <p className="text-sm text-gray-600">
                모든 기능에 대한 완전한 접근 권한. 시스템 설정 및 다른 관리자 계정 관리 가능.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold">매니저</h4>
              </div>
              <p className="text-sm text-gray-600">
                비자 신청 관리, 고객 상담, 보고서 조회 등 대부분의 업무 기능 사용 가능.
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <User className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold">스태프</h4>
              </div>
              <p className="text-sm text-gray-600">
                기본적인 비자 신청 처리 및 고객 상담 업무. 제한된 권한으로 운영.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}