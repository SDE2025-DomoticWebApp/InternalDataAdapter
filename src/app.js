const express = require('express');
const fs = require('fs');
const path = require('path');

// initialize express
const app = express();

// parse JSON bodies
app.use(express.json());

// initialize database schema
const db = require('./db/database');
const schemaPath = path.join(__dirname, 'db/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');
db.exec(schema);

// register routes
app.use('/users', require('./routes/users.routes'));
app.use('/sensors', require('./routes/sensors.routes'));
app.use('/measures', require('./routes/measures.routes'));

// health check endpoint (optional but useful)
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Internal Data Adapter running on port ${PORT}`);
});
