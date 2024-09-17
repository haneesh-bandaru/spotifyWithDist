FROM node:18

WORKDIR /app/v1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE  8000

CMD ["node", "server.js"]