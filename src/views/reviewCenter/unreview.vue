<template>
  <div class="unreview-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ 'min-height': $store.state.bgHeight }">
        <div class="reviewed-body-head flex flex-space-between">
          <el-select v-model="filterValue" placeholder="全部事项" @change="getTableList" class="w-130">
            <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-button type="primary" @click="approveAll">批量同意</el-button>
        </div>
        <div class="reviewed-body-content">
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"> </el-table-column>
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
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.$index, scope.row)" type="text" size="small">同意</el-button>
                <el-button @click="handleClick(scope.$index, scope.row, 'refuse')" type="text" size="small">拒绝</el-button>
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
    <!-- 同意 -->
    <el-dialog class="approve-dialog" title="" :visible.sync="approveVisible" width="422px">
      <div class="approve-body text-center">
        <div><i class="el-icon-success"></i><span class="approve-icon-tip">同意</span></div>
        <div class="approve-tip">是否确认同意</div>
      </div>
      <div slot="footer" class="approve-footer dialog-footer" style="text-align: center;">
        <el-button @click="approveVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendApprove">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 拒绝 -->
    <el-dialog class="refuse-dialog" title="提示" :visible.sync="refuseVisible" :before-close="cancelRefuse" width="422px">
      <div>
        <div class="refuse-tip">请输入拒绝理由</div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm">
          <el-form-item label="" prop="refuseReason">
            <el-input class="font-14" v-model="ruleForm.refuseReason" type="textarea" placeholder="最多 50 个字" :rows="3"> </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="approve-footer dialog-footer">
        <el-button @click="cancelRefuse('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="sendRefuse('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import storeChange from '@/components/review/store-change.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { formatDate } from '@/common/js/public';
import { getRequest, postRequest } from '@/api/api';
export default {
  name: 'unreview',
  data() {
    return {
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
          name: '待审核',
          path: ''
        }
      ],

      filterValue: '',
      filterOptions: [
        {
          label: '全部事项',
          value: ''
        },
        {
          label: '门店信息变更',
          value: '0'
        },
        {
          label: '新增成员',
          value: '1'
        },
        {
          label: '成员离职',
          value: '2'
        }
      ],

      tableData: [
        // {
        //   enterpriseAuditingId: 1,
        //   auditingType: 0,//审核类型（0：门店信息变更，1：新增成员，2：成员离职）
        //   detail: '',
        //   relationId: 112,
        //   applyId: '12223233',
        //   applyName: '测试',
        //   headPic: '',
        //   storeName: '测试门店',
        //   refuseReason: '111111',
        //   auditingStatus: 0, //审核状态 （0:待审核 ,1: 已同意,2:已拒绝）
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

      // 操作
      selectId: '',
      ruleForm: {
        refuseReason: ''
      },
      rules: {
        refuseReason: [{ required: true, message: '拒绝理由不能为空', trigger: 'change' }, { min: 1, max: 50, message: '长度在 1 到 50 个字', trigger: 'change' }]
      },

      showStoreDialog: false,
      storeChangeData: {
        beforeContent: [],
        afterContent: []
      },

      approveVisible: false,
      refuseVisible: false
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
      that.getTableList();
    },

    /**
     * 操作
     */
    handleClick(index, item, flag) {
      const that = this;
      that.selectId = item.enterpriseAuditingId;
      !!flag ? (that.refuseVisible = true) : (that.approveVisible = true);
    },

    /**
     * 确定同意
     */
    sendApprove() {
      const that = this;
      that.postApprove(that.selectId);
    },

    /**
     * 批量同意
     */
    approveAll() {
      const that = this;
      let ids = !!that.multipleSelection.length ? that.multipleSelection.map(item => item.enterpriseAuditingId) : '';
      if (!ids) {
        that.$message({
          message: '请至少选择一条审核事项',
          type: 'warning'
        });
        return false;
      }
      that.postAllApprove(ids);
    },

    postApprove(ids) {
      const that = this;
      let para = {
        enterpriseAuditingId: ids
      };
      postRequest('/haoban-manage-web/audit/approve.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('操作成功', 'success');
            that.approveVisible = false;
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

    postAllApprove(ids) {
      const that = this;
      let para = {
        enterpriseAuditingIds: ids
      };
      postRequest('/haoban-manage-web/audit/batch-approve.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('操作成功', 'success');
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
     * 取消拒绝
     */
    cancelRefuse(formName) {
      const that = this;
      that.refuseVisible = false;
      that.$refs['ruleForm'].resetFields();
    },

    /**
     * 确定拒绝
     */
    sendRefuse(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.postRefuse();
        } else {
          return false;
        }
      });
    },

    postRefuse() {
      const that = this;
      let para = {
        enterpriseAuditingId: that.selectId,
        refuseReason: that.ruleForm.refuseReason
      };
      getRequest('/haoban-manage-web/audit/refuse.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('操作成功', 'success');
            that.refuseVisible = false;
            that.$refs['ruleForm'].resetFields();
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
     * 获取头像处显示信息
     */
    /* eslint-disable */
    showSingleInfo(memberId) {},

    /**
     * 显示门店变更
     */
    showStoreChange(item) {
      const that = this;
      that.storeChangeData = {
        beforeContent: [],
        afterContent: []
      };
      that.showStoreDialog = true;
      that.storeChangeData = {
        beforeContent: item.beforeContent != '' ? JSON.parse(item.beforeContent) : [],
        afterContent: item.afterContent != '' ? JSON.parse(item.afterContent) : []
      };
    },

    /**
     * 获取列表数据
     */
    getTableList(val) {
      const that = this;
      let para = {
        auditingType: that.filterValue,
        auditingStatus: '0',
        search: '', // 搜索字段
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

.flex-start {
  -webkit-justify-content: flex-start;
  -moz-justify-content: flex-start;
  -ms-justify-content: flex-start;
  -o-justify-content: flex-start;
  justify-content: flex-start;
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

.common-wrap__page {
  margin-top: 24px;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
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

.approve-dialog {
  .el-icon-success {
    display: inline-block;
    vertical-align: middle;
    font-size: 24px;
    color: #67c23a;
  }

  .approve-icon-tip {
    display: inline-block;
    vertical-align: middle;
    margin-left: 6px;
    font-size: 18px;
    color: #303133;
  }

  .approve-tip {
    margin-top: 31px;
    font-size: 14px;
    color: #606266;
  }

  /deep/.el-dialog__body {
    padding-top: 0;
  }

  /deep/.el-dialog__footer {
    border: none;
    padding: 18px 20px 22px 20px;
  }
}

.refuse-dialog {
  .refuse-tip {
    margin-bottom: 20px;
    font-size: 14px;
    color: #606266;
  }
  /deep/.el-dialog__footer {
    border: none;
    /*padding: 18px 20px 22px 20px;*/
  }

  .el-textarea {
    /deep/ .el-textarea__inner {
      font-size: 14px;
      color: #606266;
      background-color: rgba(255, 255, 255, 0.1);
      resize: none;
    }
  }
}
</style>
