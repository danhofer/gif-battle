FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node","index.js"]

# https://nodejs.org/de/docs/guides/nodejs-docker-webapp/

# build the docker image
# docker build -t gif-game-server .

# run container with
# docker run -p 8080:8080 -d gif-game-server