"use client";

import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../src/components/ui/select";
import { Badge } from "../../src/components/ui/badge";
import { CheckCircle, Clock, Zap, ArrowRight } from "lucide-react";
import { VISA_TYPES, PROCESSING_TYPES, ADDITIONAL_SERVICES, VISIT_PURPOSES } from "./types";

export default function ServiceSelectionStep({ formData = {}, onUpdate, errors = {}, onNext }) {
  const handleVisaTypeChange = (value) => {
    onUpdate({
      visaType: value,
    });
  };

  const handleProcessingTimeChange = (value) => {
    onUpdate({
      processingType: value,
    });
  };

  const handleVisitPurposeChange = (value) => {
    onUpdate({
      purpose: value,
    });
  };
  const toggleAdditionalService = (service) => {
    const currentServices = formData?.additionalServices || [];
    const updatedServices = currentServices.includes(service) ? currentServices.filter((s) => s !== service) : [...currentServices, service];

    onUpdate({
      additionalServices: updatedServices,
    });
  };
  const getVisaTypeLabel = (type) => {
    const labels = {
      [VISA_TYPES.E_VISA_GENERAL]: "E-VISA(전자비자) / 일반(3~4일 소요)",
      [VISA_TYPES.E_VISA_URGENT]: "E-VISA(전자비자) / 급행",
      [VISA_TYPES.E_VISA_TRANSIT]: "목바이 경유 E-VISA(전자비자) / 당일 발급",
    };
    return labels[type] || type;
  };
  const getProcessingTimeLabel = (type) => {
    const labels = {
      [PROCESSING_TYPES.EXPRESS_1HOUR]: "1시간(긴급 처리)",
      [PROCESSING_TYPES.EXPRESS_2HOUR]: "2시간(긴급 처리)",
      [PROCESSING_TYPES.EXPRESS_4HOUR]: "4시간(긴급 처리)",
      [PROCESSING_TYPES.EXPRESS_1DAY]: "1일",
      [PROCESSING_TYPES.EXPRESS_2DAY]: "2일",
      [PROCESSING_TYPES.STANDARD]: "3~4일(일반 처리)",
    };
    return labels[type] || type;
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
            <label className="block mb-3 text-sm font-medium">비자 유형 *</label>
            <Select value={formData?.visaType || ""} onValueChange={handleVisaTypeChange}>
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
            {errors.visaType && <p className="mt-1 text-sm text-red-500">{errors.visaType}</p>}
          </div>
          {console.log("formData?.visaType : ,", formData?.visaType)}
          {/* 처리 속도 선택 */}
          {formData?.visaType === "e-visa_urgent" && (
            <div>
              <label className="block mb-3 text-sm font-medium">처리 속도 *</label>
              <Select value={formData?.processingType || PROCESSING_TYPES.STANDARD} onValueChange={handleProcessingTimeChange}>
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
              {errors.processingType && <p className="mt-1 text-sm text-red-500">{errors.processingType}</p>}
            </div>
          )}
          {/* 추가 서비스 */}
          <div>
            <label className="block mb-3 text-sm font-medium">추가 서비스 (선택사항)</label>
            <div className="space-y-2">
              {ADDITIONAL_SERVICES.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={service.id}
                    checked={(formData?.additionalServices || []).includes(service.id)}
                    onChange={() => toggleAdditionalService(service.id)}
                    className="border-gray-300 rounded"
                  />
                  <label htmlFor={service.id} className="text-sm">
                    {service.name} - {service.description}
                  </label>
                </div>
              ))}
            </div>
          </div>{" "}
          {/* 선택 요약 */}
          {(formData?.visaType || formData?.processingType || formData?.purpose) && (
            <div className="p-4 rounded-lg bg-blue-50">
              <h4 className="mb-2 font-medium">선택 요약</h4>
              <div className="space-y-1 text-sm">
                {formData?.visaType && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{getVisaTypeLabel(formData?.visaType)}</Badge>
                  </div>
                )}
                {formData?.processingType && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{getProcessingTimeLabel(formData?.processingType)}</Badge>
                  </div>
                )}
                {formData?.purpose && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{VISIT_PURPOSES.find((p) => p.value === formData?.purpose)?.label}</Badge>
                  </div>
                )}
                {formData?.additionalServices && formData?.additionalServices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">패스트트랙 +1</Badge>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* 다음 단계 버튼 */}
          <div className="flex justify-end pt-4">
            <Button onClick={onNext} className="flex items-center gap-2">
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
  onUpdate: PropTypes.func.isRequired,
  errors: PropTypes.object,
  onNext: PropTypes.func.isRequired,
};
