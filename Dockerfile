FROM node:4.6.0

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app
ADD . /usr/src/app

RUN npm install

EXPOSE 8080

CMD ["npm", "start"]
