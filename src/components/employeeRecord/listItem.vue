<template>
  <el-table-column v-if="propList[item].slot" :label="propList[item].label" :width="propList[item].width" :sortable="propList[item].needSort" :prop="item">
    <template slot-scope="scope">
      <div v-if="item == 'clerkType'">
        {{ typeList[scope.row[item] || 5] }}
      </div>
      <div v-if="item == 'clerkStatus'">
        {{ statusList[scope.row[item]] || '无状态' }}
      </div>
      <div v-else-if="item == 'hireDate' || item == 'correctionDate' || item == 'fireDate'">
        {{ scope.row[item] | formatDate('YY-MM-DD') || '--' }}
      </div>
      <div v-else-if="item == 'headPic'">
        <img class="header-pic" :src="scope.row[item]" v-if="!!scope.row[item]" />
        <div class="replace-head-img" v-else>
          <i class="iconfont icon-yewuduanmorentouxian"></i>
        </div>
      </div>
      <div v-else-if="item == 'fireReason'">
        {{ reasons[scope.row[item]] || '--' }}
      </div>
      <div v-else-if="item == 'handleEmployee'">
        <div class="table-handle">
          <el-dropdown class="more" @command="callHandle">
            <span class="el-dropdown-link"> 更多<i class="el-icon-arrow-down el-icon--right"></i> </span>
            <el-dropdown-menu slot="dropdown">
              <template v-if="scope.row.clerkStatus == 2">
                <el-dropdown-item :command="{ obj: scope.row, type: 'turnPositive', typeTitle: '办理转正' }">办理转正</el-dropdown-item>
                <el-dropdown-item :command="{ obj: scope.row, type: 'eidtCorrectionTime', typeTitle: '修改转正时间' }">修改转正时间</el-dropdown-item>
              </template>
              <el-dropdown-item :command="{ obj: scope.row, type: 'editEmployee', typeTitle: '编辑员工资料' }">编辑员工资料</el-dropdown-item>
              <el-dropdown-item :command="{ obj: scope.row, type: 'resignation', typeTitle: '办理离职' }">办理离职</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div v-else-if="item == 'handleUnEmployee'">
        <div class="table-handle">
          <a :href="'#/recordInfo?recordId=' + scope.row.recordId + '&type=unemployee'" class="a-href">编辑</a>
        </div>
      </div>
    </template>
  </el-table-column>
  <el-table-column v-else :class-name="item == 'clerkName' ? 'control-width' : ''" :label="propList[item].label" :width="propList[item].width" :prop="item" show-overflow-tooltip> </el-table-column>
</template>
<script>
import { formatDate } from '@/utils/index';
import { getGicStatus } from '@/api/gicStatus';
import errMsg from '@/common/js/error';
export default {
  name: 'list-item',
  props: {
    item: {
      type: String,
      required: true
    }
  },
  filters: {
    formatDate
  },
  data() {
    return {
      typeList: ['全部', '全职', '兼职', '外包', '实习', '无类型'],
      statusList: ['全部', '正式', '试用', '离职'],
      reasons: ['', '家庭原因', '个人原因', '发展原因', '合同到期不续签', '协议解除', '无法胜任工作', '经济性裁员', '严重违法违纪', '其他'],
      propList: {
        headPic: {
          label: '',
          slot: true,
          width: 50
        },
        clerkName: {
          label: '姓名',
          width: 90
        },
        clerkPhone: {
          label: '手机号'
        },
        groupName: {
          label: '部门'
        },
        clerkCode: {
          label: 'code'
        },
        positionName: {
          label: '职位'
        },
        clerkType: {
          label: '员工类型',
          slot: true
        },
        clerkStatus: {
          label: '员工状态',
          slot: true
        },
        hireDate: {
          label: '入职日期',
          needSort: 'custom',
          slot: true
        },
        correctionDate: {
          label: '转正日期',
          needSort: 'custom',
          slot: true
        },
        fireDate: {
          label: '离职日期',
          needSort: 'custom',
          slot: true
        },
        fireReason: {
          label: '离职原因',
          slot: true
        },
        handleEmployee: {
          label: '操作',
          slot: true
        },
        handleUnEmployee: {
          label: '操作',
          slot: true
        }
      }
    };
  },
  methods: {
    callHandle(command) {
      if (command.typeTitle != '编辑员工资料') {
        this.getGicData(command);
      } else {
        location.href = '#/recordInfo?recordId=' + command.obj.recordId;
      }
    },
    // 获取 GIC 门店同步状态
    async getGicData(command) {
      let that = this;
      let para = {
        type: 3,
        businessId: command.obj.recordId
      };
      let res = await getGicStatus(para);
      let resData = res.data;
      if (resData.errorCode == 1) {
        if (resData.result) {
          that.$message.error({
            duration: 1000,
            message: '已经与 GIC 门店同步，暂无操作权限'
          });
          return false;
        }
        that.$emit('callHandle', command.obj, command.type, command.typeTitle);
      } else {
        errMsg.errorMsg(resData);
      }
    }
  },
  mounted() {
    // console.log(this.item)
  }
};
</script>
<style lang="scss">
.header-pic {
  width: 35px;
  height: 35px;
  border-radius: 3px;
}

.replace-head-img {
  width: 35px;
  height: 35px;
  border-radius: 3px;
  line-height: 35px;
  text-align: center;
  color: #fff;
  background: #82c5ff;
}

.table-handle {
  cursor: pointer;

  .el-dropdown-link {
    color: #409eff;
  }
}

.control-width {
  .cell {
    width: 70px;
    white-space: nowrap;
  }
}
</style>
