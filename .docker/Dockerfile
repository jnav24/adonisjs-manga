FROM oven/bun:latest AS builder
WORKDIR /usr/src/app
COPY package.json bun.lockb ./
RUN bun install
COPY . .
RUN bun run build # Compiles TS to JS once

FROM oven/bun:latest
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/.docker/entrypoint.sh ./.docker/entrypoint.sh

RUN chmod +x /usr/src/app/.docker/entrypoint.sh
ENTRYPOINT ["/usr/src/app/.docker/entrypoint.sh"]
