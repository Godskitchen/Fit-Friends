# Fit-Friends

Docker:

- Compose:

docker compose --env-file ./app.env --file ./docker-compose.dev.yml --project-name="fit-friends" up -d



Prisma:

- format:

npx prisma format --schema=./libs/database-service/src/lib/models/schema.prisma

- generate:

npx prisma generate --schema=./libs/database-service/src/lib/models/schema.prisma

- update:

npx prisma db push --schema=./libs/database-service/src/lib/models/schema.prisma

- reset:

npx prisma migrate reset --schema=./libs/database-service/src/lib/models/schema.prisma

- seed:

npx prisma db seed