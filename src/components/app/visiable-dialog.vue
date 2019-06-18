<!--
<visiable-dialog
  :appName="appName"
  :showDialog="showDialog"
  @hideDialog="hideDialog">
</visiable-dialog>
 -->
<template>
  <div v-show="customDialog">
    <el-dialog class="app-dialog" :title="appName + '可见范围设置'" :visible.sync="customDialog" width="476px" :before-close="handleClose">
      <div class="app-dialog-body">
        <el-form ref="form" :model="formData" label-width="80px">
          <el-form-item label="可见范围">
            <div>
              <el-radio v-model="formData.displayType" label="0">全部员工</el-radio>
            </div>
            <div>
              <el-radio v-model="formData.displayType" label="1">部分员工</el-radio>
            </div>
          </el-form-item>
          <div v-show="formData.displayType == 1">
            <el-form-item label="行政架构" prop="name" class="m-b-0 m-t-10">
              <div class="flex w-380 flex-column item-cell-select">
                <div class="depart-item-wrap">
                  <div class="el-select el-select--large depart-item-content" @click="showDialogLayer('depart', formData.departList)">
                    <div class="el-select__tags" style="max-width: 181px;">
                      <span>
                        <template v-for="(item, index) in formData.departList">
                          <span class="el-tag el-tag--info el-tag--small" :key="index">
                            <span class="el-select__tags-text">{{ item.name }}</span
                            ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index, formData.departList)"></i>
                          </span>
                        </template>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="门店架构" prop="name" class="m-t-22">
              <div class="flex w-380 flex-column item-cell-select">
                <div class="depart-item-wrap">
                  <div style="width:213px" class="el-select el-select--large depart-item-content" @click="showDialogLayer('store', formData.storeList)">
                    <div class="el-select__tags" style="max-width: 181px;">
                      <span>
                        <template v-for="(item, index) in formData.storeList">
                          <span class="el-tag el-tag--info el-tag--small" :key="index">
                            <span class="el-select__tags-text">{{ item.name || item.storeName }}</span
                            ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index, formData.storeList)"></i>
                          </span>
                        </template>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customCancel">取 消</el-button>
        <el-button type="primary" @click="customConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <vue-select-employee :appScene="appScene" :defaultSelection="defaultSelection" :onlyPerson="onlyPerson" :treeSet="treeSet" :changed="changed" @handleSelectedList="handleSelectedList"> </vue-select-employee>
    <vue-select-store ref="storeSelector" :appScene="appScene" :treeSet="storeTreeSet" :selectType="'all'" :defaultList="defaultStoreList" @handleSelectedList="handleSelectedList"> </vue-select-store>
  </div>
</template>
<script>
import vueSelectEmployee from '@/components/common/vueSelectEmployee.vue';
import vueSelectStore from 'components/common/vueSelectStore.vue';
import { postRequest } from '@/api/api';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
export default {
  name: 'visiable-dialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    appId: {
      type: String,
      default: ''
    },
    appName: {
      type: String,
      default: ''
    }
  },
  components: {
    vueSelectEmployee,
    vueSelectStore
  },
  data() {
    return {
      repProjectName: 'haoban-manage-web', // 项目名
      customDialog: false, // 弹框显示
      formData: {
        appId: this.appId,
        displayType: '0',
        data: [],
        departList: [],
        storeList: []
      },
      appScene: 2,
      treeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false, // 是否单选
        openNextBool: true // 展开下级不调用接口
      },
      treeData: {},
      defaultSelection: [],
      changed: '',
      onlyPerson: false, // 控制只能选人(true)
      selectType: '',
      defaultStoreList: [],
      storeTreeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false, // 是否单选
        openNextBool: true // 展开下级不调用接口
      }
    };
  },
  /* eslint-disable */
  beforeMount() {},
  methods: {
    /**
     *   关闭
     */
    handleClose(done) {
      const that = this;
      done();
      that.hideDialog();
    },

    /**
     *  取消
     */
    customCancel() {
      const that = this;
      that.hideDialog();
    },

    hideDialog() {
      const that = this;
      that.customDialog = false;
      that.$emit('hideDialog');
    },

    /**
     * 弹窗显示事件
     */
    showDialogLayer(type, selData) {
      const that = this;
      that.selectType = type;
      that.changed = type;
      if (type === 'store') {
        that.defaultStoreList = selData;
        that.storeTreeSet = {
          dialogVisible: true,
          isSingle: false,
          isSelectPerson: true,
          openNextBool: true // 展开下级不调用接口
        };
        return;
      }
      that.treeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: true,
        openNextBool: true // 展开下级不调用接口
      };
      if (type === 'people') {
        that.onlyPerson = false;
        that.treeSet = {
          dialogVisible: true,
          isSingle: false,
          isSelectPerson: true
        };
      }
      that.defaultSelection = selData;
      if (!!that.treeData.hasOwnProperty('treeData')) {
        return;
      }
    },

    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      const that = this;
      console.log(group);
      /* if (that.selectType === 'people') {
        that.formData.peopleList = group;
      } else  */
      if (that.selectType === 'store') {
        that.formData.storeList = group;
      } else {
        that.formData.departList = group;
      }
    },

    /**
     * 删除选的部门
     */
    delDepart(index, item) {
      item.splice(index, 1);
    },

    /**
     *  确定
     */
    customConfirm() {
      const that = this;
      if (that.formData.displayType == 0) {
        that.setData([]);
        return;
      }
      if (!!that.formData.departList.length || !!that.formData.storeList.length) {
        let data = [];
        if (!!that.formData.departList.length) {
          that.formData.departList.forEach(ele => {
            data.push({
              id: ele.id,
              type: ele.hasOwnProperty('employeeClerkId')? 1: ele.hasOwnProperty('groupId')? 2 : 3
            })
          })
        }
        if (!!that.formData.storeList.length) {
          that.formData.storeList.forEach(ele => {
            data.push({
              id: ele.id,
              type: ele.hasOwnProperty('employeeClerkId')? 1: ele.hasOwnProperty('groupId')? 2 : 3
            })
          })
        }
        that.setData(data);
      }else {
        that.$message.error({
          duration: 1000,
          message: '请选择可见人员'
        });
      }
    },

    /**
     *  提交数据
     */
    setData(list) {
      const that = this;
      let para = {
        appId: this.appId,
        displayType: parseInt(that.formData.displayType),
        data: JSON.stringify(list)
      };
      postRequest('/haoban-manage-web/application-right-save', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('设置成功', 'success');
            that.hideDialog();
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
    },

    /**
     *  获取 设置数据
     */
    getSetData() {
      const that = this;
      let para = {
        appId: that.formData.appId
      };
      postRequest('/haoban-manage-web/application-right-detail', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.formData.displayType = String(resData.result.displayType);
            that.formData.departList = [];
            that.formData.storeList = [];
            if (!!resData.result.displayRelation && !!resData.result.displayRelation.length) {
              resData.result.displayRelation.forEach(ele => {
                if (Number.parseInt(ele.type) === 2) {
                  ele.groupId = ele.id;
                }
                ele.label = ele.name;
                !!ele.isStore ? that.formData.storeList.push(ele) : that.formData.departList.push(ele);
              })
            }
            that.defaultSelection = that.formData.departList;
            that.defaultStoreList = that.formData.storeList;
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
    showDialog: function(newData, oldData) {
      const that = this;
      that.customDialog = newData;
    },
    appId: function(newData, oldData) {
      const that = this;
      that.formData.appId = newData;
      !!newData? that.getSetData(): '';

    },
  },

  /* 接收数据 */
  mounted() {
    const that = this;
    that.customDialog = that.showDialog;
    !!that.appId? that.getSetData(): '';
  }
};
</script>

<style lang="scss" scoped>
.app-dialog {
  &-wrap {
  }

  &__title {
    width: 100%;
    height: 38px;
    padding: 12px 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    background: rgba(235, 238, 245, 1);
  }

  &__p {
    width: 100%;
    font-size: 14px;
    color: #606266;

    span {
      color: #1890ff;
    }
  }

  .depart-item-content {
      width: 213px;
      height: 32px;
      overflow: hidden;
      white-space: nowrap;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      cursor: pointer;
    }

    .item-cell-select {
      /deep/ .el-select__tags {
        white-space: nowrap;
        overflow: hidden;
      }
    }

    .depart-cell {
      position: relative;
      margin: 0 24px 24px 0;

      .el-icon-circle-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 16px;
        color: #808995;
        cursor: pointer;
      }
    }
}
</style>
