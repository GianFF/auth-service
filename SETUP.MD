## Project setup
- `nvm use`
- `npm ci`

## Locall DB Setup
You can startup the DB using a Docker image as follows:
* `docker build -f Dockerfile.mongoDB . -t authmongodb`
* `docker run --publish 27017:27017 authmongodb`

## Locall Server Setup
* `npm run serve`

## App setup with Docker
* `docker compose -f docker-compose.yml up --build`


