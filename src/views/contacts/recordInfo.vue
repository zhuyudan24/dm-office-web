<template>
  <div class="common-set-wrap" :style="{ 'min-height': windowH }">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="commom-container clerk-detail-container">
          <p class="t-rt"><a class="a-href font-14" @click="getPdf()">打印员工档案</a></p>
          <div id="pdfDom" :style="{ 'min-height': windowH }">
            <div class="employee-detail-cell">
              <div class="head-info">
                <p class="head-cell">
                  <img v-if="!!info.headPic" :src="info.headPic" class="head-img" />
                  <span v-else class="head-img-null">
                    <i class="iconfont icon-yewuduanmorentouxian"></i>
                  </span>
                </p>
                <p class="head-cell name">
                  {{ info.clerkName }}<span>{{ info.clerkStatus == '-1' ? '无状态' : statusList[info.clerkStatus - 1] }}</span>
                </p>
                <p class="head-cell c-303133">{{ info.groupName }}{{ info.positionName }}</p>
                <p class="head-cell color-606266">已在{{ info.enterpriseName }}工作了{{ info.days }}天</p>
              </div>
            </div>
            <template v-for="field in fieldList">
              <editable-cell v-if="field.childrens" :key="field.fieldCode" :info="info" :staticInfo="staticInfo" :items="items" :title="field.title" :fieldList="field.childrens" @subSuccess="subSuccess"> </editable-cell>
            </template>
            <div class="mile-stone-container">
              <p class="m-s-title"><span class="font-w-500">员工记录</span></p>
              <ul class="mile-stone">
                <li v-for="(stones, index) in mileStone" :key="index" class="stone-group" :class="index % 2 == 0 ? 'column' : 'column-reverse'">
                  <div class="column-hurdle" v-if="stones.length == 4 && index != mileStone.length - 1"></div>
                  <div v-for="(his, idx) in stones" :key="idx" class="stone" :class="(index % 2 == 1 && idx == 3) || (index % 2 == 0 && idx == 0 && index != 0) ? 'no-radio' : ''">
                    <p class="time">{{ his.historyDate | formatDate('YY-MM-DD') }}</p>
                    <div class="hurdle-box">
                      <span class="radio"></span>
                      <div class="hurdle"></div>
                    </div>
                    <p class="position">{{ his.positionName }}</p>
                    <p class="font-16 ">{{ historyStatus[his.historyStatus * 1 - 1] }}<a class="a-href m-l-10 fs-12" @click="editHis(his)" v-if="his.historyStatus == 3">编辑</a></p>
                    <p v-if="his.historyStatus == 3">离职理由：{{ reasons[his.fireReason] }}</p>
                    <p class="color-606266">{{ !!his.storeName ? his.storeName : his.groupName }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <el-dialog title="修改离职信息" :visible.sync="dialogVisible" width="480px">
            <handle-dialog :employee="editHisObj" handleType="changeFireInfo" typeTitle="修改离职信息" @handleSuccess="handleSuccess"> </handle-dialog>
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
import { deepClone, formatDate } from '@/utils/index';
import editableCell from 'components/employeeRecord/editableCell';
import handleDialog from 'components/employeeRecord/handleDialog';
export default {
  name: 'recordInfo',
  components: {
    navCrumb,
    editableCell,
    handleDialog
  },
  filters: {
    formatDate
  },
  data() {
    return {
      windowH: window.screen.availHeight - 180 + 'px',
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
          name: '编辑员工信息',
          path: ''
        }
      ],
      editNavpath: [
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
          name: '离职员工',
          path: '/unemployee'
        },
        {
          name: '编辑员工信息',
          path: ''
        }
      ],
      dialogVisible: false,
      htmlTitle: '员工档案',
      info: {},
      staticInfo: {},
      statusList: ['正式', '试用', '离职'],
      reasons: ['', '家庭原因', '个人原因', '发展原因', '合同到期不续签', '协议解除', '无法胜任工作', '经济性裁员', '严重违法违纪', '其他'],
      items: [],
      fieldList: [],
      mileStone: [], // 里程碑数据
      historyStatus: ['新入职', '转正', '离职', '转岗', '再入职'],
      editHisObj: {}
    };
  },
  methods: {
    handleSuccess() {
      this.dialogVisible = false;
    },
    getEmployeeDetail() {
      // 获取员工详情
      let that = this;
      let params = {
        recordId: that.$route.query.recordId
      };
      getRequest('/haoban-manage-web/record/employee-detail', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.getTemplate(res.data.result);
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
    subSuccess() {
      // 修改成功之后重新获取员工信息
      this.getEmployeeDetail();
    },
    getTemplate(clerkInfo) {
      // 获取档案模板
      let that = this;
      getRequest('/haoban-manage-web/record/employee-find-template', {})
        .then(res => {
          // console.log(res, "模板");
          if (res.data.errorCode == 1) {
            that.formatTemplateList(res.data.result, clerkInfo);
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
    formatTemplateList(list, clerkInfo) {
      // 格式化档案详情和模板
      let that = this;
      let fieldList = [];
      let copyData = list;
      let obj = JSON.parse(clerkInfo.defineString);
      let cInfo = deepClone(clerkInfo);
      for (let key in obj) {
        cInfo[key] = obj[key];
      }
      list.forEach(tem => {
        // 字段类型0：单行输入框，1：多行输入框，2：单选框 3:多选框 4:日期 5:日期区间 6：数字输入框 7：图片上传
        if (tem.parentCode != 0) {
          tem.fieldOperations = JSON.parse(tem.fieldOperations);
        }
        if (tem.fieldType == 5) {
          // 时间区间
          cInfo[tem.fieldCode] = !!cInfo[tem.fieldCode] ? cInfo[tem.fieldCode].split(',') : ['', '']; // 时间区间转换为数组格式
          clerkInfo[tem.fieldCode] = !!clerkInfo[tem.fieldCode] ? clerkInfo[tem.fieldCode].split(',') : ['', ''];
        }
        if (tem.fieldType == 6) {
          /*  cInfo[tem.fieldCode] *= 1; // 强制转为数字类型
          clerkInfo[tem.fieldCode] *= 1; */
        }
        if (tem.fieldType == 7) {
          let arr = [];
          cInfo[tem.fieldCode] = !!cInfo[tem.fieldCode] ? cInfo[tem.fieldCode].split(',') : []; // 图片链接拼接字符串转为数组格式
          cInfo[tem.fieldCode].forEach(img => {
            arr.push({ url: img });
          });
          clerkInfo[tem.fieldCode] = arr;
          cInfo[tem.fieldCode] = arr.slice(0);
        }
        // console.log(tem.fieldType, tem.fieldName, tem.fieldOperations, tem);
        tem.title = tem.fieldName;
        let arr = [];
        copyData.forEach(li => {
          if (li.parentCode == tem.fieldCode) {
            arr.push(li);
          }
        });
        arr.sort(function(a, b) {
          return a.sort * 1 - b.sort * 1;
        });
        if (arr.length > 0) tem['childrens'] = arr;
        if (tem.parentCode == 0) {
          fieldList.push(tem);
        }
      });
      fieldList.sort(function(a, b) {
        return a.sort * 1 - b.sort * 1;
      });
      that.fieldList = fieldList;
      // console.log(fieldList, clerkInfo, cInfo, 'new fieldList');
      that.info = cInfo;
      that.staticInfo = clerkInfo;
    },
    getHistoryList() {
      // 获取员工历史纪录
      let that = this;
      let params = {
        recordId: that.$route.query.recordId
      };
      getRequest('/haoban-manage-web/record/history-record-list', params)
        .then(res => {
          // console.log(res, "history");
          if (res.data.errorCode == 1) {
            let arr = res.data.result;
            that.formatMileStone(arr);
          } else {
            that.$message({
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.$message({
            message: e.message
          });
        });
    },
    formatMileStone(list) {
      // 格式化员工历史记录信息
      let that = this;
      list.sort(function(a, b) {
        return a.historyDate * 1 - b.historyDate * 1;
      });
      let arr = [];
      for (let i = 0, len = list.length; i < len; i += 4) {
        arr.push(list.slice(i, i + 4));
      }
      // console.log(arr, "dddddd");
      that.mileStone = arr;
    },
    editHis(his) {
      // 编辑历史
      this.editHisObj['historyId'] = his.historyId;
      this.editHisObj['recordId'] = this.$route.query.recordId;
      this.dialogVisible = true;
    }
  },
  beforeMount() {
    this.getEmployeeDetail();
    this.getHistoryList();
  },
  mounted() {
    const that = this;
    let type = that.$route.query.type;
    if (!!type && type == 'unemployee') {
      that.navpath = that.editNavpath;
    }
    that.$nextTick(function() {
      document.querySelector('.contact-wrap__body').style.overflow = 'auto';
      document.querySelector('.contact-wrap__body').removeAttribute('style');
      document.getElementsByClassName('contact-wrap__right')[0].removeAttribute('style');
    });
  },
  beforeDestroy() {
    document.querySelector('.contact-wrap__body').style.overflow = 'hidden';
    let divHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 + 'px';
    document.querySelector('.contact-wrap__body').setAttribute('style', 'height:' + divHeight);
    document.getElementsByClassName('contact-wrap__right')[0].setAttribute('style', 'height:' + divHeight);
  }
};
</script>
<style lang="scss">
.clerk-detail-container {
  padding: 30px;

  .employee-detail-cell {
    .head-info {
      margin: 20px 0 70px;
      text-align: center;
      font-size: 14px;
      color: #606266;

      .head-cell {
        margin-bottom: 15px;

        .head-img {
          width: 70px;
          height: 70px;
          background: rgba(64, 158, 255, 1);
          border-radius: 6px;
        }

        .head-img-null {
          display: block;
          margin: 0 auto;
          width: 70px;
          height: 70px;
          line-height: 70px;
          background: rgba(64, 158, 255, 1);
          border-radius: 6px;

          i {
            font-size: 20px;
            color: #e5f3ff;
          }
        }

        &.name {
          font-size: 20px;
          font-weight: 500;
          color: rgba(48, 49, 51, 1);

          span {
            display: inline-block;
            /*width: 32px;*/
            height: 16px;
            border: 1px solid rgba(74, 168, 255, 1);
            border-radius: 3px;
            text-align: center;
            line-height: 16px;
            font-size: 10px;
            color: #4aa8ff;
            margin-left: 8px;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .mile-stone-container {
    .m-s-title {
      height: 0;
      border-top: 1px solid #e4e7ed;
      text-align: center;
      position: relative;

      span {
        position: absolute;
        display: inline-block;
        height: 20px;
        line-height: 20px;
        top: -10px;
        width: 80px;
        left: 50%;
        margin-left: -40px;
        background: #fff;
      }
    }

    .mile-stone {
      width: 100%;
      margin-top: 50px;
      padding: 30px 40px;
      box-sizing: border-box;
      background: rgba(245, 247, 250, 1);
      border-radius: 2px;

      .stone-group {
        display: flex;
        font-size: 14px;
        font-family: Helvetica;
        font-weight: 400;
        color: rgba(107, 109, 113, 1);
        margin-bottom: 30px;
        position: relative;

        .column-hurdle {
          width: 3px;
          height: 160px;
          top: 30px;
          background: #4aa8ff;
          position: absolute;
          right: 0;
        }

        .stone {
          width: 25%;

          p {
            margin-bottom: 14px;
            padding-left: 30px;

            &.position {
              color: #37383a;
              font-size: 16px;
              font-weight: bolder;
            }
          }

          .hurdle-box {
            display: flex;
            margin-bottom: 14px;

            .radio {
              display: inline-block;
              width: 8px;
              height: 8px;
              background: rgba(74, 168, 255, 1);
              border-radius: 50%;
              vertical-align: middle;
              margin: -2px 10px 0;
            }

            .hurdle {
              flex: 1;
              height: 3px;
              background: rgba(74, 168, 255, 1);
            }
          }

          &.no-radio {
            .hurdle-box {
              .radio {
                display: none;
              }
            }
          }
        }

        &.column-reverse {
          flex-direction: row-reverse;

          .column-hurdle {
            width: 3px;
            height: 162px;
            top: 30px;
            background: #4aa8ff;
            position: absolute;
            left: 0;
          }
        }
      }
    }
  }
}
</style>
