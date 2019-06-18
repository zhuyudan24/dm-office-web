<template>
  <div class="custom-set-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="custom-set-content boder-box">
      <div class="flex flex-space-between flex-pack-center m-b-23 m-t-30">
        <div class="custom-set-title flex flex-pack-center">模板列表（{{ tableData.length }}）</div>
        <div>
          <el-button type="button" @click="toCustomSet('')">新建模板</el-button>
        </div>
      </div>
      <el-table class="select-table" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column label="模板名称" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column prop="name" label="模板描述" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column prop="address" label="门店类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.storeType == 0">自营门店</span>
            <span v-if="scope.row.storeType == 1">联营门店</span>
            <span v-if="scope.row.storeType == 2">代理门店</span>
            <span v-if="scope.row.storeType == 3">代销门店</span>
            <span v-if="scope.row.storeType == 4">托管门店</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
            <el-button type="text" size="small" @click="handleCopy(scope.$index, scope.row)">复制</el-button>
            <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>
  </div>
</template>
<script>
// import navCrumb from '@/components/nav/nav.vue';
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import { postRequest } from '@/api/api';
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
  data() {
    return {
      dialogVisible: false,
      // 二维码
      tableH: window.screen.availHeight - 464 - 126 + 'px',
      topMenuData: [
        {
          id: '1',
          name: '自定义报表'
        }
      ],
      activeId: '1',
      activeTab: '1',
      activeBrand: '1', // 商户(品牌) id
      tableData: [],
      multipleSelection: []
    };
  },
  computed: {},
  methods: {
    /**
     * 路由跳转
     */
    changeRouter(path) {
      let that = this;
      that.$router.push(path);
    },

    setSelectTab(item) {
      let that = this;
      that.activeTab = item.tabId;
    },

    /**
     * 预览模板
     */
    handlePreview(index, item) {
      let that = this;
      let webUrl = `${window.location.origin}/office-mobile/#/defineTemplate?templateId=${item.dailyReportTemplateId}`;
      that.$refs.qrcodePreview.qrcode(webUrl, 'daily-preview');
      that.dialogVisible = true;
    },

    /**
     * 新增模板
     */
    toCustomSet() {
      let that = this;
      that.changeRouter(`/template?brandId=${that.brandId}&appIcon=${that.$route.query.appIcon}`);
    },

    /**
     * 复制模板
     */
    handleCopy(index, item) {
      let that = this;
      that.changeRouter(`/template?brandId=${that.brandId}&templateId=${item.dailyReportTemplateId}&type=copy&appIcon=${that.$route.query.appIcon}`);
    },

    /**
     * 编辑模板
     */
    handleEdit(index, item) {
      let that = this;
      that.changeRouter(`/template?brandId=${that.brandId}&templateId=${item.dailyReportTemplateId}&type=edit&appIcon=${that.$route.query.appIcon}`);
    },

    /**
     * 删除模板
     */
    handleDelete(index, item) {
      let that = this;
      that
        .$confirm('一旦删除之后，该范围的门店将无法接收该日报，是否确定删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.deleteTemplate(index, item);
        })
        .catch(() => {});
    },
    deleteTemplate(index, item) {
      let that = this;
      postRequest('/haoban-app-daily-web/daily/del-define-template', { templateId: item.dailyReportTemplateId })
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
     *  获取 列表数据
     */
    getData() {
      let that = this;
      postRequest('/haoban-app-daily-web/daily/list-define-template', { brandId: that.brandId })
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.tableData = [];
            if (!!resData.result && !!resData.result.length) {
              that.tableData = resData.result;
            }
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
      let that = this;
      if (!!newData) {
        that.activeBrand = newData;
        that.getData();
      }
    }
  },
  mounted() {
    document.documentElement.style.backgroundColor = '#f0f2f5';
    this.$emit('showTab', '212');
    if (!!this.brandId) {
      this.getData();
    }
  },
  destroyed() {
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonDetailTop,
    qrcodeDialog
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.custom-set-wrap {
  .custom-set-content {
    padding: 0 16px;

    .custom-set-title {
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>
