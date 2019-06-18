<!--
  应用公共左侧菜单：
  <common-detail-left
    :tabListData="tabListData"
    :activeSelTab="activeSelTab"
    @setSelectTab="setSelectTab">
  </common-detail-left>
  // activeSelTab: 刷新时候传入的选中 tabId
  // tabListData: 列表数据
  // @setSelectTab: 选择后把选择的 tabId 返给父级
 -->
<template>
  <div>
    <ul class="tab-left-list">
      <template v-for="(item, index) in tabData">
        <li :class="['tab-left-list-cell color-303133 font-14 border-box p-l-14', item.tabId == activeTab ? 'active-tab' : '']" :key="index" @click="selectTab(item, false, index)"><i :class="['p-r-10 color-303133 iconfont', item.icon, !!item.onlyIconActive ? 'iconActive' : '']"></i>{{ item.tabName }} <i v-if="!!item.children && !!item.children.length" :class="[!!collapsFlag ? 'el-icon-arrow-up' : 'el-icon-arrow-down']"></i></li>
        <ul class="child-tab-left-list" :key="'childitem' + index" v-if="!!collapsFlag">
          <template v-for="(childitem, childIndex) in item.children">
            <li :class="['tab-left-list-cell color-303133 font-14 border-box p-l-40', childitem.tabId == activeTab ? 'active-tab' : '']" :key="childIndex" @click="selectTab(childitem, 'child', index)">{{ childitem.tabName }}</li>
            <ul class="third-tab-left-list" :key="'thirditem' + childIndex">
              <template v-for="(thirditem, thirdIndex) in childitem.children">
                <li :class="['tab-left-list-cell color-303133 font-14 border-box p-l-60', thirditem.tabId == activeTab ? 'active-tab' : '']" :key="thirdIndex" @click="selectTab(thirditem, 'child', index)">{{ thirditem.tabName }}</li>
              </template>
            </ul>
          </template>
        </ul>
      </template>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'common-detail-left',
  props: {
    appName: {
      type: String,
      default() {
        return '';
      }
    },
    // 刷新时候传入的选中 tabId
    activeSelTab: {
      type: [String, Number],
      default() {
        return '1';
      }
    },
    // 传入的 tabListData
    tabListData: {
      type: [Array, Object],
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      projectName: '', // 当前项目名
      activeTab: '1',
      tabData: this.tabListData,
      collapsFlag: true
    };
  },

  methods: {
    /**
     * 路由跳转
     */
    returnBack() {
      let that = this;
      that.$router.push('appcenter');
    },
    /**
     * 选择后触发方法，返回 tabId
     */
    selectTab(item, flag, index) {
      let that = this;
      if (!!flag) {
        that.tabData[index].onlyIconActive = true;
      } else {
        that.tabData.forEach(ele => {
          ele.onlyIconActive = false;
        });
        if (item.hasOwnProperty('children') && !!item.children.length) {
          that.collapsFlag = !!that.collapsFlag && item.hasOwnProperty('children') && !!item.children.length ? false : true;
        }
      }
      // 判断已选 item, 判断只让 icon 变色
      if (item.hasOwnProperty('children')) {
        that.tabData[index].onlyIconActive = true;
        if (item.children[0].hasOwnProperty('children')) {
          that.activeTab = item.children[0].children[0].tabId;
          that.$emit('setSelectTab', item);
          return false;
        }
        that.activeTab = item.children[0].tabId;
        that.$emit('setSelectTab', item);
        return false;
      }
      that.activeTab = item.tabId;
      that.$emit('setSelectTab', item);
    }
  },
  watch: {
    tabListData: function(newData, oldData) {
      let that = this;
      that.tabData = newData;
    },
    activeSelTab: function(newData, oldData) {
      let that = this;
      that.activeTab = newData;
    }
  },
  mounted() {
    this.activeTab = this.activeSelTab;
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.tab-left-list {
  .tab-left-list-cell {
    position: relative;
    text-align: left;
    margin-top: 15px;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;
    .iconActive {
      color: #1890ff;
    }
    &:hover {
      background: rgba(24, 144, 255, 0.06);
      i {
        color: #1890ff;
      }
    }
    &.active-tab {
      background: rgba(24, 144, 255, 0.06);
      &::before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #1890ff;
        z-index: 1;
      }
      i {
        color: #1890ff;
      }
    }
  }
  .child-tab-left-list {
    -webkit-transition: all 0.5s ease-in-out;
    -o-transition: all 0.5s ease-in-out;
    -moz-transition: all 0.5s ease-in-out;
    transition: all 0.5s ease-in-out;
    li {
      position: relative;
      text-align: left;
      height: 30px;
      line-height: 30px;
      white-space: nowrap;
      overflow: hidden;
      cursor: pointer;

      &:hover {
        background: rgba(24, 144, 255, 0.06);
        i {
          color: #1890ff;
        }
      }
      &.active-tab {
        background: rgba(24, 144, 255, 0.06);
        &::before {
          content: ' ';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #1890ff;
          z-index: 1;
        }
        i {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
