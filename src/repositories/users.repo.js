const db = require('../db/database');

function createUser(user) {
    const stmt = db.prepare(`
    INSERT INTO users (email, name, surname, password_hash)
    VALUES (?, ?, ?, ?)
  `);
    return stmt.run(
        user.email,
        user.name,
        user.surname,
        user.passwordHash
    );
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
