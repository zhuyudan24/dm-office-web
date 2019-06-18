<template>
  <div>
    <el-table ref="clerkViewTable" class="diy-table" :data="tableData" @selection-change="selectMember">
      <el-table-column type="selection" width="42"></el-table-column>
      <el-table-column label="门店" width="175" prop="employeeStoreName"></el-table-column>
      <el-table-column label="门店code" prop="storeCode" width="175"></el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <ul class="diy-header">
            <li class="name">姓名</li>
            <li class="phone">手机号</li>
            <li class="position">职位</li>
            <li class="status">状态</li>
          </ul>
        </template>
        <template slot-scope="scope">
          <ul>
            <li v-for="clerk in scope.row.ext.store.ext.employeeClerkList" :key="clerk.employeeClerkId" class="clerk-obj-li">
              <div class="clerk-name clerk-cell">{{ clerk.name }}</div>
              <div class="clerk-cell clerk-phone">{{ clerk.phoneNumber }}</div>
              <div class="clerk-cell clerk-position">{{ clerk.positionName }}</div>
              <div class="clerk-cell clerk-status">
                <div class="status-icon" :class="clerk.activationStatus == 1 ? 'is-active' : ''">
                  <i class="iconfont icon-shouji"></i>
                </div>
              </div>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
// import { getRequest, postRequest, postJsonRequest } from '@/api/api';
export default {
  name: 'clerkView',
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      tableH: window.screen.availHeight - 440 - 250,
      storeType: 0,
      typeArr: ['全部类型', '自营', '联营', '代理(加盟)', '代销', '托管'],
      storeStatus: '',
      showChildMember: false
    };
  },
  methods: {
    /**
     * table选择门店
     */
    selectMember(selection) {
      this.$emit('selectMember', selection);
    }
  },
  mounted() {
    let list = this.tableData;
    list.forEach(store => {
      store.ext.store = !!store.ext.store ? store.ext.store : {};
      store.ext.store.ext = !!store.ext.store ? store.ext.store.ext : { employeeClerkList: [] };
      store.ext.store.ext.employeeClerkList = !!store.ext.store ? store.ext.store.ext.employeeClerkList : [];
      store.storeCode = !!store.ext.store ? store.ext.store.storeCode : '';
    });
  },
  watch: {
    tableData(table) {
      table.forEach(store => {
        store.ext.store = !!store.ext.store ? store.ext.store : {};
        store.ext.store.ext = !!store.ext.store ? store.ext.store.ext : { employeeClerkList: [] };
        store.ext.store.ext.employeeClerkList = !!store.ext.store ? store.ext.store.ext.employeeClerkList : [];
        store.storeCode = !!store.ext.store ? store.ext.store.storeCode : '';
      });
    }
  }
};
</script>
<style lang="scss">
.diy-table {
  .diy-header {
    display: flex;

    .name {
      width: 130px;
    }

    .phone,
    .position {
      width: 125px;
    }

    .status {
      width: 100px;
    }
  }

  .clerk-obj-li {
    display: flex;
    padding: 10px 0;
    margin-bottom: 25px;
    line-height: 32px;

    &:last-child {
      margin-bottom: 0;
    }

    .clerk-name {
      width: 130px;

      .manager {
        display: inline-block;
        width: 30px;
        height: 15px;
        line-height: 16px;
        vertical-align: middle;
        text-align: center;
        background: rgba(247, 203, 39, 1);
        border-radius: 2px;
        color: #fff;
        font-size: 10px;
      }
    }

    .clerk-phone,
    .clerk-position {
      width: 125px;
    }

    .clerk-status {
      width: 100px;

      .status-icon {
        width: 34px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #ecf5ff;
        border: 1px solid #d9ecff;
        border-radius: 4px;

        &.is-active {
          color: #409eff;
        }
      }
    }
  }
}
</style>
