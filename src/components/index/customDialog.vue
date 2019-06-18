<template>
  <div class="custom-dialog-wrap">
    <el-dialog :title="'自定义' + customTitle" :visible.sync="customDialog" width="761px" :before-close="handleCardClose">
      <div class="custom-dialog__title">
        <p class="custom-dialog__p">
          请选择您想在首页展示的{{ customTitle }}，还可以再勾选<span> {{ 8 - checkList.length }} </span>个
        </p>
      </div>
      <div class="custom-dialog__checkbox">
        <el-checkbox-group v-model="checkList" @change="customChange" :max="8">
          <template v-if="customType === 'data'">
            <el-checkbox v-for="item in customData" :label="item.dataViewId" :key="item.dataViewId" name="type">{{ item.fieldTitle }}</el-checkbox>
          </template>
          <template v-if="customType != 'data'">
            <el-checkbox v-for="item in customData" :label="item.settingViewId" :key="item.settingViewId" name="type">{{ item.fieldTitle }}</el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customCancel">取 消</el-button>
        <el-button type="primary" @click="customConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { postRequest, postJson } from '@/api/api';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
export default {
  name: 'custom-dialog',
  props: {
    showCustomDialog: {
      type: Boolean,
      default: false
    },
    customType: {
      type: String,
      default: ''
    },
    customTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      repProjectName: 'haoban-manage-web', // 项目名
      customDialog: false, // 弹框显示
      // 复选框数据
      customData: [
        /*{
            dataViewId: 1,
            fieldTitle: "通讯录行政架构",
            homeDisplay: true
          }*/
      ],
      checkList: [] //已选数据
    };
  },
  /* eslint-disable */
  beforeMount() {},
  methods: {
    /**
     *   关闭
     */
    handleCardClose() {
      const that = this;
      that.customCancel();
    },

    /**
     *  取消
     */
    customCancel() {
      const that = this;
      that.customDialog = false;
      that.$emit('customHandleConfirm');
    },

    /**
     *  确定
     */
    customConfirm() {
      const that = this;
      if (!that.checkList.length) {
        that.$message.error({
          duration: 1000,
          message: '请选择操作'
        });
        return false;
      }
      that.setData(that.checkList);
    },

    /**
     *   复选框选择事件
     */
    /* eslint-disable */
    customChange(value) {
    },

    /**
     *  设置首页数据概览显示项
     */
    setData(list) {
      const that = this;
      let para = {
        viewIdList: list
      };
      let url = that.customType == 'data' ? '/haoban-manage-web/home/set-display-enterprise-data' : '/haoban-manage-web/home/set-display-quick-entry';
      postJson(url, para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('设置成功', 'success');
            that.$emit('customHandleConfirm');
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
     *  获取 设置首页数据概览显示项
     */
    getCardList() {
      const that = this;
      let para = {
        all: true
      };
      that.customType == 'data' ? (para.fetchData = false) : '';
      // 判断企业数据概览
      let url = that.customType == 'data' ? '/haoban-manage-web/home/find-enterprise-data' : '/haoban-manage-web/home/find-quick-entry';
      that.checkList = [];
      postRequest(url, para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            let selList = [];
            resData.result.forEach(function(ele, index) {
              if (!!ele.homeDisplay) {
                that.customType == 'data' ? selList.push(ele.dataViewId) : selList.push(ele.settingViewId);
              }
            });
            that.customData = resData.result;
            that.checkList = selList;
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
    showCustomDialog: function(newData, oldData) {
      const that = this;
      that.customDialog = newData;
    },
    customType: function(newData, oldData) {
      const that = this;
      if (!!newData) {
        that.getCardList();
      }
    }
  },

  /* 接收数据 */
  mounted() {
    const that = this;
    that.customDialog = that.showCustomDialog;
  }
};
</script>

<style lang="scss" scoped>
.custom-dialog {
  &-wrap {
  }

  &__title {
    width: 100%;
    height: 38px;
    padding: 12px 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: rgba(235, 238, 245, 1);
  }

  &__p {
    width: 100%;
    font-size: 14px;
    color: #606266;

    span {
      color: #1890ff;
    }
  }

  &__checkbox {
    width: 100%;
    min-height: 100px;
    max-height: 300px;
    padding-top: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;

    .el-checkbox {
      width: 22%;
      margin-left: 16px;
      line-height: 62px;
      &.is-checked {
        /deep/ .el-checkbox__label {
          color: #1890ff;
        }
      }
    }
  }
}
</style>
