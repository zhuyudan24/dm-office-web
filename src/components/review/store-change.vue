<template>
  <div class="custom-dialog-wrap">
    <el-dialog title="门店图片变更" :visible.sync="customDialog" width="600px" :before-close="handleCardClose">
      <div class="dialog-content">
        <el-row>
          <el-col :span="11">
            <div class="grid-content bg-purple-dark">
              变更前
            </div>
            <div class="data-body">
              <div class="data-body-content flex flex-column">
                <template v-for="(item, index) in leftData">
                  <img :src="item" alt="" :key="'img' + index" />
                </template>
              </div>
            </div>
          </el-col>
          <el-col :span="11">
            <div class="grid-content bg-purple-dark">
              变更后
            </div>
            <div class="data-body">
              <div class="data-body-content flex flex-column">
                <template v-for="(item, index) in rightData">
                  <img :src="item" alt="" :key="'img0' + index" />
                </template>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'custom-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    storeChangeData: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      customDialog: this.value, // 弹框显示
      leftData: [],
      rightData: []
    };
  },
  methods: {
    // 关闭
    handleCardClose() {
      const that = this;
      that.customCancel();
    },

    //  取消
    customCancel() {
      const that = this;
      that.customDialog = false;
      that.$emit('input', that.customDialog);
    },

    formatDate(time, flag) {
      //  (0-9)年月数字的显示
      function formatDig(num) {
        return num > 9 ? '' + num : '0' + num;
      }
      let myDate = new Date(time);
      let y = myDate.getFullYear();
      let m = myDate.getMonth() + 1;
      let d = myDate.getDate();
      return y + flag + formatDig(m) + flag + formatDig(d) + flag;
    },

    handleData() {
      // const that = this;
    }
  },
  watch: {
    value: function(newData, oldData) {
      const that = this;
      // console.log("新数据:",newData,oldData)
      that.customDialog = newData;
    },
    storeChangeData: function(newData, oldData) {
      const that = this;
      that.leftData = newData.beforeContent;
      that.rightData = newData.afterContent;
    }
  },

  /* 接收数据 */
  mounted() {
    const that = this;
    that.leftData = that.storeChangeData.beforeContent;
    that.rightData = that.storeChangeData.afterContent;
  }
};
</script>

<style lang="scss" scoped>
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

.flex-space-between {
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
}
.dialog-content {
  /*height: 484px;*/
  padding-bottom: 20px;

  .grid-content {
    width: 100%;
    height: 42px;
    line-height: 42px;
    text-align: center;
    background: rgba(245, 247, 250, 1);
    font-size: 16px;
    color: #303133;
    /*border: 1px solid rgba(235,238,245,1);
    border-radius: 4px;*/
  }

  .el-row {
    width: 100%;
    font-size: 0;
  }
  .el-col-11 {
    width: 272px;
    border: 1px solid rgba(235, 238, 245, 1);
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    & + .el-col-11 {
      margin-left: 14px;
    }
  }

  .data-body {
    height: 442px;
    max-height: 442px;
    padding: 11px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    .data-body-content {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
    img {
      width: 100%;
      & + img {
        margin-top: 10px;
      }
    }
  }
}
</style>
