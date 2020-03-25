module.exports = (options)=>{
  return async (ctx,next) => {
      try {
        //先放行
        await next();
      }catch (e) {
        // 根据之前的
        console.log(e);
        // e.code之类的状态码002
        ctx.render('error',{msg:'002状态错误，原因是:xxx'})
      }
  }
}