import Vue from 'vue';
// import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';

/**
 * 获取好办 企业 id
 */
if (!!localStorage.getItem('userInfo')) {
  let haobanSign = JSON.parse(localStorage.getItem('userInfo')).enterpriseId;
  Vue.axios.defaults.headers.post['haobansign'] = haobanSign;
  Vue.axios.defaults.headers.get['haobansign'] = haobanSign;
}

Vue.axios.defaults.timeout = 25000;
let local = window.location.origin;
/* if (local.indexOf('localhost') != -1) {
  local = 'http://www.gicdev.com';
} */

Vue.axios.interceptors.request.use(
  config => {
    return config;
  },
  err => {
    Message.error({ message: '请求超时!' });
    return Promise.resolve(err);
  }
);

Vue.axios.interceptors.response.use(
  data => {
    // console.log(data);
    if (data.status && data.status == 200 && data.data.errorCode != 1) {
      // Message.error({message: data.data.message});
      if (data.data.errorCode == 4) {
        window.location.href = local + '/haoban-web/#/login';
      }
      if (data.data.errorCode == 10 || data.data.errorCode == 7) {
        window.location.href = local + '/haoban-web/#/index';
      }
      return data;
    }
    return data;
  },
  err => {
    // Message.error({message: err.response.message});
    if (err.response.status == 504 || err.response.status == 404) {
      // window.location.href= local + "/haoban-web/#/login"
      // Message.error({message: '服务异常⊙﹏⊙∥'});
    } else if (err.response.status == 403) {
      // window.location.href= local + "/haoban-web/#/login"
      // Message.error({message: '权限不足,请联系管理员!'});
    } else {
      // window.location.href= local + "/haoban-web/#/login"
      // Message.error({message: '未知错误!'});
    }
    return Promise.resolve(err);
  }
);

/*
 *
 * 统一 get 请求方法
 * @url: 请求的 url
 * @params: 请求带的参数
 * @header: 带 token
 *
 */
export const getRequest = (url, params) => {
  params.requestProject = 'haoban-manage-web';
  return Vue.axios({
    method: 'get',
    url: `${local}${url}`,
    data: {},
    params: params,
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    } // "token": token
  });
};

/**
 *
 * 统一 post 请求方法
 * url: 请求的 url
 * @params: 请求带的参数
 * @header:
 *
 */
export const postRequest = (url, params) => {
  params.requestProject = 'haoban-manage-web';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: qs.stringify(params),
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    } //multipart/form-data{"token": token}
  });
};

export const postJsonRequest = (url, params) => {
  params.requestProject = 'haoban-manage-web';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: '{}',
    params: params,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' } //multipart/form-data{"token": token}
  });
};

/**
 * method: 'post'
 * 'Content-Type': 'application/json;charset=UTF-8'
 * @data: params
 * @requestProject: 'haoban-manage-web'
 *
 */
export const postJson = (url, params) => {
  // params.requestProject = "haoban-manage-web";
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: params,
    params: { requestProject: 'haoban-manage-web' },
    // withCredentials: true,
    // credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' } //multipart/form-data{"token": token}
  });
};

/**
 *  method: 'post'
 *  data: params
 *
 */
export const postForm = (url, params) => {
  params.requestProject = 'haoban-manage-web';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: params,
    headers: {} //'content-type': 'application/x-www-form-urlencoded'multipart/form-data{"token": token}
  });
};

/**
 * post excel
 */

export const postExcel = (url, params) => {
  params.requestProject = 'haoban-manage-web';
  return Vue.axios({
    method: 'post',
    url: `${local}${url}`,
    data: qs.stringify(params),
    responseType: 'blob',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    } //multipart/form-data{"token": token}
  });
};
