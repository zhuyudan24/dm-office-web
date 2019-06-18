<template>
  <div class="employee-table">
    <el-table :data="employeeList" @selection-change="selectMember" @row-click="linkToDetail">
      <template v-for="prop in headList">
        <el-table-column :key="prop" v-if="prop == 'selection'" type="selection" width="42"> </el-table-column>
        <el-table-column :key="prop" v-if="prop == 'name'" label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <span v-if="scope.row.isManager == 1" class="is-manager">部门负责人</span>
          </template>
        </el-table-column>
        <el-table-column :key="prop" v-if="prop == 'phoneNumber'" label="手机号" prop="phoneNumber"></el-table-column>
        <el-table-column :key="prop" v-if="prop == 'positionName'" label="职位" prop="positionName">
          <template slot-scope="scope">
            {{ !!scope.row.positionName ? scope.row.positionName : '--' }}
          </template>
        </el-table-column>
        <el-table-column :key="prop" v-if="prop == 'activationStatus'" label="状态">
          <template slot-scope="scope">
            <div class="status-icon" :class="scope.row.activationStatus == 1 ? 'is-active' : ''">
              <i class="iconfont icon-shouji"></i>
            </div>
          </template>
        </el-table-column>
      </template>
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
    }
  },
  data() {
    return {
      tableH: window.screen.availHeight - 180
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
      window.location.href = '#/employee?employeeClerkId=' + row.employeeClerkId;
    }
  }
};
</script>
<style lang="scss">
.el-table .cell .is-manager {
  display: inline-block;
  vertical-align: middle;
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
