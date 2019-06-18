<template>
  <div class="notice-list-wrap">
    <div class="notice-list">
      <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
      <el-form :model="ruleFormData" :rules="rules" ref="noteForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="发送范围" class="input-item is-required">
          <div class="flex-column item-cell-select inline-block">
            <div class="depart-item-wrap">
              <div style="width:560px" class="el-select el-select--large depart-item-content" @click="showDialogLayer('store', defaultStoreList)">
                <div class="el-select__tags">
                  <span>
                    <template v-for="(item, index) in defaultStoreList">
                      <span class="el-tag el-tag--info el-tag--small" :key="index">
                        <span class="el-select__tags-text">{{ item.name || item.storeName }}</span
                        ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index)"></i>
                      </span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-show="defaultStoreBool && defaultStoreList.length < 1" class="el-form-item__error">请选择发送范围</div>
        </el-form-item>
        <el-form-item label="发送对象" prop="receiveType">
          <el-radio-group v-model="ruleFormData.receiveType">
            <el-radio label="0">仅店长</el-radio>
            <el-radio label="1">所有人</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="公告标题" prop="title" class="input-item">
          <limitInput :inputWidth="560" :inputValue.sync="ruleFormData.title" :holder="'请输入公告标题'" :maxLength="15"> </limitInput>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload class="upload-demo" :action="uploadUrl()" :show-file-list="false" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
            <div v-if="ruleFormData.img" class="avatar-wrap flex flex-align-center flex-pack-center"><img :src="ruleFormData.img" class="avatar" /></div>
            <el-button v-else size="mini" type="primary">点击上传</el-button>
          </el-upload>
          <div class="el-upload__tip">建议尺寸大于690*300，支持 jpg、jpeg、bmp、png 类型文件，单张图片限制大小5M</div>
        </el-form-item>
        <el-form-item label="公告内容" prop="content" class="input-item ">
          <!-- <limitTextarea :inputWidth="560" :inputValue.sync="ruleFormData.content" :holder="'请输入公告内容'" :maxLength="200"> </limitTextarea> -->
          <tinymce-edit ref="tinymceWrap" :bodyHtml="ruleFormData.content" :projectName="projectName"></tinymce-edit>
        </el-form-item>
        <el-form-item label="发送方式" prop="sendType">
          <el-radio-group @change="changeSendType" v-model="ruleFormData.sendType">
            <el-radio label="0">立即发送</el-radio>
            <el-radio label="1">定时发送</el-radio>
          </el-radio-group>
          <el-date-picker v-show="ruleFormData.sendType == '1'" @change="changeMyDate" class="my-date-picker" v-model="dateValue" type="datetime" placeholder="选择发送时间" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          <div v-show="ruleFormData.sendType == '1' && datePickerBool && !dateValue" class="date-picker-error el-form-item__error">请选择发送时间</div>
        </el-form-item>
        <el-form-item label="附件" prop="attachment" class="w-680">
          <el-upload class="upload-demo notice-upload-file" action="/haoban-manage-web/upload-file?fileType=report" :before-upload="beforeFileUpload" :on-success="handleFileSuccess" :on-change="handleFileChange" :on-remove="handleRemove" multiple :limit="3" :on-exceed="handleExceed" :file-list="fileDatas">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持.doc，.docx，.pdf，.xls，.xlsx，.ppt，.pptx类型文件，单个附件大小不超过5M，最多添加3个附件</div>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <div class="btn-wrap">
            <el-button @click="cancelSend" plain>取消</el-button>
            <el-button @click="sendData('noteForm')" type="primary">发布</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <!-- 发送范围的门店选择 -->
    <vue-select-store ref="storeSelector" :currentBrand="activeGroup" :appScene="appScene" :treeSet="storeTreeSet" :selectType="'group-store'" :defaultList="defaultStoreList" @handleSelectedList="handleSelectedList"> </vue-select-store>
  </div>
</template>
<script>
import commonDetailTop from '@/components/app/common-detail-top.vue';
import limitInput from '@/components/limit-input.vue';
import vueSelectStore from 'components/common/vueSelectStore';
import limitTextarea from '@/components/limit-textarea.vue';
import tinymceEdit from 'components/tinymce-edit';
import { postRequest } from '@/api/api';
export default {
  name: 'addNotice',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    },
    activeGroupId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      projectName: 'haoban-manage-web',
      topMenuData: [
        {
          id: '1',
          name: '企业公告列表',
          path: '/noticeList'
        },
        {
          id: '2',
          name: '新建公告',
          path: ''
        }
      ],
      activeId: '2', // 详情头部选中 id
      activeBrand: this.brandId, // 商户(品牌) id
      activeGroup: this.activeGroupId, // 商户(品牌) groupId
      enterpriseId: JSON.parse(localStorage.getItem('userInfo')).enterpriseId,
      userId: JSON.parse(localStorage.getItem('userInfo')).userId,
      ruleFormData: {
        receiveType: '0',
        title: '',
        img: '',
        content: '',
        sendType: '0',
        attachment: []
      },
      rules: {
        receiveType: [{ required: true, message: '请选择发送对象', trigger: 'change' }],
        // img: [{ required: true, message: '请上传封面图片', trigger: 'blur' }],
        title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
        sendType: [{ required: true, message: '请选择发送方式', trigger: 'change' }]
      },
      wxFlag: 1,
      actionUrl: '/haoban-manage-web/upload-img',
      datePickerBool: false,
      dateValue: '',
      // 门店选择
      appScene: 2,
      defaultStoreList: [], //  默认的数据
      storeTreeSet: {
        isSelectPerson: true, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      },
      defaultStoreBool: false,
      // 是否保存的标识
      saveDataBool: true,
      fileDatas: []
    };
  },

  methods: {
    // 返回 的 brandId
    selectBrandId(id, groupId) {
      this.brandId = id;
    },
    // 获取 action 的 url
    uploadUrl() {
      let host = window.location.origin;
      let baseUrl;
      if (host.indexOf('localhost') != '-1') {
        baseUrl = 'http://www.gicdev.com';
      } else {
        baseUrl = host;
      }
      let upUrl = baseUrl + this.actionUrl + '?wxFlag=' + this.wxFlag + '&requestProject=' + this.projectName + '&w=690&h=300';
      return upUrl;
    },
    // 上传之前回调
    beforeAvatarUpload(file) {
      let that = this;
      const isJPG = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/bmp';
      const isLt5M = file.size / 1024 / 1024 <= 5;
      if (!isJPG) {
        that.$message.error('上传图片必须是JPG/JPEG/BMP/PNG 格式!');
      }
      if (!isLt5M) {
        that.$message.error('上传图片大小不能超过 5MB!');
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 690;
        let height = 300;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width >= width && img.height >= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          this.$message.error('上传图片的长度和高度必须在690*300以上!');
          return Promise.reject();
        }
      );
      return isJPG && isLt5M && isSize;
    },
    /**
     * 上传成功
     */
    handleAvatarSuccess(res, file) {
      let that = this;
      if (res.errorCode == 1) {
        that.$message.success('上传成功');
        that.ruleFormData.img = res.result[0].qcloudImageUrl;
      } else {
        this.$message.error(res.message);
      }
    },
    /**
     * 附件上传
     *
     */
    beforeFileUpload(file) {
      let that = this;
      const isFiles = file.name.includes('pdf') || file.name.includes('doc') || file.name.includes('xls') || file.name.includes('ppt');
      const isLt20M = file.size / 1024 / 1024 <= 5;
      if (!isLt20M) {
        that.$message.error('文件大小超出限制，无法上传');
      }
      if (!isFiles) {
        that.$message.error('仅支持.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx类型文件');
        return false;
      }
      return isLt20M && isFiles;
    },
    handleRemove(file, fileList) {
      let that = this;
      /* eslint-disable */
      // console.log('del:', file, fileList);
      that.postDelFile(file,fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleFileSuccess(res, file) {
      // let that = this;
      /* eslint-disable */
      // console.log(res, file)
      // that.ruleFormData.attachment.push(res.result); // 不能动态修改绑定的fileList 否则只拿到最后一个回调
    },
    handleFileChange(files, fileList) {
      let that = this;
      /* eslint-disable */
      // console.log('handleFileChange:',that.fileDatas)
      that.fileDatas = fileList;
    },
    postDelFile(file,fileList) {
      let that = this;
      let para = {
        url: file.response.result.url
      };
      postRequest('/haoban-manage-web/delete-cloud-file', para).then(res => {
        let data = res.data;
        if (data.errorCode == 1) {
          that.$message.success('删除成功');
          that.fileDatas = fileList;
        } else {
          that.$message.error(data.message);
        }
      });
    },
    // 取消
    cancelSend() {
      let that = this;
      that
        .$confirm('是否确认返回，返回后当前页面内容将丢失', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.$router.go(-1);
        })
        .catch(() => {});
    },
    // 门店弹窗显示
    showDialogLayer(type, selData) {
      const that = this;
      that.defaultStoreList = selData;
      that.storeTreeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: false
      };
    },
    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      // type:	1:员工,2:部门,3:门店;
      this.defaultStoreList = group;
      this.ruleFormData.sendArea = group;
      if (group.length < 1) {
        this.defaultStoreBool = true;
      } else {
        this.saveDataBool = true;
      }
    },
    /**
     * 删除选的部门
     */
    delDepart(index) {
      let that = this;
      that.defaultStoreList.splice(index, 1);
      if (that.defaultStoreList.length < 1) {
        that.defaultStoreBool = true;
      } else {
        that.saveDataBool = true;
      }
    },
    // 选择定时发送的日期
    changeMyDate() {
      if (!this.dateValue) {
        this.datePickerBool = true;
      } else {
        this.saveDataBool = true;
      }
    },
    // 改变发送方式
    changeSendType(val) {
      if (val == '0') {
        this.saveDataBool = true;
      }
    },
    // 发布
    sendData(formName) {
      let that = this;
      let groupIds = [];
      let storeIds = [];
      that.defaultStoreList.forEach(ele => {
        if (ele.type == 2) {
          groupIds.push(ele.groupId);
        }
        if (ele.type == 3) {
          storeIds.push(ele.storeId);
        }
      });
      // 发送范围
      if (that.defaultStoreList.length < 1) {
        this.defaultStoreBool = true;
        this.saveDataBool = false;
      }
      // 发送方式
      if (that.ruleFormData.sendType == '1' && !this.dateValue) {
        this.datePickerBool = true;
        this.saveDataBool = false;
      }
      if (that.$refs.tinymceWrap.tinymceHtml != '') {
        that.ruleFormData.content = that.$refs.tinymceWrap.tinymceHtml;
      }
      that.$refs[formName].validate(valid => {
        if (valid) {
          let para = {
            groupIds: groupIds.join(','),
            storeIds: storeIds.join(','),
            receiveType: that.ruleFormData.receiveType,
            title: that.ruleFormData.title,
            imgUrl: that.ruleFormData.img,
            content: that.ruleFormData.content,
            sendType: that.ruleFormData.sendType,
            sendTime: that.dateValue,
            brandId: that.brandId,
            userId: that.userId,
            enterpriseId: that.enterpriseId,
            attachment: that.fileDatas.length? JSON.stringify(that.fileDatas.map(item => item.response.result)): ''
          };
          if (this.saveDataBool) {
            postRequest('/haoban-app-announcement-web/announcement-add', para).then(res => {
              let data = res.data;
              if (data.errorCode == 1) {
                that.$message.success('发布成功');
                that.$router.go(-1);
              } else {
                that.$message.error(data.message);
              }
            });
          }
        } else {
          return false;
        }
      });
    }
  },
  watch: {
    brandId: function(newData, oldData) {
      const that = this;
      if (!!newData) {
        that.activeBrand = newData;
      }
    },
    activeGroupId: function(newData, oldData) {
      let that = this;
      if (!!newData) {
        that.activeGroup = newData;
      }
    }
  },
  components: {
    commonDetailTop,
    limitInput,
    limitTextarea,
    vueSelectStore,
    tinymceEdit
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.notice-list-wrap {
  height: 100%;
  .notice-list {
    background: #fff;
    margin-bottom: 34px;
    min-height: 100%;
    // min-height: calc(100% + 24px);
  }
}
.demo-ruleForm {
  padding-top: 30px;
}
.input-item {
  width: 680px;
  position: relative;
}
.input-item-textarea /deep/ textarea {
  height: 94px;
  font-size: 14px;
  color: #606266;
  font-family: 'Helvetica Neue';
}
.el-upload__tip {
  line-height: 20px;
}
.active-info-num {
  position: absolute;
  right: 0;
  bottom: -31px;
  color: #909399;
  font-size: 12px;
}
.my-date-picker {
  margin-left: 15px;
}
.demo-ruleForm /deep/ .el-form-item__label {
  color: #606266;
}
.btn-wrap {
  font-size: 0;
}
// 发送范围
.depart-item-content {
  width: 100%;
  height: 32px;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  box-sizing: border-box;
}

.item-cell-select {
  /deep/ .el-select__tags {
    white-space: nowrap;
    overflow: hidden;
  }
}

.avatar-wrap {
  width: 100px;
  img {
    width: 100%;
  }
}
.date-picker-error {
  padding-left: 193px;
}
</style>
