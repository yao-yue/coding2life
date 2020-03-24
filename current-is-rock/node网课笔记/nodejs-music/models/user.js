const db = require('./db.js')

module.exports = {
    getUsers: async () => {
        let users = await db.query('select * form users', [])
        return users
    },
    findUserByUsername: async () => await db.query('select 1 form users where username = ?',username)
}