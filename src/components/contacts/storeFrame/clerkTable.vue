<template>
  <div class="recycle-bin">
    <p class="r-b-top-header">
      <a class="a-href title" @click="goBack">返回</a>
      <el-button v-if="!gicFlag" @click="transClerk('group')" :disabled="selectedList.length == 0">批量转移</el-button>
      <el-button v-if="!gicFlag" @click="transClerk('all')" type="primary">全部转移</el-button>
    </p>
    <el-table :data="storeListData.clerks" @selection-change="selectMember" ref="clerkTable" style="width: 100%">
      <el-table-column type="selection" width="42"></el-table-column>
      <el-table-column label="姓名" prop="name"> </el-table-column>
      <el-table-column label="手机号码" prop="phoneNumber"> </el-table-column>
      <el-table-column label="操作" width="80" prop="clerkCount">
        <template slot-scope="scope">
          <a v-if="!gicFlag" class="a-href" @click="transClerk('single', scope.row)"><i class="el-icon-sort"></i></a>
          <a v-if="!gicFlag" class="a-href" @click="delClerk(scope.row)"><i class="el-icon-delete"></i></a>
        </template>
      </el-table-column>
    </el-table>
    <vue-select-store ref="storeSelector" @handleSelectedList="handleSelectedList" :treeSet="treeSet" :selectType="selectType"></vue-select-store>
  </div>
</template>
<script>
import vueSelectStore from 'components/common/vueSelectStore';
import { postRequest } from '@/api/api';
export default {
  name: 'clerkTbale',
  components: {
    vueSelectStore
  },
  props: {
    store: {
      type: Object,
      required: true
    },
    gicFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      treeSet: {
        isSelectPerson: true,
        dialogVisible: false,
        isSingle: true, // 是否单选
        openNextBool: true // 展开下级不调用接口
      },
      selectType: 'store',
      transArr: [],
      selectedList: [],
      storeListData: {}
    };
  },
  methods: {
    goBack() {
      window.location.reload();
    },
    // 将店员转移到其他们门店
    transClerk(type, clerk) {
      if (type == 'single') {
        this.transArr = [clerk];
      } else if (type == 'all') {
        this.transArr = this.storeListData.clerks;
      } else {
        this.transArr = this.selectedList;
      }
      this.treeSet.dialogVisible = true;
    },
    delClerk(clerk) {
      this.$emit('delClerk', clerk);
    },
    selectMember(arr) {
      this.selectedList = arr;
    },
    handleSelectedList(store) {
      let that = this;
      if (!store.length) {
        return false;
      }
      let arr = [];
      that.transArr.forEach(clerk => {
        arr.push(clerk.employeeClerkId);
      });
      let params = {
        ids: arr.join(','),
        storeId: store[0].id
      };

      postRequest('/haoban-manage-web/emp/batchTransfer', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: '操作成功'
            });
            that.getClerkList();
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
    /**
     * 获取员工列表
     */
    getClerkList() {
      let that = this;
      let params = {
        departmentId: that.store.storeGroupId,
        storeId: that.store.storeId,
        showChild: 1,
        showType: 2,
        pageSize: 200,
        pageNum: 1,
        status: 1,
        isCherk: 1
      };
      postRequest('/haoban-manage-web/emp/findsimplepage', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.storeListData.clerks = res.data.result.list || [];
          } else {
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
    }
  },
  watch: {
    store: function(newData, oldData) {
      const that = this;
      that.storeListData = newData || {};
    }
  },
  mounted() {
    let that = this;
    that.storeListData = that.store || {};
  }
};
</script>
<style lang="scss"></style>
