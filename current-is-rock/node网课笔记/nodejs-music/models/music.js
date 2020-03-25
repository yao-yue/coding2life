const db = require('./db.js');
module.exports = {
  // xxx:()=> db.q('ssxx');
  addMusicByObj:async sing => await db.query('insert into musics (title,singer,time,filelrc,file,uid) values (?,?,?,?,?,?)',Object.values(sing)),
  updateMusic:async music => await db.query('update musics set title=?,singer=?,time=?,filelrc=?,file=?,uid=? where id=?',Object.values(music))
}