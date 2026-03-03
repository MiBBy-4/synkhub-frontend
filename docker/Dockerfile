FROM node:22-alpine AS base-synkhub-frontend-image

RUN apk add --no-cache --update \
    bash \
    git

WORKDIR /app

FROM base-synkhub-frontend-image AS synkhub-frontend-development-image

COPY . ./

ENV PATH ./node_modules/.bin/:$PATH
