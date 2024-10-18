FROM node:20.11.1-slim

WORKDIR /app

COPY . /app

RUN npm install && \
    npm run build

EXPOSE 5173

ENTRYPOINT ["npm", "run", "start"]
