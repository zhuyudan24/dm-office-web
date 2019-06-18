<!--
  单个上传组件
   <single-upload
    :imgSrc.sync=""
    :field="''">
  </single-upload>
 -->
<template>
  <div class="single-upload-wrap">
    <el-upload class="avatar-uploader" :action="uploadUrl()" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="imgSrc" :src="imgSrc" class="avatar" @mouseover="showImage(imgSrc)" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <p class="upload-tip w-500" v-if="field == 'businessCard'">
      上传营业执照复印件加盖公章，手写“仅用于好办认证”字样；照片搜索信息要求清晰可见，内容真实有效，不得做任何修改；支持jpp、jpeg、bmg、gif、png格式，大小不超过8M。
    </p>
    <p class="upload-tip w-500" v-if="field == 'cardUrl'">
      支持jpg、jpeg、pdf、bmg、gif格式照片，大小不超过2M，只能上传一张，再次上传覆盖前一张
    </p>
    <p class="upload-tip w-500" v-if="field == 'authUrl'">点击可以<a class="color-1890ff" href="https://other-1251519181.cos.ap-shanghai.myqcloud.com/doc/20190529092413/好办认证授权书.docx" download="好办认证授权书.docx">下载授权书</a>模板，支持jpg、jpeg、pdf、bmg、gif格式照片，大小不超过2M，只能上传一张，再次上传覆盖前一张</p>
    <!-- 图片预览 -->
    <vue-gic-img-preview :imgUrl="imgUrl" :imgShowFlag="imgShowFlag" @hideImage="hideImage"></vue-gic-img-preview>
  </div>
</template>
<script>
// import strLength from '@/common/js/strlen';
// import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
// import { _debounce } from '@/common/js/public';
// import { getRequest } from '@/api/api';
export default {
  name: 'single-upload',
  props: {
    imgSrc: {
      // 传入 input value
      type: String,
      default: ''
    },
    field: {
      type: String,
      default: ''
    },
    uploadLimit: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      projectName: '', // 当前项目名
      imgShowFlag: false, // 是否弹框显示,true: 显示；false: 不显示
      imgUrl: '' // 传递的图片 src
    };
  },
  beforeMount() {
    const that = this;
    let host = window.location.origin;
    if (host.indexOf('localhost') != -1) {
      that.baseUrl = 'http://www.gicdev.com';
    } else {
      that.baseUrl = host;
    }

    // that.upUrl = that.baseUrl + '/api-plug/upload-img?wxFlag=1'
  },
  methods: {
    /**
     * 上传图片
     */
    uploadUrl() {
      const that = this;
      let host = window.location.origin;
      let baseUrl;
      if (host.indexOf('localhost') != '-1') {
        baseUrl = 'http://www.gicdev.com';
      } else {
        baseUrl = host;
      }

      that.upUrl = baseUrl + '/haoban-manage-web/upload-img';
      return that.upUrl;
    },

    /**
     * 上传图片
     */
    handleAvatarSuccess(res, file, type) {
      const that = this;
      if (res.errorCode == 1) {
        that.$emit('update:imgSrc', res.result[0].qcloudImageUrl);
      } else {
        errMsg.errorMsg(res);
      }
    },
    beforeAvatarUpload(file) {
      const that = this;
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp';
      const isLt2M = file.size / 1024 / 1024 < that.uploadLimit;
      // if (!isJPG) {
      //   that.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        that.$message.error(`上传头像图片大小不能超过 ${that.uploadLimit}MB!`);
      }
      return (
        isJPG &&
        isLt2M &&
        new Promise(function(resolve, reject) {
          let reader = new FileReader();
          reader.onload = function(event) {
            let image = new Image();
            image.onload = function() {
              /* eslint-disable */
              let width = this.width;
              let height = this.height;
              // if (width !== 750 && height !== 750){
              //   that.$message.error('图片尺寸必须为750px*750px!');
              //   reject();
              // }
              resolve();
            };
            image.src = event.target.result;
            // that.$emit('update:imgSrc',event.target.result)
          };
          reader.readAsDataURL(file);
        })
      );
    },

    /**
     * 上传图片预览
     */
    showImage(src) {
      const that = this;
      if (!src || src == '') {
        return false;
      }
      that.imgShowFlag = true;
      that.imgUrl = src;
    },
    hideImage(val) {
      const that = this;
      that.imgShowFlag = val;
    }
  }
  // mounted() {}
};
</script>
<style lang="less" scoped>
.w-500 {
  width: 500px;
}
.avatar-uploader {
  /deep/ .el-upload {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-align-items: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    width: 180px;
    height: 180px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
}

/* flex */
.flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.flex-1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.flex-column {
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
}

.flex-row {
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  -o-flex-direction: row;
  flex-direction: row;
}

.flex-align-center {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.flex-pack-center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
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
  max-width: 180px;
  max-height: 180px;
  display: block;
}

.upload-tip {
  margin-top: 8px;
  color: #606266;
  font-size: 12px;
  line-height: 20px;
}

.color-1890ff {
  color: #1890ff;
}
</style>
