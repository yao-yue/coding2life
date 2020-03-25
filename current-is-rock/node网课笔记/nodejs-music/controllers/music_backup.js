const musicModel = require('../models/music.js');
const path = require('path');
module.exports = {
  /**
   * 添加音乐
   * @param {[type]}   ctx  [description]
   * @param {Function} next [description]
   */
  async addMusic(ctx,next){
    // 接收请求数据 
    // console.log(ctx.request.files); // 文件，根据key名
    // console.log('===========================')
    // console.log(ctx.request.body); // 字符串，根据key名
    // 1:获取字符串数据
    let { title,singer,time } = ctx.request.body;
    // 2:获取文件 ->  保存文件的网络路径（方便/public请求返回）
    let { file,filelrc } = ctx.request.files;
    //  保存文件的绝对路径也可以，但是麻烦
    let saveSingObj = {
      title,singer,time
    }

    // 为了我们后面微信小程序，也能调用这个接口
    saveSingObj.filelrc = 'no upload filelrc';

    //    2.5: 歌词可选
    if(filelrc) {
                                              // 文件路径  文件名+后缀
      saveSingObj.filelrc = '/public/files/' + path.parse(filelrc.path).base;
    }

    if(!file) {
      ctx.throw('歌曲必须上传');
      return;
    }
    // 2.7:处理歌曲路径
    saveSingObj.file = '/public/files/' + path.parse(file.path).base;


    // 2.8:加入用户id 未来使用session
    saveSingObj.uid = 1;

    // 3: 插入数据到数据库
    let result = await musicModel.addMusicByObj(saveSingObj);
    // 4: 响应结果给用户
    ctx.body = {
      // ajax接收到的状态消息
      code:'001',msg:result.message
    }
  }
}