import json
import os
import requests
from PIL import Image
from io import BytesIO
from rembg import remove
import time


def process_whisky_data(json_data, output_folder="whisky_images_no_bg"):
    """
    위스키 데이터에서 이미지 URL을 추출하고 배경을 제거하여 저장합니다.

    Args:
        json_data (str/list): JSON 형식의 위스키 데이터 또는 파싱된 리스트
        output_folder (str): 결과 이미지를 저장할 폴더 경로
    """
    # 출력 폴더가 없으면 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # JSON 문자열을 파이썬 객체로 변환 (이미 리스트라면 그대로 사용)
    if isinstance(json_data, str):
        whisky_list = json.loads(json_data)
    else:
        whisky_list = json_data

    print(f"총 {len(whisky_list)}개의 위스키 이미지를 처리합니다.")

    for index, whisky in enumerate(whisky_list):
        # 진행 상황 표시
        print(f"처리 중: {index + 1}/{len(whisky_list)} - {whisky['name']}")

        try:
            # 이미지 URL 추출
            image_url = whisky.get('image')
            if not image_url:
                print(f"경고: {whisky['name']}에 이미지 URL이 없습니다. 건너뜁니다.")
                continue

            # 이름에서 파일명으로 사용할 수 없는 문자 제거
            safe_name = ''.join(c if c.isalnum() or c in [' ', '_'] else '_' for c in whisky['name'])
            safe_name = safe_name.replace(' ', '_')
            output_path = os.path.join(output_folder, f"{safe_name}.png")

            # 이미 처리된 이미지는 건너뜁니다
            if os.path.exists(output_path):
                print(f"이미 처리됨: {output_path}")
                continue

            # URL에서 이미지 다운로드
            response = requests.get(image_url)
            if response.status_code != 200:
                print(f"오류: {image_url} 다운로드 실패 (상태 코드: {response.status_code})")
                continue

            # 이미지 로드 및 배경 제거
            input_img = Image.open(BytesIO(response.content))
            output_img = remove(input_img)

            # 결과 저장
            output_img.save(output_path)
            print(f"저장 완료: {output_path}")

            # 서버에 과부하를 주지 않기 위해 잠시 대기
            time.sleep(1)

        except Exception as e:
            print(f"오류 발생: {whisky.get('name', '알 수 없음')} 처리 중 - {str(e)}")

    print("모든 이미지 처리가 완료되었습니다.")


# 사용 예시:
if __name__ == "__main__":
    # 파일에서 JSON 데이터 불러오기
    with open("whisky_details.json", "r", encoding="utf-8") as file:
        whisky_data = json.load(file)

    # 배경 제거 처리 실행
    process_whisky_data(whisky_data)

    # 또는 단일 이미지만 처리하고 싶을 때:
    # url = "https://www.whisky.com/fileadmin/_processed_/d/9/csm_0_c4c456_lagav1600_aw_7a3c1490b0.jpg"
    # response = requests.get(url)
    # input_img = Image.open(BytesIO(response.content))
    # output_img = remove(input_img)
    # output_img.save("lagavulin_no_bg.png")
    # print("배경이 제거된 이미지가 저장되었습니다.")