# Overcord Databse

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](LICENSE)

Overcord is a discord server project based on the famous game Overwatch.

This repo is the database manager for the bot and the Overcord.space backend.

## Self host

Clone this repo

```shell
npm install
```
or
```shell
pnpm install
```

```sh
npm run dev
```
## Environment Variables

Edit .env.example => .env with your credentials

To run this project, you will need to add the following environment variables to your .env file

DEBUG=`debug env variable (can be overcord:*, see: https://github.com/debug-js/debug#environment-variables)`

DB_PATH=`path to sqlite db file`
DB_FILE=`name of sqlite db file`

## License

[MIT](LICENSE) © X3ne
