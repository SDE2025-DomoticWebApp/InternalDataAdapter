const express = require('express');
const router = express.Router();
const measuresRepo = require('../repositories/measures.repo');
const sensorsRepo = require('../repositories/sensors.repo');
const secretUtils = require('../utils/secret');

// POST /measures
router.post('/', async (req, res) => {
    const { sensorId, value, timestamp, secret } = req.body;

    if (!sensorId || value === undefined || !secret) {
        return res.status(400).json({ error: 'sensorId, value and secret are required' });
    }

    const sensor = sensorsRepo.getSensorById(sensorId);

    // Compare plain text secret with stored hash using bcrypt
    const isValidSecret = await secretUtils.compare(secret, sensor.secret_hash);
    if (!isValidSecret) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const result = measuresRepo.addMeasure(sensorId, value, timestamp);
        res.status(201).json({ measureId: result.lastInsertRowid });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(404).json({ error: 'Sensor not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /measures/sensor/:sensorId
router.get('/sensor/:sensorId', (req, res) => {
    const measures = measuresRepo.getMeasuresBySensor(req.params.sensorId);
    res.json(measures);
});

// GET /measures/sensor/:sensorId/latest
router.get('/sensor/:sensorId/latest', (req, res) => {
    const measure = measuresRepo.getLatestMeasure(req.params.sensorId);
    if (!measure) return res.status(404).end();
    res.json(measure);
});

// GET /measures/sensor/:sensorId/range
router.get('/sensor/:sensorId/range', (req, res) => {
    const { from, to } = req.query;
    if (!from || !to) {
        return res.status(400).json({ error: 'from and to are required' });
    }
    const measures = measuresRepo.getMeasuresInRange(
        req.params.sensorId,
        from,
        to
    );
    res.json(measures);
});

module.exports = router;
