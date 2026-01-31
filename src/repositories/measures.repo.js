// src/repositories/measures.repo.js
const db = require('../db/database');

function parseValue(raw) {
    if (raw === null || raw === undefined) return raw;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        } catch (err) {
            return raw;
        }
    }
    return raw;
}

function normalizeMeasure(row) {
    if (!row) return row;
    return {
        ...row,
        value: parseValue(row.value)
    };
}

/**
 * Add a measurement for a sensor
 */
function addMeasure(sensorId, value, timestamp = null) {
    const serializedValue = JSON.stringify(value);
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
        ? stmt.run(sensorId, serializedValue, timestamp)
        : stmt.run(sensorId, serializedValue);
}

/**
 * Get all measurements for a sensor
 */
function getMeasuresBySensor(sensorId) {
    const rows = db
        .prepare(`
      SELECT * FROM measures
      WHERE sensor_id = ?
      ORDER BY timestamp ASC
    `)
        .all(sensorId);
    return rows.map(normalizeMeasure);
}

/**
 * Get latest measurement for a sensor
 */
function getLatestMeasure(sensorId) {
    const row = db
        .prepare(`
      SELECT * FROM measures
      WHERE sensor_id = ?
      ORDER BY timestamp DESC
      LIMIT 1
    `)
        .get(sensorId);
    return normalizeMeasure(row);
}

/**
 * Get measurements for a sensor in a time range
 */
function getMeasuresInRange(sensorId, from, to) {
    const rows = db
        .prepare(`
      SELECT * FROM measures
      WHERE sensor_id = ?
        AND timestamp BETWEEN ? AND ?
      ORDER BY timestamp ASC
    `)
        .all(sensorId, from, to);
    return rows.map(normalizeMeasure);
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
