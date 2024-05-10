FROM python:3.12.2-slim AS retrochat_web_base

# ===============================

# PREPARE THE FRONTEND
WORKDIR /app

# Copy frontend files
COPY client/src client/src
COPY client/package.json client/package.json
COPY client/yarn.lock client/yarn.lock
COPY client/vite.config.js client/vite.config.js

# Install dependencies for Yarn
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn

# Build the frontend
WORKDIR /app/client
RUN yarn install
RUN yarn build


# ===============================

# PREPARE THE BACKEND
WORKDIR /app

# Copy backend files
COPY server/requirements/prod.txt server/requirements.txt
COPY server/retrochat server/retrochat

# Build the backend
RUN pip install -r server/requirements.txt

# Run the backend
CMD PYTHONPATH=/app/server python -m retrochat.main

### Build a fat docker image containing redis.
# This is not a best practice, as it includes multiple
# services in one image.
FROM retrochat_web_base AS retrochat_web_fat

RUN apt-get update && apt-get install -y redis-server supervisor && \
    rm -rf /var/lib/apt/lists/*
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
EXPOSE 8000
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
