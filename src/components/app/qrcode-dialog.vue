<!--
<qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>

import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
components: {
  qrcodeDialog
}

dialogVisible: false,

let webUrl = ``;
that.$refs.qrcodePreview.qrcode(webUrl, type); # type: 二维码类型，不同地方不同类型
that.dialogVisible = true;
-->
<template>
  <div class="qr-dialog-content" style="opacity: 1;" v-show="value">
    <div class="qr-mask" @click.stop="closeDialog"></div>
    <div class="qr-dialog">
      <div class="qr-dialog__hd">
        <strong class="qr-dialog__title">预览</strong>
        <i class="el-icon-close" @click.stop="closeDialog"></i>
      </div>
      <div class="qr-dialog__bd">
        <div id="qrcode"></div>
        <div class="qr-dialog__p">请使用好办 APP 扫一扫预览</div>
      </div>
      <div class="qr--dialog__ft"></div>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2';
export default {
  name: 'qrcode-dialog',
  props: {
    value: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  data() {
    return {
      qrcodeCase: '' // 二维码实例
    };
  },
  methods: {
    /**
     *  关闭预览窗口
     */
    closeDialog() {
      const that = this;
      that.$emit('input', false);
    },

    /**
     *  生成二维码
     */
    qrcode(text, type) {
      let that = this;
      if (!!that.qrcodeCase) {
        document.getElementById('qrcode').innerHTML = '';
        that.qrcodeCase.clear(); // 先清除原有的
      }
      let qrObj = {
        type: type,
        data: text
      };
      that.qrcodeCase = new QRCode('qrcode', {
        width: 210,
        height: 210, // 高度
        text: JSON.stringify(qrObj), // 二维码内容 //
        //render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas） //
        //background: '#f0f',
        //foreground: '#ff0'
        correctLevel: 3
      });
    }
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.qr-mask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
}

.qr-dialog {
  position: fixed;
  z-index: 5000;
  width: 80%;
  max-width: 300px;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;

  .qr-dialog__hd {
    position: relative;
    .qr-dialog__title {
      display: block;
      padding: 32px 0;
      font-size: 18px;
      color: #303133;
    }

    i {
      position: absolute;
      top: 0;
      right: 0;
      display: block;
      width: 46px;
      height: 46px;
      line-height: 46px;
      text-align: center;
      font-size: 10px;
      color: #9b9da3;
      cursor: pointer;
    }
  }

  .qr-dialog__bd {
    padding: 0 1.6em 0.8em;
    min-height: 40px;
    font-size: 15px;
    line-height: 1.3;
    word-wrap: break-word;
    word-break: break-all;
    color: #808080;

    #qrcode {
      display: -webkit-flex;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .qr-dialog__p {
      padding: 20px 0;
      font-size: 14px;
      color: #606266;
    }
  }
}
</style>
