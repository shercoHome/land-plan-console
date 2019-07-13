// vue.config.js
module.exports = {
  // 选项...
  
  //空字符串 ('') 或是相对路径 ('./')，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径
  publicPath: "./"
  ,
  devServer: {
    disableHostCheck: true,
  //  proxy: {
 
          // 当你请求是以/api开头的时候，则我帮你代理访问到http://localhost:3000
          // 例如：
          // /api/users  http://localhost:3000/api/users
          // 我们真是服务器接口是没有/api的 
          //用代理, 首先你得有一个标识, 告诉他你这个连接要用代理. 不然的话, 可能你的 html, css, js这些静态资源都跑去代理. 所以我们只要接口用代理, 静态文件用本地.
          // ‘/api’: {}, 就是告诉node, 我接口只要是’/api’开头的才用代理.所以你的接口就要这么写 /api/xx/xx. 最后代理的路径就是 http://xxx.xx.com/api/xx/xx.
          // 可是不对啊, 我正确的接口路径里面没有/api啊. 所以就需要 pathRewrite,用”^/api”:”, 把’/api’去掉, 这样既能有正确标识, 又能在请求接口的时候去掉api.
          
          //   "/api":{
          //     target:"http://localhost:3000",
          //     pathRewrite:{"^/api":""}
          // }
    //}
  }
}