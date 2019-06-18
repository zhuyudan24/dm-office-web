<template>
  <div :class="[childItem.type == 2 ? 'h-66' : '']">
    <div :class="['opencard-item-title', getZhLen(childItem.title) >= 6 ? 'title-pre-wrap' : '']" v-if="childItem.type != 9">{{ childItem.title }}</div>
    <div class="draged-item-show">
      <span class="show-warm-text show-warm-text-flag" :style="{ 'padding-left': childItem.type == 9 ? '15px' : '0' }">{{ childItem.placeholder }} {{ !!childItem.isMust ? '（必填）' : '' }}</span>
    </div>
    <div class="show-capitalize font-12 color-909399 p-l-10 border-box" v-if="childItem.type == 10 && !!childItem.openCapitalize">大写：壹万元整(示例)</div>
  </div>
</template>
<script>
export default {
  name: 'input-com',
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
.h-66 {
  height: 66px;
}
</style>
