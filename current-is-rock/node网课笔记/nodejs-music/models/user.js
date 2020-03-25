const db = require('./db.js')


// mysql sql查询语句里面的？,也就是后面传值的占位符
module.exports = {
    getUsers: async () =>  await db.query('select * from users', []),
    findUserByUsername: async username => await db.query('select 1 from users where username = ?',username),//查找到返回的是1,提升性能
    registerUser: async (...user) => await db.query(`insert into users (
        username, password, email) values (?,?,?)`,user),  //要传数组
    findUserDataByUsername: async username => await db.query('select * from users where username = ?',username),
}