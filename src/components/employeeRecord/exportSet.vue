<template>
  <div class="export-set-container">
    <div class="title">已选择字段<span>导出的列表中将按顺序显示这些字段（可拖拽排序）</span></div>
    <div class="cho-list">
      <draggable v-model="checkedList">
        <template v-for="(item, index) in checkedList">
          <div class="cho" v-if="item.checked" :key="item.fieldCode + index">{{ item.fieldName }} <i class="el-icon-circle-close" @click="deleteField(index)"></i></div>
        </template>
      </draggable>
    </div>
    <div class="cho-area">
      <div class="title">选择需要导出的字段</div>
      <div class="cho-area-group">
        <div class="group-div">
          <div class="group-title"></div>
          <ul class="group-son-list">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </ul>
        </div>
        <div class="group-div" v-for="(group, index) in tempList" :key="group.fieldCode + index">
          <div class="group-title">{{ group.title }}</div>
          <ul class="group-son-list">
            <template v-for="items in origin">
              <li :key="items.fieldCode" v-if="items.parentCode == group.fieldCode">
                <el-checkbox :label="items.fieldName" :key="items.fieldCode" v-model="items.checked" @change="checkThis(items)">{{ items.fieldName }}</el-checkbox>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <div class="handle-cho-btn">
      <el-button type="primary" class="export-btn" @click="exportCho" :disabled="checkedList.length < 1"><i class="iconfont icon-icon_yunxiazai p-r-6"></i>导出</el-button>
      <el-button @click="cancelCho">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getRequest } from '@/api/api';
import draggable from 'vuedraggable';
export default {
  name: 'export-set',
  components: {
    draggable
  },
  data() {
    return {
      tempList: [],
      checkList: [],
      origin: [],
      checkAll: false,
      isIndeterminate: false,
      checkedList: []
    };
  },
  methods: {
    /**
     * 删除已选
     */
    deleteField(index) {
      let that = this;
      that.checkedList.splice(index, 1);
      let listData = that.checkedList.map(item => item.fieldCode);
      that.origin.forEach(function(ele, index) {
        if (listData.includes(ele.fieldCode)) {
          ele.checked = true;
        } else {
          ele.checked = false;
        }
      });
      that.checkHalf();
    },

    /**
     * 检查全选和半选
     */
    checkHalf() {
      let that = this;
      if (that.checkedList.length === 0) {
        that.isIndeterminate = false;
        return false;
      }
      if (that.checkedList.length === that.origin.length) {
        that.isIndeterminate = false;
      } else {
        that.isIndeterminate = true;
      }
    },
    checkThis(items) {
      let that = this;
      // 将勾选的字段放入已勾选列表
      if (items.checked) {
        that.checkedList.push(items);
      } else {
        that.checkedList.forEach((item, index) => {
          if (item.fieldCode === items.fieldCode) {
            that.checkedList.splice(index, 1);
          }
        });
      }
      that.checkHalf();
    },
    handleCheckAllChange(val) {
      // 全选勾选框
      let that = this;
      this.checkedList = [];
      this.origin.forEach((tem, idx) => {
        tem.checked = val;
        if (val) {
          tem.order = idx + 1;
        }
      });
      if (val) {
        that.checkedList = that.origin.slice(0);
      }
      that.checkHalf();
    },
    getTemplate() {
      // 获取模版字段
      let that = this;
      getRequest('/haoban-manage-web/record/employee-find-template', {})
        .then(res => {
          if (res.data.errorCode == 1) {
            that.formatTemplateList(res.data.result);
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
    formatTemplateList(list) {
      // 模版字段按种类分组，按排序字段排序
      let that = this;
      let fieldList = [];
      let origin = [];
      let copyData = list;
      list.forEach(tem => {
        tem.title = tem.fieldName;
        tem.name = tem.fieldName;
        tem.checked = false;
        let arr = [];
        copyData.forEach(li => {
          if (li.parentCode == tem.fieldCode) {
            arr.push(li);
          }
        });
        arr.sort(function(a, b) {
          return a.sort * 1 - b.sort * 1;
        });
        if (arr.length > 0) tem['childrens'] = arr;
        if (tem.parentCode == 0) {
          fieldList.push(tem);
        }
      });
      fieldList.sort(function(a, b) {
        return a.sort * 1 - b.sort * 1;
      });
      fieldList.forEach(group => {
        origin = origin.concat(group.childrens);
      });
      that.origin = origin;
      that.tempList = fieldList;
    },
    cancelCho() {
      // 取消选择
      this.origin.forEach(tem => {
        tem.checked = false;
      });
      this.$emit('cancelCho');
    },
    exportCho() {
      // 导出
      let arr = [];
      let that = this;
      that.checkedList.forEach(tem => {
        if (tem.checked) {
          arr.push({
            fieldCode: tem.fieldCode,
            fieldName: tem.fieldName
          });
        }
      });
      let params = {};
      params['exportTitleContent'] = JSON.stringify(arr);
      let local = window.location.origin;
      if (local.indexOf('localhost') != -1) {
        local = 'http://www.gicdev.com';
      }
      location.href = local + '/haoban-manage-web/record/define-export?exportTitleContent=' + JSON.stringify(arr);
      this.$emit('cancelCho');
    }
  },
  beforeMount() {
    this.getTemplate();
  }
};
</script>
<style lang="scss">
.export-set-container {
  background: #fff;
  padding: 25px;
  .title {
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(48, 49, 51, 1);
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(144, 147, 153, 1);
      margin-left: 20px;
    }
  }
  .cho-list {
    > div {
      padding: 34px 0;
      border-bottom: 1px solid #e4e7ed;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 44px;
      .cho {
        position: relative;
        padding: 0 15px;
        box-sizing: border-box;
        height: 32px;
        background: rgba(236, 245, 255, 1);
        border: 1px solid rgba(217, 236, 255, 1);
        border-radius: 4px;
        color: #409eff;
        box-sizing: border-box;
        text-align: center;
        line-height: 32px;
        font-size: 12px;
        margin-right: 10px;
        margin-bottom: 20px;
        cursor: pointer;
        &.osen {
          background: rgba(64, 158, 255, 1);
          color: #fff;
        }

        .el-icon-circle-close {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 16px;
          color: #808995;
          cursor: pointer;
          &:hover {
            color: #f56c6c;
          }
        }
      }
    }
  }
  .cho-area {
    margin-top: 60px;
    font-size: 14px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(96, 98, 102, 1);
    .group-div {
      display: flex;
      margin-bottom: 50px;
      &:first-child {
        margin-top: 60px;
      }
      .group-title {
        width: 100px;
        font-weight: 400;
        color: rgba(96, 98, 102, 1);
      }
      .group-son-list {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        li {
          width: 180px;
          margin-bottom: 25px;
        }
      }
    }
  }
  .handle-cho-btn {
    text-align: center;
    .export-btn {
      margin-right: 10px;
      .iconfont {
        color: #fff;
        margin-left: 5px;
      }
    }
  }
}
</style>
