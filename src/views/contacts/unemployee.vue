<template>
  <div class="common-set-wrap unemployee-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="e-record-container">
          <employee-list :isUnEmployee="true"></employee-list>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
// import { getRequest, postRequest, postJsonRequest } from '@/api/api';
import employeeList from 'components/employeeRecord/employeeList';
export default {
  name: 'employeeRecord',
  components: {
    navCrumb,
    employeeList
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
          name: '离职员工',
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
      countObj: {}
    };
  },
  beforeMount() {
    // this.getEmployeeCount();
  }
};
</script>
<style lang="scss">
.unemployee-wrap {
  height: 100%;
  .right-content {
    min-height: calc(100% - 240px);
  }
}
.top-area {
  background: #fff;
  padding: 10px 32px;

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
