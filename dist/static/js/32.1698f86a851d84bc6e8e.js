webpackJsonp([32],{VlR1:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={name:"setting",data:function(){return{projectName:"haoban-manage-web",contentHeight:"0px",collapseFlag:!1}},computed:{},methods:{toRouterView:function(t){this.$router.push({path:t.path})},collapseTag:function(t){this.collapseFlag=t}},watch:{$route:{handler:function(t,e){this.$refs.asideMenu.refreshRoute()},deep:!0}},mounted:function(){this.pathName=window.location.hash.split("/")[1],this.contentHeight=(document.documentElement.clientHeight||document.body.clientHeight)-64+"px"}},o={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"setting-wrap"},[n("vue-office-header",{attrs:{projectName:t.projectName},on:{collapseTag:t.collapseTag,toRouterView:t.toRouterView}}),t._v(" "),n("div",{staticClass:"setting-wrap__body"},[n("div",{staticClass:"content",attrs:{id:"content"}},[n("div",{staticClass:"content-body",style:{height:t.contentHeight}},[n("div",{staticClass:"left-menu",style:{height:t.contentHeight}},[n("vue-office-aside",{ref:"asideMenu",attrs:{projectName:t.projectName,collapseFlag:t.collapseFlag}})],1),t._v(" "),n("transition",{attrs:{name:"fade",mode:"out-in"}},[n("router-view")],1)],1)])])],1)},staticRenderFns:[]};var i=n("VU/8")(a,o,!1,function(t){n("tUyM")},null,null);e.default=i.exports},tUyM:function(t,e){}});