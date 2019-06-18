<template>
  <div class="common-set-wrap add-clerk-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="add-clerk-page">
          <clerk-info :storeType="storeType" :firstLevelId="firstLevelId" :isAddnew="isAddnew" :gicFlag="gicFlag"></clerk-info>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import clerkInfo from 'components/contacts/storeFrame/clerkInfo';
export default {
  name: 'add-clerk-page',
  components: {
    clerkInfo,
    navCrumb
  },
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '门店架构',
          path: '/storeFrame'
        },
        {
          name: '新增店员',
          path: ''
        }
      ],
      isAddnew: false,
      firstLevelId: '',
      storeType: '',
      gicFlag: !this.$route.query.gicFlag || this.$route.query.gicFlag == 'false' ? false : true
    };
  },
  beforeMount() {
    this.firstLevelId = this.$route.query.firstLevelId;
    this.storeType = this.$route.query.type;
    if (!!this.$route.query.clerkId) {
      this.isAddnew = false;
      this.navpath[3].name = '编辑店员';
    } else {
      this.isAddnew = true;
    }
  }
};
</script>
<style lang="scss">
.add-clerk-wrap {
  height: 100%;
  .right-content {
    min-height: calc(100% - 240px);
  }
}
</style>
