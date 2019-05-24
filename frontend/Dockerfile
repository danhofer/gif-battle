FROM node:9.11.1
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
# COPY package*.json ./
COPY . /usr/src/app
RUN npm install
# CMD ["npm", "start"]
RUN npm run-script build
RUN npm install -g serve
CMD ["serve","-s","build"]

# build the docker image
# docker build -t react-gif-game .

# run container with
# docker run -p 80:5000 -d react-gif-game