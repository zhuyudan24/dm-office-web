<template>
  <div class="daily-set-wrap ">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="daily-set-content boder-box">
      <div class="table-condition flex flex-space-between m-b-23">
        <div class="table-condition-left">
          <el-input placeholder="请输入门店名称" v-model="conditionObj.searchInput" class="w-264 m-l-10" style="width: 264px;" @keyup.native="value => toInput(value, conditionObj.searchInput)"> <i slot="prefix" class="el-input__icon el-icon-search"></i> </el-input>
          <div class="flex-column item-cell-select inline-block m-l-10">
            <div class="depart-item-wrap">
              <div style="width:213px" class="el-select el-select--large depart-item-content" @click="showDialogLayer('store', conditionObj.storeGroup)">
                <span class="font-14 color-c0c4cc" v-if="!conditionObj.storeGroup.length">请选择门店分组</span>
                <div class="el-select__tags" style="max-width: 181px;" v-if="conditionObj.storeGroup.length">
                  <span>
                    <template v-for="(item, index) in conditionObj.storeGroup">
                      <span class="el-tag el-tag--info el-tag--small" :key="index">
                        <span class="el-select__tags-text">{{ item.name || item.storeName }}</span
                        ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index, conditionObj.storeGroup)"></i>
                      </span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <el-select class="w-105 m-l-10" v-model="conditionObj.storeType" placeholder="请选择" @change="changeStoreType">
            <el-option v-for="item in storeTypeOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-date-picker class="m-l-10" v-model="conditionObj.dateRange" @change="changeDate" :editable="false" :value-format="'yyyy-MM-dd'" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
        </div>
        <div class="table-condition-right">
          <el-button type="danger" @click="multDel">批量删除</el-button>
          <el-button type="primary" @click="exportExcel"><i class="iconfont icon-icon_yunxiazai p-r-6"></i>导出</el-button>
        </div>
      </div>
      <el-table class="select-table" ref="multipleTable" :data="tableData" tooltip-effect="dark" :style="{ width: '100%', minHeight: tableH }" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="35"> </el-table-column>
        <el-table-column width="25">
          <template slot="header" slot-scope="scope">
            <el-dropdown style="line-height: 10px; padding: 0; margin-left: -15px; transform: translateY(4px); -webkit-transform: translateY(4px);" @command="handleCommand" placement="bottom-start">
              <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right"></i> </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="0"><span :style="{ color: selectRadio == 0 ? '#1890ff' : '#606266' }">选择当页</span></el-dropdown-item>
                <el-dropdown-item command="1"><span :style="{ color: selectRadio == 1 ? '#1890ff' : '#606266' }">选择全部</span></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope"> </template>
        </el-table-column>
        <el-table-column label="门店名称" width="120" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.storeName }}</template>
        </el-table-column>
        <el-table-column prop="" label="任务总数">
          <template slot-scope="scope">{{ scope.row.taskCount }}</template>
        </el-table-column>
        <el-table-column prop="" label="已完成(含放弃)" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.completedCount }}</template>
        </el-table-column>
        <el-table-column prop="" label="完成率(含放弃)" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.completedRate }}</template>
        </el-table-column>
        <el-table-column prop="" label="待完成" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.noCompletedCount }}</template>
        </el-table-column>
        <el-table-column prop="" label="逾期中" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.overdueCount }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="toDetail(scope.$index, scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block common-wrap__page text-right m-t-24" v-if="tableData.length != 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
    <multiple-del :showDialog="showDialog" :detailFlag="false" @hideDialog="hideDialog"> </multiple-del>
    <vue-select-store ref="storeSelector" :currentBrand="activeGroup" :appScene="appScene" :treeSet="storeTreeSet" :selectType="'group'" :defaultList="defaultStoreList" @handleSelectedList="handleSelectedList"> </vue-select-store>
  </div>
</template>
<script>
// import navCrumb from '@/components/nav/nav.vue';
import appDetail from '@/components/app/app-detail.vue';
import vueSelectStore from 'components/common/vueSelectStore';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import multipleDel from '@/components/app/cloudDaily/multiple-del.vue';
import { getRequest, postRequest, postExcel } from '@/api/api';
import { _debounce } from '@/common/js/public';
import showMsg from '@/common/js/showmsg';
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
      topMenuData: [
        {
          id: '1',
          name: '云日报记录'
        }
      ],
      activeId: '1',
      showDialog: false,
      // 条件
      conditionObj: {
        searchInput: '',
        storeGroup: [],
        storeType: '',
        dateRange: []
      },
      storeTypeOptions: [
        {
          value: '',
          label: '所有'
        },
        {
          value: '0',
          label: '自营'
        },
        {
          value: '1',
          label: '联营'
        },
        {
          value: '2',
          label: '代理'
        },
        {
          value: '3',
          label: '代销'
        },
        {
          value: '4',
          label: '托管'
        }
      ],
      selectRadio: 0, // 选择当页/选择全部
      tableData: [
        // {
        //   storeName: '2016-05-03',
        //   taskCount: '王小虎',
        //   completed: '10',
        //   completionRate: '10',
        //   unCompleted: '10',
        //   overdue: '1',
        //   taskId: '123',
        //   storeId: '123456',
        //   address: '上海市普陀区金沙江路 1518 弄'
        // }
      ],
      multipleSelection: [],
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
      }
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
     * 门店类型
     */
    changeStoreType() {
      let that = this;
      that.currentPage = 1;
      that.getTableList();
    },

    /**
     * 日期
     */
    changeDate(e) {
      let that = this;
      if (!e) {
        that.conditionObj.dateRange = [];
      }
      that.currentPage = 1;
      that.getTableList();
    },

    /**
     * 表格选择
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /**
     * 删除选的部门
     */
    delDepart(index, item) {
      let that = this;
      item.splice(index, 1);
      that.currentPage = 1;
      that.defaultStoreList = that.conditionObj.storeGroup;
      that.getTableList();
    },

    /**
     * 批量删除
     */
    multDel() {
      let that = this;
      if (!that.multipleSelection.length) {
        that.$message.error({
          duration: 1000,
          message: '请选择删除项'
        });
        return false;
      }
      that.showDialog = true;
    },

    /**
     * 批量删除---弹窗关闭
     */
    hideDialog(obj) {
      let that = this;
      that.showDialog = false;
      if (!Object.keys(obj).length) {
        return false;
      }
      that.postMultDel(obj);
    },

    postMultDel(obj) {
      let that = this;
      let storeGroups = [];
      let filterStoreIds = [];
      that.conditionObj.storeGroup.forEach(ele => {
        if (ele.type == 2) {
          storeGroups.push(ele.groupId);
        }
        if (ele.type == 3) {
          filterStoreIds.push(ele.storeId);
        }
      });
      let para = {
        search: that.conditionObj.searchInput || '', // 搜索字段
        filterStoreIds: filterStoreIds.join(',') || '', // 门店分组, 门店
        storeIds: that.multipleSelection.map(ele => ele.storeId).join(',') || '', // 门店
        storeGroupIds: storeGroups.join(',') || '', // 门店分组,数组
        storeType: that.conditionObj.storeType || '', //门店类型
        startDate: that.conditionObj.dateRange[0] || '',
        endDate: that.conditionObj.dateRange[1] || '',
        brandId: that.activeBrand, // 品牌 id
        delOptFlag: obj.delOptFlag, // 0:仅删除逾期任务，1:删除所有待完成任务
        reason: obj.reason, // 备注
        chooseAllFlag: that.selectRadio // 0：当页，1：所有
      };
      postRequest('/haoban-app-daily-web/daily/batch-delete-brand-task', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            that.getTableList();
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
     * 导出
     */
    exportExcel() {
      let that = this;
      let storeGroups = [];
      let filterStoreIds = [];
      that.conditionObj.storeGroup.forEach(ele => {
        if (ele.type == 2) {
          storeGroups.push(ele.groupId);
        }
        if (ele.type == 3) {
          filterStoreIds.push(ele.storeId);
        }
      });
      let para = {
        search: that.conditionObj.searchInput || '', // 搜索字段
        filterStoreIds: filterStoreIds.join(',') || '', // 门店分组, 门店
        storeGroupIds: storeGroups.join(',') || '', // 门店分组,数组
        storeType: that.conditionObj.storeType || '', //门店类型
        startDate: that.conditionObj.dateRange[0] || '',
        endDate: that.conditionObj.dateRange[1] || '',
        /* currentPage: that.currentPage, // 当前页
        pageSize: that.pageSize, // 一页显示个数 */
        brandId: that.activeBrand // 品牌 id
      };
      /* let urlSource = `search=${para.search}&filterStoreIds=${para.filterStoreIds}&storeGroupIds=${para.storeGroupIds}&storeType=${para.storeType}&startDate=${para.startDate}&endDate=${para.endDate}&brandId=${para.brandId}&currentPage=${para.currentPage}&pageSize=${para.pageSize}`;
      window.open(`${window.location.origin}/haoban-app-daily-web/daily/batch-export-brand-task?${urlSource}`); */
      postExcel('/haoban-app-daily-web/daily/batch-export-brand-task', para)
        .then(res => {
          if (!res.data) {
            errMsg.errorMsg('暂无数据');
            return false;
          }
          // let resData = res.data;
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          const fileName = `云日报记录.csv`;
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
      const that = this;
      that.currentPage = val;
      // let fullPath = that.$route.fullPath;
      that.getTableList();
    },

    /**
     * 弹窗显示事件
     */
    showDialogLayer(type, selData) {
      const that = this;
      that.selectType = type;
      that.changed = type;
      that.defaultStoreList = selData;
      that.storeTreeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: false
      };
    },

    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      let that = this;
      // type:	1:员工,2:部门,3:门店;
      that.conditionObj.storeGroup = group;
      that.getTableList();
    },

    /**
     * 查看详情
     */
    toDetail(index, row) {
      let that = this;
      that.$router.push(`dailyDetail?storeId=${row.storeId}&appIcon= ${that.$route.query.appIcon}`);
    },

    /**
     * 获取列表数据
     */
    getTableList(val) {
      let that = this;
      let storeGroups = [];
      let filterStoreIds = [];
      that.conditionObj.storeGroup.forEach(ele => {
        if (ele.type == 2) {
          storeGroups.push(ele.groupId);
        }
        if (ele.type == 3) {
          filterStoreIds.push(ele.storeId);
        }
      });
      let para = {
        search: that.conditionObj.searchInput || '', // 搜索字段
        filterStoreIds: filterStoreIds.join(',') || '', // 门店分组, 门店
        storeGroupIds: storeGroups.join(',') || '', // 门店分组,分组
        storeType: that.conditionObj.storeType || '', //门店类型
        startDate: that.conditionObj.dateRange[0] || '',
        endDate: that.conditionObj.dateRange[1] || '',
        currentPage: that.currentPage, // 当前页
        pageSize: that.pageSize, // 一页显示个数
        brandId: that.activeBrand
      };
      getRequest('/haoban-app-daily-web/daily/page-brand-task', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tableData = resData.result.result || [];
            that.total = resData.result.totalCount;
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
    vueSelectStore,
    multipleDel
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.color-c0c4cc {
  display: inline-block;
  line-height: 34px;
  padding-left: 10px;
  color: #c0c4cc;
}
.table-condition {
  min-width: 1200px;
}
.daily-set-wrap {
  .daily-set-content {
    padding: 16px;
    .table-condition-left {
      font-size: 0;
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
}
</style>
