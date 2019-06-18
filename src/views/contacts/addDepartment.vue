<template>
  <div class="common-set-wrap" :style="{ height: windowH }">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="add-department-container">
          <div class="setting-cell depart-info" v-if="$route.query.type == 'group'">
            <p class="title">部门信息</p>
            <el-form class="department-info-form" label-position="right" :rules="rules" :model="departInfo" ref="departForm" label-width="120px">
              <el-form-item label="部门名称" prop="name">
                <el-input v-model="departInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="部门负责人" v-if="!isAddNew">
                <ul class="particular-list" style="margin-bottom: 0;width: 380px;">
                  <template v-for="(li, index) in departInfo.managerClerkList">
                    <li class="item person-item" style="margin-top: 0;" :key="index + '_' + li.id">
                      <img :src="li.headPic" v-if="!!li.headPic" />
                      <div class="replace-head-img" v-else>
                        <i class="iconfont icon-yewuduanmorentouxian"></i>
                      </div>
                      <p class="name">{{ li.label }}</p>
                      <i class="el-icon-circle-close" @click="delCurrentManager(li)"></i>
                    </li>
                  </template>
                  <li class="item J_add-btn" style="margin-top: 0;" @click="callPerSelector('selectManager', departInfo.managerClerkList)">
                    <i class="el-icon-plus"></i>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="部门排序调整" prop="chainName">
                <el-input :disabled="disabled" v-model="departInfo.chainName" @focus="callGroupSelector" suffix-icon="el-icon-arrow-down"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="setting-cell depart-info" v-else>
            <p class="title">企业信息</p>
            <el-form class="department-info-form" label-position="right" :rules="rules" :model="departInfo" ref="departForm" label-width="120px">
              <el-form-item label="企业名称" prop="name">
                <el-input v-model="departInfo.name" disabled></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="setting-cell m-b-48" v-if="!isAddNew">
            <p class="title">权限设置</p>
            <permission-setting v-if="!disabled" :departInfo="departInfo" :selfButList="selfButList" :selfSpecialList="selfSpecialList" :butList="butList" :specialList="specialList" :visibleSpecialLsit="testList" :onlySelfApartList="testList" :treeData="treeData" @callPerSelector="callPerSelector"> </permission-setting>
          </div>
          <div class="setting-cell fixed-footer">
            <div class="btn-area">
              <el-button type="primary" @click="saveEdit">保 存</el-button>
              <el-button type="primary" v-if="isAddNew" @click="saveEdit('continue')">保存并继续添加</el-button>
              <el-button type="danger" v-else-if="$route.query.type == 'group'" @click="delGroup">删 除</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </div>
          <vue-select-employee :changed="changed" :onlyPerson="onlyPerson" :onlyGroup="onlyGroup" :defaultSelection="defaultSelection" :treeSet="treeSet" :treeData="treeData" @handleSelectedList="handleSelectedList"> </vue-select-employee>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import permissionSetting from 'components/contacts/permissionSet/permissionSetting';
import vueSelectEmployee from 'components/common/vueSelectEmployee';
import { getRequest } from '@/api/api';
export default {
  name: 'addDepartment',
  components: {
    navCrumb,
    permissionSetting,
    vueSelectEmployee
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
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '行政架构',
          path: '/administrativeFrame'
        },
        {
          name: '添加子分组',
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
        }
      ],
      departInfo: {
        parentName: '',
        chainName: '',
        managerClerkList: []
      },
      testList: [],
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true // 是否单选
      },
      rules: {
        name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }, { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }],
        chainName: [{ required: true, message: '请选择父级部门', trigger: 'blur' }]
      },
      treeData: {},
      disabled: true,
      defaultSelection: [],
      defaultParent: [],
      selectorType: 'parent',
      changed: 'parent',
      onlyPerson: false,
      onlyGroup: [],
      butList: [], // 仅可见本部门，个别员工除外
      specialList: [], // 指定部门/人员可见
      selfButList: [],
      selfSpecialList: []
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
          getRequest('/haoban-manage-web/dept/del', {
            groupId: that.$route.query.departmentId
          })
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
        .catch(e => {});
    },
    /**
     * 删除当前部门负责人
     */
    delCurrentManager(per) {
      let list = this.departInfo.managerClerkList;
      list.splice(list.indexOf(per), 1);
    },
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
            this.formatGroupInfo(res.data.result);
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
     *
     * 处理部门信息
     */
    formatGroupInfo(obj) {
      let that = this;
      that.departInfo.parentName = obj.chainName;
      that.defaultParent = [
        {
          label: that.departInfo.parentName,
          id: obj.parentId,
          groupId: obj.parentId
        }
      ];
      obj.managerClerkList = !!obj.managerClerkList ? obj.managerClerkList : [];
      obj.managerClerkList.forEach(manager => {
        manager.label = manager.name;
        manager.id = manager.employeeClerkId;
      });
      obj.noPreClerkList = obj.noPreClerkList || []; // 不设置该权限员工id集合
      obj.allowClerkList = obj.allowClerkList || []; // 允许可见用户Id
      obj.allowDeptList = obj.allowDeptList || []; // 允许可见部门Id
      obj.noPreClerkList.forEach(clerk => {
        clerk.label = clerk.name;
        clerk.id = clerk.employeeClerkId;
      });
      obj.allowClerkList.forEach(clerk => {
        clerk.label = clerk.name;
        clerk.id = clerk.employeeClerkId;
      });
      obj.allowDeptList.forEach(group => {
        group.label = group.name;
        group.id = group.groupId;
      });

      // 本部门员工仅可见本部门员工
      if (obj.type == 1) {
        that.butList = obj.noPreClerkList;
        that.specialList = obj.allowDeptList.concat(obj.allowClerkList);
        that.selfButList = [];
        that.selfSpecialList = [];
      } else if (obj.type == 2) {
        // 本部门员工仅可见自己
        that.butList = [];
        that.specialList = [];
        that.selfButList = obj.noPreClerkList;
        that.selfSpecialList = obj.allowDeptList.concat(obj.allowClerkList);
      }
      that.departInfo = obj;
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
    /**
     * permissionSetting 页 返回数据
     */
    callPerSelector(type, list) {
      if (type == 'but' || type == 'selectManager') {
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
      } else {
        this.selectorType = type;
        this.defaultSelection = list;
        this.onlyPerson = false;
        this.onlyGroup = [];
        this.changed = type;
        this.treeSet = {
          dialogVisible: true,
          isSingle: false,
          isSelectPerson: true
        };
      }
    },
    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      let that = this;
      if (that.changed == 'parent') {
        that.departInfo.parentId = group ? group.id : '';
        that.departInfo.parentName = group ? group.label : '';
        that.departInfo.chainName = group ? group.chainName : '';
        if (that.departInfo.chainName) {
          that.$refs.departForm.clearValidate('chainName');
        }
      } else if (that.changed == 'but') {
        that.departInfo.type == 2 ? (that.selfButList = group) : (that.butList = group);
      } else if (that.changed == 'special') {
        that.departInfo.type == 2 ? (that.selfSpecialList = group) : (that.specialList = group);
      } else if (that.changed == 'selectManager') {
        that.departInfo.managerClerkList = group;
      }
    },
    // 保存编辑
    saveEdit(goAhead = '') {
      let that = this;
      this.$refs.departForm.validate(valid => {
        if (!valid) {
          return false;
        }
        let type = that.departInfo.type;
        let idArr = [];
        if (type != '') {
          that[type == 1 ? 'butList' : 'selfButList'].forEach(per => {
            idArr.push(per.id);
          });
        }
        let allowCherkIds = [];
        let allowDepartIds = [];
        that.specialList.forEach(per => {
          if (per.employeeClerkId) {
            allowCherkIds.push(per.id);
          } else {
            allowDepartIds.push(per.id);
          }
        });
        that.selfSpecialList.forEach(per => {
          if (per.employeeClerkId) {
            allowCherkIds.push(per.id);
          } else {
            allowDepartIds.push(per.id);
          }
        });
        let ids = idArr.join(',');
        let managerClerkIds = [];
        that.departInfo.managerClerkList.forEach(manager => {
          managerClerkIds.push(manager.id);
        });
        managerClerkIds = managerClerkIds.join(',');
        let params = {
          type,
          managerClerkIds,
          noPreCherkIds: ids,
          allowCherkIds: allowCherkIds.join(','),
          allowDepartIds: allowDepartIds.join(','),
          parentId: that.departInfo.parentId,
          name: that.departInfo.name
        };
        if (!that.isAddNew) {
          params.groupId = that.$route.query.departmentId; // 如果是编辑部门，还需传入部门id
          params.isStoreGroup = 0;
        }
        let url = that.isAddNew ? '/haoban-manage-web/dept/insert' : '/haoban-manage-web/dept/update';
        getRequest(url, params)
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
  beforeMount() {
    let that = this;
    that.getGroupData();
    if (!that.isAddNew) {
      that.getDepartInfo();
      that.navpathEdit.push({
        name: `编辑${that.$route.query.type == 'company'? '企业信息': '部门信息'}`,
        path: ''
      })
      that.navpath =  that.navpathEdit;
    }
    that.$nextTick(function() {
      document.querySelector('.contact-wrap__body').style.overflow = 'hidden';
    });
  },
  beforeDestroy() {
    document.querySelector('.contact-wrap__body').style.overflow = 'auto';
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

    &.m-b-48 {
      margin-bottom: 48px;
    }
    &.fixed-footer {
      position: fixed;
      left: 200px;
      bottom: 0;
      right: 0;
      margin-bottom: 0;
      background: #fff;
      z-index: 2;
    }

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

    .particular-list {
      display: flex;
      flex-wrap: wrap;

      /*margin-bottom: 30px;*/
      .item {
        position: relative;
        margin-right: 24px;
        margin-top: 30px;
        width: 40px;
        display: flex;
        flex-direction: column;
        margin-bottom: 30px;

        .el-icon-circle-close {
          position: absolute;
          font-size: 16px;
          color: #808995;
          right: -8px;
          top: -8px;
          cursor: pointer;
        }

        img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
        }

        .replace-head-img {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          line-height: 40px;
          text-align: center;
          color: #fff;
          background: rgba(64, 158, 255, 1);
        }

        .name {
          font-size: 12px;
          text-align: center;
          height: 12px;
          line-height: 12px;
          margin-top: 10px;
          overflow: hidden;
        }

        &.group-item {
          padding: 0 10px;
          width: auto;
          height: 30px;
          line-height: 32px;
          background: rgba(236, 245, 255, 1);
          border: 1px solid rgba(217, 236, 255, 1);
          border-radius: 4px;
          font-size: 12px;
          color: rgba(64, 158, 255, 1);
          margin-top: 34px;
        }

        &.J_add-btn {
          height: 40px;
          background: rgba(251, 253, 255, 1);
          border: 1px dashed rgba(192, 204, 218, 1);
          border-radius: 50%;
          text-align: center;
          line-height: 40px;
          font-size: 16px;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-block;
          &:hover {
            border-color: #409eff;
            i {
              color: #409eff;
            }
          }
        }
      }
    }
  }


}
</style>
