# Сборка backend

Перейти в директорию fit-friends-project/backend/fit-friends
Создать файл app.prod.env (можно воспользоваться app.prod.env.example)
выполнить скрипт npm run buildImage

```bash
npm run buildImage
```

дождаться окончания сборки и создания образа
после этого выполнить

```bash
docker compose --env-file ./app.prod.env -f ./docker-compose.yml up -d
```
