<template>
  <div class="template-wrap" :style="{ height: bodyHeight }">
    <div class="template-contain">
      <!-- 头部标题 -->
      <div class="template-head">
        <div class="template-title flex-1">
          <img src="../../../assets/logo45_45.png" alt="logo" />
          <span class="template-title-span">系统报表设置</span>
        </div>
        <div class="template-btns flex-1 flex-r">
          <el-button type="primary" plain @click="saveAndBack('preview')">预 览</el-button>
          <el-button type="primary" plain @click="returnBack">返 回</el-button>
          <el-button type="primary" @click="saveAndBack('save')">保存并启用</el-button>
        </div>
      </div>
      <!-- 模板body -->
      <div class="template-body">
        <!-- 左侧 -->
        <div class="template-cell template-cell-l system-template-tab">
          <!-- tab 切换 -->
          <el-tabs v-model="activeName">
            <el-tab-pane label="系统字段" name="first">
              <div class="filed-item-title">卡片</div>
              <ul>
                <draggable id="list1" :list="cardInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd"
                  ><!-- @end="itemMoveEnd" -->
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in cardInfo" :key="index" @mousedown="clickItem(item)" aria-hidden="true">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">交易</div>
              <ul>
                <draggable id="list2" :list="tradeInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in tradeInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">生日会员</div>
              <ul>
                <draggable id="list3" :list="birthdayMemberInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in birthdayMemberInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">会员</div>
              <ul>
                <draggable id="list4" :list="memberInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in memberInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
              <div class="filed-item-title">执行力</div>
              <ul>
                <draggable id="list5" :list="powerInfo" class="compenent" :options="leftOption" :move="onMove" @start="isDragging = true" @end="itemMoveEnd">
                  <li :class="['compenent-item', item.fixed == true ? 'fixed-item' : '']" :data-name="item.name" v-for="(item, index) in powerInfo" :key="index" @mousedown="clickItem(item)">
                    <span>{{ item.title }}</span>
                  </li>
                </draggable>
              </ul>
            </el-tab-pane>
          </el-tabs>
        </div>
        <!-- 中间 -->
        <div class="template-cell template-cell-m">
          <div class="phone-view">
            <div class="phone-show-content">
              <!-- 拖拽展示区域 -->
              <div class="drag-show-content">
                <div class="view-container">
                  <ul class="view-content" id="showPhoneView">
                    <template v-if="tempaletDataList.length == 0">
                      <img class="templet-null-img" src="../../../assets/templet_null_img.png" />
                    </template>
                    <draggable :options="{ group: { name: 'people', pull: false, put: true }, sort: true }" v-model="tempaletDataList" class="drag-wrap">
                      <li :class="['filed-item', currentIndex == index ? 'active-item' : '', 'li-block']" v-for="(item, index) in tempaletDataList" :key="'li1' + index" @click.stop="selectItem(item.fieldCode, index)">
                        <!-- 删除 -->
                        <span class="item-close p-item-close" @click.stop="deleteItem(item.name, item.parentCode, index)">
                          <i class="el-icon-close"></i>
                        </span>
                        <div v-if="item.classify != '1'" class="filed-item-name">
                          <div :class="['opencard-item-title', item.title.length >= 6 ? 'title-pre-wrap' : '']">{{ item.title }}</div>
                        </div>
                        <time-progress v-if="item.name == 'timeProgress'" :fieldName="item.title"> </time-progress>
                        <store-performance v-if="item.name == 'dataShop'" :fieldName="item.title"> </store-performance>
                        <membership-data v-if="item.name == 'dataNumber'" :fieldName="item.title"> </membership-data>
                        <error-mointor v-if="item.name == 'anomalMonitor'" :fieldName="item.title"> </error-mointor>
                        <old-customer-data v-if="item.name == 'oldNumber'" :fieldName="item.title"> </old-customer-data>
                        <birthday-membership-data v-if="item.name == 'birthNumber'" :fieldName="item.title"> </birthday-membership-data>
                      </li>
                    </draggable>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="template-cell template-cell-r">
          <el-tabs v-model="rightName">
            <el-tab-pane label="控件设置" name="first">
              <div id="edit-box">
                <div class="edit-view baby-info-flag baby-info">
                  <div>
                    <el-radio v-model="setting" label="0">定义在日报自定义上报模板上面</el-radio>
                  </div>
                  <div class="margin-t-15">
                    <el-radio v-model="setting" label="1">定义在日报自定义上报模板下面</el-radio>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>
    <!-- <vue-gic-footer></vue-gic-footer> -->
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import AddInput from '@/components/templateSet/add-input';
import limitInput from '@/components/limit-input.vue';
import timeProgress from '@/components/app/cloudDaily/time-progress.vue';
import storePerformance from '@/components/app/cloudDaily/store-performance.vue';
import membershipData from '@/components/app/cloudDaily/membership-data.vue';
import errorMointor from '@/components/app/cloudDaily/error-mointor.vue';
import oldCustomerData from '@/components/app/cloudDaily/old-customer-data.vue';
import birthdayMembershipData from '@/components/app/cloudDaily/birthday-membership-data.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
// import strLength from '@/common/js/strlen';
import { _debounce } from '@/common/js/public';
import { getRequest, postRequest } from '@/api/api';
export default {
  name: 'staffRecordsTemplate',
  data() {
    return {
      // tab
      activeName: 'first',
      // right tab
      rightName: 'first',
      dialogVisible: false,
      bodyHeight: (document.documentElement.clientHeight || document.body.clientHeight) + 'px',
      // option
      isDragging: false,
      delayedDragging: false,
      // leftOption
      leftOption: {
        group: { name: 'people', pull: 'clone', put: false },
        sort: false,
        disabled: false
      },
      brandId: '', // 品牌 Id(即：商户 id)
      setting: '0', // 右侧设置
      // rightOption
      selectKey: '',
      // 卡片
      cardInfo: [],
      // 交易
      tradeInfo: [],
      // 生日会员
      birthdayMemberInfo: [],
      // 会员
      memberInfo: [],
      // 执行力
      powerInfo: [],
      // 中间数据集合
      currentIndex: 0, //当前选择的 item
      tempaletDataList: [],
      // 已经选择的字段集合
      setParent: []
    };
  },
  created() {
    // this.selectReplayStyle()
  },
  methods: {
    /**
     *  返回
     */
    returnBack() {
      let that = this;
      that.changeRoute(`/systemReport?brandId=${that.brandId}&appIcon=${that.$route.query.appIcon}`);
    },
    /**
     * 点击左侧字段 item
     */
    /* eslint-disable */
    clickItem(item) {
      const that = this;
      // item.fixed = !item.fixed
      // 判断 中间数据中是否存在父级
    },

    /**
     *  move{relatedContext, draggedContext}
     */
    onMove(evt) {
      let that = this;
      const draggedElement = evt.draggedContext.element;
      let names = that.tempaletDataList.map(ele => ele.name);
      if (names.includes(draggedElement.name)) {
        return false;
      }
      return !draggedElement.fixed;
    },

    /**
     *  move end
     */
    itemMoveEnd(evt) {
      const that = this;
      that.isDragging = false;
      that.selectKey = '';
      that.selectKey = evt.clone.dataset.name;
      // 判断中间是否已经添加
      that.tempaletDataList.forEach(function(ele, index) {
        if (ele.name == that.selectKey) {
          setKey(ele.parentCode);
        }
      });
      /* eslint-disable */
      function setKey(parentCode) {
        /* eslint-disable */
        that[parentCode].forEach(function(ele, index) {
          /* eslint-disable */
          if (ele.name == that.selectKey) {
            ele.fixed = true;
          }
        });
      }

      that.selectKey = '';
      that.tempaletDataList = JSON.parse(JSON.stringify(that.tempaletDataList));
      that.$forceUpdate();
    },

    // 中间部分方法
    /**
     *  选择 item 即父级 item
     */
    selectItem(key, index) {
      const that = this;
      that.currentIndex = index; // 父级：当前选中的索引
    },

    /**
     *   删除 item 即父级 item
     */
    deleteItem(key, pCode, index) {
      const that = this;
      that.tempaletDataList.splice(index, 1);
      that.currentIndex--;
      if (that.currentIndex <= 0) {
        that.currentIndex = 0;
      }
      // 删除后重新设置 fixed 值
      that[pCode].forEach(function(ele, index) {
        if (ele.name == key) {
          ele.fixed = false;
        }
      });
    },

    /**
     *  右侧方法
     */

    /**
     *  路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     *  判断添加重复字段
     */
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i]]) {
          return true;
        }
        hash[arr[i]] = true;
      }
      return false;
    },

    /**
     *  检查
     */
    checkTag(data) {
      const that = this;
      let tag = {};
      tag.filedFlag = true;
      tag.filedRepeat = false;
      let filedArr = [];
      data.forEach(function(ele, index) {
        filedArr.push(ele.title);
      });
      // 判断重复 fieldName
      if (that.isRepeat(filedArr)) {
        tag.filedRepeat = true;
      }
      return tag;
    },

    /**
     *  获取 uuid
     */
    getUuid() {
      return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0;
        let v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },

    /**
     *  保存
     */
    saveAndBack: _debounce(function(opt) {
      const that = this;
      let data = JSON.parse(JSON.stringify(that.tempaletDataList));
      let tagObj = that.checkTag(data);
      if (tagObj.filedRepeat) {
        that.$message.error({
          duration: 1000,
          message: '字段标题不能重复'
        });
        return false;
      }
      data.forEach(function(ele, index) {
        ele.sort = index;
      });
      if (!data.length) {
        that.$message.error({
          duration: 1000,
          message: '请先配置字段'
        });
        return false;
      }
      // console.log(JSON.stringify(data))
      if (opt === 'save') {
        that.saveAllData(data);
      } else {
        that.postPreview(data);
      }
    },500),

    /**
     *  保存---api
     */
    saveAllData(data) {
      const that = this;
      let para = {
        brandId: that.brandId,
        templateContent: JSON.stringify({
          setting: that.setting,
          data: data
        })
      };
      postRequest('/haoban-app-daily-web/daily/save-system-template', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
            that.changeRoute(`/systemReport?brandId=${that.brandId}&appIcon=${that.$route.query.appIcon}`);
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
     *  预览---api
     */
    postPreview(data) {
      const that = this;
      let para = {
        templateType: 0, // 模板类型
        brandId: that.brandId,
        templateContent: JSON.stringify(data)
      };
      postRequest('/haoban-app-daily-web/daily/preview-template', para)
        .then(res => {
          let resData = res.data;
          let enterpriseId = JSON.parse(localStorage.getItem('userInfo')).enterpriseId;
          if (resData.errorCode == 1) {
            // 生成二维码需要的 url
            let webUrl = `${window.location.origin}/office-mobile/#/systemTemplate?enterpriseId=${enterpriseId}&templateId=${resData.result}&brandId=${that.brandId}`;
            that.$refs.qrcodePreview.qrcode(webUrl,'daily-preview');
            that.dialogVisible = true;
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
     *  关闭预览窗口
     */
    closeDialog() {
      const that = this;
      that.dialogVisible = false;
    },

    /**
     *  获取所有字段
     */
    getAllFields() {
      const that = this;
      getRequest('/haoban-app-daily-web/daily/get-template-items', {brandId: that.brandId, type: 1})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.handleAllFields(resData.result);
            return false;
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
     *  处理所有系统模板信息
     */
    handleAllFields(result) {
      const that = this;
      result.forEach(function(ele, index) {
        if(that.setParent.includes(ele.name)) {
          ele.fixed = true;
        }else {
          ele.fixed = false;
        }
        if (ele.classify == 1) {
          ele.parentCode = 'cardInfo';
          that.cardInfo.push(ele);
        }
        if (ele.classify == 2) {
          ele.parentCode = 'tradeInfo';
          that.tradeInfo.push(ele);
        }
        if (ele.classify == 3) {
          ele.parentCode = 'birthdayMemberInfo';
          that.birthdayMemberInfo.push(ele);
        }
        if (ele.classify == 4) {
          ele.parentCode = 'memberInfo';
          that.memberInfo.push(ele);
        }
        if (ele.classify == 5) {
          ele.parentCode = 'powerInfo';
          that.powerInfo.push(ele);
        }
      });
    },

    /**
     *  获取已经保存模板信息---api
     */
    getInfo() {
      const that = this;
      // /daily/get-system-template-data
      getRequest('/haoban-app-daily-web/daily/get-system-template-data', {brandId: that.brandId})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result) {
              that.setting = String(resData.result.setting);
              if (!!resData.result.data && !!resData.result.data.length) {
                that.handleGetInfo(resData.result.data);
              }
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
     * 处理已存配置信息
     */
    handleGetInfo(result) {
      const that = this;
      let data = JSON.parse(JSON.stringify(result));
      that.setParent = [];
      data.forEach(function(ele, index) {
        ele.fixed = true;
        that.setParent.push(ele.name);
      });
      that.tempaletDataList = data;
    }
  },
  watch: {
    isDragging(newValue) {
      const that = this;
      if (newValue) {
        that.delayedDragging = true;
        return;
      }
      that.$nextTick(() => {
        that.delayedDragging = false;
      });
    }
  },
  components: {
    draggable,
    AddInput,
    limitInput,
    timeProgress,
    storePerformance,
    errorMointor,
    membershipData,
    oldCustomerData,
    birthdayMembershipData,
    qrcodeDialog
  },
  mounted() {
    const that = this;
    // 获取已经配置的数据
    // that.getInfo()
    that.brandId = that.$route.query.brandId;
    /* eslint-disable */
    Promise.all([that.getInfo()]).then(values => {
      that.getAllFields();
    }).catch(reason => {
      console.log(reason)
    });
    document.body.ondrop = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
  }
};
</script>
<style type="text/less" lang="less" scoped>
.template-wrap {
  width: 100%;
  /*height: 100%;*/
  min-height: 860px;
  padding: 0;
  margin: 0;
  background: url('../../../assets/template-bg.jpg') no-repeat center center;
  background-size: 100% 100%;

  .b-t-1 {
    border-top: 1px solid #e4e7ed;
  }

  .template-contain {
    width: 1200px;
    margin: 0 auto;
  }

  .template-head {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    justify-content: space-between;
    height: 80px;
    align-items: center;

    .flex-1 {
      -webkit-flex: 1;
      -moz-flex: 1;
      -ms-flex: 1;
      -o-flex: 1;
      flex: 1;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
    }

    .flex-r {
      justify-content: flex-end;
    }

    .template-title-span {
      color: #fff;
      font-size: 30px;
      padding-left: 18px;
    }

    .el-button--default.is-plain {
      background: rgba(255, 255, 255, 0);
      color: #fff;
      &:hover {
        color: #fff;
        background: #1890ff;
      }
    }
    .el-button--primary.is-plain {
      background: transparent;
      border-color: #1890ff;
      &:hover {
        background: #1890ff;
      }
    }
  }

  .template-body {
    width: 100%;
    position: relative;
    overflow: hidden;

    .el-tab-pane {
      height: 660px;
      overflow-y: scroll;
    }

    /* 左侧 */
    .template-cell-l {
      width: 350px;
      float: left;
      height: 740px;
      padding-top: 40px;

      .el-tabs {
        /deep/ .el-tabs__item {
          width: 50%;
          width: 175px;
          /*padding: 0;*/
          color: rgba(255, 255, 255, 0.5);
          &.is-active {
            color: #1890ff;
          }
        }
      }

      .compenent-item {
        position: relative;
        width: 148px;
        height: 42px;
        margin: 0 15px 15px 0;
        line-height: 40px;
        padding: 0 10px;
        display: inline-block;
        text-align: center;
        cursor: move;
        color: #fff;
        padding: 0;
        overflow: hidden;
        font-size: 12px;
        border: 1px dashed rgba(255, 255, 255, 0.6);
        background: rgba(255, 255, 255, 0.1);
        &.fixed-item {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      #list5 {
        .compenent-item {
          text-align: left;
          padding: 0 16px;
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
          overflow: hidden;
          span,
          .bg-icon {
            display: inline-block;
            vertical-align: middle;
          }
          .bg-icon {
            position: absolute;
            top: 50%;
            right: 16px;
            -webkit-transform: translate(0, -50%);
            -ms-transform: translate(0, -50%);
            -o-transform: translate(0, -50%);
            transform: translate(0, -50%);
            width: 17px;
            height: 17px;
            background: url('../../../assets/icon-template.png') no-repeat center center;
            background-size: 35px;
            &.bg-icon-one {
              background-position: 0 -16px;
            }
            &.bg-icon-two {
              background-position: 0 0;
            }
            &.bg-icon-three {
              background-position: 0 -50px;
            }
            &.bg-icon-four {
              background-position: 0 -180px;
            }
            &.bg-icon-five {
              background-position: 0 -66.5px;
            }
            &.bg-icon-six {
              background-position: 0 -83px;
            }
            &.bg-icon-seven {
              background-position: 0 -33px;
            }
            &.bg-icon-eight {
              background-position: 0 -98px;
            }
          }
          &:hover {
            color: #1890ff;
            border-color: #1890ff;
            .bg-icon {
              &.bg-icon-one {
                background-position: -18px -16px;
              }
              &.bg-icon-two {
                background-position: -18px 0;
              }
              &.bg-icon-three {
                background-position: -18px -50px;
              }
              &.bg-icon-four {
                background-position: -18px -180px;
              }
              &.bg-icon-five {
                background-position: -18px -66px;
              }
              &.bg-icon-six {
                background-position: -18px -83px;
              }
              &.bg-icon-seven {
                background-position: -18px -33px;
              }
              &.bg-icon-eight {
                background-position: -18px -98px;
              }
            }
          }
        }
      }
      .filed-item-title {
        padding: 15px 0;
        font-size: 14px;
        color: #ffffff;
      }
    }
    /* 中间 */
    /* 模板 */
    .template-cell-m {
      float: left;
      width: 410px;
      height: 740px;
      margin: 0 20px;
      position: relative;

      .view-content {
        position: relative;
      }

      .templet-null-img {
        width: 249px;
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }
    }

    .drag-wrap {
      min-height: 530px;
      overflow-x: hidden;
      overflow-y: auto;
    }
    .phone-container {
      margin-top: 40px;
    }
    .phone-view {
      background: url(../../../assets/iphone.png) no-repeat;
      background-size: 100%;
      width: 410px;
      height: 740px;
      /*margin: 0 20px;*/
      position: relative;
    }

    .phone-show-content {
      width: 330px;
      height: 537px;
      position: absolute;
      left: 41px;
      top: 83px;
      overflow-y: auto;
    }

    .opend-card-item {
      height: 46px;
      line-height: 46px;
      background: #fff;
      border-bottom: 1px solid #e7e7eb;
      font-size: 14px;
      position: relative;

      &.sex::after {
        content: '';
        width: 100%;
        height: 100%;
        z-index: 2;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
    }

    .opend-card-group-title {
      height: 40px;
      line-height: 40px;
      padding-left: 10px;
    }

    .opend-card-item {
      height: 46px;
      line-height: 46px;
      background: #fff;
      border-bottom: 1px solid #e7e7eb;
    }

    .phone-list-item {
      height: 44px;
      line-height: 44px;
      background: #fff;
      margin-bottom: 5px;
    }

    .item-title {
      width: 100px;
      float: left;
      padding-left: 10px;
    }

    .filed-item {
      position: relative;
      width: 100%;
      min-height: 46px;
      background: #fff;
      cursor: move;
      padding: 0px;
      margin: 0;
      font-size: 12px;
      color: #292929;

      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .filed-item-name{
        width: 100%;
        height: 46px;
      }
      &.active-item {
        border: 1px solid #1890ff;
      }

      & + .filed-item {
        margin-top: 5px;

        &.li-block {
          margin-top: 15px;
        }
      }
      /*删除*/
      .item-close {
        position: absolute;
        top: 0;
        right: 0;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        background: #1890ff;
        color: #fff;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        display: none;
        z-index: 2;
      }
      &:hover {
        border: 1px dashed #1890ff;
        .p-item-close {
          display: block;
        }
      }

      &.child-filed-item {
        &:hover {
          .child-item-close {
            display: block;
          }
        }
      }
    }

    .opencard-drag {
      background: #fff;
      height: 46px;
    }

    .opencard-item-title {
      width: 90px;
      height: 46px;
      line-height: 46px;
      text-align: left;
      float: left;
      padding-left: 10px;
      overflow: hidden;
      white-space: nowrap;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      font-size: 14px;
      &.title-pre-wrap {
        line-height: 15px;
        word-break: break-all;
        white-space: pre-wrap;
        padding-top: 9px;
      }
      /*&.block-pre-wrap{
        line-height: 12px;
        word-break: break-all;
        white-space: pre-wrap;
        padding-top: 9px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
      }*/
    }

    .show-warm-text {
      color: #c0c4cc;
      width: 185px;
      text-align: left;
      display: inline-block;
      white-space: nowrap;
      height: 46px;
      line-height: 46px;
      font-size: 14px;

      .el-icon-arrow-right {
        font-size: 20px;
        vertical-align: middle;
      }

      .iconfont.icon-icon {
        font-size: 20px;
        color: #808995;
      }

      &.select-flag {
        width: 225px;
        text-align: right;
      }
    }

    .limit-w-340 {
      /deep/ .el-input__inner {
        font-size: 12px;
        color: #fff;
        background-color: rgba(255, 255, 255, 0.1);
      }

      .tip {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    /* 右侧 */
    .template-cell-r {
      width: 400px;
      float: left;
      overflow: hidden;
      padding-top: 40px;

      .input-line-cell {
        .tip {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .limit-w-340 {
        /deep/ .el-input__inner {
          font-size: 12px;
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }

        .tip {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      .el-tabs {
        /deep/.el-tabs__item {
          width: 175px;
          /* padding: 0; */
          /*color: rgba(255, 255, 255, 0.5);*/
        }

        /deep/.el-tabs__nav-wrap::after {
          content: none;
        }
      }

      .label-txt {
        margin: 0 10px;
        font-size: 14px;
        color: #fff;
      }

      .margin-t-15 {
        margin-top: 15px;
      }

      .margin-t-30 {
        margin-top: 30px;
      }

      .margin-l-15 {
        margin-left: 15px;
      }

      .margin-b-15 {
        margin-bottom: 15px;
      }

      .w-60 {
        width: 60px;
      }

      .w-120 {
        width: 120px;
      }

      .w-316 {
        width: 316px;
      }

      .limit-w-340 {
        /deep/ .el-input__inner {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
        }
      }

      .opt-btn {
        cursor: pointer;
        color: #c9d3df;
        vertical-align: middle;

        &.add-item:hover {
          /*color: #1890ff;*/
        }
        &.del-item:hover {
          /*color: #F56C6C;*/
        }
      }

      .flex {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
      }

      .flex-wrap {
        -webkit-flex-wrap: wrap;
        -moz-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        -o-flex-wrap: wrap;
        flex-wrap: wrap;
      }

      .staffRecords-limit {
        .flex();
        .flex-wrap();

        .label-cell {
          min-width: 50%;
          max-width: 50%;
          margin-left: 0;
        }
      }

      .label-cell {
        margin-bottom: 15px;
        color: #fff;
      }

      .el-radio {
        /deep/ span.el-radio__label {
          color: #fff;
        }
        &.is-disabled {
          /deep/ span.el-radio__label {
            color: #fff;
          }
        }
      }

      .edit-item {
        color: #fff;
        padding-bottom: 10px;

        .tip {
          margin-left: -40px;
          color: rgba(255, 255, 255, 0.7);
          width: 30px;
          display: inline-block;
          text-align: right;
          margin-right: 10px;
          font-size: 12px;
        }
      }

      .edit-item-title {
        color: #ffffff;
        font-size: 14px;
        font-weight: normal;
        padding: 20px 0;

        &.edit-title-padding {
          padding-top: 15px;
        }
      }

      .edit-item-title span {
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
}
</style>
