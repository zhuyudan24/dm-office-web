<template>
  <div class="my-customer-wrap common-set-wrap common-right-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="daily-set-content boder-box">
      <div class="table-condition flex flex-space-between m-b-23">
        <div class="table-condition-left">
          <el-input class="w-264 margin-l-10" placeholder="请输入门店名称/code" prefix-icon="el-icon-search" v-model="conditionObj.keyword" @keyup.native="value => searchStore(value)" clearable @clear.native="clearInput" @change="clearInput"> </el-input>
          <el-select v-model="conditionObj.storeStatus" placeholder="请选择" class="w-131 m-l-10" @change="changeSelect"> <el-option v-for="item in storeStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
          <el-select v-model="conditionObj.isCompleted" placeholder="请选择" class="w-131 m-l-10" @change="changeSelect"> <el-option v-for="item in completeStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
          <store-tree-select :brandId="brandId" :activeGroupId="activeGroupId" @checkStoreGroupIds="checkStoreGroupIds"> </store-tree-select>
        </div>
        <div class="table-condition-right"></div>
      </div>
      <el-table class="select-table" ref="multipleTable" :data="tableData" tooltip-effect="dark" :style="{ width: '100%', minHeight: tableH }">
        <el-table-column label="门店名称">
          <template slot-scope="scope">
            <div :class="['flex flex-pack-center flex-start', scope.row.totalStore ? 'color-303133' : '']">{{ scope.row.totalStore ? '总计：' + scope.row.totalStore + '家' : scope.row.storeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="月指标">
          <template slot-scope="scope">
            <div :class="[scope.row.totalStore ? 'color-303133' : '']">{{ scope.row.performance }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="门店完善状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="!scope.row.totalStore">{{ scope.row.completeStatus == 0 ? '未完善' : '已完善' }}</div>
            <div class="color-303133" v-else>{{ '已完善：' + scope.row.totalComplete + '家' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.totalStore" type="text" size="small" @click="toSalerMonth(scope.$index, scope.row)">导购月指标详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block common-wrap__page text-right m-t-24" v-if="tableData.length != 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>

    <qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>
  </div>
</template>
<script>
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import storeTreeSelect from '@/components/app/store-tree-select.vue';
import { getRequest } from '@/api/api';
import errMsg from '@/common/js/error';
import { _debounce, formatNum } from '@/common/js/public';
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
      activeId: '3', // 详情头部选中 id
      activeBrand: this.brandId, // 品牌 id
      activeGroup: this.activeGroupId, // 商户(品牌) groupId
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
          path: ''
        }
      ],
      selectRadio: 0, // 0：选择当页； 1：选择全部
      showDialog: false, // 删除弹窗参数
      // 条件
      conditionObj: {
        keyword: '',
        storeStatus: '',
        isCompleted: '',
        storeGroupIds: []
      },

      completeStatusOptions: [
        {
          label: '门店完善状态',
          value: ''
        },
        {
          label: '已完善',
          value: '1'
        },
        {
          label: '未完善',
          value: '0'
        }
      ],
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
      statistics: {}, // 暂存表格的总计
      tableData: [],
      multipleSelection: [],
      dialogVisible: false, // 二维码
      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0
    };
  },
  computed: {},
  methods: {
    /**
     * 搜索输入
     */
    searchStore: _debounce(function(value) {
      let that = this;
      that.currentPage == 1;
      that.getTableList();
    }, 500),
    /**
     * 清空输入
     */
    clearInput: function(e) {
      let that = this;
      // 搜索重置当前页 为 1
      if (that.currentPage == 1) {
        that.getTableList();
      } else {
        that.currentPage = 1;
      }
    },

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
     * 返回 的 brandId
     */
    selectBrandId(id) {
      let that = this;
      that.activeBrand = id;
    },

    setSelectTab(item) {
      let that = this;
      that.activeTab = item.tabId;
    },

    /**
     * 选择条件
     */
    changeSelect() {
      let that = this;
      that.currentPage = 1;
      that.getTableList();
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
      const that = this;
      that.currentPage = val;
      that.getTableList();
    },

    /**
     * 导购月指标
     */
    toSalerMonth(index, row) {
      let that = this;
      that.$router.push(`/salerMonthDetail?storeId=${row.storeId}&yearMonth=${that.yearMonth}&appIcon=${that.$route.query.appIcon}`);
    },

    /**
     * 获取列表数据
     */
    getTableList(val) {
      const that = this;
      let para = {
        yearMonth: that.yearMonth || that.$route.query.yearMonth, //
        keyword: that.conditionObj.keyword || '', // 逾期
        storeStatus: that.conditionObj.storeStatus || '',
        isCompleted: that.conditionObj.isCompleted || '',
        storeGroupIds: that.conditionObj.storeGroupIds.map(item => item.groupId).join(',') || '',
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize, // 一页显示个数
        brandId: that.activeBrand
      };
      getRequest('/haoban-app-performance-web/performance/query-store-month-performance', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result.list && !!resData.result.list.length) {
              resData.result.list.forEach(ele => {
                ele.performance = formatNum(Number(ele.performance));
              });

              if (!!resData.result.statistics && !!Object.keys(resData.result.statistics).length) {
                that.statistics = resData.result.statistics;
                that.tableData.unshift({
                  completeStatus: resData.result.statistics.totalComplete,
                  performance: formatNum(Number(resData.result.statistics.totalPerformance)),
                  storeName: resData.result.statistics.totalStore,
                  totalComplete: resData.result.statistics.totalComplete,
                  totalPerformance: formatNum(Number(resData.result.statistics.totalPerformance)),
                  totalStore: resData.result.statistics.totalStore
                });
              } else {
                that.tableData.unshift({
                  completeStatus: that.statistics.totalComplete,
                  performance: formatNum(Number(that.statistics.totalPerformance)),
                  storeName: that.statistics.totalStore,
                  totalComplete: that.statistics.totalComplete,
                  totalPerformance: that.statistics.totalPerformance,
                  totalStore: that.statistics.totalStore
                });
              }
            }
            that.tableData = resData.result.list || [];

            that.total = resData.result.pageInfo.total;
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
        that.yearMonth = that.$route.query.yearMonth;
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
    that.$emit('showTab', '11');
    that.activeBrand = that.brandId;
    that.activeGroup = that.activeGroupId;
    that.conditionObj.storeId = that.$route.query.storeId;
    if (!!that.brandId) {
      that.yearMonth = that.$route.query.yearMonth;
      that.getTableList();
    }
  },
  destroyed() {
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonDetailTop,
    qrcodeDialog,
    storeTreeSelect
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.daily-set-content {
  padding: 16px;
  .w-131 {
    width: 131px;
  }
  .w-264 {
    width: 264px;
  }
  .color-c0c4cc {
    color: #c0c4cc;
  }
  .image-wrap {
    width: 40px;
    height: 40px;
    min-width: 40px;
    max-width: 40px;
    max-height: 40px;
    border-radius: 4px;
    &.bg-82c5ff {
      background: #82c5ff;
    }
    &.bg-eceaeb {
      background: #eceaeb;
    }
    img {
      max-width: 40px;
      max-height: 40px;
      border-radius: 4px;
    }
    i {
      font-size: 20px;
      color: #e5f3ff;
    }
  }
}
.depart-item-content {
  width: 213px;
  height: 32px;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}

.item-cell-select {
  /deep/ .el-select__tags {
    white-space: nowrap;
    overflow: hidden;
  }
}

.depart-cell {
  position: relative;
  margin: 0 24px 24px 0;

  .el-icon-circle-close {
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 16px;
    color: #808995;
    cursor: pointer;
  }
}
</style>
