<template>
  <div class="sign-contain">
    <div class="sign-content border-box">
      <div>
        <el-date-picker class="m-l-10" v-model="choiceDate" @change="changeDate" :picker-options="pickerOptions" :editable="false" :value-format="'yyyy-MM-dd'" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
      </div>
      <div class="m-t-20">
        <store-tree-select :brandId="brandId" :activeGroupId="activeGroupId" @checkStoreGroupIds="checkStoreGroupIds"> </store-tree-select>
      </div>
      <div class="m-t-20">
        <el-button type="primary" class="m-l-10" @click="exportData"><i class="iconfont icon-icon_yunxiazai p-r-6"></i>导 出</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import storeTreeSelect from '@/components/app/store-tree-select.vue';
import { getRequest } from '@/api/api';
import errMsg from '@/common/js/error';
export default {
  name: 'index',
  components: {
    storeTreeSelect
  },
  data() {
    return {
      projectName: 'haoban-manage-web', // 当前项目名
      contentHeight: '0px', // 页面内容高度
      choiceDate: [],
      choiceDateCopy: [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDateCopy = [minDate.getTime()];
          if (maxDate) {
            this.choiceDateCopy = [];
          }
        },
        disabledDate: time => {
          if (this.choiceDateCopy.length) {
            const one = 31 * 24 * 3600 * 1000;
            const minTime = this.choiceDateCopy[0] - one;
            const maxTime = this.choiceDateCopy[0] + one;
            return time.getTime() < minTime || time.getTime() > maxTime || time.getTime() > Date.now() - 8.64e6;
          }
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      brandId: '',
      activeGroupId: '',
      storeGroupIds: []
    };
  },
  methods: {
    /**
     * 导出数据
     */
    exportData() {
      let that = this;
      that.postExportData();
    },
    postExportData() {
      let that = this;
      let para = {
        date: that.choiceDate,
        storeIds: that.storeGroupIds
      };
      getRequest('/haoban-manage-web/home/find-quick-entry', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.entryData = resData.result;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },
    /**
     * 日期
     */
    changeDate(e) {
      let that = this;
      if (!e) {
        that.choiceDateCopy = [];
        that.choiceDate = [];
      } else {
        that.choiceDateCopy = JSON.parse(JSON.stringify(that.choiceDate));
      }
    },
    /**
     * 选择门店分组
     */
    checkStoreGroupIds: function(nodes) {
      let that = this;
      that.currentPage = 1;
      that.storeGroupIds = nodes;
    },
    /**
     *  获取门店数据
     */
    getStoreData() {
      const that = this;
      let para = {};
      getRequest('/haoban-manage-web/home/find-quick-entry', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.entryData = resData.result;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  mounted() {
    const that = this;
    that.getStoreData();
  }
};
</script>
<style lang="less" scoped>
.sign-contain {
  width: 100%;
  .sign-content {
    width: 100%;
    padding: 20px;

    .m-l-10 {
      margin-left: 10px;
    }

    /* .item-cell-select {
      &.m-l-10 {
        margin-left: 0;
      }
    } */
  }
}
</style>
