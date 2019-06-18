<template>
  <div class="daily-set-wrap common-right-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="daily-set-content boder-box">
      <div class="table-condition flex flex-space-between m-b-23">
        <div class="table-condition-left">
          <el-input placeholder="请输入门店名称/code" v-model="conditionObj.searchInput" class="w-264" style="width: 264px;" @keyup.native="value => toInput(value, conditionObj.searchInput)"> <i slot="prefix" class="el-input__icon el-icon-search"></i> </el-input>
          <el-select class="w-130 m-l-10" v-model="conditionObj.storeStatus" placeholder="请选择" @change="changeStoreStatus">
            <el-option v-for="item in storeStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <store-tree-select :brandId="brandId" :activeGroupId="activeGroupId" @checkStoreGroupIds="checkStoreGroupIds"> </store-tree-select>
          <el-date-picker style="width:310px" class="m-l-10" v-model="conditionObj.dateRange" @change="changeDate" :editable="false" :value-format="'yyyy-MM'" type="monthrange" align="right" unlink-panels range-separator="至" start-placeholder="开始月份" end-placeholder="结束月份"> </el-date-picker>
        </div>
        <div class="table-condition-right">
          <el-button type="primary" @click="exportExcel"><i class="iconfont icon-icon_yunxiazai p-r-6"></i>导出</el-button>
        </div>
      </div>
      <el-table class="select-table" ref="multipleTable" :data="tableData" tooltip-effect="dark" :style="{ width: '100%', minHeight: tableH }" v-loading="loading">
        <el-table-column prop="storeName" label="门店名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="taskCount" label="任务总数"> </el-table-column>
        <el-table-column prop="completedCount" label="已完成(含放弃)" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="completedRate" label="完成率(含放弃)" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="noCompletedCount" label="待完成" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="overdueCount" label="逾期中" show-overflow-tooltip> </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block common-wrap__page text-right m-t-24" v-if="tableData.length != 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
// import navCrumb from '@/components/nav/nav.vue';
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import storeTreeSelect from '@/components/app/store-tree-select.vue';
import { getRequest, postExcel } from '@/api/api';
import { _debounce } from '@/common/js/public';
import errMsg from '@/common/js/error';
export default {
  name: 'reviewed',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    },
    activeGroupId: {
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
      activeGroup: this.activeGroupId, // 商户(品牌) groupId
      activeId: '2',
      topMenuData: [
        {
          id: '1',
          name: '指标管理',
          path: `/monthList?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '2',
          name: '月指标任务',
          path: ''
        }
      ],
      showDialog: false,
      // 条件
      conditionObj: {
        searchInput: '',
        storeGroupIds: [],
        storeStatus: '',
        dateRange: []
      },
      storeStatusOptions: [
        {
          value: '',
          label: '所有门店状态'
        },
        {
          value: '0',
          label: '待审核'
        },
        {
          value: '1',
          label: '正常'
        },
        {
          value: '2',
          label: '审核失败'
        },
        {
          value: '3',
          label: '停业整顿'
        },
        {
          value: '4',
          label: '回收站'
        },
        {
          value: '5',
          label: '删除'
        }
      ],
      selectRadio: 0, // 选择当页/选择全部
      tableData: [],
      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // 门店选择
      appScene: 2,
      defaultStoreList: [],
      storeTreeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      },
      loading: false
    };
  },
  computed: {},
  methods: {
    /**
     * 显示选择本页/全部
     */
    handleCommand(command) {
      this.selectRadio = command;
    },
    /**
     * 返回 的 brandId
     */
    setSelectTab(item) {
      let that = this;
      that.activeTab = item.tabId;
    },

    /**
     * 输入
     */
    toInput: _debounce(function(e, value) {
      let that = this;
      that.currentPage = 1;
      that.getTableList();
    }, 500),

    /**
     *  选择 tree 节点,获取选择节点信息
     */
    checkStoreGroupIds: function(nodes) {
      var that = this;
      that.currentPage = 1;
      that.conditionObj.storeGroupIds = nodes;
      that.getTableList();
    },

    /**
     * 门店状态
     */
    changeStoreStatus() {
      let that = this;
      that.currentPage = 1;
      that.getTableList();
    },

    /**
     * 日期
     */
    changeDate(e) {
      if (!e) {
        this.conditionObj.dateRange = [];
      }
      this.currentPage = 1;
      this.getTableList();
    },

    /**
     * 导出
     */
    exportExcel() {
      let that = this;
      let para = {
        keyword: that.conditionObj.searchInput, // 搜索字段
        storeGroupIds: that.conditionObj.storeGroupIds.map(item => item.groupId).join(',') || '', // 门店分组,数组
        storeStatus: that.conditionObj.storeStatus, //门店类型
        startDate: !!that.conditionObj.dateRange ? that.conditionObj.dateRange[0] : '',
        endDate: !!that.conditionObj.dateRange ? that.conditionObj.dateRange[1] : '',
        brandId: that.activeBrand // 品牌 id
      };
      /* let urlSource = `keyword=${para.keyword}&storeGroupIds=${para.storeGroupIds}&storeStatus=${para.storeStatus}&startDate=${para.startDate}&endDate=${para.endDate}&brandId=${para.brandId}`;
      window.open(`${window.location.origin}/haoban-app-performance-web/performance/export-store-month-performance-task?${urlSource}`); */
      // store-month-performance-task
      postExcel('/haoban-app-performance-web/performance/export-store-month-performance-task', para)
        .then(res => {
          if (!res.data) {
            errMsg.errorMsg('暂无数据');
            return false;
          }
          // let resData = res.data;
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          const fileName = `store-month-performance-task.xls`;
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          // errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 分页---页码变化
     */
    handleSizeChange(val) {
      const that = this;
      that.pageSize = val;
      that.getTableList();
    },

    /**
     * 分页---当前页变化
     */
    handleCurrentChange(val) {
      let that = this;
      that.currentPage = val;
      // let fullPath = that.$route.fullPath;
      that.getTableList();
    },

    /**
     * 查看详情
     */
    toDetail(index, row) {
      let that = this;
      let startDate = '';
      let endDate = '';
      if (this.conditionObj.dateRange.length > 0) {
        startDate = this.conditionObj.dateRange[0];
        endDate = this.conditionObj.dateRange[1];
      }
      that.$router.push(`monthTaskDetail?storeId=${row.storeId}&startDate=${startDate}&endDate=${endDate}&appIcon=${that.$route.query.appIcon}`);
    },

    /**
     * 获取列表数据
     */
    getTableList(val) {
      let that = this;
      that.loading = true;
      let para = {
        keyword: that.conditionObj.searchInput || '', // 搜索字段
        storeGroupIds: that.conditionObj.storeGroupIds.map(ele => ele.groupId).join(',') || '', // 门店分组,分组
        storeStatus: that.conditionObj.storeStatus || '', //门店类型
        startDate: that.conditionObj.dateRange[0] || '',
        endDate: that.conditionObj.dateRange[1] || '',
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize, // 一页显示个数
        brandId: that.activeBrand
      };
      getRequest('/haoban-app-performance-web/performance/query-store-month-performance-task', para)
        .then(res => {
          let resData = res.data;
          that.loading = false;
          if (resData.errorCode == 1) {
            that.tableData = resData.result.list || [];
            that.total = resData.result.pageInfo.total;
            return false;
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
      let that = this;
      if (!!newData) {
        that.activeBrand = newData;
        that.getTableList();
      }
    },
    activeGroupId: function(newData, oldData) {
      let that = this;
      if (!!newData) {
        that.activeGroup = newData;
      }
    }
  },
  mounted() {
    let that = this;
    document.documentElement.style.backgroundColor = '#f0f2f5';
    that.$emit('showTab', '13');
    that.activeBrand = that.brandId;
    that.activeGroup = that.activeGroupId;
    if (!!that.brandId) {
      that.getTableList();
    }
  },
  destroyed() {
    this.activeGroup = '';
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonDetailTop,
    storeTreeSelect
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.table-condition {
  min-width: 1200px;
}
.daily-set-wrap {
  .daily-set-content {
    padding: 8px 16px 16px;
    .table-condition-left {
      font-size: 0;
    }
  }
}
</style>
