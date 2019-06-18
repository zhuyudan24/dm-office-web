<template>
  <div class="login-wrap">
    <header>
      <div class="login-wrap-header">
        <img class="login-wrap-inline" src="../../assets/logo.png" alt="logo" />
        <span class="login-wrap-inline">好办管理后台</span>
      </div>
    </header>
    <section>
      <div class="login-wrap-body">
        <div class="login-wrap-out">
          <div class="login-wrap-inner">
            <div class="login-wrap-inner__block" v-if="!canSelectFlag">
              <div class="login-wrap-inner__head">扫码登录</div>
              <div class="login-wrap-inner__body">
                <!-- 二维码失效 -->
                <div class="login-wrap-inner__expired" v-if="expiredFlag">
                  <p class="login-wrap-expired__title">您的二维码已失效，</p>
                  <p class="login-wrap-expired__title m-t-10">请点击下方刷新按钮</p>
                </div>
                <div id="qrcode" title=""></div>
                <p class="login-wrap-inner__title">请使用好办APP扫一扫登录<i class="el-icon-refresh" @click="refreshCode">刷新</i></p>
              </div>
            </div>
            <!-- 选择企业 -->
            <div class="login-wrap-inner__block" v-if="canSelectFlag">
              <div class="login-wrap-inner__head">选择已有企业</div>
              <div class="login-wrap-inner__selectBody">
                <div class="login-wrap-inner__swiper" title="">
                  <!-- swiper -->
                  <swiper :options="swiperOption" ref="mySwiper">
                    <!-- <div class="login-wrap-inner__swiperWrap"> -->
                    <swiper-slide v-for="(item, index) in enterpriseList" :key="item.enterpriseId">
                      <a :class="['swiper-cell flex flex-align-center flex-pack-center flex-column', item.enterpriseId == enterpriseId ? 'current-item' : '']" @click="selectEnterprise(item.enterpriseId, index)">
                        <div :class="['swiper-slide-log_img', item.logoUrl ? 'img-bg' : 'defalut-bg']">
                          <img v-if="item.logoUrl" class="swiper-slide__img" :src="item.logoUrl" alt="src" />
                          <i v-else class="iconfont icon-2zuzhijiagou"></i>
                        </div>
                        <p class="swiper-slide__p">{{ item.enterpriseName }}</p>
                      </a>
                    </swiper-slide>
                    <!-- </div> -->
                    <!-- <div class="swiper-pagination" slot="pagination"></div> -->
                    <div class="swiper-button-prev" slot="button-prev">
                      <i class="el-icon-arrow-left"></i>
                    </div>
                    <div class="swiper-button-next" slot="button-next">
                      <i class="el-icon-arrow-right"></i>
                    </div>
                  </swiper>
                </div>
                <el-button type="primary h-48" @click="toIndex">登录</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <footer class="p-t-35">
      <vue-gic-footer></vue-gic-footer>
    </footer>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { _debounce } from '@/common/js/public';
import QRCode from 'qrcodejs2';
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';

export default {
  name: 'login',
  data() {
    return {
      qrcodeCase: '', // 二维码实例
      qrcodeNum: '', // 二维码数据
      enterpriseId: '', // 当前选择的 企业 id
      expiredFlag: false, // 二维码过期标志
      canSelectFlag: false, // 能否选择企业标志

      userId: '', // 返回的 userId

      ajaxTime: null,
      // 企业列表
      enterpriseList: [
        /*{
          enterpriseId  : '1231',
          logoUrl: require("../../assets/logo.png"),
          enterpriseName: '达摩网络'
        },*/
      ],
      // swiper
      swiperOption: {
        slidesPerView: 3,
        centeredSlides: true,
        spaceBetween: 0,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true
        // },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    };
  },
  computed: {},
  methods: {
    /**
     * 处理路由跳转
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
     *  折叠事件
     */
    collapseTag(val) {
      const that = this;
      that.collapseFlag = val;
    },

    /**
     *  选择企业
     */
    selectEnterprise(id, index) {
      const that = this;
      that.enterpriseId = id;
      that.$refs.mySwiper.swiper.slideTo(index, 500, false);
    },

    /**
     *  生成二维码
     */
    qrcode(text) {
      const that = this;
      let qrObj = {
        type: 'web-login',
        data: text
      };
      that.qrcodeCase = new QRCode('qrcode', {
        width: 210,
        height: 210, // 高度
        text: JSON.stringify(qrObj) // 二维码内容 //
        //render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas） //
        //background: '#f0f',
        //foreground: '#ff0'
      });

      document.getElementById('qrcode').title = '';
    },

    /**
     *  刷新二维码
     */
    refreshCode: _debounce(function() {
      const that = this;
      if (!!that.qrcodeCase) {
        document.getElementById('qrcode').innerHTML = '';
        that.qrcodeCase.clear(); // 先清除原有的
      }
      that.getQrcode();
      that.expiredFlag = false; //隐藏过期遮罩层
    }, 500),

    /**
     *  登录
     */
    toIndex: _debounce(function() {
      const that = this;
      that.toLogin();
    }, 500),

    /**
     *  登录 --- api
     */
    toLogin() {
      const that = this;
      if (!that.enterpriseId) {
        that.$message.error({
          duration: 1000,
          message: '请选择企业'
        });
        return false;
      }
      let para = {
        qrcode: that.qrcodeNum,
        enterpriseId: that.enterpriseId,
        userId: that.userId
      };
      postRequest('/haoban-manage-web/login', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            localStorage.removeItem('userInfo');
            localStorage.setItem('userInfo', JSON.stringify(resData.result));
            that.$router.push('/index');
            return;
          }
          if (resData.errorCode == 30004) {
            that.getQrcode();
            that.expiredFlag = false; //隐藏过期遮罩层
            that.canSelectFlag = false;
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
     *  查询登录 --- api
     */
    checkLogin() {
      const that = this;
      let para = {
        qrcode: that.qrcodeNum
      };
      postRequest('/haoban-manage-web/login-check', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.enterpriseList && !!resData.result.enterpriseList.length) {
              that.enterpriseList = resData.result.enterpriseList;
              that.enterpriseId = that.enterpriseList[0].enterpriseId;
              that.userId = resData.result.userId;
              // 清空二维码，取消轮询
              that.canSelectFlag = true;
              document.getElementById('qrcode').innerHTML = '';
              that.qrcodeCase.clear(); // 先清除原有的
              // that.ajaxTime = null;
              clearInterval(that.ajaxTime);
            }
            return;
          }
          if (resData.errorCode == 30002) {
            // 二维码失效
            that.expiredFlag = true;
          }
          errMsg.errorMsg(resData);
          // that.ajaxTime = null;
          clearInterval(that.ajaxTime);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    checkScan() {
      const that = this;
      clearInterval(that.ajaxTime);
      that.ajaxTime = null;
      that.ajaxTime = setInterval(function() {
        that.checkLogin();
      }, 3000);
    },

    /**
     *  登录---获取二维码字符串 API
     */
    getQrcode() {
      const that = this;
      postRequest('/haoban-manage-web/login-qrcode', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.qrcodeNum = resData.result;
            that.qrcode(that.qrcodeNum);
            that.checkScan();
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
    that.getQrcode();
    if (!!localStorage.getItem('userInfo')) {
      localStorage.removeItem('userInfo');
    }
  },
  components: {
    swiper,
    swiperSlide
  }
};
</script>
<style lang="less" scoped>
.flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
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

.flex-between {
  -webkit-justify-content: space-between;
  justify-content: space-between;
}
.login-wrap {
  position: relative;

  header {
    width: 100%;
    padding: 0;
    margin: 0;
    background: rgba(255, 255, 255, 1);
  }

  &-header {
    width: 1400px;
    height: 64px;
    line-height: 64px;
    padding: 0 0 0 60px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 1);
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    /*-webkit-box-shadow: 0px 0px 10px rgba(147,165,184,0.13);
      -moz-box-shadow: 0px 0px 10px rgba(147,165,184,0.13);
      box-shadow: 0px 0px 10px rgba(147,165,184,0.13);*/
  }

  &-inline {
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    color: #1f2f3d;
  }

  &-body {
    width: 100%;
    background: url('../../assets/login/banner.png') no-repeat center center;
    background-size: auto 640px;
  }

  &-out {
    position: relative;
    width: 1400px;
    height: 640px;
    margin: 0 auto;
    /*background: rgba(0,0,0,1);*/
  }

  &-inner {
    position: absolute;
    top: 77px;
    right: 170px;
    width: 356px;
    height: 382px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(235, 238, 245, 1);
    border-radius: 4px;
    -webkit-box-shadow: 2px 0px 12px rgba(6, 19, 33, 0.1);
    -moz-box-shadow: 2px 0px 12px rgba(6, 19, 33, 0.1);
    box-shadow: 2px 0px 12px rgba(6, 19, 33, 0.1);

    &__block {
      position: relative;
      width: 100%;
      height: 100%;
      text-align: center;
    }

    &__head {
      width: 100%;
      height: 64px;
      line-height: 64px;
      border-bottom: 1px solid rgba(235, 238, 245, 1);
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 18px;
      color: #303133;
    }
    &__body {
      position: relative;
      width: 100%;
      height: 317px;
      text-align: center;
      padding: 32px 0 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;

      #qrcode {
        width: 210px;
        height: 210px;
        margin: 0 auto;
      }
    }

    &__title {
      width: 100%;
      margin-top: 20px;
      font-size: 14px;
      color: #606266;
    }

    &__expired {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      top: 32px;
      left: 73px;
      width: 210px;
      height: 210px;
      background: rgba(255, 255, 255, 1);
      opacity: 0.9;
    }

    &__selectBody {
      position: relative;
      width: 100%;
      height: 317px;
      text-align: center;
      padding: 32px 21px 0;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;

      .el-button--primary {
        width: 100%;
        margin-top: 67px;
      }
    }

    &__swiper {
      margin-top: 30px;

      .swiper-cell {
        cursor: pointer;

        .swiper-slide-log_img {
          padding: 6px;
          border-radius: 8px;
          text-align: center;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          &.defalut-bg {
            padding: 25px;
            background: #82c5ff;
            -webkit-transform: scale(0.8);
            -moz-transform: scale(0.8);
            transform: scale(0.8);
            i {
              font-size: 35px;
              color: #e5f3ff;
            }
          }
        }
        .img-bg {
          background: #ededee;
          -webkit-transform: scale(0.8);
          -moz-transform: scale(0.8);
          transform: scale(0.8);
        }

        &.current-item {
          .swiper-slide-log_img {
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            transform: scale(1);

            &.defalut-bg {
              /*padding: 25px;*/
              -webkit-transform: scale(1);
              -moz-transform: scale(1);
              transform: scale(1);
            }
          }
        }
      }

      .swiper-slide {
        &__img {
          width: 72px;
          height: 72px;
          border-radius: 8px;
        }
        &__p {
          margin-top: 14px;
          font-size: 14px;
          color: #6b6d71;
        }
      }
      .swiper-button-prev {
        height: 97px;
        margin-top: -61px;
        left: 0;
        padding-top: 55px;
        background: #fff;
        background-image: none;

        i {
          color: #303133;
        }
      }
      .swiper-button-next {
        height: 97px;
        margin-top: -61px;
        right: 0;
        padding-top: 55px;
        background: #fff;
        background-image: none;

        i {
          color: #303133;
        }
      }
    }
  }

  &-expired__title {
    font-size: 14px;
    color: #f56c6c;
  }

  .el-icon-refresh {
    color: #1890ff;
    cursor: pointer;
  }

  .el-button {
    &.h-48 {
      height: 48px;
    }
  }
}
</style>
