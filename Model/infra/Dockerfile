FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ../requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ../ocr.py .
COPY ../cleaned_whisky_keywords.txt .
COPY ../unique_whisky_name_list.txt .

CMD ["uvicorn", "ocr:app", "--host", "0.0.0.0", "--port", "8000"]