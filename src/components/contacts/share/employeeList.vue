<template>
  <div class="employee-table">
    <el-table :data="tableData" @selection-change="selectMember" @row-click="linkToDetail">
      <el-table-column type="selection" width="42"> </el-table-column>
      <el-table-column label="姓名" prop="name"></el-table-column>
      <el-table-column label="手机号" prop="phoneNumber"></el-table-column>
      <el-table-column label="职位">
        <template slot-scope="scope">
          {{ scope.row.positionName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <div class="status-icon" :class="scope.row.activationStatus == 1 ? 'is-active' : ''">
            <i class="iconfont icon-shouji"></i>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  name: 'employee-table',
  props: {
    employeeList: {
      type: Array,
      default() {
        return [];
      }
    },
    headList: {
      type: Array,
      default() {
        return ['selection', 'name', 'phoneNumber', 'positionName', 'activationStatus'];
      }
    },
    groupInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      tableH: window.screen.availHeight - 440 - 250,
      tableData: []
    };
  },
  methods: {
    /**
     * table选择员工
     */
    selectMember(selection) {
      this.$emit('selectMember', selection);
    },
    /**
     * 跳转至员工详情
     */
    linkToDetail(row) {
      if (!!this.groupInfo.isMine) {
        window.location.href = '#/employee?employeeClerkId=' + row.employeeClerkId;
      } else {
        // 如果是对方企业共享的职员只能查看信息不能修改
        window.location.href = '#/employee?readOnly=1&employeeClerkId=' + row.employeeClerkId;
      }
    }
  },
  mounted() {
    // let arr = [];
    // console.log( this.employeeList, " this.employeeList");
    // this.employeeList.forEach(clerk => {
    //     arr.push(clerk.ext.employeeClerk);
    // });
    // this.tableData = arr;
    let list = this.employeeList;
    let arr = [];
    list.forEach(clerk => {
      clerk.ext.employeeClerk.sharedContactEmployeeStoreId = clerk.sharedContactEmployeeStoreId;
      arr.push(clerk.ext.employeeClerk);
    });
    this.tableData = arr;
  },
  watch: {
    employeeList(list) {
      let arr = [];
      list.forEach(clerk => {
        clerk.ext.employeeClerk.sharedContactEmployeeStoreId = clerk.sharedContactEmployeeStoreId;
        arr.push(clerk.ext.employeeClerk);
      });
      this.tableData = arr;
    }
  }
};
</script>
<style lang="scss">
.el-table .cell .is-manager {
  display: inline-block;
  font-size: 10px;
  color: #fff;
  width: auto;
  padding: 0 4px;
  height: 13px;
  text-align: center;
  line-height: 15px;
  background: rgba(247, 203, 39, 1);
  border-radius: 2px;
}

.el-table tr {
  cursor: pointer;
}
</style>
