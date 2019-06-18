<template>
  <div class="enterprise-wrap">
    <!-- 公共头部菜单插件 -->
    <vue-office-header :projectName="projectName" @collapseTag="collapseTag" @toRouterView="toRouterView"></vue-office-header>
    <div class="enterprise-wrap__body">
      <div id="content" class="content">
        <div class="content-body" :style="{ height: contentHeight }">
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
  name: 'enterprise',
  data() {
    return {
      projectName: 'haoban-manage-web', // 当前项目名
      collapseFlag: false, // 折叠参数
      contentHeight: window.screen.availHeight - 5 + 'px'
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
      let that = this;
      that.collapseFlag = val;
    }
  },
  mounted() {
    const that = this;
    that.contentHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px';
  }
};
</script>
<style lang="less" scoped>
.enterprise-wrap {
  background: #f0f2f5;
  .enterprise-wrap__body {
    .content {
      padding-top: 64px;
      min-width: 1400px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
}
</style>
