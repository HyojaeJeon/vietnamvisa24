"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Plus, Edit, Eye, Search } from "lucide-react";
import { GET_ALL_PRICING_DATA } from "../../../lib/graphql/pricing/queries";
import { GET_ADMIN_ME_QUERY } from "../../src/lib/graphql";
import { CREATE_E_VISA_PRICE, UPDATE_E_VISA_PRICE, CREATE_VISA_RUN_PRICE, UPDATE_VISA_RUN_PRICE, CREATE_FAST_TRACK_PRICE, UPDATE_FAST_TRACK_PRICE } from "../../../lib/graphql/pricing/mutations";
import ServiceModal from "./ServiceModal";

export default function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("ALL");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState("evisa");

  // 관리자 정보 쿼리
  const { data: adminData } = useQuery(GET_ADMIN_ME_QUERY, {
    errorPolicy: "all",
  });

  // GraphQL 쿼리
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRICING_DATA, {
    errorPolicy: "all",
  });

  // GraphQL 뮤테이션
  const [createEVisaPrice] = useMutation(CREATE_E_VISA_PRICE, {
    onCompleted: () => refetch(),
  });
  const [updateEVisaPrice] = useMutation(UPDATE_E_VISA_PRICE, {
    onCompleted: () => refetch(),
  });
  const [createVisaRunPrice] = useMutation(CREATE_VISA_RUN_PRICE, {
    onCompleted: () => refetch(),
  });
  const [updateVisaRunPrice] = useMutation(UPDATE_VISA_RUN_PRICE, {
    onCompleted: () => refetch(),
  });
  const [createFastTrackPrice] = useMutation(CREATE_FAST_TRACK_PRICE, {
    onCompleted: () => refetch(),
  });
  const [updateFastTrackPrice] = useMutation(UPDATE_FAST_TRACK_PRICE, {
    onCompleted: () => refetch(),
  });
  // 권한 확인 - 관리자 데이터에서 role 확인
  const user = adminData?.getAdminMe;
  const canManage = user?.role === "SUPERADMIN" || user?.role === "MANAGER";

  // 모든 서비스 데이터를 통합하여 테이블용 배열로 변환
  const getUnifiedServiceData = () => {
    if (!data?.getAllPrices) return [];

    const unifiedData = [];

    // E-VISA 서비스 추가
    data.getAllPrices.eVisaPrices.forEach((price) => {
      unifiedData.push({
        ...price,
        serviceCategory: "E-VISA",
        serviceType: price.type === "SINGLE" ? "E-VISA 단수" : "E-VISA 복수",
        serviceDetails: `처리기간: ${getProcessingTimeLabel(price.processingTime)}`,
        originalType: "evisa",
      });
    });

    // Visa Run 서비스 추가
    data.getAllPrices.visaRunPrices.forEach((price) => {
      unifiedData.push({
        ...price,
        serviceCategory: "VISA_RUN",
        serviceType: "목바이 비자런",
        serviceDetails: `${getVisaTypeLabel(price.visaType)} - ${price.peopleCount}명`,
        originalType: "visarun",
      });
    });

    // Fast Track 서비스 추가
    data.getAllPrices.fastTrackPrices.forEach((price) => {
      unifiedData.push({
        ...price,
        serviceCategory: "FAST_TRACK",
        serviceType: "패스트트랙",
        serviceDetails: `${getFastTrackServiceLabel(price.serviceType)} - ${price.airport}`,
        originalType: "fasttrack",
      });
    });

    return unifiedData;
  };

  // 라벨 변환 함수들
  const getProcessingTimeLabel = (time) => {
    const labels = {
      NORMAL: "일반 (3일)",
      URGENT: "긴급 (1일)",
      SUPER_URGENT: "특급 (4시간)",
    };
    return labels[time] || time;
  };

  const getVisaTypeLabel = (type) => {
    const labels = {
      NO_VISA: "무비자",
      NINETY_DAY_SINGLE: "90일 단수",
    };
    return labels[type] || type;
  };

  const getFastTrackServiceLabel = (type) => {
    const labels = {
      ARRIVAL: "입국 지원",
      PREMIUM_ARRIVAL: "프리미엄 입국",
      DEPARTURE: "출국 지원",
    };
    return labels[type] || type;
  };

  // 필터링된 데이터
  const filteredData = getUnifiedServiceData().filter((service) => {
    const matchesSearch = service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) || service.serviceDetails.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterService === "ALL" || service.serviceCategory === filterService;

    return matchesSearch && matchesFilter;
  });

  // 핸들러 함수들
  const handleCreate = () => {
    setModalType("create");
    setSelectedService(null);
    setSelectedServiceType("evisa");
    setModalOpen(true);
  };

  const handleEdit = (service) => {
    setModalType("edit");
    setSelectedService(service);
    setSelectedServiceType(service.originalType);
    setModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (modalType === "create") {
        if (selectedServiceType === "evisa") {
          await createEVisaPrice({ variables: { input: formData } });
        } else if (selectedServiceType === "visarun") {
          await createVisaRunPrice({ variables: { input: formData } });
        } else if (selectedServiceType === "fasttrack") {
          await createFastTrackPrice({ variables: { input: formData } });
        }
      } else {
        if (selectedService.originalType === "evisa") {
          await updateEVisaPrice({
            variables: { id: selectedService.id, input: formData },
          });
        } else if (selectedService.originalType === "visarun") {
          await updateVisaRunPrice({
            variables: { id: selectedService.id, input: formData },
          });
        } else if (selectedService.originalType === "fasttrack") {
          await updateFastTrackPrice({
            variables: { id: selectedService.id, input: formData },
          });
        }
      }
      setModalOpen(false);
    } catch (error) {
      console.error("서비스 저장 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 통화 포맷터
  const formatCurrency = (amount, currency) => {
    const formatters = {
      USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
      VND: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }),
      KRW: new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }),
    };
    return formatters[currency]?.format(amount) || `${amount} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">서비스 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">데이터 로드 오류</h3>
            <p className="text-sm text-red-700 mt-2">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 검색 및 필터 바 */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="서비스명 또는 옵션으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
              />
            </div>

            {/* 서비스 유형 필터 */}
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ALL">모든 서비스</option>
              <option value="E-VISA">E-VISA</option>
              <option value="VISA_RUN">목바이 비자런</option>
              <option value="FAST_TRACK">패스트트랙</option>
            </select>
          </div>

          {/* 새 서비스 추가 버튼 */}
          {canManage && (
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />새 서비스 추가
            </button>
          )}
        </div>
      </div>

      {/* 서비스 테이블 */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">서비스 유형</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">세부 옵션</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">판매가</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마진 (USD)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마진 (VND)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">마진 (KRW)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((service) => (
                <tr key={`${service.originalType}-${service.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          service.serviceCategory === "E-VISA" ? "bg-blue-100 text-blue-800" : service.serviceCategory === "VISA_RUN" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {service.serviceType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.serviceDetails}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>{formatCurrency(service.sellingPriceUsd, "USD")}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(service.sellingPriceVnd, "VND")}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(service.sellingPriceKrw, "KRW")}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(service.marginUsd, "USD")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(service.marginVnd, "VND")}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(service.marginKrw, "KRW")}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${service.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {service.isActive ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(service)}
                        className={`text-indigo-600 hover:text-indigo-900 ${!canManage ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={!canManage}
                        title={canManage ? "수정" : "권한이 없습니다"}
                      >
                        {canManage ? <Edit className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">표시할 서비스가 없습니다.</p>
          </div>
        )}
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">전체 서비스</div>
          <div className="text-2xl font-bold text-gray-900">{filteredData.length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">E-VISA</div>
          <div className="text-2xl font-bold text-blue-600">{filteredData.filter((s) => s.serviceCategory === "E-VISA").length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">목바이 비자런</div>
          <div className="text-2xl font-bold text-green-600">{filteredData.filter((s) => s.serviceCategory === "VISA_RUN").length}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">패스트트랙</div>
          <div className="text-2xl font-bold text-purple-600">{filteredData.filter((s) => s.serviceCategory === "FAST_TRACK").length}</div>
        </div>
      </div>

      {/* 서비스 모달 */}
      {modalOpen && (
        <ServiceModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleModalSubmit}
          modalType={modalType}
          serviceType={selectedServiceType}
          selectedService={selectedService}
          onServiceTypeChange={setSelectedServiceType}
        />
      )}
    </div>
  );
}
