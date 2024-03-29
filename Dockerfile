FROM node:16.15.0-alpine

ENV PORT=3000
ENV NODE_ENV=production

RUN mkdir -p /usr/src/front-end
RUN mkdir -p /usr/src/back-end

WORKDIR /usr/src/front-end
COPY ./front-end/package*.json /usr/src/front-end/
RUN NODE_ENV=development npm install
COPY ./front-end/ /usr/src/front-end

WORKDIR /usr/src/back-end
COPY ./back-end/package*.json /usr/src/back-end/
RUN NODE_ENV=development npm install
COPY ./back-end/ /usr/src/back-end

WORKDIR /usr/src/front-end
RUN npx quasar build

WORKDIR /usr/src/back-end
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
