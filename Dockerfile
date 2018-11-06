# Build
FROM node:10.10 AS build-deps
LABEL maintainer="datapunt@amsterdam.nl"

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
      netcat \
      git && \
    rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json /app/

# Install all NPM dependencies. Also:
#  * Changing git URL because network is blocking git protocol...
#  * Using `CYPRESS_INSTALL_BINARY` to skip installing Cypress for it is not used here
RUN git config --global url."https://".insteadOf git:// && \
    git config --global url."https://github.com/".insteadOf git@github.com: && \
    CYPRESS_INSTALL_BINARY=0 \
    npm --production=false \
        --unsafe-perm \
        --verbose \
        --registry=https://repo.datapunt.amsterdam.nl/repository/npm-group/ \
        install && \
    npm cache clean --force

# Build dependencies
COPY src /app/src
COPY modules /app/modules
COPY public /app/public
COPY scripts /app/scripts
COPY .babelrc \
      webpack.* \
      index.ejs \
      favicon.png \
      /app/

ENV NODE_ENV=production
ARG BUILD_ENV=prod
RUN npm run build-${BUILD_ENV}
RUN echo "build= `date`" > /app/dist/version.txt

# Test dependencies
COPY karma.conf.js \
     jest.config.js \
     /app/
COPY test /app/test


# Web server image
FROM nginx:1.12.2-alpine
ARG BUILD_ENV=prod
COPY nginx-${BUILD_ENV}.conf /etc/nginx/nginx.conf
COPY --from=build-deps /app/dist /usr/share/nginx/html
