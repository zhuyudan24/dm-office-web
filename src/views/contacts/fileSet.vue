<template>
  <div class="fileSet-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="staff-contain-set">
      <el-tabs v-model="activeName">
        <el-tab-pane label="档案字段设置" name="first">
          <staffInfoSet></staffInfoSet>
        </el-tab-pane>
        <el-tab-pane label="试用期时间设置" name="second">
          <staffProbSet></staffProbSet>
        </el-tab-pane>
      </el-tabs>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import staffInfoSet from '@/components/contacts/staff-info-set.vue';
import staffProbSet from '@/components/contacts/staff-prob-set.vue';
export default {
  name: 'fileSet',
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '档案设置',
          path: ''
        }
      ],

      activeName: 'first'
    };
  },
  /* eslint-disable */
  computed: {},
  methods: {},
  mounted() {},
  components: {
    navCrumb,
    staffInfoSet,
    staffProbSet
  }
};
</script>
<style lang="less" scoped>
.contact-wrap__right__body {
  height: 100%;
}

.fileSet-wrap {
  height: 100%;

  .staff-contain-set {
    min-height: calc(100% - 190px);
    height: calc(100% - 190px);
  }
}
.navwrap.boxbttom {
  border: none;
}
.el-tabs {
  /*background: #fff;*/
  height: 100%;
  /deep/ .el-tabs__header {
    margin: 0;
    background: #fff;
  }

  /deep/ .el-tabs__content {
    /*background: #fff;*/
    padding: 24px;
    min-height: calc(100% - 90px);
    height: calc(100% - 90px);
  }

  /deep/ .el-tabs__nav-wrap {
    padding-left: 24px;
    &::after {
      height: 1px;
    }
  }

  .el-tab-pane {
    height: 100%;
    padding: 24px;
    background: #fff;
  }
}
</style>
