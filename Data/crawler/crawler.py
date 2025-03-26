import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import time
import random


def extract_whisky_info(item):
    """HTML 항목에서 위스키 정보 추출"""
    whisky_data = {}

    # 위스키 이름 추출
    name_elem = item.select_one('.title .marke')
    if name_elem:
        whisky_data['name'] = name_elem.text.strip()

    # 추가 이름 정보 추출
    name_zusatz = item.select_one('.title .namenszusatz')
    if name_zusatz and name_zusatz.text.strip():
        whisky_data['name_zusatz'] = name_zusatz.text.strip()

    # 상세 페이지 URL 추출
    link_elem = item.select_one('.title a')
    if link_elem:
        whisky_data['detail_url'] = link_elem.get('href')

    # 연령 추출
    age_elem = item.select_one('.info.age')
    if age_elem:
        whisky_data['age'] = age_elem.text.strip()

    # 알코올 도수 추출
    abv_elem = item.select_one('.info.abv')
    if abv_elem:
        whisky_data['abv'] = abv_elem.text.strip()

    # 평점 추출
    rating_elem = item.select_one('.rating-wrap a')
    if rating_elem:
        rating_text = rating_elem.text.strip()
        rating_match = re.search(r'(\d+\.\d+)', rating_text)
        if rating_match:
            whisky_data['rating'] = float(rating_match.group(1))

        # 평가 수 추출
        votes_match = re.search(r'\((\d+,?\d*)\)', rating_text)
        if votes_match:
            votes = votes_match.group(1).replace(',', '')
            whisky_data['votes'] = int(votes)

    # 테이스팅 노트 수 추출
    tasting_notes_elem = item.select_one('.rating-taste-comments-icon')
    if tasting_notes_elem and tasting_notes_elem.next_sibling:
        tasting_notes_text = tasting_notes_elem.next_sibling.strip()
        if tasting_notes_text.isdigit():
            whisky_data['tasting_notes_count'] = int(tasting_notes_text)

    # 이미지 URL 추출
    img_elem = item.select_one('.left img')
    if img_elem:
        whisky_data['image_url'] = img_elem.get('src')
        whisky_data['image_alt'] = img_elem.get('alt')

    return whisky_data


def crawl_whisky_pages(base_url, total_pages=50):
    """여러 페이지의 위스키 정보 크롤링"""
    all_whisky_data = []

    for page in range(1, total_pages + 1):
        try:
            url = f"{base_url}?page={page}"
            print(f"크롤링 중: {url}")

            response = requests.get(url, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            })
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            whisky_items = soup.select('.item.compact-panel')

            if not whisky_items:
                print(f"페이지 {page}에서 위스키 항목을 찾을 수 없습니다.")
                break

            for item in whisky_items:
                whisky_info = extract_whisky_info(item)
                if whisky_info:
                    all_whisky_data.append(whisky_info)

            print(f"페이지 {page}: {len(whisky_items)}개 항목 추출 완료")

            # 서버에 부담을 주지 않기 위한 대기 시간
            time.sleep(random.uniform(1.0, 3.0))

        except Exception as e:
            print(f"페이지 {page} 크롤링 중 오류 발생: {e}")

    return all_whisky_data


def save_to_csv(data, filename="whisky_data.csv"):
    """데이터를 CSV 파일로 저장"""
    df = pd.DataFrame(data)
    df.to_csv(filename, index=False, encoding='utf-8-sig')
    print(f"{len(data)}개 위스키 정보가 {filename}에 저장되었습니다.")
    return df


def crawl_from_html_file(html_file):
    """HTML 파일에서 위스키 정보 추출"""
    with open(html_file, 'r', encoding='utf-8') as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, 'html.parser')
    whisky_items = soup.select('.item.compact-panel')

    all_whisky_data = []
    for item in whisky_items:
        whisky_info = extract_whisky_info(item)
        if whisky_info:
            all_whisky_data.append(whisky_info)

    print(f"{len(all_whisky_data)}개 위스키 항목 추출 완료")
    return all_whisky_data


def main():
    # 사이트 크롤링 방식
    # base_url = "https://www.whisky.com/whisky-database/bottle-search.html?w_ratingCount_min=40#content-main"  # 실제 URL로 변경하세요
    # whisky_data = crawl_whisky_pages(base_url, total_pages=40)

    # 또는 HTML 파일에서 추출 방식
    whisky_data = crawl_from_html_file("whisky_page.html")

    # CSV 파일로 저장
    df = save_to_csv(whisky_data)

    # 데이터 미리보기
    print("\n데이터 미리보기:")
    print(df.head())

    # 기본 통계 확인
    print("\n기본 통계:")
    print(f"총 위스키 항목 수: {len(df)}")
    if 'rating' in df.columns:
        print(f"평균 평점: {df['rating'].mean():.2f}")
    if 'votes' in df.columns:
        print(f"평균 투표 수: {df['votes'].mean():.2f}")


if __name__ == "__main__":
    main()