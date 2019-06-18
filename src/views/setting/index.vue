<template>
  <div class="setting-wrap">
    <!-- 公共头部菜单插件 -->
    <vue-office-header :projectName="projectName" @collapseTag="collapseTag" @toRouterView="toRouterView"> </vue-office-header>
    <div class="setting-wrap__body">
      <div id="content" class="content">
        <div class="content-body" :style="{ height: contentHeight }">
          <div class="left-menu" :style="{ height: contentHeight }">
            <vue-office-aside ref="asideMenu" :projectName="projectName" :collapseFlag="collapseFlag"> </vue-office-aside>
          </div>
          <transition name="fade" mode="out-in">
            <!-- 缓存已经填好内容的页面 -->
            <!-- <keep-alive include="editGroupGrade"> -->
            <router-view></router-view>
            <!-- </keep-alive > -->
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'setting',
  data() {
    return {
      projectName: 'haoban-manage-web',
      contentHeight: '0px', //页面内容高度
      collapseFlag: false // 折叠参数
    };
  },
  computed: {},
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      let that = this;
      // 模拟检查数据
      // //有两个参数
      //{
      //  name:,
      //  path:
      //}
      that.$router.push({
        path: val.path
      });
    },

    // 折叠事件
    collapseTag(val) {
      const that = this;
      that.collapseFlag = val;
    }
  },
  watch: {
    $route: {
      handler: function(val, oldVal) {
        // console.log("获取当前路由:",val,oldVal);
        this.$refs.asideMenu.refreshRoute();
      },
      // 深度观察监听
      deep: true
    }
  },
  mounted() {
    const that = this;
    //获取项目名 pathname (路由的hash)
    that.pathName = window.location.hash.split('/')[1];

    that.contentHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px';
  }
};
</script>
<style lang="less">
.setting-wrap {
  background-color: #f0f2f5;
}
.setting-wrap__body {
  .content {
    padding-top: 64px;
    /* height: calc(100% - 64px);
    overflow-y: auto;*/
    min-width: 1400px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .content-body {
      display: flex;
      overflow: hidden;

      .common-set-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-y: auto;

        .right-content {
          /*width: 100%;*/
          padding: 24px;
          min-height: calc(100% - 240px);

          .right-box {
            background: #fff;
            padding: 24px;
          }
        }
        &.setChildAdmin-wrap {
          .right-content {
            .right-box {
              background: transparent;
              padding: 0;
            }
          }
        }
      }
    }
  }
}
/*.content-body .left-menu {
  -ms-flex: 0 0 200px;
  flex: 0 0 200px;
  width: 200px;
  height: 100%;
  background: #020b21;
  transition: all .2s ease;
  position: fixed;
  z-index: 5;
}*/
</style>
