<template>
  <div class="per-set-div">
    <el-form label-width="150px">
      <el-form-item label="当前范围:">
        <span>{{ groupInfo.label }}</span>
      </el-form-item>
      <el-form-item label="设置可见范围(员工):">
        <ul class="particular-list">
          <template v-for="(li, index) in visibleList">
            <li class="item person-item" v-if="li.employeeClerkId" :key="index + '_' + li.id">
              <img :src="li.headPic" v-if="!!li.headPic" />
              <div class="replace-head-img" v-else>
                <i class="iconfont icon-yewuduanmorentouxian"></i>
              </div>
              <p class="name">{{ li.label }}</p>
              <i class="el-icon-circle-close" @click="delCurrent(li, 'visibleList')"></i>
            </li>
          </template>
          <li class="item J_add-btn" @click="callPerSelector"><i class="el-icon-plus"></i></li>
        </ul>
      </el-form-item>
      <el-form-item label="设置可见范围(门店):">
        <ul class="particular-list">
          <template v-for="(li, index) in visibleStoreList">
            <li class="item group-item" :key="index + '_' + li.id">
              {{ li.label }}
              <i class="el-icon-circle-close" @click="delCurrent(li, 'visibleStoreList')"></i>
            </li>
          </template>
          <li class="item J_add-btn" @click="callSelector"><i class="el-icon-plus"></i></li>
        </ul>
      </el-form-item>
    </el-form>
    <p class="m-t-20">
      <el-button type="primary" @click="setSharedGroupVisible">确定</el-button>
      <el-button @click="cancelSet">取消</el-button>
    </p>
    <vue-select-store ref="storeSelector" :defaultList="visibleStoreList" @handleSelectedList="handleSelectedList" :treeSet="treeSet" selectType="store"></vue-select-store>
    <vue-select-employee :defaultSelection="visibleList" ref="selectEmployee" :onlyPerson="true" @handleSelectedList="handlePerSelectedList" :treeSet="perTreeSet" :changed="changed"></vue-select-employee>
  </div>
</template>
<script>
import { getRequest, postJson } from '@/api/api';
import vueSelectStore from 'components/common/vueSelectStore';
import vueSelectEmployee from 'components/common/vueSelectEmployee';
export default {
  name: 'permission-set',
  components: {
    vueSelectStore,
    vueSelectEmployee
  },
  props: {
    groupInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visibleList: [],
      visibleStoreList: [],
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: false // 是否单选
      },
      perTreeSet: {
        isSelectPerson: true,
        dialogVisible: false,
        isSingle: false // 是否单选
      },
      dialogVisible: true,
      changed: ''
    };
  },
  methods: {
    getVisibleRange() {
      let that = this;
      let group = that.groupInfo;
      let paramas = {
        sharedContactGroupId: group.sharedContactGroupId
      };
      getRequest('/haoban-manage-web/shared-contact/get-shared-group-visible-range', paramas)
        .then(res => {
          if (res.data.errorCode == 1) {
            // that.visibleList = res.data.result || [];
            that.formatList(res.data.result);
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
    formatList(list) {
      let that = this;
      let perList = [];
      let storeList = [];
      list.forEach(li => {
        li.label = li.name;
        // 根据type值判断是门店架构下的门店还是行政架构下的人，分别放到对应列表中
        if (li.type == 1) {
          li.employeeClerkId = li.id;
          perList.push(li);
        } else {
          li.storeId = li.id;
          storeList.push(li);
        }
      });
      that.visibleList = perList;
      that.visibleStoreList = storeList;
    },
    delCurrent(item, list) {
      let idx = this[list].indexOf(item);
      this[list].splice(idx, 1);
    },
    callSelector() {
      this.treeSet.dialogVisible = true;
    },
    callPerSelector() {
      this.changed = 'permission';
      this.perTreeSet.dialogVisible = true;
    },
    setSharedGroupVisible() {
      let that = this;
      let allList = that.visibleList.concat(that.visibleStoreList);
      let arr = [];
      allList.forEach(li => {
        let type = li.employeeClerkId ? 1 : 2;
        arr.push({
          id: li.id,
          type
        });
      });
      let params = {
        visibleMemberList: [
          {
            memberList: arr,
            sharedContactGroupId: that.groupInfo.id
          }
        ]
      };
      postJson('/haoban-manage-web/shared-contact/set-shared-group-visible-range', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: res.data.message
            });
            that.getVisibleRange();
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
    cancelSet() {
      this.$emit('cancelSet');
    },
    handleSelectedList(list) {
      this.visibleStoreList = list;
    },
    handlePerSelectedList(list) {
      this.visibleList = list;
    }
  },
  beforeMount() {
    this.getVisibleRange();
  },
  /* eslint-disable */
  mounted() {

  }
};
</script>
<style lang="scss">
.per-set-div {
  width: 100%;
  height: 690px;
  background: #fff;
  padding: 30px;
  box-sizing: border-box;
  .particular-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    .item {
      position: relative;
      margin-right: 24px;
      width: 40px;
      display: flex;
      flex-direction: column;
      margin-bottom: 30px;
      .el-icon-circle-close {
        position: absolute;
        font-size: 16px;
        color: #808995;
        right: -8px;
        top: -8px;
        cursor: pointer;
      }
      img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
      }
      .replace-head-img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        line-height: 40px;
        text-align: center;
        color: #fff;
        background: rgba(64, 158, 255, 1);
      }
      .name {
        font-size: 12px;
        text-align: center;
        margin-top: 10px;
        overflow-wrap: break-word;
        line-height: 1.2;
      }
      &.group-item {
        padding: 0 10px;
        width: auto;
        height: 30px;
        line-height: 32px;
        background: rgba(236, 245, 255, 1);
        border: 1px solid rgba(217, 236, 255, 1);
        border-radius: 4px;
        font-size: 12px;
        color: rgba(64, 158, 255, 1);
      }
      &.J_add-btn {
        height: 40px;
        background: rgba(251, 253, 255, 1);
        border: 1px dashed rgba(192, 204, 218, 1);
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-block;
      }
    }
  }
}
</style>
