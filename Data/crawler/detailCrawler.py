import csv
import json
import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin


def scrape_whisky_details(url):
    print(f"Scraping: {url}")
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        # HTML 문자열로 직접 작업 - 주석을 보존하기 위해
        html_content = response.text

        # 일반적인 BeautifulSoup 파싱
        soup = BeautifulSoup(html_content, 'html.parser')

        # 기본 정보 추출
        data = {}
        data['url'] = url
        data['name'] = soup.select_one('h1 .marke').text.strip() if soup.select_one('h1 .marke') else ""
        if soup.select_one('h1 .alterEtikett'):
            age = soup.select_one('h1 .alterEtikett').text.strip()
            data['name'] += " " + age

        # 이미지 URL 추출
        img_element = soup.select_one('.image-slider-element img')
        if img_element:
            img_url = img_element.get('src')
            if img_url and not img_url.startswith(('http://', 'https://')):
                img_url = urljoin(url, img_url)
            data['image'] = img_url
        else:
            data['image'] = ""

        # 속성 데이터 추출
        properties = {}
        property_table = soup.select('#attributes tr')
        for row in property_table:
            label_element = row.select_one('label')
            if label_element:
                label = label_element.text.strip().replace(':', '')
                value_element = row.select_one('.value')
                value = value_element.text.strip() if value_element else ""
                properties[label] = value

        data['properties'] = properties

        # 평점 추출
        rating_text = None
        rating_element = soup.select_one('.bottle-rating a')
        if rating_element:
            rating_text = rating_element.get_text(strip=True)
            rating_match = re.search(r'^([\d.]+)', rating_text)
            if rating_match:
                data['overall_rating'] = rating_match.group(1)
            else:
                data['overall_rating'] = "0"
        else:
            data['overall_rating'] = "0"

        # 리뷰 수 추출
        if rating_element:
            votes_text = rating_element.text.strip()
            votes_match = re.search(r'\((\d+,?\d*)\)', votes_text)
            if votes_match:
                votes = votes_match.group(1).replace(',', '')
                data['Number of Rating'] = votes

        # 테이스팅 노트 수 추출
        tasting_notes_element = soup.select_one('.rating-taste-comments-icon')
        if tasting_notes_element and tasting_notes_element.next_sibling:
            notes_text = tasting_notes_element.next_sibling.strip()
            data['tasting_notes_count'] = notes_text

        # 테이스팅 통계 추출 - 다른 접근 방식 시도
        tasting_statistics = {
            'nosing': {},
            'tasting': {},
            'finish': {}
        }

        # HTML 내용에서 테이스팅 노트 부분을 찾아서 파싱
        # 모든 테이스팅 노트 항목을 그룹별로 직접 추출
        for section in ['nosing', 'tasting', 'finish']:
            # 해당 섹션의 HTML 부분 찾기 (raw 문자열 사용)
            section_match = re.search(
                r'<div class="col-md-4 group-divider group group-' + section + r'".*?</div>\s*</div>\s*</div>',
                html_content, re.DOTALL)
            if section_match:
                section_html = section_match.group(0)

                # 각 항목 찾기 (보이는 항목과 숨겨진 항목 모두) (raw 문자열 사용)
                item_pattern = r'<div class="item tasteicon-statistic.*?">.*?<div class="title left">\s*(.*?):\s*</div>.*?<!-- Rating: ([\d.]+) -->'
                item_matches = re.finditer(item_pattern, section_html, re.DOTALL)

                for item_match in item_matches:
                    flavor = item_match.group(1).strip()
                    rating = item_match.group(2).strip()
                    tasting_statistics[section][flavor] = rating

        # 결과 확인 및 디버깅
        if all(len(section) == 0 for section in tasting_statistics.values()):
            print("경고: 모든 테이스팅 섹션이 비어 있습니다.")

            # Laphroaig 페이지의 경우 다음과 같은 구조일 수 있음
            # 각 섹션 개별로 다른 패턴 시도
            nosing_items = soup.select('.group-nosing .tasteicon-statistic')
            tasting_items = soup.select('.group-tasting .tasteicon-statistic')
            finish_items = soup.select('.group-finish .tasteicon-statistic')

            print(f"발견된 항목 수: nosing={len(nosing_items)}, tasting={len(tasting_items)}, finish={len(finish_items)}")

            # 각 섹션의 항목 추출 시도
            for section, items in [('nosing', nosing_items), ('tasting', tasting_items), ('finish', finish_items)]:
                for item in items:
                    title_elem = item.select_one('.title')
                    if title_elem:
                        flavor = title_elem.text.strip().replace(':', '')

                        # HTML 문자열에서 이 항목과 관련된 주석 찾기
                        item_html = str(item)
                        rating_match = re.search(r'<!-- Rating: ([\d.]+) -->', item_html)
                        if rating_match:
                            rating = rating_match.group(1)
                            tasting_statistics[section][flavor] = rating

            # 두 번째 방법도 실패한 경우 더 단순한 접근 방식 시도
            if all(len(section) == 0 for section in tasting_statistics.values()):
                print("두 번째 방법도 실패. 세 번째 방법을 시도합니다.")

                # 원본 HTML에서 모든 주석을 추출
                all_comments = re.findall(r'<!--(.*?)-->', html_content, re.DOTALL)
                rating_comments = [comment for comment in all_comments if 'Rating:' in comment]
                print(f"발견된 Rating 주석 수: {len(rating_comments)}")

                # 각 섹션에서 모든 테이스팅 노트 항목 찾기
                for section_name in ['nosing', 'tasting', 'finish']:
                    section_elem = soup.select_one(f'.group-{section_name}')
                    if section_elem:
                        # 해당 섹션의 모든 항목 선택
                        items = section_elem.select('.tasteicon-statistic')
                        for item in items:
                            title_elem = item.select_one('.title')
                            if title_elem:
                                flavor = title_elem.text.strip().replace(':', '')

                                # 직접 HTML 텍스트에서 주석 찾기
                                item_str = str(item)
                                for comment in rating_comments:
                                    if f'<!-- Rating: ' in comment and item_str in html_content:
                                        match_idx = html_content.find(item_str)
                                        if match_idx >= 0:
                                            # 해당 항목 근처에서 Rating 주석 찾기
                                            item_context = html_content[
                                                           match_idx:match_idx + 1000]  # 항목 이후 1000자 정도 살펴보기
                                            rating_match = re.search(r'<!-- Rating: ([\d.]+) -->', item_context)
                                            if rating_match:
                                                rating = rating_match.group(1)
                                                tasting_statistics[section_name][flavor] = rating
                                                break

        data['tasting_statistics'] = tasting_statistics

        # 설명 추출
        description_element = soup.select_one('.description p')
        if description_element:
            properties['description'] = description_element.text.strip()

        return data

    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return {"url": url, "error": str(e)}


def main():
    input_file = 'whisky_data.csv'
    output_file = 'whisky_details.json'

    all_whisky_data = []

    # 테스트용: 단일 URL에서 데이터 스크래핑
    # test_url = "https://www.whisky.com/whisky-database/details/laphroaig.html"
    # whisky_data = scrape_whisky_details(test_url)
    # all_whisky_data.append(whisky_data)

    # 실제 CSV 파일 처리
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if 'detail_url' in row and row['detail_url']:
                whisky_data = scrape_whisky_details(row['detail_url'])
                all_whisky_data.append(whisky_data)
                # 웹사이트에 부하를 주지 않기 위한 딜레이
                time.sleep(2)

    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_whisky_data, f, ensure_ascii=False, indent=4)

    print(f"Completed! Data saved to {output_file}")


if __name__ == "__main__":
    main()