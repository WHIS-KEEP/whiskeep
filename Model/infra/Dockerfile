### 1️⃣ Builder Stage
FROM python:3.10-slim AS builder

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY ../requirements.txt .
RUN pip install --upgrade pip && \
    pip install --prefix=/install --no-cache-dir -r requirements.txt

COPY ../ocr.py .
COPY ../cleaned_whisky_keywords.txt .
COPY ../unique_whisky_name_list.txt .

### 2️⃣ Runtime Stage
FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=builder /install /usr/local
COPY --from=builder /app /app

CMD ["uvicorn", "ocr:app", "--host", "0.0.0.0", "--port", "8000"]
