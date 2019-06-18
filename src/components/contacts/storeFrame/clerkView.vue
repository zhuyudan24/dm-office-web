<template>
  <div>
    <div class="sf-right-button-box common-right-button-box">
      <el-select v-model="storeType" @change="selectByType" size="small">
        <el-option v-for="(type, index) in typeArr" :key="type" :label="type" :value="index"> </el-option>
      </el-select>
      <el-select v-model="storeStatus" @change="selectByStatus" size="small">
        <el-option label="全部状态" value=""></el-option>
        <el-option label="正常" :value="1"></el-option>
        <el-option label="停业整顿" :value="3"></el-option>
      </el-select>
      <span style="vertical-align: middle;" class="J_show-children el-button" size="small"> <el-checkbox class="m-r-10" v-model="showChildMember" @change="setChildMemberShow">显示子成员</el-checkbox><a class="a-href"></a> </span>
    </div>
    <el-table ref="clerkViewTable" class="diy-table" :data="tableData">
      <el-table-column label="门店" width="300">
        <template slot-scope="scope">
          <div>
            <p class="m-b-10">{{ scope.row.storeName }}</p>
            <p><a class="a-href" :href="'#/addClerk?gicFlag=' + gicFlag + '&storeId=' + scope.row.storeId + '&firstLevelId=' + firstLevelId + '&type=addClerk'">新增店员</a></p>
            <!--20190611 v-if="!gicFlag" -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="门店code" prop="storeCode" width="300"></el-table-column>
      <el-table-column min-width="675">
        <template slot="header">
          <ul class="diy-header">
            <li class="name">姓名</li>
            <li class="phone">手机号</li>
            <li class="position">职位</li>
            <li class="status">状态</li>
            <li style="width: 200px;">操作</li>
          </ul>
        </template>
        <template slot-scope="scope">
          <ul>
            <li v-for="(clerk, index) in scope.row.clerks" :key="clerk.employeeClerkId" class="clerk-obj-li">
              <div class="clerk-name clerk-cell">
                <el-radio :value="1" :label="clerk.isManager" @change="changeManager(scope.row, clerk)">{{ clerk.name }}</el-radio>
                <span class="manager" v-if="clerk.isManager == 1">店长</span>
              </div>
              <div class="clerk-cell clerk-phone">{{ clerk.phoneNumber }}</div>
              <div class="clerk-cell clerk-position">{{ clerk.positionName || '--' }}</div>
              <div class="clerk-cell clerk-status">
                <div class="status-icon" :class="clerk.status == 1 ? 'is-active' : ''">
                  <i class="iconfont icon-shouji"></i>
                </div>
              </div>
              <div class="clerk-cell clerk-handle">
                <a class="a-href m-r-20" :href="'#/addClerk?gicFlag=' + gicFlag + '&storeId=' + scope.row.storeId + '&clerkId=' + clerk.employeeClerkId + '&firstLevelId=' + firstLevelId + '&type=addClerk'">编辑</a>
                <el-popover placement="top" width="160" v-model="clerk.popVisible"
                  ><!--20190611 v-if="!gicFlag" -->
                  <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="cancelDelTag(index, clerk, scope.row)">取消</el-button>
                    <el-button type="primary" size="mini" @click="toDelTag(index, clerk, scope.row)">确定</el-button>
                  </div>
                  <el-button slot="reference" class="p-l-10" type="text">
                    删除
                  </el-button>
                </el-popover>
                <el-button v-if="clerk.isManager != 1" type="text" size="small" class="m-l-10" @click="toTransfer(index, clerk, scope.row)">转移</el-button>
              </div>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
    <vue-select-store ref="storeSelector" selectType="store" :defaultList="defaultList" :treeSet="treeSet" @handleSelectedList="handleSelectedList"></vue-select-store>
  </div>
</template>

<script>
import { getRequest } from '@/api/api';
import vueSelectStore from 'components/common/vueSelectStore';
export default {
  name: 'clerkView',
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    firstLevelId: {
      type: [String, Number],
      default: ''
    },
    gicFlag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vueSelectStore
  },
  data() {
    return {
      tableH: window.screen.availHeight - 440 - 180 - 70,
      storeType: 0,
      typeArr: ['全部类型', '自营', '联营', '代理(加盟)', '代销', '托管'],
      storeStatus: '',
      showChildMember: false,
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true, // 是否单选
        groupId: '',
        storeType: '',
        openNextBool: true // 展开下级不调用接口
      },
      defaultList: [],
      transferObj: {}
    };
  },
  methods: {
    // 确认转移
    handleSelectedList(list) {
      let that = this;
      // console.log(list);
      if (!!list && !!list.length) {
        that.postTrans(list);
      }
    },
    postTrans(list) {
      let that = this;
      let params = {
        id: that.transferObj.employeeClerkId,
        storeId: list[0].id,
        oldStoreId: that.transferObj.storeId
      };
      getRequest('/haoban-manage-web/emp/clerkMove', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: '转移成功'
            });
            that.$emit('refreshClerkData');
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
     * 设置是否显示子成员
     */
    setChildMemberShow() {
      this.$emit('setChildMemberShow', this.showChildMember);
    },
    /**
     * 更换店长
     */
    changeManager(row, clerk) {
      let that = this;
      let exMananger = {};
      row.clerks.some(per => {
        if (per.isManager == 1) {
          // per.isManager = 0;
          exMananger = per;
        }
        return per.isManager == 1;
      });
      let params = {
        employeeClerkId: clerk.employeeClerkId,
        managerId: exMananger.employeeClerkId
      };
      getRequest('/haoban-manage-web/emp/setManager', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            exMananger.isManager = 0;
            clerk.isManager = 1;
            that.$message.success({
              message: '操作成功'
            });
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
     * 根据状态筛选店铺
     */
    selectByStatus(val) {
      this.$emit('selectByStatus', val);
    },

    /**
     * 根据店铺类型筛选店铺
     */
    selectByType(type) {
      let storeType = '';
      if (type != 0) {
        storeType = type * 1 - 1;
      }
      this.$emit('selectByType', storeType);
    },

    /**
     * 删除店员
     */
    delClerk(clerk, store) {
      // console.log(clerk, clerk.employeeClerkId, store);
      let that = this;
      that
        .$confirm('是否要删除该员工？', '提示', {
          type: 'warning'
        })
        .then(() => {
          let params = {
            ids: clerk.employeeClerkId
          };
          that.postDel(params, store, clerk);
        });
    },

    /**
     * 删除 -- api
     */
    postDel(params, store, clerk) {
      const that = this;
      getRequest('/haoban-manage-web/emp/del', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            store.clerks.forEach(ele => {
              if (ele.employeeClerkId == clerk.employeeClerkId) {
                store.clerks.splice(store.clerks.indexOf(ele), 1);
              }
            });
            that.$message.success({
              duration: 1000,
              message: '操作成功'
            });
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
    },

    /**
     * 删除 -- 取消
     */
    cancelDelTag(index, row, item) {
      row.popVisible = false;
    },

    /**
     * 删除 -- 确定
     */
    toDelTag(index, row, item) {
      const that = this;
      let ids = '';
      ids = row.employeeClerkId;
      let params = {
        ids
      };
      that.postDel(params, item, row);
    },
    /**
     * 转移店员
     */
    toTransfer(index, row, item) {
      let that = this;
      // console.log(row);
      that.transferObj = row;
      that.treeSet.storeType = 'addClerk'; // 原来编辑的时候需要的字段，禁止切换品牌
      that.treeSet.groupId = that.firstLevelId;
      that.defaultList = [
        {
          id: row.storeId,
          label: row.storeName
        }
      ];
      that.treeSet.dialogVisible = true;
    },
    // 新增店员
    addClerkBtn(type, row) {
      this.$router.push({
        path: '/addClerk',
        query: {
          storeId: row.storeId,
          firstLevelId: this.firstLevelId,
          type: type
        }
      });
    }
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
/* eslint-disable */
.el-button {
  /* eslint-disable */
  &.J_show-children {
    /*eslint-disable*/
    vertical-align: top;
    margin-left: 0;
    padding: 0 15px;
    line-height: 29px;
    height: 32px;
    /deep/ .el-checkbox {
      /*eslint-disable*/
      vertical-align: 0;
      &.is-checked {
        /*eslint-disable*/
        .el-checkbox__label {
          color: #409eff;
        }
      }
      .el-checkbox__input {
        vertical-align: -2px;
      }
    }
  }
}
</style>
