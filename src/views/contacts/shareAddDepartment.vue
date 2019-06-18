<template>
  <div class="add-department-container">
    <div class="setting-cell depart-info">
      <p class="title">部门信息</p>
      <el-form class="department-info-form" label-position="right" :rules="rules" :model="departInfo" ref="departForm" label-width="120px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="departInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="部门排序调整" prop="parentId">
          <el-input :disabled="disabled" v-model="departInfo.parentName" @focus="callGroupSelector" suffix-icon="el-icon-arrow-down"> </el-input>
        </el-form-item>
      </el-form>
    </div>
    <vue-select-employee :defaultSelection="defaultSelection" :treeSet="treeSet" :treeData="treeData" @handleSelectedList="handleSelectedList"> </vue-select-employee>
  </div>
</template>
<script>
import permissionSetting from 'components/contacts/permissionSet/permissionSetting';
import vueSelectEmployee from 'components/common/vueSelectEmployee';
import { getRequest } from '@/api/api';
export default {
  name: 'addDepartment',
  components: {
    permissionSetting,
    vueSelectEmployee
  },
  data() {
    return {
      departInfo: {
        name: '',
        parentName: '',
        parentId: ''
      },
      testList: [],
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true // 是否单选
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择父级部门', trigger: 'change' }]
      },
      treeData: {},
      disabled: true,
      defaultSelection: [],
      defaultParent: [],
      selectorType: 'parent',
      changed: 'parent',
      onlyPerson: false,
      onlyGroup: []
    };
  },
  methods: {
    /**
     * 获取部门信息
     */
    getDepartInfo() {
      let that = this;
      let params = {
        groupId: that.$route.query.departmentId
      };
      getRequest('/haoban-manage-web/dept/findDeptById', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.departInfo.name = res.data.result.name;
            that.departInfo.parentId = res.data.result.parentId;
            let chain = res.data.result.chainName.split('/');
            let len = chain.length;
            if (len == 1) {
              that.departInfo.parentName = '';
            } else {
              that.departInfo.parentName = chain[len - 2];
            }
            that.defaultParent = [
              {
                label: that.departInfo.parentName,
                id: res.data.result.parentId,
                groupId: res.data.result.parentId
              }
            ];
          } else {
            that.$message.error({
              duration: 1000,
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.$message.error({
            duration: 1000,
            message: e.message
          });
        });
    },
    /**
     * 唤起部门选择器
     */
    callGroupSelector() {
      this.selectorType = 'parent';
      this.defaultSelection = this.defaultParent;
      this.onlyPerson = false;
      this.onlyGroup = [];
      this.changed = 'parent';
      this.treeSet = {
        dialogVisible: true,
        isSingle: true,
        isSelectPerson: false
      };
    },
    callPerSelector(type, list) {
      this.selectorType = type;
      this.defaultSelection = list;
      this.onlyPerson = true;
      this.onlyGroup = [this.$route.query.departmentId];
      this.changed = type;
      this.treeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: true
      };
    },
    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      this.departInfo.parentId = group ? group.id : '';
      this.departInfo.parentName = group ? group.label : '';
    },
    saveEdit(goAhead = '') {
      this.$refs.departForm.validate(valid => {
        if (!valid) {
          return false;
        }
        let that = this;
        let params = {
          parentId: that.departInfo.parentId,
          name: that.departInfo.name
        };
        getRequest('/haoban-manage-web/dept/insert', params)
          .then(res => {
            if (res.data.errorCode == 1) {
              that.$message.success({
                duration: 1000,
                message: '操作成功！'
              });
              if (goAhead == 'continue') {
                that.departInfo = {
                  name: '',
                  parentName: '',
                  parentId: ''
                };
                that.disabled = true;
                that.getGroupData();
              } else {
                window.history.go(-1);
              }
            } else {
              that.$message.error({
                duration: 1000,
                message: res.data.message
              });
            }
          })
          .catch(e => {
            that.$message.error({
              duration: 1000,
              message: e.message
            });
          });
      });
    },
    getGroupData() {
      let that = this;
      let params = {
        isStoreGroup: 0
      };
      /* eslint-disable */
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
        .catch(e => {

        });
    },
    cancel() {
      /* eslint-disable */
      this.$confirm(' 是否确认取消，取消后当前页面信息将丢失 ？', '提示', {
        type: 'warning'
      })
        .then(() => {
          window.history.go(-1);
        })
        .catch(e => {

        });
    }
  },
  beforeMount() {
    this.getGroupData();
    if (!this.isAddNew) {
      this.getDepartInfo();
    }
  },
  computed: {
    isAddNew() {
      return !!(this.$route.query.addnew == 1);
    }
  }
};
</script>
<style lang="scss">
.add-department-container {
  .setting-cell {
    background: #fff;
    margin-bottom: 24px;

    .title {
      height: 55px;
      line-height: 55px;
      border-bottom: 1px solid #e4e7ed;
      text-indent: 32px;
      font-size: 16px;
      font-weight: 500;
      color: #303133;
    }

    .department-info-form {
      padding: 24px 32px;

      .el-input {
        width: 380px;
      }
    }

    .btn-area {
      width: 100%;
      text-align: center;
      padding: 12px;
    }
  }
}
</style>
