require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3001,
    rulesServiceUrl: process.env.RULES_SERVICE_URL || 'http://localhost:3012'
};
