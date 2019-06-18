<template>
  <div class="common-set-wrap employee-record-wrap">
    <nav-crumb :navpath="navpath" :slotFlag="true">
      <template>
        <div class="top-area">
          <div class="top-title">
            <span class="title-span">在职员工</span>
            <a href="#/recordIo?importCode=record">
              <el-button type="primary">导入员工档案<i class="el-icon-upload el-icon--right"></i></el-button>
            </a>
          </div>
          <div class="e-type-num-title">
            <div class="type-cell" v-for="(count, key) in countObj" :key="key" :class="key == 'onWorkCout' || key == 'noTypeWorkCount' ? 'with-bdr' : ''">
              <p class="type-name">{{ typeObj[key] }}</p>
              <p class="num">{{ count }}</p>
            </div>
          </div>
        </div>
      </template>
    </nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="e-record-container">
          <template v-if="!showExportSet">
            <employee-list @showExportSetFn="showExportSetFn"></employee-list>
          </template>
          <template v-else>
            <export-set @cancelCho="cancelCho" :otherSet="otherSet"></export-set>
          </template>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import { getRequest } from '@/api/api';
import exportSet from 'components/employeeRecord/exportSet';
import employeeList from 'components/employeeRecord/employeeList';
export default {
  name: 'employeeRecord',
  components: {
    navCrumb,
    employeeList,
    exportSet
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
          name: '员工档案',
          path: '/fileSet'
        },
        {
          name: '在职员工',
          path: ''
        }
      ],
      typeObj: {
        onWorkCout: '在职员工',
        allWorkCount: '全职',
        partTimeWorkCount: '兼职',
        outWorkCount: '外包',
        practiceWorkCount: '实习',
        noTypeWorkCount: '无类型',
        regularCount: '正式',
        onTrialCount: '试用',
        noStatusCount: '无状态'
      },
      otherSet: {},
      countObj: {},
      showExportSet: false
    };
  },
  methods: {
    cancelCho() {
      this.showExportSet = false;
    },
    showExportSetFn() {
      this.showExportSet = true;
    },
    // 获取员工数量信息
    getEmployeeCount() {
      let that = this;
      getRequest('/haoban-manage-web/record/employee-count-detail', {})
        .then(res => {
          if (res.data.errorCode == 1) {
            that.countObj = res.data.result;
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
    }
  },
  beforeMount() {
    this.getEmployeeCount();
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
.employee-record-wrap {
  overflow-y: auto;
}
.top-area {
  background: #fff;
  padding: 10px 0;

  .top-title {
    display: flex;
    line-height: 32px;
    font-size: 20px;
    font-weight: bolder;
    color: rgba(48, 49, 51, 1);

    .title-span {
      flex: 1;
    }
  }

  .e-type-num-title {
    display: flex;
    padding: 12px 0;
    /*margin-top: 20px;*/
    color: #606266;
    font-size: 14px;

    .type-cell {
      box-sizing: border-box;
      height: 70px;
      flex: 1;
      margin-right: 20px;
      padding: 10px 0;

      &.with-bdr {
        border-right: 1px solid #dcdfe6;
        padding-right: 50px;
      }

      .num {
        font-size: 24px;
        font-weight: 400;
        color: rgba(48, 49, 51, 1);
        margin-top: 20px;
      }
    }
  }
}
</style>
