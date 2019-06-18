<!--
  门店权限设置组件
<set-permiss :permTitle="'店员'"></set-permiss>
<set-permiss :permTitle="'店长'"></set-permiss>
 -->
<template>
  <div class="permiss-wrap">
    <el-form label-width="110px" :model="ruleForm" ref="ruleForm">
      <el-radio-group v-model="ruleForm.radio" @change="changeRadio">
        <el-form-item :label="permType == 1 ? '店员可见权限' : '店长可见权限'">
          <el-radio :label="1">可见所有品牌门店架构和行政架构</el-radio>
        </el-form-item>
        <el-form-item label=" ">
          <el-radio :label="2">门店仅可见自己门店</el-radio>
        </el-form-item>
        <el-form-item label=" ">
          <el-radio :label="3">自定义可见权限</el-radio>
        </el-form-item>
        <div class="permiss-child-cell" v-if="ruleForm.radio == 3">
          <setPermissData :title="'允许行政架构可见'" v-model="ruleForm.visibleAll" @showSelect="showSelect('depart')"> </setPermissData>
          <setPermissData :title="'允许门店架构可见'" v-model="ruleForm.visibleStoreAll" @showSelect="showSelect('store')"> </setPermissData>
        </div>
      </el-radio-group>
      <!-- <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
      </el-form-item> -->
    </el-form>
    <vue-select-employee :defaultSelection="defaultSelection" :treeSet="treeSet" :onlyPerson="onlyPerson" :changed="changed" @handleSelectedList="handleSelectedList"> </vue-select-employee>
    <vue-select-store ref="storeSelector" :treeSet="storeTreeSet" :selectType="'all'" :defaultList="defaultStoreList" @handleSelectedList="handleSelectedStoreList"> </vue-select-store>
  </div>
</template>
<script>
import setPermissData from '@/components/set/set-permiss-data';
import vueSelectEmployee from '@/components/common/vueSelectEmployee';
import vueSelectStore from 'components/common/vueSelectStore';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: '',
  props: {
    authData: {
      type: [Object, Array],
      default() {
        return {};
      }
    },

    permType: {
      type: [Number, String]
    }
  },
  data() {
    return {
      projectName: '', // 当前项目名
      ruleForm: {
        radio: 1,
        visibleAll: [
          /*{
            id: '1',
            type: '1',
            name: '张三',
            headPic: 'http://thirdwx.qlogo.cn/mmopen/j7nX4OeBsXRNyvh6micCywssVEYCaWiaicUZq5Vn2zWktWLAyRvEAH7icQmUhLze8rrQYpM5ptwZ2RL7cX0icyBbiavhYFNTIZhibKu/0'
          }*/
        ],
        visibleStoreAll: []
      },
      treeSet: {
        isSelectPerson: true, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      },
      treeData: {},
      defaultSelection: [], // 已选数据
      onlyPerson: false, // 控制只能选人(true)
      changed: '',
      defaultStoreList: [],
      storeTreeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      }
    };
  },
  beforeMount() {
    let that = this;
    let host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://www.gicdev.com';
    } else {
      that.baseUrl = host;
    }
  },
  methods: {
    /**
     * changeRadio
     */
    changeRadio(value) {
      const that = this;
      that.ruleForm.visibleAll = [];
      that.ruleForm.visibleStoreAll = [];
    },

    /**
     * 保存
     */
    submitForm: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            allowCherkIds: [],
            allowDepartIds: [],
            allowStoreIds: [],
            brandId: that.ruleForm.brandId,
            groupId: that.ruleForm.groupId,
            radio: that.ruleForm.radio
          };

          if (that.ruleForm.radio == 3 && (!that.ruleForm.visibleAll.length && !that.ruleForm.visibleStoreAll.length)) {
            that.$message.error({
              duration: 1000,
              message: '请选择指定部门/人员'
            });
            return;
          }
          if (that.ruleForm.radio == 3) {
            that.ruleForm.visibleAll.forEach(function(ele, index) {
              if (ele.hasOwnProperty('employeeClerkId')) {
                data.allowCherkIds.push(ele.employeeClerkId);
              } else if (ele.hasOwnProperty('groupId')) {
                data.allowDepartIds.push(ele.groupId);
              } else if (Number.parseInt(ele.type) === 1) {
                data.allowCherkIds.push(ele.id);
              } else if (Number.parseInt(ele.type) === 2) {
                data.allowDepartIds.push(ele.id);
              }
            });
            that.ruleForm.visibleStoreAll.forEach(function(ele, index) {
              if (ele.hasOwnProperty('employeeClerkId')) {
                data.allowCherkIds.push(ele.employeeClerkId);
              } else if (ele.hasOwnProperty('groupId')) {
                data.allowDepartIds.push(ele.groupId);
              } else if (ele.hasOwnProperty('storeId')) {
                data.allowStoreIds.push(ele.storeId);
              } else if (Number.parseInt(ele.type) === 1) {
                data.allowCherkIds.push(ele.id);
              } else if (Number.parseInt(ele.type) === 2) {
                data.allowDepartIds.push(ele.id);
              } else if (Number.parseInt(ele.type) === 3) {
                data.allowStoreIds.push(ele.id);
              }
            });
          }
          that.setStoreAuth(data, that.permType);
        } else {
          return false;
        }
      });
    }, 400),

    /**
     * 门店权限设置
     */
    setStoreAuth(data, type) {
      const that = this;
      let para = {
        type: type, // 1: 店员, 2: 店长
        brandId: data.brandId,
        groupId: data.groupId,
        storeEmployeeAuth: data.radio,
        storeManagerAuth: data.radio,
        allowCherkIds: data.allowCherkIds.join(','),
        allowDepartIds: data.allowDepartIds.join(','),
        allowStoreIds: data.allowStoreIds.join(',')
      };
      postRequest('/haoban-manage-web/brand/saveStoreAuth', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (type == 2) {
              showMsg.showmsg('保存成功', 'success');
            }
            return false;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 处理传递数据
     */
    handleAuthData(data) {
      const that = this;
      if (!Object.keys(data).length) {
        return;
      }
      that.ruleForm.brandId = data.brandId;
      that.ruleForm.groupId = data.groupId;
      // 店员可见权限
      if (Number.parseInt(that.permType) === 1) {
        // && !!data.employeeAuthList.length
        that.ruleForm.radio = data.brandDTO.storeEmployeeAuth || 1;
        if (!!data.employeeAuthList.length) {
          data.employeeAuthList.forEach(function(ele, index) {
            // 组件内参数需要
            if (Number.parseInt(ele.type) === 2) {
              ele.groupId = ele.id;
            }
            ele.label = ele.name;
          });
        }
        // 行政和门店分开
        that.ruleForm.visibleAll = [];
        that.ruleForm.visibleStoreAll = [];
        data.employeeAuthList.forEach(function(ele, index) {
          !!ele.isStore ? that.ruleForm.visibleStoreAll.push(ele) : that.ruleForm.visibleAll.push(ele);
        });
        that.defaultSelection = that.ruleForm.visibleAll;
        that.defaultStoreList = that.ruleForm.visibleStoreAll;
      }
      // 店长可见权限
      if (Number.parseInt(that.permType) === 2) {
        // && !!data.managerAuthList.length
        that.ruleForm.radio = data.brandDTO.storeManagerAuth || 1;
        if (!!data.managerAuthList.length) {
          data.managerAuthList.forEach(function(ele, index) {
            // 组件内参数需要
            if (Number.parseInt(ele.type) === 2) {
              ele.groupId = ele.id;
            }
            ele.label = ele.name;
          });
        }
        // 行政和门店分开
        that.ruleForm.visibleAll = [];
        that.ruleForm.visibleStoreAll = [];
        data.managerAuthList.forEach(function(ele, index) {
          !!ele.isStore ? that.ruleForm.visibleStoreAll.push(ele) : that.ruleForm.visibleAll.push(ele);
        });
        that.defaultSelection = that.ruleForm.visibleAll;
        that.defaultStoreList = that.ruleForm.visibleStoreAll;
      }
    },

    /**
     * 显示选择控件
     */
    showSelect(type) {
      const that = this;
      if (type === 'store') {
        that.defaultStoreList = that.ruleForm.visibleStoreAll;
        that.storeTreeSet = {
          dialogVisible: true,
          isSingle: false,
          isSelectPerson: true
        };
        return;
      }

      that.treeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: true
      };
      that.defaultSelection = that.ruleForm.visibleAll;
    },

    /**
     * 处理树形控件选择的数据
     */
    handleSelectedList(list) {
      const that = this;
      that.defaultSelection = list;
      that.ruleForm.visibleAll = list;
    },

    handleSelectedStoreList(list) {
      const that = this;
      that.defaultStoreList = list;
      that.ruleForm.visibleStoreAll = list;
    },

    /**
     * 获取行政架构
     */
    getDepartData(selData) {
      const that = this;
      postRequest('/haoban-manage-web/dept/deptListForCompany', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result) {
              let treeData = [];
              let personData = [];
              if (res.data.errorCode == 1) {
                treeData = res.data.result.departmentList || [];
                personData = res.data.result.searchList || [];
              }
              that.treeData = {
                treeData,
                personData
              };
              that.$forceUpdate();
            } else {
              that.$message.error({
                duration: 1000,
                message: '暂无数据'
              });
            }
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  watch: {
    authData: function(newData, oldData) {
      const that = this;
      that.handleAuthData(newData);
    }
  },
  mounted() {
    const that = this;
    that.handleAuthData(that.authData);
    that.getDepartData();
  },
  components: {
    setPermissData,
    vueSelectEmployee,
    vueSelectStore
  }
};
</script>
<style lang="less" scoped>
.w-500 {
  width: 500px;
}

/* flex */
.flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.flex-1 {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

.flex-column {
  -webkit-flex-direction: column;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -o-flex-direction: column;
  flex-direction: column;
}

.flex-row {
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  -o-flex-direction: row;
  flex-direction: row;
}

.flex-align-center {
  -webkit-box-align: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
}

.flex-pack-center {
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 180px;
  height: 180px;
  line-height: 180px;
  text-align: center;
}
.avatar {
  max-width: 180px;
  max-height: 180px;
  display: block;
}

.upload-tip {
  color: #606266;
  font-size: 12px;
  line-height: 20px;
}

.color-1890ff {
  color: #1890ff;
}

.permiss-wrap {
  .permiss-child-cell {
    width: 480px;
    min-height: 154px;
    border-radius: 2px;
    background: #f5f7fa;
    margin: 16px 0;
    padding: 20px 20px 1px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
