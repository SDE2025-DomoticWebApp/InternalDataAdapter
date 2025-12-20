// src/repositories/measures.repo.js
const db = require('../db/database');

/**
 * Add a measurement for a sensor
 */
function addMeasure(sensorId, value, timestamp = null) {
    const stmt = timestamp
        ? db.prepare(`
        INSERT INTO measures (sensor_id, value, timestamp)
        VALUES (?, ?, ?)
      `)
        : db.prepare(`
        INSERT INTO measures (sensor_id, value)
        VALUES (?, ?)
      `);

    return timestamp
        ? stmt.run(sensorId, value, timestamp)
        : stmt.run(sensorId, value);
}

/**
 * Get all measurements for a sensor
 */
function getMeasuresBySensor(sensorId) {
    return db
        .prepare(`
      SELECT * FROM measures
      WHERE sensor_id = ?
      ORDER BY timestamp ASC
    `)
        .all(sensorId);
}

/**
 * Get latest measurement for a sensor
 */
function getLatestMeasure(sensorId) {
    return db
        .prepare(`
      SELECT * FROM measures
      WHERE sensor_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `)
        .get(sensorId);
}

/**
 * Get measurements for a sensor in a time range
 */
function getMeasuresInRange(sensorId, from, to) {
    return db
        .prepare(`
      SELECT * FROM measures
      WHERE sensor_id = ?
        AND timestamp BETWEEN ? AND ?
      ORDER BY timestamp ASC
    `)
        .all(sensorId, from, to);
}

/**
 * Delete all measures for a sensor (optional)
 * Usually not needed because of ON DELETE CASCADE
 */
function deleteMeasuresBySensor(sensorId) {
    return db
        .prepare('DELETE FROM measures WHERE sensor_id = ?')
        .run(sensorId);
}

module.exports = {
    addMeasure,
    getMeasuresBySensor,
    getLatestMeasure,
    getMeasuresInRange,
    deleteMeasuresBySensor
};
