FROM node:22-alpine

RUN apk add --no-cache tzdata

ENV TZ Asia/Tehran

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -P --verbose

COPY . .

ENV NODE_ENV production

RUN npm run build

CMD ["npm", "run", "start:prod"]
