FROM node:18-alpine

WORKDIR /auth-service

COPY . .

RUN npm ci --omit=dev

CMD [ "npm", "run", "start" ]