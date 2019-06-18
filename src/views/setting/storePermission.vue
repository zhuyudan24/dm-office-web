<template>
  <div class="storePermission-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" style="background: unset; padding: 0;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <template v-for="(item, index) in brandList">
            <el-tab-pane :label="item.name" :name="item.groupId" :key="'name' + index"> </el-tab-pane>
          </template>
        </el-tabs>
        <div class="storePermission-title font-w-500">
          门店成员通讯录可见权限
        </div>
        <div v-if="brandList.length" class="bg-fff permiss-contain">
          <set-permiss ref="clerkPermiss" :permType="1" :authData="brandList.clerkData"> </set-permiss>
          <div class="b-l"></div>
          <set-permiss ref="clerkManagePermiss" :permType="2" :authData="brandList.managerData"> </set-permiss>
          <div class="switch-cell p-l-110 m-t-15">
            <el-button type="primary" @click="saveAll">保 存</el-button>
          </div>
        </div>
        <div v-if="brandList.length" class="storePermission-wrap-switch m-t-24">
          <div class="storePermission-switch-title font-w-500">
            门店信息变更是否需要审核
          </div>
          <div class="storePermission-switch-body">
            <div class="switch-cell">
              <el-switch v-model="switchList.addStoreClerkCheck" :inactive-text="switchList.addName"> </el-switch>
            </div>
            <div class="switch-cell">
              <el-switch v-model="switchList.deleteStoreClerkCheck" :inactive-text="switchList.delName"> </el-switch>
            </div>
            <div class="switch-cell">
              <el-switch v-model="switchList.storeInformationChangeCheck" :inactive-text="switchList.modName"> </el-switch>
            </div>
            <div class="switch-cell p-l-94">
              <el-button type="primary" @click="saveSwitch">保 存</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import setPermiss from '@/components/set/set-permiss.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: 'storePermission',
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '设置',
          path: '/companyAddress'
        },
        {
          name: '通讯录信息',
          path: '/staffDetails'
        },
        {
          name: '门店权限设置',
          path: ''
        }
      ],
      // 品牌 tab
      activeName: '', // 显示的pannel,也是选择的 groupId
      brandList: [
        /*{
          id: 'a',
          name: 'A 品牌',
          clerkData: {},
          managerData: {}
        }*/
      ],
      // 审核开关
      switchList: {
        addName: '新增门店成员',
        addStoreClerkCheck: false,
        delName: '删除门店成员',
        deleteStoreClerkCheck: false,
        modName: '门店信息变更',
        storeInformationChangeCheck: false
      }
    };
  },
  computed: {},
  methods: {
    /**
     * tab clcik
     */
    handleClick(tab, event) {
      const that = this;
      that.getStoreAuth(tab.name, Number.parseInt(tab.index));
      that.activeName = tab.name;
    },

    /**
     * save
     */
    saveSwitch: _debounce(function() {
      const that = this;
      let data = JSON.parse(JSON.stringify(that.switchList));
      data.addStoreClerkCheck = data.addStoreClerkCheck == true ? 1 : 0;
      data.deleteStoreClerkCheck = data.deleteStoreClerkCheck == true ? 1 : 0;
      data.storeInformationChangeCheck = data.storeInformationChangeCheck == true ? 1 : 0;
      that.setStoreAuth(data);
    }, 600),

    /**
     *  保存所有（两个）
     *
     */
    saveAll: _debounce(function() {
      /* eslint-disable */
      let that = this;
      if (that.$refs.clerkPermiss.ruleForm.radio == 3 && (!that.$refs.clerkPermiss.ruleForm.visibleAll.length && !that.$refs.clerkPermiss.ruleForm.visibleStoreAll.length)) {
        that.$message.error({
          duration: 1000,
          message: '请选择指定部门/人员'
        });
        return false;
      }
      if (that.$refs.clerkManagePermiss.ruleForm.radio == 3 && (!that.$refs.clerkManagePermiss.ruleForm.visibleAll.length && !that.$refs.clerkManagePermiss.ruleForm.visibleStoreAll.length)) {
        that.$message.error({
          duration: 1000,
          message: '请选择指定部门/人员'
        });
        return false;
      }
      that.$refs.clerkPermiss.submitForm('ruleForm');
      let clerkTime = setTimeout(() => {
        that.$refs.clerkManagePermiss.submitForm('ruleForm');
        clearTimeout(clerkTime);
      }, 500);
    },500),

    /**
     * 门店权限设置
     */
    setStoreAuth(data) {
      const that = this;
      let para = {
        brandId: data.brandId,
        groupId: that.activeName,
        addStoreClerkCheck: data.addStoreClerkCheck,
        deleteStoreClerkCheck: data.deleteStoreClerkCheck,
        storeInformationChangeCheck: data.storeInformationChangeCheck
      };
      postRequest('/haoban-manage-web/brand/saveStoreAuth', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
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
     * 获取门店权限设置
     */
    getStoreAuth(groupId, index) {
      const that = this;
      let para = {
        groupId: groupId
      };
      postRequest('/haoban-manage-web/brand/storeAuth', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result) {
              that.brandList.clerkData = resData.result;
              that.brandList.managerData = resData.result;
              // 设置开关
              let brandDTO = resData.result.brandDTO;
              brandDTO.addStoreClerkCheck = brandDTO.addStoreClerkCheck == 1 ? true : false;
              brandDTO.deleteStoreClerkCheck = brandDTO.deleteStoreClerkCheck == 1 ? true : false;
              brandDTO.storeInformationChangeCheck = brandDTO.storeInformationChangeCheck == 1 ? true : false;
              that.switchList = Object.assign(that.switchList, brandDTO);
              that.$forceUpdate();
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
    },

    /**
     * 获取品牌列表
     */
    getBrandData() {
      const that = this;
      postRequest('/haoban-manage-web/brand/list', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              that.brandList = resData.result;
              that.activeName = resData.result[0].groupId;
              that.getStoreAuth(resData.result[0].groupId, 0);
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
    const that = this;
    that.getBrandData();
  },
  components: {
    navCrumb,
    setPermiss
  }
};
</script>
<style lang="less" scoped>
.bg-fff {
  background: #fff;
}

.common-set-wrap {
  .right-content {
    /*width: 100%;*/
    padding: 24px;
    min-height: calc(100% - 240px);

    .right-box {
      /*background: #fff;*/
      /*padding: 24px;*/
      min-height: 500px;

      .m-t-24 {
        margin-top: 24px;
      }

      .el-tabs {
        background: #fff;
        /deep/ .el-tabs__nav-wrap {
          height: 54px;
          line-height: 54px;

          .el-tabs__nav-next,
          .el-tabs__nav-prev {
            line-height: 54px;
          }

          &::after {
            height: 1px;
          }

          .el-tabs__nav-scroll {
            padding-left: 20px;
          }
          &.is-scrollable {
            .el-tabs__nav-scroll {
              padding-left: 0;
            }
          }
        }

        .el-tab-pane {
          padding: 1px;
        }
      }

      .b-l {
        width: 100%;
        height: 0;
        margin: 38px 0 26px 0;
        border-top: 1px solid #e4e7ed;
      }

      .el-form-item {
        margin-bottom: 0;
      }

      .storePermission-title {
        .bg-fff;
        padding: 10px 32px 0 32px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }

      .storePermission-wrap-switch {
        width: 100%;
        background: #fff;
      }

      .storePermission-switch-title {
        width: 100%;
        padding: 0 32px;
        height: 54px;
        line-height: 54px;
        font-size: 16px;
        color: #303133;
        border-bottom: 1px solid #e4e7ed;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }

      .p-l-94 {
        padding-left: 94px;
      }

      .storePermission-switch-body {
        width: 100%;
        padding: 34px 32px;

        .switch-cell {
          margin-bottom: 42px;
        }
        .el-switch {
          /deep/ .is-active {
            color: #303133;
          }
        }
      }
    }
  }
}

.permiss-contain {
  width: 100%;
  padding: 24px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
</style>
