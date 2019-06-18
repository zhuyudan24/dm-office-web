<template>
  <div class="block block-field">
    <div class="block-head">
      <div :class="['opencard-item-title', childItem.title.length >= 6 ? 'title-pre-wrap' : '']">{{ childItem.title }}</div>
    </div>
    <ul class="view-content">
      <li class="block-filed-item border-bottom-1" v-for="(childList, chinldIndex) in childItem.list" :key="'performance' + chinldIndex">
        <div :class="['opencard-item-title', childList.title.length >= 6 ? 'title-pre-wrap' : '']">{{ childList.title }}</div>
        <div class="draged-item-show">
          <span class="show-warm-text show-warm-text-flag ">{{ childList.placeholder }} {{ !!childList.isMust ? '（必填）' : '' }}</span>
        </div>
      </li>
    </ul>
    <div class="compete-add" v-if="childItem.name == 'competitorInfo'">
      +竞品信息
    </div>
  </div>
</template>
<script>
export default {
  name: 'block-com',
  props: {
    childItem: {
      type: [Object, Array],
      default() {
        return {};
      }
    }
  }
};
</script>
<style type="text/less" lang="less" scoped>
@import './template.less';
</style>
