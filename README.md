# office-web

> 好办后台前端代码

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## 说明文档

- [好办后台路由结构图](http://115.159.76.241/office/office-web/blob/dev/haoban-router-constructor.png)
- [好办后台整体使用说明](http://115.159.76.241/office/office-web/blob/dev/instructions.md)


## 上线跟随项目

- [好办App webview 项目 - office-mobile](http://115.159.76.241/office/office-mobile)
- [好办旧版项目- haoban-old](http://115.159.76.241/office/haoban-old)
- [好办运维后台项目- haoban-devOps](http://115.159.76.241/office/haobanDevOps)

## 注意

>由于自定义 header 头增加 haobanSign 字段（即企业id）,本地调试有些请求会有 options 预检请求，可以先注释下面代码， build 时候再放开注释；    
```
# src/api/api.js
if (!!localStorage.getItem('userInfo')) {
  let haobanSign = JSON.parse(localStorage.getItem('userInfo')).enterpriseId;
  Vue.axios.defaults.headers.post['haobansign'] = haobanSign;
  Vue.axios.defaults.headers.get['haobansign'] = haobanSign;
}
```

- 线上环境

```
# 注释（开发本地调试需放开注释）
/* if (local.indexOf('localhost') != -1) {
  local = 'http://www.gicdev.com';
} */
```
