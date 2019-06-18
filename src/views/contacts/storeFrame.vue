<template>
  <div class="common-set-wrap store-frame-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div class="store-estrutura-container common-frame-container">
          <search-menu ref="searchMenu" :storeFrame="true" :treeData="menuData" :searchResult="searchResult" @handleSearchKey="handleSearchKey" @handleTreeSelection="handleTreeSelection" @handleStoreSelection="handleStoreSelection" @handleEmployeeSelection="handleEmployeeSelection">
            <template slot="buttonBox">
              <div class="slot-button">
                <el-button @click="addBrand" :disabled="disableBtn">新建品牌</el-button>
                <el-popover placement="right" width="200" content="若您的企业为集团企业，可通过新建品牌，不同品牌的门店可以创建在不同的品牌下面" trigger="hover"><i class="el-icon-info" slot="reference"></i> </el-popover>
              </div>
            </template>
          </search-menu>
          <clerk-info v-if="showEmployee == 'employee'" :gicFlag="gicFlag" :perId="perId" @cancelClerkInfo="cancelClerkInfo"> </clerk-info>
          <store-info :gicFlag="gicFlag" ref="store_info" v-else-if="showEmployee == 'store'" :storeInfo="storeInfo"> </store-info>
          <div class="sf-right-container common-right-container" v-else v-loading="loading">
            <div class="sf-right-header common-right-header">
              <span class="title-span">{{ groupInfo.groupName }}（{{ total }}家）</span>
              <span class="id-span">部门ID： {{ groupInfo.departmentId }}</span>
              <el-popover v-if="!!gicFlag" placement="right" width="200" content="该品牌已与 GIC门店同步" trigger="hover"><i class="el-icon-info" style="color: #c0c4cc;cursor: pointer;" slot="reference"></i> </el-popover>
              <span class="handle-area" v-if="!gicFlag">
                <el-button class="no-bdr-btn" @click="addSon"> 添加子分组 </el-button><span class="hurdle"> </span><el-button class="no-bdr-btn" @click="goToEdit(groupInfo.level)"> 编辑 </el-button
                ><!-- :disabled="groupInfo.hasPression != 1" -->
              </span>
            </div>
            <div class="tab-div">
              <el-radio-group v-model="tableView" @change="switchView">
                <el-radio-button :label="1">门店视图</el-radio-button>
                <el-radio-button :label="2">店员视图</el-radio-button>
              </el-radio-group>
              <a :href="'#/recycle?brandId=' + groupInfo.brandId + '&dept=' + groupInfo.departmentId + '&showChild=1' + '&type=' + storeType" class="a-href fr">
                <el-button type="primary" icon="el-icon-delete">回收站（{{ recycleCount }}）</el-button>
              </a>
            </div>
            <div>
              <template v-if="tableView == 1">
                <store-view :gicFlag="gicFlag" :tableData="storeList" :departmentId="groupInfo.departmentId" :brandId="groupInfo.brandId" @setChildMemberShow="setChildMemberShow" @getStoreList="getStoreList" :firstLevelId="firstLevelId"> </store-view>
              </template>
              <template v-else>
                <clerk-view :gicFlag="gicFlag" :tableData="storeList" :firstLevelId="firstLevelId" @setChildMemberShow="setChildMemberShow" @selectByStatus="selectByStatus" @selectByType="selectByType" @refreshClerkData="refreshClerkData"> </clerk-view>
              </template>
            </div>
            <div class="pagination" v-if="!!storeList.length">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="pageNumber" layout="total, sizes, prev, pager, next" :total="total"> </el-pagination>
            </div>
          </div>
          <add-brand ref="add_brand" @addSuccess="addSuccess"></add-brand>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import searchMenu from 'components/contacts/searchMenu';
import storeView from 'components/contacts/storeFrame/storeView';
import clerkView from 'components/contacts/storeFrame/clerkView';
import storeInfo from 'components/contacts/storeFrame/storeInfo';
import addBrand from 'components/contacts/storeFrame/addBrand';
import employeeInfo from 'components/contacts/employeeInfo';
import clerkInfo from 'components/contacts/storeFrame/clerkInfo';
import errMsg from '@/common/js/error';
import { getRequest } from '@/api/api';
import { getGicStatus } from '@/api/gicStatus';
export default {
  name: 'storeEstruturaContainer',
  components: {
    navCrumb,
    searchMenu,
    storeView,
    clerkView,
    employeeInfo,
    storeInfo,
    addBrand,
    clerkInfo
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
          name: '门店架构',
          path: ''
        }
      ],
      menuData: [],
      searchResult: {},
      loading: true,
      groupInfo: {
        groupName: '',
        departmentId: ''
      },
      total: 0,
      showChildMember: false, // 是否显示子成员
      pageSize: 20,
      pageNumber: 1,
      storeList: [],
      tableView: 1,
      showEmployee: 'node',
      perId: '',
      storeInfo: {},
      disableBtn: true,
      storeStatus: '',
      storeType: '',
      recycleCount: 0,
      firstLevelId: '', // 第一层的分组id
      // gic 同步字段
      gicFlag: true
    };
  },

  beforeRouteUpdate(to, from, next) {
    next();
  },
  methods: {
    // 关键词搜索
    handleSearchKey(keyWord) {
      const that = this;
      let params = {
        keyWord
      };
      getRequest('/haoban-manage-web/store/searchpage', params)
        .then(res => {
          that.searchResult = res.data.result || {};
        })
        .catch(error => {
          that.$message.error({
            message: error.message
          });
        });
    },
    /**
     * 树形搜索结果选人处理
     */
    async handleEmployeeSelection(employee, type) {
      this.perId = employee.employeeClerkId;
      this.userId = employee.userId;
      this.showEmployee = type;
      await this.getGicData(); // 获取 GIC 门店同步状态
    },
    /**
     * 新建品牌
     */
    addBrand() {
      this.$refs.add_brand.dialogVisible = true;
    },
    // 跳转添加子部门页面
    addSon() {
      location.href = '#/addGroup?addnew=1&type=childgroup&groupId=' + this.groupInfo.departmentId + '&firstLevelId=' + this.firstLevelId;
    },
    // 跳转编辑部门页面
    goToEdit(level) {
      let type = level == 0 ? 'brand' : 'group';
      location.href = '#/addGroup?groupId=' + this.groupInfo.departmentId + '&type=' + type + '&firstLevelId=' + this.firstLevelId;
    },
    addSuccess() {
      this.getGroupData();
      this.$refs.add_brand.dialogVisible = false;
    },
    /**
     * 树形搜索结果选门店处理
     */
    handleStoreSelection(store, type) {
      let that = this;
      let params = { storeId: store.storeId };
      getRequest('/haoban-manage-web/store/findStoreById', params).then(res => {
        if (res.data.errorCode == 1) {
          that.storeInfo = res.data.result;
          that.groupInfo.brandId = res.data.result.brandId;
          // that.$refs.store_info.formatStoreInfo(res.data.result);
          that.showEmployee = type;
          that.getGicData(); // 获取 GIC 门店同步状态
        } else {
          that.$message.error({
            message: res.data.message
          });
        }
      });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getStoreList();
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getStoreList();
    },
    /**
     * 切换视图
     */
    switchView(view) {
      this.pageSize = 20;
      this.pageNumber = 1;
      this.storeList = [];
      this.showChildMember = false;
      this.storeStatus = '';
      this.getStoreList();
    },
    /**
     * 设置是否显示子成员
     */
    setChildMemberShow(show) {
      let that = this;
      that.showChildMember = show;
      that.getStoreList();
    },
    /**
     * 刷新店员列表数据
     */
    refreshClerkData() {
      let that = this;
      that.getStoreList();
    },
    /**
     * 获取树形分组数据
     */
    getGroupData() {
      let that = this;
      let params = {
        isStoreGroup: 1
      };
      getRequest('/haoban-manage-web/dept/deptList', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.menuData = res.data.result || [];
            res.data.result.some(item => {
              if (item.level == 0) {
                that.groupInfo.brandId = item.brandId;
                that.groupInfo.departmentId = item.groupId;
                that.groupInfo.groupName = item.name;
                that.groupInfo.hasPression = item.hasPression;
                that.firstLevelId = item.chainId.split('-')[1];
                that.groupInfo.level = 0; // 新修改 level ,解决编辑时候出现编辑部门 bug
              }
              return item.level == 0;
            });
            that.getStoreList();
            that.getGicData(); // 获取 GIC 门店同步状态
          } else {
            that.menuData = [];
            that.loading = false;
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
     * 获取店铺列表
     */
    getStoreList() {
      let that = this;
      if (!that.groupInfo.departmentId) {
        that.loading = false;
        return false;
      }
      that.loading = true;
      let params = {
        storeGroupId: that.groupInfo.departmentId,
        showChild: that.showChildMember * 1,
        showType: that.tableView, // 门店、店员视图
        pageSize: that.pageSize,
        pageNum: that.pageNumber,
        status: that.storeStatus,
        storeType: that.storeType
      };
      getRequest('/haoban-manage-web/store/findSimplePage', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.loading = false;
            that.total = res.data.result.total;
            // 增加删除 popover 参数
            if (!!res.data.result.list && !!res.data.result.list.length) {
              res.data.result.list.forEach(function(ele, index) {
                ele.popVisible = false;
                if (!!ele.clerks && !!ele.clerks.length) {
                  ele.clerks.forEach(function(el, key) {
                    el.popVisible = false;
                  });
                }
              });
            }
            that.storeList = res.data.result.list || [];
            that.getRecycle();
          } else {
            that.loading = false;
            that.storeList = [];
            that.$message.error({
              duration: 1000,
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.loading = false;
          that.$message.error({
            duration: 1000,
            message: e.message
          });
        });
    },
    /**
     * 树形菜单选择项处理
     */
    handleTreeSelection(obj, node, showEmployee) {
      this.groupInfo.departmentId = obj.groupId;
      this.firstLevelId = obj.chainId.split('-')[1];
      this.groupInfo.groupName = obj.name;
      this.groupInfo.brandId = obj.brandId;
      this.showEmployee = showEmployee;
      this.groupInfo.hasPression = obj.hasPression;
      this.groupInfo.level = obj.level;
      this.storeStatus = '';
      this.getStoreList();
      this.getRecycle();
      this.getGicData();
    },
    /**
     * 店员视图根据店铺状态筛选店铺
     */
    selectByStatus(val) {
      this.storeStatus = val;
      this.getStoreList();
    },
    /**
     * 店员视图根据店铺类型筛选店铺
     */
    selectByType(type) {
      this.storeType = type;
      this.getStoreList();
    },
    // 取消保存人员信息
    cancelClerkInfo(val) {
      if (val) {
        this.showEmployee = '';
      }
    },

    // 获取回收站
    getRecycle() {
      let that = this;
      let params = {
        storeGroupId: that.groupInfo.departmentId
      };
      getRequest('/haoban-manage-web/store/get-recycle-count', params)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.recycleCount = resData.result;
          } else {
            that.$message.error({
              duration: 1000,
              message: resData.message
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

    // 获取 GIC 门店同步状态
    async getGicData() {
      let that = this;
      if (that.showEmployee == 'store' && !that.groupInfo.brandId) {
        that.loading = false;
        return false;
      }
      let para = {
        type: that.showEmployee == 'employee' ? 2 : 1,
        businessId: that.showEmployee == 'employee' ? that.userId : that.groupInfo.brandId
      };
      let res = await getGicStatus(para);
      let resData = res.data;
      if (resData.errorCode == 1) {
        that.gicFlag = resData.result;
      } else {
        errMsg.errorMsg(resData);
      }
    }
  },
  beforeMount() {
    this.getGroupData();
  },
  mounted() {
    this.disableBtn = false;
  }
};
</script>

<style lang="scss">
.store-frame-wrap {
  height: 100%;
  .right-content {
    min-height: calc(100% - 240px);
  }
  .store-info {
    height: auto;

    .handle-area {
      position: relative;
      left: 0;
    }
  }
}
</style>
