const path = require('path')

module.exports = {
    viewDir: path.resolve('./views'),
    staticDir: path.resolve('./public'),
    uploadDir:path.resolve('./public/files'),
}

//有一个问题就是为什么这里是./views 这样的话不是应该是同级的吗？