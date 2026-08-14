FROM python:3.12-slim

WORKDIR /app

# Build tools needed to compile a couple of requirements.txt entries
# (e.g. psycopg2-binary's transitive deps on some platforms); removed
# from the final image is not worth the complexity here since this
# is a single-stage build -- kept slim by using python:*-slim as the
# base instead of the full python image.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# torch has no CPU/CUDA distinction on PyPI's default index, so a
# plain `pip install torch` pulls the CUDA build (multi-GB) even on a
# machine with no GPU. Installing it explicitly from PyTorch's CPU
# wheel index first keeps the image several GB smaller and the build
# significantly faster -- the subsequent requirements.txt install
# then finds torch already satisfied and skips it.
RUN pip install --no-cache-dir --break-system-packages \
    torch --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir --break-system-packages -r requirements.txt

COPY . .

# Persisted via a named volume in docker-compose.yml -- without this,
# uploaded files vanish every time the container is recreated.
RUN mkdir -p /app/uploads

EXPOSE 8000

COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
