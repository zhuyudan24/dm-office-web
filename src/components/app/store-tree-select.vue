<!--
  门店分组下拉选择：
  <store-tree-select
  :brandId="brandId"
  @checkStoreGroupIds="checkStoreGroupIds">
  </store-tree-select>

  checkStoreGroupIds: function(nodes) {
    let that = this;
    that.currentPage = 1;
    that.conditionObj.storeGroupIds = nodes;
    that.getTableList();
  },
 -->
<template>
  <el-popover placement="bottom" style="min-width: 232px" v-model="storeVisible">
    <div class="select-tree-wrap">
      <el-tree :data="storeData" node-key="groupId" ref="storeTree" show-checkbox default-expand-all :props="defaultProps" :expand-on-click-node="false" @check="checkStore"></el-tree>
    </div>
    <div class="flex-column item-cell-select inline-block m-l-10" slot="reference">
      <div class="depart-item-wrap">
        <div style="width: 131px;" class="el-select el-select--large depart-item-content">
          <span class="font-14 color-c0c4cc p-l-10" style="display: inline-block;line-height: 32px;color: #c0c4cc;" v-if="!storeGroupIds.length">请选择门店分组</span>
          <div class="el-select__tags" style="max-width: 181px;">
            <span>
              <template v-for="(item, index) in storeGroupIds">
                <span class="el-tag el-tag--info el-tag--small" :key="index">
                  <span class="el-select__tags-text">{{ item.name || item.storeName }}</span
                  ><!-- <i class="el-tag__close el-icon-close" @click.stop="delDepart(index, storeGroupIds)"></i> -->
                </span>
              </template>
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-popover>
</template>
<script>
import { getRequest } from '@/api/api';
import errMsg from '@/common/js/error';
export default {
  name: 'store-tree-select',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    },
    activeGroupId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      appScene: 2, // 1:带权限，2：不带权限
      projectName: '', // 当前项目名
      activeBrand: this.brandId,
      activeGroup: this.activeGroupId, // 传递的品牌分组 id
      storeVisible: false,
      storeGroupIds: [],
      storeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },

  methods: {
    /**
     *  选择 tree 节点,获取选择节点信息
     */
    checkStore: function(e) {
      let that = this;
      that.storeGroupIds = that.$refs.storeTree.getCheckedNodes();
      that.$emit('checkStoreGroupIds', that.$refs.storeTree.getCheckedNodes());
    },

    /**
     * 简单数组-->父子数组对象
     */
    treeData(data) {
      let tree = data.filter(father => {
        //循环所有项
        let branchArr = data.filter(child => {
          return father.groupId == child.parentId; //返回每一项的子级数组
        });
        if (branchArr.length > 0) {
          father.children = branchArr; //如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.groupId == 0; //返回第一层
      });
      return tree;
    },

    /**
     * 获取门店分组
     */
    getStoreGroup() {
      let that = this;
      let para = {
        appScene: that.appScene
      };
      getRequest('/haoban-manage-web/dept/deptList', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              that.treeData(resData.result);
              resData.result.forEach(ele => {
                if (ele.groupId == that.activeGroupId) {
                  that.storeData = [ele];
                }
              });
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
  watch: {
    brandId: function(newData, oldData) {
      const that = this;
      if (!!newData) {
        that.activeBrand = newData;
        that.checkStore();
        that.getStoreGroup();
      }
    },
    activeGroupId: function(newData, oldData) {
      let that = this;
      if (!!newData) {
        that.activeGroup = newData;
      }
    }
  },
  mounted() {
    const that = this;
    if (!!that.brandId) {
      that.activeBrand = that.brandId;
      that.activeGroup = that.activeGroupId;
      that.checkStore();
      that.getStoreGroup();
    }
  }
};
</script>
<style lang="less" scoped>
.depart-item-content {
  width: 213px;
  height: 32px;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
  box-sizing: border-box;
}

.select-tree-wrap {
  max-height: 300px;
  overflow-y: auto;
}
.item-cell-select {
  /deep/ .el-select__tags {
    white-space: nowrap;
    overflow: hidden;
  }
}
</style>
