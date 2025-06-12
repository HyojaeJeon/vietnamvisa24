"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ServiceModal({ isOpen, onClose, onSubmit, modalType, serviceType, selectedService, onServiceTypeChange }) {
  const [formData, setFormData] = useState({
    // E-VISA 필드
    type: "SINGLE",
    processingTime: "NORMAL",

    // Visa Run 필드
    visaType: "NO_VISA",
    peopleCount: 1,

    // Fast Track 필드
    serviceType: "ARRIVAL",
    airport: "SGN",

    // 공통 가격 필드
    sellingPriceUsd: 0,
    sellingPriceVnd: 0,
    sellingPriceKrw: 0,
    marginUsd: 0,
    marginVnd: 0,
    marginKrw: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  // 선택된 서비스 데이터로 폼 초기화
  useEffect(() => {
    if (modalType === "edit" && selectedService) {
      setFormData({
        type: selectedService.type || "SINGLE",
        processingTime: selectedService.processingTime || "NORMAL",
        visaType: selectedService.visaType || "NO_VISA",
        peopleCount: selectedService.peopleCount || 1,
        serviceType: selectedService.serviceType || "ARRIVAL",
        airport: selectedService.airport || "SGN",
        sellingPriceUsd: selectedService.sellingPriceUsd || 0,
        sellingPriceVnd: selectedService.sellingPriceVnd || 0,
        sellingPriceKrw: selectedService.sellingPriceKrw || 0,
        marginUsd: selectedService.marginUsd || 0,
        marginVnd: selectedService.marginVnd || 0,
        marginKrw: selectedService.marginKrw || 0,
        isActive: selectedService.isActive ?? true,
      });
    } else {
      // 생성 모드일 때 기본값으로 리셋
      setFormData({
        type: "SINGLE",
        processingTime: "NORMAL",
        visaType: "NO_VISA",
        peopleCount: 1,
        serviceType: "ARRIVAL",
        airport: "SGN",
        sellingPriceUsd: 0,
        sellingPriceVnd: 0,
        sellingPriceKrw: 0,
        marginUsd: 0,
        marginVnd: 0,
        marginKrw: 0,
        isActive: true,
      });
    }
  }, [modalType, selectedService]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 서비스 타입에 따라 필요한 필드만 전송
      let submitData = {
        sellingPriceUsd: parseFloat(formData.sellingPriceUsd),
        sellingPriceVnd: parseFloat(formData.sellingPriceVnd),
        sellingPriceKrw: parseFloat(formData.sellingPriceKrw),
        marginUsd: parseFloat(formData.marginUsd),
        marginVnd: parseFloat(formData.marginVnd),
        marginKrw: parseFloat(formData.marginKrw),
        isActive: formData.isActive,
      };

      if (serviceType === "evisa") {
        submitData = {
          ...submitData,
          type: formData.type,
          processingTime: formData.processingTime,
        };
      } else if (serviceType === "visarun") {
        submitData = {
          ...submitData,
          visaType: formData.visaType,
          peopleCount: parseInt(formData.peopleCount),
        };
      } else if (serviceType === "fasttrack") {
        submitData = {
          ...submitData,
          serviceType: formData.serviceType,
          airport: formData.airport,
        };
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error("폼 제출 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{modalType === "create" ? "새 서비스 추가" : "서비스 수정"}</h3>
                  <p className="mt-1 text-sm text-gray-500">서비스 가격 정보를 입력하세요.</p>
                </div>
                <button type="button" onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {/* 서비스 타입 선택 (생성 모드에서만) */}
                {modalType === "create" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">서비스 유형</label>
                    <select
                      value={serviceType}
                      onChange={(e) => onServiceTypeChange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="evisa">E-VISA</option>
                      <option value="visarun">목바이 비자런</option>
                      <option value="fasttrack">패스트트랙</option>
                    </select>
                  </div>
                )}

                {/* E-VISA 전용 필드 */}
                {serviceType === "evisa" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">비자 타입</label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange("type", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SINGLE">단수</option>
                        <option value="MULTIPLE">복수</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">처리 기간</label>
                      <select
                        value={formData.processingTime}
                        onChange={(e) => handleInputChange("processingTime", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="NORMAL">일반 (3일)</option>
                        <option value="URGENT">긴급 (1일)</option>
                        <option value="SUPER_URGENT">특급 (4시간)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Visa Run 전용 필드 */}
                {serviceType === "visarun" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">비자 타입</label>
                      <select
                        value={formData.visaType}
                        onChange={(e) => handleInputChange("visaType", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="NO_VISA">무비자</option>
                        <option value="NINETY_DAY_SINGLE">90일 단수</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">인원 수</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.peopleCount}
                        onChange={(e) => handleInputChange("peopleCount", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                {/* Fast Track 전용 필드 */}
                {serviceType === "fasttrack" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">서비스 타입</label>
                      <select
                        value={formData.serviceType}
                        onChange={(e) => handleInputChange("serviceType", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="ARRIVAL">입국 지원</option>
                        <option value="PREMIUM_ARRIVAL">프리미엄 입국</option>
                        <option value="DEPARTURE">출국 지원</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">공항</label>
                      <select
                        value={formData.airport}
                        onChange={(e) => handleInputChange("airport", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="SGN">호치민 (SGN)</option>
                        <option value="HAN">하노이 (HAN)</option>
                        <option value="DAD">다낭 (DAD)</option>
                        <option value="CAN">칸토 (CAN)</option>
                        <option value="HPH">하이퐁 (HPH)</option>
                        <option value="VCA">칸토국제공항 (VCA)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 가격 필드들 */}
                <div className="grid grid-cols-1 gap-4">
                  <h4 className="text-md font-medium text-gray-900 border-t pt-4">판매가</h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">USD</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.sellingPriceUsd}
                        onChange={(e) => handleInputChange("sellingPriceUsd", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">VND</label>
                      <input
                        type="number"
                        step="1000"
                        value={formData.sellingPriceVnd}
                        onChange={(e) => handleInputChange("sellingPriceVnd", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">KRW</label>
                      <input
                        type="number"
                        step="1000"
                        value={formData.sellingPriceKrw}
                        onChange={(e) => handleInputChange("sellingPriceKrw", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <h4 className="text-md font-medium text-gray-900 border-t pt-4">마진</h4>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">USD</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.marginUsd}
                        onChange={(e) => handleInputChange("marginUsd", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">VND</label>
                      <input
                        type="number"
                        step="1000"
                        value={formData.marginVnd}
                        onChange={(e) => handleInputChange("marginVnd", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">KRW</label>
                      <input
                        type="number"
                        step="1000"
                        value={formData.marginKrw}
                        onChange={(e) => handleInputChange("marginKrw", e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 활성 상태 */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange("isActive", e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    활성 상태
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? "저장 중..." : modalType === "create" ? "생성" : "수정"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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
