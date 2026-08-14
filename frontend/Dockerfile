# ---- Build stage ----
FROM node:22-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Vite bakes environment variables into the JS bundle at BUILD time,
# not at container runtime -- so this has to be a build ARG, not a
# docker-compose `environment:` entry (that would have no effect).
# It must be a URL the *browser* can reach, since this code runs in
# the user's browser, not inside the Docker network -- so it points
# at the backend's published host port, not the internal service
# name.
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ---- Serve stage ----
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
