# Prisma

## The default database is postgress, with the command below I set it to be SQLite
npx prisma init --datasource-provider SQLite

## Create a migration
npx prisma migrate dev

## Create an ERD
npx prisma generate

## Prisma Studio
npx prisma studio

## If the error: the table not exists, use this command
npx prisma db push

## Run the seed
npx prisma db seed, after of course to have created the prisma command on package.json
