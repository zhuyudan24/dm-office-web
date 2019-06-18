<template>
  <div class="common-set-wrap admin-frame">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <!-- prettier-ignore -->
        <div
          class="administrative-estrutura-container common-frame-container"
          :style="{ minHeight: $store.state.bgHeight }">
          <search-menu
            :treeData="menuData"
            :searchResult="searchResult"
            @handleSearchKey="handleSearchKey"
            @handleTreeSelection="handleTreeSelection"
            @handleEmployeeSelection="handleEmployeeSelection"
          >
          </search-menu>
          <employee-info v-if="showEmployee == 'employee'" :perId="selectedEmployee.employeeClerkId">
          </employee-info>
          <div class="af-right-container common-right-container" v-loading="loading" v-else>
            <div class="af-right-header common-right-header">
              <span class="title-span">{{ groupInfo.groupName }}（{{ total }}人）</span>
              <span class="id-span">部门ID： {{ groupInfo.departmentId }}</span>
              <span class="handle-area">
                <el-button @click="addSon" class="no-bdr-btn" :disabled="groupInfo.hasPression != 1">
                  添加子分组 </el-button
                ><span class="hurdle"> </span
                ><el-button
                  @click="goToEdit(groupInfo.level)"
                  :href="'#/addGroup?groupId=' + groupInfo.departmentId"
                  :disabled="groupInfo.hasPression != 1"
                  class="no-bdr-btn"
                  >编辑</el-button
                >
              </span>
            </div>
            <div class="af-right-button-box common-right-button-box">
              <a :href="'#/employee?addnew=1&departmentId=' + groupInfo.departmentId">
                <el-button type="primary">添加成员</el-button>
              </a>
              <a
                :href="
                  '#/employeeIo?importCode=employee&departmentId=' +
                    groupInfo.departmentId +
                    '&showChildMember=' +
                    showChildMember * 1
                "
                ><el-button>批量导入/导出</el-button></a
              >
              <el-button type="danger" @click="delMembers" :disabled="disabledDel">批量删除</el-button>
              <span class="J_show-children inline-block el-button">
                <el-checkbox class="m-r-10" v-model="showChildMember" @change="setChildMemberShow"
                  >显示子成员</el-checkbox
                >
              </span>
            </div>
            <employee-list :employeeList="employeeList" @selectMember="selectMember"> </employee-list>
            <div class="pagination" v-if="!!employeeList.length">
              <el-pagination
                background
                :page-sizes="[20, 40, 60, 80]"
                :page-size="pageSize"
                :current-page="currentPage"
                layout="total, sizes, prev, pager, next"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              >
              </el-pagination>
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
import searchMenu from 'components/contacts/searchMenu';
import employeeInfo from 'components/contacts/employeeInfo';
import employeeList from 'components/contacts/employeeList';
import { getRequest } from '@/api/api';
export default {
  name: 'administrativeEstrutura',
  components: {
    navCrumb,
    searchMenu,
    employeeInfo,
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
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '行政架构',
          path: ''
        }
      ],
      showChildMember: false,
      setDisabledDel: false,
      menuData: [],
      pageSize: 20,
      currentPage: 1,
      selectedList: [],
      total: 0,
      loading: true,
      groupInfo: {
        groupName: '',
        departmentId: '',
        hasPression: ''
      },
      employeeList: [],
      searchResult: {},
      showEmployee: false,
      selectedEmployee: {}
    };
  },
  /* eslint-disable */
  created() {},
  beforeMount() {
    this.getGroupData();
    this.getEmployee();
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.getEmployee();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEmployee();
    },
    // 跳转添加子部门页面
    addSon() {
      location.href = '#/addDepartment?type=group&addnew=1&departmentId=' + this.groupInfo.departmentId;
    },
    // 跳转编辑部门页面
    goToEdit(level) {
      let type = level == 0 ? 'company' : 'group';
      location.href = '#/addDepartment?departmentId=' + this.groupInfo.departmentId + '&type=' + type;
    },
    /**
     * 树形菜单搜索
     */
    handleSearchKey(keyWord) {
      let params = {
        keyWord
      };
      getRequest('/haoban-manage-web/emp/searchpage', params)
        .then(res => {
          this.searchResult = res.data.result;
        })
        .catch(e => {});
    },

    /**
     * 树形菜单选择项处理
     */
    handleTreeSelection(obj, node, showEmployee) {
      this.groupInfo.departmentId = obj.groupId;
      this.groupInfo.groupName = obj.name;
      this.showEmployee = showEmployee;
      this.groupInfo.hasPression = obj.hasPression;
      this.groupInfo.level = obj.level;
      this.loading = true;
      this.getEmployee();
    },
    /**
     * 树形搜索结果选人处理
     */
    handleEmployeeSelection(employee, showEmployee) {
      this.selectedEmployee = employee;
      this.showEmployee = showEmployee;
    },
    /**
     * table选择员工
     */
    selectMember(selection) {
      this.selectedList = selection;
    },
    /**
     * 批量删除成员
     */
    delMembers() {
      let that = this;
      that
        .$confirm('是否要删除选中的员工？', '提示', {
          type: 'warning'
        })
        .then(() => {
          that.loading = true;
          let arr = [];
          that.selectedList.forEach(li => {
            arr.push(li.employeeClerkId);
          });
          if (!arr.length) {
            that.$message({
              message: '请选择员工',
              type: 'warning'
            });
            that.loading = false;
            return false;
          }
          let params = {
            ids: arr.join(',')
          };
          getRequest('/haoban-manage-web/emp/del', params)
            .then(res => {
              if (res.data.errorCode == 1) {
                let selected = that.selectedList;
                let originList = that.employeeList;
                let selSet = new Set(selected);
                let originSet = new Set(originList);
                that.employeeList = selected.concat(originList).filter(v => !selSet.has(v) || !originSet.has(v)); // 两数组非交集部分即为剔除后剩下的数据
                that.$message.success({
                  message: res.data.message
                });
              } else {
                that.$message.error({
                  message: res.data.message
                });
              }
              that.loading = false;
            })
            .catch(e => {
              that.loading = false;
              that.$message.error({
                message: e.message
              });
            });
        });
    },

    /**
     * 设置是否显示子成员
     */
    setChildMemberShow() {
      this.getEmployee();
    },

    /**
     * 获取分组架构
     */
    getGroupData(fn) {
      let that = this;
      let params = {
        isStoreGroup: 0
      };
      getRequest('/haoban-manage-web/dept/deptListForCompany', params)
        .then(res => {
          that.menuData = res.data.result.departmentList || [];
          that.menuData.some(item => {
            if (item.level == 0) {
              that.groupInfo.departmentId = item.groupId;
              that.groupInfo.groupName = item.name;
              that.groupInfo.hasPression = item.hasPression;
              that.groupInfo.level = 0;
            }
            return item.level == 0;
          });
          that.getEmployee();
        })
        .catch(e => {
          console.log(e, 'error');
        });
    },

    /**
     * 获取员工列表
     */
    getEmployee() {
      let that = this;
      let params = {
        departmentId: that.groupInfo.departmentId,
        showChild: that.showChildMember * 1,
        pageSize: that.pageSize,
        pageNum: that.currentPage,
        status: 1
      };
      getRequest('/haoban-manage-web/emp/findsimplepage', params)
        .then(res => {
          let list = [];
          let total = 0;
          if (res.data.errorCode == 1) {
            list = !!res.data.result && !!res.data.result.list ? res.data.result.list : [];
            total = !!res.data.result && !!res.data.result.total ? res.data.result.total : 0;
          }
          that.employeeList = list;
          that.total = total;
          that.loading = false;
        })
        .catch(e => {
          console.log(e, 'error');
          that.loading = false;
        });
    }
  },
  computed: {
    disabledDel() {
      return !this.selectedList.length && !this.setDisabledDel && this.groupInfo.hasPression != 1;
    }
  }
};
</script>
<style lang="scss">
.admin-frame {
  height: 100%;
  .right-content {
    min-height: calc(100% - 240px);
  }
}
.administrative-estrutura-container {
  display: flex;

  .af-right-container {
    background: #fff;
    flex: 1;
    padding: 0 24px;

    .af-right-header {
      height: 70px;
      line-height: 70px;
      font-weight: 400;
      font-size: 14px;
      color: #606266;

      .title-span {
        color: #303133;
        font-size: 20px;
      }

      .handle-area {
        float: right;

        .hurdle {
          width: 1px;
          height: 16px;
          display: inline-block;
          background: #dcdfe6;
          margin: 0;
          vertical-align: sub;
        }

        .no-bdr-btn {
          background: none;
          color: #409eff;
          border: none;
        }

        .el-button.is-disabled,
        .el-button.is-disabled:hover,
        .el-button.is-disabled:focus {
          background: none;
          color: #c0c4cc;
        }
      }
    }

    .af-right-button-box {
      padding: 8px 15px;
      background: #ebeef5;
      .el-button {
        &.J_show-children {
          vertical-align: top;
          margin-left: 0;
          padding: 0 15px;
          line-height: 29px;
          height: 32px;
          /deep/ .el-checkbox {
            vertical-align: 0;
            &.is-checked {
              .el-checkbox__label {
                color: #409eff;
              }
            }
            .el-checkbox__input {
              vertical-align: -2px;
            }
          }
        }
      }
    }

    .pagination {
      margin: 24px 0;
      text-align: right;
    }

    .status-icon {
      width: 34px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #ecf5ff;
      border: 1px solid #d9ecff;
      border-radius: 4px;
      &.is-active {
        .iconfont {
          color: #409eff;
        }
      }
    }
  }
}
</style>
