FROM node:15.13-alpine

WORKDIR /front

COPY ./projet/package.json .

RUN npm install

COPY ./projet .

CMD ["npm","run", "start"]