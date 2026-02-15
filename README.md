# Internal Data Adapter

SQLite persistence layer for users, sensors, and measurements.

**Port:** 3001  
**Auth:** None (internal)

## Configuration

Create `.env` from `.env.example`:
```
PORT=3001
RULES_SERVICE_URL=http://localhost:3012
```

## API

### Users
- `POST /users` body: `email`, `name`, `surname`, `passwordHash`, `location`
- `GET /users/:email`

### Sensors
- `POST /sensors` body: `userEmail`, `type`, `name`, `secretHash`
- `GET /sensors/:id`
- `GET /sensors?userEmail=...`
- `DELETE /sensors/:id`

### Measures
- `POST /measures` body: `sensorId`, `value`, `secret`, `timestamp?`
- `GET /measures/sensor/:sensorId`
- `GET /measures/sensor/:sensorId/latest`
- `GET /measures/sensor/:sensorId/range?from=...&to=...`

### Locations
- `GET /locations` returns `email` and `location` for all users

### Health
- `GET /health`

## Notes

- `POST /measures` verifies the sensor secret (bcrypt hash) before insert.
- On successful insert, measures are forwarded to RulesService if configured.
- SQLite database files live under `data/` and are not meant to be committed.

## Run
```
npm install
npm run dev
```
