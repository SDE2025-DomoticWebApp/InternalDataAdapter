# Internal Data Adapter

## Overview

Central data persistence layer providing RESTful API for managing users, sensors, and measurements using SQLite. Acts as the single source of truth for application data.

**Port:** 3001 | **Auth Required:** No (internal service)

## Architecture Position

```
Business Logic Layer (AuthService, RegistrationService, AggregatorService)
                              ↓
                  Internal Data Adapter (THIS SERVICE)
                              ↓
                      SQLite Database
```

## Database Schema

**users**: `email` (PK), `name`, `surname`, `password_hash`

**sensors**: `id` (PK), `user_email` (FK), `type` (temperature/humidity/wind), `name`, `url` (unique)

**measures**: `id` (PK), `sensor_id` (FK), `timestamp`, `value` (JSON string)

*Foreign keys cascade on delete*

## API Endpoints

### Users
- `POST /users` - Create user (email, name, surname, passwordHash)
- `GET /users/:email` - Get user by email

### Sensors
- `POST /sensors` - Create sensor (userEmail, type, name, url)
- `GET /sensors/:id` - Get sensor by ID
- `GET /sensors/by-url/:url` - Get sensor by URL
- `GET /sensors?userEmail=...` - Get all sensors for user
- `DELETE /sensors/:id` - Delete sensor

### Measures
- `POST /measures` - Add measure (sensorId, value:{<sensorType>:number}, timestamp?)
- `GET /measures/sensor/:sensorId` - Get all measures
- `GET /measures/sensor/:sensorId/latest` - Get latest measure
- `GET /measures/sensor/:sensorId/range?from=...&to=...` - Get measures in range

### Health
- `GET /health` - Service health check

## Quick Start

```bash
npm install
npm run dev  # Development mode (port 3001)
```

## Tech Stack

Node.js, Express.js, better-sqlite3

## Service Dependencies

**Consumed by:** AuthService, RegistrationService, AggregatorService, Home Health Report Service

**Depends on:** None (standalone)

## Key Features

- Automatic schema initialization on startup
- Foreign key constraints enabled
- Cascading deletes for data integrity
- Prepared statements for SQL injection protection
- Database location: `data/domotics.db`

## Response Codes

- `200/201` - Success
- `400` - Missing required fields
- `404` - Resource not found
- `409` - Conflict (duplicate email/URL)
- `500` - Server error
