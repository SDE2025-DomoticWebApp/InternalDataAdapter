# Internal Data Adapter

## Overview

The Internal Data Adapter is the central data persistence layer for the domotic web application. It provides a RESTful API for managing users, sensors, and measurements using an SQLite database. This service acts as the single source of truth for all application data and is consumed by other microservices.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 (via better-sqlite3)
- **Type**: CommonJS

## Architecture

The service follows a layered architecture:
- **Routes Layer**: HTTP endpoint definitions
- **Repository Layer**: Database access logic
- **Database Layer**: SQLite connection and schema management

## Database Schema

### Tables

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| email | TEXT | PRIMARY KEY |
| name | TEXT | NOT NULL |
| surname | TEXT | NOT NULL |
| password_hash | TEXT | NOT NULL |

#### `sensors`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| user_email | TEXT | NOT NULL, FK → users(email) |
| type | TEXT | NOT NULL, CHECK (type IN ('temperature', 'humidity', 'wind')) |
| name | TEXT | NOT NULL |
| url | TEXT | NOT NULL, UNIQUE |

#### `measures`
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT |
| sensor_id | INTEGER | NOT NULL, FK → sensors(id) |
| timestamp | DATETIME | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| value | REAL | NOT NULL |

### Foreign Key Constraints
- Sensors are deleted when their owner user is deleted (CASCADE)
- Measures are deleted when their sensor is deleted (CASCADE)

## Configuration

### Environment Variables

None required. The service runs on port 3001 by default (or `PORT` env variable if set).

### Database Location

The SQLite database is stored at: `data/domotics.db`

## API Endpoints

### Users

#### Create User
```http
POST /users
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John",
  "surname": "Doe",
  "passwordHash": "hashed_password_string"
}
```

**Response:**
- `201 Created` - User created successfully
- `400 Bad Request` - Missing required fields
- `409 Conflict` - User with this email already exists
- `500 Internal Server Error` - Database error

#### Get User by Email
```http
GET /users/:email
```

**Response:**
```json
{
  "email": "user@example.com",
  "name": "John",
  "surname": "Doe",
  "password_hash": "hashed_password_string"
}
```

**Status Codes:**
- `200 OK` - User found
- `404 Not Found` - User does not exist

---

### Sensors

#### Create Sensor
```http
POST /sensors
Content-Type: application/json

{
  "userEmail": "user@example.com",
  "type": "temperature",
  "name": "Living Room Sensor",
  "url": "living-room-temp"
}
```

**Response:**
```json
{
  "sensorId": 1
}
```

**Status Codes:**
- `201 Created` - Sensor created successfully
- `400 Bad Request` - Missing required fields
- `409 Conflict` - Sensor with this URL already exists
- `500 Internal Server Error` - Database error

**Note:** `type` must be one of: `temperature`, `humidity`, `wind`

#### Get Sensor by ID
```http
GET /sensors/:id
```

**Response:**
```json
{
  "id": 1,
  "user_email": "user@example.com",
  "type": "temperature",
  "name": "Living Room Sensor",
  "url": "living-room-temp"
}
```

**Status Codes:**
- `200 OK` - Sensor found
- `404 Not Found` - Sensor does not exist

#### Get Sensor by URL
```http
GET /sensors/by-url/:url
```

**Example:**
```http
GET /sensors/by-url/living-room-temp
```

**Response:**
```json
{
  "id": 1,
  "user_email": "user@example.com",
  "type": "temperature",
  "name": "Living Room Sensor",
  "url": "living-room-temp"
}
```

**Status Codes:**
- `200 OK` - Sensor found
- `404 Not Found` - Sensor does not exist

#### Get Sensors by User
```http
GET /sensors?userEmail=user@example.com
```

**Response:**
```json
[
  {
    "id": 1,
    "user_email": "user@example.com",
    "type": "temperature",
    "name": "Living Room Sensor",
    "url": "living-room-temp"
  },
  {
    "id": 2,
    "user_email": "user@example.com",
    "type": "humidity",
    "name": "Bathroom Humidity",
    "url": "bathroom-humidity"
  }
]
```

**Status Codes:**
- `200 OK` - Returns array of sensors (empty if none found)
- `400 Bad Request` - Missing userEmail query parameter

#### Delete Sensor
```http
DELETE /sensors/:id
```

**Status Codes:**
- `204 No Content` - Sensor deleted successfully
- `404 Not Found` - Sensor does not exist

**Note:** All associated measures are deleted automatically (CASCADE).

---

### Measures

#### Add Measure
```http
POST /measures
Content-Type: application/json

{
  "sensorId": 1,
  "value": 23.5,
  "timestamp": "2024-12-24T10:30:00Z"
}
```

**Response:**
```json
{
  "measureId": 42
}
```

**Status Codes:**
- `201 Created` - Measure added successfully
- `400 Bad Request` - Missing sensorId or value
- `404 Not Found` - Sensor does not exist
- `500 Internal Server Error` - Database error

**Notes:**
- `timestamp` is optional. If not provided, current timestamp is used.
- `value` must be a number (integer or decimal)

#### Get Measures by Sensor
```http
GET /measures/sensor/:sensorId
```

**Response:**
```json
[
  {
    "id": 42,
    "sensor_id": 1,
    "timestamp": "2024-12-24T10:30:00.000Z",
    "value": 23.5
  },
  {
    "id": 43,
    "sensor_id": 1,
    "timestamp": "2024-12-24T11:00:00.000Z",
    "value": 24.1
  }
]
```

**Status Codes:**
- `200 OK` - Returns array of measures (ordered by timestamp ASC)

#### Get Latest Measure
```http
GET /measures/sensor/:sensorId/latest
```

**Response:**
```json
{
  "id": 43,
  "sensor_id": 1,
  "timestamp": "2024-12-24T11:00:00.000Z",
  "value": 24.1
}
```

**Status Codes:**
- `200 OK` - Latest measure found
- `404 Not Found` - No measures exist for this sensor

#### Get Measures in Time Range
```http
GET /measures/sensor/:sensorId/range?from=2024-12-24T00:00:00Z&to=2024-12-24T23:59:59Z
```

**Response:**
```json
[
  {
    "id": 42,
    "sensor_id": 1,
    "timestamp": "2024-12-24T10:30:00.000Z",
    "value": 23.5
  },
  {
    "id": 43,
    "sensor_id": 1,
    "timestamp": "2024-12-24T11:00:00.000Z",
    "value": 24.1
  }
]
```

**Status Codes:**
- `200 OK` - Returns measures in range (ordered by timestamp ASC)
- `400 Bad Request` - Missing from or to query parameters

---

### Health Check

#### Check Service Health
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Service is running

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Install Dependencies
```bash
npm install
```

### Run the Service

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The service will start on port 3001 (or the port specified in the PORT environment variable).

## Project Structure

```
InternalDataAdapter/
├── data/                      # SQLite database storage
│   └── domotics.db
├── src/
│   ├── db/
│   │   ├── database.js        # Database connection
│   │   └── schema.sql         # Database schema definition
│   ├── repositories/          # Data access layer
│   │   ├── users.repo.js
│   │   ├── sensors.repo.js
│   │   └── measures.repo.js
│   ├── routes/                # HTTP endpoint definitions
│   │   ├── users.routes.js
│   │   ├── sensors.routes.js
│   │   └── measures.routes.js
│   └── app.js                 # Express application setup
├── package.json
└── README.md
```

## Dependencies

### Production Dependencies
- `better-sqlite3` (v12.5.0): Synchronous SQLite3 client
- `express` (v5.2.1): Web framework

### Development Dependencies
- `nodemon` (v3.1.11): Auto-reload during development

## Service Dependencies

This service is **standalone** and does not depend on other microservices. It is consumed by:
- AuthService (for user authentication)
- RegistrationService (for user creation)
- AggregatorService (for dashboard data)

## Database Initialization

The database schema is automatically initialized when the service starts. The `schema.sql` file is executed on startup to create tables and indexes if they don't exist.

## Notes

- The database uses foreign key constraints, which are enabled via `PRAGMA foreign_keys = ON`
- All timestamps are stored in ISO 8601 format
- Sensor types are validated at the database level (temperature, humidity, wind)
- Sensor URLs must be unique across the entire system
- Cascading deletes ensure data integrity when users or sensors are removed
