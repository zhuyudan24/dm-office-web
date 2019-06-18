<template>
  <section class="common-right-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="m-20">
      <el-select v-model="year" class="m-b-23 w-123" @change="changeYear">
        <i slot="prefix" class="el-input__icon el-icon-date"></i>
        <el-option v-for="(item, index) in yearList" :key="index" :value="item.id" :label="item.label"></el-option>
      </el-select>
      <el-table :data="tableList" style="width: 100%">
        <el-table-column v-for="(v, i) in tabelHeader" :key="i" :label="v.label" :prop="v.prop"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.settingStatus == 1" type="text" @click="$router.push(`/storeMonthTask?yearMonth=${scope.row.yearMonth}&appIcon=${$route.query.appIcon} `)">门店月指标</el-button>
            <el-button type="text" @click="$router.push(`/companyDaySet?yearMonth=${scope.row.yearMonth}&appIcon=${$route.query.appIcon}`)">商户日权重</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block common-wrap__page text-right m-t-24" v-if="tableList.length != 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
  </section>
</template>

<script>
import commonDetailTop from '@/components/app/common-detail-top.vue';
import errMsg from '@/common/js/error';
import { formatNum } from '@/common/js/public';
import { apiYearList, apiMonthPerformanceList } from '@/api/enterpriseApp/quota.js';
export default {
  components: {
    commonDetailTop
  },
  props: {
    brandId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeId: '2',
      topMenuData: [
        {
          id: '1',
          name: '指标管理',
          path: `/quota?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '2',
          name: '月指标',
          path: ''
        }
      ],
      yearList: [],
      year: '',
      tableList: [],
      tabelHeader: [{ prop: 'yearMonth', label: '月份' }, { prop: 'totalPerformance', label: '月指标累计' }, { prop: 'totalStore', label: '门店总数' }, { prop: 'totalComplete', label: '门店指标完善数' }],
      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0
    };
  },
  watch: {
    brandId(val) {
      if (!!val) {
        this.getYearList();
      }
    }
  },
  methods: {
    /**
     * 分页---页码变化
     */
    handleSizeChange(val) {
      let that = this;
      that.pageSize = val;
      that.apiMonthPerformanceList();
    },

    /**
     * 分页---当前页变化
     */
    handleCurrentChange(val) {
      let that = this;
      that.currentPage = val;
      that.apiMonthPerformanceList();
    },
    /**
     * 切换年
     */
    changeYear() {
      let that = this;
      that.currentPage = 1;
      that.apiMonthPerformanceList();
    },
    /**
     * 获取年
     */
    async getYearList() {
      let that = this;
      let res = await apiYearList({ brandId: that.brandId });
      let resData = res.data;
      if (resData.errorCode == 1) {
        that.yearList = [];
        if (!!resData.result && !!resData.result.length) {
          resData.result.forEach(ele => {
            that.yearList.push({
              id: ele,
              label: ele + '年'
            });
          });
          that.year = resData.result[0];
          that.apiMonthPerformanceList();
        }
      } else {
        errMsg.errorMsg(resData);
      }
    },
    /**
     * 获取列表数据
     */
    async apiMonthPerformanceList() {
      let that = this;
      let res = await apiMonthPerformanceList({ brandId: this.brandId, year: this.year });
      let resData = res.data;
      if (resData.errorCode == 1) {
        if (!!resData.result.length) {
          resData.result.forEach(ele => {
            ele.totalPerformance = formatNum(Number(ele.totalPerformance).toFixed(2));
          });
        }
        that.tableList = resData.result || [];
      }
    }
  },
  mounted() {
    let that = this;
    that.$emit('showTab', '11');
    if (!!that.brandId) {
      that.getYearList();
    }
  }
};
</script>
<style type="text/less" lang="less" scoped>
.w-123 {
  width: 123px;
}
</style>
