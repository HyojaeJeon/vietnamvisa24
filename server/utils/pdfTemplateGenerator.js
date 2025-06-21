/**
 * PDF 접수증 HTML 템플릿 생성기
 * apply 페이지의 접수증 다운로드와 동일한 템플릿을 사용
 */

const generateApplicationReceiptHTML = (application) => {
  const formatCurrency = (amount, currency = "KRW") => {
    if (!amount) return "₩0";

    if (currency === "VND") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        minimumFractionDigits: 0,
      }).format(amount);
    }
  };

  const getVisaTypeLabel = (visaType) => {
    const typeMap = {
      E_VISA_GENERAL: "E-VISA (전자비자) / 일반 (4-5일 소요)",
      E_VISA_URGENT: "E-VISA (전자비자) / 긴급 (24시간 소요)",
      E_VISA_TRANSIT: "목바이 경유 E-VISA",
      tourist: "관광 비자",
      business: "비즈니스 비자",
    };
    return typeMap[visaType] || visaType;
  };
  const getAirportLabel = (airportCode) => {
    const airportMap = {
      UIH: "푸꿕(UIH)",
      ICN: "인천(ICN)",
      SGN: "탄손냣(SGN)",
      HAN: "노이바이(HAN)",
      DAD: "다낭(DAD)",
      CXR: "캄란(CXR)",
      VCA: "껀터(VCA)",
      HPH: "깟비(HPH)",
      DLI: "달랏(DLI)",
      PQC: "푸꾸옥(PQC)",
    };
    return airportMap[airportCode] || airportCode;
  };

  const getVehicleTypeLabel = (vehicleType) => {
    if (vehicleType === "innova") return "이노바 (7인승 SUV)";
    if (vehicleType === "carnival") return "카니발 (11인승 밴)";
    return "선택안함";
  };

  return `
<!DOCTYPE html>
<html lang="ko" style="margin: 0; padding: 0;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>비자 신청 접수증 - ${application.applicationId}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Malgun Gothic', Arial, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: #ffffff;
            padding: 40px;
        }

        .receipt-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #003366, #0066cc);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
        }

        .header p {
            font-size: 16px;
            opacity: 0.9;
        }

        .content {
            padding: 30px;
        }

        .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e5e7eb;
        }

        .section:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .section-title {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 4px 4px 0 0;
            padding: 12px 15px;
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            display: flex;
            align-items: center;
        }

        .section-content {
            background: #ffffff;
            border: 1px solid #d1d5db;
            border-top: none;
            border-radius: 0 0 4px 4px;
            padding: 15px;
        }

        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .info-label {
            color: #6b7280;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .info-value {
            color: #1f2937;
            font-size: 14px;
            font-weight: bold;
        }

        .pricing-section {
            background: #f0fdf4;
            border: 1px solid #22c55e;
            border-radius: 6px;
            padding: 20px;
            margin-top: 20px;
        }

        .pricing-title {
            font-size: 16px;
            font-weight: bold;
            color: #15803d;
            margin-bottom: 15px;
            text-align: center;
        }

        .pricing-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #bbf7d0;
        }

        .pricing-item:last-child {
            border-bottom: none;
            font-weight: bold;
            font-size: 16px;
            color: #15803d;
            border-top: 2px solid #22c55e;
            padding-top: 15px;
            margin-top: 10px;
        }

        .status-badge {
            display: inline-block;
            background: #fef3c7;
            color: #92400e;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-align: center;
            margin: 20px 0;
        }

        .footer {
            background: #f9fafb;
            padding: 20px 30px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
        }

        .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
        }

        @media print {
            body { padding: 0; }
            .receipt-container { border: none; }
        }
    </style>
</head>
<body>
    <div class="receipt-container">
        <div class="header">
            <h1>✅ 비자 신청 접수증</h1>
            <p>베트남비자24 - 신뢰할 수 있는 비자 전문 서비스</p>
        </div>

        <div class="content">
            <!-- 신청자 정보 -->
            <div class="section">
                <div class="section-title">
                    <span>신청자 정보</span>
                    <span style="font-size: 9px; font-weight: normal; margin-left: 8px;">APPLICANT INFORMATION</span>
                </div>
                <div class="section-content">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">신청자명</span>
                            <span class="info-value">${application.personalInfo?.firstName || ""} ${application.personalInfo?.lastName || ""}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">이메일</span>
                            <span class="info-value">${application.personalInfo?.email || ""}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">전화번호</span>
                            <span class="info-value">${application.personalInfo?.phone || ""}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">주소</span>
                            <span class="info-value">${application.personalInfo?.address || ""}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 신청 정보 -->
            <div class="section">
                <div class="section-title">
                    <span>신청 정보</span>
                    <span style="font-size: 9px; font-weight: normal; margin-left: 8px;">APPLICATION DETAILS</span>
                </div>
                <div class="section-content">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">신청번호</span>
                            <span class="info-value" style="color: #2563eb; font-size: 16px;">${application.applicationId}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">비자 종류</span>
                            <span class="info-value">${getVisaTypeLabel(application.travelInfo?.visaType)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">처리 방식</span>
                            <span class="info-value">${application.processingType || "일반"}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">신청일시</span>
                            <span class="info-value">${new Date(
                              application.createdAt,
                            ).toLocaleString("ko-KR", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">입국예정일</span>
                            <span class="info-value">${application.travelInfo?.entryDate || "미정"}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">입국공항</span>
                            <span class="info-value">${getAirportLabel(application.travelInfo?.entryPort)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 목바이 경유 정보 (해당하는 경우만) -->
            ${
              application.travelInfo?.visaType === "E_VISA_TRANSIT"
                ? `
            <div class="section">
                <div class="section-title">
                    <span>목바이 경유 정보</span>
                    <span style="font-size: 9px; font-weight: normal; margin-left: 8px;">TRANSIT INFORMATION</span>
                </div>
                <div class="section-content">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">신청 인원수</span>
                            <span class="info-value">${application.transitPeopleCount || 1}명</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">선택 차량</span>
                            <span class="info-value">${getVehicleTypeLabel(application.transitVehicleType)}</span>
                        </div>
                    </div>
                </div>
            </div>
            `
                : ""
            }

            <!-- 결제 정보 -->
            <div class="pricing-section">
                <div class="pricing-title">💳 결제 정보</div>
                ${(() => {
                  if (application.totalPrice?.totalPrice) {
                    const pricing = application.totalPrice;
                    const currency = pricing.currency || "KRW";
                    let html = "";

                    // 비자 기본료
                    if (pricing.visa?.basePrice) {
                      html += `
                        <div class="pricing-item">
                          <span>비자 기본료${application.travelInfo?.visaType === "E_VISA_TRANSIT" ? ` (${application.transitPeopleCount || 1}명)` : ""}</span>
                          <span>${formatCurrency(pricing.visa.basePrice, currency)}</span>
                        </div>
                      `;
                    }

                    // 차량 추가료
                    if (
                      pricing.visa?.vehiclePrice &&
                      pricing.visa.vehiclePrice > 0
                    ) {
                      html += `
                        <div class="pricing-item">
                          <span>차량 추가료</span>
                          <span>${formatCurrency(pricing.visa.vehiclePrice, currency)}</span>
                        </div>
                      `;
                    }

                    // 추가 서비스
                    if (pricing.additionalServices?.services?.length > 0) {
                      pricing.additionalServices.services.forEach((service) => {
                        html += `
                          <div class="pricing-item">
                            <span>${service.name}</span>
                            <span>${formatCurrency(service.price, currency)}</span>
                          </div>
                        `;
                      });
                    }

                    // 총 금액
                    html += `
                      <div class="pricing-item">
                        <span>총 결제 금액</span>
                        <span>${formatCurrency(pricing.totalPrice, currency)}</span>
                      </div>
                    `;

                    return html;
                  } else if (
                    application.totalPrice &&
                    typeof application.totalPrice === "number"
                  ) {
                    return `
                      <div class="pricing-item">
                        <span>총 결제 금액</span>
                        <span>${formatCurrency(application.totalPrice)}</span>
                      </div>
                    `;
                  } else {
                    return `
                      <div class="pricing-item">
                        <span>총 결제 금액</span>
                        <span>견적 문의</span>
                      </div>
                    `;
                  }
                })()}
            </div>

            <!-- 상태 정보 -->
            <div style="text-align: center;">
                <div class="status-badge">📋 접수 완료</div>
                <p style="color: #6b7280; font-size: 14px; margin-top: 10px;">
                    전문가가 신청서를 검토하고 빠르게 처리해 드리겠습니다.
                </p>
            </div>
        </div>

        <div class="footer">
            <div class="contact-info">
                <strong>베트남비자24 고객센터</strong><br>
                📞 전화: 1588-0000 | 📧 이메일: support@vietnamvisa24.com<br>
                💬 카카오톡: @vietnamvisa24 | 🌐 웹사이트: www.vietnamvisa24.com
            </div>

            <p style="margin-top: 20px; font-size: 10px; color: #9ca3af;">
                본 접수증은 비자 신청 접수를 확인하는 문서이며, 비자 발급을 보장하지 않습니다.<br>
                비자 발급 여부는 베트남 이민청의 심사에 따라 결정됩니다.
            </p>
        </div>
    </div>
</body>
</html>
  `;
};

module.exports = {
  generateApplicationReceiptHTML,
};
