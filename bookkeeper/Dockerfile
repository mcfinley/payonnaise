FROM node:latest

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
COPY migrations ./migrations

RUN npm install

EXPOSE $BOOKKEEPER_PORT
CMD ["npm", "start"]
