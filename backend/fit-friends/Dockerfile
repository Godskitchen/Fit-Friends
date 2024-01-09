FROM node:18.18-slim
RUN apt-get update && apt-get install -y openssl libssl-dev

WORKDIR /opt/fit-friends
COPY ./dist/apps/fit-friends/package.json .
COPY ./app.prod.env ./app.env
RUN npm install --omit=dev

COPY ./dist/apps/fit-friends/lib/models/schema.prisma ./schema.prisma
RUN npx prisma generate --schema schema.prisma

COPY ./dist/apps/fit-friends .
CMD [ "node", "./main.js" ]