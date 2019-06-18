<template>
  <div class="image-com">
    <div :class="['opencard-item-title', getZhLen(childItem.title) >= 6 ? 'title-pre-wrap' : '']">{{ childItem.title }}</div>
    <div class="must">{{ !!childItem.isMust ? '（必填）' : '' }}</div>
    <div class="draged-item-show">
      <span class="show-warm-text show-warm-text-flag select-flag"><i class="iconfont icon-icon"></i></span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'image-com',
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
.image-com {
  overflow: hidden;
  .must {
    width: 70px;
    height: 46px;
    line-height: 46px;
    float: left;
    color: #c0c4cc;
    font-size: 14px;
  }
  .draged-item-show {
    width: 155px;
    float: left;
    .show-warm-text.select-flag {
      width: 155px;
    }
  }
}
</style>
