FROM node:18-alpine

WORKDIR /auth-service

COPY . .

COPY .env-example .env

# TODO: get from env vars
ENV DB_URL=mongodb://user:pass@mongodb:27017/authDB
ENV NODE_ENV=production

RUN npm ci --production

CMD [ "npm", "run", "start" ]