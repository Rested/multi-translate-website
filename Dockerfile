FROM node:13.8 as builder

WORKDIR /code
COPY ./ ./

RUN yarn && yarn build

FROM nginx

COPY --from=builder /code/build/  /usr/share/nginx/html