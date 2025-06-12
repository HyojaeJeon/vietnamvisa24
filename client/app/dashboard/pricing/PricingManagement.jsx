"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ClockIcon,
  UserGroupIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { GET_ALL_PRICING_DATA } from '../../../lib/graphql/pricing/queries';
import { 
  DELETE_E_VISA_PRICE,
  DELETE_VISA_RUN_PRICE,
  DELETE_FAST_TRACK_PRICE
} from '../../../lib/graphql/pricing/mutations';
import PricingModal from './PricingModal';
import { formatCurrency } from '../../../lib/utils';

export default function PricingManagement() {
  const [activeTab, setActiveTab] = useState('evisa');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' | 'edit'
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedPriceType, setPriceType] = useState('evisa'); // 'evisa' | 'visarun' | 'fasttrack'

  // GraphQL 쿼리
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRICING_DATA, {
    errorPolicy: 'all'
  });

  // GraphQL 뮤테이션
  const [deleteEVisaPrice] = useMutation(DELETE_E_VISA_PRICE, {
    onCompleted: () => {
      refetch();
    }
  });

  const [deleteVisaRunPrice] = useMutation(DELETE_VISA_RUN_PRICE, {
    onCompleted: () => {
      refetch();
    }
  });

  const [deleteFastTrackPrice] = useMutation(DELETE_FAST_TRACK_PRICE, {
    onCompleted: () => {
      refetch();
    }
  });

  const tabs = [
    { id: 'evisa', name: 'E-VISA', icon: GlobeAltIcon },
    { id: 'visarun', name: 'Visa Run (Mokbai)', icon: UserGroupIcon },
    { id: 'fasttrack', name: 'Fast Track', icon: BuildingOfficeIcon }
  ];

  const handleCreate = (type) => {
    setPriceType(type);
    setModalType('create');
    setSelectedPrice(null);
    setModalOpen(true);
  };

  const handleEdit = (price, type) => {
    setPriceType(type);
    setModalType('edit');
    setSelectedPrice(price);
    setModalOpen(true);
  };

  const handleDelete = async (priceId, type) => {
    if (!confirm('정말로 이 가격표를 삭제하시겠습니까?')) return;
    
    try {
      if (type === 'evisa') {
        await deleteEVisaPrice({ variables: { id: priceId } });
      } else if (type === 'visarun') {
        await deleteVisaRunPrice({ variables: { id: priceId } });
      } else if (type === 'fasttrack') {
        await deleteFastTrackPrice({ variables: { id: priceId } });
      }
    } catch (error) {
      console.error('삭제 오류:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">가격표 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              데이터 로딩 오류
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderEVisaPriceTable = () => {
    const eVisaPrices = data?.getAllPrices?.eVisaPrices || [];
    
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              E-VISA 가격표
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              단일/복수 비자와 처리 속도별 가격 관리
            </p>
          </div>
          <button
            onClick={() => handleCreate('evisa')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            새 가격 추가
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  타입/처리시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USD 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VND 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KRW 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eVisaPrices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {price.type === 'SINGLE' ? '단일 비자' : '복수 비자'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {price.processingTime === 'NORMAL' ? '일반' :
                           price.processingTime === 'URGENT' ? '긴급' : '초긴급'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ${price.sellingPriceUsd}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ${price.marginUsd}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ₫{price.sellingPriceVnd?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ₫{price.marginVnd?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ₩{price.sellingPriceKrw?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ₩{price.marginKrw?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      price.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {price.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(price, 'evisa')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(price.id, 'evisa')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderVisaRunPriceTable = () => {
    const visaRunPrices = data?.getAllPrices?.visaRunPrices || [];
    
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Visa Run (Mokbai) 가격표
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              비자 타입과 인원수별 가격 관리
            </p>
          </div>
          <button
            onClick={() => handleCreate('visarun')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            새 가격 추가
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  비자 타입/인원수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USD 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VND 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KRW 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visaRunPrices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {price.visaType === 'TOURIST' ? '관광 비자' : '비즈니스 비자'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {price.peopleCount}명
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ${price.sellingPriceUsd}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ${price.marginUsd}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ₫{price.sellingPriceVnd?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ₫{price.marginVnd?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ₩{price.sellingPriceKrw?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ₩{price.marginKrw?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      price.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {price.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(price, 'visarun')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(price.id, 'visarun')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderFastTrackPriceTable = () => {
    const fastTrackPrices = data?.getAllPrices?.fastTrackPrices || [];
    
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Fast Track 가격표
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              공항별 Fast Track 서비스 가격 관리
            </p>
          </div>
          <button
            onClick={() => handleCreate('fasttrack')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            새 가격 추가
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  서비스/공항
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  USD 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  VND 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  KRW 가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {fastTrackPrices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {price.serviceType === 'ARRIVAL' ? '도착' : 
                           price.serviceType === 'DEPARTURE' ? '출발' : '도착+출발'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {price.airport}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ${price.sellingPriceUsd}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ${price.marginUsd}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ₫{price.sellingPriceVnd?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ₫{price.marginVnd?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      판매: ₩{price.sellingPriceKrw?.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      마진: ₩{price.marginKrw?.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      price.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {price.isActive ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(price, 'fasttrack')}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(price.id, 'fasttrack')}
                        className="text-red-600 hover:text-red-900"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-b border-gray-200 mb-6">
          <div className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === 'evisa' && renderEVisaPriceTable()}
        {activeTab === 'visarun' && renderVisaRunPriceTable()}
        {activeTab === 'fasttrack' && renderFastTrackPriceTable()}

        {modalOpen && (
          <PricingModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            type={modalType}
            priceType={selectedPriceType}
            price={selectedPrice}
            onRefetch={refetch}
          />
        )}
      </div>
    </div>
  );
}
