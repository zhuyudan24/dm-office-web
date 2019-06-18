<template>
  <div class="navheader">
    <!-- logo -->
    <div class="navheader-logo fl" :class="{moveleft: isCollapse ,moveright: !isCollapse}">好办管理平台</div>
    <div class="navheader-item fl">
      <a class="itemlink" @click="handleCollapse">
          <i class="iconfont" :class="{'icon-shouqi': isCollapse,'icon-zhankai': !isCollapse}"></i>
      </a>
     <!--  <a :class="['itemlink', 'bottom','menu-all',summaryName=='/index'? 'current-module':'']"  :href="origin+'/report/#/memberSummary'">首页</a>

      <div :class="['itemlink-gic', 'bottom', pathName=='gic-web'? 'current-module':'']">GIC商户后台</div> -->
      <!-- menu -->

      <template v-for="menuitem in menuHead">
        <a :class="['itemlink', 'bottom','menu-mall',pathName==menuitem.menuUrl? 'current-module':'']" :href="'#'+menuitem.menuUrl" :target="menuitem.target == 1?'_blank':''">{{menuitem.menuName}}</a>
      </template>
      <!-- 最右侧用户信息 -->
      <div class="navuserinfo fr">
        <el-button @click="toGicLogin">GIC管理平台</el-button>
        <el-button type="text" @click="toLoginOut">退出</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  // import { getRequest } from './api';
  import qs from 'qs';
  export default {
    name: 'vue-office-header',
    props: ['menuRouter','collapseFlag','projectName'],
    data () {
      return {
        repProjectName: 'gic-web', // 项目名

        // 当前路由
        pathName: '',

        isCollapse: false,// 是否收起左侧

        // 菜单数据
        menuHead: [
          {
            menuCode: null,
            menuName: "首页",
            menuUrl: "/index",
            parentCode: null,
            project: "office"
          },
          {
            menuCode: null,
            menuName: "通讯录",
            menuUrl: "/administrativeEstrutura",
            parentCode: null,
            project: "office"
          },
          {
            menuCode: null,
            menuName: "企业应用",
            menuUrl: "/enterpriseApp",
            parentCode: null,
            project: "office"
          },
          {
            menuCode: null,
            menuName: "审核中心",
            menuUrl: "/unreview",
            parentCode: null,
            project: "office"
          },
          {
            menuCode: null,
            menuName: "我的企业",
            menuUrl: "/unreview",
            parentCode: null,
            project: "office"
          },
          {
            menuCode: null,
            menuName: "设置",
            menuUrl: "/companyAddress",
            parentCode: null,
            project: "office"
          },
        ],

        // 获取 location origin
        baseUrl: '',

        routePathName: '', // 当前路由值
      }
    },
    beforeMount() {
      var that = this
      var host = window.location.origin;
      console.log("当前host:",host)
      if (host.indexOf('localhost') != '-1') {
        that.baseUrl = 'http://gicdev.demogic.com';
      }else {
        that.baseUrl = host
      }
    },
    methods: {

      // 处理折叠
      handleCollapse() {
        var that = this;
        that.isCollapse = (that.isCollapse==true? false: true);
        that.$emit('collapseTag', that.isCollapse)
      },

      // 跳转 gic 管理后台
      toGicLogin() {
        window.location.href = window.location.origin + '/gic-web/#/';
      },

      //退出登录
      toLoginOut() {
        var that = this;
        // var para = {
        //   requestProject: that.repProjectName
        // }
        that.$confirm('确认退出吗?', '提示', {
          type: 'warning'
        }).then(() => {

          that.axios.post(that.baseUrl+'/api-auth/do-logout',{})
          .then((res) => {
            // console.log(res,res.data,res.data.errorCode)
            var resData = res.data
            if (resData.errorCode == 0) {
              that.$message({
                message: '退出成功',
                type: 'success'
              });
              // 跳转登录页
              window.location.href = window.location.origin + '/gic-web/#/';

              return;
            }
            that.$message.error({
              duration: 1000,
              message: resData.message
            })

          })
          .catch(function (error) {
            console.log(error);

            that.$message.error({
              duration: 1000,
              message: error.message
            })
          });

        }).catch(() => {
          console.log(error);
          that.$message.error({
              duration: 1000,
              message: error.message
            })
        });

      },

      // 触发父组件路由
      toRouter(path,name,code) {
        var that = this;

        var obj ={
          path: '/'+ path,
          name: name
        }
        that.$emit('toRouterView', obj)
      },

      // 获取菜单
      getHeaderMenu() {
        var that = this
        var para = {
          project: that.repProjectName,
          requestProject: that.repProjectName
        }

        that.axios.post(that.baseUrl + '/api-auth/login-clerk-menu',qs.stringify(para))
        .then((res) => {
          // console.log(res,res.data,res.data.errorCode)
          var resData = res.data
          if (resData.errorCode == 0) {

            that.menuHeadRouter = resData.result;
            console.log(that.menuHeadRouter)
            // that.setNewData(resData.result)
            // 获取左侧菜单
            that.getLeftMenu()
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          })

        })
        .catch(function (error) {
          console.log(error);
          // that.toLogin()
          that.$message.error({
            duration: 1000,
            message: error.message
          })
        });
      },
    },

    watch: {

      $route: {
        handler: function(val, oldVal){
          console.log("获取当前路由:",val);
          var that = this

        },
        // 深度观察监听
        deep: true
      },

      collapseFlag: function(newData,oldData){
        var that = this;
        that.isCollapse = newData
      },

      projectName: function(newData,oldData){
        var that = this;
        that.repProjectName = newData || 'gic-web';
      },
    },

    /* 接收数据 */
    mounted(){
      console.log("传递的参数对象:",this.collapseFlag)
      var that = this;
      that.pathName = that.$route.path

      //获取项目名 pathname (路由的hash)
      that.routePathName = window.location.hash.split('/')[1];
      if (that.routePathName.indexOf('?')!= -1) {
        that.routePathName = that.routePathName.split('?')[0]
      }
      if (that.routePathName.indexOf('/')!= -1) {
        that.routePathName = that.routePathName.split('/')[0]
      }
      console.log("routePathname:",that.routePathName)

      // 项目名
      that.repProjectName = that.projectName || 'gic-web';

      that.isCollapse = that.collapseFlag


      // 获取菜单
      that.getHeaderMenu();

    },

  }
</script>

<style lang="less" scoped>

@base-color: #353944;
@hover-color: #3c92eb;
@hoverbg-color: #20242d;
@main-color: #1890ff;
@navbgcolor: #04143a;
@sidebgcolor: #020b21;
@userinfobgcolor: #ecf5ff;
@contentbgcolor: #f5f7fa;
@bordercolor: #dcdfe6;
@customnavcolor: #04143a;
@btnbgcolor: #f5f7fa;
@iconbgcolor: #e6e9f2;
@elmenuisactive: #1890ff;
.flex1(@width,@height) {
  flex: 0 0 @width;
  width: @width;
  height: @height;
}

.navheader /deep/ {
  position: fixed;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  /*min-width: 1400px;*/
  height: 64px;
  line-height: 64px;
  font-size: 14px;
  background-color: #fff;
  padding: 0;
  z-index: 99;
  color: #fff;

  .fl {
    float: left;
  }

  .fr {
    float: right;
  }

  &-logo {
    flex: 0 0 200px;
    width: 200px;
    height: 64px;
    float: left;
    padding-left: 28px;
    font-size: 20px;
    color: #1F2F3D;
    text-align: center;
    background: url("../assets/logo.png") no-repeat 20px center;
  }

  &-pic {
    vertical-align: middle;
  }

  &-item {
    flex: 1;
    box-shadow: 5px -1px 10px #ddd;
  }
  .itemlink {
    float: left;
    padding: 0 20px;
    display: inline-block;
    height: 62px;
    cursor: pointer;
    color: #606266;

    &:hover {
      color: @main-color;
    }
  }

  .bottom:hover {
    border-bottom: 2px solid @main-color;
  }

  /* 选中 */
  .current-module.bottom {
    color: @main-color;
    border-bottom: 2px solid @main-color;
    font-weight: 500;
  }

  /* logo */

  .moveleft {
    margin-left: -136px;
    transition: all .3s ease;
    background-position: 151px 10px;
    color: transparent;
  }

  .moveright {
    margin-left: 0px;
    transition: all .2s ease;
  }

}

li {
  list-style: none;
}

 /*用户信息*/
.navuserinfo {
  /*width: 140px;*/
  /*font-size: 0;*/
  text-align: center;

  .el-button--text {
    padding-right: 24px;
    font-size: 14px;
    color: #606266;
    margin-left: 30px;
  }
}

/* 当浏览器的可视区域小于1280px */
@media screen and ( max-width: 1280px ) {
  .navheader {
    min-width: 1280px
  }
}
@media screen and (min-width: 1280px) and ( max-width: 1366px ) {
  .navheader {
    min-width: 1280px
  }
}
@media screen and (min-width: 1366px) and ( max-width: 1440px ) {
  .navheader {
    min-width: 1366px
  }
}
@media screen and (min-width: 1440px) and ( max-width: 1920px ) {
  .navheader {
    min-width: 1440px
  }
}


</style>
