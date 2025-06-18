

# import sys
# import json
# import re
# import cv2
# import pytesseract
# from passporteye import read_mrz

# # 사용자 환경에 맞게 Tesseract 경로를 설정해야 할 수 있습니다.
# # Windows 예시: pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
# # macOS 예시 (Homebrew): pytesseract.pytesseract.tesseract_cmd = r'/opt/homebrew/bin/tesseract'


# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# def preprocess_for_ocr(image_path):
#     """일반 OCR을 위한 이미지 전처리 함수 - 개선된 버전"""
#     try:
#         img = cv2.imread(image_path)
#         if img is None:
#             raise FileNotFoundError(f"이미지 파일을 찾을 수 없거나 읽을 수 없습니다: {image_path}")

#         # 이미지 크기를 키워 OCR 정확도를 높입니다 (2.0배로 증가)
#         scale_factor = 2.0
#         img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)

#         # 그레이스케일로 변환
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#         # CLAHE 적용 (대비 제한 적응 히스토그램 평활화)
#         clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
#         gray = clahe.apply(gray)

#         # 노이즈 제거
#         gray = cv2.medianBlur(gray, 3)

#         # 적응형 스레시홀딩
#         thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

#         # 모폴로지 연산으로 텍스트 개선
#         kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
#         thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

#         return thresh
#     except Exception as e:
#         # 오류 발생 시 None을 반환하여 main 함수에서 처리하도록 함
#         print(f"이미지 전처리 중 오류 발생: {e}", file=sys.stderr)
#         return None

# def extract_mrz_info(image_path):
#     """passporteye의 read_mrz 함수를 사용하여 MRZ 정보 추출"""
#     try:
#         # read_mrz 함수는 이미지 처리와 파싱을 한번에 수행합니다.
#         mrz = read_mrz(image_path, extra_cmdline_params='--oem 3')

#         if not mrz:
#             return {'error': '유효한 MRZ 데이터를 찾지 못했습니다.'}

#         data = mrz.to_dict()

#         # 디버깅: MRZ 원본 데이터 확인
#         print(f"MRZ 원본 데이터: {data}", file=sys.stderr)

#         # Given names 후처리: 대문자·스페이스만 남기고, 마지막에 반복된 K 문자는 제거
#         raw_names = data.get('names','') or ''
#         # 1) 공백 앞뒤 제거
#         cleaned = raw_names.strip()
#         # 2) 대문자·공백만 남기기 (필러가 아닌 실제 알파벳만)
#         cleaned = re.sub(r'[^A-Z ]', '', cleaned)
#         # 3) 끝에 반복된 K 제거 (MRZ 필러)
#         cleaned = re.sub(r'K+$', '', cleaned).strip()
#         # 4) 공백이 연속되는 경우 하나로 줄이기
#         cleaned = cleaned.replace('  ', '')

#         # 발급일 처리 개선
#         issuing_date = data.get('date_of_issue')
#         if not issuing_date:
#             # MRZ에서 추출되지 않은 경우, 다른 필드들도 확인
#             print(f"MRZ에서 발급일을 찾지 못함. 사용 가능한 키들: {list(data.keys())}", file=sys.stderr)

#         # 라이브러리 필드 이름과 요청하신 필드 이름 매칭
#         # get() 메서드를 사용하여 키가 없을 경우 None을 반환하도록 함
#         return {
#             'Type': data.get('type'),
#             'Issuing country': data.get('country'),
#             'Issuing date': issuing_date,
#             'Passport No.': data.get('number'),
#             'Surname': data.get('surname'),
#             # 'Given names': data.get('names'),
#             'Given names': cleaned,
#             'Date of birth': data.get('date_of_birth'),
#             'Sex': data.get('sex'),
#             'Nationality': data.get('nationality'),
#             'Personal No.': data.get('personal_number'),
#             'Date of expiry': data.get('expiration_date')
#         }
#     except Exception as e:
#         return {'error': f"MRZ 추출 중 오류 발생: {e}"}

# def extract_non_mrz_info(preprocessed_img):
#     """전처리된 이미지에서 Tesseract OCR로 MRZ 외 정보 추출 - 개선된 버전"""
#     try:
#         # 여러 OCR 설정을 시도하여 더 나은 결과를 얻습니다
#         configs = [
#             r'--oem 3 --psm 4 -l kor+eng',  # 기본 설정
#             r'--oem 3 --psm 6 -l kor+eng',  # 단일 텍스트 블록
#             r'--oem 3 --psm 3 -l kor+eng',  # 자동 페이지 분할
#             r'--oem 3 --psm 11 -l kor+eng', # 희소 텍스트
#         ]

#         all_text = ""
#         for config in configs:
#             try:
#                 text = pytesseract.image_to_string(preprocessed_img, config=config)
#                 all_text += text + "\n"
#             except:
#                 continue

#         # 디버깅: OCR 결과 출력
#         print(f"OCR 추출된 텍스트:\n{all_text}\n", file=sys.stderr)

#         result = {}

#         # 정규식을 사용하여 각 필드를 더 견고하게 찾습니다.

#         # 한글성명: '성명' 또는 '한글성명' 다음에 오는 2~5자리의 한글 이름
#         name_match = re.search(r'(?:한글성명|성\s*명)\s*:?\s*([가-힣]{2,5})', all_text)
#         if name_match:
#             result['한글성명'] = name_match.group(1).strip()

#         # 발행관청: 'Authority' 또는 '발행관청' 다음에 오는, 줄 끝까지의 텍스트
#         auth_match = re.search(r'(?:Authority|발행관청)\s*:?\s*(.+)', all_text)
#         if auth_match:
#             authority_line = auth_match.group(1).split('\n')[0]
#             result['Authority'] = authority_line.strip()

#         # 발급일 추출 개선: 더 다양한 패턴 지원
#         issue_date_patterns = [
#             # 표준 패턴: 01 JAN 2023, 01JAN2023
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}\s*[A-Z]{3}\s*\d{4})',
#             # 한국어 패턴: 2023년 1월 1일, 2023.01.01
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{4}[년\.]\s*\d{1,2}[월\.]\s*\d{1,2}일?)',
#             # 숫자 패턴: 20230101, 2023-01-01, 2023/01/01, 2023.01.01
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{4}[-/\.]\d{2}[-/\.]\d{2})',
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{8})',
#             # 축약형: 23.01.01, 230101, 23/01/01
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}[\./-]?\d{2}[\./-]?\d{2})',
#             # 월 이름 패턴: Jan 01 2023, 01-Jan-2023, JAN012023
#             r'(?:Date of issue|발급일)\s*:?\s*([A-Z]{3}\s*\d{2}\s*\d{4})',
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}[-\s]*[A-Z]{3}[-\s]*\d{4})',
#             # 역순 패턴: 01/01/2023 (일/월/년)
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}[/\.]\d{2}[/\.]\d{4})',
#             # 패턴 없이 바로 날짜가 오는 경우
#             r'(?:Date of issue|발급일)\s*(\d{2}[A-Z]{3}\d{4})',
#             # 더 유연한 패턴들
#             r'(?:Issue|발급)\s*:?\s*(\d{1,2}[/.]\d{1,2}[/.]\d{2,4})',
#             r'(?:Issue|발급)\s*:?\s*(\d{2}\s*[A-Z]{3}\s*\d{4})',
#         ]

#         for pattern in issue_date_patterns:
#             issue_date_match = re.search(pattern, all_text, re.IGNORECASE | re.MULTILINE)
#             if issue_date_match:
#                 extracted_date = issue_date_match.group(1).strip()
#                 result['Date of issue'] = extracted_date
#                 print(f"발급일 추출 성공: {extracted_date}", file=sys.stderr)
#                 break

#         if 'Date of issue' not in result:
#             print("발급일을 찾지 못했습니다.", file=sys.stderr)

#         return result
#     except Exception as e:
#         return {'error': f"OCR 정보 추출 중 오류 발생: {e}"}

# def main(image_path):
#     """메인 실행 함수 - 개선된 버전"""
#     # 상수 정의
#     ISSUING_DATE_KEY = 'Issuing date'
#     DATE_OF_ISSUE_KEY = 'Date of issue'

#     # 1. MRZ 정보 추출
#     mrz_data = extract_mrz_info(image_path)

#     # 2. OCR을 위한 이미지 전처리
#     preprocessed_img_for_ocr = preprocess_for_ocr(image_path)

#     non_mrz_data = {}
#     if preprocessed_img_for_ocr is not None:
#         # 3. MRZ 외 정보 추출
#         non_mrz_data = extract_non_mrz_info(preprocessed_img_for_ocr)

#     # 4. 두 결과 합치기 - MRZ 데이터를 우선으로 하되,
#     # MRZ에서 누락된 정보는 OCR 결과로 보완
#     final_output = {**mrz_data}

#     # OCR에서 추출된 정보로 누락된 항목 보완
#     for key, value in non_mrz_data.items():
#         if key == DATE_OF_ISSUE_KEY and (not final_output.get(ISSUING_DATE_KEY) or final_output.get(ISSUING_DATE_KEY) is None):
#             final_output[ISSUING_DATE_KEY] = value
#             print(f"OCR에서 발급일 보완: {value}", file=sys.stderr)
#         elif key not in final_output or final_output[key] is None:
#             final_output[key] = value

#     # 디버깅: 최종 결과 출력
#     print(f"최종 추출 결과: {final_output}", file=sys.stderr)

#     return final_output

# if __name__ == '__main__':
#     if len(sys.argv) != 2:
#         print(json.dumps({'error': '사용법: python passport_extractor.py <이미지_경로>'}, ensure_ascii=False))
#         sys.exit(1)

#     image_file_path = sys.argv[1]

#     extracted_data = main(image_file_path)

#     # 최종 결과를 JSON 형식으로 출력
#     print(json.dumps(extracted_data, ensure_ascii=False, indent=2))


#!/usr/bin/env python3
# -*- coding: utf-8 -*-

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import base64
import google.generativeai as genai  # Google Gen AI SDK for Python :contentReference[oaicite:0]{index=0}

# ─── 1. API 키 설정 ───────────────────────────────────────────────────────────
# 환경변수 'GOOGLE_API_KEY' 에 API 키를 미리 저장해주세요.
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    raise RuntimeError("환경변수 GOOGLE_API_KEY 에 키를 설정하세요.")
genai.configure(api_key=api_key)   # 키 구성 :contentReference[oaicite:1]{index=1}

# ─── 2. 모델 지정 ─────────────────────────────────────────────────────────────
# Vertex AI 모델명은 ‘projects/{PROJECT}/locations/{REGION}/models/{MODEL_ID}’ 형식입니다.
# 여기서는 미리 배포된 gemini-2.5-pro-preview-06-05 를 사용합니다.
MODEL = "projects/your-gcp-project/locations/us-central1/models/gemini-2.5-pro-preview-06-05"  # :contentReference[oaicite:2]{index=2}

# ─── 3. 이미지 로딩 및 base64 인코딩 ──────────────────────────────────────────
image_path = "passport.jpg"
with open(image_path, "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode("utf-8")  # :contentReference[oaicite:3]{index=3}

# ─── 4. 프롬프트 메시지 구성 ─────────────────────────────────────────────────
# ‘system’ 메시지에서 구조화된 JSON 출력을 명시하고, ‘user’ 에 이미지 삽입
messages = [
    {
        "role": "system",        "content": (
            "You are an OCR assistant specialized in passports. "
            "Extract the following fields and return strictly as JSON: "
            "Type, Issuing country, Passport No., Surname, Given names, "
            "Date of birth, Sex, Nationality, Personal No., Date of issue, "
            "Date of expiry, Authority, korean_name. "
            "If a field is not readable, return null."
        )
    },
    {
        "role": "user",
        "content": f"<image:{img_b64}>"
    }
]

# ─── 5. Gemini 2.5 Pro 호출 ────────────────────────────────────────────────────
response = genai.chat.completions.create(
    model=MODEL,             # 모델 ID :contentReference[oaicite:4]{index=4}
    messages=messages,
    temperature=0.0,        # 결정론적 출력 :contentReference[oaicite:5]{index=5}
    top_p=0.95,
    max_output_tokens=1024
)

# ─── 6. 응답 파싱 및 출력 ────────────────────────────────────────────────────
# 모델이 JSON 형태로 응답했다고 가정하고 파싱
content = response.choices[0].message.content.strip()  # :contentReference[oaicite:6]{index=6}
try:
    passport_data = json.loads(content)
except json.JSONDecodeError:
    # JSON이 아니면 원본 텍스트를 저장
    passport_data = {"error": "Invalid JSON", "raw": content}

print(json.dumps(passport_data, ensure_ascii=False, indent=2))
