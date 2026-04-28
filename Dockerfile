FROM python:3.12-slim

RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY calendar-booking/backend/ backend/
COPY calendar-booking/frontend/ frontend/

RUN pip install --no-cache-dir -r backend/requirements.txt

RUN cd frontend && npm ci && npm run build && \
    cp -r dist ../backend/dist

WORKDIR /app/backend

ENV PORT=8000

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
