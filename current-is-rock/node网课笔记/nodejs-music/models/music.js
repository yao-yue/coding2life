const db = require('./db.js')


// mysql sql查询语句里面的？,也就是后面传值的占位符
//Object.values()  把对象转为数组
module.exports = {
   addMusicObj: async sing => await db.query(`insert into musics (title,
    singer, time,filelrc,file,uid) values (?,?,?,?,?,?)`, Object.values(sing))
}