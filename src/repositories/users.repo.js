const db = require('../db/database');

function createUser(user) {
    console.log(`[Users Repository] Inserting user into database: ${user.email}`);
    const stmt = db.prepare(`
    INSERT INTO users (email, name, surname, password_hash)
    VALUES (?, ?, ?, ?)
  `);
    const result = stmt.run(
        user.email,
        user.name,
        user.surname,
        user.passwordHash
    );
    console.log(`[Users Repository] User inserted successfully: ${user.email}`);
    return result;
}

function findByEmail(email) {
    return db
        .prepare('SELECT * FROM users WHERE email = ?')
        .get(email);
}

module.exports = {
    createUser,
    findByEmail
};
