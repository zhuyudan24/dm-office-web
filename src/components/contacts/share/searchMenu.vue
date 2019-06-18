<template>
  <div class="searh-menu-container">
    <div class="p-0-15">
      <el-input prefix-icon="el-icon-search" v-model="searchKey" placeholder="姓名/手机号/部门名称" clearable @clear="clearFn" @keyup.enter.native="searchFn"> </el-input>
      <slot name="buttonBox"></slot>
    </div>
    <template v-if="!searchResultShow">
      <template v-for="area in shareArea">
        <div :key="area.sharedContactRelationId">
          <p class="area-title">{{ area.title }}</p>
          <p class="share-title">我方共享给对方的所有人员</p>
          <div class="p-0-15" :id="'id' + area.shares[0].sharedContactRelationId">
            <el-tree class="search-menu" node-key="id" :default-expanded-keys="defaultOpen" :data="area.shares[0].childrens" :highlight-current="true" :expand-on-click-node="false" :props="myProps" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="iconfont" :class="node.level == 1 ? 'icon-2zuzhijiagou' : 'icon-tongshi-zuzhijiagou'"></i>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
          <p class="share-title">对方共享给我方的所有人员<i class="el-icon-upload"></i></p>
          <div class="p-0-15" :id="'id' + area.shares[1].sharedContactRelationId">
            <el-tree v-if="!searchResultShow" class="search-menu" node-key="id" :default-expanded-keys="defaultOpen" :data="area.shares[1].childrens" :highlight-current="true" :expand-on-click-node="false" :props="myProps" @node-click="handleNodeClick">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <i class="iconfont" :class="node.level == 1 ? 'icon-2zuzhijiagou' : 'icon-tongshi-zuzhijiagou'"></i>
                <span>{{ node.label }}</span>
              </span>
            </el-tree>
          </div>
        </div>
      </template>
    </template>
    <div class="search-result-container m-t-15" v-else>
      <ul class="search-result-ul" v-if="departmentList.length > 0">
        <p class="title">部门列表</p>
        <li class="group-item items" v-for="(department, index) in departmentList" :key="index + '_' + department.groupId" @click="handleNodeClick(department)">
          <i class="iconfont icon-tongshi-zuzhijiagou"></i>
          {{ department.name }}
        </li>
      </ul>
      <ul class="search-result-ul" v-if="storeList.length > 0">
        <p class="title store-frame-title">门店列表</p>
        <li class="group-item items" v-for="(store, index) in storeList" :key="index + '_' + store.storeId" @click="handleStoreClick(store)">
          <i class="iconfont icon-tongshi-zuzhijiagou"></i>
          {{ store.name }}
        </li>
      </ul>
      <ul class="search-result-ul" v-if="employeeList.length > 0">
        <p class="title">人员列表</p>
        <li class="person-item items" v-for="(employee, index) in employeeList" :key="index + '_' + employee.employeeClerkId" @click="selectEmployee(employee)">
          <i class="iconfont icon-chengyuan"></i>
          {{ employee.name }}
        </li>
      </ul>
      <p class="no-data-tip" v-if="departmentList.length < 1 && employeeList.length < 1">暂无数据</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'searchMenu',
  components: {},
  props: {
    treeData: {
      type: Array,
      required: true
    },
    searchResult: {
      type: Object,
      required: true
    },
    storeFrame: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      searchKey: '',
      searchResultShow: false,
      myProps: {
        children: 'childrens',
        label: 'label',
        disabled: 'disabled'
      },
      menuData: [],
      menuDataMine: [],
      defaultOpen: [],
      shareArea: []
    };
  },
  methods: {
    /**
     * 格式化树形菜单数据
     */
    formatGroupData(treeData) {
      let that = this;
      let shareArea = [];
      let userInfo = window.localStorage.getItem('userInfo');
      let enterpriseId = JSON.parse(userInfo).enterpriseId;
      let hasFirst = false;
      treeData.forEach((ele, index) => {
        // 这里有可能会出现 enterpriseId 不一致问题，通过接口登录的时候
        if (ele.exportEnterpriseId == enterpriseId) {
          // 根据exportEnterpriseId判断企业是否为自己的企业
          let obj = {
            title: ele.title,
            sharedContactRelationId: ele.sharedContactRelationId,
            id: ele.sharedContactRelationId,
            shares: [ele]
          };
          // ele.shares = [ele];
          ele.childrens = ele.ext.sharedContactDepartmentStoreGroupList;
          ele.childrens.forEach(group => {
            that.formatGroup(group, 1);
          });
          if (!hasFirst) {
            hasFirst = true;
            that.$emit('getEmployeeFirst', ele.childrens[0]);
          }
          that.defaultOpen.push(ele.childrens[0].id);
          that.defaultOpen.push(ele.childrens[1].id);
          treeData.forEach(son => {
            if (son.exportEnterpriseId == ele.importEnterpriseId) {
              son.childrens = son.ext.sharedContactDepartmentStoreGroupList;
              son.childrens.forEach(group => {
                that.formatGroup(group, 0);
              });
              obj.shares.push(son);
              that.defaultOpen.push(son.childrens[0].id);
              that.defaultOpen.push(son.childrens[1].id);
            }
          });
          shareArea.push(obj);
        }
      });
      that.shareArea = shareArea;
      that.$forceUpdate();
    },
    formatGroup(group, isMine) {
      let that = this;
      group.id = group.sharedContactGroupId;
      group.label = group.name;
      group.isMine = isMine;
      if (!!group.ext && !!group.ext.sharedContactDepartmentStoreGroupList) {
        group.childrens = group.ext.sharedContactDepartmentStoreGroupList;
        group.childrens.forEach(son => {
          that.formatGroup(son, isMine);
        });
      }
    },
    /**
     * 清楚输入框
     */
    clearFn() {
      this.searchResultShow = false;
    },
    /**
     * 关键字搜索
     */
    searchFn() {
      if (this.searchKey == '') {
        this.searchResultShow = false;
        return false;
      }
      this.searchResultShow = true;
      this.$emit('handleSearchKey', this.searchKey);
    },
    /**
     * 树形菜单选择
     */
    handleNodeClick(obj, node) {
      const that = this;
      that.$emit('handleTreeSelection', obj, node, 'node');
      /*let sel = '#id' + obj.sharedContactId + ' .is-current .el-tree-node__content';
      let selList = '#id' + obj.sharedContactId + ' .el-tree-node .el-tree-node__content';
      that.$nextTick(function(){
        // 设置当前树选中
        let list = document.querySelectorAll(selList);
        list.forEach(item => {
          item.style.background = 'transparent';
        })
        document.querySelector(sel).style.background = '#409eff';
        // 设置不同树选中
        let arr = [];
        that.shareArea.map(item=> {
          arr.push(item.shares.map(child => child.sharedContactRelationId));
        })
        arr.flat().forEach((item,index) => {
          let unsel = '#id' + item + ' .is-current';
          let doms = [];
          if (item != obj.sharedContactId) {
            doms = document.querySelectorAll(unsel);
            doms.forEach(ele => {
              ele.classList.remove('is-current'); // 已选中的节点在选择树其他节点后，再选中会有些问题
              ele.childNodes[0].style.background = 'transparent';
            })
          }
        })
      })*/
    },

    /**
     * 搜索结果中选人
     */
    selectEmployee(person) {
      this.$emit('handleEmployeeSelection', person, 'employee');
    },
    /**
     * 搜索结果中选门店
     */
    handleStoreClick(store) {
      this.$emit('handleStoreSelection', store, 'store');
    }
  },
  filter: {},
  computed: {
    // 关键词搜索返回的人员，分组，门店信息排列
    employeeList() {
      let arr = [];
      if (this.searchResult.employeeStoreList) {
        let perList = this.searchResult.employeeStoreList;
        perList.forEach(per => {
          if (!!per.ext.employeeClerk) {
            per.employeeClerkId = per.ext.employeeClerk.employeeClerkId;
            per.name = per.employeeStoreName;
            arr.push(per);
          } else {
            // 门店下的人要取出来放到人员列表里展示
            per.ext.store.ext.employeeClerkList.forEach(clerk => {
              arr.push(clerk);
            });
          }
        });
      }
      return arr;
    },
    storeList() {
      let arr = [];
      if (this.searchResult.employeeStoreList) {
        let perList = this.searchResult.employeeStoreList;
        perList.forEach(per => {
          if (!!per.ext.store) {
            per.storeId = per.employeeStoreId;
            per.name = per.employeeStoreName;
            arr.push(per);
          }
        });
      }
      return arr;
    },
    departmentList() {
      if (this.searchResult.groupList) {
        this.searchResult.groupList.forEach(group => {
          group.id = group.sharedContactGroupId;
        });
        return this.searchResult.groupList;
      } else {
        return [];
      }
    }
  },
  watch: {
    treeData(newArr, old) {
      this.formatGroupData(newArr);
    }
  },
  mounted() {
    this.formatGroupData(this.treeData);
  }
};
</script>
<style lang="scss">
.searh-menu-container {
  overflow-y: auto;
  overflow-x: auto;
  width: 260px;
  background: #eef1f8;
  /*height: 690px;*/
  padding: 20px 0;
  box-sizing: border-box;

  .p-0-15 {
    padding: 0 15px;
  }

  .area-title {
    padding: 0 15px;
    height: 13px;
    font-size: 13px;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);
    margin: 24px 0;
  }

  .share-title {
    padding: 0 15px;
    margin-top: 24px;
    height: 36px;
    line-height: 36px;
    background: rgba(228, 231, 237, 1);
    font-size: 12px;
    font-weight: 400;
    color: rgba(96, 98, 102, 1);

    i {
      float: right;
      color: #409eff;
      font-size: 16px;
      margin-top: 10px;
    }
  }

  .no-data-tip {
    text-align: center;
    margin-top: 50px;
    color: #5b6a80;
  }

  .slot-button {
    text-align: center;
    margin-top: 20px;

    .el-icon-question {
      color: #c0c4cc;
      cursor: pointer;
    }
  }

  .search-menu {
    margin-top: 20px;
    color: #606266;
    font-size: 14px;
    background: #eef1f8;
    min-width: 100%;
    display: inline-block !important;

    .el-tree-node {
      .el-tree-node__content {
        height: 36px;

        .iconfont {
          color: #409eff;
          margin-right: 5px;
        }

        &:hover {
          color: #fff;
          background: #409eff;

          .iconfont {
            color: #fff;
          }
        }
      }
    }
  }

  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background: #409eff;
    color: #fff;

    .iconfont {
      color: #fff;
    }
  }

  .brand-title {
    padding: 15px;
    color: #303133;
  }

  .search-result-ul {
    font-size: 14px;
    color: #606266;

    .title {
      padding: 15px;
      color: #303133;

      &.store-frame-title {
        background: rgba(228, 231, 237, 1);
      }
    }

    li.items {
      padding: 15px;
      background: #fff;
      box-sizing: border-box;
      border-bottom: 1px solid #e4e7ed;
      cursor: pointer;

      .iconfont {
        color: #409eff;
      }

      .from-group {
        float: right;
      }

      &:hover {
        background: #409eff;
        color: #fff;

        .iconfont {
          color: #fff;
        }
      }
    }
  }
}
</style>
