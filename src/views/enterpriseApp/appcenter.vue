<template>
  <div class="apps-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"> </nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="apps-content">
          <div class="apps-content-title">基础应用</div>
          <div class="apps-content-body m-t-24">
            <ul class="flex flex-row flex-wrap">
              <li v-for="(item, index) in appList" :key="item.appId + index" class="flex flex-align-center border-box flex" @click.self="toAppDetail(item)">
                <span class="square-item flex flex-align-center flex-pack-center" :style="{ background: item.appBackgroudColor }" @click.stop="toAppDetail(item)">
                  <!-- <i :class="['iconfont', item.appIcon]"></i> -->
                  <img :src="item.appIcon" alt="" :class="[item.status == 1 ? '' : 'filter-grayscale']" />
                </span>
                <span class="color-303133 font-16 p-l-8" @click.self="toAppDetail(item)">{{ item.appName }}</span>
                <div class="cell-arrow-down">
                  <el-dropdown class="app-cell-dropdown" trigger="hover">
                    <span class="el-dropdown-link"><i class="el-icon-more el-icon--right color-909399" style="cursor: pointer;"></i> </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item class="p-0"><span @click.stop="showPeople(item)">可见人群</span></el-dropdown-item>
                      <el-dropdown-item class="p-0">
                        <span @click.stop="changeSwitch(item)">{{ item.status == 1 ? '停用' : '启用' }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 公共组件 -->
    <visiableDialog :appId="appId" :appName="appName" :showDialog="showDialog" @hideDialog="hideDialog"></visiableDialog>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import visiableDialog from '@/components/app/visiable-dialog.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest } from '@/api/api';
export default {
  name: 'apps',
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
          name: '企业应用',
          path: ''
        }
      ],
      appList: [
        /* {
          appId: '1',
          appIcon: 'icon-tianjiachengyuan',
          appBackgroupColor: '#16BA8A',
          appName: '员工档案',
          status: true
        } */
      ],
      roleCode: '',

      // 可见人群弹窗
      appName: '',
      appId: '',
      showDialog: false
    };
  },
  computed: {},
  methods: {
    /**
     * 可见人群
     */
    showPeople(item) {
      const that = this;
      if (that.roleCode != 'master_admin' && that.roleCode != 'admin') {
        that.$message.error({
          duration: 1000,
          message: '暂无操作权限'
        });
        return false;
      }
      that.appName = item.appName;
      that.appId = item.appId;
      that.showDialog = true;
    },

    /**
     * 隐藏可见人群弹窗
     */
    hideDialog() {
      const that = this;
      that.appName = '';
      that.showDialog = false;
    },

    /**
     * 开启/停用
     */
    changeSwitch(item) {
      let that = this;
      if (that.roleCode != 'master_admin') {
        that.$message.error({
          duration: 1000,
          message: '暂无操作权限'
        });
        return false;
      }
      let flag = item.status == 1 ? '关闭' : '开启';

      that
        .$confirm(`确认${flag}【${item.appName}】应用吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postSwitch(item);
        })
        .catch(() => {});
    },

    postSwitch(item) {
      let that = this;
      let para = {
        appId: item.appId,
        status: item.status == 2 ? 1 : 2
      };
      getRequest('/haoban-manage-web/application-on-off', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('操作成功', 'success');
            item.status = item.status == 2 ? 1 : 2;
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
     * 跳转应用详情
     */
    toAppDetail(item) {
      let that = this;
      if (!item.appUrl) {
        return false;
      }
      if (item.appType == 0) {
        // 本地
        that.$router.push(`${item.appUrl}?appId=${item.appId}&appIcon=${item.appIcon}`);
      } else {
        window.open(item.appUrl);
      }
    },

    /**
     * 获取列表数据
     */
    getAppList(val) {
      const that = this;
      let para = {};
      getRequest('/haoban-manage-web/application-rigth-list', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.appList) {
              that.appList = resData.result.appList;
              that.roleCode = resData.result.roleCode;
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
  mounted() {
    this.getAppList();
  },
  components: {
    navCrumb,
    visiableDialog
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.bg-82C5FF {
  background: #82c5ff;
}

.color-508CEE {
  color: #508cee;
}

.color-FF585C {
  color: #ff585c;
}

.line-h-18 {
  line-height: 18px;
}

.tooltip-text {
  width: 100%;
  white-space: pre-wrap;
  word-break: break-all;
}
.apps-wrap {
  height: 100%;
}

.right-content {
  /*width: 100%;*/
  padding: 24px;
  min-height: calc(100% - 240px);
  .right-box {
    background: #fff;
    min-height: 500px;
    padding: 24px;

    .apps-content-body {
      li {
        position: relative;
        width: 235px;
        height: 70px;
        padding-left: 24px;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 6px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        &:hover {
          border-color: #dcdfe6;
        }

        .square-item {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          img {
            max-width: 40px;
            max-height: 40px;
            &.filter-grayscale {
              -webkit-filter: grayscale(100%);
              filter: grayscale(100%);
            }
          }
          i {
            font-size: 24px;
            color: #fff;
          }
        }
        .cell-arrow-down {
          position: absolute;
          top: 10px;
          right: 10px;
        }

        .app-cell-dropdown {
          .el-dropdown-menu__item {
            padding: 0;
          }
        }
      }
    }
  }
}

.el-dropdown-link {
  &:hover {
    i {
      color: #606266;
    }
  }
}
</style>
