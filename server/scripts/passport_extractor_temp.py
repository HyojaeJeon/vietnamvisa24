

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
#     """일반 OCR을 위한 이미지 전처리 함수"""
#     try:
#         img = cv2.imread(image_path)
#         if img is None:
#             raise FileNotFoundError(f"이미지 파일을 찾을 수 없거나 읽을 수 없습니다: {image_path}")

#         # 이미지 크기를 약간 키워 OCR 정확도를 높입니다.
#         scale_factor = 1.5
#         img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)

#         # 그레이스케일로 변환
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#         # 적응형 스레시홀딩을 사용하여 텍스트를 더 명확하게 만듭니다.
#         thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)

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
#     """전처리된 이미지에서 Tesseract OCR로 MRZ 외 정보 추출"""
#     try:
#         # Tesseract 설정: 한국어와 영어를 함께 인식, 페이지 분할 모드 4 (가변 크기의 텍스트 한 열로 가정)
#         custom_config = r'--oem 3 --psm 4 -l kor+eng'
#         text = pytesseract.image_to_string(preprocessed_img, config=custom_config)

#         # 디버깅: OCR 결과 출력
#         print(f"OCR 추출된 텍스트:\n{text}\n", file=sys.stderr)

#         result = {}

#         # 정규식을 사용하여 각 필드를 더 견고하게 찾습니다.

#         # 한글성명: '성명' 또는 '한글성명' 다음에 오는 2~5자리의 한글 이름
#         name_match = re.search(r'(?:한글성명|성\s*명)\s*:?\s*([가-힣]{2,5})', text)
#         if name_match:
#             result['한글성명'] = name_match.group(1).strip()

#         # 발행관청: 'Authority' 또는 '발행관청' 다음에 오는, 줄 끝까지의 텍스트
#         auth_match = re.search(r'(?:Authority|발행관청)\s*:?\s*(.+)', text)
#         if auth_match:
#             authority_line = auth_match.group(1).split('\n')[0]
#             result['Authority'] = authority_line.strip()

#         # 발급일 추출 개선: 다양한 패턴 지원
#         issue_date_patterns = [
#             # 기존 패턴: 01 JAN 2023
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}\s[A-Z]{3}\s\d{4})',
#             # 한국어 패턴: 2023년 1월 1일, 2023.01.01
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{4}[년\.]\s*\d{1,2}[월\.]\s*\d{1,2}일?)',
#             # 숫자만: 20230101, 2023-01-01, 2023/01/01
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{4}[-/\.]\d{2}[-/\.]\d{2})',
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{8})',
#             # 축약형: 23.01.01, 230101
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}[\./-]?\d{2}[\./-]?\d{2})',
#             # 월 이름 패턴: Jan 01 2023, 01-Jan-2023
#             r'(?:Date of issue|발급일)\s*:?\s*([A-Z]{3}\s+\d{2}\s+\d{4})',
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}[-\s][A-Z]{3}[-\s]\d{4})',
#             # 역순 패턴: 01/01/2023 (일/월/년)
#             r'(?:Date of issue|발급일)\s*:?\s*(\d{2}[/\.]\d{2}[/\.]\d{4})',
#         ]

#         for pattern in issue_date_patterns:
#             issue_date_match = re.search(pattern, text, re.IGNORECASE)
#             if issue_date_match:
#                 result['Date of issue'] = issue_date_match.group(1).strip()
#                 break

#         return result
#     except Exception as e:
#         return {'error': f"OCR 정보 추출 중 오류 발생: {e}"}

# def main(image_path):
#     """메인 실행 함수"""
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
#         if key == 'Date of issue' and (not final_output.get('Issuing date') or final_output.get('Issuing date') is None):
#             final_output['Issuing date'] = value
#         elif key not in final_output or final_output[key] is None:
#             final_output[key] = value

#     return final_output

# if __name__ == '__main__':
#     if len(sys.argv) != 2:
#         print(json.dumps({'error': '사용법: python passport_extractor.py <이미지_경로>'}, ensure_ascii=False))
#         sys.exit(1)

#     image_file_path = sys.argv[1]

#     extracted_data = main(image_file_path)

#     # 최종 결과를 JSON 형식으로 출력
#     print(json.dumps(extracted_data, ensure_ascii=False, indent=2))

# """
# passport_extractor.py

# 이 스크립트는 여권 이미지를 입력받아 MRZ(여권 기계 판독 영역)와 일반 텍스트 OCR을 결합하여
# 아래 항목을 추출하고 JSON 형태로 출력합니다:

# 종류(Type)

# 발행국(Issuing country)

# 여권번호(Passport No.)

# 성명(성, Surname)

# 성명(이름, Given names)

# 생년월일(Date of birth)

# 성별(Sex)

# 국적(Nationality)

# 주민등록번호(Personal No.)

# 발행관청(Authority)

# 발급일(Date of issue)

# 기간만료일(Date of expiry)

# 한글성명

# 개선된 인식률을 위해 OpenCV 기반 전처리 및 Tesseract 구성(config)을 적용합니다.
# 사용법:
# $ python3 passport_extractor.py /path/to/passport_image.jpg

# 필수 라이브러리 설치:
# pip install passporteye pillow pytesseract opencv-python

# """
