<template>
  <div class="custom-dialog-wrap">
    <el-dialog title="员工个人详情页展示字段设置" :visible.sync="customDialog" width="761px" :before-close="handleCardClose">
      <div class="custom-dialog__title">
        <p class="custom-dialog__p">tips：添加后的字段将在员工个人详情页展示出来，个人敏感信息不建议添加</p>
      </div>
      <div class="custom-dialog-body">
        <template v-for="(item, index) in customData">
          <div class="detail-field-cell flex" :key="index">
            <div class="detail-field-left">{{ item.fieldName }}</div>
            <div class="detail-field-right flex">
              <el-checkbox-group class="flex flex-wrap" v-model="item.checkList" @change="customChange">
                <el-checkbox v-for="(childItem, childIndex) in item.children" :label="childItem.fieldCode" :key="childItem.fieldCode + childIndex" :disabled="childItem.disable" name="type">
                  {{ childItem.fieldName }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
        </template>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="customCancel">取 消</el-button>
        <el-button type="primary" @click="customConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
export default {
  name: 'staff-detail-field',
  props: {
    showCustomDialog: {
      type: Boolean,
      default: false
    },
    detailData: {
      type: Array,
      default: function() {
        return [];
      }
    },
    dataType: {
      type: Number,
      default: 1 //'类型：1行政架构，2门店架构'
    }
  },
  data() {
    return {
      repProjectName: 'gic-web', // 项目名
      customDialog: false, // 弹框显示
      fixData: ['clerkName', 'clerkPhone', 'groupName', 'positionName'],
      fixDataStore: ['clerkName', 'clerkPhone', 'groupName', 'positionName', 'clerkCode'],
      // 复选框数据
      customData: [
        // {
        //   fieldCode: 1,
        //   fieldName: "基本信息",
        //   checkList: [],
        //   children: [
        //     {
        //       fieldCode: 'name',
        //       fieldName: '姓名'
        //     }
        //   ]
        // }
      ],
      checkList: [], // 已选数据
      setList: [], // 员工档案中已经配置的数据
      // 获取 location origin
      baseUrl: ''
    };
  },
  beforeMount() {
    const that = this;
    let host = window.location.origin;
    if (host.indexOf('localhost') != '-1') {
      that.baseUrl = 'http://gicdev.demogic.com';
    } else {
      that.baseUrl = host;
    }
  },
  /* eslint-disable */
  computed: {},
  methods: {
    /**
     * 关闭
     */
    handleCardClose() {
      const that = this;
      that.customCancel();
    },

    /**
     * 取消
     */
    customCancel() {
      const that = this;
      that.customDialog = false;
      that.$emit('customHandleConfirm', 'hide');
    },

    /**
     * 确定
     */
    customConfirm: _debounce(function() {
      const that = this;
      that.checkList = that.customData.map(item => item.checkList).flat();
      that.saveFields(that.dataType);
    }, 500),

    /**
     * 复选框选择事件
     */
    /* eslint-disable */
    customChange(value) {},

    /**
     * 保存已经勾选
     */
    saveFields(type) {
      const that = this;
      const para = {
        fields: that.checkList,
        type: type // 类型：1行政架构，2门店架构'
      };

      postRequest('/haoban-manage-web/record/employee-show-field-save.json', para)
        .then(res => {
          // console.log(res,res.data,res.data.errorCode)
          var resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
            that.$emit('customHandleConfirm');
            return;
          }

          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          console.log(error);

          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     * 简单数组-->父子数组对象
     */
    treeData(data) {
      let tree = data.filter(father => {
        //循环所有项
        let branchArr = data.filter(child => {
          return father.fieldCode == child.parentCode; //返回每一项的子级数组
        });
        if (branchArr.length > 0) {
          father.children = branchArr; //如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.parentCode == 0; //返回第一层
      });
      // 排序
      tree.sort(function(a, b) {
        return a.sort - b.sort;
      });

      tree.forEach(function(ele, index) {
        ele.children.sort(function(a, b) {
          return a.sort - b.sort;
        });
      });
      return tree;
    },
    /**
     *  获取已经保存模板信息---api
     */
    getInfo() {
      const that = this;
      that.setList = [];
      postRequest('/haoban-manage-web/record/employee-find-template.json', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              resData.result.forEach(ele => {
                if (ele.parentCode != 0) {
                  that.setList.push(ele.fieldCode);
                }
              })
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
    },

    /**
     * 获取所有字段
     */
    getAllFields() {
      const that = this;
      postRequest('/haoban-manage-web/record/employee-find-system-template.json', {})
        .then(res => {
          // console.log(res.data)
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.handleAllFields(resData.result);
            return;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          // console.log(error);
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    /**
     *  处理所有系统模板信息
     */
    handleAllFields(result) {
      const that = this;
      // console.log(that.treeData(result))
      let newResult = that.treeData(result);
      newResult.forEach(function(ele, index) {
        ele.checkList = [];
        // ele.children.forEach(function(el,key){
        //   el.disable = that.dataType == 1 ? that.fixData.includes(el.fieldCode) : that.fixDataStore.includes(el.fieldCode)
        // })
      });
      that.customData = newResult;
    },

    /**
     *  处理已选信息
     */
    handleDetailData() {
      const that = this;
      that.customData.forEach(function(ele, index) {
        ele.checkList = [];
        ele.children.forEach(function(el, key) {
          that.checkList.includes(el.fieldCode) ? ele.checkList.push(el.fieldCode) : '';
          el.disable = that.dataType == 1 ? that.fixData.includes(el.fieldCode) : that.fixDataStore.includes(el.fieldCode);
          // 如果字段中 fieldCode 不在已经配置的员工档案中
          if (!that.setList.includes(el.fieldCode)) {
            el.disable = true;
          }
        });
      });
    }
  },
  watch: {
    showCustomDialog: function(newData, oldData) {
      const that = this;
      that.customDialog = newData;
    },
    detailData: function(newData, oldData) {
      const that = this;
      // console.log(newData)
      that.checkList = !!newData && !!newData.length ? newData : [];
      that.handleDetailData();
    }
  },

  /* 接收数据 */
  mounted() {
    // console.log("传递的参数对象:",this.showCustomDialog)
    const that = this;
    that.customDialog = that.showCustomDialog;
    Promise.all([that.getInfo()]).then(function () {
      that.getAllFields();
    })
  }
};
</script>

<style lang="scss" scoped>
.custom-dialog {
  &-body {
    width: 100%;
    height: 410px;
    padding: 5px 0 22px 0;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;
  }
  &-wrap {
    .border-box {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    /* display */
    .inline-block {
      display: inline-block;
    }

    .block {
      display: block;
    }

    .top {
      vertical-align: top;
    }

    .middle {
      vertical-align: middle;
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

    .flex-between {
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }

    .flex-wrap {
      -webkit-flex-wrap: wrap;
      -moz-flex-wrap: wrap;
      -ms-flex-wrap: wrap;
      -o-flex-wrap: wrap;
      flex-wrap: wrap;
    }

    .detail-field {
      &-cell {
        width: 100%;
        margin-top: 24px;
        .el-checkbox {
          min-width: 25%;
          margin-bottom: 24px;
          & + .el-checkbox {
            margin-left: 0;
          }

          &.is-checked {
            /deep/ .el-checkbox__label {
              color: #1890ff;
            }
          }
        }
      }

      &-left {
        width: 100px;
        padding-top: 4px;
      }
      &-right {
        width: calc(100% - 100px);

        .el-checkbox-group {
          width: 100%;
        }
      }
    }
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

  &__checkbox {
    width: 100%;
    height: 410px;
    padding-top: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    overflow-y: auto;

    .el-checkbox {
      width: 22%;
      margin-left: 16px;
      line-height: 62px;
    }
  }
}
</style>
