from io import BytesIO

from fastapi import FastAPI, File, UploadFile
import easyocr
import numpy as np
import cv2
from fastapi.responses import JSONResponse
from fuzzywuzzy import process, fuzz
import re

app = FastAPI()
ocr = easyocr.Reader(['en'])

# 중복 제거한 위스키 브랜드 리스트 로드 (서버 실행 시 한 번만 실행)
with open("whisky_distilleries.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()

# 앞 번호 제거하고 리스트로 저장
whisky_list = [re.sub(r"^\d+\.\s*", "", line.strip()) for line in lines]
whisky_list.sort()


def preprocess_image(image):
    """ 이미지 전처리 함수 """
    image = cv2.imdecode(np.frombuffer(image, np.uint8), cv2.IMREAD_COLOR)
    # 1️⃣ Grayscale 변환
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # 2️⃣ 노이즈 제거 → Median Blur 적용 (경계 유지)
    blurred = cv2.medianBlur(gray, 3)
    # 3️⃣ Adaptive 또는 Otsu's Thresholding 적용 : 텍스트 뚜렷하게
    _, binary = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    # Morphological Operations
    kernel = np.ones((3, 3), dtype=np.float64) / 9
    dst = cv2.morphologyEx(binary, cv2.MORPH_CLOSE, kernel)
    return dst


@app.post("/ocr/")
async def perform_ocr(file: UploadFile = File(...)):
    """ OCR 실행 API """
    try:
        # 파일을 BytesIO에 저장하여 여러 번 읽을 수 있도록 함
        file_bytes = await file.read()
        file_buffer = BytesIO(file_bytes)

        # 이미지 전처리
        processed_img = preprocess_image(file_bytes)

        # OCR 실행
        results = ocr.readtext(processed_img)

        # OCR 결과가 정상적으로 추출되었는지 확인
        if not results:
            return JSONResponse(content={"error": "OCR 결과가 없습니다."}, status_code=400)

        # confidence 값 필터링 (예: 신뢰도 50% 이하 결과 제외)
        filtered_results = [text for (_, text, confidence) in results if confidence>0.5]
        print(filtered_results)

        # 가장 유사한 위스키 브랜드 찾기 (문자열 단어 순서 무시)
        best_match, score = process.extractOne(" ".join(filtered_results), whisky_list, scorer=fuzz.token_sort_ratio)

        return JSONResponse(content={
            "extracted_texts": filtered_results,
            "best_match": best_match,
            "similarity_score": score
        }, status_code=200)

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)
