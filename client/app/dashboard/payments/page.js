'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { 
  GET_PAYMENTS, 
  UPDATE_PAYMENT, 
  GENERATE_INVOICE 
} from '@/lib/graphql';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Receipt,
  Mail
} from 'lucide-react';

export default function PaymentsManagement() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: paymentsData, loading, refetch } = useQuery(GET_PAYMENTS, {
    errorPolicy: 'all'
  });

  const [updatePayment] = useMutation(UPDATE_PAYMENT, {
    onCompleted: () => {
      toast.success('결제 정보가 업데이트되었습니다.');
      refetch();
    },
    onError: (error) => {
      toast.error('업데이트 중 오류가 발생했습니다.');
    }
  });

  const [generateInvoice] = useMutation(GENERATE_INVOICE, {
    onCompleted: () => {
      toast.success('청구서가 생성되었습니다.');
      refetch();
    },
    onError: (error) => {
      toast.error('청구서 생성 중 오류가 발생했습니다.');
    }
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: '결제 대기', color: 'bg-yellow-100 text-yellow-800' },
      partial: { label: '일부 입금', color: 'bg-blue-100 text-blue-800' },
      paid: { label: '완납', color: 'bg-green-100 text-green-800' },
      overdue: { label: '연체', color: 'bg-red-100 text-red-800' },
      cancelled: { label: '취소', color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'partial': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleStatusUpdate = async (paymentId, newStatus) => {
    try {
      await updatePayment({
        variables: {
          id: paymentId,
          input: {
            status: newStatus,
            paid_at: newStatus === 'paid' ? new Date().toISOString() : null
          }
        }
      });
    } catch (error) {
      console.error('Status update error:', error);
    }
  };

  const formatCurrency = (amount, currency = 'KRW') => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const filteredPayments = paymentsData?.getPayments?.filter(payment => {
    const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
    const matchesSearch = 
      payment.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.application?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  // 통계 계산
  const stats = {
    total: filteredPayments.length,
    pending: filteredPayments.filter(p => p.status === 'pending').length,
    paid: filteredPayments.filter(p => p.status === 'paid').length,
    overdue: filteredPayments.filter(p => p.status === 'overdue').length,
    totalAmount: filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0),
    paidAmount: filteredPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.paid_amount), 0)
  };

  if (loading) return <div className="p-6">로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">결제 관리</h1>
          <p className="text-gray-600 mt-2">청구서 발행 및 결제 상태를 관리합니다</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          수동 청구서 생성
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 청구서</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}건</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">결제 완료</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}건</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">결제 대기</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}건</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">수금율</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalAmount > 0 ? Math.round((stats.paidAmount / stats.totalAmount) * 100) : 0}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="청구서 번호 또는 고객명으로 검색..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">모든 상태</option>
                <option value="pending">결제 대기</option>
                <option value="partial">일부 입금</option>
                <option value="paid">완납</option>
                <option value="overdue">연체</option>
                <option value="cancelled">취소</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결제 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>결제 내역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">청구서 번호</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">고객</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">비자 종류</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">금액</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">상태</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">마감일</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payment.status)}
                        <span className="font-medium">{payment.invoice_number}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{payment.application?.full_name}</p>
                        <p className="text-sm text-gray-500">{payment.application?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {payment.application?.visa_type}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium">{formatCurrency(payment.amount)}</p>
                        {payment.paid_amount > 0 && (
                          <p className="text-sm text-green-600">
                            입금: {formatCurrency(payment.paid_amount)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(payment.status)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {payment.due_date ? new Date(payment.due_date).toLocaleDateString('ko-KR') : '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusUpdate(payment.id, 'paid')}
                          disabled={payment.status === 'paid'}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          완납처리
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="h-4 w-4 mr-1" />
                          알림발송
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}