<template>
  <div class="common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="employee-detail" :style="{ height: $store.state.bgHeight }">
          <employee-info :isNew="isNew" ref="emmployInfo"></employee-info>
          <div class="btn-boxs" v-if="!$route.query.readOnly">
            <el-button @click="save" type="primary">保 存</el-button>
            <el-button type="primary" @click="save(1)" v-if="isNew">保存并继续添加</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import employeeInfo from 'components/contacts/employeeInfo';
import { getRequest } from '@/api/api';
export default {
  name: 'employeeDetail',
  components: {
    navCrumb,
    employeeInfo
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
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '行政架构',
          path: '/administrativeFrame'
        },
        {
          name: '添加员工',
          path: ''
        }
      ],
      navpathEdit: [
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
          path: '/administrativeFrame'
        },
        {
          name: '编辑员工',
          path: ''
        }
      ],
      managerMode: false
    };
  },
  methods: {
    save(contin) {
      let info = this.$refs.emmployInfo.info;
      if (this.isNew) {
        this.addEmployee(info, contin);
      } else {
        this.saveEmployeeInfo(info);
      }
    },
    /**
     * 新增员工
     */
    addEmployee(info, contin) {
      let that = this;
      let params = {
        name: info.name,
        isClerk: 0,
        phoneNumber: info.phoneNumber,
        positionName: info.positionName,
        departmentId: info.departmentId,
        managerMode: info.managerMode * 1
      };
      getRequest('/haoban-manage-web/emp/add', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: '操作成功'
            });
            if (contin == 1) {
              that.$refs.emmployInfo.info = {
                name: '',
                phoneNumber: '',
                departmentId: '',
                departmentName: '',
                managerMode: false
              };
            } else {
              window.history.go(-1);
            }
          } else {
            that.$message.error({
              message: res.data.message
            });
          }
        })
        /* eslint-disable */
        .catch(e => {

        });
    },
    saveEmployeeInfo(info) {
      let that = this;
      let params = {
        name: info.name,
        phoneNumber: info.phoneNumber,
        positionName: info.positionName,
        departmentId: info.departmentId,
        employeeClerkId: that.$route.query.employeeClerkId,
        managerMode: info.managerMode * 1
      };
      getRequest('/haoban-manage-web/emp/update', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: '操作成功'
            });
            window.history.go(-1);
          } else {
            that.$message.error({
              message: res.data.message
            });
          }
        })
        .catch(error => {
          that.$message.error({
            message: error.message
          });
        });
    },
    cancel() {
      this.$confirm(' 是否确认取消，取消后当前页面信息将丢失 ？', '提示', {
        type: 'warning'
      })
        .then(() => {
          window.history.go(-1);
        })
        /* eslint-disable */
        .catch(e => {
        });
    }
  },
  computed: {
    isNew() {
      return !!this.$route.query.addnew == 1;
    }
  },
  mounted() {
    if (!this.$route.query.addnew) {
      this.navpath = this.navpathEdit
    }
  }
};
</script>
<style lang="scss">
.employee-detail {
  overflow: auto;
  height: 460px;

  .btn-boxs {
    width: calc(100% - 200px);
    padding: 12px 0;
    background: #fff;
    position: fixed;
    bottom: 0;
    right: 0;
    text-align: center;
  }
}
</style>
