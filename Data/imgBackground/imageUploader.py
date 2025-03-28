import os
import base64
import boto3
import psycopg2
import requests
import time
from PIL import Image
from io import BytesIO
from rembg import remove
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()


def connect_to_db():
    """PostgreSQL 데이터베이스 연결"""
    conn = psycopg2.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        port=os.environ.get('DB_PORT', '5432'),
        user=os.environ.get('DB_USER', 'postgres'),
        password=os.environ.get('DB_PASSWORD', ''),
        database=os.environ.get('DB_NAME', 'whisky_db')
    )
    return conn


def get_s3_client():
    """S3 클라이언트 생성"""
    return boto3.client(
        's3',
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
        region_name=os.environ.get('AWS_REGION', 'ap-northeast-2')
    )


def process_whisky_images(batch_size=10, output_folder="whisky_images_no_bg"):
    """
    DB에서 위스키 데이터를 가져와 이미지를 처리하고 S3에 업로드한 후 DB 업데이트

    Args:
        batch_size: 한 번에 처리할 위스키 개수
        output_folder: 로컬 저장 경로
    """
    # 출력 폴더 생성
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # DB 연결
    conn = connect_to_db()
    cursor = conn.cursor()

    # S3 클라이언트 설정
    s3_client = get_s3_client()
    bucket_name = os.environ.get('S3_BUCKET_NAME')

    if not bucket_name:
        raise ValueError("S3_BUCKET_NAME 환경 변수가 설정되지 않았습니다.")

    try:
        # 총 레코드 수 조회
        cursor.execute("SELECT COUNT(*) FROM whisky")
        total_records = cursor.fetchone()[0]
        print(f"총 {total_records}개의 위스키 데이터를 확인했습니다.")

        # 이미지가 있는 위스키 데이터 가져오기
        cursor.execute("""
            SELECT whisky_id, en_name, whisky_img
            FROM whisky
            WHERE whisky_img IS NOT NULL
            AND (
                whisky_img LIKE 'https://www.whisky.com/%' OR
                whisky_img LIKE 'data:image/%'
            )
            ORDER BY whisky_id
        """)

        whiskies = cursor.fetchall()
        print(f"이미지 처리가 필요한 위스키: {len(whiskies)}개")

        for i, (whisky_id, whisky_name, img_data) in enumerate(whiskies):
            print(f"\n처리 중: {i + 1}/{len(whiskies)} - {whisky_name} (ID: {whisky_id})")

            try:
                # 위스키 ID를 파일명에 사용 (중복 방지)
                # 이름에서 파일명으로 사용할 수 없는 문자 제거 후 ID 추가
                safe_name = ''.join(c if c.isalnum() or c in [' ', '_'] else '_' for c in whisky_name)
                safe_name = safe_name.replace(' ', '_')
                safe_name = f"{safe_name}_id{whisky_id}"  # 위스키 ID 추가

                # 로컬 파일 경로
                local_path = os.path.join(output_folder, f"{safe_name}.png")

                # S3 경로
                s3_key = f"whisky/images/{safe_name}.png"
                s3_url = f"https://{bucket_name}.s3.amazonaws.com/{s3_key}"

                # 이미지 로드
                input_img = None

                # Base64 인코딩된 이미지인지 확인
                if img_data.startswith('data:image/'):
                    try:
                        # Base64 데이터 추출
                        img_format, img_str = img_data.split(';base64,')
                        img_data = base64.b64decode(img_str)
                        input_img = Image.open(BytesIO(img_data))
                        print(f"Base64 이미지 로드 성공: {whisky_name}")
                    except Exception as e:
                        print(f"Base64 이미지 디코딩 실패: {str(e)}")
                        continue
                else:
                    # 일반 URL인 경우
                    try:
                        response = requests.get(img_data)
                        if response.status_code != 200:
                            print(f"오류: {img_data} 다운로드 실패 (상태 코드: {response.status_code})")
                            continue
                        input_img = Image.open(BytesIO(response.content))
                        print(f"URL 이미지 로드 성공: {whisky_name}")
                    except Exception as e:
                        print(f"URL 이미지 다운로드 실패: {str(e)}")
                        continue

                # 배경 제거
                output_img = remove(input_img)

                # 로컬에 결과 저장
                output_img.save(local_path)
                print(f"로컬에 저장 완료: {local_path}")

                # S3에 업로드
                buffer = BytesIO()
                output_img.save(buffer, format="PNG")
                buffer.seek(0)

                # S3에 업로드 - ACL 옵션 제거
                s3_client.upload_fileobj(
                    buffer,
                    bucket_name,
                    s3_key,
                    ExtraArgs={
                        'ContentType': 'image/png'
                    }
                )
                print(f"S3에 업로드 완료: {s3_url}")

                # DB 업데이트
                cursor.execute(
                    "UPDATE whisky SET whisky_img = %s WHERE whisky_id = %s",
                    (s3_url, whisky_id)
                )
                conn.commit()
                print(f"DB 업데이트 완료: 위스키 ID {whisky_id}")

                # 서버 부하 방지를 위한 짧은 대기
                time.sleep(0.5)

                # 일정 배치마다 진행 상황 보고
                if (i + 1) % batch_size == 0:
                    print(f"\n=== 진행 상황: {i + 1}/{len(whiskies)} 완료 ({((i + 1) / len(whiskies)) * 100:.1f}%) ===\n")

            except Exception as e:
                print(f"오류 발생: {whisky_name} (ID: {whisky_id}) 처리 중 - {str(e)}")
                conn.rollback()
                # 오류 발생 시 짧게 대기 후 계속 진행
                time.sleep(1)

        print("\n모든 위스키 이미지 처리가 완료되었습니다.")

    finally:
        cursor.close()
        conn.close()


def main():
    """메인 함수"""
    try:
        # 환경 변수 확인
        required_vars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_BUCKET_NAME',
                         'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']

        missing_vars = [var for var in required_vars if not os.environ.get(var)]

        if missing_vars:
            print(f"필요한 환경 변수가 설정되지 않았습니다: {', '.join(missing_vars)}")
            print("환경 변수를 설정하거나 .env 파일을 생성하세요.")
            return

        # 배치 크기 및 출력 폴더 설정
        batch_size = int(os.environ.get('BATCH_SIZE', 10))
        output_folder = os.environ.get('OUTPUT_FOLDER', 'whisky_images_no_bg')

        # 위스키 이미지 처리 실행
        process_whisky_images(batch_size, output_folder)

    except Exception as e:
        print(f"실행 중 오류 발생: {str(e)}")


if __name__ == "__main__":
    main()