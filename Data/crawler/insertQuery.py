import json
import psycopg2
import re
from psycopg2.extras import execute_values

# 데이터베이스 연결 설정 실제 값을 넣으세요
conn = psycopg2.connect(
    dbname="",
    user="",
    password="",
    host="",
    port=""
)
cur = conn.cursor()

# 메인 카테고리 정의 (정해진 기준)
main_categories = {
    "fruity": ["Fruit", "Berries", "Pineapple", "Apple", "Grape", "Plum", "Banana",
               "Green Apple", "Blackberry", "Coconut", "Melon", "Pear", "Cherry",
               "Peach", "Kiwi", "Tropical Fruit", "Black Currant", "Red Currant", "Strawberry",
               "Zitrus", "Lemon", "Orange", "Lime", "Grapefruit", "Lemon Peel","Anis"],

    "sweet": ["Sweet", "Vanilla", "Chocolate", "Caramel", "Honey", "Cake",
              "Sherry", "Dried Fruit", "Raisin", "Date", "Fig"],

    "spicy": ["Spices", "Pepper", "Ginger", "Nutmeg", "Clove", "Cinnamon", "Chili",
              "Peat Smoke", "Medicinal Smoke", "Ham", "Bonfire Smoke", "Alcohol"],

    "oaky": ["Malt", "Barley", "Wheat", "Rye", "Oak",
             "Nuts", "Walnut", "Hazelnut", "Oil", "Almonds"],

    "herbal": ["Herbs", "Herb", "Grass", "Heather", "Hay", "Floral", "Mint",
               "Coffee", "Dark Chocolate", "Leather", "Tobacco"],

    "briny": ["Salt", "Iodine", "Seaweed", "Maritime Notes"]
}

# JSON 파일 로드
with open('whisky_details.json', 'r', encoding='utf-8') as f:
    whisky_data = json.load(f)

# 데이터 삽입을 위한 리스트 생성
whisky_records = []

for whisky in whisky_data:
    # 기본 필드 추출
    en_name = whisky['name']
    ko_name = en_name  # 한국어 이름이 없으므로 영어 이름으로 대체
    description = whisky['properties'].get('description', None)
    whisky_img = whisky.get('image', None)

    # 추가 속성 추출
    type_val = whisky['properties'].get('Type', None)
    distillery = whisky['properties'].get('Distillery', None)

    # 국가 정보 추출 (쉼표로 구분된 경우 처리)
    country_region = whisky['properties'].get('Country, Region', '')
    country = country_region.split(',')[0] if ',' in country_region else country_region

    # ABV 값 추출 및 변환 (퍼센트 기호 제거)
    abv_str = whisky['properties'].get('ABV', None)
    abv = float(abv_str.replace('%', '')) if abv_str else None

    # 나이 정보 추출 및 변환 (숫자만 추출)
    age_str = whisky['properties'].get('Age', None)
    age = None
    if age_str:
        age_match = re.search(r'(\d+)', age_str)
        if age_match:
            age = int(age_match.group(1))

    # 카테고리별 맛 데이터 처리
    taste_data = {"nosing": {}, "tasting": {}, "finish": {}}

    if 'tasting_statistics' in whisky:
        for phase in ['nosing', 'tasting', 'finish']:
            if phase in whisky['tasting_statistics']:
                # 각 메인 카테고리에 대한 빈 구조 초기화
                for main_cat in main_categories:
                    taste_data[phase][main_cat] = {
                        "score": None,
                        "data": {}
                    }

                # 실제 데이터 분류
                for flavor, value in whisky['tasting_statistics'][phase].items():
                    # 어떤 메인 카테고리에 속하는지 결정
                    found = False
                    for main_cat, flavors in main_categories.items():
                        if flavor in flavors:
                            taste_data[phase][main_cat]["data"][flavor] = float(value)
                            found = True
                            break

                    # 카테고리에 없는 맛 요소는 무시
                    if not found:
                        print(f"카테고리에 포함되지 않은 맛 요소: {flavor}")

    # 테이스팅 노트를 JSON으로 변환
    nosing = json.dumps(taste_data["nosing"]) if taste_data["nosing"] else None
    tasting = json.dumps(taste_data["tasting"]) if taste_data["tasting"] else None
    finish = json.dumps(taste_data["finish"]) if taste_data["finish"] else None

    # 레코드 추가
    whisky_records.append((
        en_name, ko_name, description, whisky_img, type_val,
        distillery, country, abv, age,
        tasting, nosing, finish
    ))

# 데이터 삽입
insert_query = """
INSERT INTO whisky 
(en_name, ko_name, description, whisky_img, type, distillery, country, abv, age, tasting, nosing, finish)
VALUES %s
RETURNING whisky_id
"""

try:
    execute_values(cur, insert_query, whisky_records)
    conn.commit()
    print(f"{len(whisky_records)}개의 위스키 데이터가 성공적으로 삽입되었습니다.")
except Exception as e:
    conn.rollback()
    print(f"오류 발생: {e}")

# 연결 종료
cur.close()
conn.close()