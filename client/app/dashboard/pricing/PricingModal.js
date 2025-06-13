"use client";

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { 
  CREATE_E_VISA_PRICE,
  UPDATE_E_VISA_PRICE,
  CREATE_VISA_RUN_PRICE,
  UPDATE_VISA_RUN_PRICE,
  CREATE_FAST_TRACK_PRICE,
  UPDATE_FAST_TRACK_PRICE
} from '../../../lib/graphql/pricing/mutations';

export default function PricingModal({ 
  isOpen, 
  onClose, 
  type, // 'create' | 'edit'
  priceType, // 'evisa' | 'visarun' | 'fasttrack'
  price, 
  onRefetch 
}) {
  const [formData, setFormData] = useState({
    // E-VISA fields
    type: '',
    processingTime: '',
    // Visa Run fields
    visaType: '',
    peopleCount: 1,
    // Fast Track fields
    serviceType: '',
    airport: '',
    // Common fields
    sellingPriceUSD: 0,
    marginUSD: 0,
    sellingPriceVND: 0,
    marginVND: 0,
    sellingPriceKRW: 0,
    marginKRW: 0,
    isActive: true
  });

  const [errors, setErrors] = useState({});

  // GraphQL 뮤테이션
  const [createEVisaPrice] = useMutation(CREATE_E_VISA_PRICE);
  const [updateEVisaPrice] = useMutation(UPDATE_E_VISA_PRICE);
  const [createVisaRunPrice] = useMutation(CREATE_VISA_RUN_PRICE);
  const [updateVisaRunPrice] = useMutation(UPDATE_VISA_RUN_PRICE);
  const [createFastTrackPrice] = useMutation(CREATE_FAST_TRACK_PRICE);
  const [updateFastTrackPrice] = useMutation(UPDATE_FAST_TRACK_PRICE);

  useEffect(() => {
    if (type === 'edit' && price) {
      setFormData({
        type: price.type || '',
        processingTime: price.processingTime || '',
        visaType: price.visaType || '',
        peopleCount: price.peopleCount || 1,
        serviceType: price.serviceType || '',
        airport: price.airport || '',        sellingPriceUsd: price.sellingPriceUsd || 0,
        marginUsd: price.marginUsd || 0,
        sellingPriceVnd: price.sellingPriceVnd || 0,
        marginVnd: price.marginVnd || 0,
        sellingPriceKrw: price.sellingPriceKrw || 0,
        marginKrw: price.marginKrw || 0,
        isActive: price.isActive !== undefined ? price.isActive : true
      });
    } else {
      // Reset form for create mode
      setFormData({
        type: '',
        processingTime: '',
        visaType: '',
        peopleCount: 1,
        serviceType: '',
        airport: '',
        sellingPriceUSD: 0,
        marginUSD: 0,
        sellingPriceVND: 0,
        marginVND: 0,
        sellingPriceKRW: 0,
        marginKRW: 0,
        isActive: true
      });
    }
    setErrors({});
  }, [type, price, isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: inputType === 'checkbox' ? checked : 
               inputType === 'number' ? parseFloat(value) || 0 : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // E-VISA validation
    if (priceType === 'evisa') {
      if (!formData.type) newErrors.type = '비자 타입을 선택해주세요';
      if (!formData.processingTime) newErrors.processingTime = '처리 시간을 선택해주세요';
    }

    // Visa Run validation
    if (priceType === 'visarun') {
      if (!formData.visaType) newErrors.visaType = '비자 타입을 선택해주세요';
      if (!formData.peopleCount || formData.peopleCount < 1) {
        newErrors.peopleCount = '인원수를 입력해주세요';
      }
    }

    // Fast Track validation
    if (priceType === 'fasttrack') {
      if (!formData.serviceType) newErrors.serviceType = '서비스 타입을 선택해주세요';
      if (!formData.airport) newErrors.airport = '공항을 선택해주세요';
    }

    // Common validations
    if (!formData.sellingPriceUSD || formData.sellingPriceUSD <= 0) {
      newErrors.sellingPriceUSD = 'USD 판매가를 입력해주세요';
    }
    if (!formData.sellingPriceVND || formData.sellingPriceVND <= 0) {
      newErrors.sellingPriceVND = 'VND 판매가를 입력해주세요';
    }
    if (!formData.sellingPriceKRW || formData.sellingPriceKRW <= 0) {
      newErrors.sellingPriceKRW = 'KRW 판매가를 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (priceType === 'evisa') {
        const input = {
          type: formData.type,
          processingTime: formData.processingTime,
          sellingPriceUSD: formData.sellingPriceUSD,
          marginUSD: formData.marginUSD,
          sellingPriceVND: formData.sellingPriceVND,
          marginVND: formData.marginVND,
          sellingPriceKRW: formData.sellingPriceKRW,
          marginKRW: formData.marginKRW,
          isActive: formData.isActive
        };

        if (type === 'create') {
          await createEVisaPrice({ variables: { input } });
        } else {
          await updateEVisaPrice({ variables: { id: price.id, input } });
        }
      } else if (priceType === 'visarun') {
        const input = {
          visaType: formData.visaType,
          peopleCount: formData.peopleCount,
          sellingPriceUSD: formData.sellingPriceUSD,
          marginUSD: formData.marginUSD,
          sellingPriceVND: formData.sellingPriceVND,
          marginVND: formData.marginVND,
          sellingPriceKRW: formData.sellingPriceKRW,
          marginKRW: formData.marginKRW,
          isActive: formData.isActive
        };

        if (type === 'create') {
          await createVisaRunPrice({ variables: { input } });
        } else {
          await updateVisaRunPrice({ variables: { id: price.id, input } });
        }
      } else if (priceType === 'fasttrack') {
        const input = {
          serviceType: formData.serviceType,
          airport: formData.airport,
          sellingPriceUSD: formData.sellingPriceUSD,
          marginUSD: formData.marginUSD,
          sellingPriceVND: formData.sellingPriceVND,
          marginVND: formData.marginVND,
          sellingPriceKRW: formData.sellingPriceKRW,
          marginKRW: formData.marginKRW,
          isActive: formData.isActive
        };

        if (type === 'create') {
          await createFastTrackPrice({ variables: { input } });
        } else {
          await updateFastTrackPrice({ variables: { id: price.id, input } });
        }
      }

      onRefetch();
      onClose();
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    const action = type === 'create' ? '추가' : '수정';
    const service = priceType === 'evisa' ? 'E-VISA' :
                   priceType === 'visarun' ? 'Visa Run' : 'Fast Track';
    return `${service} 가격표 ${action}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {getModalTitle()}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* E-VISA specific fields */}
                {priceType === 'evisa' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        비자 타입
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.type ? 'border-red-300' : ''
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        <option value="single">단일 비자</option>
                        <option value="multiple">복수 비자</option>
                      </select>
                      {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        처리 시간
                      </label>
                      <select
                        name="processingTime"
                        value={formData.processingTime}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.processingTime ? 'border-red-300' : ''
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        <option value="normal">일반 (3-5일)</option>
                        <option value="urgent">긴급 (1-2일)</option>
                        <option value="super_urgent">초긴급 (몇 시간)</option>
                      </select>
                      {errors.processingTime && <p className="mt-1 text-sm text-red-600">{errors.processingTime}</p>}
                    </div>
                  </>
                )}

                {/* Visa Run specific fields */}
                {priceType === 'visarun' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        비자 타입
                      </label>
                      <select
                        name="visaType"
                        value={formData.visaType}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.visaType ? 'border-red-300' : ''
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        <option value="tourist">관광 비자</option>
                        <option value="business">비즈니스 비자</option>
                      </select>
                      {errors.visaType && <p className="mt-1 text-sm text-red-600">{errors.visaType}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        인원수
                      </label>
                      <input
                        type="number"
                        name="peopleCount"
                        value={formData.peopleCount}
                        onChange={handleInputChange}
                        min="1"
                        max="10"
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.peopleCount ? 'border-red-300' : ''
                        }`}
                      />
                      {errors.peopleCount && <p className="mt-1 text-sm text-red-600">{errors.peopleCount}</p>}
                    </div>
                  </>
                )}

                {/* Fast Track specific fields */}
                {priceType === 'fasttrack' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        서비스 타입
                      </label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.serviceType ? 'border-red-300' : ''
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        <option value="arrival">도착</option>
                        <option value="departure">출발</option>
                      </select>
                      {errors.serviceType && <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        공항
                      </label>
                      <select
                        name="airport"
                        value={formData.airport}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                          errors.airport ? 'border-red-300' : ''
                        }`}
                      >
                        <option value="">선택해주세요</option>
                        <option value="SGN">호치민 (SGN)</option>
                        <option value="HAN">하노이 (HAN)</option>
                        <option value="DAD">다낭 (DAD)</option>
                      </select>
                      {errors.airport && <p className="mt-1 text-sm text-red-600">{errors.airport}</p>}
                    </div>
                  </>
                )}

                {/* Common price fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      USD 판매가
                    </label>
                    <input
                      type="number"
                      name="sellingPriceUSD"
                      value={formData.sellingPriceUSD}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.sellingPriceUSD ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.sellingPriceUSD && <p className="mt-1 text-sm text-red-600">{errors.sellingPriceUSD}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      USD 마진
                    </label>
                    <input
                      type="number"
                      name="marginUSD"
                      value={formData.marginUSD}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      VND 판매가
                    </label>
                    <input
                      type="number"
                      name="sellingPriceVND"
                      value={formData.sellingPriceVND}
                      onChange={handleInputChange}
                      step="1000"
                      min="0"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.sellingPriceVND ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.sellingPriceVND && <p className="mt-1 text-sm text-red-600">{errors.sellingPriceVND}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      VND 마진
                    </label>
                    <input
                      type="number"
                      name="marginVND"
                      value={formData.marginVND}
                      onChange={handleInputChange}
                      step="1000"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      KRW 판매가
                    </label>
                    <input
                      type="number"
                      name="sellingPriceKRW"
                      value={formData.sellingPriceKRW}
                      onChange={handleInputChange}
                      step="1000"
                      min="0"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        errors.sellingPriceKRW ? 'border-red-300' : ''
                      }`}
                    />
                    {errors.sellingPriceKRW && <p className="mt-1 text-sm text-red-600">{errors.sellingPriceKRW}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      KRW 마진
                    </label>
                    <input
                      type="number"
                      name="marginKRW"
                      value={formData.marginKRW}
                      onChange={handleInputChange}
                      step="1000"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    활성 상태
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {type === 'create' ? '추가' : '수정'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
