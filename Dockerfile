FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install prisma -g

RUN prisma generate

EXPOSE 3000

CMD ["npm", "start"]