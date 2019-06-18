<template>
  <div class="app-detail-wrap common-right-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="task-set-content boder-box">
      <div class="saler-set-title flex flex-space-between m-b-15">
        <div class="saler-set-title_left">
          <span>{{ clerkObj.yearMonth }}</span
          ><span class="p-l-18">{{ clerkObj.storeName }}门店导购月指标详情</span>
        </div>
        <div class="saler-set-title_right"><span>门店月指标：</span><el-input class="w-105 p-l-8" v-model="clerkObj.storePerformance" placeholder="请输入指标值" :disabled="clerkObj.settingAble == 0" @blur="value => inputMonthPerformance(value)"></el-input></div>
      </div>
      <div class="saler-set-table">
        <el-table class="select-table" ref="multipleTable" :data="tableData" tooltip-effect="dark" :style="{ width: '100%', minHeight: tableH }">
          <el-table-column label="导购">
            <template slot-scope="scope">
              <div>{{ scope.row.clerkName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="月指标">
            <template slot-scope="scope">
              <div>
                <el-input class="w-105 p-l-8" v-model="scope.row.clerkPerformance" placeholder="请输入指标值" :disabled="clerkObj.settingAble == 0" @blur="value => inputPerformance(value, scope.$index, scope.row)"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="task-set-save text-center m-t-30">
        <span class="saler-set-sum"
          >导购总计：<span :class="['font-20', equalFlag ? 'color-1890ff' : 'color-f5222d']">{{ performanceSum }}</span></span
        >
        <el-button v-if="clerkObj.settingAble == 1" :disabled="!equalFlag ? true : false" type="primary" @click="saveSet">确 认</el-button>
        <span v-if="!equalFlag" class="font-14 color-f5222d p-l-24">请确保导购月指标总计 = 门店月指标</span>
      </div>
    </div>
  </div>
</template>
<script>
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import { _debounce } from '@/common/js/public';
import errMsg from '@/common/js/error';
import showMsg from '@/common/js/showmsg';
import { postRequest } from '@/api/api';
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
      tableH: window.screen.availHeight - 464 - 126,
      activeTab: '1',
      activeBrand: this.brandId, // 商户(品牌) id
      topMenuData: [
        {
          id: '1',
          name: '指标管理',
          path: `/monthList?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '2',
          name: '月指标',
          path: `/monthList?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '3',
          name: '门店月指标',
          path: `storeMonthTask?yearMonth=${this.$route.query.yearMonth}&appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '4',
          name: '导购月指标详情',
          path: ''
        }
      ],
      activeId: '4',
      tableData: [],
      performanceSum: '', // 总指标
      clerkObj: {
        storeId: '',
        storeName: '',
        yearMonth: '',
        settingAble: 1,
        storePerformance: ''
      },
      equalFlag: true // 相等标志
    };
  },
  computed: {},
  methods: {
    /**
     * 输入
     */
    inputPerformance: function(val, index, row) {
      let that = this;
      row.clerkPerformance = !!Number(row.clerkPerformance.replace(/[^\d.]/g, '')) ? row.clerkPerformance.replace(/[^\d+(.\d+)]/g, '') : '';
      row.clerkPerformance = Number(row.clerkPerformance).toFixed(2);
      let sumData = 0;
      that.tableData.forEach(ele => {
        sumData += Number(ele.clerkPerformance);
      });
      that.performanceSum = Number(sumData).toFixed(2);
      that.diffData();
    },
    inputMonthPerformance: function(val) {
      let that = this;
      that.clerkObj.storePerformance = !!Number(that.clerkObj.storePerformance.replace(/[^\d.]/g, '')) ? that.clerkObj.storePerformance.replace(/[^\d+(.\d+)]/g, '') : '';
      that.clerkObj.storePerformance = Number(that.clerkObj.storePerformance).toFixed(2);
      that.diffData();
    },

    diffData() {
      let that = this;
      let dataFlag = Number(that.performanceSum) == Number(that.clerkObj.storePerformance);
      if (!dataFlag) {
        that.equalFlag = false;
      } else {
        that.equalFlag = true;
      }
      return dataFlag;
    },
    /**
     * 保存
     */
    saveSet: _debounce(function() {
      let that = this;
      if (!that.diffData()) {
        return false;
      }
      /* 非空验证 */
      if (that.clerkObj.storePerformance == '') {
        that.$message.error({
          duration: 1000,
          message: '请输入门店月指标'
        });
        return false;
      }
      let data = {
        clerkPerformanceList: that.tableData,
        storePerformance: that.clerkObj.storePerformance
      };
      that.postSave(data);
    }, 500),
    postSave(data) {
      let that = this;
      let para = {
        brandId: that.activeBrand,
        storeId: that.clerkObj.storeId,
        yearMonth: that.clerkObj.yearMonth,
        performance: JSON.stringify(data)
      };
      postRequest('/haoban-app-performance-web/performance/save-clerk-month-performance', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
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
     * 获取设置数据
     */
    getData() {
      let that = this;
      let para = {
        brandId: that.activeBrand,
        storeId: that.clerkObj.storeId,
        yearMonth: that.clerkObj.yearMonth
      };
      postRequest('/haoban-app-performance-web/performance/query-clerk-month-performance', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result.clerkPerformanceList && !!resData.result.clerkPerformanceList.length) {
              resData.result.clerkPerformanceList.forEach(ele => {
                ele.clerkPerformance = Number(ele.clerkPerformance).toFixed(2);
              });
              that.tableData = resData.result.clerkPerformanceList || [];
            }
            resData.result.storePerformance = Number(resData.result.storePerformance).toFixed(2);
            that.clerkObj = resData.result;
            let allSum = 0;
            that.tableData.forEach(ele => {
              allSum += Number(ele.clerkPerformance);
            });
            that.performanceSum = Number(allSum).toFixed(2);
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
  watch: {
    brandId: function(newData, oldData) {
      const that = this;
      if (!!newData) {
        that.activeBrand = newData;
        that.clerkObj.yearMonth = that.$route.query.yearMonth;
        that.clerkObj.storeId = that.$route.query.storeId;
        that.getData();
      }
    }
  },
  mounted() {
    let that = this;
    document.documentElement.style.backgroundColor = '#f0f2f5';
    that.$emit('showTab', '11');

    if (!!that.brandId) {
      that.clerkObj.yearMonth = that.$route.query.yearMonth;
      that.clerkObj.storeId = that.$route.query.storeId;
      that.getData();
    }
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
.task-set-content {
  .w-105 {
    width: 105px;
  }
  .m-b-15 {
    margin-bottom: 15px;
  }
  .p-l-8 {
    padding-left: 8px;
  }
  .p-l-18 {
    padding-left: 18px;
  }
  .p-l-24 {
    padding-left: 24px;
  }
  .color-1890ff {
    color: #1890ff;
  }
  .color-f5222d {
    color: #f5222d;
  }
  padding: 10px 40px 40px 40px;
  .saler-set-sum {
    min-width: 188px;
    margin-right: 56px;
  }
}
</style>
