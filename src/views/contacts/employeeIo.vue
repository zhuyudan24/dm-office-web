<template>
  <div class="common-set-wrap" :style="{ height: windowH }">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="io-container border-box ">
          <ul class="tip-area border-box ">
            <li class="tip">由于你的企业未进行企业认证，通讯录最多只能导入200人以内的员工，如有超出可先进行<a class="a-href" href="#/companyCertify">企业认证</a></li>
            <!-- <li class="tip">
              如需更新已存在的员工，可逐个进行修改，或请先导出通讯录，在导出表格里进行修改
            </li> -->
            <li class="tip">不能在本excel表中对员工信息类别进行增加、删除、修改</li>
            <li class="tip">标*字段为必填字段，未标*字段为选填字段</li>
            <li class="tip">
              员工所在部门：请先到后台创建部门，将部门id填入导入表格中，导入中，若找不到对应部门，将直接将员工挂在根目录下面
            </li>
            <li class="tip">未认证企业通讯录最多只能导入200人，超出后无法导入，请先进行企业认证</li>
          </ul>
          <el-radio-group v-model="type" class="m-t-20" @change="resetList">
            <el-radio-button label="import">导入通讯录</el-radio-button>
            <!-- <el-radio-button label="export">导出/修改通讯录</el-radio-button> -->
            <el-radio-button label="export">导出</el-radio-button>
            <el-radio-button label="note">错误记录</el-radio-button>
          </el-radio-group>
          <div class="handle-area import" v-if="type == 'import'">
            <div class="step-div" style="margin-bottom: 90px; line-height: 32px;">
              <span class="ft-large">①</span>下载员工通讯录模板，统一收集员工信息
              <a :href="host + '/haoban-manage-web/excel/通讯录-行政架构导入模板.xlsx'" class="d-u-btn">
                <el-button type="primary">下载<i class="iconfont icon-icon_yunxiazai m-l-5"></i></el-button>
              </a>
            </div>
            <div class="step-div">
              <span class="ft-large">②</span>上传收集完毕的员工信息表
              <div class="d-u-btn">
                <el-upload class="upload-demo" ref="upload" :action="url" :on-success="uploadSuccess" :on-change="getChange" :multiple="false" :file-list="fileList" :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">文件格式必须为xls或xlsx格式</div>
                </el-upload>
              </div>
            </div>
            <div class="up-btn-div">
              <el-button type="primary" @click="submitUpload('upload')" :disabled="fileList.length == 0">上传</el-button>
            </div>
          </div>
          <div class="handle-area import" v-else-if="type == 'export'">
            <div class="step-div" style="margin-bottom: 90px; line-height: 32px;">
              <span class="ft-large">①</span>导出所有员工信息
              <a class="d-u-btn" :href="host + '/haoban-manage-web/emp/export?departmentId=' + $route.query.departmentId + '&showChild=' + $route.query.showChildMember">
                <el-button type="primary"> 下载<i class="iconfont icon-icon_yunxiazai m-l-5"></i> </el-button>
              </a>
              批量修改员工信息
            </div>
            <!-- <div class="step-div">
              <span class="ft-large">②</span>上传修改好的员工信息表
              <div class="d-u-btn">
                <el-upload class="upload-demo" ref="uploadEdit" :action="url" :on-success="uploadSuccess" :on-change="getChange" :multiple="false" :file-list="fileList" :auto-upload="false">
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                  <div slot="tip" class="el-upload__tip">文件格式必须为xls或xlsx格式</div>
                </el-upload>
              </div>
            </div> -->
            <!-- <div class="up-btn-div">
              <el-button type="primary" @click="submitUpload('uploadEdit')" :disabled="fileList.length == 0">上传</el-button>
            </div> 20190424 注释 导出没有上传-->
          </div>
          <div class="error-log import" v-else>
            <div class="title-area">
              <!-- <div class="tip">导入总条数：0条，成功导入0条，<span class="red">错误导入0条</span></div> -->
              <div class="tip">{{ uploadSuccessMsg }}</div>
              <a :href="host + '/haoban-manage-web/error-improt-log-export?importCode=' + $route.query.importCode + '&departmentId=' + $route.query.departmentId">
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
          name: '行政架构',
          path: 'administrativeFrame'
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
      url: local + '/haoban-manage-web/emp/upload',
      uploadSuccessMsg: '', // 导入结果
      logList: [],
      loading: true,
      pageSize: 20,
      currentPage: 1,
      total: 0
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
    // 获取错误日志
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
            that.logList = res.data.result.result;
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
    // 上传成功之后获取本次错误日志
    uploadSuccess(res) {
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

    /**
     * 上传文件改变
     */
    getChange(file, fileList) {
      let len = fileList.length - 1 < 0 ? 0 : fileList.length - 1;
      // 判断上传文件类型
      let fileType = !!file.type ? file.type : file.raw.type;
      let isExcel = fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        this.$message.error('文件格式必须为 xls 或 xlsx 格式!');
        this.fileList.splice(len, 1);
        return false;
      }

      this.fileList = [fileList[len]];
    }
  },
  beforeMount() {
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
