<template>
  <div class="reviewed-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"> </nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ 'min-height': $store.state.bgHeight }">
        <div class="reviewed-body-head">
          <el-select class="w-130" v-model="filterValue" placeholder="全部状态" @change="getTableList"> <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select><el-input class="w-250 m-l-10" placeholder="请输入提交人姓名或门店名称" prefix-icon="el-icon-search" v-model="searchValue" clearable @clear="clearSearch" @keyup.enter.native="searchEnterFun"> </el-input>
        </div>
        <div class="reviewed-body-content">
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="审核事项">
              <template slot-scope="scope">
                {{ scope.row.auditingType == 0 ? '门店信息变更' : scope.row.auditingType == 1 ? '新增成员' : '成员离职' }}
              </template>
            </el-table-column>
            <el-table-column label="提交人" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="flex">
                  <el-popover placement="top-start" width="400" trigger="hover" @show="showSingleInfo(scope.row.applyId)">
                    <div class="apply-info-detail">
                      <div class="flex">
                        <div class="apply-info-img flex-align-center flex-pack-center bg-82C5FF ">
                          <i v-if="!scope.row.headPic" class="iconfont icon-yewuduanmorentouxian"></i>
                          <img v-else :src="scope.row.headPic" alt="img" />
                        </div>
                        <div class="flex flex-column apply-info-right flex-space-between">
                          <div class="apply-info-name">
                            {{ scope.row.applyName }}
                            <i :class="[scope.row.sex == 2 ? 'icon-xingbienv color-FF585C' : 'icon-xingbienan color-508CEE', 'iconfont']"></i>
                          </div>
                          <div class="apply-info-code">
                            <span class="w-80">员工代码：</span><span class="w-130">{{ scope.row.code }}</span>
                          </div>
                          <div class="apply-info-phone">
                            <span class="w-80">手机号：</span><span class="w-130">{{ scope.row.phoneNumber }}</span>
                          </div>
                          <div class="apply-info-job">
                            <span class="w-80">职位：</span><span class="w-130">{{ scope.row.positionName }}</span>
                          </div>
                          <div class="apply-info-store">
                            <span class="w-80">所属门店：</span><span class="w-130">{{ scope.row.storeName }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div slot="reference">
                      <div class="flex flex-align-center flex-pack-center bg-82C5FF table-head-pic">
                        <i v-if="!scope.row.headPic" class="iconfont icon-yewuduanmorentouxian"></i>
                        <img v-else :src="scope.row.headPic" alt="img" />
                      </div>
                    </div>
                  </el-popover>
                  <div class="flex flex-column apply-info">
                    <span>{{ scope.row.applyName }}</span>
                    <span class="font-13">{{ scope.row.storeName }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详情" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.auditingType != 0 || (scope.row.auditingType == 0 && scope.row.auditingUpdateType != 1)">{{ scope.row.detail }}</span>
                <div class="line-hidden-2" v-if="scope.row.auditingUpdateType == 1">
                  <!-- <span> {{ scope.row.auditingType == 0? '门店信息变更': scope.row.auditingType == 0? '新增成员': '成员离职'}}</span> -->
                  <span>{{ scope.row.detail }}</span>
                  <el-button type="text" @click="showStoreChange(scope.row)">查看详情</el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="line-h-18">{{ scope.row.createTime | formatTimeYMD }}</div>
                <div class="line-h-18">{{ scope.row.createTime | formatTimeHMS }}</div>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span :class="[scope.row.auditingStatus == 2 ? 'color-FF585C' : '']">{{ scope.row.auditingStatus == 1 ? '超级管理员已同意' : '超级管理员已拒绝' }}</span>
                <el-popover class="inline-block" placement="top" width="150" trigger="hover">
                  <div class="tooltip-text">{{ scope.row.refuseReason }}</div>
                  <div slot="reference">
                    <i class="el-icon-question" v-if="scope.row.auditingStatus == 2" @click="toggleReason(scope.row)"></i>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="block common-wrap__page text-right" v-if="tableData.length != 0">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 门店变更 -->
    <storeChange v-model="showStoreDialog" :storeChangeData="storeChangeData"> </storeChange>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import storeChange from '@/components/review/store-change.vue';
import errMsg from '@/common/js/error';
import { formatDate } from '@/common/js/public';
import { getRequest } from '@/api/api';
export default {
  name: 'reviewed',
  data() {
    return {
      tableH: window.screen.availHeight - 464 - 126 + 'px',
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '审核中心',
          path: '/unreview'
        },
        {
          name: '已审核',
          path: ''
        }
      ],

      filterValue: '99',
      filterOptions: [
        // {
        //   label: '待审核',
        //   value: '0'
        // },
        {
          label: '已同意',
          value: '1'
        },
        {
          label: '已拒绝',
          value: '2'
        },
        {
          label: '已审核',
          value: '99'
        }
      ],

      searchValue: '', // 搜索

      tableData: [
        // {
        //   enterpriseAuditingId: 1,
        //   auditingType: 0,// 审核类型（0：门店信息变更，1：新增成员，2：成员离职）
        //   detail: '',
        //   relationId: 112,
        //   applyId: '12223233',
        //   applyName: '测试',
        //   headPic: '',
        //   storeName: '测试',
        //   refuseReason: '111111',
        //   auditingStatus: 1, //审核状态 （0:待审核 ,1: 已同意,2:已拒绝）
        //   beforeContent: '',
        //   afterContent: '',
        //   createTime: '2018-12-09 14:34:56'
        // }
      ],
      multipleSelection: [],

      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0,

      // info
      applyInfo: {
        // photo: '',
        // applyName: '测试的',
        // sex: 2,
        // code: '223344545fffffffffffffff4',
        // phone: '13012343333',
        // job: '店长',
        // store: '测试门店'
      },

      // store
      showStoreDialog: false,
      storeChangeData: {}
    };
  },
  filters: {
    formatTimeYMD(data) {
      return data != '--' ? data.split(' ')[0] : '--';
    },
    formatTimeHMS(data) {
      return data != '--' ? data.split(' ')[1] : '--';
    },
    formatNum(data) {
      const reg = /\d{1,3}(?=(\d{3})+$)/g;
      return (data + '').replace(reg, '$&,');
    }
  },
  computed: {},
  methods: {
    /**
     * 搜索标签清空
     */
    clearSearch() {
      const that = this;
      that.getTableList();
    },

    /**
     * 搜索标签
     */
    searchEnterFun(e) {
      const that = this;
      let searchVal = String(e.target.value).trim();
      if (!searchVal) {
        return false;
      }
      that.getTableList();
    },

    toggleReason(item) {
      const that = this;
      item.visible = true;
      that.tableData.forEach(function(ele, index) {
        if (ele.enterpriseAuditingId != item.enterpriseAuditingId) {
          ele.visible = false;
        }
      });
    },

    /**
     * 表格---多选
     */
    handleSelectionChange(val) {
      const that = this;
      that.multipleSelection = val;
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
     * 获取头像处显示信息
     */
    /* eslint-disable */
    showSingleInfo(memberId) {},

    /**
     * 显示门店变更
     */
    showStoreChange(item) {
      const that = this;
      that.showStoreDialog = true;
      that.storeChangeData = item;
    },

    /**
     * 获取列表数据
     */
    getTableList(val) {
      const that = this;
      let para = {
        auditingType: '',
        auditingStatus: that.filterValue,
        search: that.searchValue || '', // 搜索字段
        pageNum: that.currentPage, // 当前页
        pageSize: that.pageSize // 一页显示个数
      };
      getRequest('/haoban-manage-web/audit/auditing-list.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.list) {
              resData.result.list.forEach(function(ele, index) {
                if (!!ele.createTime) {
                  ele.createTime = formatDate(ele.createTime);
                }
              });
            }
            that.tableData = resData.result.list;
            that.total = resData.result.total;
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
    this.getTableList();
  },
  components: {
    navCrumb,
    storeChange
  }
};
</script>
<style lang="less" scoped>
/* flex */
.flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.flex-1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.flex-column {
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
}

.flex-row {
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  -o-flex-direction: row;
  flex-direction: row;
}

.flex-align-center {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.flex-pack-center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.flex-start {
  -webkit-justify-content: flex-start;
  -moz-justify-content: flex-start;
  -ms-justify-content: flex-start;
  -o-justify-content: flex-start;
  justify-content: flex-start;
}

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap: wrap;
}

.flex-space-between {
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
}

.inline-block {
  display: inline-block;
}

.bg-82C5FF {
  background: #82c5ff;
}

.color-508CEE {
  color: #508cee;
}

.color-FF585C {
  color: #ff585c;
}

.font-13 {
  font-size: 13px;
}

.font-14 {
  font-size: 14px;
}

.line-h-18 {
  line-height: 18px;
}

.line-hidden-2 {
  .flex;
  .flex-align-center;
  .flex-start;
  height: 46px;
  overflow: hidden;
  white-space: pre-wrap;
  span {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    box-orient: vertical;
    max-height: 46px;
    overflow: hidden;
  }
}

.w-80 {
  width: 80px;
}

.w-130 {
  display: inline-block;
  width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.w-250 {
  width: 250px;
}

.m-l-10 {
  margin-left: 10px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.common-wrap__page {
  margin-top: 24px;
}

.tooltip-text {
  width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
}

.right-content {
  /*width: 100%;*/
  padding: 24px;
  min-height: calc(100% - 240px);
  .right-box {
    background: #fff;
    min-height: 500px;
    padding: 24px;

    .w-280 {
      width: 280px;
    }

    .w-514 {
      width: 514px;
    }

    .m-l-20 {
      margin-left: 20px;
    }

    .m-t-45 {
      margin-top: 45px;
    }

    .v-align-b {
      vertical-align: bottom;
    }

    .text-center {
      text-align: center;
    }

    .reviewed-body-head {
      margin-bottom: 22px;
    }

    .table-head-pic {
      width: 35px;
      height: 35px;
      border-radius: 4px;
      i {
        font-size: 20px;
        color: #e5f3ff;
      }

      img {
        width: 35px;
        height: 35px;
        border-radius: 3px;
      }
    }

    .apply-info {
      margin-left: 15px;
      line-height: 18px;
      span {
        font-size: 14px;
        color: #606266;
        &.font-13 {
          font-size: 13px;
        }
      }
    }
  }
}

.apply-info-detail {
  /*padding: 18px;*/
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  .apply-info-img {
    width: 150px;
    height: 150px;
    border-radius: 12px;
    text-align: center;
    i {
      font-size: 106px;
      color: #e5f3ff;
    }
    img {
      width: 150px;
      height: 150px;
      border-radius: 12px;
    }
  }

  .apply-info-name {
    font-size: 16px;
    color: #303133;
  }

  .apply-info-right {
    width: 229px;
    padding-left: 16px;
    font-size: 13px;
    color: #606266;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .w-80 {
      display: inline-block;
      vertical-align: top;
      color: #303133;
    }

    .w-130 {
      color: #303133;
    }
  }
}

.el-icon-question {
  font-size: 14px;
  color: #c0c4cc;
  cursor: pointer;
}
</style>
