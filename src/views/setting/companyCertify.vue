<template>
  <div class="companyCertify-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="企业名称" prop="enterpriseName" class="">
            <limitInput :inputWidth="495" :inputValue.sync="ruleForm.enterpriseName" :holder="'请输入企业名称'" :maxLength="20"> </limitInput>
          </el-form-item>
          <el-form-item label="所在地区" prop="region" class="city-area">
            <vue-office-area :projectName="projectName" :postUrl="postUrl" :areaOptions="areaOptions" @selected="selected"></vue-office-area>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress" class="">
            <limitInput :inputWidth="495" :inputValue.sync="ruleForm.detailAddress" :holder="'请输入详细地址'" :maxLength="40"> </limitInput>
          </el-form-item>
          <el-form-item label="营业执照注册号" prop="businessLicenseNum" class="">
            <limitInput :inputWidth="495" :inputValue.sync="ruleForm.businessLicenseNum" :holder="'请输入营业执照注册号'" :maxLength="20"> </limitInput>
          </el-form-item>
          <el-form-item label="证件类型" prop="cardType" class="">
            <div>
              <el-radio v-model="ruleForm.cardType" label="0">多证合一营业执照（原“注册号”字样，调整为18位的“统一社会信用代码”）</el-radio>
            </div>
            <div>
              <el-radio v-model="ruleForm.cardType" label="1">普通营业执照（仍然标识为15位的“注册号”）</el-radio>
            </div>
          </el-form-item>
          <el-form-item label="营业执照" prop="businessLicenseUrl" class="">
            <single-upload :imgSrc.sync="ruleForm.businessLicenseUrl" :uploadLimit="8" :field="'businessCard'"> </single-upload>
          </el-form-item>
          <el-form-item label="手持证件照片" prop="cardUrl" class="">
            <single-upload :imgSrc.sync="ruleForm.cardUrl" :field="'cardUrl'"> </single-upload>
          </el-form-item>
          <el-form-item label="授权书" prop="authUrl" class="">
            <single-upload :imgSrc.sync="ruleForm.authUrl" :field="'authUrl'"> </single-upload>
          </el-form-item>
          <el-form-item label="状态" prop="status" class="status-item" v-if="ruleForm.authenticationStatus != 0">
            <el-tag v-if="ruleForm.authenticationStatus == 1"><i class="el-icon-loading"></i>审核中</el-tag>
            <el-tag type="success" v-if="ruleForm.authenticationStatus == 2"><i class="el-icon-success"></i>审核成功</el-tag>
            <el-tag type="danger" v-if="ruleForm.authenticationStatus == 3"><i class="el-icon-error"></i>审核失败</el-tag><span class="color-606266 error-text" v-if="ruleForm.authenticationStatus == 3">{{ ruleForm.refuseReason }}</span>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="ruleForm.authenticationStatus == 0 || ruleForm.authenticationStatus == 3 ? false : true" type="primary" @click="submitForm('ruleForm')"> 保 存 </el-button
            ><el-button :disabled="ruleForm.authenticationStatus == 0 || ruleForm.authenticationStatus == 3 ? false : true" type="primary" @click="submitReview('ruleForm')">
              提交审核
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import limitInput from '@/components/limit-input.vue';
import singleUpload from '@/components/single-upload.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest, postJson } from '@/api/api';
export default {
  name: 'companyCertify',
  data() {
    return {
      projectName: 'haoban-manage-web', // 当前项目名
      postUrl: '/haoban-manage-web/dict-district-list', // 地区选择请求 url 参数
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
          name: '企业认证',
          path: ''
        }
      ],
      ruleForm: {
        enterpriseName: '',
        region: '',
        detailAddress: '',
        businessLicenseNum: '',
        cardType: '0', // 证件类型（0:多证合一营业执照,1:普通营业执照）
        businessLicenseUrl: '',
        cardUrl: '',
        authUrl: '',
        authenticationStatus: 0,
        refuseReason: ''
      },
      rules: {
        enterpriseName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
        businessLicenseNum: [{ required: true, message: '请输入营业执照注册号', trigger: 'blur' }],
        region: [{ required: true, message: '请选择地区', trigger: 'blur' }],
        cardType: [{ required: true, message: '请选择证件类型', trigger: 'blur' }],
        businessLicenseUrl: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
        cardUrl: [{ required: true, message: '请上传照片', trigger: 'blur' }],
        authUrl: [{ required: true, message: '请上传授权书', trigger: 'blur' }]
      },

      // 省市县
      areaOptions: {
        provinceName: '',
        provinceId: '',
        cityName: '',
        cityId: '',
        countryName: '',
        countyId: ''
      },
      baseUrl: ''
    };
  },
  computed: {},
  beforeMount() {
    const that = this;
    let host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://www.gicdev.com';
    } else {
      that.baseUrl = host;
    }
  },
  methods: {
    /**
     * 省市县选择
     */
    selected(val) {
      const that = this;
      if (!!val.country) {
        that.ruleForm.region = val;
        that.ruleForm.areaId = val.areaIdl;
      } else {
        that.ruleForm.region = '';
      }
    },

    /**
     * 保存
     */
    submitForm: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(that.ruleForm));
          that.postSave(data, true);
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 保存---api
     */
    postSave(data, saveOnly) {
      const that = this;
      let para = {
        enterpriseName: data.enterpriseName,
        enterpriseCode: data.enterpriseCode,
        provinceId: data.region.province,
        cityId: data.region.city,
        areaId: data.region.areaId,
        detailAddress: data.detailAddress,
        cardType: data.cardType,
        cardUrl: data.cardUrl,
        businessLicenseUrl: data.businessLicenseUrl,
        businessLicenseNum: data.businessLicenseNum,
        authUrl: data.authUrl,
        saveOnly: saveOnly
      };
      postJson('/haoban-manage-web/enterprise-authentication/update-authentication', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
            saveOnly === false ? that.getCompanyInfo() : '';
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
     * 审核提交
     */
    submitReview: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(that.ruleForm));
          that.postSave(data, false);
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 审核---api
     */
    /* eslint-disable */
    postReview() {},

    /**
     * 查询企业认证信息
     */
    getCompanyInfo() {
      const that = this;
      postRequest('/haoban-manage-web/enterprise-authentication/find-detail', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            for (let k of Object.keys(resData.result)) {
              if (resData.result[k] == null || resData.result[k] == 'null') {
                resData.result[k] = '';
              }
            }
            let newObj = {
              provinceName: resData.result.provinceName,
              provinceId: resData.result.provinceId,
              cityName: resData.result.cityName,
              cityId: resData.result.cityId,
              countryName: resData.result.areaName,
              countyId: resData.result.areaId
            };
            that.areaOptions = newObj;
            resData.result.region = newObj;
            resData.result.cardType = String(resData.result.cardType);
            that.ruleForm = Object.assign(that.ruleForm, resData.result);
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
    that.getCompanyInfo();
  },
  components: {
    navCrumb,
    limitInput,
    singleUpload
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

    .m-t-24 {
      margin-top: 24px;
    }

    .w-500 {
      width: 500px;
    }

    .status-item {
      .el-tag {
        line-height: 34px;
      }
      i {
        font-size: 16px;
        margin-right: 10px;
      }
    }

    .avatar-uploader {
      /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 180px;
      height: 180px;
      line-height: 180px;
      text-align: center;
    }
    .avatar {
      width: 180px;
      height: 180px;
      display: block;
    }

    .upload-tip {
      color: #606266;
      font-size: 12px;
      line-height: 22px;
    }

    .color-606266 {
      color: #606266;
    }

    .error-text {
      display: inline-block;
      vertical-align: middle;
      width: 200px;
      padding-left: 10px;
      font-size: 12px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
}
</style>
