<template>
  <div class="dialog-content">
    <el-form label-width="110px" :model="ruleForm" :rules="rules" ref="ruleForm">
      <template v-if="typeTitle == '办理离职' || typeTitle == '修改离职信息'">
        <el-form-item label="最后工作日:" prop="date">
          <el-date-picker style="width: 280px;" v-model="ruleForm.date" :picker-options="endPickerOptions" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item label="离职原因:" required>
          <el-select v-model="ruleForm.reason" placeholder="请选择离职原因" style="width: 280px;">
            <el-option v-for="(item, index) in reasons" :key="index" :label="item" :value="index"> </el-option>
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="姓名:">
          <span>{{ employee.clerkName }}</span>
        </el-form-item>
        <el-form-item label="入职时间:">
          <span>{{ employee.hireDate | formatDate('YY-MM-DD') }}</span>
        </el-form-item>
        <el-form-item label="实际转正时间:">
          <span>{{ employee.correctionDate | formatDate('YY-MM-DD') }}</span>
        </el-form-item>
        <el-form-item label="今日日期:">
          <span>{{ today }}</span>
        </el-form-item>
        <el-form-item label="调整转正时间:" v-if="typeTitle == '修改转正时间'" prop="editDate">
          <el-date-picker style="width: 280px;" v-model="ruleForm.editDate" :picker-options="endPickerOptions" type="date" placeholder="选择日期"> </el-date-picker>
        </el-form-item>
      </template>
      <el-form-item label="备注:" prop="remarks">
        <el-input type="textarea" style="width: 280px;" :autosize="{ minRows: 3, maxRows: 5 }" placeholder="请输入备注" v-model="ruleForm.remarks"> </el-input>
        <p class="counter">{{ ruleForm.remarks.length }}/100</p>
      </el-form-item>
    </el-form>
    <div class="button-box">
      <el-button type="primary" @click="submitHandle">{{ typeTitle == '办理转正' ? '确认转正' : typeTitle == '修改离职信息' ? '确认修改' : '确认办理' }}</el-button>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/utils/index';
import { getRequest } from '@/api/api';
export default {
  name: 'handleDialog',
  props: {
    employee: {
      type: Object,
      required: true
    },
    handleType: {
      type: String,
      required: true
    },
    typeTitle: {
      type: String,
      required: true
    }
  },
  filters: {
    formatDate
  },
  data() {
    return {
      ruleForm: {
        remarks: '',
        date: '',
        editDate: '',
        reason: 1
      },
      rules: {
        remarks: [{ max: 100, message: '长度不能超过100字符', trigger: 'blur' }],
        reason: [{ required: true, message: '请选择活离职原因', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        editDate: [{ required: true, message: '请选择日期', trigger: 'change' }]
      },
      reasons: ['家庭原因', '个人原因', '发展原因', '合同到期不续签', '协议解除', '无法胜任工作', '经济性裁员', '严重违法违纪', '其他']
    };
  },
  methods: {
    submitHandle() {
      let that = this;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          that
            .$confirm('是否要确认' + that.typeTitle, '提示', {
              type: 'warning'
            })
            .then(() => {
              let typeObj = {
                turnPositive: {
                  // 办理转正
                  params: {
                    correctionDate: that.today,
                    remark: that.ruleForm.remarks,
                    recordId: that.employee.recordId
                  },
                  url: '/haoban-manage-web/record/become-regular'
                },
                eidtCorrectionTime: {
                  // 修改转正时间
                  params: {
                    correctionDate: that.ruleForm.editDate,
                    remark: that.ruleForm.remarks,
                    recordId: that.employee.recordId
                  },
                  url: '/haoban-manage-web/record/change-correction-detail'
                },
                resignation: {
                  // 办理离职
                  params: {
                    fireReason: that.ruleForm.reason * 1 + 1,
                    remark: that.ruleForm.remarks,
                    recordId: that.employee.recordId,
                    fireDate: that.ruleForm.date
                  },
                  url: '/haoban-manage-web/record/fire-work'
                },
                changeFireInfo: {
                  // 修改离职信息
                  params: {
                    fireReason: that.ruleForm.reason * 1 + 1,
                    remark: that.ruleForm.remarks,
                    recordId: that.employee.recordId,
                    fireDate: that.ruleForm.date,
                    historyId: that.employee.historyId
                  },
                  url: '/haoban-manage-web/record/edit-record-history'
                }
              };
              that.subRequest(typeObj[that.handleType].params, typeObj[that.handleType].url);
            })
            /* eslint-disable */
            .catch(e => {
            });
        } else {
          return false;
        }
      });
    },
    subRequest(params, url) {
      let that = this;
      getRequest(url, params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$emit('handleSuccess');
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
    }
  },
  computed: {
    today() {
      let time = Date.parse(new Date());
      return formatDate(time, 'YY-MM-DD');
    },
    endPickerOptions() {
      // 控制时间选择插件只能选择大于入职时间的日期
      let that = this;
      return {
        disabledDate(time) {
          let timeSpace = time.getTime() < new Date(that.employee.hireDate).getTime();
          return timeSpace;
        }
      };
    }
  }
};
</script>
<style lang="scss">
.dialog-content {
  .date-picker {
    width: 280px;
  }

  .counter {
    width: 280px;
    text-align: right;
    font-size: 12px;
    color: rgba(192, 196, 204, 1);
  }

  .button-box {
    text-align: center;
    margin: 20px 0 25px;
  }
}
</style>
