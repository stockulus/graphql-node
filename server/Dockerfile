FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package-lock.json /usr/src/app/
COPY package.json /usr/src/app/
RUN npm ci --production

COPY . /usr/src/app

ENTRYPOINT ["npm", "start"]