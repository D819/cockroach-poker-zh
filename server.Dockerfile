FROM node:20 as base

WORKDIR /home/node/app

# Default environment (build + run time)
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
EXPOSE 4000

# App and dev dependencies, and source
COPY . .
RUN yarn add patch-package -W
RUN yarn install --production=false

# Build step for production
FROM base
RUN NODE_OPTIONS=--openssl-legacy-provider yarn build

# Prune dev dependencies, modules ts files, yarn cache after build
RUN yarn install --production && \
    yarn autoclean --init && \
    echo *.ts >> .yarnclean && \
    yarn autoclean --force && \
    yarn cache clean

# run file
CMD ["node", "server/build/server/src"]
