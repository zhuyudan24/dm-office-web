<template>
  <div>
    <div>
      <div :class="['opencard-item-title', getZhLen(childItem.startTitle) >= 6 ? 'title-pre-wrap' : '']">{{ childItem.startTitle }}</div>
      <div class="draged-item-show">
        <span class="show-warm-text show-warm-text-flag select-flag">{{ childItem.placeholder }} {{ !!childItem.isMust ? '（必填）' : '' }}<i class="el-icon-arrow-right"></i></span>
      </div>
    </div>
    <div class="b-t-1">
      <div :class="['opencard-item-title', getZhLen(childItem.endTitle) >= 6 ? 'title-pre-wrap' : '']">{{ childItem.endTitle }}</div>
      <div class="draged-item-show">
        <span class="show-warm-text show-warm-text-flag select-flag">{{ childItem.placeholder }} {{ !!childItem.isMust ? '（必填）' : '' }} <i class="el-icon-arrow-right"></i></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'date-range-com',
  props: {
    childItem: {
      type: [Object, Array],
      default() {
        return {};
      }
    }
  },
  methods: {
    getZhLen: function(val) {
      let len = 0;
      for (let i = 0; i < val.length; i++) {
        let a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/gi) != null) {
          len += 1;
        } else {
          len += 0.5;
        }
      }
      return Math.ceil(len);
    }
  }
};
</script>
<style type="text/less" lang="less" scoped>
@import './template.less';
</style>
