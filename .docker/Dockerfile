FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build # Compiles TS to JS once

FROM node:20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.docker/entrypoint.sh ./.docker/entrypoint.sh

RUN chmod +x /usr/src/app/.docker/entrypoint.sh
ENTRYPOINT ["/usr/src/app/.docker/entrypoint.sh"]
