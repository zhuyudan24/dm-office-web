<template>
  <div class="common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="share-code-div">
          <p class="company-name">{{ myEnterprise }}的共享企业</p>
          <p class="word">双方共享的通讯录，选人时可以选到，同时邀请企业建立共享关系</p>
          <p class="time-tip">一个二维码只能和一个企业建立共享关系，24小时有效</p>
          <div id="qrcode" class="m-t-20"></div>
          <div class="btn-area">
            <el-button type="primary" @click="downloadCode">下载<i class="iconfont icon-icon_yunxiazai"></i></el-button>
            <el-button @click="reFresh()">重新生成</el-button>
          </div>
          <p class="company-name">已建立的共享企业</p>
          <div class="share-table" v-if="shares.length > 0">
            <div class="company">{{ myEnterprise }}</div>
            <ul class="list">
              <li class="li" v-for="enterprise in shares" :key="enterprise.importEnterpriseId">
                <div class="name">{{ enterprise.importEnterpriseName }}</div>
                <div class="cancel-btn">
                  <a class="a-href" @click="cancelShare(enterprise)">取消共享</a>
                </div>
              </li>
            </ul>
          </div>
          <div class="no-share-tip">暂无共享企业</div>
          <el-dialog title="验证管理员身份" width="356px" :visible.sync="dialogVisible">
            <div class="cancel-code">
              <p>请使用管理员的好办扫一扫确认</p>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import { getRequest } from '@/api/api';
import QRCode from 'qrcodejs2';
export default {
  name: 'shareCode',
  components: {
    navCrumb
  },
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '共享通讯录',
          path: ''
        }
      ],
      regenerate: false,
      qrCodeContent: {},
      shares: [],
      qrcodeCase: '',
      myEnterprise: '',
      dialogVisible: false
    };
  },
  methods: {
    getCode(regenerate = false) {
      // 获取共享二维码信息
      let that = this;
      let params = {
        regenerate
      };
      getRequest('/haoban-manage-web/shared-contact/get-shared-qrcode', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.qrcode(res.data.result.qrCodeContent);
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
    },
    reFresh() {
      // 刷新二维码
      document.getElementById('qrcode').innerHTML = '';
      this.qrcodeCase.clear(); // 先清除原有的
      this.getCode(true);
    },
    /**
     *  生成二维码
     */
    qrcode(text) {
      const that = this;
      that.qrcodeCase = new QRCode('qrcode', {
        width: 245,
        height: 245, // 高度
        text: text // 二维码内容 //
        //render: 'canvas', // 设置渲染方式（有两种方式 table和canvas，默认是canvas） //
        //background: '#f0f',
        //foreground: '#ff0'
      });
    },
    /**
     * 下载二维码
     */
    downloadCode() {
      let img = document.getElementById('qrcode').getElementsByTagName('img')[0];
      let data = img.getAttribute('src');
      let a = document.createElement('a'); // 生成一个a元素
      let event = new MouseEvent('click'); // 创建一个单击事件
      a.download = 'scan code'; // 设置图片名称
      a.href = data; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
    },
    getShareRelation() {
      // 获取当前企业共享信息
      let that = this;
      let params = {
        enterpriseIdCondition: 1
      };
      getRequest('/haoban-manage-web/shared-contact/find-shared-contact-relation', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.shares = res.data.result || [];
            if (that.shares.length > 0) that.myEnterprise = res.data.result[0].exportEnterpriseName;
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
    },
    cancelShare(enterprise) {
      let that = this;
      // that.dialogVisible = true;
      that
        .$confirm('是否要取消与该企业的共享？', '提示', {
          type: 'warning'
        })
        .then(() => {
          getRequest('/haoban-manage-web/shared-contact/del-shared-enterprise', {
            importEnterpriseId: enterprise.importEnterpriseId
          })
            .then(res => {
              if (res.data.errorCode == 1) {
                let idx = that.shares.indexOf(enterprise);
                that.shares.splice(idx, 1);
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
        })
        .catch({});
    }
  },
  beforeMount() {
    this.getShareRelation();
    // this.getShareBrands();
    this.getCode();
  }
};
</script>
<style lang="scss">
.share-code-div {
  width: 100%;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  box-sizing: border-box;
  padding: 28px;
  font-weight: 500;
  overflow: auto;

  .company-name {
    font-size: 16px;
    color: rgba(48, 49, 51, 1);
  }

  .word {
    font-size: 14px;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);
    margin-top: 17px;
  }

  .time-tip {
    font-size: 14px;
    font-weight: 400;
    margin-top: 25px;
    color: rgba(245, 108, 108, 1);
  }

  .btn-area {
    margin-top: 24px;
    margin-bottom: 46px;

    .iconfont {
      margin-left: 5px;
    }
  }

  .share-table {
    display: flex;
    height: auto;
    border: 1px solid rgba(235, 238, 245, 1);
    margin: 24px 0 48px 0;

    .company {
      width: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .list {
      flex: 1;

      .li {
        display: flex;
        height: 60px;
        line-height: 60px;
        border-left: 1px solid rgba(235, 238, 245, 1);
        border-bottom: 1px solid rgba(235, 238, 245, 1);
        font-size: 14px;

        &:last-child {
          border-bottom: none;
        }

        .cancel-btn {
          width: 220px;
        }

        .name {
          flex: 1;
          padding: 0 15px;
        }
      }
    }
  }

  .no-share-tip {
    padding: 30px;
    text-align: center;
  }
}

.el-dialog__body {
  .cancel-code {
    text-align: center;
    padding-bottom: 50px;
  }
}
</style>
