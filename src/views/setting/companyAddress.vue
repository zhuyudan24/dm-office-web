<template>
  <div class="companyAddress-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ height: $store.state.bgHeight }">
        <h2 class="font-w-500">企业地址设置</h2>
        <p class="m-t-24">开启后手机端通讯录将显示,反之则不显示</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="企业地址" prop="switch" class="m-t-22">
            <el-switch v-model="ruleForm.switch"></el-switch>
          </el-form-item>
          <el-form-item label=" " prop="name" class="" v-if="ruleForm.switch">
            <el-input v-model="ruleForm.name" placeholder="请输入地址" class="w-380"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
// import showMsg from '@/common/js/showmsg';
// import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
// import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'companyAddress',
  data() {
    const nameValid = (rule, value, callback) => {
      if (!!this.ruleForm.switch && value.replace(/\s/g) == '') {
        callback(new Error('请输入地址'));
      } else {
        callback();
      }
    };
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
          name: '企业设置',
          path: '/companyAddress'
        },
        {
          name: '企业地址',
          path: ''
        }
      ],

      ruleForm: {
        switch: false,
        name: ''
      },
      rules: {
        name: [
          { validator: nameValid, trigger: 'blur' } //required: true,
        ]
      }
    };
  },
  computed: {},
  methods: {
    /**
     * 保存
     */
    submitForm: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        /* eslint-disable */
        if (valid) {
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 保存---api
     */
    postSave() {
      const that = this;
      that.ruleForm = [];
    }
  },
  // mounted() {},
  components: {
    navCrumb
  }
};
</script>
<style lang="less" scoped>
.right-content {
  /*width: 100%;*/
  padding: 24px;
  min-height: calc(100% - 240px);

  .right-box {
    background: #fff;
    padding: 24px;
    min-height: 500px;

    h2 {
      font-size: 16px;
      color: #303133;
    }

    p {
      font-size: 14px;
      color: #909399;
    }

    .m-t-24 {
      margin-top: 24px;
    }

    .w-380 {
      width: 380px;
    }
  }
}
</style>
