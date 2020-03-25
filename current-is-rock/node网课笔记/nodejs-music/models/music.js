const db = require('./db.js');
module.exports = {
  // xxx:()=> db.q('ssxx');
  addMusicByObj:async sing => await db.query('insert into musics (title,singer,time,filelrc,file,uid) values (?,?,?,?,?,?)',Object.values(sing)),
  updateMusic:async music => await db.query('update musics set title=?,singer=?,time=?,filelrc=?,file=?,uid=? where id=?',Object.values(music)),
  deleteMusic:async id => await db.query('delte from musics where id = ?', [id]),   //查询语句后面传的参数是数组
  findMusicById: async id => await db.query('query * from music where id = ?', [id]),
  findMusicByUid: async uid => await db.query('query * from music where uid = ?', [uid]),
}