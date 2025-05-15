FROM node:20.19.2-alpine
RUN mkdir /app
WORKDIR app
COPY back back/
COPY front front/
COPY package.json .
EXPOSE 3000
RUN npm i
RUN npm run build -w back
RUN npm run build -w front
