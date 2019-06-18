<template>
  <el-dialog :title="treeSet.isSelectPerson ? '选择人员' : '选择部门'" width="660px" :visible.sync="treeSet.dialogVisible">
    <div class="transfer-area">
      <div class="select-area t-a-select">
        <p class="title">选择</p>
        <div class="tree-div">
          <div class="input-container">
            <el-input v-model="searchText" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
          </div>
          <!-- :default-expanded-keys="defaultOpen" -->
          <el-tree class="search-menu" node-key="id" ref="tree" :check-strictly="true" :data="menuData" show-checkbox :highlight-current="true" :expand-on-click-node="false" icon-class="open-child" :props="myProps" :filter-node-method="filterNode" @check-change="getCurrentNode" @node-expand="nodeOpen" @node-collapse="nodeClose" @node-click="handleNodeClick">
            <span class="custom-tree-node" :class="data.disableOpen ? 'disable-open' : ''" slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span class="open-btn" v-if="data.childrens">
                <el-button @click="nodeOpen(data, node)" :disabled="data.disableOpen" type="text" size="small">{{ data.handleWord }}</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="selected-area t-a-select">
        <p class="title">
          已选
          <a class="J_del-all" @click="delSelected('empty')">全部清除</a>
        </p>
        <div class="tree-div">
          <ul class="selected-list">
            <template v-if="selectedList.length > 0">
              <li v-for="li in selectedList" class="list group-li" :class="li.groupId ? 'group-li' : 'person-li'" :key="li.id + li.label">
                <div class="label"><i class="iconfont" :class="li.groupId ? 'icon-tongshi-zuzhijiagou' : 'icon-chengyuan'"></i>{{ li.label }}</div>
                <div class="close-btn" @click="delSelected(li)">
                  <i class="el-icon-close"></i>
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn-box t-rt p-b-10">
      <el-button @click="treeSet.dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitSelected">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { formatTreeData, deepCopy } from '@/utils/index';
import { getRequest } from '@/api/api';
export default {
  name: 'vue-select-employee',
  props: {
    treeSet: {
      type: Object,
      default() {
        return {
          isSelectPerson: true, // 是否选人
          dialogVisible: false,
          isSingle: false // 是否单选
        };
      }
    },
    treeData: {
      // 树形菜单数据
      type: Object,
      default() {
        return {};
      }
    },
    onlyGroup: {
      // 仅显示的分组id，如果数组为空或不传视为默认显示全部
      type: Array,
      default() {
        return [];
      }
    },
    onlyPerson: {
      // 是否只显示人
      type: Boolean,
      default: false
    },
    defaultSelection: {
      // 回显数据，[{id: 222, label: "222"}] id 和 label必传
      type: [Object, Array],
      default() {
        return [];
      }
    },
    changed: {
      //同一页面多个场景使用组建，切换场景时要传一个changed字符串告诉组建场景已切换，进行重组数据
      type: [String, Number],
      default: ''
    },
    appScene: {
      // 使用场景
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      searchText: '', // 搜索关键词
      myProps: {
        children: 'childrens',
        label: 'label',
        disabled: 'disabled'
      },
      menusObj: {},
      menuData: [],
      defaultOpen: [], // 默认展开节点
      selectedList: [] // 已选节点
    };
  },
  methods: {
    /**
     * 获取分组架构
     */
    getGroupData() {
      let that = this;
      let params = {
        isStoreGroup: 0,
        appScene: that.appScene
      };
      getRequest('/haoban-manage-web/dept/deptListForCompany', params)
        .then(res => {
          let treeData = [];
          let personData = [];
          if (res.data.errorCode == 1) {
            treeData = res.data.result.departmentList || [];
            personData = res.data.result.searchList || [];
            that.formatGroupData(treeData, personData);
          }
        })
        .catch(e => {});
    },
    formatGroupData(treeData, personData) {
      let that = this;
      let data = treeData;
      let employees = personData;
      let copyData = data;
      // let copyData = JSON.parse(JSON.stringify(data));
      let onlyGroup = that.onlyGroup;
      that.menuData = [];
      that.defaultOpen = [];
      that.menusObj = {};
      data.forEach(group => {
        group.allClerks = null;
        group.childrens = null;
        group.label = group.name || '';
        group.id = group.groupId || '';
        group.handleWord = '展开';
        let allClerks = [];
        let arr = [];
        if (onlyGroup.length > 0) {
          // 如果设置只显示某几个分组的情况，默认展开
          if (onlyGroup.indexOf(group.groupId) > -1) {
            group.disableOpen = false;
            group.disabled = true;
          }
        } else {
          group.disabled = that.onlyPerson ? true : group.hasPression == 1 ? false : true;
        }
        copyData.forEach(cG => {
          // 根据groupId 和 parentId排列层级关系
          cG.label = cG.name || '';
          cG.id = cG.groupId || '';
          cG.disableOpen = false;
          cG.handleWord = '展开';
          if (onlyGroup.length > 0) {
            if (onlyGroup.indexOf(cG.groupId) > -1) {
              cG.disableOpen = false;
              cG.disabled = true;
              if (cG.parentId == group.groupId) {
                arr.push(cG);
              }
            }
          } else {
            cG.disabled = that.onlyPerson ? true : cG.hasPression == 1 ? false : true;
            if (cG.parentId == group.groupId) {
              arr.push(cG);
            }
          }
        });
        /* eslint-disable */
        if (that.treeSet.isSelectPerson && group.hasPression == 1)
          employees.forEach(person => {
          // 如果需要现实人，需要将人通过employeeClerkId 和 groupId组装谁
          person.label = person.name;
          person.id = person.employeeClerkId;
          if (person.departmentId == group.groupId) {
            arr.push(person);
            allClerks.push(person);
          }
          that.menusObj[person.id] = person;
        });
        /* eslint-disable */
        if (arr.length > 0) group.childrens = arr;
        group.allClerks = allClerks; // 当前分组下所有（包括子分组）的人，暂时没啥用
        if (onlyGroup.length > 0) {
          if (onlyGroup.indexOf(group.groupId) > -1) {
            group.hasLoad = true;
            group.handleWord = '展开';
            that.defaultOpen.push(group.id);
            if (onlyGroup.indexOf(group.parentId) < 0) {
              that.menuData.push(group);
            }
          }
        } else {
          if (group.level == 0) {
            group.disabled = that.onlyPerson ? true : group.hasPression == 1 ? false : true;
            // !(group.childrens == null || group.childrens.length == 0);
            group.hasLoad = true;
            that.menuData = [group];
            that.defaultOpen.push(group.id);
            group.handleWord = '展开';
            // console.log(group);
          }
        }
        that.menusObj[group.id] = group;
      });
      if (that.defaultSelection && that.treeSet.dialogVisible) {
        that.renderDefault();
      }
    },
    /**
     * 树形菜单选择
     */
    handleNodeClick(obj, node) {
      this.$emit('handleTreeSelection', obj, node, 'node');
    },
    /**
     * 获取当前复选框状态改变的节点，如果被选中，将禁用展开
     */
    getCurrentNode(data, ifChecked) {
      data.disableOpen = ifChecked;
      this.selectedList = this.$refs.tree.getCheckedNodes();
      if (this.treeSet.isSingle && this.selectedList.length > 1) {
        let index = this.selectedList.indexOf(data);
        this.selectedList.splice(1 - index, 1);
        this.$refs.tree.setCheckedNodes(this.selectedList);
      }
    },
    /**
     * 节点展开时，禁用复选框
     */
    nodeOpen(data, self) {
      data.disabled = true;
      // data.disableOpen = true;
      data.handleWord = '收起';
      // data.disableOpen = false;
    },
    /**
     * 节点关闭时，取消复选框的禁用
     */
    nodeClose(data, node, self) {
      // data.disableOpen = true;
      data.disabled = this.onlyPerson ? true : data.hasPression != 1;
      data.handleWord = '展开';
      // data.disableOpen = false;
    },
    /**
     * 关键词搜索
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1 || (data.phoneNumber || '').indexOf(value) !== -1;
    },
    /**
     * 删除已选项
     */
    delSelected(obj) {
      if (obj == 'empty') {
        this.$refs.tree.setCheckedKeys(this.selectedList, false);
        this.selectedList = this.$refs.tree.getCheckedNodes();
      } else {
        let index = this.selectedList.indexOf(obj);
        this.selectedList.splice(index, 1);
        this.$refs.tree.setCheckedNodes(this.selectedList);
      }
    },
    /**
     * 外抛已选的数据
     */
    submitSelected() {
      this.$emit('handleSelectedList', this.treeSet.isSingle ? this.selectedList[0] : this.selectedList);
      this.treeSet.dialogVisible = false;
    },
    /**
     * 渲染回显数据
     */
    renderDefault() {
      let list = this.defaultSelection;
      this.$nextTick(() => {
        this.selectedList = list;
        this.$refs.tree.setCheckedNodes(list);
        list.forEach(li => {
          if (li.employeeClerkId) {
            this.defaultOpen = [li.departmentId];
          } else {
            this.defaultOpen.push(this.menusObj[li.id].parentId);
          }
        });
      });
    }
  },
  mounted() {
    this.getGroupData();
  },
  watch: {
    searchText(newK, old) {
      this.$refs.tree.filter(newK);
    },
    treeSet: {
      handler(newValue, oldValue) {
        if (newValue.dialogVisible) {
          this.renderDefault();
        }
      },
      deep: true
    },
    changed() {
      this.getGroupData(); // 监听到场景变化，重新渲染数据
    }
  }
};
</script>
<style lang="scss">
.p-b-10 {
  padding-bottom: 10px;
}
.transfer-area {
  display: flex;
  margin-bottom: 40px;
  .t-a-select {
    width: 300px;
    height: 415px;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(220, 223, 230, 1);
    border-radius: 4px;
    overflow: hidden;
    &:first-child {
      margin-right: 20px;
    }
    > .title {
      width: 100%;
      height: 42px;
      line-height: 42px;
      background: rgba(245, 247, 250, 1);
      border-bottom: 1px solid rgba(220, 223, 230, 1);
      border-radius: 4px;
      text-indent: 15px;
      color: #303133;
      font-size: 16px;
      .J_del-all {
        font-size: 14px;
        color: #409eff;
        float: right;
        cursor: pointer;
        margin-right: 15px;
      }
    }
    .tree-div {
      width: 100%;
      height: 373px;
      overflow: auto;
      padding: 15px;
      box-sizing: border-box;
      .search-menu {
        margin-top: 20px;
        color: #606266;
        font-size: 14px;
        min-width: 100%;
        display: inline-block !important;
        .el-tree-node {
          .el-tree-node__content {
            height: 36px;
            position: relative;
            .el-tree-node__expand-icon {
              position: absolute;
              right: 0;
              top: 0;
              width: 36px;
              height: 36px;
              padding: 0;
              box-sizing: border-box;
            }
            .custom-tree-node {
              flex: 1;
              height: 100%;
              line-height: 36px;
              .open-btn {
                width: 50px;
                height: 14px;
                color: #409eff;
                float: right;
                text-align: right;
                border-left: 1px solid #dcdfe6;
                margin-top: 11px;
                line-height: 14px;
              }
              &.disable-open {
                z-index: 999;
              }
            }
            &:hover {
              background: none;
            }
          }
        }
      }
      .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background: none;
      }
    }
    .selected-list {
      .list {
        padding: 12px 0;
        display: flex;
        .label {
          flex: 1;
          .iconfont {
            color: #409eff;
            margin-right: 5px;
          }
        }
        .close-btn {
          width: 16px;
          height: 16px;
          line-height: 18px;
          text-align: center;
          cursor: pointer;
          border-radius: 100%;
          font-size: 8px;
          vertical-align: middle;
          &:hover {
            color: #fff;
            background: #909399;
          }
        }
      }
    }
  }
}
</style>
