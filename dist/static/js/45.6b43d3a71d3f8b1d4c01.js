webpackJsonp([45],{"av/3":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("2eFk"),o=a("fvdr"),i=a("Qie6"),c={name:"reviewed",data:function(){return{bgHeight:window.screen.availHeight-380+"px",appName:"企业公告",appIcon:"icon-gonggao",activeSelTab:"1",activeTab:"1",tabListData:[{id:"1",name:"企业公告列表",icon:"",onlyIconActive:!1},{id:"2",name:"新建公告",icon:"",onlyIconActive:!1}],activeBrand:"",activeGroup:""}},computed:{},methods:{changeRoute:function(t){this.$router.push(t)},selectBrandId:function(t,e){this.activeBrand=t,this.activeGroup=e}},watch:{activeBrand:function(t,e){this.activeBrand=t},activeGroup:function(t,e){this.activeGroup=t}},mounted:function(){var t=this.$route.query.appIcon;t&&(this.appIcon=window.unescape(t)),document.documentElement.style.backgroundColor="#f0f2f5"},destroyed:function(){document.documentElement.style.backgroundColor="#fff"},components:{appDetail:n.a,commonAppTop:o.a,commonDetailLeft:i.a}},r={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"my-customer-wrap common-set-wrap"},[a("div",{staticClass:"right-content"},[a("common-app-top",{attrs:{appName:t.appName,appIcon:t.appIcon},on:{selectBrandId:t.selectBrandId}}),t._v(" "),a("div",{staticClass:"right-box",style:{"min-height":t.bgHeight}},[a("div",{staticClass:"apps-content flex",style:{"min-height":t.bgHeight}},[a("div",{staticClass:"apps-content-right"},[a("transition",{attrs:{name:"fade",mode:"out-in"}},[a("router-view",{attrs:{brandId:t.activeBrand,activeGroupId:t.activeGroup}})],1)],1)])])],1),t._v(" "),a("vue-gic-footer")],1)},staticRenderFns:[]};var s=a("VU/8")(c,r,!1,function(t){a("ebGx")},"data-v-7769b0e5",null);e.default=s.exports},ebGx:function(t,e){}});