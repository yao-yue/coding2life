const fs = require('fs')

fs.readFile('input.txt', function(err, data) {
    if(err) {
        return console.err('err')
    }
    console.log('异步读取', data.toString())
})


const data = fs.readFileSync('input.txt')
// 同步读取
console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')
console.log('同步读取', data.toString())
console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxx')

console.log('程序执行完毕')