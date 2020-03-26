const db = require('./db')

module.exports = {
    // xxx:()=> db.q('ssxx');
    addPenByObj:async pen => await db.query('insert into pens (name,price) values (?,?)',Object.values(pen)),
    updatePen:async pen => await db.query('update pens set name=?,price=? where id=?',Object.values(pen)),
    deletePen:async id => await db.query('delte from pens where id = ?', [id]),   //查询语句后面传的参数是数组
    findPenById: async id => await db.query('query * from pens where id = ?', [id]),
    findAllPen: async () => await db.query('query * from pens'),
  }