//使用签名url进行临时授权，您
//可以将生成的签名URL提供给访客进行临时访问。生成签名URL时，您可以指定URL的过期时间，来限制访客的访问时长

let OSS = require('ali-oss');
let store = new OSS({
    bucket: 'en-source',
    region: 'oss-cn-beijing',
    accessKeyId: 'LTAI4G9RKoGn14ht7Y4eDWLE',
    accessKeySecret: '7UzJ1p2YhKTpCxXAOpB9Z3yaNbpwFR'
})
const url = store.signatureUrl('small119000.jpg');
console.log(url);
// // --------------------------------------------------
// const url = store.signatureUrl('ossdemo.txt', {
//   expires: 3600,
//   method: 'PUT'
// });
// console.log(url);

// //  put object with signatureUrl
// // -------------------------------------------------

// const url = store.signatureUrl('ossdemo.txt', {
//   expires: 3600,
//   method: 'PUT',
//   'Content-Type': 'text/plain; charset=UTF-8',
// });
// console.log(url);

// // --------------------------------------------------
// const url = store.signatureUrl('ossdemo.txt', {
//   expires: 3600,
//   response: {
//     'content-type': 'text/custom',
//     'content-disposition': 'attachment'
//   }
// });
// console.log(url);

// // put operation