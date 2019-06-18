<template>
  <div class="system-set-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="system-set-content boder-box">
      <div class="system-set-cell">
        <div class="font-14 color-606266">云日报系统报表：提供系统能够智能识别的指标（例如：销售额、达成率等），配置成报表融入云日报上报模板中</div>
        <div class="m-t-30"><el-button type="primary" @click="toEdit">编辑模板</el-button></div>
      </div>
    </div>
  </div>
</template>
<script>
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
export default {
  name: 'reviewed',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    }
  },

  data() {
    return {
      activeBrandId: this.brandId, // 商户(品牌) id
      topMenuData: [
        {
          id: '1',
          name: '系统报表'
        }
      ],
      activeId: '1'
    };
  },
  computed: {},
  methods: {
    /**
     * 跳转系统模板编辑
     */
    toEdit() {
      let that = this;
      that.$router.push(`/systemReportSet?brandId=${that.activeBrandId}&appIcon=${that.$route.query.appIcon}`);
    }
  },
  watch: {
    brandId: function(newData, oldData) {
      const that = this;
      that.activeBrandId = newData;
    }
  },
  mounted() {
    document.documentElement.style.backgroundColor = '#f0f2f5';
    this.$emit('showTab', '211');
    this.activeBrandId = this.brandId;
  },
  destroyed() {
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonDetailTop
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.system-set-wrap {
  .system-set-content {
    padding: 30px 50px 50px 50px;
  }
}
</style>
