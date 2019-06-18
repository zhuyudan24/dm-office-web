<template>
  <div class="e-r-l-container">
    <div class="handle-area">
      <div class="flex1">
        <el-button @click="callSelector" :disabled="disabled" style="margin-right: 10px; height:32px;">行政架构选人</el-button>
        <el-button @click="callStoreSelector" style="margin-right: 10px; height:32px;">门店架构选人</el-button>
        <template v-if="!isUnEmployee">
          <el-select v-model="clerkType" placeholder="选择类型" @change="reGetList" class="m-r-10 w-130">
            <el-option v-for="(type, index) in typeLsit" :key="index" :label="type" :value="index"> </el-option>
          </el-select>
          <el-select class="w-130" v-model="clerkStatus" placeholder="选择状态" @change="reGetList">
            <el-option v-for="(type, index) in statusList" :key="index" :label="type.label" :value="type.id"> </el-option>
          </el-select>
        </template>
        <div class="block" v-else>
          <span class="demonstration">离职日期</span>
          <el-date-picker v-model="fireDate" type="daterange" align="right" value-format="yyyy-MM-dd" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="selectDate" :picker-options="pickerOptions2"> </el-date-picker>
        </div>
        <el-input v-model="searchParam" placeholder="请输入姓名或手机号" style="width: 218px;margin-left:10px;" @keyup.enter.native="searchFn" clearable @clear="searchFn"></el-input>
      </div>
      <el-button type="primary" @click="showExportSet"><i class="iconfont icon-icon_yunxiazai p-r-6"></i>导出</el-button>
    </div>
    <ul class="selector-selected-list" v-if="!!selectionList.length">
      <template v-for="(sld, index) in selectionList">
        <li :key="index + sld.id + sld.label" class="sld">{{ sld.label }} <i class="el-icon-close" @click="delSld(sld, sld.isStoreGroup)"></i></li>
      </template>
      <li class="sld tip">共筛选出{{ total }}人</li>
    </ul>
    <el-table class="list-table" :data="employeeList" :default-sort="{ prop: 'hireDate', order: 'descending' }" @sort-change="sortList">
      <template v-for="prop in propList">
        <list-item :item="prop" :key="prop" @callHandle="callHandle"></list-item>
      </template>
    </el-table>
    <el-pagination v-if="!!employeeList.length" class="pagination" background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="pageNum" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
    <el-dialog :title="typeTitle" :visible.sync="dialogVisible" width="480px">
      <handle-dialog :employee="employeeObj" :handleType="handleType" :typeTitle="typeTitle" @handleSuccess="handleSuccess"></handle-dialog>
    </el-dialog>
    <vue-select-store ref="storeSelector" :defaultList="defaultStoreList" :treeSet="treeSetStore" @handleSelectedList="handleStoreSelectedList"></vue-select-store>
    <vue-select-employee ref="departmentSelector" :treeSet="treeSetDepart" @handleSelectedList="handleSelectedList" :changed="changed" :treeData="treeData" :defaultSelection="adDefaultSelection"></vue-select-employee>
  </div>
</template>
<script>
import { getRequest } from '@/api/api';
import listItem from 'components/employeeRecord/listItem';
import handleDialog from 'components/employeeRecord/handleDialog';
import vueSelectStore from 'components/common/vueSelectStore';
import vueSelectEmployee from 'components/common/vueSelectEmployee';
export default {
  name: 'employeeRecordList',
  props: {
    isUnEmployee: {
      type: Boolean,
      default: false
    }
  },
  components: {
    listItem,
    handleDialog,
    vueSelectStore,
    vueSelectEmployee
  },
  data() {
    return {
      tableH: window.screen.availHeight - 440 - 160,
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      employeeList: [],
      pageNum: 1,
      pageSize: 20,
      sortType: 'desc',
      sortColumn: 'hireDate',
      statusList: [
        {
          label: '全部',
          id: '0'
        },
        {
          label: '正式',
          id: '1'
        },
        {
          label: '试用',
          id: '2'
        },
        {
          label: '无状态',
          id: '-1'
        }
      ],
      typeLsit: ['全部', '全职', '兼职', '外包', '实习', '无类型'],
      clerkType: 0,
      clerkStatus: '0',
      total: 0,
      handleType: 'turnPositive',
      typeTitle: '',
      dialogVisible: false,
      employeeObj: {},
      fireDate: [],
      startDate: '',
      endDate: '',
      showSelector: true,
      searchParam: '',
      departMentSet: {},
      storeSet: {},
      treeData: {},
      selectionList: [], // 门店，行政架构已选择的条件
      disabled: true,
      chooseClerkIdList: [],
      chooseGroupIdList: [],
      chooseStoreIdList: [],
      // adList: [],
      adDefaultSelection: [], // 行政架构默认选择数据
      // stList: [],
      changed: 0,
      defaultStoreList: [], // 门店架构默认选择
      treeSetDepart: {
        isSelectPerson: true,
        dialogVisible: false,
        isSingle: false, // 是否单选
        openNextBool: true // 展开下级不调用接口
      },
      treeSetStore: {
        isSelectPerson: true,
        dialogVisible: false,
        isSingle: false, // 是否单选
        openNextBool: true // 展开下级不调用接口
      }
    };
  },
  methods: {
    searchFn() {
      this.getEmloyeeList();
    },
    getGroupData() {
      let that = this;
      let params = {
        isStoreGroup: 0
      };
      getRequest('/haoban-manage-web/dept/deptListForCompany', params)
        .then(res => {
          let treeData = [];
          let personData = [];
          if (res.data.errorCode == 1) {
            treeData = res.data.result.departmentList || [];
            personData = res.data.result.searchList || [];
          }
          that.treeData = {
            treeData,
            personData
          };
          that.disabled = false;
        })
        .catch(e => {});
    },
    callSelector() {
      this.treeSetDepart.dialogVisible = true;
    },
    callStoreSelector() {
      this.treeSetStore.dialogVisible = true;
    },
    showExportSet() {
      // 显示导出设置页面
      let isUnEmployee = this.isUnEmployee;
      if (!isUnEmployee) {
        this.$emit('showExportSetFn');
      } else {
        let local = window.location.origin;
        if (local.indexOf('localhost') != -1) {
          local = 'http://www.gicdev.com';
        }
        let that = this;
        // let params = {
        //   pageNum: that.pageNum,
        //   chooseClerkIdList: that.chooseClerkIdList.join(','),
        //   chooseGroupIdList: that.chooseGroupIdList.join(','),
        //   chooseStoreIdList: that.chooseStoreIdList.join(','),
        //   pageSize: that.pageSize,
        //   sortType: that.sortType,
        //   clerkStatus: that.clerkStatus == 0 ? '' : that.clerkStatus,
        //   sortColumn: that.sortColumn,
        //   clerkType: that.clerkType == 0 ? '' : that.clerkType,
        //   startDate: that.startDate,
        //   endDate: that.endDate,
        //   searchParam: that.searchParam
        // };
        let clerkType = that.clerkType == 0 ? '' : that.clerkType;
        location.href = local + '/haoban-manage-web/record/export-fire-employee-record?clerkType=' + clerkType + '&sortType=' + that.sortType + '&sortColumn=' + that.sortColumn + '&startDate=' + that.startDate + '&endDate=' + that.endDate + '&searchParam=' + that.searchParam + '&chooseClerkIdList=' + that.chooseClerkIdList.join(',') + '&chooseGroupIdList=' + that.chooseGroupIdList.join(',') + '&chooseStoreIdList=' + that.chooseStoreIdList.join(',');
      }
    },
    /**
     * 选择行政架构
     */
    handleSelectedList(list) {
      let that = this;
      that.adDefaultSelection = list || [];
      that.concatList();
    },
    /**
     * 选择门店架构
     */
    handleStoreSelectedList(list) {
      let that = this;
      that.defaultStoreList = list || [];
      that.concatList();
    },
    /**
     * 合并两个所选的数据
     */
    concatList() {
      let that = this;
      that.selectionList = that.adDefaultSelection.concat(that.defaultStoreList);
      that.formatSelectionList(that.selectionList);
    },
    formatSelectionList(list) {
      let that = this;
      let newList = that.unique(list);
      that.selectionList = newList;
      that.chooseClerkIdList = [];
      that.chooseStoreIdList = [];
      that.chooseGroupIdList = [];
      if (!!newList.length) {
        newList.forEach(item => {
          if (item.type == 1) {
            // 人
            that.chooseClerkIdList.push(item.employeeClerkId);
          } else if (item.type == 3) {
            // 门店
            that.chooseStoreIdList.push(item.storeId);
          } else if (item.type == 2) {
            // 部门
            that.chooseGroupIdList.push(item.groupId);
          }
        });
      }
      that.pageNum = 1;
      that.getEmloyeeList();
    },
    unique(arr) {
      let unique = {};
      arr.forEach(item => {
        unique[JSON.stringify(item)] = item; // 键名不会重复
      });
      arr = Object.keys(unique).map(u => {
        // Object.keys()返回对象的所有键值组成的数组，map方法是一个遍历方法，返回遍历结果组成的数组.将unique对象的键名还原成对象数组
        return JSON.parse(u);
      });
      return arr;
    },
    delSld(sld, isStoreGroup) {
      // 删除选择的导出字段
      // isStoreGroup 区分行政架构和门店架构
      let that = this;
      let idx = that.selectionList.indexOf(sld);
      that.selectionList.splice(idx, 1);
      // isClerk : 0-员工（行政架构），1-店员（门店架构）
      if (sld.type == 3 || (sld.hasOwnProperty('isStoreGroup') && sld.isStoreGroup == 1) || (sld.hasOwnProperty('isClerk') && sld.isClerk == 1)) {
        that.defaultStoreList.forEach((ele, index) => {
          if (ele.id == sld.id) {
            that.defaultStoreList.splice(index, 1);
          }
        });
      }
      if ((sld.hasOwnProperty('isStoreGroup') && sld.isStoreGroup == 0) || (sld.hasOwnProperty('isClerk') && sld.isClerk == 0)) {
        that.adDefaultSelection.forEach((ele, index) => {
          if (ele.id == sld.id) {
            that.adDefaultSelection.splice(index, 1);
          }
        });
      }
      that.formatSelectionList(that.selectionList);
      // that.adList.forEach(ad => {
      //   if (ad.id == sld.id) {
      //     that.adList.splice(that.adList.indexOf(ad), 1);
      //   }
      // });
      that.changed += 1;
      // that.adDefaultSelection = that.adList.slice(0);
    },
    handleSuccess() {
      this.dialogVisible = false;
      this.getEmloyeeList();
    },
    // 呼出操作弹窗（办理离职/转正）
    callHandle(obj, type, typeTitle) {
      this.handleType = type;
      this.employeeObj = obj;
      this.typeTitle = typeTitle;
      this.dialogVisible = true;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getEmloyeeList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getEmloyeeList();
    },
    // 改变排序
    sortList(obj) {
      (this.sortColumn = obj.prop), (this.sortType = obj.order == 'descending' ? 'desc' : 'asc');
      this.getEmloyeeList();
    },
    reGetList() {
      this.getEmloyeeList();
    },
    getEmloyeeList() {
      let that = this;
      let isUnEmployee = that.isUnEmployee;
      let url = isUnEmployee ? '/haoban-manage-web/record/find-fire-employee-record-page' : '/haoban-manage-web/record/find-on-work-employee-record-page';
      let params = {
        pageNum: that.pageNum,
        chooseClerkIdList: that.chooseClerkIdList.join(','),
        chooseGroupIdList: that.chooseGroupIdList.join(','),
        chooseStoreIdList: that.chooseStoreIdList.join(','),
        pageSize: that.pageSize,
        sortType: that.sortType,
        clerkStatus: that.clerkStatus == 0 ? '' : that.clerkStatus,
        sortColumn: that.sortColumn,
        clerkType: that.clerkType == 0 ? '' : that.clerkType,
        startDate: that.startDate,
        endDate: that.endDate,
        searchParam: that.searchParam
      };
      getRequest(url, params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.employeeList = res.data.result.list;
            that.total = isUnEmployee ? res.data.result.total : res.data.result.pageInfo.total;
          } else {
            that.$message.error({
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.$message({
            message: e.message
          });
        });
    },
    selectDate(date) {
      if (!!date) {
        this.startDate = date[0];
        this.endDate = date[1];
      } else {
        this.startDate = '';
        this.endDate = '';
      }
      this.getEmloyeeList();
    }
  },
  beforeMount() {
    this.getEmloyeeList();
    this.getGroupData();
  },
  computed: {
    propList() {
      let isUnEmployee = this.isUnEmployee;
      /* eslint-disable */
      return isUnEmployee ? [
        'headPic',
        'clerkName',
        'clerkPhone',
        'groupName',
        'clerkCode',
        'positionName',
        'clerkType',
        'clerkStatus',
        'hireDate',
        'fireDate',
        'fireReason',
        'handleUnEmployee'
      ]: [
        'headPic',
        'clerkName',
        'clerkPhone',
        'groupName',
        'clerkCode',
        'positionName',
        'clerkType',
        'clerkStatus',
        'hireDate',
        'correctionDate',
        'handleEmployee'
      ];
    }
  }
};
</script>
<style lang="scss">
.e-r-l-container {
  /*margin-top: 24px;*/
  padding: 24px;
  background: #fff;

  .handle-area {
    display: flex;

    .flex1 {
      flex: 1;
      display: flex;

      .demonstration {
        color: #606266;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }

  .selector-selected-list {
    padding: 20px 0 0;
    display: flex;
    flex-wrap: wrap;

    .sld {
      padding: 7px 10px;
      box-sizing: border-box;
      background: rgba(244, 244, 245, 1);
      border: 1px solid rgba(233, 233, 235, 1);
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
      margin-right: 10px;

      .el-icon-close {
        cursor: pointer;
      }

      &.tip {
        border: none;
        background: none;
      }
    }
  }

  .list-table {
    margin-top: 22px;
  }

  .pagination {
    text-align: right;
    margin-top: 20px;
  }

  .icon-yewuduanmorentouxian {
    font-size: 20px;
    color: #e5f3ff;
  }
}
</style>
