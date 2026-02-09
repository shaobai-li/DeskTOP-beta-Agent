# 后端镜像（Python slim 瘦身）
FROM python:3.12-slim

WORKDIR /app

# 先装 CPU 版 PyTorch（避免默认带 CUDA 的 ~2.5GB 体积），再装其余生产依赖
COPY requirements-prod.txt .
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements-prod.txt

# 应用代码（database/ 由 .dockerignore 排除，运行时通过卷挂载）
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
