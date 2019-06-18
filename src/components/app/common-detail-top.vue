<!--
  应用公共头部：
  <common-detail-top
    :topMenuData="topMenuData"
    :activeId="activeId">
  </common-detail-top>
 -->
<template>
  <div class="app-detail-top">
    <div class="el-tabs__header is-top">
      <div class="el-tabs__nav-wrap is-top">
        <div class="el-tabs__nav-scroll">
          <ul>
            <li v-for="(item, index) in topData" :key="index" :class="['top-cell', item.id == activeId ? 'cell-active' : '']">
              <div class="top-name" @click="changeRoute(item.path)">{{ item.name }}</div>
              <i v-if="topData.length > 1 && index != topData.length - 1" class="el-icon-arrow-right p-lr-11"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'common-detail-top',
  props: {
    topMenuData: {
      type: Array,
      default() {
        return [];
      }
    },
    activeId: {
      type: [String, Number],
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      projectName: '', // 当前项目名
      topData: []
    };
  },

  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      if (!!route) {
        this.$router.push(route);
      }
    },

    /**
     * 返回
     */
    returnBack() {
      let that = this;
      that.$router.push('appcenter');
    }
  },
  watch: {
    topMenuData: function(newData, oldData) {
      const that = this;
      that.topData = newData;
    }
  },
  mounted() {
    const that = this;
    that.topData = this.topMenuData;
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.app-detail-top {
  .el-tabs__header {
    position: relative;
    padding: 0;
    margin: 0 0 15px;

    .el-tabs__nav-wrap::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background-color: #e4e7ed;
      z-index: 1;
    }

    .el-tabs__nav-scroll {
      padding-left: 20px;
      ul {
        font-size: 0;
        li {
          position: relative;
          display: inline-block;
          padding: 0;
          height: 48px;
          line-height: 48px;
          list-style: none;
          font-size: 14px;
          color: #606266;
          font-weight: 500;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          cursor: pointer;
          .top-name {
            display: inline-block;
            height: 48px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
          }
          &.cell-active {
            .top-name {
              border-bottom: 3px solid #303133;
              color: #303133;
            }
          }
        }
      }
    }

    .el-tabs__active-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      background-color: #1890ff;
      z-index: 1;
    }

    .el-tabs__item {
      padding: 0;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 14px;
      font-weight: 500;
      color: #303133;
      position: relative;
    }
  }
}
</style>
