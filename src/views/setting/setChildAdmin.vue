<template>
  <div class="setChildAdmin-wrap common-set-wrap" :style="{ height: windowH }">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="setChildAdmin-wrap-body flex">
          <div class="setChildAdmin-wrap-left w-260" :style="{ height: boxHeight }">
            <div class="m-t-20" v-for="(pItem, pIndex) in roleListData" :key="pIndex">
              <div class="role-cell-head flex">
                <div class="flex-1 max-half role-cell-head_name">{{ pItem.brandName }}</div>
                <div class="text-right flex-1 " v-if="!!pItem.canAddRole">
                  <el-button size="mini" @click="changeRoute('/addAdminRole?brandId=' + pItem.brandId)">新增角色</el-button>
                </div>
              </div>
              <ul>
                <li v-for="(item, index) in pItem.roleList" :key="index" :class="['role-cell border-bottom-1', pItem.brandId == activeBrandId && item.roleId == activeId ? 'role-active' : '']" @click.stop="selectRole(item, pItem.brandId)">
                  <i class="iconfont icon-lizhi p-r-6"></i>
                  {{ item.roleName }}
                </li>
              </ul>
            </div>
          </div>
          <div class="setChildAdmin-wrap-right box-sizing">
            <div class="role-title flex flex-between m-b-25">
              <span class="font-20 color-303133"> {{ roleRightObj.roleName }} </span><span class="font-14 color-1890ff pinter" v-if="roleRightObj.roleCode != 'child_admin'" @click="toRoleDetail('show')"> 查看权限 </span
              ><span v-if="roleRightObj.roleCode == 'child_admin'">
                <span class="font-14 color-1890ff pinter p-r-6" @click="toDelRole" v-if="!tableData.length"> 删除角色 </span
                ><span class="font-14 color-1890ff pinter" @click="toRoleDetail('edit')">
                  编辑权限
                </span>
              </span>
            </div>
            <div class="role-tip  " v-if="roleRightObj.roleCode === 'master_admin' || roleRightObj.roleCode === 'admin'">
              <el-alert :title="roleRightObj.roleCode === 'master_admin' ? '企业的创建者，拥有企业的所有权限，只会有一个' : roleRightObj.roleCode === 'admin' ? '企业管理员，拥有企业的所有权限，不能创建企业管理员，可以有多个' : ''" type="info" :closable="false" show-icon> </el-alert>
            </div>
            <div class="role-add m-t-27" v-if="!!roleRightObj.isEdit">
              <el-button type="primary" @click="toAddRole(roleRightObj.roleCode)">添加成员</el-button>
            </div>
            <div :class="['role-table', !!roleRightObj.isEdit ? '' : 'm-t-27']">
              <el-table :data="tableData" style="width: 100%;">
                <el-table-column prop="clerkName" label="姓名"> </el-table-column>
                <el-table-column prop="clerkPhone" label="手机号"> </el-table-column>
                <el-table-column prop="groupName" label="部门"> </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope" v-if="scope.row.canEdit == 1">
                    <el-button @click="handleShow(scope.$index, scope.row, roleRightObj.roleCode)" type="text" size="small">编辑</el-button>
                    <el-button @click="handleDel(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="block common-wrap__page text-right" v-if="tableData.length != 0">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"> </el-pagination>
              </div>
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
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
export default {
  name: 'setChildAdmin',
  data() {
    return {
      windowH: window.screen.availHeight - 180 - 15 + 'px',
      tableH: window.screen.availHeight - 440 - 180,
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '设置',
          path: '/companyAddress'
        },
        {
          name: '设置子管理员',
          path: ''
        }
      ],
      boxHeight: window.screen.availHeight - 20 + 'px',
      isAddAdmin: '', // 是否有添加管理员权限
      activeId: '', // 当前选择的管理员 id
      activeBrandId: '', // 当前选择的管理员对应的品牌 id
      roleListData: [
        // {
        //   brandId: '1',
        //   brandName: '集团',
        //   roleList: [
        //     {
        //       roleId: '1',
        //       roleName: '超级管理员'
        //     },
        //     {
        //       roleId: '2',
        //       roleName: '企业管理员'
        //     }
        //   ],
        // }
      ],
      roleRightObj: {
        roleName: '超级管理员',
        tip: '企业的创建者，拥有企业的所有权限，只会有一个',
        roleCode: '',
        isEdit: 0
      },
      // 角色表格数据
      tableData: [
        // {
        //   userId: 1,
        //   clerkName: '张三',
        //   clerkPhone: '13333333333',
        //   groupName: '技术部'
        // }
      ],
      // 分页参数
      currentPage: 1,
      pageSize: 20,
      total: 0
    };
  },
  computed: {},
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(path) {
      this.$router.push(path);
    },

    /**
     *  role 详情
     */
    toRoleDetail(type) {
      const that = this;
      that.changeRoute(`/addAdminRole?roleId=${that.activeId}&type=${type}&brandId=${that.activeBrandId}`);
    },

    /**
     *  删除 role
     */
    toDelRole() {
      const that = this;
      that
        .$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postToDelRole();
        })
        .catch(() => {});
    },

    postToDelRole() {
      const that = this;
      let para = {
        roleId: that.activeId,
        brandId: that.activeBrandId
      };
      postRequest('/haoban-manage-web/del-role', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            that.getRoles();
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 选择 role
     */
    selectRole(item, brandId) {
      const that = this;
      that.activeId = item.roleId;
      that.activeBrandId = brandId;
      that.roleRightObj = item;
      that.getRoleUsers();
    },

    /**
     * 添加成员
     */
    toAddRole(roleCode) {
      const that = this;
      that.changeRoute(`/addAdmin?roleId=${that.activeId}&roleCode=${roleCode}&brandId=${that.activeBrandId}`);
    },

    /**
     * 删除成员
     */
    handleDel(index, item) {
      const that = this;
      that
        .$alert('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          that.postDelUser(item.userId, index);
        })
        .catch(() => {});
    },

    postDelUser(userId, index) {
      const that = this;
      let para = {
        roleId: that.activeId,
        userId: userId,
        brandId: that.activeBrandId
      };
      postRequest('/haoban-manage-web/del-role-user', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            that.tableData.splice(index, 1);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    handleShow(index, item, roleCode) {
      const that = this;
      that.changeRoute(`/addAdmin?roleId=${that.activeId}&roleCode=${roleCode}&userId=${item.userId}&brandId=${that.activeBrandId}`);
    },

    /**
     * 分页---页码变化
     */
    handleSizeChange(val) {
      const that = this;
      that.pageSize = val;
      that.getRoleUsers();
    },

    /**
     * 分页---当前页变化
     */
    handleCurrentChange(val) {
      const that = this;
      that.currentPage = val;
      that.getRoleUsers();
    },

    /**
     * 获取角色用户数据
     */
    getRoleUsers() {
      const that = this;
      let para = {
        roleId: that.activeId,
        brandId: that.activeBrandId,
        pageSize: that.pageSize,
        pageNum: that.currentPage
      };
      postRequest('/haoban-manage-web/role-user-list', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!resData.result || !resData.result.result) {
              that.tableData = [];
              return false;
            }
            that.tableData = resData.result.result;
            that.total = resData.result.totalCount;
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 获取角色数据
     */
    getRoles() {
      const that = this;
      postRequest('/haoban-manage-web/role-list', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.isAddAdmin = resData.result.isAddAdmin;
            that.roleListData = resData.result.roleList || [];
            if (!!resData.result && !!resData.result.roleList.length) {
              that.activeId = that.roleListData[0].roleList[0].roleId;
              that.activeBrandId = that.roleListData[0].brandId;
              that.roleRightObj = that.roleListData[0].roleList[0];
              that.getRoleUsers();
            }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  mounted() {
    const that = this;
    that.boxHeight = window.screen.availHeight - 430 + 'px';
    that.getRoles();
  },
  components: {
    navCrumb
  }
};
</script>
<style lang="less" scoped>
/* display */
.inline-block {
  display: inline-block;
}

.top {
  vertical-align: top;
}

.middle {
  vertical-align: middle;
}

.pinter {
  cursor: pointer;
}

.text-right {
  text-align: right;
}

/* flex */
.flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.flex-1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.flex-column {
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
}

.flex-row {
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  -o-flex-direction: row;
  flex-direction: row;
}

.flex-align-center {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.flex-pack-center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.flex-between {
  -webkit-justify-content: space-between;
  justify-content: space-between;
}

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap: wrap;
}

.font-14 {
  font-size: 14px;
}

.font-20 {
  font-size: 20px;
}

.color-303133 {
  color: #303133;
}

.color-1890ff {
  color: #1890ff;
}

.text-center {
  text-align: center;
}

.w-260 {
  width: 260px;
}

.p-r-6 {
  padding-right: 6px;
}

.m-t-20 {
  margin-top: 20px;
}

.m-b-25 {
  margin-bottom: 25px;
}

.m-t-27 {
  margin-top: 27px;
}

.common-wrap__page {
  margin-top: 24px;
}

.common-set-wrap {
  .right-content {
    /*width: 100%;*/
    padding: 24px;
    min-height: calc(100% - 240px);

    .right-box {
      /*background: #fff;*/
      /*padding: 24px;*/
      /*min-height: 500px;*/

      .setChildAdmin-wrap {
        /* &-body {
        } */

        &-left {
          min-width: 260px;
          height: 100%;
          padding: 20px 0 0 0;
          background: #eef1f8;
          overflow-x: hidden;
          overflow-y: auto;

          .role-cell-head {
            height: 36px;
            line-height: 36px;
            padding: 0 20px;
            font-size: 14px;
            color: #606266;

            .max-half {
              max-width: 50%;
              min-width: 50%;
              width: 50%;
              overflow: hidden;
            }
          }

          .role-cell {
            position: relative;
            width: 220px;
            height: 36px;
            line-height: 36px;
            padding: 0 20px;
            font-size: 14px;
            color: #606266;
            background: #fff;
            cursor: pointer;
            overflow: hidden;
            i {
              color: #1890ff;
            }
            &:hover {
              color: #fff;
              background: #1890ff;
              i {
                color: #fff;
              }
            }

            &.role-active {
              color: #fff;
              background: #1890ff;
              i {
                color: #fff;
              }
            }
          }
        }

        &-right {
          width: calc(100% - 260px);
          padding: 24px;
          background: #fff;

          .role-tip {
            .el-alert {
              background-color: rgba(64, 158, 255, 0.1);
              border: 1px solid rgba(64, 158, 255, 0.2);
              color: #606266;
              font-size: 13px;
              /deep/ i {
                font-size: 16px;
                color: #1890ff;
              }
            }
          }

          .role-add {
            background: #ebeef5;
            padding: 8px 0 8px 15px;
          }
        }
      }
    }
  }
}

.el-table {
  min-height: 360px;
  /deep/.el-table__empty-block {
    height: 256px;
  }

  /deep/.el-table__empty-text {
    width: auto;
    margin-bottom: 80px;
    &::before {
      content: ' ';
      display: block;
      width: 60px;
      height: 60px;
      background: url(../../assets/no-data_icon.png) no-repeat center;
      margin: 0px auto 22px auto;
    }
  }

  /deep/.el-table__empty-text {
    margin-bottom: 0;
  }
}
</style>
