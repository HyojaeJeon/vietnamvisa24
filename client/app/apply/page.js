"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import Header from "../src/components/header";
import { t as baseT, translations } from "../src/lib/translations";
import { useLanguage } from "../src/hooks/useLanguage";

// t 함수 개선: 언어별로 우선 찾고, 없으면 ko로 fallback
function t(key, language) {
  const keys = key.split(".");
  let value = translations[language];
  for (const k of keys) {
    value = value?.[k];
  }
  if (typeof value === "string") return value;
  // fallback to ko
  value = translations.ko;
  for (const k of keys) {
    value = value?.[k];
  }
  if (typeof value === "string") return value;
  return key;
}

// 단계별 컴포넌트 (1~2단계만 우선 구현)
function Step1ServiceSelection({ data, onChange, price, onNext, language }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("apply.step1.title", language) || "서비스 선택"}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 서비스 종류, 비자유형, 처리속도 선택 UI (샘플) */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step1.serviceType", language) || "서비스 종류"}</label>
            <select name="serviceType" value={data.serviceType || ""} onChange={onChange} className="input">
              <option value="">{t("apply.step1.selectService", language) || "선택하세요"}</option>
              <option value="evisa">E-Visa</option>
              <option value="arrival">도착 비자</option>
              <option value="visarun">비자런</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step1.visaType", language) || "비자 유형"}</label>
            <select name="visaType" value={data.visaType || ""} onChange={onChange} className="input">
              <option value="">{t("apply.step1.selectVisaType", language) || "선택하세요"}</option>
              <option value="single">90일 단수</option>
              <option value="multiple">90일 복수</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step1.processing", language) || "처리 속도"}</label>
            <select name="processing" value={data.processing || ""} onChange={onChange} className="input">
              <option value="">{t("apply.step1.selectProcessing", language) || "선택하세요"}</option>
              <option value="standard">일반</option>
              <option value="express">급행</option>
              <option value="urgent">초급행</option>
            </select>
          </div>
          {/* 실시간 가격 요약 */}
          <div className="sticky bottom-0 flex items-center justify-between py-4 bg-white border-t">
            <span className="font-bold">{t("apply.priceSummary", language) || "예상 결제 금액"}</span>
            <span className="text-xl font-bold text-blue-600">{price.toLocaleString()}₩</span>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={onNext} disabled={!data.serviceType || !data.visaType || !data.processing}>
              {t("apply.next", language) || "다음"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Step2ApplicantInfo({ data, onChange, onNext, onPrev, language }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("apply.step2.title", language) || "신청자 정보 입력"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step2.fullNameLabel", language) || "성명(여권과 동일)"}</label>
            <Input name="fullName" value={data.fullName || ""} onChange={onChange} placeholder={t("apply.step2.fullNamePlaceholder", language) || "예: HONG GILDONG"} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step2.gender", language) || "성별"}</label>
            <select name="gender" value={data.gender || ""} onChange={onChange} className="input">
              <option value="">{t("apply.step2.selectGender", language) || "선택"}</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step2.birth", language) || "생년월일"}</label>
            <Input name="birth" type="date" value={data.birth || ""} onChange={onChange} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step2.nationality", language) || "국적"}</label>
            <Input name="nationality" value={data.nationality || ""} onChange={onChange} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step2.email", language) || "이메일"}</label>
            <Input name="email" type="email" value={data.email || ""} onChange={onChange} />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t("apply.step2.phone", language) || "베트남 내 연락처"}</label>
            <Input name="phone" value={data.phone || ""} onChange={onChange} />
          </div>
          {/* ...여권 정보 등 추가 필드... */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onPrev}>
              {t("apply.prev", language) || "이전"}
            </Button>
            <Button onClick={onNext} disabled={!data.fullName || !data.gender || !data.birth || !data.nationality || !data.email}>
              {t("apply.next", language) || "다음"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressBar({ step, steps, language }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((key, idx) => (
        <React.Fragment key={key}>
          <div className={`flex items-center ${idx <= step ? "text-blue-600 font-bold" : "text-gray-400"}`}>
            <span className="flex items-center justify-center w-8 h-8 mr-2 border rounded-full" style={{ background: idx === step ? "#2563eb" : "#e5e7eb", color: idx === step ? "#fff" : undefined }}>
              {idx + 1}
            </span>
            <span className="hidden text-sm sm:inline">{t(key, language)}</span>
          </div>
          {idx < steps.length - 1 && <span className="w-8 h-1 bg-gray-200 rounded" />}
        </React.Fragment>
      ))}
    </div>
  );
}

// 메인 마법사 컴포넌트
export default function ApplyVisaWizard() {
  const { currentLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    step1: {},
    step2: {},
    // step3~6은 이후 추가
  });
  const [price, setPrice] = useState(0);
  const steps = ["apply.step1.title", "apply.step2.title", "apply.step3.title", "apply.step4.title", "apply.step5.title", "apply.step6.title"];

  useEffect(() => {
    setMounted(true);
  }, []);

  // localStorage 연동
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("applyVisaForm");
      if (saved) {
        try {
          setForm(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("applyVisaForm", JSON.stringify(form));
    }
  }, [form]);

  // 가격 계산 (샘플: 실제로는 서비스/옵션에 따라 계산)
  useEffect(() => {
    let base = 89000;
    if (form.step1?.serviceType === "arrival") base += 20000;
    if (form.step1?.processing === "express") base += 30000;
    if (form.step1?.processing === "urgent") base += 60000;
    setPrice(base);
  }, [form.step1]);

  // 단계별 데이터 핸들러
  const handleStep1Change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, step1: { ...prev.step1, [name]: value } }));
  };
  const handleStep2Change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, step2: { ...prev.step2, [name]: value } }));
  };

  // 단계 이동
  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  if (!mounted) {
    // SSR과 hydration mismatch 방지: 클라이언트 마운트 전에는 렌더링하지 않음
    return null;
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow">
        <Header />
      </div>
      <div className="max-w-2xl px-2 py-8 mx-auto">
        <ProgressBar step={step} steps={steps} language={currentLanguage} />
        {step === 0 && <Step1ServiceSelection data={form.step1} onChange={handleStep1Change} price={price} onNext={next} language={currentLanguage} />}
        {step === 1 && <Step2ApplicantInfo data={form.step2} onChange={handleStep2Change} onNext={next} onPrev={prev} language={currentLanguage} />}
        {/* 3~6단계는 이후 구현 */}
      </div>
    </>
  );
}
// ...이후 Step3~6, 파일업로드, 결제, GraphQL 연동 등 추가 구현 예정...
