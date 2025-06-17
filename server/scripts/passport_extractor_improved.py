import sys
import json
import re
import cv2
import pytesseract
from passporteye import read_mrz

# Tesseract 경로 설정
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def preprocess_for_ocr(image_path):
    """개선된 이미지 전처리 함수"""
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise FileNotFoundError(f"이미지 파일을 찾을 수 없습니다: {image_path}")

        # 1. 이미지 크기 확대 (OCR 정확도 향상)
        scale_factor = 2.0
        img = cv2.resize(img, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC)

        # 2. 그레이스케일 변환
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # 3. 가우시안 블러로 노이즈 제거
        blurred = cv2.GaussianBlur(gray, (3, 3), 0)

        # 4. 대비 향상 (CLAHE)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(blurred)

        # 5. 적응형 임계값 적용
        thresh = cv2.adaptiveThreshold(
            enhanced, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        # 6. 모폴로지 연산으로 텍스트 개선
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        processed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        return processed
    except Exception as e:
        print(f"이미지 전처리 중 오류: {e}", file=sys.stderr)
        return None

def extract_mrz_info(image_path):
    """MRZ 정보 추출"""
    try:
        mrz = read_mrz(image_path, extra_cmdline_params='--oem 3')

        if not mrz:
            return {'error': '유효한 MRZ 데이터를 찾지 못했습니다.'}

        data = mrz.to_dict()
        print(f"MRZ 원본 데이터: {data}", file=sys.stderr)

        # Given names 정리
        raw_names = data.get('names','') or ''
        cleaned = raw_names.strip()
        cleaned = re.sub(r'[^A-Z ]', '', cleaned)
        cleaned = re.sub(r'K+$', '', cleaned).strip()
        cleaned = cleaned.replace('  ', ' ')

        return {
            'Type': data.get('type'),
            'Issuing country': data.get('country'),
            'Issuing date': data.get('date_of_issue'),
            'Passport No.': data.get('number'),
            'Surname': data.get('surname'),
            'Given names': cleaned,
            'Date of birth': data.get('date_of_birth'),
            'Sex': data.get('sex'),
            'Nationality': data.get('nationality'),
            'Personal No.': data.get('personal_number'),
            'Date of expiry': data.get('expiration_date')
        }
    except Exception as e:
        return {'error': f"MRZ 추출 중 오류: {e}"}

def extract_non_mrz_info(preprocessed_img):
    """OCR로 MRZ 외 정보 추출 - 발급일 중점 개선"""
    try:
        # 여러 OCR 설정 시도
        configs = [
            r'--oem 3 --psm 6 -l eng',  # 균일한 텍스트 블록
            r'--oem 3 --psm 4 -l eng',  # 텍스트 한 열
            r'--oem 3 --psm 3 -l eng',  # 자동 페이지 분할
        ]

        all_text = ""
        for config in configs:
            try:
                text = pytesseract.image_to_string(preprocessed_img, config=config)
                all_text += "\n" + text
            except:
                continue

        if not all_text.strip():
            all_text = pytesseract.image_to_string(preprocessed_img)

        print(f"OCR 추출된 텍스트:\n{all_text}\n", file=sys.stderr)

        result = {}

        # 한글성명 찾기
        name_match = re.search(r'(?:한글성명|성\s*명)\s*:?\s*([가-힣]{2,5})', all_text)
        if name_match:
            result['한글성명'] = name_match.group(1).strip()

        # 발행관청 찾기
        auth_match = re.search(r'(?:Authority|발행관청)\s*:?\s*(.+)', all_text)
        if auth_match:
            authority_line = auth_match.group(1).split('\n')[0]
            result['Authority'] = authority_line.strip()

        # 발급일 추출 - 더 넓은 범위로 검색
        lines = all_text.split('\n')

        # 발급일 패턴들
        date_patterns = [
            r'(\d{2}\s+[A-Z]{3}\s+\d{4})',           # 01 JAN 2023
            r'(\d{4}[-/\.]\d{2}[-/\.]\d{2})',        # 2023-01-01
            r'(\d{2}[-/\.]\d{2}[-/\.]\d{4})',        # 01-01-2023
            r'(\d{1,2}[-/\.]\d{1,2}[-/\.]\d{4})',    # 1-1-2023
            r'(\d{8})',                               # 20230101
            r'([A-Z]{3}\s+\d{1,2}\s+\d{4})',         # JAN 01 2023
            r'(\d{1,2}[-\s][A-Z]{3}[-\s]\d{4})',     # 01-JAN-2023
        ]

        # 1단계: "Date of issue" 또는 "발급일" 근처에서 찾기
        for line in lines:
            if re.search(r'(?i)(?:date\s*of\s*issue|발급일)', line):
                for pattern in date_patterns:
                    match = re.search(pattern, line, re.IGNORECASE)
                    if match:
                        result['Date of issue'] = match.group(1).strip()
                        print(f"발급일 찾음 (특정 줄): {match.group(1)}", file=sys.stderr)
                        break
                if 'Date of issue' in result:
                    break

        # 2단계: 전체 텍스트에서 날짜 패턴 찾기
        if 'Date of issue' not in result:
            found_dates = []
            for pattern in date_patterns:
                matches = re.findall(pattern, all_text, re.IGNORECASE)
                found_dates.extend(matches)

            print(f"전체에서 찾은 날짜들: {found_dates}", file=sys.stderr)

            if found_dates:
                # DD MMM YYYY 형태를 우선적으로 선택
                for date in found_dates:
                    if re.match(r'\d{2}\s+[A-Z]{3}\s+\d{4}', date):
                        result['Date of issue'] = date.strip()
                        print(f"발급일 찾음 (표준 형태): {date}", file=sys.stderr)
                        break

                # 표준 형태가 없다면 첫 번째 찾은 날짜 사용
                if 'Date of issue' not in result:
                    result['Date of issue'] = found_dates[0].strip()
                    print(f"발급일 찾음 (첫 번째): {found_dates[0]}", file=sys.stderr)

        return result
    except Exception as e:
        return {'error': f"OCR 정보 추출 중 오류: {e}"}

def main(image_path):
    """메인 실행 함수"""
    # 1. MRZ 정보 추출
    mrz_data = extract_mrz_info(image_path)

    # 2. OCR을 위한 이미지 전처리
    preprocessed_img = preprocess_for_ocr(image_path)

    non_mrz_data = {}
    if preprocessed_img is not None:
        # 3. MRZ 외 정보 추출
        non_mrz_data = extract_non_mrz_info(preprocessed_img)

    # 4. 결과 합치기 - MRZ 우선, OCR로 보완
    final_output = {**mrz_data}

    # OCR 결과로 누락된 항목 보완
    for key, value in non_mrz_data.items():
        if key == 'Date of issue' and (not final_output.get('Issuing date') or final_output.get('Issuing date') is None):
            final_output['Issuing date'] = value
        elif key not in final_output or final_output[key] is None:
            final_output[key] = value

    return final_output

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': '사용법: python passport_extractor.py <이미지_경로>'}, ensure_ascii=False))
        sys.exit(1)

    image_file_path = sys.argv[1]
    extracted_data = main(image_file_path)
    print(json.dumps(extracted_data, ensure_ascii=False, indent=2))
