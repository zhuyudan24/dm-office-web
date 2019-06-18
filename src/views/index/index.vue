<template>
  <div id="index">
    <vue-office-header :projectName="projectName" @collapseTag="collapseTag" @toRouterView="toRouterView"> </vue-office-header>
    <div id="content" class="content">
      <div class="content-body" :style="{ minHeight: contentHeight }">
        <div class="index-company flex flex-row">
          <div class="index-company-left m-r-24 border-box radius-2">
            <div class="index-company-logo">
              <div class="index-company-logo_img" v-if="companyObj.logoUrl">
                <img :src="companyObj.logoUrl" alt="log" />
              </div>
              <div v-else class="default-logo-bg">
                <i class="iconfont icon-2zuzhijiagou default-logo"></i>
              </div>
            </div>
            <div class="index-company-name color-303133">{{ companyObj.enterpriseName }}</div>
            <ul class="index-company-count">
              <li class="flex flex-between">
                <span
                  >企业人数
                  <el-tooltip class="item" effect="light" content="企业总人数，每日刷新一次" placement="right">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip> </span
                ><span class="color-303133 font-16">{{ companyObj.staffNumber || '--' }}人</span>
              </li>
              <li class="flex flex-between">
                <span
                  >行政架构部门数
                  <el-tooltip class="item" effect="light" content="企业行政架构部门总数，每日刷新一次" placement="right">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip> </span
                ><span class="color-303133 font-16">{{ companyObj.departmentNumber || '--' }}个</span>
              </li>
              <li class="flex flex-between">
                <span
                  >门店架构部门数
                  <el-tooltip class="item" effect="light" content="企业门店总数，每日刷新一次" placement="right">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip> </span
                ><span class="color-303133 font-16">{{ companyObj.storeGroupNumber || '--' }}个</span>
              </li>
              <li class="flex flex-between">
                <span
                  >昨日使用人数
                  <el-tooltip class="item" effect="light" content="昨日登录好办人数，每日刷新一次" placement="right">
                    <i class="iconfont icon-xinxixianshi"></i>
                  </el-tooltip> </span
                ><span class="color-303133 font-16">{{ companyObj.yesterdayUseNumber == '' || companyObj.yesterdayUseNumber == null ? '--' : companyObj.yesterdayUseNumber }}人</span>
              </li>
            </ul>
            <ul class="p-t-12">
              <li class="flex flex-between">
                <span>账户余额</span><span class="color-303133 font-16">￥{{ companyObj.balance }}</span>
              </li>
              <li class="flex flex-between">
                <span>企业编码</span><span class="color-303133 font-16">{{ companyObj.enterpriseCode || '--' }}</span>
              </li>
              <li class="flex flex-between" @click="toCertify(companyObj.authenticationStatus)">
                <span>企业认证</span><span :class="[companyObj.authenticationStatus == 1 ? 'authActive' : companyObj.authenticationStatus == 0 ? 'unAuth' : companyObj.authenticationStatus == 2 ? 'auth-ing' : 'auth-fail']"><i v-if="companyObj.authenticationStatus == 1 || companyObj.authenticationStatus == 0" class="iconfont icon-renzheng p-r-6 "></i><i v-if="companyObj.authenticationStatus == 2" class="iconfont icon-qiyerenzheng1 p-r-6 "></i><i v-if="companyObj.authenticationStatus == 3" class="iconfont icon-qiyerenzheng2 p-r-6 "></i>{{ companyObj.authenticationStatus == 1 ? '已认证' : companyObj.authenticationStatus == 0 ? '未认证' : companyObj.authenticationStatus == 2 ? '认证中' : '认证失败' }} </span>
              </li>
              <li class="flex flex-between">
                <span>帮助手册</span
                ><a href="https://other-1251519181.cos.ap-shanghai.myqcloud.com/pdf/20190521110719/好办使用手册-管理员.pdf" download="好办帮助手册.pdf"
                  ><span class="color-1890ff">立即下载<i class="el-icon-arrow-right"></i></span
                ></a>
              </li>
            </ul>
          </div>
          <!-- <div class="index-company-right radius-2">
            <div class="index-company-right__head flex flex-between border-box border-b-e4e7e7">
              <span class="color-303133 font-16 font-w-500">数据概览</span><span class="auto-define" @click="showDialogLayer('data')"><i class="iconfont icon-zidingyi color-909399"></i></span>
            </div>
            <div class="index-company-right__body p-24 border-box">
              <ul class="flex flex-row flex-wrap">
                <li v-for="(item, index) in dataOverview" :key="index">
                  <div class="color-606266 font-16 data-name">{{ item.fieldTitle }}</div>
                  <div class="color-303133 font-30 data-num font-w-500">{{ item.fieldData }}</div>
                </li>
              </ul>
            </div>
          </div> m-t-24 -->

          <div class="index-entry radius-2">
            <div class="index-swiper">
              <el-carousel trigger="click" height="250px" arrow="never" :autoplay="false">
                <el-carousel-item v-for="(item, index) in bannerList" :key="index">
                  <a class="index-swiper-bg" :href="item.linkType == 1 ? '#' + item.linkUrl : item.linkUrl" target="_blank" rel="nofollow noopener noreferrer" :style="{ backgroundImage: 'url(' + item.imgUrl + ')' }"><!-- <img :src="item.imgUrl" alt=""/> --></a>
                </el-carousel-item>
              </el-carousel>
            </div>
            <div class="bg-f5f8fa bg-space"></div>
            <div class="index-entry-head flex flex-between border-box border-b-e4e7e7">
              <span class="color-303133 font-16 font-w-500">快捷入口</span><span class="auto-define" @click="showDialogLayer('entry')"><i class="iconfont icon-zidingyi color-909399"></i></span>
            </div>
            <div class="index-entry-body p-24 border-box">
              <ul class="flex flex-row flex-wrap">
                <li v-for="(item, index) in entryData" :key="index" class="flex flex-align-center border-box flex" @click="changeRoute(item.fieldUrl)">
                  <span class="square-item flex flex-align-center flex-pack-center" :style="{ background: item.fieldIconBgColor }"><i :class="['iconfont', item.fieldIconUrl]"></i></span>
                  <span class="color-303133 font-16 p-l-20">{{ item.fieldTitle }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <vue-gic-footer></vue-gic-footer>
    </div>
    <!-- 自定义弹框组件 -->
    <custom-dialog :customTitle="customTitle" :customType="customType" :showCustomDialog="showCustomDialog" @customHandleConfirm="customHandleConfirm"> </custom-dialog>
  </div>
</template>
<script>
// 自定义弹窗
import customDialog from '@/components/index/customDialog';
// 公共头部菜单
// import vueOfficeHeader from "@/components/vue-office-header";
import { getRequest } from '@/api/api';
import errMsg from '@/common/js/error';
export default {
  name: 'index',
  data() {
    return {
      projectName: 'haoban-manage-web', // 当前项目名
      contentHeight: '0px', // 页面内容高度
      collapseFlag: false, // 折叠参数
      showCustomDialog: false, // 自定义弹框显示标志
      customType: '', // 自定义弹框标志
      customTitle: '', //  自定义弹框标题
      bannerList: [
        /*{
          advertisementId: '1',
          linkType: 1,
          linkUrl: '',
          imgUrl: 'https://img.alicdn.com/tfs/TB1.c6uugHqK1RjSZFEXXcGMXXa-4000-1000.png',
        }*/
      ],
      // 公司信息
      companyObj: {
        /*logoUrl: require('../../assets/logo.png'),
        enterpriseName: '公司名字',
        enterpriseCode: '',
        balance: '0',
        authenticationStatus: 0,*/
      },
      // 数据概览
      dataOverview: [
        /*{
          dataViewId: '1',
          fieldTitle: '员工数量',
          fieldData: '2500'
        }*/
      ],
      entryData: [
        /* {
          settingViewId: '1',
          fieldTitle: '通讯录行政架构',
          fieldIconBgColor: '#16BA8A',
          fieldIconUrl: 'icon-hangzhengjiagou',
          fieldUrl: '/index'
        }*/
      ]
    };
  },
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     *  处理路由跳转
     */
    toRouterView(val) {
      const that = this;
      // 模拟检查数据,有两个参数
      /*{
       name:,
       path:
      }*/
      that.$router.push({
        path: val.path
      });
    },

    /**
     *   折叠事件
     */
    collapseTag(val) {
      const that = this;
      that.collapseFlag = val;
    },

    /**
     *   自定义弹窗显示事件
     */
    showDialogLayer(type) {
      const that = this;
      that.showCustomDialog = true;
      that.customType = type;
      type == 'data' ? (that.customTitle = '数据概览') : (that.customTitle = '快捷操作');
    },

    /**
     *  自定义弹框触发事件
     */
    customHandleConfirm(val) {
      const that = this;
      that.showCustomDialog = false;
      that.customType === 'data' ? that.getDataOverview() : that.getEntryData();
    },

    toCertify(authType) {
      const that = this;
      if (authType == 1) {
        return;
      }
      that.changeRoute('/companyCertify');
    },

    /**
     *  获取轮播广告
     */
    getBannerData() {
      const that = this;
      getRequest('/haoban-manage-web/home/find-advertisement', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // resData.result[0].imgUrl ='https://img.alicdn.com/tfs/TB1.c6uugHqK1RjSZFEXXcGMXXa-4000-1000.png';
            that.bannerList = resData.result;
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
     *  获取企业信息
     */
    getEnterpriseData() {
      const that = this;
      getRequest('/haoban-manage-web/home/find-enterprise-info', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            resData.result.balance = Number(resData.result.balance).toFixed(2);
            if (resData.result.yesterdayUseNumber == 0) {
              resData.result.yesterdayUseNumber = String(resData.result.yesterdayUseNumber);
            }
            that.companyObj = resData.result;
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
     *  获取数据概览
     */
    getDataOverview() {
      const that = this;
      let para = {
        all: false,
        fetchData: true
      };
      getRequest('/haoban-manage-web/home/find-enterprise-data', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.dataOverview = resData.result;
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
     *  获取入口数据
     */
    getEntryData() {
      const that = this;
      let para = {
        all: false
      };
      getRequest('/haoban-manage-web/home/find-quick-entry', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.entryData = resData.result;
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
    that.contentHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 204 + 'px';
    Promise.all([that.getBannerData(), that.getDataOverview(), that.getEntryData(), that.getEnterpriseData()]);
  },
  components: {
    customDialog
    // vueOfficeHeader
  }
};
</script>
<style lang="less" scoped>
#index {
  .content {
    padding-top: 64px;
    box-sizing: border-box;
    /*overflow: auto;*/
    min-width: 1400px;
    height: auto;
    background: #f5f8fa;

    .content-body {
      display: flex;
      flex-direction: column;
      padding: 24px;
      background: #f5f8fa;
      overflow: hidden;

      .right-wrap {
        flex: 1;
        overflow: auto;
        width: 100%;

        .right-content {
          padding: 24px;
          min-height: 480px;
        }

        &.near-store-contain {
          .right-content {
            min-height: 570px;
          }
        }

        /deep/ .el-tabs__nav {
          z-index: 1;
        }
      }

      .index-swiper {
        width: 100%;
        height: 250px;
      }

      .el-carousel__item {
        text-align: center;
        /*background: url(../../assets/index/index_banner1.jpg) no-repeat center center;*/
      }

      /* display */
      .top {
        vertical-align: top;
      }

      .middle {
        vertical-align: middle;
      }

      /* flex */
      .flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
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

      .flex-between {
        -webkit-justify-content: space-between;
        justify-content: space-between;
      }

      .m-t-24 {
        margin-top: 24px;
      }
      .m-r-24 {
        margin-right: 24px;
      }

      .border-b-e4e7e7 {
        border-bottom: 1px solid #e4e7e7;
      }

      .radius-2 {
        border-radius: 2px;
      }

      .bg-space {
        width: 100%;
        height: 24px;
        background: #f5f8fa;
      }

      .icon-zidingyi {
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }

      .icon-xinxixianshi {
        cursor: pointer;
        color: #909399;
        font-size: 14px;
      }

      .square-item {
        width: 40px;
        height: 40px;
        border-radius: 4px;

        i {
          font-size: 24px;
          color: #fff;
        }
      }

      .index-swiper-bg {
        display: block;
        width: 100%;
        height: 250px;
        background-size: auto 100%;
        background-color: #030427;
        background-position: center;
        background-repeat: no-repeat;
      }

      .index-company {
        width: 100%;
        min-height: 340px;

        &-left {
          width: 360px;
          // height: 340px;
          padding: 24px;
          background: #fff;

          .index-company-count {
            padding: 12px 0;
            border-top: 1px solid #e4e7ed;
            border-bottom: 1px solid #e4e7ed;
          }

          li {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
          }

          .el-icon-arrow-right {
            padding-left: 8px;
          }

          .unAuth {
            color: #1890ff;
            cursor: pointer;
            i {
              color: #c0c4cc;
            }
          }

          .authActive {
            color: #303133;
            i {
              color: #f7cb27;
            }
          }

          .auth-ing {
            color: #303133;
            cursor: pointer;
            i {
              color: #1890ff;
            }
          }

          .auth-fail {
            color: #303133;
            cursor: pointer;
            i {
              color: #f56c6c;
            }
          }
        }
        &-logo {
          text-align: center;

          .index-company-logo_img {
            width: 70px;
            height: 70px;
            margin: 0 auto;
            border-radius: 6px;
            padding: 6px;
            border: 1px solid #dcdfe6;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .flex();
            .flex-align-center();
            .flex-pack-center();
          }
          img {
            width: 100%;
          }
          .default-logo-bg {
            width: 70px;
            height: 70px;
            line-height: 70px;
            margin: 0 auto;
            background: #82c5ff;
            border-radius: 6px;
          }
          .default-logo {
            font-size: 35px;
            color: #e5f3ff;
          }
        }
        &-name {
          height: 44px;
          margin: 17px 0 5px 0;
          line-height: 44px;
          font-size: 16px;
          text-align: center;
        }

        &-right {
          width: calc(100% - 384px);
          min-width: 968px;
          height: 340px;
          background: #fff;

          &__head {
            height: 56px;
            line-height: 56px;
            padding: 0 24px;
          }

          &__body {
            li {
              min-width: 25%;
            }

            .data-name {
              height: 48px;
              line-height: 48px;
            }
            .data-num {
              height: 62px;
              line-height: 62px;
              margin-bottom: 30px;
            }
          }
        }
      }

      .index-entry {
        width: 100%;
        // height: 247px;
        background: #fff;
        &-head {
          height: 56px;
          line-height: 56px;
          padding: 0 24px;
        }

        &-body {
          // height: 190px;

          li {
            min-width: 30%;
            height: 56px;
            padding-left: 24px;
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(220, 223, 230, 1);
            border-radius: 4px;
            margin-right: 5%;
            margin-bottom: 24px;
            cursor: pointer;
            &:hover {
              border-color: #1890ff;
            }

            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
      }
    }
  }

  /deep/ .el-submenu__title {
    height: 40px;
    line-height: 40px;
  }

  /* 表格为空 */
  /deep/ .el-table__empty-block {
    height: 256px;
  }
}

/* 隐藏 头部 */
.navheader {
  div.itemlink-gic.bottom {
    display: none;
  }

  a.itemlink.bottom {
    display: none;
  }
}

.el-table__empty-block {
  height: 256px;
}

.el-table__empty-text {
  width: auto;
  margin-bottom: 80px;

  &::before {
    content: ' ';
    display: block;
    width: 60px;
    height: 60px;
    background: url(../../assets/no-data_icon.png) no-repeat center;
    margin: 0px auto 22px auto;
  }
}

.el-submenu__title {
  height: 40px;
  line-height: 40px;
}

.user-header-pop {
  min-width: 95px;
}

.el-popover.user-header-pop {
  min-width: 95px;
}

.left-aside-contain {
  /deep/ .el-submenu__title:hover {
    background-color: #020b21;
  }
}

.el-menu.el-menu--popup {
  background: #020b21;
  border-radius: 4px;
}

/* 输入框 focus*/
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: #dcdfe6;
}

/* 箭头*/
.icon-to-pre {
  cursor: pointer;
  font-size: 18px;
  -webkit-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}

.icon-to-next {
  cursor: pointer;
  font-size: 18px;
  -webkit-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  transform: rotate(-90deg);
}

/* 富文本编辑器 */
.mce-tinymce {
  -webkit-box-shadow: none;
  box-shadow: none;
}
</style>
