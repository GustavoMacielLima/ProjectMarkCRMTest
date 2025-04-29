FROM node:22.14.0 as build

WORKDIR /mgpix-api

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

FROM node:22.14.0-alpine

# Install curl and add the CA certificate
RUN apk update && \
  apk add --no-cache curl ca-certificates && \
  mkdir -p /usr/local/share/ca-certificates && \
  curl https://certs.secureserver.net/repository/sf-class2-root.crt -o /usr/local/share/ca-certificates/sf-class2-root.crt && \
  update-ca-certificates

RUN apk add --no-cache tzdata && \
  cp /usr/share/zoneinfo/America/Sao_Paulo /etc/localtime && \
  echo "America/Sao_Paulo" > /etc/timezone && \
  apk del tzdata

COPY --from=build /mgpix-api/dist/ /app/dist/
COPY --from=build /mgpix-api/node_modules/ /app/node_modules/

WORKDIR /app/dist

EXPOSE 8080

CMD [ "npm", "run", "start:dev" ]
