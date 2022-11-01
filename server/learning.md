# Prisma

## The default database is postgress, with the command below I set it to be SQLite
npx prisma init --datasource-provider SQLite

## Create a migration
npx prisma migrate dev

## Create an ERD
npx prisma generate

## Prisma Studio
npx prisma studio
