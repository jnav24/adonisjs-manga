FROM oven/bun:latest

WORKDIR /usr/src/app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN chmod +x /usr/src/app/.docker/entrypoint.sh

ENTRYPOINT ["/usr/src/app/.docker/entrypoint.sh"]
