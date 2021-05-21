FROM node:current
WORKDIR /app
COPY package.json .
RUN npm install --quiet
COPY . .