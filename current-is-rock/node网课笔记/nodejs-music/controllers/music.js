const musicModel = require('../models/music')
const path = require('path')

module.exports = {
    addMusic: async (ctx, next) => {
        // console.log(ctx.request.files)  
        // console.log('===========')
        // console.log(ctx.request.body)
        // 1.获取字符串数据
        // 2.获取文件 --> 保存文件的网络路径（方便public请求返回）
        //               保存文件的绝对路径，但是麻烦
        // 3. 插入数据到数据库
        // 4. 响应结果给用户
        let {title , singer, time} = ctx.request.body;
        let { file , filelrc = '' } = ctx.request.files;
        let saveSingObj = {
            title , singer, time,
        }
        if(filelrc) {
            //filelrc.path 文件路径    base 文件名加后缀
            saveSingObj.filelrc = '/public/files' + path.parse(filelrc.path).base;
        }
        if(!file) {
            ctx.throw('歌曲必须上传')
            return;
        }
        //处理歌曲路径
        saveSingObj.file = '/public/files' + path.parse(file.path).base;
        //加入用户id未来使用方便之后使用session
        saveSingObj.uid = 1
        console.log(saveSingObj)
        // let res = await musicModel.addMusicByObj(saveSingObj)
        ctx.body = {
            //ajax接收到的状态消息
            code: '001',
            msg: res.message,
            saveSingObj
        }
    }
}