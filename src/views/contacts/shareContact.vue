<template>
  <div class="common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content" :style="{ minHeight: windowH, 'overflow-y': 'auto' }">
      <div class="right-box">
        <div class="administrative-estrutura-container">
          <template v-if="menuData.length > 0">
            <search-menu :treeData="menuData" :searchResult="searchResult" @handleEmployeeSelection="handleEmployeeSelection" @getEmployeeFirst="getEmployeeFirst" @handleSearchKey="handleSearchKey" @handleTreeSelection="handleTreeSelection">
              <template slot="buttonBox">
                <p class="add-share">
                  <a href="#/shareCode">
                    <el-button>建立共享企业</el-button>
                  </a>
                </p>
              </template>
            </search-menu>
            <employee-info v-if="showEmployee == 'employee'" :perId="perId"> </employee-info>
            <store-info ref="store_info" v-else-if="showEmployee == 'store'" :storeInfo="storeInfo"> </store-info>
            <!-- <div class="af-right-container" v-loading="loading" v-else-if="groupInfo.level !=0 || groupInfo.isStoreGroup != 1 || !groupInfo.isMine"> -->
            <permission-set @cancelSet="cancelSet" :groupInfo="groupInfo" v-else-if="showEmployee == 'permission'"> </permission-set>
            <div class="af-right-container" v-loading="loading" v-else>
              <div class="af-right-header">
                <span class="title-span">{{ groupInfo.groupName }}（{{ total }}人）<span class="not-show-app">本企业通讯录APP中不展示</span></span>
                <template v-if="!!groupInfo.isMine">
                  <span class="handle-area" v-if="groupInfo.isStoreGroup == 1">
                    <a
                      class="a-href"
                      @click="
                        dlgTitle = '分组';
                        dlgShow = true;
                      "
                      >添加子分组</a
                    >
                    <span class="hurdle" v-if="groupInfo.level != 0"></span>
                    <a @click="editGroup" class="J_edit a-href" v-if="groupInfo.level != 0">编辑</a>
                    <span class="hurdle" v-if="groupInfo.level != 0"></span>
                    <a class="J_edit a-href" v-if="groupInfo.level != 0" @click="deleteDepart(groupInfo.id)">删除子分组</a>
                  </span>
                  <span class="handle-area" v-else>
                    <a
                      @click="
                        dlgTitle = '部门';
                        newGroupName = '';
                        dlgShow = true;
                      "
                      class="J_add-child a-href"
                    >
                      添加子部门
                    </a>
                    <template v-if="groupInfo.level != 0">
                      <span class="hurdle"></span>
                      <a @click="editGroup" class="J_edit a-href">
                        编辑
                      </a>
                      <span class="hurdle" v-if="groupInfo.level != 0"></span>
                      <a class="J_edit a-href" v-if="groupInfo.level != 0" @click="deleteDepart(groupInfo.id)">删除子分组</a>
                    </template>
                  </span>
                </template>
                <template v-else>
                  <a class="a-href fr" @click="showEmployee = 'permission'">设置可见权限</a>
                </template>
              </div>
              <template v-if="employeeList.length > 0">
                <div class="af-right-button-box">
                  <template v-if="!!groupInfo.isMine">
                    <el-button
                      v-if="groupInfo.isStoreGroup == 1 && groupInfo.level * 1 > 0"
                      type="primary"
                      @click="
                        $refs.storeSelector.treeSet.dialogVisible = true;
                        sldType = 2;
                      "
                    >
                      添加门店
                    </el-button>
                    <el-button v-if="groupInfo.isStoreGroup != 1 && groupInfo.level != 0" type="primary" @click="callEmployeeSelector">添加成员</el-button>
                    <el-button type="danger" plain @click="delMembers" :disabled="disabledDel">批量删除</el-button>
                  </template>
                  <el-button class="J_show-children"> <el-checkbox class="m-r-10" v-model="showChildMember" @change="setChildMemberShow"></el-checkbox><a class="a-href">显示子成员</a> </el-button>
                </div>
                <clerk-view v-if="groupInfo.isStoreGroup == 1" :tableData="employeeList" @selectMember="selectMember"> </clerk-view>
                <employee-list v-else :employeeList="employeeList" @selectMember="selectMember" :groupInfo="groupInfo"> </employee-list>
                <div class="pagination">
                  <el-pagination background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="currentPage" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
                </div>
              </template>
              <template v-else>
                <div class="af-right-button-box">
                  <template v-if="!!groupInfo.isMine">
                    <el-button
                      v-if="groupInfo.isStoreGroup == 1 && groupInfo.level != 0"
                      type="primary"
                      @click="
                        $refs.storeSelector.treeSet.dialogVisible = true;
                        sldType = 2;
                      "
                    >
                      添加门店
                    </el-button>
                    <el-button v-if="groupInfo.isStoreGroup != 1 && groupInfo.level != 0" type="primary" @click="callEmployeeSelector">添加成员</el-button>
                  </template>
                  <span class="J_show-children el-button"> <el-checkbox class="m-r-10" v-model="showChildMember" @change="setChildMemberShow"></el-checkbox><a class="a-href">显示子成员</a> </span>
                </div>
                <add-new-guid
                  :groupInfo="groupInfo"
                  @addEmployee="callEmployeeSelector"
                  @addStoreEmployee="
                    $refs.storeSelector.treeSet.dialogVisible = true;
                    sldType = 2;
                  "
                >
                </add-new-guid>
              </template>
            </div>
            <!-- <div class="af-right-container" v-else-if="groupInfo.isStoreGroup == 1 && groupInfo.level == 0 && !!groupInfo.isMine">
              <p style="margin: 20px 0;">是否共享门店及成员数据</p>
              <el-checkbox v-model="shareSale">销售数据</el-checkbox>
              <el-checkbox v-model="shareMember">会员数据</el-checkbox>
              <div style="margin: 20px 0;">
                <el-button type="primary" @click="subShareSet">确定</el-button>
              </div>
            </div> -->
          </template>
          <template v-else>
            <guid-div></guid-div>
          </template>
        </div>
      </div>
    </div>
    <el-dialog :title="'添加子' + dlgTitle" :visible.sync="dlgShow" width="30%">
      <div style="padding: 30px;">
        <el-input v-model="newGroupName" :placeholder="'请输入' + dlgTitle + '名称'"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgShow = false">取 消</el-button>
        <el-button type="primary" @click="subSonGroupAdd(0)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'编辑' + dlgTitle" :visible.sync="editDlgShow" width="30%">
      <div style="padding: 30px;">
        <el-input v-model="newGroupName" :placeholder="'请输入' + dlgTitle + '名称'"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDlgShow = false">取 消</el-button>
        <el-button type="primary" @click="subSonGroupAdd(1)">确 定</el-button>
      </span>
    </el-dialog>
    <vue-select-employee ref="selectEmployee" :onlyPerson="true" @handleSelectedList="handleSelectedList" :treeData="treeData"> </vue-select-employee>
    <vue-select-store ref="storeSelector" @handleSelectedList="handleSelectedList" selectType="store"> </vue-select-store>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import searchMenu from 'components/contacts/share/searchMenu';
import employeeInfo from 'components/contacts/share/employeeInfo';
import storeInfo from 'components/contacts/storeFrame/storeInfo';
import employeeList from 'components/contacts/share/employeeList';
import clerkView from 'components/contacts/share/clerkView';
import guidDiv from 'components/contacts/share/guid';
import addNewGuid from 'components/contacts/share/addNewGuid';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { getRequest, postJson } from '@/api/api';
import vueSelectEmployee from 'components/common/vueSelectEmployee';
import vueSelectStore from 'components/common/vueSelectStore';
import permissionSet from 'components/contacts/share/permissionSet';
export default {
  name: 'shareContact',
  components: {
    navCrumb,
    searchMenu,
    employeeInfo,
    employeeList,
    guidDiv,
    clerkView,
    vueSelectEmployee,
    vueSelectStore,
    permissionSet,
    addNewGuid,
    storeInfo
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
          name: '共享通讯录',
          path: ''
        }
      ],
      windowH: window.screen.availHeight - 440 + 'px',
      boxHeight: window.screen.availHeight - 440 - 48 + 'px',
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
        departmentId: ''
      },
      employeeList: [],
      searchResult: {},
      showEmployee: '', // 显示对应模块 store现实店铺新 employee 现实员工信息
      perId: '',
      sharedContactRelationId: [],
      shareMember: false,
      shareSale: false,
      disabled: true,
      treeData: {},
      sldType: 1,
      dlgTitle: '',
      dlgShow: false,
      editDlgShow: false,
      newGroupName: '',
      storeInfo: {}
    };
  },
  /* eslint-disable */
  created() {},
  beforeMount() {
    this.getShareRelation();
  },
  methods: {
    /**
     * 编辑分组
     */
    editGroup() {
      let that = this;
      that.dlgTitle = '部门';
      that.newGroupName = that.groupInfo.groupName;
      that.editDlgShow = true;
    },
    subSonGroupAdd(edit) {
      // 添加子分组
      let that = this;
      let newGroupName = that.newGroupName;
      if (newGroupName == '') {
        that.$message.error({
          message: '名称不能为空'
        });
      } else {
        let params = {
          parentSharedContactGroupId: edit ? that.groupInfo.parentId : that.groupInfo.id,
          name: that.newGroupName
        };
        if (!!edit) {
          params.sharedContactGroupId = that.groupInfo.id;
        } else {
          delete params.sharedContactGroupId;
        }
        getRequest('/haoban-manage-web/shared-contact/set-shared-group', params)
          .then(res => {
            if (res.data.errorCode == 1) {
              that.$message.success({
                message: res.data.message
              });
              that.getShareRelation();
              that.dlgShow = false;
              that.editDlgShow = false;
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
    callEmployeeSelector() {
      this.sldType = 1;
      this.$refs.selectEmployee.treeSet.dialogVisible = true;
    },
    handleSelectedList(list) {
      let that = this;
      let arr = [];
      list.forEach(item => {
        arr.push({
          id: item.id,
          type: that.sldType
        });
      });
      let params = {
        overwrite: false,
        sharedContactMemberList: [
          {
            sharedContactGroupId: that.groupInfo.id,
            memberList: arr
          }
        ]
      };
      postJson('/haoban-manage-web/shared-contact/add-shared-member', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: res.data.message
            });
            that.getEmployee();
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.getEmployee();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getEmployee();
    },
    cancelSet() {
      console.log('Cancel');
      this.showEmployee = false;
    },
    /**
     * 设置是否共享门店及成员数据
     */
    subShareSet() {
      let that = this;
      let params = {
        visibleData: {
          shareMember: that.shareMember * 1,
          shareSale: that.shareSale * 1,
          sharedContactRelationId: that.sharedContactRelationId.join(',')
        }
      };
      postJson('/haoban-manage-web/shared-contact/set-shared-store-visible-data', params)
        .then(res => {
          that.$message.error({
            message: res.data.message
          });
        })
        .catch(e => {
          that.$message.error({
            message: e.message
          });
        });
    },
    /**
     * 树形菜单搜索
     */
    handleSearchKey(keyword) {
      let that = this;
      let params = {
        keyword
      };
      getRequest('/haoban-manage-web/shared-contact/search-shared-contact', params)
        .then(res => {
          if (!!res.data.result) {
            that.searchResult = res.data.result;
          }
        })
        .catch(err => {
          that.$message.error({
            message: err.message
          });
        });
    },

    /**
     * 树形菜单选择项处理
     */
    handleTreeSelection(obj, node, showEmployee) {
      this.groupInfo = obj;
      this.groupInfo.departmentId = obj.id;
      this.groupInfo.groupName = obj.name;
      this.showEmployee = showEmployee;
      this.loading = true;
      this.getEmployee();
      console.log(obj, node, showEmployee, this.groupInfo)
    },
    /**
     * 树形搜索结果选人处理
     */
    handleEmployeeSelection(employee, showEmployee) {
      this.perId = employee.employeeClerkId;
      this.showEmployee = showEmployee;
    },
    handleStoreSelection(storeInfo, showEmployee) {
      let that = this;
      let params = { storeId: storeInfo.storeId };
      getRequest('/haoban-manage-web/store/findStoreById', params).then(res => {
        if (res.data.errorCode == 1) {
          that.showEmployee = showEmployee;
          that.storeInfo = res.data.result;
        } else {
          that.$message.error({
            message: res.data.message
          });
        }
      });
      // this.storeInfo = storeInfo;
      // this.showEmployee = showEmployee;
    },

    /**
     * 删除部门
     */
    deleteDepart(id) {
      let that = this;
      that.$confirm('是否要删除当前分组？', '提示', {
          type: 'warning'
        })
        .then(() => {
          that.postDeleteDepart(id);
        })
    },

    postDeleteDepart(id) {
      let that = this;
      let params = {
        sharedContactGroupIdList: [id]
      };
      postJson('/haoban-manage-web/shared-contact/del-shared-group', params)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            that.getShareRelation();
          } else {
            errMsg.errorMsg(resData)
          }
        })
        .catch(err => {
          that.$message.error({
            message: err.message
          });
        });
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
          let arr = [];
          that.selectedList.forEach(li => {
            arr.push(li.sharedContactEmployeeStoreId);
          });
          let params = {
            sharedContactEmployeeStoreIdList: arr
          };
          postJson('/haoban-manage-web/shared-contact/del-shared-member', params)
            .then(res => {
              if (res.data.errorCode == 1) {
                that.$message.success({
                  message: res.data.message
                });
                that.getEmployee();
              } else {
                that.$message.error({
                  message: res.data.message
                });
              }
            })
            .catch(err => {
              that.$message.error({
                message: err.message
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
      // let params = {
      //   isStoreGroup: 0
      // };
      getRequest('/haoban-manage-web/shared-contact/find-shared-group', {})
        .then(res => {
          res.data.result.forEach(li => {
            li.groupId = li.sharedContactGroupId;
          });
          that.menuData = res.data.result || [];
          that.menuData.some(li => {
            if (li.level == 0) {
              that.groupInfo.departmentId = li.groupId;
              that.groupInfo.groupName = li.name;
            }
            return li.level == 0;
          });
          that.getEmployee();
          that.getRelationIds(that.menuData);
        })
        .catch(err => {
          that.$message.error({
            message: err.message
          });
        });
    },
    // 获取共享关系
    getRelationIds(data) {
      let userInfo = window.localStorage.getItem('userInfo');
      let enterpriseId = JSON.parse(userInfo).enterpriseId;
      let arr = [];
      data.forEach(group => {
        if (group.level == 0) {
          if (group.enterpriseId != enterpriseId) {
            arr.push(group.enterpriseId);
          }
        }
      });
      arr = [...new Set(arr)];
      this.sharedContactRelationId = arr;
    },

    getShareRelation() {
      let that = this;
      getRequest('/haoban-manage-web/shared-contact/find-shared-contact-relation', { searchGroup: 1 })
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.menuData = resData.result || [];
            that.loading = false;
          } else {
            errMsg.errorMsg(resData);
            that.loading = false;
          }
        })
        .catch(err => {
          that.$message.error({
            message: err.message
          });
        });
    },
    /**
     * 获取员工列表
     */
    getEmployeeFirst(obj) {
      this.groupInfo = obj;
      console.log('First:', obj);
      this.getEmployee();
    },
    getEmployee() {
      let that = this;
      let params = {
        sharedContactGroupId: that.groupInfo.id,
        findChildren: that.showChildMember
      };
      postJson('/haoban-manage-web/shared-contact/find-shared-member', params)
        .then(res => {
          let list = [];
          let total = 0;
          if (res.data.errorCode == 1) {
            list = res.data.result.list || [];
            total = res.data.result.pageInfo.total || 0;
          }
          that.employeeList = list;
          that.total = total;
          that.loading = false;
        })
        .catch(err => {
          that.loading = false;
          that.$message.error({
            message: err.message
          });
        });
    }
  },
  computed: {
    disabledDel() {
      return this.selectedList.length < 1 && !this.setDisabledDel;
    }
  }
};
</script>
<style lang="scss">
.administrative-estrutura-container {
  display: flex;
  .add-share {
    margin: 20px 0;
    text-align: center;
  }
  .af-right-container {
    /*height: 690px;*/
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

        .not-show-app {
          font-size: 14px;
          color: rgba(144, 147, 153, 1);
        }
      }

      .handle-area {
        float: right;

        .hurdle {
          width: 1px;
          height: 16px;
          display: inline-block;
          background: #dcdfe6;
          margin: 0 10px;
          vertical-align: sub;
        }
      }
    }

    .af-right-button-box {
      padding: 8px 15px;
      background: #ebeef5;
    }

    .pagination {
      margin-top: 30px;
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
