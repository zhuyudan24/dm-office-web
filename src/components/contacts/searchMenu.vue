<template>
  <div class="searh-menu-container">
    <div class="p-0-15">
      <el-input prefix-icon="el-icon-search" v-model="searchKey" placeholder="姓名/手机号/部门名称" clearable @clear="clearFn" @keyup.enter.native="searchFn"></el-input>
      <slot name="buttonBox"></slot>
      <el-tree v-if="!searchResultShow" class="search-menu" node-key="id" :default-expanded-keys="defaultOpen" :data="menuData" :highlight-current="true" :expand-on-click-node="false" :props="myProps" @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i class="iconfont" :class="node.level == 1 ? 'icon-2zuzhijiagou' : 'icon-tongshi-zuzhijiagou'"></i>
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="search-result-container m-t-15" v-if="searchResultShow">
      <template v-if="storeFrame">
        <template v-for="(brand, index) in brandList">
          <div :key="brand.topDepartment.brandId + '_' + index" v-if="brand.departmentList.length > 0 || brand.storeList.length > 0 || brand.searchList.length > 0">
            <div>
              <p class="brand-title">{{ brand.topDepartment.name }}</p>
              <ul class="search-result-ul" v-if="brand.departmentList.length > 0">
                <p class="title store-frame-title">分组列表</p>
                <li class="group-item items" v-for="(department, index) in brand.departmentList" :key="index + '_' + department.groupId" @click="handleNodeClick(department)">
                  <i class="iconfont icon-tongshi-zuzhijiagou"></i>
                  {{ department.name }}
                </li>
              </ul>
              <ul class="search-result-ul" v-if="brand.storeList.length > 0">
                <p class="title store-frame-title">门店列表</p>
                <li class="group-item items" v-for="(store, index) in brand.storeList" :key="index + '_' + store.storeGroupId" @click="handleStoreClick(store)">
                  <i class="iconfont icon-tongshi-zuzhijiagou"></i>
                  {{ store.storeName }}
                </li>
              </ul>
              <ul class="search-result-ul" v-if="brand.searchList.length > 0">
                <p class="title store-frame-title">人员列表</p>
                <li class="person-item items" v-for="(employee, index) in brand.searchList" :key="index + '_' + employee.employeeClerkId" @click="selectEmployee(employee)">
                  <i class="iconfont icon-chengyuan"></i>
                  {{ employee.name }}
                  <span class="from-group">{{ employee.departmentName }}</span>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <p class="no-data-tip" v-if="brandList.length < 1">暂无数据</p>
      </template>
      <template v-else>
        <ul class="search-result-ul" v-if="departmentList.length > 0">
          <p class="title">部门列表</p>
          <li :class="['group-item items', defaultId == department.groupId ? 'active-item' : '']" v-for="(department, index) in departmentList" :key="index + '_' + department.groupId" @click="handleNodeClick(department)">
            <i class="iconfont icon-tongshi-zuzhijiagou"></i>
            {{ department.name }}
          </li>
        </ul>
        <ul class="search-result-ul" v-if="employeeList.length > 0">
          <p class="title">人员列表</p>
          <li :class="['person-item items', defaultId == employee.employeeClerkId ? 'active-item' : '']" v-for="(employee, index) in employeeList" :key="index + '_' + employee.employeeClerkId" @click="selectEmployee(employee)">
            <i class="iconfont icon-chengyuan"></i>
            {{ employee.name }}
            <span class="from-group">{{ employee.departmentName }}</span>
          </li>
        </ul>
        <p class="no-data-tip" v-if="departmentList.length < 1 && employeeList.length < 1">暂无数据</p>
      </template>
    </div>
  </div>
</template>
<script>
import { formatTreeData } from '@/utils/index';
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
      defaultOpen: [],
      defaultId: '' // 默认选择的 id
    };
  },
  methods: {
    /**
     * 清楚输入框
     */
    clearFn() {
      this.searchResultShow = false;
      this.$nextTick(function() {
        document.querySelector('.el-tree-node').classList.add('is-current');
      });
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
      let that = this;
      if (obj.id != that.defaultId && !!document.querySelector('.el-tree-node')) {
        document.querySelector('.el-tree-node').classList.remove('is-current');
      }

      that.defaultId = obj.groupId;
      that.$emit('handleTreeSelection', obj, node, 'node');
    },

    /**
     * 搜索结果中选人
     */
    selectEmployee(person) {
      let that = this;
      that.defaultId = person.employeeClerkId;
      that.$emit('handleEmployeeSelection', person, 'employee');
    },
    /**
     * 搜索结果中选门店
     */
    handleStoreClick(store) {
      let that = this;
      that.$emit('handleStoreSelection', store, 'store');
    }
  },
  filter: {},
  computed: {
    // 搜索结果返回的员工，部门，品牌列表
    employeeList() {
      if (this.searchResult.searchList) {
        return this.searchResult.searchList;
      } else {
        return [];
      }
    },
    departmentList() {
      if (this.searchResult.departmentList) {
        return this.searchResult.departmentList;
      } else {
        return [];
      }
    },
    brandList() {
      if (this.searchResult.brandList) {
        return this.searchResult.brandList;
      } else {
        return [];
      }
    }
  },
  watch: {
    treeData(newArr, old) {
      const that = this;
      let obj = formatTreeData(newArr);
      that.defaultOpen = obj.defaultOpen;
      that.menuData = obj.menuArr;
      if (!!that.menuData.length) {
        that.$nextTick(function() {
          that.defaultId = !!that.menuData.length ? that.menuData[0].id : '';
          document.querySelector('.el-tree-node').classList.add('is-current');
        });
      }
    }
  }
};
</script>
<style lang="scss">
.searh-menu-container {
  overflow-y: auto;
  overflow-x: auto;
  width: 260px;
  max-width: 260px;
  min-width: 260px;
  background: #eef1f8;
  padding: 20px 0;
  box-sizing: border-box;

  .p-0-15 {
    padding: 0 15px;
  }

  .no-data-tip {
    text-align: center;
    margin-top: 50px;
    color: #5b6a80;
    font-size: 15px;
  }

  .slot-button {
    text-align: center;
    margin-top: 20px;

    .el-icon-info {
      color: #c0c4cc;
      cursor: pointer;
      &:hover {
        color: #000;
      }
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
          opacity: 0.6;
        }

        &:hover {
          color: #fff;
          background: #409eff;

          .iconfont {
            color: #fff;
          }
        }
      }

      &.is-current {
        .el-tree-node__content {
          .iconfont {
            opacity: 0.8;
          }
        }
        .el-tree-node__children {
          .iconfont {
            opacity: 0.6;
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
      &.active-item {
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
