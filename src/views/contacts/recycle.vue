<template>
  <div class="common-set-wrap recycle-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <clerk-table v-if="showClerks" :gicFlag="gicFlag" :store="currentStore" @delClerk="delClerk"></clerk-table>
        <div class="recycle-bin" v-else>
          <div class="r-b-top-header">
            <div class="title">{{ recycleList.length }} 家门店</div>
            <el-input placeholder="请输入门店名" prefix-icon="el-icon-search" v-model="searchKey" @keyup.native="value => toInput(value)">></el-input>
          </div>
          <el-table :data="recycleList" style="width: 100%">
            <el-table-column label="门店名称" prop="storeName"> </el-table-column>
            <el-table-column label="代码" prop="storeCode"> </el-table-column>
            <el-table-column label="类型" prop="storeType">
              <template slot-scope="scope">
                {{ typeArr[scope.row.storeType * 1 + 1] }}
              </template>
            </el-table-column>
            <el-table-column label="地址" prop="postAddress"> </el-table-column>
            <el-table-column label="待处理店员" prop="clerkCount">
              <template slot-scope="scope">
                <a class="a-href" @click="showClerksFn(scope.row)">
                  {{ scope.row.clerks.length }}
                </a>
              </template>
            </el-table-column>
            <el-table-column label="操作" prop="clerkCount">
              <template slot-scope="scope">
                <a v-if="!gicFlag" class="a-href" @click="restore(scope.row)">恢复到门店列表</a>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" v-if="!!total">
            <el-pagination background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="pageNumber" layout="total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import { getRequest } from '@/api/api';
import clerkTable from 'components/contacts/storeFrame/clerkTable';
import navCrumb from '@/components/nav/nav.vue';
import { _debounce } from '@/common/js/public';
import { getGicStatus } from '@/api/gicStatus';
import errMsg from '@/common/js/error';
export default {
  name: 'recycle-bin',
  components: {
    navCrumb,
    clerkTable
  },
  data() {
    return {
      searchKey: '',
      typeArr: ['全部类型', '自营', '联营', '代理(加盟)', '代销', '托管'],
      pageSize: 20,
      pageNumber: 1,
      recycleList: [],
      total: 0,
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '门店架构',
          path: '/storeFrame?showRecycle=0'
        },
        {
          name: '门店回收站',
          path: ''
        }
      ],
      clerks: [],
      showClerks: false,
      currentStore: {},
      brandId: '',
      gicFlag: true // gic 同步字段
    };
  },
  methods: {
    /**
     * 输入
     */
    toInput: _debounce(function(e) {
      let that = this;
      that.pageNumber = 1;
      that.getRecycleList();
    }, 500),
    /**
     * 获取回收站店铺列表
     */
    getRecycleList() {
      let that = this;
      let query = that.$route.query;
      let params = {
        storeName: that.searchKey || '',
        storeGroupId: query.dept,
        showChild: query.showChild * 1,
        showType: 2,
        pageSize: that.pageSize,
        pageNum: that.pageNumber,
        status: 4,
        storeType: query.type
      };
      getRequest('/haoban-manage-web/store/findSimplePage', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.total = res.data.result.total;
            that.recycleList = res.data.result.list || [];
          } else {
            // that.loading = false;
            that.recycleList = [];
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
    restore(store) {
      let that = this;
      that
        .$confirm('确定要恢复到门店列表吗？', '提示', {
          type: 'warning'
        })
        .then(() => {
          let params = {
            status: 1,
            storeId: store.storeId
          };
          getRequest('/haoban-manage-web/store/changeStatus', params)
            .then(res => {
              if (res.data.errorCode == 1) {
                that.searchKey = '';
                that.pageNumber = 1;
                that.getRecycleList();
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
        })
        .catch(e => {});
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRecycleList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getRecycleList();
    },
    showClerksFn(store) {
      this.currentStore = store;
      this.clerks = store.clerks == null ? [] : store.clerks;
      this.showClerks = true;
    },
    /**
     * 删除店员
     */
    delClerk(clerk) {
      let store = this.currentStore;
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
          getRequest('/haoban-manage-web/emp/del', params)
            .then(res => {
              // console.log(res);
              if (res.data.errorCode == 1) {
                store.clerks.forEach(ele => {
                  if (ele.employeeClerkId == clerk.employeeClerkId) {
                    store.clerks.splice(store.clerks.indexOf(ele), 1);
                  }
                });
              } else {
                that.$message.error({
                  duration: 1000,
                  message: res.data.message
                });
              }
            })
            .catch(error => {
              that.$message.error({
                duration: 1000,
                message: error.message
              });
            });
        });
    },
    // 获取 GIC 门店同步状态
    async getGicData() {
      let that = this;
      let para = {
        type: 1,
        businessId: that.brandId
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
    this.getRecycleList();
    this.brandId = this.$route.query.brandId;
    this.getGicData();
  }
};
</script>
<style lang="scss">
.recycle-wrap {
  height: 100%;
  .right-content {
    min-height: calc(100% - 240px);
  }
}

.recycle-bin {
  background: #fff;
  padding: 0 20px 24px;

  .r-b-top-header {
    width: 100%;
    display: flex;
    padding: 24px 0 22px 0;
    font-size: 20px;
    font-weight: 400;
    color: rgba(48, 49, 51, 1);

    .el-input {
      width: 180px;
    }

    .title {
      flex: 1;
    }
  }

  .pagination {
    text-align: right;
    margin-top: 20px;
  }

  .cell {
    .el-icon-sort {
      transform: rotate(90deg);
      margin-right: 10px;
    }
  }
}
</style>
