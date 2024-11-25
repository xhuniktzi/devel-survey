# Survey Management API

![NestJS Logo](https://nestjs.com/img/logo-small.svg)

A progressive **Node.js** framework built with **NestJS**, designed for creating efficient and scalable server-side applications.

[![NPM Version](https://img.shields.io/npm/v/@nestjs/core.svg)](https://www.npmjs.com/~nestjscore)
[![Package License](https://img.shields.io/npm/l/@nestjs/core.svg)](https://www.npmjs.com/~nestjscore)
[![NPM Downloads](https://img.shields.io/npm/dm/@nestjs/common.svg)](https://www.npmjs.com/~nestjscore)
[![CircleCI](https://img.shields.io/circleci/build/github/nestjs/nest/master)](https://circleci.com/gh/nestjs/nest)
[![Coverage](https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9)](https://coveralls.io/github/nestjs/nest?branch=master)
[![Discord](https://img.shields.io/badge/discord-online-brightgreen.svg)](https://discord.gg/G7Qnnhy)
[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
[![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)
[![Support us](https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg)](https://opencollective.com/nest#sponsor)

---

## Description

A full-stack application API to manage surveys, built using the [NestJS](https://nestjs.com) framework.

---

## Features

- Survey CRUD operations.
- User authentication with JWT.
- Save and fetch survey responses.
- API documentation using Swagger.
- Database interactions managed with Prisma ORM.

---

## Project Setup

### Install Dependencies

```bash
npm install --save --save-dev
```

### Configure Environment Variables

Create a `.env` file in the root directory of your project and configure the necessary environment variables.

### Database Setup

Run the following commands to set up the database and seed initial data:

```bash
npm run prisma:deploy
npm run prisma:generate
npm run prisma:seed
```

### Build and Start the Application

Compile the application and start it in production mode:

```bash
npm run build
npm run start:prod
```

---

## Development Mode

For development purposes, use the following commands:

```bash
# Watch mode
npm run start:dev
```

---

## Testing

Run tests using the following commands:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

---

## API Documentation

Once the application is running, the API documentation can be accessed at `/api`.

---

## Resources

- Official NestJS Documentation: [docs.nestjs.com](https://docs.nestjs.com)
- Swagger API Documentation: `/api`
- Database Management: [Prisma](https://www.prisma.io)

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
