<template>
  <div class="common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="add-department-container">
          <div class="setting-cell">
            <el-form class="department-info-form" label-position="right" :rules="rules" :model="departInfo" ref="departForm" label-width="120px">
              <el-form-item :label="$route.query.type == 'brand' ? '品牌名称' : '部门名称'" prop="name">
                <el-input v-model="departInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="部门排序调整" prop="parentId" v-if="$route.query.type == 'group' || isAddNew">
                <el-input :disabled="disabled" v-model="departInfo.parentName" suffix-icon="el-icon-arrow-down" @focus="callGroupSelector"> </el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="setting-cell">
            <div class="btn-area">
              <el-button type="primary" @click="saveEdit">保存</el-button>
              <el-button type="primary" v-if="isAddNew" @click="saveEdit('continue')">保存并继续添加</el-button>
              <el-button type="danger" v-else @click="delGroup">删除</el-button>
              <el-button @click="cancel">取消</el-button>
            </div>
          </div>
          <vue-select-store ref="storeSelector" :defaultList="defaultList" :treeSet="treeSet" selectType="group" :forbidenList="forbidenList" @handleSelectedList="handleSelectedList"> </vue-select-store>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import vueSelectStore from 'components/common/vueSelectStore';
import { getRequest } from '@/api/api';
export default {
  name: 'store-view-group-info',
  components: {
    navCrumb,
    vueSelectStore
  },
  data() {
    return {
      departInfo: {
        name: '',
        parentName: '',
        parentId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择父级部门', trigger: 'change' }]
      },
      disabled: true,
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true, // 是否单选
        groupId: ''
      },
      defaultList: []
    };
  },
  methods: {
    /**
     * 删除当前组
     */
    delGroup() {
      let that = this;
      that
        .$confirm(' 是否确认删除分组 ？', '提示', {
          type: 'warning'
        })
        .then(() => {
          getRequest('/haoban-manage-web/dept/del', { groupId: that.$route.query.groupId })
            .then(res => {
              if (res.data.errorCode == 1) {
                that.$message.success({
                  message: res.data.message
                });
                window.history.go(-1);
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
        /* eslint-disable */
        .catch(e => {
        });
    },
    handleSelectedList(list) {
      // 处理选取的分组
      let group = list[0];
      this.departInfo.parentId = group ? group.id : '';
      this.departInfo.parentName = group ? group.chainName : '';
    },
    callGroupSelector() {
      this.treeSet.dialogVisible = true;
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
        let url = '';
        if (that.isAddNew) {
          // 根据是编辑还是新增选择对应借口
          url = '/haoban-manage-web/dept/insert';
        } else {
          url = '/haoban-manage-web/dept/update';
          params.groupId = that.$route.query.groupId;
          params.isStoreGroup = 1;
        }
        getRequest(url, params)
          .then(res => {
            if (res.data.errorCode == 1) {
              that.$message.success({
                duration: 1000,
                message: '操作成功！'
              });
              if (goAhead == 'continue') {
                // 保存并继续添加
                that.departInfo = {
                  name: '',
                  parentName: '',
                  parentId: ' '
                };
                // that.disabled = true;
                // that.getGroupData();
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
    },
    getGroupInfo() {
      // 获取门店信息
      let that = this;
      let params = {
        groupId: that.$route.query.groupId
      };
      getRequest('/haoban-manage-web/dept/findDeptById', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.departInfo = {
              name: res.data.result.name,
              parentName: res.data.result.chainName,
              parentId: res.data.result.parentId
            };
            that.defaultList = [
              {
                id: res.data.result.parentId,
                label: res.data.result.parentGroupName
              }
            ];
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
  computed: {
    isAddNew() {
      return !!(this.$route.query.addnew == 1);
    },
    forbidenList() {
      if (this.isAddNew) {
        return [];
      } else {
        return [this.$route.query.groupId];
      }
    },
    navpath() {
      let type = this.$route.query.type;
      return [
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
          path: '/storeFrame'
        },
        {
          name: type == 'group' ? '编辑分组' : this.isAddNew ? '添加子分组' : '品牌编辑',
          path: ''
        }
      ];
    }
  },
  beforeMount() {
    this.treeSet.groupId = this.$route.query.firstLevelId;
    if (!this.isAddNew) {
      // this.forbidenList = [this.$route.query.groupId];
      this.getGroupInfo();
    }
  },
  mounted() {
    this.disabled = false;
  },
  watch: {
    treeData() {
      this.disabled = false;
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
