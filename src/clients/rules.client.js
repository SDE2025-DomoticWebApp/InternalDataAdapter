const axios = require('axios');
const config = require('../config/config');

/**
 * Client for communicating with the Rules Service
 */
class RulesServiceClient {
    constructor(baseURL = config.rulesServiceUrl) {
        this.client = axios.create({
            baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Send an incoming measure to the Rules Service for evaluation.
     * @param {Object} measureData - Measure payload
     * @param {string|number} measureData.sensorId - Sensor id
     * @param {Object} measureData.value - Measurement object (keyed by sensor type)
     * @param {string} [measureData.timestamp] - ISO timestamp
     * @param {boolean} [measureData.isExternal] - Marks virtual/external sources
     */
    async sendMeasure(measureData) {
        try {
            const response = await this.client.post('/measures', measureData);
            return response.data;
        } catch (error) {
            if (error.response) {
                const serviceError = new Error(error.response.data?.error || 'Measure forwarding to RulesService failed');
                serviceError.statusCode = error.response.status;
                throw serviceError;
            }
            throw new Error('Unable to reach rules service');
        }
    }
}

module.exports = new RulesServiceClient();
