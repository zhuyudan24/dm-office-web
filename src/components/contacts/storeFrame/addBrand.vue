<template>
  <div>
    <el-dialog title="新建品牌" width="422px" :visible.sync="dialogVisible">
      <p>请输入品牌名称</p>
      <el-input v-model="brandName" class="m-t-20"></el-input>
      <div class="btn-box t-rt m-t-20 m-b-10">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFn">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getRequest } from '@/api/api';
export default {
  name: 'add-brand-dialog',
  data() {
    return {
      dialogVisible: false,
      brandName: '',
      brand: ''
    };
  },
  methods: {
    saveFn() {
      if (!this.brandName) {
        this.$message.error({
          message: '请输入品牌名称'
        });
      } else {
        let that = this;
        let params = {
          brandName: that.brandName
        };
        getRequest('/haoban-manage-web/brand/insert', params)
          .then(res => {
            if (res.data.errorCode == 1) {
              that.$emit('addSuccess');
            } else {
              that.$message.error({
                message: res.data.message
              });
            }
          })
          .catch(e => {
            that.$message.error({
              message: e.message
            });
          });
      }
    }
  }
};
</script>
<style lang="scss">
.danger-tip {
  width: 100%;
  height: 36px;
  line-height: 36px;
  background: rgba(253, 246, 236, 1);
  border-radius: 4px;
  padding: 0 14px;
  box-sizing: border-box;
  margin-top: 24px;
  color: #e6a23c;
  font-size: 13px;
  .el-icon-info {
    font-size: 16px;
    margin-right: 7px;
    vertical-align: middle;
  }
}
.select-div {
  width: 100%;
  margin-top: 20px;
}
</style>
