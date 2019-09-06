//自定义的Vue插件-----通用工具
var Utils = {};
Utils.install = function (Vue, options) {
  //封装的ajax
  Vue.prototype.$ajax = function (args) {
    if (args.error == undefined || args.error == null) {
      args.error = function (err) {
        console.log(err);
      }
    }
    if (args.complete == undefined || args.complete == null) {
      args.error = function (XHR, TS) {
        XHR = null; //回收资源
      }
    }
    if (args.async == undefined || args.async == null) {
      args.async = false
    }
    $.ajax({
      type: "get",
      contentType: "application/json; charset=utf-8",
      dataType: "jsonp",
      jsonp: "callback",
      async: args.async,
      data: args.data,
      url: args.url,
      success: args.success,
      error: args.error,
      complete: args.error.complete
    });
  };
}
module.exports = Utils;
