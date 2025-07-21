FROM node:20-alpine As builder
# FROM node:20.18.1-alpine3.19 as builder
ADD client/package.json /temp/package.json
#ADD package-lock.json /temp/package-lock.json
RUN set -xe; \
    cd /temp ; \
    rm -f package-lock.json; \
    npm install --verbose --legacy-peer-deps
COPY ./client /src
# 拉取代码并打包
RUN cd /src ; \
    if [ -d "node_modules" ]; then rm -rf node_modules; fi;\
    mv /temp/node_modules /src/node_modules;\
    export NODE_OPTIONS="--openssl-legacy-provider";\
    npm run build;
# nginx
FROM nginx:1.25-alpine As server
# 将打包结果复制到nginx
COPY --from=builder /src/build /usr/share/nginx/html
COPY http.conf /etc/nginx/conf.d/http.conf
COPY nginx.conf /etc/nginx/nginx.conf
# 设置入口并禁用缺省配置文件
RUN mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled;

EXPOSE 80
ENTRYPOINT nginx -g "daemon off;"

