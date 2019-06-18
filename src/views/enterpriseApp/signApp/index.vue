<template>
  <div class="my-customer-wrap common-set-wrap">
    <div class="right-content">
      <common-app-top :appName="appName" :appIcon="appIcon" @selectBrandId="selectBrandId"> </common-app-top>
      <div class="right-box" :style="{ 'min-height': bgHeight }">
        <div class="apps-content flex" :style="{ 'min-height': bgHeight }">
          <div class="apps-content-right">
            <transition name="fade" mode="out-in">
              <router-view :brandId="activeBrand" :activeGroupId="activeGroup"></router-view>
            </transition>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import appDetail from '@/components/app/app-detail.vue';
import commonAppTop from '@/components/app/common-app-top.vue';
import commonDetailLeft from '@/components/app/app-detail-left.vue';
export default {
  name: 'reviewed',
  data() {
    return {
      bgHeight: window.screen.availHeight - 380 + 'px',
      appName: '签到',
      appIcon: '',
      activeBrand: '', // 商户(品牌) id
      activeGroup: '' // 商户(品牌) groupId
    };
  },
  computed: {},
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(path) {
      this.$router.push(path);
    },

    /**
     * 返回 的 brandId
     */
    selectBrandId(id, groupId) {
      let that = this;
      that.activeBrand = id;
      that.activeGroup = groupId;
    }
  },
  watch: {
    activeBrand: function(newData, oldData) {
      const that = this;
      that.activeBrand = newData;
    },
    activeGroup: function(newData, oldData) {
      const that = this;
      that.activeGroup = newData;
    }
  },
  mounted() {
    let that = this;
    let iconUrl = that.$route.query.appIcon;
    if (iconUrl) {
      that.appIcon = window.unescape(iconUrl);
    }
    document.documentElement.style.backgroundColor = '#f0f2f5';
  },
  destroyed() {
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonAppTop,
    commonDetailLeft
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.my-customer-wrap {
  height: 100%;
}

.right-content {
  /*width: 100%;*/
  padding: 24px;
  min-height: calc(100% - 160px);
  .my-customer-top {
    position: relative;
    height: 43px;
    line-height: 43px;
    .my-customer-return {
      position: absolute;
      left: 0px;
      bottom: 10px;
      width: 78px;
      height: 32px;
      border-radius: 18px;
    }

    .my-customer-brand {
      position: absolute;
      right: 0;
      bottom: 18px;
      width: 93px;
      height: 32px;
    }

    .my-customer-name {
      width: 200px;
      margin: 0 auto;

      i {
        font-size: 14px;
        color: #fff;
      }
      span {
        font-size: 16px;
        color: #000;
      }

      .app-icon {
        display: inline-block;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 4px;
        background: -webkit-linear-gradient(left, #7ab6fb, #508bfe);
        background: -moz-linear-gradient(left, #7ab6fb, #508bfe);
        background: linear-gradient(left, #7ab6fb, #508bfe);
      }
    }
  }
  .right-box {
    // background: #fff;
    min-height: 500px;
    padding: 0px;

    .apps-content {
      .apps-content-left {
        height: 100%;
        background: #fff;
        overflow-x: hidden;
        overflow-y: auto;

        .apps-content-left__title {
          height: 55px;
          line-height: 55px;
          padding: 0 0 0 18px;
        }

        .tab-left-list-cell {
          position: relative;
          text-align: left;
          margin-top: 15px;
          height: 30px;
          line-height: 30px;
          white-space: nowrap;
          overflow: hidden;
          cursor: pointer;

          &:hover {
            background: rgba(24, 144, 255, 0.06);
            i {
              color: #1890ff;
            }
          }
          &.active-tab {
            background: rgba(24, 144, 255, 0.06);
            &::before {
              content: ' ';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: 2px;
              background: #1890ff;
              z-index: 1;
            }
            i {
              color: #1890ff;
            }
          }

          .child-tab-left-list {
            li {
              position: relative;
              text-align: left;
              height: 30px;
              line-height: 30px;
              white-space: nowrap;
              overflow: hidden;
              cursor: pointer;

              &:hover {
                background: rgba(24, 144, 255, 0.06);
                i {
                  color: #1890ff;
                }
              }
              &.active-tab {
                background: rgba(24, 144, 255, 0.06);
                &::before {
                  content: ' ';
                  position: absolute;
                  left: 0;
                  top: 0;
                  bottom: 0;
                  width: 2px;
                  background: #1890ff;
                  z-index: 1;
                }
                i {
                  color: #1890ff;
                }
              }
            }
          }
        }
      }
      .apps-content-right {
        width: 100%;
        // background: #fff;
      }
    }
  }
}
</style>
