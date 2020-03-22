const domain = 'https://daorv.icebartech.com/';
// const domain = 'https://rv.icebartech.com/';
// const domain = 'http://192.168.1.22:60806/';
const api = domain + 'mini/';
module.exports = {
  APIBODY: api,
  WX: {
    SAVE: api + 'user/saveMiniUserInfo',//保存用户信息
    LOGIN: api + 'user/miniWeixinLogin',//授权登录
    REGISTER: api + 'user/miniRegisterBinding',//注册
    
    LOGINBINDING: api + 'user/miniLoginBinding',//小程序登录
    FINDPWD: api + 'user/findPwd',//找回密码
    FINDMOBILECODE: api + 'user/findMobileCode',//小程序获取手机验证码
    CHANGEMOBILE: api + 'user/changeMobile', //更换手机号

    UPLOADFORMID: api +'formId/uploadFormId',  //模板消息推送
  },
  CAR:{
    // 房车租赁
    FINDRENTINFO: api + 'rentInfo/findRentInfoByPage',//获取租赁列表
    FINDRENTINFOBYID: api + 'rentInfo/findRentInfoById', //根据房车租赁id获取房车租赁详情
    FINDRENTINFOBYQRCODE: api + 'rentInfo/findRentInfoByQrCode',   // 小程序扫码二维码进入房车租赁详情
    FINDRENTCITY: api +'rentInfo/findRentCityGroup',  // 获取租赁城市列表

    //酒店
    FINDHOTELBYPAGE: api +'hotelInfo/findPage',    // 分页获取酒店列表
    FINDHOTELROOMBYPAGE: api +'roomInfo/findPage', // 分页获取房间列表
    FINDROOMDETAILBYID: api +'roomInfo/findDetail',  // 获取房间详情
    FINDHOTELCITY: api + 'syscode/findHotelCityGroup',  // 获取酒店城市列表

    // 营地
    FINDCAMPBYPAGE: api +'campbaseInfo/findPage',   // 分页获取营地列表
    FINDCAMPCARBYPAGE: api +'campsiteInfo/findPage',  // 分页获取营地房车列表
    FINDCAMPCARDETAILBYID: api +'campsiteInfo/findDetail',  // 获取营地房车详情
    FINDCAMPCITY: api + 'syscode/findCampbaseCityGroup',  // 获取营地城市列表

    // 旅游路线 驴行社
    FINDLINECATEGORYBYPAGE: api +'linecategory/findPage',  // 获取旅游路线分类
    FINDLINEBYPAGE: api + 'lineproduct/findPage',          // 获取旅游路线列表
    FINDLINEDETAILBYID: api + 'lineproduct/findDetail',    // 获取旅游路线详情

    // 驴圈子
    FINDINFOMSGBYPAGE: api +'infospacemsg/findPage',   //
    FINDINFOMSGBYID: api +'infospacemsg/findDetail', // 
    DELETEINFOMSG: api +'infospacemsg/delete',  //
    ADDINFOMSG: api +'infospacemsg/add',  

    // 驴圈子评论
    ADDINFOMSGREPLY: api +'infospacemsgreply/add',  //添加或者回复评论
    FINDINFOMSGREPLYBYPAGE: api +'infospacemsgreply/findPage',  //分页获取评论
    DELETEINFOMSGREPLY: api +'infospacemsgreply/delete',
    
    // 驴圈子点赞
    HITMSGBYID: api +'infospacemsghit/hitMsg',   // 点赞故事

  },
  ORDER: {
    SAVETRANSFERRECORD: api + 'order/saveTransferRecord',//上传凭证
    FINDORDERPAGE: api + 'order/findPayOrderByPage',//获取订单列表 
    FINDREPLYPAGE: api + 'order/findPayOrderReplyByPage',//小程序端分页获取商品评论
    FINDORDERBYID: api + 'order/findPayOrderByOrderId',//小程序端获取订单详情
    FINDTRANSFERORDER: api + 'order/findTransferRecordByOrderId',//获取订单汇款凭证列表
    SAVEORDERREPLY: api + 'order/savePayOrderReply',//评论订单
    CANCELORDER: api + 'productPay/cancelOrder',//取消订单
    UPDATESTATUS: api + 'order/updateServiceStatus'//确认订单
  },
  SYS: {
    // 支付
    COINPAY: api + 'productPay/coinsPay',//小程序商品类余额支付
    WEIXINPAY: api + 'productPay/weixinPrepay',//微信预支付
    OFFLINEPAY: api + 'productPay/offlinePrepay',//线下支付
    REPAY: api + 'productPay/repay',  //重新支付
    SAVEPAYORDERWITHDRAW: api + 'withdraw/savePayOrderWithdraw',//小程序端用户进行提现
    // 文件
    UPLOAD: domain + 'base/sys/miniUploadFile',   // 上传文件 
    LOADDICTIONARY: domain + 'base/sys/loadDictionary', // 字典
    CHECKPASS: domain + 'base/sys/checkExaminePass', // 检查版本是否通过
    FINDDISCOUNTRULE: api +'var/findSysVarsByType',  // 获取积分抵扣规则
  },
  // 个人信息 
  USERPRODUCT: {
    FINDUSERPRODUCTPAGE: api + 'userProduct/findUserProductByPage',//小程序端分页获取我的房车（营地）商品列表
    SAVEPRODUCTTRUST: api + 'userProduct/saveProductTrust',//小程序端托管（取消托管）商品
    FINDUSERDETAIL: api + 'user/findAppUserDetail',   // 查询个人信息
    SAVEUSERDETAIL: api + 'user/saveAppUserDetail',   // 修改个人信息
    BINDCODE: api + 'user/bindSubUserByQrCode',       // 通过扫码绑定上级代理
    MODIFYPWD: api + 'user/modifyPwd',                // 修改密码
    FINDUSERPAGE: api + 'user/findAppUserCoreByPage',
    FINDWITHDRAWDETAIL: api + 'withdraw/findOrderWithdrawByPage'
  },
  // 积分明细
  POINT: {
    POINTBYPAGE: api + 'points/findUserPointDetailByPage',//小程序端分页获取不可提现积分（如营地积分）流水记录
    FINDBALACNEPAGE: api + 'points/findUserBalanceDetailByPage',//小程序端分页获取当前用户（余额/积分）流水
    FINDPOINTGROUP: api + 'points/findUserPointGroupYesterday',// 小程序端获取昨天收益详情
    SENDTRIPPOINT: api + 'points/sendOnTripPoints',//转送旅游积分
    FINDPOINTPRODUCT: api + 'pointproduct/findPage',//获取积分商品
    // FINDPOINTDETAIL: api + 'points/findUserPointDetailByPage'//获取积分商品
  },
  // 协议说明
  ADV: {
    FINDAPPBANNER: api + 'adv/findAppBannerByPage',
    FINDREGISTERTIP: api + 'adv/findRegisterTip',
    FINDRERENTTIP: api + 'adv/findReRentTip',                     //获取转租说明
    FINDRERENTAGREEMENT: api + 'adv/findReRentAgreement'          //获取转租协议

  },
  // 实名认证
  USERAUTH: {
    FINDAUTH: api + 'userAuth/findIsAuth',              //获取用户实名状态
    SAVEAUTH: api + 'userAuth/saveUserAuth',            //提交用户实名信息
  },
  // 我的转租
  USERRENT: {
    FINDUSERRENTPRODUCTBYPAGE: api + 'userRent/findUserRentProductByPage',      //获取可转租房车列表
    FINDUSERRENTDETAILBYPAGE: api + 'userRent/findUserRentDetailByPage',        //获取房车已被转租情况列表
    FINDUSERRENTPRODUCTBYID: api + 'userRent/findUserRentProductById',          //获取可转租房车详情
    UPDATEUSERRENTPRICE: api + 'userRent/updateUserRentPrice',                  //修改转租价格
    CHECKUSERRENT: api + 'userRent/checkUserRentProductById',                   //获取是否需要显示转租协议
  },

  //热门城市
  SYSCODE: {
    FINDCAMPBASECITYGROUP: api + 'syscode/findCampbaseCityGroup',              //获取营地城市
    FINDHOTCAMPBASECITYGROUP: api + 'syscode/findHotCampbaseCityGroup',        //获取热门营地城市
    FINDHOTHOTELCITYGROUP: api + 'syscode/findHotHotelCityGroup',              //获取热门酒店城市
    FINDHOTRENTCITYGROUP: api + 'syscode/findHotRentCityGroup',                //获取热门房车租赁城市
    FONDHOTELCITYGROUP: api + 'syscode/findHotelCityGroup',                    //获取酒店城市
  },

  // 充值余额
  CAMPPAY: {
    DIRECTPAY: api + 'campPointsPay/directPay'
  },
  LOTTERY:{
    FINDLOTTERYPRIZELIST: domain +'weixin/lotteryprize/findList',   // 获取奖品列表
    NORMALLOTTERY: domain +'weixin/lotteryprize/normalLottery',     // 普通抽奖
    VIPLOTTERY: domain +'weixin/lotteryprize/vipLottery',           // vip抽奖

    FINDUSERLOTTERYLIST: api +'lotteryuserprize/findPage',    // 获取我的奖品
    FINDUSERLOTTERYDETAIL: api +'lotteryuserprize/findDetail',  // 获取我的奖品详情
    
  }
}

