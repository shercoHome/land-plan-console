import Vue from "vue";
import App from "./App.vue";
import './plugins/element.js'

import axios from "axios";
import qs from "qs";

import { Loading } from 'element-ui';

Vue.config.productionTip = false;

Vue.prototype.$axios = axios;
Vue.prototype.$qs = qs;

//////////////////////////
let elementLoading;
//添加请求拦截器
Vue.prototype.$axios.interceptors.request.use(config => {//在一个ajax发送前执行操作 config.url  config.method
  console.log("******loading********start");
  elementLoading=Loading.service({ fullscreen: true ,background:'rgba(255, 255, 255, 0.5)'});//
  return config;
}, error => {
  return Promise.reject(error);
});
//添加响应拦截器
Vue.prototype.$axios.interceptors.response.use(response => {  //在一个ajax响应后再执操作
  elementLoading.close();
  console.log("******loading********end");
  return response;
}, error => {
  if (Vue.prototype.$axios.isCancel(error)) {
    console.warn('isCancel->', error.message)
  } else {
    console.log('error', error)
  }
  return Promise.reject(error);
});


///////////////////////



Vue.prototype.$$ = {
  getSearch: function () {
    var url = location.search;
    var json = {};
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        let key_ = strs[i].split("=")[0];
        let value_ = unescape(strs[i].split("=")[1]);
        json[key_] = value_;
      }
    }
    return json;
  },
  isNumber: function (value) {
    return !Number.isNaN(Number(value))
  },
  getDomain: function () {
    return window.location.origin
      ? window.location.origin
      : window.location.protocol +
      "//" +
      window.location.hostname +
      (window.location.port ? ":" + window.location.port : "");
  },
  console: {
    black(str) {
      console.log('%c ' + str, 'background:black;color:white');
    }, black(str) {
      console.log('%c ' + str, 'background:black;color:white');
    }, red(str) {
      console.log('%c ' + str, 'background:red;color:white');
    }, blue(str) {
      console.log('%c ' + str, 'background:blue;color:white');
    }, green(str) {
      console.log('%c ' + str, 'background:green;color:white');
    }, yellow(str) {
      console.log('%c ' + str, 'background:yellow;color:black');
    }
  },
  copyText: function (text_, tips) {
    let range = document.createRange();
    let eleP = document.createElement("p");
    let ele = document.createTextNode(text_);
    eleP.appendChild(ele);
    document.body.appendChild(eleP);
    range.selectNode(ele);
    var selection = window.getSelection();
    if (selection.rangeCount > 0) selection.removeAllRanges();
    selection.addRange(range);
    console.log(selection);
    document.execCommand("copy");
    document.body.removeChild(eleP);
    if (tips) {
      alert(tips);
    }
  },
  isAPP() {
    return navigator.userAgent.indexOf("Html5Plus") != -1
  },
  self2Url(url) {

    if (navigator.userAgent.indexOf("Html5Plus") != -1 && plus) {
      plus.runtime.openURL(url);
    } else {
      location.href = url;
    }

  },
  blank2Url(url) {
    if (navigator.userAgent.indexOf("Html5Plus") != -1 && plus) {
      plus.runtime.openURL(url);
    } else {
      window.open(url);
    }


  }, sortBy(__json, __str, sortMark) {
    sortMark = -sortMark;
    console.log("sortBy=" + __str);
    __json.sort(function (a, b) {
      var aa = a[__str] + '';
      var bb = b[__str] + '';
      var xxx = aa.localeCompare(bb);
      if (parseFloat(bb) == bb && parseFloat(aa) == aa) {
        xxx = aa - bb;
      }
      return sortMark * xxx;
    });
    return __json;
  }, jsonToArr(obj) {
    let arr = [];
    for (var key in obj) {
      arr.push({ "key": key, "value": obj[key] });
    }
    return arr;

  }

};
const pattJson = {};
pattJson['userName'] = /^[a-zA-Z]([a-zA-Z0-9_]{5,14})+$/;
pattJson['userPsw'] = /^[a-zA-Z0-9_]{6,15}$/;
pattJson['userWechat'] = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/;
pattJson['userQQ'] = /^[1-9]\d{4,9}$/;
pattJson['userPhone'] = /^[1]([3-9])[0-9]{9}$/;////////------/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
pattJson['userEmail'] = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
Vue.prototype.$pattJson = pattJson;

const chinese = {};
chinese['webSetting'] = {};
chinese['webSetting']['formName'] = '网站设置'
chinese['webSetting']['id'] = '网站编码'
chinese['webSetting']['userID'] = '代理标识'
chinese['webSetting']['userName'] = '代理账号'
chinese['webSetting']['userLevel'] = '角色'
chinese['webSetting']['siteLink'] = '计划官网链接'
chinese['webSetting']['siteConfig'] = '计划官网基本设置'
chinese['webSetting']['publicAuthorization'] = '全局授权(必须填写下一个ip数要求再开启)'
chinese['webSetting']['shareRequiredIP'] = '分享IP数要求'
chinese['webSetting']['shareRequiredUser'] = '分享注册数要求'
chinese['webSetting']['shareLimiteTime'] = '授权持续的时间/天'
chinese['webSetting']['apiSelect'] = '默认显示的彩种'
chinese['webSetting']['defaultPlanID'] = '默认显示当前胜率第几名计划'
chinese['webSetting']['historyLimit'] = '显示近N期的胜率'
chinese['webSetting']['leaderboardLimit'] = '排行榜，显示n条'
chinese['webSetting']['historyPlanShowLimit'] = '展示多少计划历史结果'
chinese['webSetting']['needAuthorize'] = '需要授权的彩种和第n-m排名（all=全部）'
chinese['webSetting']['stringUserTitle'] = '设置用户头衔'
chinese['webSetting']['registerQQ'] = '注册是否要填QQ'
chinese['webSetting']['registerWechat'] = '注册是否要填微信'
chinese['webSetting']['registerPhone'] = '注册是否要填手机'
chinese['webSetting']['registerEmail'] = '注册是否要填邮箱'
chinese['webSetting']['loginKeep'] = '用户登录的有效期/分钟'
chinese['webSetting']['csQQ'] = '网站客服QQ（多个随机展示）'
chinese['webSetting']['csQQGroup'] = '网站客服QQ群（多个随机展示）'
chinese['webSetting']['csWechat'] = '网站客服微信（多个随机展示）'
chinese['webSetting']['csEmail'] = '网站客服邮箱（多个随机展示）'
chinese['webSetting']['ezunLink'] = 'BC官网注册链接'
chinese['webSetting']['autoEzunLink'] = '开启自动修改注册链接（暂无）'
chinese['webSetting']['hk49plan1'] = '六合彩计划-标题'
chinese['webSetting']['hk49plan2'] = '六合彩计划-精品推荐'
chinese['webSetting']['hk49plan3'] = '六合彩计划-生肖投注'
chinese['webSetting']['hk49plan4'] = '六合彩计划-特码投注'
chinese['webSetting']['hk49plan5'] = '六合彩计划-特别投注'
chinese['webSetting']['hk49PlanPoet'] = '六合打油诗'
chinese['webSetting']['hk49PlanPicture'] = '六合图'
chinese['webSetting']['outLinkName'] = '底部外链名称'
chinese['webSetting']['bulletinShow'] = '公告弹窗'
chinese['webSetting']['baiduStatistics'] = '百度统计的代码'
chinese['webSetting']['updateUserPsw'] = '会员可否修改自己的密码'
chinese['webSetting']['submitUpdateUserLevel'] = '会员可否提交次级代理申请'
chinese['webSetting']['updateUserQQ'] = '会员可否修改自己的QQ'
chinese['webSetting']['updateUserWechat'] = '会员可否修改自己的邮箱'
chinese['webSetting']['updateUserPhone'] = '会员可否修改自己的微信'
chinese['webSetting']['updateUserEmail'] = '会员可否修改自己的手机'
chinese['webSetting']['mark1'] = '公告内容'
chinese['webSetting']['mark2'] = '广告图片设置'
chinese['webSetting']['mark3'] = '首页（图片）排版'
chinese['webSetting']['mark4'] = '开放彩种'
chinese['webSetting']['mark5'] = '优惠速递'
chinese['webSetting']['agentName'] = '归属代理'

chinese['user'] = {};
chinese['user']['formName'] = '会员资料'
chinese['user']['id'] = '编码'
chinese['user']['userName'] = '会员账号'
chinese['user']['userPsw'] = '会员密码'
chinese['user']['userQQ'] = '联系QQ'
chinese['user']['userWechat'] = '联系微信'
chinese['user']['userPhone'] = '联系电话'
chinese['user']['userEmail'] = '联系邮箱'
chinese['user']['verifyQQ'] = '验证QQ'
chinese['user']['verifyWechat'] = '验证邮箱'
chinese['user']['verifyPhone'] = '验证微信'
chinese['user']['verifyEmail'] = '验证手机'
chinese['user']['registerTime'] = '注册时间'
chinese['user']['registerIP'] = '注册IP'
chinese['user']['shareCode'] = '分享码'
chinese['user']['authorizationStatus'] = '授权状态'
chinese['user']['authorizationTime'] = '授权时间'
chinese['user']['authorizationLimite'] = '授权时限/天（0=永久）'
chinese['user']['userLevel'] = '账号角色'
chinese['user']['agentStatus'] = '代理状态'
chinese['user']['agentAdmin'] = '归属管理'
chinese['user']['agentTop'] = '归属站长'
chinese['user']['agentDirect'] = '归属代理'
chinese['user']['userActive'] = '会员状态'
chinese['user']['creater'] = '注册人'
chinese['user']['userTitle'] = '用户头衔'
chinese['user']['fromLink'] = '访问来源'
chinese['user']['loginTime'] = '最后登录时间'
chinese['user']['nextCanShow'] = '开启深度查询'
chinese['user']['mark1'] = '会员备注1'
chinese['user']['mark2'] = '会员备注2'
chinese['user']['mark3'] = '会员备注3'
chinese['user']['mark4'] = '会员备注4'
chinese['user']['mark5'] = '会员备注5'
chinese['user']['agentName'] = '归属代理'

chinese['adminLimit'] = {};
chinese['adminLimit']['formName'] = '权限分配'
chinese['adminLimit']['id'] = '编码'
chinese['adminLimit']['userID'] = '代理标识'
chinese['adminLimit']['userName'] = '代理账号'
chinese['adminLimit']['webSetting_siteLink'] = '可否修改本站的链接'
chinese['adminLimit']['webSetting_siteConfig'] = '可否修改本站的基本设置'
chinese['adminLimit']['webSetting_publicAuthorization'] = '可否开关自己网站的授权'
chinese['adminLimit']['webSetting_shareRequiredIP'] = '可否修改自己分享IP数要求'
chinese['adminLimit']['webSetting_shareRequiredUser'] = '可否修改自己注册数要求'
chinese['adminLimit']['webSetting_shareLimiteTime'] = '可否修改自己的授权持续的时间'
chinese['adminLimit']['webSetting_apiSelect'] = '可否修改默认显示的彩种'
chinese['adminLimit']['webSetting_defaultPlanID'] = '可否修改自己默认显示的计划'
chinese['adminLimit']['webSetting_historyLimit'] = '可否修改显示近N期的胜率'
chinese['adminLimit']['webSetting_leaderboardLimit'] = '可否修改排行榜，显示n条'
chinese['adminLimit']['webSetting_historyPlanShowLimit'] = '可否修改自己展示多少计划历史结果'
chinese['adminLimit']['webSetting_needAuthorize'] = '可否修改自己需要授权的彩种及条件'
chinese['adminLimit']['webSetting_stringUserTitle'] = '可否修改自己的网站的用户头衔'
chinese['adminLimit']['webSetting_registerQQ'] = '可否开关自己网站要注册要求QQ'
chinese['adminLimit']['webSetting_registerWechat'] = '可否开关自己网站要注册要求微信'
chinese['adminLimit']['webSetting_registerPhone'] = '可否开关自己网站要注册要求手机'
chinese['adminLimit']['webSetting_registerEmail'] = '可否开关自己网站要注册要求邮箱'
chinese['adminLimit']['webSetting_loginKeep'] = '可否修改本站登录的有效期'
chinese['adminLimit']['webSetting_csQQ'] = '可否修改本站客服QQ'
chinese['adminLimit']['webSetting_csQQGroup'] = '可否修改本站客服QQ群'
chinese['adminLimit']['webSetting_csWechat'] = '可否修改本站客服微信'
chinese['adminLimit']['webSetting_csEmail'] = '可否修改本站客服邮箱'
chinese['adminLimit']['webSetting_ezunLink'] = '可否提交BC官网注册链接'
chinese['adminLimit']['webSetting_autoEzunLink'] = '可否自动通过提交BC官网注册链接'
chinese['adminLimit']['webSetting_hk49plan1'] = '可否修改六合彩计划'
chinese['adminLimit']['webSetting_hk49plan2'] = '可否修改六合彩计划'
chinese['adminLimit']['webSetting_hk49plan3'] = '可否修改六合彩计划'
chinese['adminLimit']['webSetting_hk49plan4'] = '可否修改六合彩计划'
chinese['adminLimit']['webSetting_hk49plan5'] = '可否修改六合彩计划'
chinese['adminLimit']['webSetting_hk49PlanPoet'] = '可否修改打油诗'
chinese['adminLimit']['webSetting_hk49PlanPicture'] = '可否上传六合彩图片'
chinese['adminLimit']['webSetting_outLinkName'] = '可否修改外链名称（聊天室）'
chinese['adminLimit']['webSetting_bulletinShow'] = '可否开启公告弹窗'
chinese['adminLimit']['webSetting_baiduStatistics'] = '可否修改百度统计的代码'
chinese['adminLimit']['webSetting_updateUserPsw'] = '可否修改_会员可否修改自己的密码'
chinese['adminLimit']['webSetting_submitUpdateUserLevel'] = '可否修改_会员可否提交次级代理申请'
chinese['adminLimit']['webSetting_updateUserQQ'] = '可否修改_会员可否修改自己的QQ'
chinese['adminLimit']['webSetting_updateUserWechat'] = '可否修改_会员可否修改自己的邮箱'
chinese['adminLimit']['webSetting_updateUserPhone'] = '可否修改_会员可否修改自己的微信'
chinese['adminLimit']['webSetting_updateUserEmail'] = '可否修改_会员可否修改自己的手机'
chinese['adminLimit']['webSetting_mark1'] = '可否修改公告内容'
chinese['adminLimit']['webSetting_mark2'] = '可否修改广告图片设置'
chinese['adminLimit']['webSetting_mark3'] = '可否修改首页（图片）排版'
chinese['adminLimit']['webSetting_mark4'] = '可否修改开放彩种'
chinese['adminLimit']['webSetting_mark5'] = '可否修改优惠速递内容'
chinese['adminLimit']['user_userName'] = '可否修改下级会员账号'
chinese['adminLimit']['user_userPsw'] = '可否修改下级会员密码'
chinese['adminLimit']['user_userQQ'] = '可否修改会员资料中的联系方式qq'
chinese['adminLimit']['user_userWechat'] = '可否修改会员资料中的联系方式wechat'
chinese['adminLimit']['user_userPhone'] = '可否修改会员资料中的联系方式phone'
chinese['adminLimit']['user_userEmail'] = '可否修改会员资料中的联系方式email'
chinese['adminLimit']['user_verifyQQ'] = '可否手动验证会员的联系方式qq'
chinese['adminLimit']['user_verifyWechat'] = '可否手动验证会员的联系方式邮箱'
chinese['adminLimit']['user_verifyPhone'] = '可否手动验证会员的联系方式微信'
chinese['adminLimit']['user_verifyEmail'] = '可否手动验证会员的联系方式手机'
chinese['adminLimit']['create_user_3'] = '可否新增会员（归到直接下级）'
chinese['adminLimit']['create_user_2'] = '可否会员晋升代理（归到直接下级）'
chinese['adminLimit']['create_user_1'] = '可否代理晋升总代（归到直接下级）'
chinese['adminLimit']['user_authorizationStatus'] = '可否修改会员授权状态'
chinese['adminLimit']['show_all_user'] = '可否逐级查询代理'
chinese['adminLimit']['user_authorizationLimite'] = '可否修改会员授权时限'
chinese['adminLimit']['user_agentStatus'] = '可否修改下级代理密码'
chinese['adminLimit']['user_agentAdmin'] = '可否转移线下会员到其它代理'
chinese['adminLimit']['user_agentTop'] = '可否修改会员的归属总代'
chinese['adminLimit']['user_agentDirect'] = '可否修改会员的归属代理'
chinese['adminLimit']['user_userActive'] = '可否禁用下级会员'
chinese['adminLimit']['user_userTitle'] = '可否修改会员头衔'
chinese['adminLimit']['mark1'] = '权限管理备注1'
chinese['adminLimit']['mark2'] = '权限管理备注2'
chinese['adminLimit']['mark3'] = '权限管理备注3'
chinese['adminLimit']['mark4'] = '权限管理备注4'
chinese['adminLimit']['mark5'] = '权限管理备注5'
chinese['authorizationWBStatus'] = {}
chinese['authorizationWBStatus']['formName'] = '授权管理'
chinese['authorizationWBStatus']['userName'] = '会员账号'
chinese['authorizationWBStatus']['id'] = '唯一标识'
chinese['authorizationWBStatus']['userID'] = '会员标识'
chinese['authorizationWBStatus']['wbStatus'] = '会员授权状态'
chinese['authorizationWBStatus']['updateTime'] = '添加时间'
chinese['authorizationWBStatus']['updateIP'] = '添加ip'
chinese['authorizationWBStatus']['updater'] = '操作人'
chinese['api'] = {}
chinese['api']['formName'] = '计划配置'
chinese['api']['id'] = '编码'
chinese['api']['switch'] = '是否开启'
chinese['api']['lotteryID'] = '彩种代号'
chinese['api']['lotteryname'] = '彩种名称'
chinese['api']['link'] = '彩种api链接'
chinese['api']['dir'] = '数据存储文件夹'
chinese['api']['code'] = '开奖号码个数'
chinese['api']['strPlanName'] = '计划名称'
chinese['api']['strPosition'] = '玩法'
chinese['api']['strQis'] = '期数'
chinese['api']['strNumbers'] = '几码'
chinese['api']['str_numbers_show'] = '是否可选择几码'
chinese['api']['maxPeriod'] = '一天的期数'
chinese['api']['intervalPeriod'] = '每期间隔'
chinese['api']['delayPeriod'] = '封盘时间'
chinese['api']['defaultPlanQi'] = '默认几期(0:一期)'
chinese['api']['defaultPlanPosition'] = '默认玩法(0:第一种玩法)'
chinese['api']['defaultNumbers'] = '默认几码(0:第一种，参见 几码)'
chinese['api']['mark1'] = '排序（数字大在前）'
chinese['api']['mark2'] = '分类'
chinese['api']['mark3'] = '开奖时间|+'
chinese['api']['mark4'] = '计划API备注4'
chinese['api']['mark5'] = '计划API备注5'
chinese['shareIP'] = {}
chinese['shareIP']['formName'] = '分享IP管理'
chinese['shareIP']['id'] = '编码'
chinese['shareIP']['shareCode'] = '分享码'
chinese['shareIP']['createIP'] = 'ip'
chinese['shareIP']['createTime'] = '时间'
chinese['shareIP']['shareCount'] = '访问次数'
chinese['shareRegister'] = {}
chinese['shareRegister']['shareCode'] = '分享码'
chinese['shareRegister']['createIP'] = 'ip'
chinese['shareRegister']['createTime'] = '时间'
chinese['shareRegister']['userID'] = '时间'
chinese['logLogin'] = {}
chinese['logLogin']['formName'] = '登录日志'
chinese['logLogin']['id'] = '编码'
chinese['logLogin']['userID'] = '会员标识'
chinese['logLogin']['userName'] = '会员账号'
chinese['logLogin']['loginTime'] = '时间'
chinese['logLogin']['loginIP'] = 'IP'
chinese['logLogin']['loginLink'] = '登录的网址'
chinese['logLogin']['fromLink'] = '来源网址'
chinese['logLogin']['loginToken'] = '会话状态'
chinese['logLogin']['loginTokenTime'] = ''
chinese['logSubmit'] = {}
chinese['logSubmit']['formName'] = '提交日志'
chinese['logSubmit']['id'] = '编码'
chinese['logSubmit']['creater'] = '提交ID'
chinese['logSubmit']['createName'] = '提交账号'
chinese['logSubmit']['actor'] = '更改ID'
chinese['logSubmit']['actorName'] = '更改账号'
chinese['logSubmit']['form'] = '表名'
chinese['logSubmit']['formKey'] = '字段名'
chinese['logSubmit']['formValue'] = '变更值'
chinese['logSubmit']['submitTime'] = '提交时间'
chinese['logSubmit']['doneTime'] = '操作时间'
chinese['logSubmit']['result'] = '操作结果'
Vue.prototype.$chinese = chinese;



const writeType = {};
writeType['webSetting'] = {};
writeType['webSetting']['formName'] = '网站设置'
writeType['webSetting']['id'] = 'no' //'唯一标识'
writeType['webSetting']['userID'] = 'no' //'代理标识'
writeType['webSetting']['userName'] = 'no' //'代理账号'
writeType['webSetting']['userLevel'] = 'select'// '角色（层级）（总1次2会3）'
writeType['webSetting']['userLevel_options'] = [{
  value: '1',
  label: '站长'
}, {
  value: '2',
  label: '代理'
}, {
  value: '3',
  label: '会员'
}]
writeType['webSetting']['siteLink'] = 'input' //'计划官网链接'
writeType['webSetting']['siteConfig'] = 'multiline' //'计划官网基本设置'
writeType['webSetting']['siteConfig_options'] = ["网站名称", "slogan标语","网站logo","模版背景色","计划页面标语"]
writeType['webSetting']['publicAuthorization'] = 'select'//'全局授权(0都可见1需授权，先填写下一个ip数要求再开启)'
writeType['webSetting']['publicAuthorization_options'] = [{
  value: '0',
  label: '关闭授权，所有人可见'
}, {
  value: '1',
  label: '开启授权，仅授权的用户可见'
}]
writeType['webSetting']['shareRequiredIP'] = 'input' //'分享IP数要求'
writeType['webSetting']['shareRequiredUser'] = 'input' //'分享注册数要求'
writeType['webSetting']['shareLimiteTime'] = 'multiline' // '授权的持续的时间'
writeType['webSetting']['shareLimiteTime_options'] = ["分享授权", "荣誉授权"]
writeType['webSetting']['apiSelect'] = 'select'// '默认显示的彩种'
writeType['webSetting']['apiSelect_options'] = [{
  value: '1',
  label: '第1个彩种'
}, {
  value: '2',
  label: '第2个彩种'
}, {
  value: '3',
  label: '第3个彩种'
}, {
  value: '4',
  label: '第4个彩种'
}, {
  value: '5',
  label: '第5个彩种'
}, {
  value: '6',
  label: '第6个彩种'
}, {
  value: '7',
  label: '第7个彩种'
}, {
  value: '8',
  label: '第8个彩种'
}, {
  value: '9',
  label: '第9个彩种'
}]
writeType['webSetting']['defaultPlanID'] = 'select'//'默认显示当前胜率第几名计划'
writeType['webSetting']['defaultPlanID_options'] = [{
  value: '1',
  label: '第1名'
}, {
  value: '2',
  label: '第2名'
}, {
  value: '3',
  label: '第3名'
}, {
  value: '4',
  label: '第4名'
}, {
  value: '5',
  label: '第5名'
}, {
  value: '6',
  label: '第6名'
}, {
  value: '7',
  label: '第7名'
}, {
  value: '8',
  label: '第8名'
}, {
  value: '9',
  label: '第9名'
}, {
  value: '10',
  label: '第10名'
}]
writeType['webSetting']['historyLimit'] = 'input' //'显示近N期的胜率'
writeType['webSetting']['leaderboardLimit'] = 'input' //'排行榜，显示n条'
writeType['webSetting']['historyPlanShowLimit'] = 'input' //'展示多少计划历史结果'
writeType['webSetting']['needAuthorize'] = 'multiline' // '需要授权的条件（彩种|胜率排行第n-m名）'
writeType['webSetting']['needAuthorize_options'] = ["彩种", "胜率排行第n-m名"]

writeType['webSetting']['stringUserTitle'] = 'input' // '设置用户头衔'
writeType['webSetting']['registerQQ'] = 'select'//'注册是否要填QQ'
writeType['webSetting']['registerQQ_options'] = [{
  value: '0',
  label: '否，隐藏此项'
}, {
  value: '1',
  label: '是，必填此项'
}, {
  value: '2',
  label: '是，选填此项'
}]
writeType['webSetting']['registerWechat'] = 'select'// '注册是否要填微信'
writeType['webSetting']['registerWechat_options'] = [{
  value: '0',
  label: '否，隐藏此项'
}, {
  value: '1',
  label: '是，必填此项'
}, {
  value: '2',
  label: '是，选填此项'
}]
writeType['webSetting']['registerPhone'] = 'select'//'注册是否要填手机'
writeType['webSetting']['registerPhone_options'] = [{
  value: '0',
  label: '否，隐藏此项'
}, {
  value: '1',
  label: '是，必填此项'
}, {
  value: '2',
  label: '是，选填此项'
}]
writeType['webSetting']['registerEmail'] = 'select'//'注册是否要填邮箱'
writeType['webSetting']['registerEmail_options'] = [{
  value: '0',
  label: '否，隐藏此项'
}, {
  value: '1',
  label: '是，必填此项'
}, {
  value: '2',
  label: '是，选填此项'
}]
writeType['webSetting']['loginKeep'] = 'select'// '用户登录的有效期'
writeType['webSetting']['loginKeep_options'] = [{
  value: '5',
  label: '5分钟'
}, {
  value: '10',
  label: '10分钟'
}, {
  value: '30',
  label: '30分钟'
}, {
  value: '60',
  label: '1小时'
}]
writeType['webSetting']['csQQ'] = 'multiline' //'网站客服QQ（||分割多个，随机展示）'
writeType['webSetting']['csQQ_options'] = ["QQ号", "二维码图片", "QQ打开链接"]

writeType['webSetting']['csQQGroup'] = 'multiline' //'网站客服QQ群（||分割多个，随机展示）'
writeType['webSetting']['csQQGroup_options'] = ["群号", "群二维码图片", "群链接"]

writeType['webSetting']['csWechat'] = 'multiline' // '网站客服微信（||分割多个，随机展示）'
writeType['webSetting']['csWechat_options'] = ["微信号", "二维码图片", "微信打开链接"]

writeType['webSetting']['csEmail'] = 'multiline' //'网站客服邮箱（||分割多个，随机展示）'
writeType['webSetting']['csEmail_options'] = ["邮箱地址"]

writeType['webSetting']['ezunLink'] = 'input' // 'BC官网注册链接'
writeType['webSetting']['autoEzunLink'] = 'select'//'自动修改注册链接'
writeType['webSetting']['autoEzunLink_options'] = [{
  value: '0',
  label: '关闭'
}, {
  value: '1',
  label: '开启'
}]
writeType['webSetting']['hk49plan1'] = 'input'// '六合彩计划-标题'
writeType['webSetting']['hk49plan2'] = 'multiline' //'六合彩计划-精品推荐'
writeType['webSetting']['hk49plan2_options'] = ["精品方案", "具体计划"]

writeType['webSetting']['hk49plan3'] = 'multiline' //'六合彩计划-生肖投注'
writeType['webSetting']['hk49plan3_options'] = ["生肖方案", "具体计划"]

writeType['webSetting']['hk49plan4'] = 'multiline' //'六合彩计划-特码投注'
writeType['webSetting']['hk49plan4_options'] = ["特码方案", "具体计划"]

writeType['webSetting']['hk49plan5'] = 'multiline' //'六合彩计划-特别投注'
writeType['webSetting']['hk49plan5_options'] = ["特别投注", "具体计划"]

writeType['webSetting']['hk49PlanPoet'] = 'multiline' //'六合打油诗'
writeType['webSetting']['hk49PlanPoet_options'] = ["打油诗分行"]

writeType['webSetting']['hk49PlanPicture'] = 'input'// '六合图'
writeType['webSetting']['outLinkName'] = 'input'// '一个外链名称'
writeType['webSetting']['bulletinShow'] = 'select'//'开启公告弹窗'
writeType['webSetting']['bulletinShow_options'] = [{
  value: '0',
  label: '关闭'
}, {
  value: '1',
  label: '开启'
}]
writeType['webSetting']['baiduStatistics'] = 'input'//'百度统计的代码'
writeType['webSetting']['updateUserPsw'] = 'select'// '会员可否修改自己的密码'
writeType['webSetting']['updateUserPsw_options'] = [{
  value: '0',
  label: '禁止'
}, {
  value: '1',
  label: '允许'
}]
writeType['webSetting']['submitUpdateUserLevel'] = 'select'//'会员可否提交次级代理申请'
writeType['webSetting']['submitUpdateUserLevel_options'] = [{
  value: '0',
  label: '禁止'
}, {
  value: '1',
  label: '允许'
}]
writeType['webSetting']['updateUserQQ'] = 'select'// '会员可否修改自己的QQ'
writeType['webSetting']['updateUserQQ_options'] = [{
  value: '0',
  label: '禁止'
}, {
  value: '1',
  label: '允许'
}]
writeType['webSetting']['updateUserWechat'] = 'select'//'会员可否修改自己的邮箱'
writeType['webSetting']['updateUserWechat_options'] = [{
  value: '0',
  label: '禁止'
}, {
  value: '1',
  label: '允许'
}]
writeType['webSetting']['updateUserPhone'] = 'select'//'会员可否修改自己的微信'
writeType['webSetting']['updateUserPhone_options'] = [{
  value: '0',
  label: '禁止'
}, {
  value: '1',
  label: '允许'
}]
writeType['webSetting']['updateUserEmail'] = 'select'// '会员可否修改自己的手机'
writeType['webSetting']['updateUserEmail_options'] = [{
  value: '0',
  label: '禁止'
}, {
  value: '1',
  label: '允许'
}]
writeType['webSetting']['mark1'] = 'multiline'//'公告内容'
writeType['webSetting']['mark1_options'] = ["分行"]
writeType['webSetting']['mark2'] = 'multiline'//'广告图片设置'
writeType['webSetting']['mark2_options'] = ["右上角图片地址","右上角点击链接","计划页首图片","计划页首链接","计划页尾图片","计划页尾链接",]
writeType['webSetting']['mark3'] = 'multiline'//'首页（图片）排版'
writeType['webSetting']['mark3_options'] = ["小标题","图片1","图片1文字","图片2","图片2文字","图片3","图片3文字","图片4","图片4文字"]
writeType['webSetting']['mark4'] = 'multiline'//multiline'开放彩种'pk10-js||pk10-js-xy||lucky-air-ship||ffssc||pc28||pk10-bj||vr-sxffc||cqssc||ffssclt
writeType['webSetting']['mark4_options'] = ["彩种代码"]
writeType['webSetting']['mark5'] = 'editor'//'优惠速递'


writeType['user'] = {};
writeType['user']['formName'] = '会员资料'
writeType['user']['id'] =  'no'//'编码'
writeType['user']['userName'] =  'input'//'会员账号'
writeType['user']['userPsw'] =  'input'//'会员密码'
writeType['user']['userQQ'] =  'input'//'联系QQ'
writeType['user']['userWechat'] =  'input'//'联系微信'
writeType['user']['userPhone'] =  'input'//'联系电话'
writeType['user']['userEmail'] =  'input'//'联系邮箱'
writeType['user']['verifyQQ'] =  'select'// '验证QQ（0未1已）'
writeType['user']['verifyQQ_options'] = [{
  value: '0',
  label: '未验证'
}, {
  value: '1',
  label: '已验证'
}]
writeType['user']['verifyWechat'] =  'select'// '验证邮箱（0未1已）'
writeType['user']['verifyWechat_options'] = [{
  value: '0',
  label: '未验证'
}, {
  value: '1',
  label: '已验证'
}]
writeType['user']['verifyPhone'] = 'select'//  '验证微信（0未1已）'
writeType['user']['verifyPhone_options'] = [{
  value: '0',
  label: '未验证'
}, {
  value: '1',
  label: '已验证'
}]
writeType['user']['verifyEmail'] = 'select'//  '验证手机（0未1已）'
writeType['user']['verifyEmail_options'] = [{
  value: '0',
  label: '未验证'
}, {
  value: '1',
  label: '已验证'
}]
writeType['user']['registerTime'] =  'input'//'注册时间'
writeType['user']['registerIP'] = 'input'//'注册IP'
writeType['user']['shareCode'] = 'input'//'分享码'
writeType['user']['authorizationStatus'] = 'select'// '授权状态（0未1已2待3特别）'
writeType['user']['authorizationStatus_options'] = [{
  value: '0',
  label: '未授权'
}, {
  value: '1',
  label: '已授权'
}, {
  value: '2',
  label: '待审核'
}, {
  value: '3',
  label: '荣誉授权'
}]
writeType['user']['authorizationTime'] = 'input'//'授权时间'
writeType['user']['authorizationLimite'] ='input'// '授权时限（几天，0永久）'
writeType['user']['userLevel'] = 'select'// '角色 层级（总1次2会3）'
writeType['user']['userLevel_options'] = [{
  value: '1',
  label: '站长'
}, {
  value: '2',
  label: '代理'
}, {
  value: '3',
  label: '会员'
}]
writeType['user']['agentStatus'] = 'select'//'代理状态'
writeType['user']['agentStatus_options'] = [{
  value: '0',
  label: '会员'
}, {
  value: '1',
  label: '代理'
}]
writeType['user']['agentAdmin'] = 'input'//'归属管理'
writeType['user']['agentTop'] = 'input'//'归属总代'
writeType['user']['agentDirect'] = 'input'//'归属代理'
writeType['user']['userActive'] = 'select'//'会员状态（0禁用1正常）'
writeType['user']['userActive_options'] = [{
  value: '0',
  label: '禁用'
}, {
  value: '1',
  label: '正常'
}]
writeType['user']['creater'] ='input'// '注册人'
writeType['user']['userTitle'] = 'select'// '用户头衔（1、2、3...）'
writeType['user']['userTitle_options'] = [{ //需要获取
  value: '1',
  label: '第1级'
}, {
  value: '2',
  label: '第2级'
}, {
  value: '3',
  label: '第3级'
}, {
  value: '4',
  label: '第4级'
}, {
  value: '5',
  label: '第5级'
}]
writeType['user']['fromLink'] = 'input'//'访问来源'
writeType['user']['loginTime'] = 'input'//'最后登录时间'
writeType['user']['nextCanShow'] = 'select'// '开启深度查询' 
writeType['user']['nextCanShow_options'] = [{
  value: '0',
  label: '未开启，只能查询到直接下线'
}, {
  value: '1',
  label: '已开启，可以深度查询到N级下线'
}]
writeType['user']['mark1'] = 'input'//'备注1'
writeType['user']['mark2'] = 'input'//'备注2'
writeType['user']['mark3'] = 'input'//'备注3'
writeType['user']['mark4'] = 'input'//'备注4'
writeType['user']['mark5'] = 'input'//'备注5'



writeType['adminLimit'] = {};
writeType['adminLimit']['formName'] = '权限分配'
writeType['adminLimit']['id'] = '编码'
writeType['adminLimit']['userID'] = '代理标识'
writeType['adminLimit']['userName'] = '代理账号'
writeType['adminLimit']['webSetting_siteLink'] = '可否修改本站的链接'
writeType['adminLimit']['webSetting_siteConfig'] = '可否修改本站的基本设置'
writeType['adminLimit']['webSetting_publicAuthorization'] = '可否开关自己网站的授权'
writeType['adminLimit']['webSetting_shareRequiredIP'] = '可否修改自己分享IP数要求'
writeType['adminLimit']['webSetting_shareRequiredUser'] = '可否修改自己注册数要求'
writeType['adminLimit']['webSetting_shareLimiteTime'] = '可否修改自己的授权持续的时间'
writeType['adminLimit']['webSetting_apiSelect'] = '可否修改默认显示的彩种'
writeType['adminLimit']['webSetting_defaultPlanID'] = '可否修改自己默认显示的计划'
writeType['adminLimit']['webSetting_historyLimit'] = '可否修改显示近N期的胜率'
writeType['adminLimit']['webSetting_leaderboardLimit'] = '可否修改排行榜，显示n条'
writeType['adminLimit']['webSetting_historyPlanShowLimit'] = '可否修改自己展示多少计划历史结果'
writeType['adminLimit']['webSetting_needAuthorize'] = '可否修改自己需要授权的彩种及条件'
writeType['adminLimit']['webSetting_stringUserTitle'] = '可否修改自己的网站的用户头衔'
writeType['adminLimit']['webSetting_registerQQ'] = '可否开关自己网站要注册要求QQ'
writeType['adminLimit']['webSetting_registerWechat'] = '可否开关自己网站要注册要求微信'
writeType['adminLimit']['webSetting_registerPhone'] = '可否开关自己网站要注册要求手机'
writeType['adminLimit']['webSetting_registerEmail'] = '可否开关自己网站要注册要求邮箱'
writeType['adminLimit']['webSetting_loginKeep'] = '可否修改本站登录的有效期'
writeType['adminLimit']['webSetting_csQQ'] = '可否修改本站客服QQ'
writeType['adminLimit']['webSetting_csQQGroup'] = '可否修改本站客服QQ群'
writeType['adminLimit']['webSetting_csWechat'] = '可否修改本站客服微信'
writeType['adminLimit']['webSetting_csEmail'] = '可否修改本站客服邮箱'
writeType['adminLimit']['webSetting_ezunLink'] = '可否提交BC官网注册链接'
writeType['adminLimit']['webSetting_autoEzunLink'] = '可否自动通过提交BC官网注册链接'
writeType['adminLimit']['webSetting_hk49plan1'] = '可否修改六合彩计划'
writeType['adminLimit']['webSetting_hk49plan2'] = '可否修改六合彩计划'
writeType['adminLimit']['webSetting_hk49plan3'] = '可否修改六合彩计划'
writeType['adminLimit']['webSetting_hk49plan4'] = '可否修改六合彩计划'
writeType['adminLimit']['webSetting_hk49plan5'] = '可否修改六合彩计划'
writeType['adminLimit']['webSetting_hk49PlanPoet'] = '可否修改打油诗'
writeType['adminLimit']['webSetting_hk49PlanPicture'] = '可否上传六合彩图片'
writeType['adminLimit']['webSetting_outLinkName'] = '可否修改外链名称（聊天室）'
writeType['adminLimit']['webSetting_bulletinShow'] = '可否开启广告弹窗'
writeType['adminLimit']['webSetting_baiduStatistics'] = '可否修改百度统计的代码'
writeType['adminLimit']['webSetting_updateUserPsw'] = '可否修改_会员可否修改自己的密码'
writeType['adminLimit']['webSetting_submitUpdateUserLevel'] = '可否修改_会员可否提交次级代理申请'
writeType['adminLimit']['webSetting_updateUserQQ'] = '可否修改_会员可否修改自己的QQ'
writeType['adminLimit']['webSetting_updateUserWechat'] = '可否修改_会员可否修改自己的邮箱'
writeType['adminLimit']['webSetting_updateUserPhone'] = '可否修改_会员可否修改自己的微信'
writeType['adminLimit']['webSetting_updateUserEmail'] = '可否修改_会员可否修改自己的手机'
writeType['adminLimit']['webSetting_mark1'] = '可否修改公告内容'
writeType['adminLimit']['webSetting_mark2'] = '可否修改顶部图片'
writeType['adminLimit']['webSetting_mark3'] = '可否修改首页（图片）排版'
writeType['adminLimit']['webSetting_mark4'] = '可否修改备注4'
writeType['adminLimit']['webSetting_mark5'] = '可否修改备注5'
writeType['adminLimit']['user_userName'] = '可否修改下级会员账号'
writeType['adminLimit']['user_userPsw'] = '可否修改下级会员密码'
writeType['adminLimit']['user_userQQ'] = '可否修改会员资料中的联系方式qq'
writeType['adminLimit']['user_userWechat'] = '可否修改会员资料中的联系方式wechat'
writeType['adminLimit']['user_userPhone'] = '可否修改会员资料中的联系方式phone'
writeType['adminLimit']['user_userEmail'] = '可否修改会员资料中的联系方式email'
writeType['adminLimit']['user_verifyQQ'] = '可否手动验证会员的联系方式qq'
writeType['adminLimit']['user_verifyWechat'] = '可否手动验证会员的联系方式邮箱'
writeType['adminLimit']['user_verifyPhone'] = '可否手动验证会员的联系方式微信'
writeType['adminLimit']['user_verifyEmail'] = '可否手动验证会员的联系方式手机'
writeType['adminLimit']['create_user_3'] = '可否新增会员（归到直接下级）'
writeType['adminLimit']['create_user_2'] = '可否会员晋升代理（归到直接下级）'
writeType['adminLimit']['create_user_1'] = '可否代理晋升总代（归到直接下级）'
writeType['adminLimit']['user_authorizationStatus'] = '可否修改会员授权状态'
writeType['adminLimit']['show_all_user'] = '可否逐级查询代理'
writeType['adminLimit']['user_authorizationLimite'] = '可否修改会员授权时限'
writeType['adminLimit']['user_agentStatus'] = '可否修改下级代理密码'
writeType['adminLimit']['user_agentAdmin'] = '可否转移线下会员到其它代理'
writeType['adminLimit']['user_agentTop'] = '可否修改会员的归属总代'
writeType['adminLimit']['user_agentDirect'] = '可否修改会员的归属代理'
writeType['adminLimit']['user_userActive'] = '可否禁用下级会员'
writeType['adminLimit']['user_userTitle'] = '可否修改会员头衔'
writeType['adminLimit']['mark1'] = '权限管理备注1'
writeType['adminLimit']['mark2'] = '权限管理备注2'
writeType['adminLimit']['mark3'] = '权限管理备注3'
writeType['adminLimit']['mark4'] = '权限管理备注4'
writeType['adminLimit']['mark5'] = '权限管理备注5'



writeType['authorizationWBStatus'] = {}
writeType['authorizationWBStatus']['formName'] = '授权管理'
writeType['authorizationWBStatus']['userName'] = '会员账号'
writeType['authorizationWBStatus']['id'] = '唯一标识'
writeType['authorizationWBStatus']['userID'] = '会员标识'
writeType['authorizationWBStatus']['wbStatus'] = '会员授权状态'
writeType['authorizationWBStatus']['updateTime'] = '添加时间'
writeType['authorizationWBStatus']['updateIP'] = '添加ip'
writeType['authorizationWBStatus']['updater'] = '操作人'
writeType['api'] = {}
writeType['api']['formName'] = '计划配置'
writeType['api']['id'] = '编码'
writeType['api']['switch']= 'select'//是否开启'
writeType['api']['switch_options'] = [{
  value: '0',
  label: '关闭'
}, {
  value: '1',
  label: '开启'
}]
writeType['api']['lotteryID'] ='input'// '彩种代号'
writeType['api']['lotteryname'] = 'input'//'彩种名称'
writeType['api']['link'] = 'input'//'彩种api链接'
writeType['api']['dir'] = 'input'//'数据存储文件夹'
writeType['api']['code'] = 'input'//'开奖号码个数'
writeType['api']['strPlanName'] ='input'// '计划名称'
writeType['api']['strPosition'] ='input'// '玩法'
writeType['api']['strQis'] ='input'// '期数'
writeType['api']['strNumbers'] = 'input'//'几码'
writeType['api']['str_numbers_show'] = 'input'//'是否可选择几码'
writeType['api']['maxPeriod'] ='input'// '一天的期数'
writeType['api']['intervalPeriod'] ='input'// '每期间隔'
writeType['api']['delayPeriod'] = 'input'//'封盘时间'
writeType['api']['defaultPlanQi'] ='input'// '默认几期'
writeType['api']['defaultPlanPosition'] = 'input'//'默认玩法'
writeType['api']['defaultNumbers'] = 'input'//'默认几码'
writeType['api']['mark1'] = 'input'//'排序（数字大在前）'
writeType['api']['mark2'] = 'input'//'分类'
writeType['api']['mark3'] ='multiline'// '开奖时间|+' 
writeType['api']['mark3_options'] = ["开奖时间","+号表示结束时间为次日","结束时间"]
writeType['api']['mark4'] = 'input'//'备注4'
writeType['api']['mark5'] = 'input'//'备注5'
writeType['shareIP'] = {}
writeType['shareIP']['formName'] = '分享IP管理'
writeType['shareIP']['id'] = '编码'
writeType['shareIP']['shareCode'] = '分享码'
writeType['shareIP']['createIP'] = 'ip'
writeType['shareIP']['createTime'] = '时间'
writeType['shareIP']['shareCount'] = '访问次数'
writeType['shareRegister'] = {}
writeType['shareRegister']['shareCode'] = '分享码'
writeType['shareRegister']['createIP'] = 'ip'
writeType['shareRegister']['createTime'] = '时间'
writeType['shareRegister']['userID'] = '时间'
writeType['logLogin'] = {}
writeType['logLogin']['formName'] = '登录日志'
writeType['logLogin']['id'] = '编码'
writeType['logLogin']['userID'] = '会员标识'
writeType['logLogin']['userName'] = '会员账号'
writeType['logLogin']['loginTime'] = '时间'
writeType['logLogin']['loginIP'] = 'IP'
writeType['logLogin']['loginLink'] = '登录的网址'
writeType['logLogin']['fromLink'] = '来源网址'
writeType['logLogin']['loginToken'] = '会话状态'
writeType['logLogin']['loginTokenTime'] = ''
writeType['logSubmit'] = {}
writeType['logSubmit']['formName'] = '提交日志'
writeType['logSubmit']['id'] = '编码'
writeType['logSubmit']['creater'] = '提交ID'
writeType['logSubmit']['createName'] = '提交账号'
writeType['logSubmit']['actor'] = '更改ID'
writeType['logSubmit']['actorName'] = '更改账号'
writeType['logSubmit']['form'] = '表名'
writeType['logSubmit']['formKey'] = '字段名'
writeType['logSubmit']['formValue'] = '变更值'
writeType['logSubmit']['submitTime'] = '提交时间'
writeType['logSubmit']['doneTime'] = '操作时间'
writeType['logSubmit']['result'] = '操作结果'
Vue.prototype.$writeType = writeType;



var markmarkmark = 1
Vue.directive('loadmore', {

  bind(el, binding) {

    const selectWrap = el.querySelector('.el-table__body-wrapper')

    selectWrap.addEventListener('scroll', function () {

      let sign = 100

      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;


      markmarkmark = markmarkmark ? Number(markmarkmark) + 1 : "1";
      //scrollHeight属性代表元素对象真实的宽高，即使有一部分看不到
      //scrollTop也是元素垂直滚动了的距离，或者是元素卷帘卷走的视觉中看不到的部分
      //scrollHeight  = clientHeight + scrollTop：当这两个条件成立时，也就代表垂直滚动条走到底了


      // console.log("sessionStorage.scrollTop=" + sessionStorage.scrollTop);
      // console.log(" this.scrollTop=" + this.scrollTop);
      var move = sessionStorage.scrollTop - this.scrollTop;

      var up = move > 0 ? " up " : " down ";

      // console.log("-------" + markmarkmark + "-------" + up + "--------scrollDistance=" + scrollDistance);

      sessionStorage.scrollTop = this.scrollTop;

      if (scrollDistance <= sign && move < 0) {

        console.log("scrollDistance <= sign     (" + scrollDistance);

        binding.value()

      }

    })

  }

});


new Vue({
  render: h => h(App)
}).$mount("#app");
