/* 后台返回消息提示 */
import { Message } from 'element-ui';

// 后台返回异常提示
export default {
  errorMsg: function(response) {
    let local = window.location.origin;
    /* if (local.indexOf('localhost') != -1) {
      local = 'http://www.gicdev.com';
    } */
    if (response.errorCode != 1) {
      if (response.errorCode == 4) {
        window.location.href = local + '/haoban-web/#/login';
        return false;
      }
      if (response.errorCode == 10) {
        window.location.href = local + '/haoban-web/#/index';
        return false;
      }
      Message.error({
        duration: 1000,
        message: response.message
      });
    }
  }
};
