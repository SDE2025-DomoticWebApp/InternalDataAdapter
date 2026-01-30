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
     * Send incoming measures to the Rules Service
     * @param {Object} measureData - User registration data
     * @param {string|number} sensorId - sensor id
     * @param {string|number} value - measured value (might be a JSON with multiple numbers inside)
     * @param {string} timestamp - timestamp
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
