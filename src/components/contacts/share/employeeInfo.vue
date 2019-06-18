<template>
  <div class="employee-info">
    <div class="info-cell">
      <p class="title">员工信息</p>
      <el-form class="employee-info-form" :model="info" label-width="70px">
        <el-form-item label="姓名:" prop="name">
          <p>{{ info.name }}</p>
        </el-form-item>
        <el-form-item label="手机号:" prop="phoneNumber">
          <p>{{ info.phoneNumber }}</p>
        </el-form-item>
        <el-form-item label="部门:" prop="departmentId">
          <p>{{ info.departmentName }}</p>
        </el-form-item>
        <el-form-item label="职位:" prop="positionName">
          <p>{{ info.positionName }}</p>
        </el-form-item>
      </el-form>
    </div>
    <vue-select-employee ref="parentSelector" :treeSet="treeSet" :treeData="treeData" @handleSelectedList="handleSelectedList"> </vue-select-employee>
  </div>
</template>
<script>
import { getRequest } from '@/api/api';
import vueSelectEmployee from 'components/common/vueSelectEmployee';
export default {
  name: 'employeeInfo',
  components: {
    vueSelectEmployee
  },
  props: {
    perId: {
      type: [String, Number],
      default: ''
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'));
      } else {
        let reg = /^1[34578]\d{9}$/;
        if (!reg.test(value)) {
          return callback(new Error('手机号格式不正确'));
        }
      }
    };
    return {
      info: {
        name: '',
        phoneNumber: '',
        departmentId: '',
        departmentName: '',
        managerMode: false
      },
      treeData: {},
      disabled: true,
      employeeInfo: {
        name: '',
        phoneNumber: '',
        departmentName: ''
      },
      rules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }, { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
        phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }]
      },
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true // 是否单选
      }
    };
  },
  methods: {
    // 获取分组信息
    getGroupData() {
      let that = this;
      let params = {
        isStoreGroup: 0
      };
      getRequest('/haoban-manage-web/dept/deptListForCompany', params)
        .then(res => {
          let treeData = [];
          let personData = [];
          if (res.data.errorCode == 1) {
            treeData = res.data.result.departmentList || [];
            personData = res.data.result.searchList || [];
          }
          // that.formatGroupData(treeData, personData);
          that.treeData = {
            treeData,
            personData
          };
          that.disabled = false;
        })
        /* eslint-disable */
        .catch(e => {
        });
    },
    callGroupSelector() {
      this.treeSet.dialogVisible = true;
    },
    handleSelectedList(obj) {
      this.info.departmentId = obj.id;
      this.info.departmentName = obj.label;
    },
    getEmployInfo() {
      let that = this;
      let params = {
        id: !!that.$route.query.employeeClerkId ? that.$route.query.employeeClerkId : that.perId
      };
      getRequest('/haoban-manage-web/emp/findOne', params)
        .then(res => {
          that.info = res.data.result;
          that.info.managerMode = !!res.data.result.managerMode;
        })
        /* eslint-disable */
        .catch(e => {
        });
    }
  },
  beforeMount() {
    this.getGroupData();
    if (!this.isNew) {
      this.getEmployInfo();
    }
  },
  watch: {
    perId(id, ids) {
      this.getEmployInfo();
    }
  }
};
</script>
<style lang="scss">
.employee-info {
  flex: 1;

  .info-cell {
    margin-bottom: 24px;
    background: #fff;
    padding-bottom: 24px;

    > .title {
      line-height: 55px;
      text-indent: 32px;
      border-bottom: 1px solid #e4e7ed;
    }

    .tip {
      color: #909399;
      text-indent: 32px;
      font-size: 14px;
      margin-top: 24px;
    }

    .set-manager-mode {
      text-indent: 52px;
      color: #606266;
      margin-top: 35px;
    }

    .employee-info-form {
      padding: 24px 60px 0;

      .el-input {
        width: 380px;
      }
    }
  }
}
</style>
