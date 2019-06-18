<!--
  我的顾客应用：
  <app-detail ></app-detail>
 -->
<template>
  <div class="app-detail-wrap">
    <div v-if="tabType == 1">
      <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
      <div class="app-detail-pane border-box p-45">
        <el-checkbox v-model="myCustomData.searchFlag">会员搜索设置</el-checkbox>
        <div class="m-t-46">
          <el-button type="primary" @click="submit('searchFlag')">保 存</el-button>
        </div>
      </div>
    </div>
    <div v-if="tabType == 2">
      <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
      <div class="app-detail-pane border-box p-45">
        <el-checkbox v-model="myCustomData.chatFlag">在线沟通设置</el-checkbox>
        <div class="m-t-46">
          <el-button type="primary" @click="submit('chatFlag')">保 存</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import commonDetailTop from '@/components/app/common-detail-top.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: 'app-detail',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    },
    tabType: {
      type: String,
      default() {
        return '1';
      }
    }
  },
  data() {
    return {
      projectName: '', // 当前项目名
      myCustomData: {
        searchFlag: false,
        chatFlag: false
      },
      topMenuData: [
        {
          id: '1',
          name: '会员搜索设置'
        }
      ],
      activeId: '1'
    };
  },
  beforeMount() {
    let that = this;
    let host = window.location.origin;
    if (host.indexOf('localhost') != -1) {
      that.baseUrl = 'http://www.gicdev.com';
    } else {
      that.baseUrl = host;
    }
  },
  methods: {
    /* eslint-disable */
    handleClick(tab, event) {
      console.log(tab, event);
    },

    /**
     * 保存
     */
    submit: _debounce(function(type) {
      const that = this;
      that.setData(type);
    }, 500),

    /**
     * 保存-API
     */
    setData(type) {
      const that = this;
      let para = {
        brandId: that.brandId,
        enterpriseId: JSON.parse(localStorage.getItem('userInfo')).enterpriseId
      };
      para[type] = !!that.myCustomData[type] ? 1 : 0;
      let url = '/haoban-app-member-web/customer/save-online-chat-setting';
      if (type === 'searchFlag') {
        url = '/haoban-app-member-web/customer/save-customer-setting';
      }
      postRequest(url, para)
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
     * 获取全品牌搜索设置数据
     */
    getCustomerSet(brandId) {
      const that = this;
      let para = {
        brandId: brandId
      };
      postRequest('/haoban-app-member-web/customer/find-customer-setting', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result) {
              that.myCustomData.searchFlag = !!resData.result.searchFlag ? true : false;
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
     * 获取在线沟通设置数据
     */
    getChatSet(brandId) {
      const that = this;
      let para = {
        brandId: brandId
      };
      postRequest('/haoban-app-member-web/customer/find-online-chat-setting', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result) {
              that.myCustomData.chatFlag = !!resData.result.chatFlag ? true : false;
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
      const that = this;
      that.getChatSet(newData);
      that.getCustomerSet(newData);
    },
    tabType: function(newData, oldData) {
      const that = this;
      console.log(newData)
      if (newData == 1) {
        that.topMenuData = [
          {
            id: '1',
            name: '会员搜索设置'
          }
        ]
        that.activeId = 1;
      }else {
        that.topMenuData = [
          {
            id: '2',
            name: '在线沟通设置'
          }
        ]
        that.activeId = '2';
      }
    }
  },
  /*  mounted() {
    const that = this;
  },*/
  components: {
    commonDetailTop
  }
};
</script>
<style lang="less" scoped>
.w-500 {
  width: 500px;
}

.color-1890ff {
  color: #1890ff;
}

.app-detail-wrap {
  .el-tabs {
    background: #fff;
    /deep/ .el-tabs__nav-wrap {
      height: 54px;
      line-height: 54px;

      &::after {
        height: 1px;
      }

      .el-tabs__nav-scroll {
        padding-left: 20px;
      }
    }

    .el-tab-pane {
      padding: 1px;
    }
  }
}
</style>
