FROM node:18-alpine

WORKDIR /auth-service

COPY . .

COPY .env-example .env

RUN npm ci --production

CMD [ "npm", "run", "start" ]