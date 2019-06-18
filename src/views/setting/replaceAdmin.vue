<template>
  <div class="replaceAdmin-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ height: $store.state.bgHeight }">
        <el-steps :active="active" finish-status="success" align-center>
          <el-step title="获取验证码"></el-step>
          <el-step title="绑定新的超级管理员"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <div class="w-514 replaceAdmin-wrap-form m-t-45">
          <el-form v-if="active == 0" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" class="demo-ruleForm">
            <el-form-item label="当前绑定账号" prop="name" class="">
              <el-input v-model="ruleForm.name" disabled placeholder="" class="w-280"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phone" class="">
              <el-input v-model="ruleForm.phone" disabled placeholder="" class="w-280"></el-input><el-button class="m-l-20 v-align-b" type="primary" plain :disabled="disableBtn" @click="sendCode(ruleForm.phone)">{{ !disableBtn && !!countNum ? '获取验证码' : countNum + 's' }} </el-button>
            </el-form-item>
            <el-form-item label="验证码" prop="code" class="">
              <el-input v-model="ruleForm.code" placeholder="请输入验证码" class="w-280"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
            </el-form-item>
          </el-form>
          <!-- 新绑定 -->
          <el-form v-show="active == 1" :model="newRuleForm" :rules="newRules" ref="newRuleForm" label-width="140px" class="demo-ruleForm">
            <el-form-item label="新绑定超级管理员" prop="name" class="">
              <div class="master-select w-280" @click="showSelect">
                {{ !!newRuleForm.name ? newRuleForm.name : '请选择' }}
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="newFormLoad" @click="newSubmitForm('newRuleForm')">提 交</el-button>
              <el-button @click="submitFormBack" plain>上一步</el-button>
            </el-form-item>
          </el-form>
          <!-- 提交成功 -->
          <div class="replaceAdmin-wrap-success" v-if="active == 2">
            <div class="icon-outer"><i class="el-icon-success"></i></div>
            <p class="font-w-500">操作成功</p>
          </div>
        </div>
      </div>
    </div>
    <vue-select-employee :defaultSelection="defaultSelection" :treeSet="treeSet" :onlyPerson="onlyPerson" :changed="changed" @handleSelectedList="handleSelectedList"> </vue-select-employee>

    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import vueSelectEmployee from '@/components/common/vueSelectEmployee';
import { _debounce } from '@/common/js/public';
import errMsg from '@/common/js/error';
import showMsg from '@/common/js/showmsg';
import { postRequest } from '@/api/api';
export default {
  name: 'replaceAdmin',
  data() {
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
          name: '更换超级管理员',
          path: ''
        }
      ],
      subNavText: '更换超级管理员,需要先验证当前超级管理员身份',

      active: 0,

      ruleForm: {
        name: '11',
        phone: 1334444444,
        code: ''
      },
      rules: {
        name: [{ required: true, message: '请输入当前绑定账号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      disableBtn: false, // 发验证码
      countNum: 60,
      // 新绑定
      newFormLoad: false,
      newRuleForm: {
        name: '',
        id: '',
        label: '',
        type: ''
      },
      newRules: {
        name: [{ required: true, message: '请输入手机号/姓名', trigger: ['blur', 'change'] }]
      },
      // 行政架构选人
      treeSet: {
        isSelectPerson: true, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: true // 是否单选
      },
      treeData: {},
      defaultSelection: [], // 已选数据
      onlyPerson: true, // 控制只能选人(true)
      changed: ''
    };
  },
  computed: {},
  methods: {
    /**
     * 显示选择控件
     */
    showSelect() {
      const that = this;
      that.treeSet = {
        dialogVisible: true,
        isSingle: true,
        isSelectPerson: true
      };
    },
    /**
     * 处理树形控件选择的数据
     */
    handleSelectedList(list) {
      const that = this;
      if (!!list && !!Object.keys(list).length) {
        that.defaultSelection = [list];
        that.newRuleForm.name = list.name;
        that.newRuleForm.id = list.id;
      }
    },
    /**
     * 倒计时
     */
    countDown() {
      const that = this;
      let time = setInterval(function() {
        if (that.countNum === 0) {
          clearInterval(time);
          that.countNum = 60;
          that.disableBtn = false;
          return false;
        }
        that.countNum--;
      }, 1000);
    },

    /**
     * 发验证码
     */
    sendCode: _debounce(function(phone) {
      let that = this;
      that.disableBtn = true;
      that.postSendCode(phone);
    }, 500),

    /**
     * 发验证码---api
     */
    /* eslint-disable */
    postSendCode(phone) {
      let that = this;
      postRequest('/haoban-manage-web/enterprise-setting/send-admin-valid-code', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.countDown();
            let handle = String(phone).substr(0, 3) + '****' + phone.substr(7, 11);
            that.$message({
              message: '验证码已发送到您的手机：+86 ' + handle,
              type: 'success'
            });
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
     * 下一步
     */
    submitForm: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.checkSendCode();
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 检查验证码
     */
     checkSendCode() {
      let that = this;
      let para = {
        code: that.ruleForm.code,
      };
      postRequest('/haoban-manage-web/enterprise-setting/check-admin-valid-code', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (that.active++ > 2) {
              that.active == 2;
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
     * 新绑定---提交
     */
    newSubmitForm: _debounce(function(formName) {
      const that = this;
      that.newRuleForm.name = that.newRuleForm.name.replace(/(^\s+)|(\s+$)/g, '');
      that.$refs[formName].validate(valid => {
        if (valid) {
          that.postReplace();
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 新绑定---提交 API
     */
    postReplace() {
      let that = this;
      let para = {
        adminClerkId: that.newRuleForm.id,
      };
      postRequest('/haoban-manage-web/enterprise-setting/change-admin', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.active++;
            showMsg.showmsg('保存成功,请重新登录!', 'success');
            that.loginOut();
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
     * 新绑定---上一步
     */
    submitFormBack() {
      const that = this;
      that.$refs['newRuleForm'].resetFields();
      !!that.active ? that.active-- : '';
    },

    /**
     * 退出登录
     *
     */
    loginOut() {
      let that = this;
      postRequest('/haoban-manage-web/logout',{})
        .then((res) => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            // 跳转登录页
            window.location.href = window.location.origin + '/haoban-web/#/login';
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          })
        })
        .catch(function (error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          })
        });

    },

    /**
     * 获取当前用户信息
     */
    getCurrentUser() {
      const that = this;
      let userData = JSON.parse(localStorage.getItem('userInfo'));
      that.ruleForm.name = userData.name;
      that.ruleForm.phone = userData.phoneNumber;
    }
  },
  mounted() {
    const that = this;
    that.getCurrentUser();
  },
  components: {
    navCrumb,
    vueSelectEmployee
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
    min-height: 500px;
    padding: 24px;

    .w-280 {
      width: 280px;
    }

    .w-514 {
      width: 514px;
    }

    .m-l-20 {
      margin-left: 20px;
    }

    .m-t-45 {
      margin-top: 45px;
    }

    .v-align-b {
      vertical-align: bottom;
    }

    .text-center {
      text-align: center;
    }

    .replaceAdmin-wrap-form {
      margin: 45px auto 0;
    }

    .master-select {
      -webkit-appearance: none;
      background-color: #fff;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      display: inline-block;
      font-size: inherit;
      height: 32px;
      line-height: 32px;
      outline: none;
      padding: 0 12px;
      width: 100%;
      cursor: pointer;
    }

    .replaceAdmin-wrap-success {
      text-align: center;
      i {
        font-size: 50px;
        color: #67c23a;
      }

      p {
        margin-top: 24px;
        font-size: 20px;
        color: #303133;
      }
    }
  }
}
</style>
