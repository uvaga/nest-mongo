# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS application with MongoDB integration using Mongoose ODM. The application demonstrates a basic user management system with authentication structure.

## Development Commands

```bash
# Install dependencies
npm install

# Development with hot-reload
npm run start:dev

# Standard development start
npm run start

# Debug mode with inspector
npm run start:debug

# Production build
npm run build

# Production start
npm run start:prod

# Linting
npm run lint

# Code formatting
npm run format

# Run unit tests
npm run test

# Watch mode for tests
npm run test:watch

# Test coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Debug tests
npm run test:debug
```

## Architecture

### Configuration Management

The application uses `@nestjs/config` for environment-based configuration following NestJS best practices:

- **ConfigModule** (`src/config/`): Global configuration module with validation
  - `database.config.ts`: Type-safe database configuration using `registerAs()`
  - `validation.schema.ts`: Joi validation schema for environment variables
  - Configuration is validated at startup, failing fast on misconfigurations

Environment variables are loaded from `.env` file (see `.env.example` for reference).

### Module Structure

The application follows NestJS modular architecture:

- **AppModule** (`src/app.module.ts`): Root module that imports ConfigModule, MongooseModule, and feature modules
  - ConfigModule is configured as global with validation
  - MongoDB connection uses `MongooseModule.forRootAsync()` for dependency injection of ConfigService
  - Imports feature modules like UsersModule

- **Feature Modules** (e.g., `src/users/users.module.ts`):
  - Self-contained modules with controllers, services, and schemas
  - Register Mongoose schemas using `MongooseModule.forFeature()`

### Mongoose Integration

Schemas are defined using the traditional Mongoose schema syntax (not decorators):

```typescript
// Example from src/users/schemas/users.schema.ts
export const UserSchema = new mongoose.Schema({
  field: { type: String, required: true }
});
```

Modules register schemas with a string name:
```typescript
MongooseModule.forFeature([{ name: 'Users', schema: UserSchema }])
```

Services inject models using the same string name:
```typescript
@InjectModel('Users') private readonly userModel: Model<User>
```

### Validation

Global validation is enabled in `src/main.ts` using `ValidationPipe` with security-focused options:
- `whitelist: true` - Strips properties not defined in DTOs
- `forbidNonWhitelisted: true` - Throws errors on unknown properties
- `transform: true` - Auto-transforms payloads to DTO types

DTOs use `class-validator` decorators for validation.

### Project Structure Pattern

```
src/
  main.ts                 # Application entry point with global pipes
  app.module.ts           # Root module with ConfigModule and MongooseModule
  config/                 # Configuration files
    database.config.ts    # Database configuration with registerAs()
    validation.schema.ts  # Joi validation schema
  [feature]/              # Feature modules (e.g., users)
    [feature].module.ts   # Feature module definition
    [feature].controller.ts
    [feature].service.ts
    schemas/              # Mongoose schemas
    dto/                  # Data Transfer Objects with validation
    interfaces/           # TypeScript interfaces for documents
```

## MongoDB Configuration

MongoDB connection uses async configuration with ConfigService in AppModule. Configuration is stored in environment variables:

```env
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=mongodb_user
DB_PASSWORD=mongodb_password
DB_NAME=auth-nest-db
```

**Important**: Never commit `.env` file to version control. Use `.env.example` as a template.

### Docker Setup

To start MongoDB via Docker:
```bash
cd docker
docker compose up -d
```

MongoDB data persists in `/docker/mongodb_data`.

Connection credentials in `.env` must match those in `docker/docker-compose.yml`.

## Important Notes

- The application uses older Mongoose schema syntax (not `@nestjs/mongoose` decorators)
- Model injection uses string-based names, not class-based tokens
- TSLint is used (deprecated but present in this codebase)
- Application port is configurable via `PORT` environment variable (default: 3000)
- Configuration validation happens at startup - application will fail fast with clear error messages if required environment variables are missing
