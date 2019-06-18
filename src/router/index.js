import Vue from 'vue';
import Router from 'vue-router';
import _import from './_import.js';
Vue.use(Router);

// const error403 = (r) => {
//   import('views/errorPage/403.vue').then((module) => {
//     r(module)
//   })
// };
// const error404 = (r) => {
//   import('views/errorPage/404.vue').then((module) => {
//     r(module)
//   })
// };
// const error500 = (r) => {
//   import('views/errorPage/500.vue').then((module) => {
//     r(module)
//   })
// };
const errorPage = r => {
  import('views/errorPage/index.vue').then(module => {
    r(module);
  });
};
// 页面刷新时，重新赋值token

if (window.sessionStorage.getItem('token')) {
  /* eslint-disable */
  store.commit(types.LOGIN, window.sessionStorage.getItem('token'));
}
export const constantRouterMap = [
         {
           path: '/',
           name: '/',
           redirect: 'login'
         },
         {
           path: '/login',
           name: '登录',
           component: _import('login', 'index')
         },
         {
           path: '/index',
           name: 'index',
           component: _import('index', 'index')
         },
         {
           path: '/sign',
           name: 'index',
           component: _import('sign', 'index')
         },
         {
           path: '/contacts',
           name: '通讯录',
           redirect: 'administrativeFrame',
           component: _import('contacts', 'index'),
           children: [
             // 通讯录
             {
               path: '/administrativeFrame',
               name: '行政架构',
               component: _import('contacts', 'administrativeFrame')
             },
             {
               path: '/employeeIo',
               name: '批量导入/导出',
               component: _import('contacts', 'employeeIo')
             },
             {
               path: '/addDepartment',
               name: '添加部门',
               component: _import('contacts', 'addDepartment')
             },
             {
               path: '/addClerk',
               name: '添加店员',
               component: _import('contacts', 'addClerk')
             },
             {
               path: '/storeFrame',
               name: '门店架构',
               component: _import('contacts', 'storeFrame')
             },
             {
               path: '/addGroup',
               name: '添加子分组',
               component: _import('contacts', 'addGroup')
             },
             {
               path: '/storeIo',
               name: '门店导入/导出',
               component: _import('contacts', 'storeIo')
             },
             {
               path: '/storeInfo',
               name: '编辑门店',
               component: _import('contacts', 'storeInfo')
             },
             {
               path: '/recycle',
               name: '门店回收站',
               component: _import('contacts', 'recycle')
             },
             {
               path: '/employee',
               name: '编辑员工',
               component: _import('contacts', 'employee')
             },
             {
               path: '/unemployee',
               name: '离职员工',
               component: _import('contacts', 'unemployee')
             },
             {
               path: '/fileSet',
               name: '档案设置',
               component: _import('contacts', 'fileSet')
             },
             {
               path: '/recordInfo',
               name: '编辑员工信息',
               component: _import('contacts', 'recordInfo')
             },
             {
               path: '/recordIo',
               name: '导入导出员工档案',
               component: _import('contacts', 'recordIo')
             },
             {
               path: '/shareContact',
               name: '共享通讯录',
               component: _import('contacts', 'shareContact')
             },
             {
               path: '/shareCode',
               name: '共享通讯录二维码',
               component: _import('contacts', 'shareCode')
             },
             {
               path: '/employeeRecord',
               name: '在职员工',
               component: _import('contacts', 'employeeRecord')
             }
           ]
         },
         {
           // 企业应用
           path: '/enterpriseApp',
           name: '企业应用',
           redirect: 'appcenter',
           component: _import('enterpriseApp', 'index'),
           children: [
             {
               path: '/appcenter',
               name: '企业应用中心',
               component: _import('enterpriseApp', 'appcenter')
             },
             {
               path: '/mycustomer',
               name: '我的顾客',
               component: _import('enterpriseApp', 'mycustomer')
             },
             {
               path: '/cloudDaily',
               name: '云日报',
               redirect: '/dailyRecord',
               component: _import('enterpriseApp/cloudDaily', 'index'),
               children: [
                 {
                   path: '/dailyRecord',
                   name: '云日报记录',
                   component: _import('enterpriseApp/cloudDaily', 'dailyRecord')
                 },
                 {
                   path: '/dailyDetail',
                   name: '日报详情',
                   component: _import('enterpriseApp/cloudDaily', 'dailyDetail')
                 },
                 {
                   path: '/taskAssign',
                   name: '任务下发设置',
                   component: _import('enterpriseApp/cloudDaily', 'taskAssign')
                 },
                 {
                   path: '/systemReport',
                   name: '系统报表',
                   component: _import('enterpriseApp/cloudDaily', 'systemReport')
                 },
                 {
                   path: '/customReport',
                   name: '自定义报表',
                   component: _import('enterpriseApp/cloudDaily', 'customReport')
                 }
               ]
             },
             {
               path: '/trafficTask',
               name: '话务任务',
               redirect: '/taskRecord',
               component: _import('enterpriseApp/trafficTask', 'index'),
               children: [
                 {
                   path: '/taskRecord',
                   name: '话务任务记录',
                   component: _import('enterpriseApp/trafficTask', 'taskRecord')
                 },
                 {
                   path: '/taskDetail',
                   name: '话务任务详情',
                   component: _import('enterpriseApp/trafficTask', 'taskDetail')
                 },
                 {
                   path: '/trafficTaskSet',
                   name: '话务任务设置',
                   component: _import('enterpriseApp/trafficTask', 'trafficTaskSet')
                 },
                 {
                   path: '/badEvaluateSet',
                   name: '不良评价设置',
                   component: _import('enterpriseApp/badEvaluate', 'badEvaluateSet')
                 }
               ]
             },
             {
               path: '/noticeList',
               name: '企业公告',
               redirect: '/noticeList',
               component: _import('enterpriseApp/notice', 'index'),
               children: [
                 {
                   path: '/noticeList',
                   name: '企业公告列表',
                   component: _import('enterpriseApp/notice', 'noticeList')
                 },
                 {
                   path: '/addNotice',
                   name: '新建公告',
                   component: _import('enterpriseApp/notice', 'addNotice')
                 }
               ]
             },
             {
               path: '/badEvaluate',
               name: '不良评价',
               redirect: '/badEvaluateRecord',
               component: _import('enterpriseApp/badEvaluate', 'index'),
               children: [
                 {
                   path: '/badEvaluateRecord',
                   name: '不良评价记录',
                   component: _import('enterpriseApp/badEvaluate', 'badEvaluateRecord')
                 },
                 {
                   path: '/badEvaluateDetail',
                   name: '不良评价详情',
                   component: _import('enterpriseApp/badEvaluate', 'badEvaluateDetail')
                 }
                 //  {
                 //    path: '/badEvaluateSet',
                 //    name: '不良评价设置',
                 //    component: _import('enterpriseApp/badEvaluate', 'badEvaluateSet')
                 //  }
               ]
             },
             {
               path: '/quota',
               name: '指标管理',
               redirect: '/monthList',
               component: _import('enterpriseApp/quota', 'index'),
               children: [
                 {
                   path: '/monthList',
                   name: '月指标列表',
                   component: _import('enterpriseApp/quota', 'monthList')
                 },
                 {
                   path: '/storeMonthTask',
                   name: '门店月指标',
                   component: _import('enterpriseApp/quota', 'storeMonthTask')
                 },
                 {
                   path: '/salerMonthDetail',
                   name: '导购月指标详情',
                   component: _import('enterpriseApp/quota', 'salerMonthDetail')
                 },
                 {
                   path: '/companyDaySet',
                   name: '商户日权重',
                   component: _import('enterpriseApp/quota', 'companyDaySet')
                 },
                 {
                   path: '/monthTask',
                   name: '月指标任务',
                   component: _import('enterpriseApp/quota', 'monthTask'),
                   meta: {
                    keepAlive: true
                   }
                 },
                 {
                   path: '/monthTaskDetail',
                   name: '月指标任务详情',
                   component: _import('enterpriseApp/quota', 'monthTaskDetail'),
                   meta: {
                     keepAlive: true
                   }
                 }
               ]
             },
             {
               path: '/signList',
               name: '企业公告',
               redirect: '/signList',
               component: _import('enterpriseApp/signApp', 'index'),
               children: [
                 {
                    path: '/signList',
                    name: '企业公告列表',
                    component: _import('enterpriseApp/signApp', 'signList')
                  },
                ]
              }
           ]
         },
         {
           // 审核中心
           path: '/reviewCenter',
           name: '审核中心',
           redirect: 'unreview',
           component: _import('reviewCenter', 'index'),
           children: [
             {
               path: '/reviewed',
               name: '已审核',
               component: _import('reviewCenter', 'reviewed')
             },
             {
               path: '/unreview',
               name: '未审核',
               component: _import('reviewCenter', 'unreview')
             }
           ]
         },
         {
           // 设置模块
           path: '/setCenter',
           name: '设置',
           redirect: 'companyAddress',
           component: _import('setting', 'index'),
           children: [
             {
               path: '/companyAddress',
               name: '企业地址',
               component: _import('setting', 'companyAddress')
             },
             {
               path: '/companyCertify',
               name: '企业认证',
               component: _import('setting', 'companyCertify')
             },
             {
               path: '/staffDetails',
               name: '员工详情字段',
               component: _import('setting', 'staffDetails')
             },
             {
               path: '/storePermission',
               name: '门店权限设置',
               component: _import('setting', 'storePermission')
             },
             {
               path: '/replaceAdmin',
               name: '更换超级管理员',
               component: _import('setting', 'replaceAdmin')
             },
             {
               path: '/setChildAdmin',
               name: '设置子管理员',
               component: _import('setting', 'setChildAdmin')
             },
             {
               path: '/addAdmin',
               name: '添加管理员',
               component: _import('setting', 'addAdmin')
             },
             {
               path: '/addAdminRole',
               name: '添加管理员角色',
               component: _import('setting', 'addAdminRole')
             }
           ]
         },
         {
           path: '/staffRecordsTemplate',
           name: '员工档案设置',
           component: _import('contacts', 'staffRecordsTemplate')
         },
         {
           path: '/systemReportSet',
           name: '系统报表设置',
           component: _import('enterpriseApp/cloudDaily', 'systemReportSet')
         },
         {
           path: '/template',
           name: '模板设置',
           component: _import('enterpriseApp/cloudDaily', 'template')
         },
         {
           path: '/403',
           name: '无权访问',
           component: errorPage
         },
         {
           path: '/404',
           name: 'error404',
           component: errorPage
         },
         {
           path: '/500',
           name: 'error500',
           component: errorPage
         },
         { path: '*', redirect: '/404', hidden: true }
       ];
export default new Router({
  // mode:'history',
  routes: constantRouterMap,
  scrollBehavior: () => ({ y: 0 })
});
