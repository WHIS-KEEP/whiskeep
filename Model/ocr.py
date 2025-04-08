from fastapi import FastAPI, File, UploadFile
import easyocr
import numpy as np
import cv2
from fastapi.responses import JSONResponse
from fuzzywuzzy import process, fuzz
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()
ocr = easyocr.Reader(['en'])

''' 1. 텍스트 전처리 '''
# 위스키 브랜드 키워드를 정제하는 함수
def clean_whisky_keywords(words):
    """
    - 특수문자 제거
    - 대문자로 변환
    - 숫자로 시작하는 단어 제거
    - 빈 문자열 제거
    - 중복 제거 후 정렬
    """
    # 모든 특수문자 제거 + 대문자로 변환 (알파벳과 숫자만 남기기)
    filtering_emo = [re.sub(r"[^a-zA-Z0-9]", "", word).upper() for word in words]

    # 숫자로 시작하는 단어 제거 (ex: '12', '15Years', '1770')
    filtering_num = [word for word in filtering_emo if not re.search(r"\d", word)]

    # 길이가 1 또는 2인 단어 제거
    filtered_words = [word for word in filtering_num if len(word) > 2]

    # 빈 문자열 제거
    # filtered_words = [word for word in filtering_num if word]

    # 중복 제거 후 정렬
    unique_keywords = sorted(set(filtered_words))

    return unique_keywords

# 위스키 브랜드 키워드 리스트 만들기 (OCR 결과와 유사도 비교 후 대체용)
keyword_list = []
with open("cleaned_whisky_keywords.txt", "r", encoding="utf-8") as file:
    for line in file:
        line = line.strip()
        if not line:
            continue
        # 공백 기준으로 단어 분리
        words = line.split()
        for word in words:
            keyword_list.append(word)
keyword_list = clean_whisky_keywords(keyword_list)

# cleaned_whisy_keywords.txt에 있는 위스키 리스트
whisky_list = []
with open("cleaned_whisky_keywords.txt", 'r', encoding='utf-8') as f:
    for line in f:
        line = line.strip()  # 앞뒤 공백 제거
        if line:  # 빈 줄 무시
            whisky_list.append(line)

''' 2. 이미지 전처리 '''
def preprocess_image(image):
    image = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
    # 1️⃣ Grayscale 변환
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # 2️⃣ 선명화 필터 적용
    sharp = cv2.addWeighted(gray, 1.5, cv2.GaussianBlur(gray, (5, 5), 0), -0.5, 0)
    # 3️⃣ 사이즈 조정
    resized = cv2.resize(sharp, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
    # 3️⃣ Adaptive 또는 Otsu's Thresholding 적용 : 텍스트 뚜렷하게
    _, binary = cv2.threshold(resized, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Morphological Operations
    kernel = np.ones((3, 3), dtype=np.float64) / 9
    dst = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    return dst

''' 3. OCR 결과를 위스키 브랜드 키워드 리스트와 비교하여 가장 유사한 단어로 대체 '''
def correct_ocr_results(ocr_results, whisky_results, threshold=80):
    """
    - `ocr_results`: OCR로 추출된 단어 리스트
    - `whisky_results`: 정제된 위스키 브랜드 키워드 리스트
    - `threshold`: 유사도를 비교할 최소 임계값 (기본값: 80)

    반환값: 대체된 결과 리스트
    """
    corrected_results = []

    for word in ocr_results:

        # 가장 유사한 단어 찾기
        best_match, score = process.extractOne(word, whisky_results, scorer=fuzz.token_sort_ratio)

         # 너무 다른 길이 매칭 방지
        if abs(len(word) - len(best_match)) > 5:
            continue

        # 유사도가 threshold 이상이면 저장
        if score >= threshold:
            corrected_results.append(best_match)
        else:
            corrected_results.append(word)

        print(word, best_match, score)

    return corrected_results


@app.post("/ocr/")
async def perform_ocr(file: UploadFile = File(...)):
    """ OCR 실행 API """
    try:
        # 파일을 BytesIO에 저장하여 여러 번 읽을 수 있도록 함
        file_bytes = await file.read()

        # 1. 이미지 전처리
        processed_img = preprocess_image(file_bytes)

        # 2. OCR 실행
        results = ocr.readtext(processed_img)

        # 3. OCR 결과 필터링
        # 너무 작은 글씨 필터링
        min_width = 200  # 최소 너비
        min_height = 100  # 최소 높이

        filtered_texts = []
        for (bbox, text, confidence) in results:
            (top_left, top_right, bottom_right, bottom_left) = bbox
            width = bottom_right[0] - top_left[0]
            height = bottom_right[1] - top_left[1]

            # **바운딩 박스 크기가 특정 값 이상이면 저장**
            if (width > min_width) and (height > min_height) and (confidence > 0.5):
                filtered_texts.append(text)

        # 4. OCR 결과가 정상적으로 추출되었는지 확인
        if not filtered_texts:
            return JSONResponse(content={"error": "OCR 결과가 없습니다."}, status_code=400)

        """OCR 결과 리스트 전처리"""
        # 공백을 기준으로 단어 분리
        split_results = []
        for text in filtered_texts:
            split_results.extend(text.split())

        # 텍스트 정제
        ocr_results = clean_whisky_keywords(split_results)

        # 위스키 브랜드 키워드와 가장 유사한 단어로 대체
        corrected = correct_ocr_results(ocr_results, keyword_list)

        """가장 유사한 위스키 브랜드 찾기"""
        ocr_query = " ".join(corrected)

        # 모든 문서 리스트: [OCR 키워드] + [DB 위스키 리스트]
        corpus = [ocr_query] + whisky_list

        # TF-IDF 벡터화
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus)

        # 코사인 유사도 계산 (첫 번째는 OCR 쿼리)
        cos_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:])

        # 가장 유사한 결과 찾기
        most_similar_idx = np.argmax(cos_sim)
        most_similar_score = cos_sim[0][most_similar_idx]
        most_similar_whisky = whisky_list[most_similar_idx]

        return JSONResponse(content={
            "extracted_texts": corrected,
            "best_match": most_similar_whisky,
            "similarity_score": most_similar_score
        }, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)