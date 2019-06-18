<template>
  <div class="my-customer-wrap common-set-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="daily-set-content boder-box">
      <div class="table-condition flex flex-space-between m-b-23">
        <div class="table-condition-left">
          <el-select v-model="conditionObj.completed" placeholder="请选择" class="w-105" @change="changeSelect"> <el-option v-for="item in completedOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select
          ><el-select v-model="conditionObj.overdue" placeholder="请选择" class="w-105 m-l-10" @change="changeSelect">
            <el-option v-for="item in overOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </div>
        <div class="table-condition-right">
          <el-button type="danger" @click="multDel">批量删除</el-button>
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
        <el-table-column label="指派对象">
          <template slot-scope="scope">
            <div class="flex flex-pack-center flex-start">
              <div :class="['image-wrap flex flex-align-center flex-pack-center', !!scope.row.headImgUrl ? 'bg-eceaeb' : 'bg-82c5ff']">
                <img v-if="!!scope.row.headImgUrl" :src="scope.row.headImgUrl" alt="" />
                <i v-else class="iconfont icon-yewuduanmorentouxian"></i>
              </div>
              <div class="clerk-info flex flex-column flex-space-between m-l-16">
                <p class="font-14 color-303133">{{ scope.row.clerkName }}</p>
                <p class="font-14 color-909399">{{ scope.row.clerkPhone }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="创建时间">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | formatTimeYMD }}</div>
            <div>{{ scope.row.createTime | formatTimeHMS }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="完成期限" show-overflow-tooltip>
          <template slot-scope="scope">
            <div>{{ scope.row.lastTime | formatTimeYMD }}</div>
            <div>{{ scope.row.lastTime | formatTimeHMS }}</div>
          </template>
        </el-table-column>
        <el-table-column label="逾期情况">
          <template slot-scope="scope">{{ scope.row.isOverTime }}</template>
        </el-table-column>
        <el-table-column label="完成情况">
          <template slot-scope="scope">{{ scope.row.isCompleted }}</template>
        </el-table-column>
        <el-table-column label="完成时间">
          <template slot-scope="scope">
            <div>{{ scope.row.finishTime | formatTimeYMD }}</div>
            <div>{{ scope.row.finishTime | formatTimeHMS }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block common-wrap__page text-right m-t-24" v-if="tableData.length != 0">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
      </div>
    </div>
    <multiple-del :showDialog="showDialog" :detailFlag="true" @hideDialog="hideDialog"> </multiple-del>
    <qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>
  </div>
</template>
<script>
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import multipleDel from '@/components/app/cloudDaily/multiple-del.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import { getRequest, postRequest } from '@/api/api';
import errMsg from '@/common/js/error';
import showMsg from '@/common/js/showmsg';
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
  filters: {
    formatTimeYMD(data) {
      return data && data != '- -' ? data.split(' ')[0] : '--';
    },
    formatTimeHMS(data) {
      return data && data != '- -' ? data.split(' ')[1] : '--';
    }
  },
  data() {
    return {
      tableH: window.screen.availHeight - 464 - 126,
      activeId: '2', // 详情头部选中 id
      activeBrand: this.brandId, // 品牌 id
      topMenuData: [
        {
          id: '1',
          name: '云日报记录',
          path: `/dailyRecord?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '2',
          name: '日报详情',
          path: ''
        }
      ],
      selectRadio: 0, // 0：选择当页； 1：选择全部
      showDialog: false, // 删除弹窗参数
      // 条件
      conditionObj: {
        completed: '',
        overdue: ''
      },
      completedOptions: [
        {
          label: '已完成',
          value: '1'
        },
        {
          label: '未完成',
          value: '0'
        }
      ],
      overOptions: [
        {
          label: '已逾期',
          value: '1'
        },
        {
          label: '未逾期',
          value: '0'
        }
      ],
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
     * 显示选择本页/全部
     */
    handleCommand(command) {
      this.selectRadio = command;
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
     * 表格选择
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      let para = {
        storeId: that.conditionObj.storeId,
        taskIds: that.multipleSelection.map(ele => ele.taskId) || '', // 门店分组,数组
        overdue: that.conditionObj.overdue || '', // 逾期
        completed: that.conditionObj.completed || '', // 完成
        reason: obj.reason, // 删除备注
        // chooseFlag: obj.chooseFlag || '', // 0仅删除逾期任务，1删除所有待完成任务
        brandId: that.activeBrand, // 品牌 id
        chooseAll: that.selectRadio // 0：当页，1：所有
      };
      postRequest('/haoban-app-daily-web/daily/batch-delete-store-task', para)
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
     * 删除
     */
    handleDel(index, row) {
      let that = this;
      that
        .$confirm(`确认要删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postDel(index, row);
        })
        .catch(() => {});
    },

    postDel(index, row) {
      let that = this;
      let para = {
        taskId: row.taskId
      };
      getRequest('/haoban-app-daily-web/daily/delete-task-items', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            that.tableData.splice(index, 1);
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
     * 预览
     */
    handlePreview(index, row) {
      let that = this;
      that.postPreview(index, row);
    },

    /**
     *  预览---api
     */
    postPreview(index, row) {
      const that = this;
      // 生成二维码需要的 url
      let webUrl = `${row.taskId}`;
      that.$refs.qrcodePreview.qrcode(webUrl, 'daily-detail');
      that.dialogVisible = true;
    },

    /**
     * 获取列表数据
     */
    getTableList(val) {
      const that = this;
      let para = {
        storeId: that.conditionObj.storeId || '', // 门店
        overdue: that.conditionObj.overdue || '', // 逾期
        completed: that.conditionObj.completed || '',
        currentPage: that.currentPage, // 当前页
        pageSize: that.pageSize, // 一页显示个数
        brandId: that.activeBrand
      };
      getRequest('/haoban-app-daily-web/daily/page-store-task', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tableData = resData.result.result || [];
            that.total = resData.result.totalCount;
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
        that.getTableList();
      }
    }
  },
  mounted() {
    let that = this;
    document.documentElement.style.backgroundColor = '#f0f2f5';
    that.$emit('showTab', '1');
    that.activeBrand = that.brandId;
    that.conditionObj.storeId = that.$route.query.storeId;
    if (!!that.brandId) {
      that.getTableList();
    }
  },
  destroyed() {
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonDetailTop,
    multipleDel,
    qrcodeDialog
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.daily-set-content {
  padding: 16px;

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
