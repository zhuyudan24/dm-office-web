<!--
<multiple-del
  :showDialog="showDialog"
  :detailFlag="true"           # true/false 是否是详情页，判断一个选项用
  @hideDialog="hideDialog">
</multiple-del>
 -->
<template>
  <div v-show="customDialog">
    <el-dialog class="app-dialog" title="批量删除" :visible.sync="customDialog" width="424px" :before-close="handleClose">
      <div class="app-dialog-body p-l-15">
        <el-form ref="form" :model="formData">
          <el-form-item label="" v-if="!detailFlag">
            <el-radio v-model="formData.delOptFlag" label="0">仅删除逾期任务</el-radio>
            <el-radio v-model="formData.delOptFlag" label="1">删除所有待完成任务</el-radio>
          </el-form-item>
          <div v-if="detailShowFlag" class="el-message-box__title">
            <div class="el-message-box__status el-icon-warning"></div>
            <span>仅可删除历史月份逾期未完成任务</span>
          </div>
          <el-form-item label="原因备注">
            <limit-textarea :inputWidth="297" :inputValue.sync="formData.reason" :holder="''" :getByType="'char'" :maxLength="50"> </limit-textarea>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customCancel">取 消</el-button>
        <el-button type="primary" @click="customConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import limitTextarea from '@/components/limit-textarea.vue';
export default {
  name: 'multiple-del',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    detailFlag: {
      type: Boolean,
      default: false
    },
    detailShowFlag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    limitTextarea
  },
  data() {
    return {
      repProjectName: 'haoban-manage-web', // 项目名
      customDialog: false, // 弹框显示
      formData: {
        delOptFlag: '0',
        reason: ''
      }
    };
  },
  methods: {
    /**
     *   关闭
     */
    handleClose(done) {
      const that = this;
      done();
      that.hideDialog();
    },

    /**
     *  取消
     */
    customCancel() {
      const that = this;
      that.hideDialog();
    },

    hideDialog() {
      const that = this;
      that.customDialog = false;
      that.$emit('hideDialog', {});
    },

    /**
     *  确定
     */
    customConfirm() {
      const that = this;
      that.$emit('hideDialog', that.formData);
    }
  },
  watch: {
    showDialog: function(newData, oldData) {
      const that = this;
      that.customDialog = newData;
    }
  },

  /* 接收数据 */
  mounted() {
    const that = this;
    that.customDialog = that.showDialog;
  }
};
</script>

<style lang="scss" scoped>
.el-message-box__title {
  position: relative;
  text-align: center;
  margin-bottom: 30px;
  .el-message-box__status {
    position: relative;
    top: auto;
    padding-right: 5px;
    text-align: center;
    transform: translateY(3px);
  }
  span {
    font-size: 14px;
    line-height: 20px;
    color: #606266;
  }
}
</style>
