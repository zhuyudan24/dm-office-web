<template>
  <div class="contact-wrap">
    <!-- 公共头部菜单插件 -->
    <vue-office-header :projectName="projectName" @collapseTag="collapseTag" @toRouterView="toRouterView"> </vue-office-header>
    <div class="contact-wrap__body" :style="{ height: rightH }">
      <!-- 公共左侧菜单插件 -->
      <vue-office-aside ref="asideMenu" :projectName="projectName" :collapseFlag="collapseFlag"> </vue-office-aside>
      <!-- 右侧 body -->
      <div class="contact-wrap__right" :style="{ height: rightH }">
        <!-- <topNav :navpath="navpath"></topNav> -->
        <div class="contact-wrap__right__body">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import topNav from 'components/nav/nav';
export default {
  name: 'contact',
  components: {
    topNav
  },
  data() {
    return {
      rightH: (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px',
      projectName: 'haoban-manage-web', // 当前项目名
      collapseFlag: false, // 折叠参数
      // 面包屑导航数据
      navpath: [
        {
          name: '首页',
          path: '/'
        },
        {
          name: '通讯录',
          path: ''
        },
        {
          name: '企业通讯录'
        },
        {
          name: '行政架构'
        }
      ]
    };
  },
  methods: {
    // 处理路由跳转
    toRouterView(val) {
      var that = this;
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
      var that = this;
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
  /* eslint-disable */
  mounted() {},
  computed: {}
};
</script>
<style lang="less">
.contact-wrap {
  position: relative;

  &__body {
    display: -ms-flexbox;
    display: flex;
    width: 100%;
    margin-top: 64px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    min-width: 1400px;
    background: #f5f7fa;
  }

  &__right {
    -ms-flex: 1;
    flex: 1;
    overflow: auto;
    width: 100%;
    overflow-y: auto;

    &__body {
      /*padding: 24px;*/
      height: 100%;


      .right-content {
        padding: 24px;
      }
    }
  }
}
</style>
