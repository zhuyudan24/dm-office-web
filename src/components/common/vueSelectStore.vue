<template>
  <el-dialog :title="treeSet.isSelectPerson ? '选择人员' : '选择部门'" width="660px" :visible.sync="treeSet.dialogVisible">
    <div class="transfer-area">
      <div class="select-area t-a-select">
        <p class="title">选择</p>
        <div class="tree-div">
          <div class="input-container">
            <el-input v-model="searchText" placeholder="请输入内容"></el-input>
          </div>
          <div class="select-div" style="width: 100%;">
            <el-select v-model="brandSelection" :disabled="(!!currentBrand ? true : false) || (treeSet.storeType == 'addClerk' ? true : false)" placeholder="请选择品牌" @change="selectBrand" style="width: 100%;margin-top:20px;">
              <el-option v-for="(item, index) in brands" :key="item.id" :label="item.label" :value="index">
                {{ item.label }}
              </el-option>
            </el-select>
          </div>
          <!-- :default-expanded-keys="defaultOpen" -->
          <el-tree class="search-menu" node-key="id" ref="tree" :check-strictly="true" :data="menuData" show-checkbox :highlight-current="true" :expand-on-click-node="false" icon-class="open-child" :props="myProps" :filter-node-method="filterNode" @check-change="getCurrentNode" @node-expand="nodeOpen" @node-collapse="nodeClose" @node-click="handleNodeClick">
            <span class="custom-tree-node" :class="data.disableOpen ? 'disable-open' : ''" slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <div class="open-btn" v-if="!!data.childrens">
                <!--  && !!data.childrens[0].groupId"  && !!data.childrens.length-->
                <el-button :datatype="data.disableOpen" @click.self.prevent="nodeOpen(data, node)" :disabled="data.disableOpen" type="text" size="small">下级</el-button>
              </div>
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
import { getRequest } from '@/api/api';
import { _throttle } from '@/common/js/public';
export default {
  name: 'vue-select-employee',
  props: {
    treeSet: {
      type: Object,
      default() {
        return {
          isSelectPerson: true,
          dialogVisible: false,
          isSingle: false // 是否单选
        };
      }
    },
    currentBrand: {
      // 当前传入的品牌 id
      type: String,
      default() {
        return '';
      }
    },
    selectType: {
      type: String,
      default: 'all' // all 所有都可选, person 只选人， store 只选门店, group 只选分组, group-store 选门店/分组
    },
    forbidenList: {
      // 传入需要禁用的分组的id
      type: Array,
      default() {
        return [];
      }
    },
    visibleNodes: {
      type: [Array, String], // 设置仅可见的节点，如果不传则默认展示所有
      default() {
        return '';
      }
    },
    defaultList: {
      // 回显数据
      type: Array,
      default() {
        return [];
      }
    },
    appScene: {
      // 使用场景
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      searchText: '',
      myProps: {
        children: 'childrens',
        label: 'label',
        disabled: 'disabled'
      },
      menuData: [],
      menusObj: {},
      defaultOpen: [], // 默认展开节点的 key 的数组
      selectedList: [], // 已经选择的数据集合
      brandSelection: 0, // 看了代码发现这里是取的索引值,不是品牌 id
      brands: [],
      hasOpened: false,
      firstRender: true, // 判断是否是第一次渲染数据，用于切换品牌时判断
      renderFlag: true, // 应用判断渲染
      storeList: []
    };
  },
  methods: {
    /**
     * 获取分组架构
     */
    getGroupData() {
      let that = this;
      let params = {
        isStoreGroup: 1,
        appScene: that.appScene
      };
      getRequest('/haoban-manage-web/dept/deptList', params)
        .then(res => {
          let treeData = [];
          if (res.data.errorCode == 1) {
            treeData = res.data.result || [];
            that.formatGroupData(treeData);
          }
        })
        .catch(e => {});
    },
    /**
     * 处理获取分组数据
     */
    formatGroupData(data) {
      let that = this;
      let selType = that.selectType; // 传入：选择门店的类型（all 所有都可选, person 只选人，store 只选门店, group 只选分组, group-store 选门店/分组）
      let fbdList = that.forbidenList; // 传入： 需要禁用的分组的 id
      that.menusObj = {};
      data.forEach(group => {
        group.label = group.name || ''; // 新增
        group.id = group.groupId || ''; // 新增
        group.disableOpen = false; // 新增
        let isForbiden = !!(fbdList.indexOf(group.id) > -1); // 判断当前分组是否在禁用分组列表内
        group.disabled = group.hasPression != 1 || selType == 'person' || selType == 'store' || isForbiden; // 新增

        let arr = [];
        data.forEach(child => {
          child.disableOpen = false;
          let childForbid = fbdList.indexOf(child.id) > -1;
          child.disabled = child.hasPression != 1 || selType == 'person' || selType == 'store' || childForbid;
          if (child.parentId == group.groupId) {
            arr.push(child);
          }
        });
        // 把简单 json 数组转换成 父子关系的 json
        if (arr.length > 0) {
          group.childrens = arr;
        } else if (group.level != 0 && that.selectType != 'group') {
          group.childrens = [{ label: '' }]; // 默认有子级 { label: '' }
          group.isLast = true;
        }
        if (group.level == 0) {
          // 禁用分组 (group.childrens && group.childrens.length > 0) ||
          group.disabled = group.hasPression != 1 || selType == 'person' || selType == 'store' || isForbiden;
          // console.log(group.disabled, group.childrens && group.childrens.length > 0, group.hasPression != 1 || selType == 'person' || selType == 'store' || isForbiden);
          group.hasLoad = true;
          that.brands.push(group);
          if (group.childrens) {
            that.defaultOpen.push(group.id);
          }
        }
        that.menusObj[group.id] = group;
      });
      // console.log('brands:', that.brands, that.treeSet.groupId);
      let brandSelectionId = that.treeSet.groupId ? that.treeSet.groupId : that.brands[0].id;
      that.brands.forEach((el, idx) => {
        if (el.id == brandSelectionId || el.brandId == brandSelectionId) {
          that.brandSelection = idx;
        }
        // console.log(el, that.brandSelection);
      });
      that.menuData = [that.brands[that.brandSelection]]; // 设置树形结构数据
      // console.log(that.menuData);
      if (selType != 'group') {
        // && that.treeSet.storeType != 'addClerk'
        this.getStoreList(that.menuData[0]);
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
    getCurrentNode: _throttle(function(data, ifChecked, son) {
      // console.log('复选框状态变化:', data, ifChecked, son); // 之前会重复触发，原来是每次变化触发了监听 defaultList 方法
      let that = this;
      data.disableOpen = ifChecked;
      that.$nextTick(() => {
        that.selectedList = that.$refs.tree.getCheckedNodes();
        if (that.treeSet.isSingle && that.selectedList.length > 1) {
          let index = that.selectedList.indexOf(data);
          that.selectedList.splice(1 - index, 1);
          that.$refs.tree.setCheckedNodes(that.selectedList);
        }
      });
    }, 100),
    /**
     * 节点展开时，禁用复选框
     */
    nodeOpen(data, node) {
      // 如果是第一级（顶级分组即品牌）展开下级，禁用复选框
      if (data.level == 0) {
        data.disabled = true;
      }
      // 如果不是第一级不是门店，展开下级，禁用复选框
      if (data.level != 0 && data.type != 1) {
        data.disabled = true;
      }
      // 如果是首次追加的空数据，先把 childrens 清空;
      if (!!data.childrens.length && data.childrens[0].label == '') {
        data.childrens = [];
        // console.log(data, data.childrens[0]);
        this.$forceUpdate();
      }
      // data.disabled = true;
      // console.log('节点展开时，禁用复选框:', this.menuData, data, !data.hasLoad, this.selectType != 'group', this.treeSet.storeType, this.treeSet.openNextBool);
      // openNextBool 没有设置 ， 并且当前选择不是选分组， 并且不是添加店员
      if (!data.hasLoad && this.selectType != 'group' && this.treeSet.storeType != 'addClerk' && !this.treeSet.openNextBool) {
        this.getStoreList(data, 'openFlag');
        data.hasLoad = true; // 标记为已经请求过子分组数据，下次展开不再请求
      }
      // openNextBool 已经设置 ， 并且当前选择不是选分组， 并且不是添加店员
      if (!data.hasLoad && this.selectType != 'group' && this.treeSet.storeType != 'addClerk' && this.treeSet.openNextBool) {
        this.getStoreList(data, 'openFlag');
        data.hasLoad = true; // 标记为已经请求过子分组数据，下次展开不再请求
      }
      if (this.treeSet.storeType == 'addClerk' && !data.hasLoad) {
        this.getStoreList(data, 'openFlag');
        data.hasLoad = true; // 标记为已经请求过子分组数据，下次展开不再请求
      }
    },
    /**
     * 获取门店列表
     */
    getStoreList(parent, flag) {
      let that = this;
      let params = {
        storeGroupId: parent.groupId,
        showChild: 0,
        pageNumber: 1,
        pageSize: 1000000000, // 因为获取门店列表做了分页，所以取了一个极限值
        showType: 2
      };
      getRequest('/haoban-manage-web/store/findSimplePage', params)
        .then(res => {
          let storeList = [];
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (parent.level != 0) {
              parent.disabled = (!!resData.result.list && !!flag) || parent.hasPression != 1 || that.selectType == 'person' || that.selectType == 'store' ? true : false;
            }
            // console.log(parent.disabled);
            that.$forceUpdate();
            storeList = resData.result.list == null ? [] : resData.result.list;
            that.storeList = resData.result.list == null ? [] : resData.result.list;
            if ((!resData.result.list || !resData.result.list.length) && (!!parent.childrens.length && parent.childrens[0].label == '')) {
              // 如果点击下级，不存在门店或店员，childrens = []
              // console.log(parent);
              // if (!!parent.childrens.length && parent.childrens[0].label == '') {
              parent.childrens = [];
              // }
              that.$forceUpdate();
              return false;
            }
            that.formatStoreList(storeList, parent);
            if (that.$refs.tree) {
              that.renderDefault();
            }
            that.renderFlag = false; // 应用中使用：设置默认参数，默认情况传入品牌的 groupId ,不再去请求门店数据，切换的时候再去请求
          }
        })
        .catch(e => {});
    },

    /**
     * 处理获取门店列表的数据
     */
    formatStoreList(list, parent) {
      let that = this;
      let type = this.selectType;
      list.forEach(li => {
        li.id = li.storeId;
        li.label = li.storeName;
        li.hasLoad = true;
        li.disabled = !!(type == 'person');
        if (li.clerks.length && (type == 'all' || type == 'person')) {
          li.clerks.forEach(clerks => {
            clerks.label = clerks.name;
            clerks.id = clerks.employeeClerkId;
          });
          li.childrens = li.clerks;
        }
      });
      that.appendStore(list, parent);
    },
    // 追加当前门店
    appendStore(list, parent) {
      let that = this;
      if (parent.isLast) {
        // 应该是判断是不是最后一层
        parent.childrens = list;
      } else {
        // 现在问题是每次都追加数据了
        let arr = !!parent.childrens ? parent.childrens : [];
        arr = arr.concat(list);
        let hash = {};
        // 去重数组对象
        arr = arr.reduce(function(item, next) {
          hash[next.id] ? '' : (hash[next.id] = true && item.push(next));
          return item;
        }, []);
        parent.childrens = JSON.parse(JSON.stringify(arr));
        // parent.isLast = true; // 追加后重新设置isLast
        that.$forceUpdate();
      }
      if (parent.childrens.length > 0 && this.firstRender) {
        this.firstRender = false;
        this.defaultOpen.push(parent.id);
      }
      that.$forceUpdate();
      //that.$nextTick(() => {
      // that.menuData = JSON.parse(JSON.stringify(that.menuData));
      //}); // this.renderDefault();
    },
    /**
     * 节点关闭时，取消复选框的禁用
     */
    nodeClose(data, node, self) {
      let selType = this.selectType;
      if (data.storeId) {
        data.disabled = selType == 'person';
      } else {
        let fbdList = this.forbidenList;
        let isForbiden = fbdList.indexOf(data.id) > -1;
        data.disabled = data.hasPression != 1 || isForbiden || selType == 'store' || selType == 'person';
      }
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
      let that = this;
      if (obj == 'empty') {
        for (let index = 0; index < that.selectedList.length; index++) {
          that.selectedList.splice(index, 1);
          index--;
        }
        this.$refs.tree.setCheckedNodes(that.selectedList);
      } else {
        let index = this.selectedList.indexOf(obj);
        this.selectedList.splice(index, 1);
        this.$refs.tree.setCheckedNodes(this.selectedList);
      }
    },
    /**
     * 外抛已选的数据
     */
    submitSelected(e) {
      e.preventDefault();
      this.$emit('handleSelectedList', this.selectedList);
      this.treeSet.dialogVisible = false;
    },
    /**
     * 选择品牌
     */
    selectBrand(val) {
      let that = this;
      that.$nextTick(() => {
        that.menuData = [that.brands[val]]; // 默认品牌数据为分组第一层数据
        that.brands[val].hasLoad = true;
        that.firstRender = true;
        if (that.selectType != 'group') {
          // 如果选择的不是 group （即：只选分组）
          that.getStoreList(that.menuData[0]);
        }
        that.renderDefault();
      });
    },
    /**
     * 渲染回显数据
     */
    renderDefault() {
      let that = this;
      that.$nextTick(() => {
        let list = that.selectedList;
        if (!!list.length) {
          that.$refs.tree.setCheckedNodes(list);
        }
        list.forEach(item => {
          if (item.employeeClerkId) {
            that.defaultOpen = [item.storeId];
          } else if (!item.storeId && !item.employeeClerkId) {
            if (!!that.menusObj[item.id]) {
              that.defaultOpen.push(that.menusObj[item.id].parentId);
            }
          }
        });
      });
    }
  },
  beforeMount() {
    this.getGroupData();
  },
  /* eslint-disable */
  mounted() {
    // this.renderDefault();
    // 为了切换路由后可以重新选择品牌
    let that = this;
    if (!!that.currentBrand) {
      setTimeout(() => {
        that.brands.forEach((ele,index) => {
          if(ele.id == that.currentBrand) { // 目前有些问题，brands 中只有groupId ，没有 brandId
            that.brandSelection = index; // 之前 that.brandSelection 都是取得索引值，不是 id 值
          }
        })
        that.selectBrand(that.brandSelection);
      }, 500);
    }
  },
  watch: {
    searchText(newK, old) {
      this.$refs.tree.filter(newK);
    },
    defaultList: {
      handler(newValue, oldValue) {
        // 每次选择确认后，发现后端接口返回的数据和，这时候确认后返回的数据是不一样的；
        // console.log("defaultList 变化了:",newValue,oldValue); // 发现每次复选框状态变了这里也触发了，所以修改
        let that = this;
        that.selectedList = JSON.parse(JSON.stringify(newValue));
        if (!!that.$refs.tree) {
          that.renderDefault();
        }
      }
    },
    treeSet: {
      handler(newValue, oldValue) {
        let that = this;
        if (newValue.dialogVisible && !that.hasOpened) {
          that.hasOpened = true;
          that.renderDefault();
        }
        // 搜素的时候如果传入的有 groupId
        if (!!newValue.groupId) {
          that.brands.forEach((ele,index) => {
            if(ele.brandId == newValue.groupId || ele.id == newValue.groupId) { // 目前有些问题，brands 中只有groupId ，没有 brandId
              that.brandSelection = index; // 之前 that.brandSelection 都是取得索引值，不是 id 值
            }
          })
          that.$nextTick(function () {
            that.selectBrand(that.brandSelection);
          })
        }
        // 处理关闭时第一级为禁用的情况,再次打开第一级禁用了(选人的需要禁用分组)
        if (!!that.menuData.length && that.selectType != 'person' && that.selectType != 'store' && !that.currentBrand && !!newValue.groupId) {
          that.menuData[0].disabled = false;
        }
      },
      deep: true
    },
    // 应用中使用到，需要禁止选择品牌，品牌的 brandId 外部传进来的需要是 groupId，然后对比当前组件内的  groupId；
    currentBrand: function(newData, oldData) {
      let that = this;
      if (!!newData) {
        that.brands.forEach((ele,index) => {
          if(ele.id == newData) { // 目前有些问题，brands 中只有groupId ，没有 brandId
            that.brandSelection = index; // 之前 that.brandSelection 都是取得索引值，不是 id 值
          }
        })
        that.$nextTick(function () {
          that.selectBrand(that.brandSelection);
        })
      }
    }
  },
  destroyed() {
    this.brandSelection = '';
  },
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
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      .search-menu {
        margin-top: 20px;
        color: #606266;
        font-size: 14px;
        min-width: 100%;
        display: inline-block !important;
        .el-tree-node {
          .el-tree-node__content {
            position: relative;
            height: 36px;
            max-width: 263px;
            overflow: hidden;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            .open-child {
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
                position: absolute;
                right: 0px;
                top: 0px;
                display: block;
                width: 50px;
                height: 14px;
                color: #409eff;
                float: right;
                text-align: right;
                border-left: 1px solid #dcdfe6;
                margin-top: 11px;
                line-height: 14px;
                z-index: 2;
                pointer-events: none;
                background: #fff;
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
