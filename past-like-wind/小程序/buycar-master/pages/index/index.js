//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [
      "https://haitao.nosdn1.127.net/2fs3CsacfyO1Lko47H11qk3C4IpcT18010242333_1920_506.jpg?imageView&thumbnail=1920x0&quality=90",
        "https://haitao.nos.netease.com/qyZ0uE5GPfOEldhW2T1809140947_1920_400.jpg?imageView&thumbnail=1920x0&quality=95&type=webp"
    ],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //	滑动动画时长1s
    
    navItems:[
      {
        name:'待开发',
        url:'bill'
      },
      {
        name:'查询天气',
        url:'weather',
         isSplot:true,
      },
      {
        name:'待开发',
        url:'bill'
      },
      {
        name:'待开发',
        url:'bill'
      }, 
      {
        name:'2048',
        url:'games',
        isSplot:true
      },
      {
        name:'待开发',
        url:'bill'
      }
    ],

    venuesItems:[
        {
            id:"471",
            title:"喜多多 椰果王礼盒 200ml*10罐",
            imgurl:"#",
            price:"30.00",
            money:"31.80"
        },
        {
            id:"470",
            title:"喜多多 牛奶花生 370g*12罐",
            imgurl:"#",
            price:"32.00",
            money:"36.00"
        },
        {
            id:"469",
            title:"喜多多 桂圆莲子八宝粥 360g*12罐",
            imgurl:"#",
            price:"32.00",
            money:"36.00"
        },
        {
            id:"468",
            title:"喜多多 冰糖雪梨椰果 280g*12罐",
            imgurl:"#",
            price:"38.00",
            money:"42.00"
        },
        {
            id:"467",
            title:"喜多多 什锦椰果罐头 370g 整箱12瓶 果肉果粒",
            imgurl:"#",
            price:"38.00",
            money:"42.00"
        },
        {
            id:"463",
            title:"好丽友派 巧克力清新抹茶味216g",
            imgurl:"#",
            price:"10.00",
            money:"11.00"
        },
    ],
    choiceItems:[
       {
            id:"467",
            title:"喜多多 什锦椰果罐头 370g 整箱12瓶 果肉果粒",
            imgurl:"#",
            price:"38.00",
            money:"42.00"
        },
        {
            id:"463",
            title:"好丽友派 巧克力清新抹茶味216g",
            imgurl:"#",
            price:"10.00",
            money:"11.00"
        },
        {
            id:"471",
            title:"喜多多 椰果王礼盒 200ml*10罐",
            imgurl:"#",
            price:"30.00",
            money:"31.80"
        },
        {
            id:"470",
            title:"喜多多 牛奶花生 370g*12罐",
            imgurl:"#",
            price:"32.00",
            money:"36.00"
        },
        {
            id:"469",
            title:"喜多多 桂圆莲子八宝粥 360g*12罐",
            imgurl:"#",
            price:"32.00",
            money:"36.00"
        },
        {
            id:"468",
            title:"喜多多 冰糖雪梨椰果 280g*12罐",
            imgurl:"#",
            price:"38.00",
            money:"42.00"
        }  
    ]

  },
  onLoad: function () {
    console.log('=========onLoad========')
    
  }
    
})
