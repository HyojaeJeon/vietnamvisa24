"use client";

import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Badge } from "../../src/components/ui/badge";
import { CheckCircle, Clock, Zap, ArrowRight } from "lucide-react";
import { VISA_TYPES, PROCESSING_TYPES, ADDITIONAL_SERVICES, VISIT_PURPOSES } from "./types";

export default function ServiceSelectionStep({ formData, updateFormData, errors, nextStep }) {
  const handleVisaTypeChange = (value) => {
    updateFormData({
      serviceSelection: {
        ...formData,
        visaType: value,
      },
    });
  };

  const handleProcessingTimeChange = (value) => {
    updateFormData({
      serviceSelection: {
        ...formData,
        processingTime: value,
      },
    });
  };

  const handleVisitPurposeChange = (value) => {
    updateFormData({
      serviceSelection: {
        ...formData,
        visitPurpose: value,
      },
    });
  };

  const toggleAdditionalService = (service) => {
    const currentServices = formData.additionalServices || [];
    const updatedServices = currentServices.includes(service) ? currentServices.filter((s) => s !== service) : [...currentServices, service];

    updateFormData({
      serviceSelection: {
        ...formData,
        additionalServices: updatedServices,
      },
    });
  };

  const getVisaTypeLabel = (type) => {
    const labels = {
      [VISA_TYPES.E_VISA_90_SINGLE]: "전자비자 90일 단수",
      [VISA_TYPES.E_VISA_90_MULTIPLE]: "전자비자 90일 복수",
      [VISA_TYPES.NO_VISA_45_MOC_BAI]: "무비자 45일 (목바이 입국)",
      [VISA_TYPES.E_VISA_90_MOC_BAI_SINGLE]: "전자비자 90일 단수 (목바이 입국)",
      [VISA_TYPES.E_VISA_90_MOC_BAI_MULTIPLE]: "전자비자 90일 복수 (목바이 입국)",
    };
    return labels[type] || type;
  };

  const getProcessingTimeLabel = (type) => {
    const labels = {
      [PROCESSING_TYPES.STANDARD]: "일반 처리 (4-5일)",
      [PROCESSING_TYPES.EXPRESS_3_DAYS]: "급행 처리 (3일)",
      [PROCESSING_TYPES.EXPRESS_2_DAYS]: "급행 처리 (2일)",
      [PROCESSING_TYPES.EXPRESS_1_DAY]: "급행 처리 (1일)",
      [PROCESSING_TYPES.EXPRESS_4_HOURS]: "긴급 처리 (4시간)",
      [PROCESSING_TYPES.EXPRESS_2_HOURS]: "긴급 처리 (2시간)",
      [PROCESSING_TYPES.EXPRESS_1_HOUR]: "긴급 처리 (1시간)",
    };
    return labels[type] || type;
  };

  const getVisitPurposeLabel = (purpose) => {
    const labels = {
      [VISIT_PURPOSES.TOURISM]: "관광",
      [VISIT_PURPOSES.BUSINESS]: "비즈니스",
      [VISIT_PURPOSES.FAMILY_VISIT]: "가족 방문",
      [VISIT_PURPOSES.OTHER]: "기타",
    };
    return labels[purpose] || purpose;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-blue-600" />
            서비스 선택
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 비자 유형 선택 */}
          <div>
            <label className="block text-sm font-medium mb-3">비자 유형 *</label>
            <Select value={formData.visaType || ""} onValueChange={handleVisaTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="비자 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(VISA_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getVisaTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.visaType && <p className="text-red-500 text-sm mt-1">{errors.visaType}</p>}
          </div>

          {/* 처리 속도 선택 */}
          <div>
            <label className="block text-sm font-medium mb-3">처리 속도 *</label>
            <Select value={formData.processingTime || PROCESSING_TYPES.STANDARD} onValueChange={handleProcessingTimeChange}>
              <SelectTrigger>
                <SelectValue placeholder="처리 속도를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(PROCESSING_TYPES).map((type) => (
                  <SelectItem key={type} value={type}>
                    <div className="flex items-center gap-2">
                      {type === PROCESSING_TYPES.STANDARD ? <Clock className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                      {getProcessingTimeLabel(type)}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.processingTime && <p className="text-red-500 text-sm mt-1">{errors.processingTime}</p>}
          </div>

          {/* 방문 목적 선택 */}
          <div>
            <label className="block text-sm font-medium mb-3">방문 목적 *</label>
            <Select value={formData.visitPurpose || ""} onValueChange={handleVisitPurposeChange}>
              <SelectTrigger>
                <SelectValue placeholder="방문 목적을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(VISIT_PURPOSES).map((purpose) => (
                  <SelectItem key={purpose} value={purpose}>
                    {getVisitPurposeLabel(purpose)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.visitPurpose && <p className="text-red-500 text-sm mt-1">{errors.visitPurpose}</p>}
          </div>

          {/* 추가 서비스 */}
          <div>
            <label className="block text-sm font-medium mb-3">추가 서비스 (선택사항)</label>
            <div className="space-y-2">
              {Object.values(ADDITIONAL_SERVICES).map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={service}
                    checked={(formData.additionalServices || []).includes(service)}
                    onChange={() => toggleAdditionalService(service)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor={service} className="text-sm">
                    입국장 패스트트랙 서비스
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 선택 요약 */}
          {(formData.visaType || formData.processingTime || formData.visitPurpose) && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">선택 요약</h4>
              <div className="space-y-1 text-sm">
                {formData.visaType && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{getVisaTypeLabel(formData.visaType)}</Badge>
                  </div>
                )}
                {formData.processingTime && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getProcessingTimeLabel(formData.processingTime)}</Badge>
                  </div>
                )}
                {formData.visitPurpose && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getVisitPurposeLabel(formData.visitPurpose)}</Badge>
                  </div>
                )}
                {formData.additionalServices && formData.additionalServices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">패스트트랙 +1</Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 다음 단계 버튼 */}
          <div className="flex justify-end pt-4">
            <Button onClick={nextStep} className="flex items-center gap-2">
              다음 단계
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

ServiceSelectionStep.propTypes = {
  formData: PropTypes.object.isRequired,
  updateFormData: PropTypes.func.isRequired,
  errors: PropTypes.object,
  nextStep: PropTypes.func.isRequired,
};
