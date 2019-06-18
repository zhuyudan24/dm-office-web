<template>
  <div class="common-set-wrap record-io-wrap" :style="{ height: windowH }">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="io-container">
          <template v-if="!dialogVisible">
            <ul class="tip-area">
              <li class="tip">
                姓名必须和好办企业通讯录中的员工姓名保持一致，手机号必须为员工注册好办的手机号
              </li>
              <li class="tip">
                员工档案导入时，直接以手机号去做匹配，通讯录中不存在的将无法导入（模板中配置的部门、职位、code，这些字段信息请保持与企业通讯录中一致，这几个字段的信息将不会修改通讯录的信息，直接取该成员对应的通讯录的字段信息）
              </li>
              <li class="tip">如果想要新增字段，可在后台档案设置中增加，再导入模板</li>
              <li class="tip">字段类型为图片上传、多选的字段无法导入、导出</li>
              <li class="tip">确保导入的表头字段和后台配置表头字段的名称一致（模板下载时间不可修改）</li>
              <li class="tip">
                由于数据量可能较大，每次最多导入2000条员工档案，若超过只取前2000条，可以分多次导入
              </li>
            </ul>
            <el-radio-group v-model="type" class="m-t-20" @change="resetList">
              <el-radio-button label="import">导入员工档案</el-radio-button>
              <el-radio-button label="export">导出/修改员工档案</el-radio-button>
              <el-radio-button label="note">错误记录</el-radio-button>
            </el-radio-group>
            <div class="handle-area import" v-if="type == 'import'">
              <div class="step-div" style="margin-bottom: 90px; line-height: 32px;">
                <span class="ft-large">①</span>下载模板
                <a :href="host + '/haoban-manage-web/record/export-record-template.json'" class="d-u-btn">
                  <el-button type="primary">下载<i class="iconfont icon-icon_yunxiazai m-l-5"></i></el-button>
                </a>
              </div>
              <div class="step-div">
                <span class="ft-large">②</span>上传员工档案
                <div class="d-u-btn">
                  <el-upload class="upload-demo" ref="upload" :action="url" :multiple="false" :file-list="fileList" :auto-upload="false" :before-upload="beforeAvatarUpload" :on-success="uploadSuccess" :on-change="getChange">
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
                <span class="ft-large">①</span>导出员工档案
                <a class="d-u-btn">
                  <el-button type="primary" @click="callExport">下载<i class="iconfont icon-icon_yunxiazai m-l-5"></i></el-button>
                </a>
              </div>
              <div class="step-div">
                <span class="ft-large">②</span>上传更新后的员工档案
                <div class="d-u-btn">
                  <el-upload class="upload-demo" ref="uploadEdit" :action="url" :multiple="false" :file-list="fileList" :auto-upload="false" :on-success="uploadSuccess" :on-change="getChange">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <div slot="tip" class="el-upload__tip">文件格式必须为xls或xlsx格式</div>
                  </el-upload>
                </div>
              </div>
              <div class="up-btn-div">
                <el-button type="primary" @click="submitUpload('uploadEdit')" :disabled="fileList.length == 0">上传</el-button>
              </div>
            </div>
            <div class="error-log import" v-else>
              <div class="title-area">
                <div class="tip">导入总条数：0条，成功导入0条，<span class="red">错误导入0条</span></div>
                <a :href="host + '/haoban-manage-web/record/error-log-export?importCode=' + $route.query.importCode">
                  <el-button type="primary">导出错误记录</el-button>
                </a>
              </div>
              <el-table v-loading="loading" :data="logList" class="m-t-20" height="400" style="width: 100%">
                <el-table-column type="index" width="50" label="序号"> </el-table-column>
                <el-table-column width="200" prop="fieldValue" label="字段值"> </el-table-column>
                <el-table-column width="200" prop="fieldName" label="字段名"> </el-table-column>
                <el-table-column width="200" prop="failReason" label="错误原因"> </el-table-column>
                <template v-for="temp in tempList">
                  <el-table-column :key="temp.fieldCode" width="200" :label="temp.fieldName" :prop="temp.fieldCode"> </el-table-column>
                </template>
              </el-table>
              <el-pagination v-if="!!logList.length" class="pagination" background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="currentPage" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
            </div>
          </template>
          <template v-else>
            <export-set @cancelCho="cancelCho"></export-set>
          </template>
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
import exportSet from 'components/employeeRecord/exportSet';
export default {
  name: 'employee-io',
  components: {
    navCrumb,
    uploadExcelComponent,
    exportSet
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
          name: '通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '员工档案',
          path: '/fileSet'
        },
        {
          name: '在职员工',
          path: '/employeeRecord'
        },
        {
          name: '导入员工档案',
          path: ''
        }
      ],
      windowH: window.screen.availHeight - 180 + 'px',
      host: window.location.origin,
      type: 'import',
      fileList: [],
      url: local + '/haoban-manage-web/record/record-template-file-upload',
      logList: [],
      loading: true,
      pageSize: 20,
      currentPage: 1,
      total: 0,
      tempList: [],
      dialogVisible: false
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
        importCode: that.$route.query.importCode,
        pageNum: that.currentPage,
        pageSize: that.pageSize
      };
      getRequest('/haoban-manage-web/record/find-error-log', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.total = res.data.result.totalCount;
            that.logList = res.data.result.result;
            that.formatData(res.data.result.template, res.data.result.page.result);
            // that.loading = false;
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
    formatData(tempList, logList) {
      let arr = [];
      tempList.forEach(temp => {
        arr.push({
          fieldCode: temp.fieldCode,
          fieldName: temp.fieldName
        });
      });
      this.tempList = arr;
      this.logList = logList;
      this.loading = false;
    },

    /**
     * 上传之前校验
     */
    beforeAvatarUpload(file) {
      let fileType = !!file.type ? file.type : file.raw.type;

      let isExcel = fileType === 'application/vnd.ms-excel' || fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        this.$message.error('文件格式必须为 xls 或 xlsx 格式!');
      }
      return isExcel;
    },

    uploadSuccess() {
      this.fileList = [];
      this.type = 'note';
      this.getErrorNote();
    },
    submitUpload(upload) {
      this.$refs[upload].submit();
    },
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
    },
    callExport() {
      // 呼出导出员工设置弹窗
      this.dialogVisible = true;
    },
    cancelCho() {
      this.dialogVisible = false;
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
.border-box {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
.record-io-wrap {
  .io-container {
    width: 100%;
    height: auto;
    background: #fff;
    padding: 24px 32px;
    @extend .border-box;

    .tip-area {
      width: 100%;
      background: rgba(236, 245, 255, 1);
      border: 1px solid rgba(179, 216, 255, 1);
      border-radius: 4px;
      padding: 10px;
      font-size: 13px;
      text-align: left;
      font-weight: 400;
      color: rgba(96, 98, 102, 1);
      @extend .border-box;

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
}
</style>
