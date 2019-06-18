<template>
  <div class="form-container bdr-box">
    <el-form ref="clerk_info" :model="clerkInfo" :rules="rules" class="add-clerk-form" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="clerkInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input v-model="clerkInfo.phoneNumber" :disabled="!isAddnew"></el-input>
      </el-form-item>
      <el-form-item label="门店" prop="storeName">
        <el-input v-model="clerkInfo.storeName" @focus="callSelector" :disabled="!isAddnew"></el-input>
      </el-form-item>
      <el-form-item label="code" prop="code">
        <el-input v-model="clerkInfo.code" @blur="value => toInputCode(value)" :disabled="gicFlag && !isAddnew"></el-input>
      </el-form-item>
      <el-form-item label="职位" prop="positionName">
        <el-input v-model="clerkInfo.positionName"></el-input>
      </el-form-item>
    </el-form>
    <div class="btn-box">
      <el-button type="primary" @click="saveFn">保 存</el-button>
      <el-button v-if="!gicFlag && isAddnew" type="primary" @click="saveFn(1)">保存并继续添加</el-button>
      <el-button v-if="!gicFlag" @click="cancel">取 消</el-button>
    </div>
    <vue-select-store ref="storeSelector" selectType="store" :defaultList="defaultList" :treeSet="treeSet" @handleSelectedList="handleSelectedList"></vue-select-store>
  </div>
</template>
<script>
import vueSelectStore from 'components/common/vueSelectStore';
import { getRequest } from '@/api/api';
// import { _debounce } from '@/common/js/public';
export default {
  name: 'clerk-info-form',
  props: {
    isAddnew: {
      type: Boolean, // 判断是新增店员还是编辑店员
      default: false
    },
    perId: {
      type: [String, Number],
      default: ''
    },
    firstLevelId: {
      type: [String, Number],
      default: ''
    },
    storeType: {
      type: [String, Number],
      default: ''
    },
    // gic 同步标志
    gicFlag: {
      type: Boolean,
      default: false
    }
  },
  components: {
    vueSelectStore
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'));
      } else {
        let reg = /^1[34578]\d{9}$/;
        if (!reg.test(value)) {
          return callback(new Error('手机号格式不正确'));
        } else {
          return callback();
        }
      }
    };
    return {
      rules: {
        name: [{ required: true, message: '请输入店员姓名', trigger: 'blur' }, { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }],
        phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        storeName: [{ required: true, message: '请选择门店', trigger: 'change' }],
        code: [{ required: true, message: '请输入code', trigger: 'blur' }, { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }],
        positionName: [{ required: true, message: '请输入店员职位', trigger: 'blur' }]
      },
      clerkInfo: {
        storeName: '',
        storeId: '',
        managerMode: false,
        positionName: '职员'
      },
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true, // 是否单选
        groupId: '',
        storeType: '',
        openNextBool: true // 展开下级不调用接口
      },
      defaultList: []
    };
  },
  methods: {
    /**
     *  输入
     */
    toInputCode: function(value) {
      let that = this;
      let newValue = that.clerkInfo.code;
      if (newValue !== '') {
        that.clerkInfo.code = newValue.replace(/[^A-Za-z0-9]+/g, '');
      }
    },

    saveFn(goahead) {
      let that = this;
      let ok = true;
      this.$refs['clerk_info'].validate(valid => {
        if (!valid) {
          ok = false;
        }
      });
      if (ok) {
        that.addEmployee(this.clerkInfo, goahead);
      }
    },
    callSelector() {
      this.treeSet.dialogVisible = true;
    },
    handleSelectedList(list) {
      this.clerkInfo.storeName = !!list && !!list.length ? list[0].label : '';
      this.clerkInfo.storeId = !!list && !!list.length ? list[0].id : '';
    },
    /**
     * 新增员工
     */
    addEmployee(info, contin) {
      let that = this;
      let params = {
        name: info.name,
        isClerk: 1,
        phoneNumber: info.phoneNumber,
        positionName: info.positionName,
        storeId: info.storeId,
        managerMode: info.managerMode * 1,
        code: info.code,
        employeeClerkId: info.employeeClerkId || ''
      };
      let url = that.isAddnew ? '/haoban-manage-web/emp/add' : '/haoban-manage-web/emp/update';
      // !that.isAddnew && (params.employeeClerkId = that.$route.query.clerkId);
      getRequest(url, params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: '操作成功'
            });
            if (contin == 1) {
              that.clerkInfo = {
                name: '',
                isClerk: 1,
                phoneNumber: '',
                positionName: '职员',
                storeId: '',
                managerMode: false,
                code: ''
              };
            } else {
              // window.history.go(-1);
              that.$router.push('/storeFrame');
            }
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
    cancel() {
      this.$confirm(' 是否确认取消，取消后当前页面信息将丢失 ？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$router.go(-1);
          // this.$emit('cancelClerkInfo', true);
        })
        /* eslint-disable */
        .catch(e => {
        });
    },
    getClerkInfo() {
      let that = this;
      let params = {
        id: !!that.$route.query.clerkId ? that.$route.query.clerkId : that.perId
      };
      getRequest('/haoban-manage-web/emp/findOne', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.clerkInfo = res.data.result;
            that.defaultList = [
              {
                id: res.data.result.storeId,
                label: res.data.result.storeName
              }
            ];
          } else {
            that.$message.error({
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.$message.error({
            message: e
          });
        });
    }
  },
  beforeMount() {
    this.treeSet.storeType = this.storeType;
    this.treeSet.groupId = this.firstLevelId;
    if (!this.isAddnew) this.getClerkInfo();
  },
  watch: {
    perId(id, ids) {
      this.getClerkInfo(id);
    }
  }
};
</script>
<style lang="scss">
.form-container {
  flex: 1;
  padding: 24px 35px 48px;
  background: #fff;

  .add-clerk-form {
    .el-input {
      width: 380px;
    }
  }

  .btn-box {
    padding-left: 80px;
  }
}
</style>
