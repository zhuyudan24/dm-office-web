<template>
  <div class="common-set-wrap" :style="{ height: windowH }">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="io-container border-box ">
          <ul class="tip-area border-box ">
            <li class="tip">由于你的企业未进行企业认证，最多导入30家门店，如有超出，可先进行<a class="a-href" href="#/companyCertify">企业认证</a></li>
            <!-- <li class="tip">
              如需更新已存在的门店及店员，可逐个进行修改，或请先导出，在导出表格里进行修改
            </li> -->
            <li class="tip">
              由于数据量可能较大，每次最多导入2000条员工档案，若超过只取前2000条，可以分多次导入
            </li>
            <li class="tip">不能在本excel表中对门店信息类别进行增加、删除、修改</li>
            <li class="tip">标*字段为必填字段，未标*字段为选填字段</li>
            <li class="tip">
              门店所在分组：请先到后台创建门店分组，将分组id填入导入表格中，导入中，若找不到对应分组，将直接将门店挂在根目录下面
            </li>
            <li class="tip">未认证企业通讯录最多只能导入30家门店，超出后无法导入，请先进行企业认证</li>
            <li class="tip">每次最多导入2000家门店，如果超出则只取前2000条数据，可以分多次导入</li>
          </ul>
          <el-radio-group v-model="type" class="m-t-20" @change="resetList">
            <el-radio-button v-if="!gicFlag" label="import">导入门店</el-radio-button>
            <!-- <el-radio-button label="export">导出/修改门店</el-radio-button> -->
            <el-radio-button label="export">导出</el-radio-button>
            <el-radio-button label="note">错误记录</el-radio-button>
          </el-radio-group>
          <div class="handle-area import" v-if="type == 'import'">
            <div class="step-div" style="margin-bottom: 90px;line-height: 32px;">
              <span class="ft-large">①</span>下载门店导入模板，批量填写门店信息
              <a :href="host + '/haoban-manage-web/excel/通讯录-门店架构导入模板.xlsx'" class="d-u-btn">
                <el-button type="primary"> 下载<i class="iconfont icon-icon_yunxiazai m-l-5"></i> </el-button>
              </a>
            </div>
            <div class="step-div">
              <span class="ft-large">②</span>上传填写好的门店信息
              <div class="d-u-btn">
                <el-upload class="upload-demo" ref="upload" :action="url + '?brandId=' + $route.query.brandId" :on-success="uploadSuccess" :on-change="getChange" :multiple="false" :file-list="fileList" :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">文件格式必须为xls或xlsx格式</div>
                </el-upload>
              </div>
            </div>
            <div class="up-btn-div">
              <el-button type="primary" @click="submitUpload('upload')" :disabled="fileList.length == 0">
                上传
              </el-button>
            </div>
          </div>
          <div class="handle-area import" v-else-if="type == 'export'">
            <div class="step-div" style="margin-bottom: 90px; line-height: 32px;">
              <span class="ft-large">①</span>导出门店
              <a class="d-u-btn" :href="'/haoban-manage-web/store/export?storeGroupId=' + $route.query.departmentId + '&showChild=' + $route.query.showChildMember">
                <el-button type="primary"> 下载<i class="iconfont icon-icon_yunxiazai m-l-5"></i> </el-button>
              </a>
              批量修改门店信息
            </div>
            <!-- <div class="step-div">
              <span class="ft-large">②</span>上传修改后的门店信息
              <div class="d-u-btn ">
                <el-upload class="upload-demo" ref="uploadEdit" :action="url + '?brandId=' + $route.query.brandId" :on-success="uploadSuccess" :on-change="getChange" :multiple="false" :file-list="fileList" :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">文件格式必须为xls或xlsx格式</div>
                </el-upload>
              </div>
            </div> -->
            <!-- <div class="up-btn-div">
              <el-button type="primary" @click="submitUpload('uploadEdit')" :disabled="fileList.length == 0">
                上传
              </el-button>
            </div> 20190424 注释 导出没有上传-->
          </div>
          <div class="error-log import" v-else>
            <div class="title-area">
              <div class="tip">{{ uploadSuccessMsg }}</div>
              <a :href="'/haoban-manage-web/error-improt-log-export?importCode=' + $route.query.importCode + '&departmentId=' + $route.query.departmentId">
                <el-button type="primary">导出错误记录</el-button>
              </a>
            </div>
            <el-table v-loading="loading" :data="logList" class="m-t-20" style="width: 100%">
              <el-table-column type="index" width="50" label="序号"> </el-table-column>
              <el-table-column label="错误提示" prop="failReason"></el-table-column>
              <el-table-column label="姓名" prop="name"></el-table-column>
              <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
              <el-table-column label="部门ID" prop="departmentId"></el-table-column>
              <el-table-column label="职位" prop="positionName"></el-table-column>
              <el-table-column label="是否此部门负责人（是/否）" prop="isManager">
                <template slot-scope="scope">
                  {{ scope.row.isManager == 1 ? '是' : '否' }}
                </template>
              </el-table-column>
              <el-table-column label="入职时间" prop="hireDate"></el-table-column>
            </el-table>
            <div class="pagination" v-if="!!logList.length">
              <el-pagination background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="currentPage" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import uploadExcelComponent from 'components/uploadExcel/index';
import { getRequest } from '@/api/api';
import { getGicStatus } from '@/api/gicStatus';
import errMsg from '@/common/js/error';
export default {
  name: 'employee-io',
  components: {
    navCrumb,
    uploadExcelComponent
  },
  data() {
    let local = window.location.origin;
    if (local.indexOf('localhost') != -1) {
      local = 'http://www.gicdev.com';
    }
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '门店架构',
          path: 'storeFrame'
        },
        {
          name: '批量导入导出',
          path: ''
        }
      ],
      host: window.location.origin,
      windowH: window.screen.availHeight - 180 + 'px',
      type: 'import',
      fileList: [],
      url: local + '/haoban-manage-web/store/upload',
      uploadSuccessMsg: '', // 导入结果
      logList: [],
      loading: true,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      // gic 同步字段
      gicFlag: true
    };
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getErrorNote();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getErrorNote();
    },
    resetList(val) {
      this.fileList = [];
      if (val == 'note') {
        this.getErrorNote();
      }
    },
    getErrorNote() {
      let that = this;
      let params = {
        departmentId: that.$route.query.departmentId,
        importCode: that.$route.query.importCode
      };
      getRequest('/haoban-manage-web/error-log-page', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.total = res.data.result.totalCount;
            that.logList = res.data.result;
            that.loading = false;
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
    /* eslint-disable */
    handleRemove(file, fileList) {
    },
    /* eslint-disable */
    handlePreview(file) {
    },
    uploadSuccess() {
      if (res.errorCode == 1) {
        this.uploadSuccessMsg = res.message.split(',');
      } else {
        this.$message.error(res.message);
      }
      this.fileList = [];
      this.type = 'note';
      this.getErrorNote();
    },
    submitUpload(upload) {
      this.$refs[upload].submit();
    },
    getChange(file, fileList) {
      this.fileList = fileList;
    },
    // 获取 GIC 门店同步状态
    async getGicData(brandId) {
      let that = this;
      let para = {
        type: 1,
        businessId: brandId
      };
      let res = await getGicStatus(para);
      let resData = res.data;
      if (resData.errorCode == 1) {
        that.gicFlag = resData.result;
        that.type = !!resData.result? 'export': 'import';
      } else {
        errMsg.errorMsg(resData);
      }
    }
  },
  beforeMount() {
    let brandId = this.$route.query.brandId;
    this.getGicData(brandId);
    if (this.type == 'note') {
      this.getErrorNote();
    }
    this.$nextTick(function() {
      document.querySelector('.contact-wrap__body').style.overflow = 'hidden';
    });
  },
  beforeDestroy() {
    document.querySelector('.contact-wrap__body').style.overflow = 'auto';
  }
};
</script>
<style lang="scss">
.io-container {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  padding: 28px 32px;
  overflow: auto;

  .tip-area {
    width: 100%;
    background: rgba(236, 245, 255, 1);
    border: 1px solid rgba(179, 216, 255, 1);
    border-radius: 4px;
    padding: 10px;
    font-size: 13px;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);
    .tip {
      line-height: 24px;
      position: relative;
      padding-left: 16px;
      text-align: left;

      &:last-child {
        margin-bottom: 0;
      }

      .radio {
        width: 6px;
        height: 6px;
        background: rgba(64, 158, 255, 1);
        border-radius: 50%;
      }

      &::before {
        position: absolute;
        content: '';
        width: 6px;
        height: 6px;
        background: rgba(64, 158, 255, 1);
        border-radius: 50%;
        top: 9px;
        left: 0;
      }
    }
  }

  .error-log {
    margin-top: 24px;

    .title-area {
      display: flex;
      height: 32px;
      line-height: 32px;

      .tip {
        flex: 1;
        .red {
          color: red;
        }
      }
    }

    .pagination {
      margin-top: 30px;
      text-align: right;
    }
  }

  .handle-area {
    height: 310px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(220, 223, 230, 1);
    border-radius: 4px;
    padding: 25px 20px;
    margin-top: 24px;
    color: #606266;

    .step-div {
      .d-u-btn {
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        margin-right: 10px;

        .iconfont {
          margin-left: 5px;
        }

        .warming {
          font-size: 12px;
          font-weight: 400;
          color: rgba(96, 98, 102, 1);
          line-height: 30px;
          margin-top: 5px;
        }
      }

      .ft-large {
        font-size: 20px;
        margin-right: 10px;
        color: #909399;
      }
    }

    .up-btn-div {
      text-align: center;
      margin-top: 40px;
    }
  }
}
</style>
