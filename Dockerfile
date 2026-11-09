# NEZU Kiosk · una sola imagen: el servidor en tiempo real sirve también la build del kiosko.
#
#   docker compose up -d --build
#
# La URL pública del teléfono se fija al construir (VITE_PHONE_URL); el resto se configura por variables de
# entorno al arrancar (ver .env.docker.example).

FROM node:22-alpine AS kiosk
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
ARG VITE_PHONE_URL
ENV VITE_PHONE_URL=$VITE_PHONE_URL
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci --omit=dev --no-audit --no-fund
COPY server ./server
COPY --from=kiosk /build/dist ./dist
RUN mkdir -p /app/data && chown -R node:node /app
USER node
ENV PORT=4000 STATIC_DIR=/app/dist DATA_DIR=/app/data
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD wget -qO- http://127.0.0.1:4000/health >/dev/null || exit 1
CMD ["node", "server/src/index.js"]
