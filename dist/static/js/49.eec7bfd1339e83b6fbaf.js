webpackJsonp([49],{da9f:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={name:"enterprise",data:function(){return{projectName:"haoban-manage-web",collapseFlag:!1,contentHeight:window.screen.availHeight-5+"px"}},computed:{},methods:{toRouterView:function(t){this.$router.push({path:t.path})},collapseTag:function(t){this.collapseFlag=t}},mounted:function(){this.contentHeight=(document.documentElement.clientHeight||document.body.clientHeight)-64+"px"}},i={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"enterprise-wrap"},[e("vue-office-header",{attrs:{projectName:this.projectName},on:{collapseTag:this.collapseTag,toRouterView:this.toRouterView}}),this._v(" "),e("div",{staticClass:"enterprise-wrap__body"},[e("div",{staticClass:"content",attrs:{id:"content"}},[e("div",{staticClass:"content-body",style:{height:this.contentHeight}},[e("transition",{attrs:{name:"fade",mode:"out-in"}},[e("router-view")],1)],1)])])],1)},staticRenderFns:[]};var o=n("VU/8")(a,i,!1,function(t){n("lxEU")},"data-v-5a283aba",null);e.default=o.exports},lxEU:function(t,e){}});