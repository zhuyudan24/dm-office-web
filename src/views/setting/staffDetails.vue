<template>
  <div class="staffDetails-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ height: $store.state.bgHeight, 'overflow-y': 'auto' }">
        <div class="staffDetails-cell">
          <h2 class="m-b-25 font-w-500">{{ adminStruct.name }}</h2>
          <div class="staffDetails-cell-fixed">
            <template v-for="(item, index) in adminStruct.fixedList">
              <el-button disabled class="staffDetails-cell-btn" :key="'btn1' + index">{{ item.fieldName }}</el-button>
            </template>
          </div>
          <div class="staffDetails-cell-add font-0">
            <template v-for="(item, index) in adminStruct.defineList">
              <el-tag class="staffDetails-cell-btn" :key="'tag1' + index">{{ item.fieldName }} <i class="el-icon-circle-close" @click.stop="delField(index, item, adminStruct.defineList, 1)"></i></el-tag>
            </template>
            <el-button class="el-tag m-l-8 staffDetails-cell-btn" @click.stop="showDialogLayer(1)"><i class="el-icon-plus"></i>添加字段</el-button>
          </div>
        </div>
        <div class="staffDetails-cell">
          <h2 class="m-b-25 font-w-500">{{ storeStruct.name }}</h2>
          <div class="staffDetails-cell-fixed">
            <template v-for="(item, index) in storeStruct.fixedList">
              <el-button disabled class="staffDetails-cell-btn" :key="'btn' + index">{{ item.fieldName }}</el-button>
            </template>
          </div>
          <div class="staffDetails-cell-add font-0">
            <template v-for="(item, index) in storeStruct.defineList">
              <el-tag class="staffDetails-cell-btn" :key="'tag' + index">{{ item.fieldName }} <i class="el-icon-circle-close" @click.stop="delField(index, item, storeStruct.defineList, 2)"></i></el-tag>
            </template>
            <el-button class="el-tag m-l-8 staffDetails-cell-btn" @click.stop="showDialogLayer(2)"><i class="el-icon-plus"></i>添加字段</el-button>
          </div>
        </div>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <!-- 自定义字段 -->
    <staff-detail-field :detailData="detailData" :showCustomDialog="showCustomDialog" :dataType="dataType" @customHandleConfirm="customHandleConfirm"> </staff-detail-field>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import staffDetailField from '@/components/set/staff-detail-field.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
export default {
  name: 'staffDetails',
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '设置',
          path: '/companyAddress'
        },
        {
          name: '通讯录信息',
          path: '/staffDetails'
        },
        {
          name: '员工详细字段',
          path: ''
        }
      ],
      // 固定的字段
      fixData: ['clerkName', 'clerkPhone', 'groupName', 'positionName'],
      fixDataStore: ['clerkName', 'clerkPhone', 'groupName', 'positionName', 'clerkCode'],
      // 行政架构
      adminStruct: {
        name: '行政架构通讯录员工详情字段',
        fixedList: [
          /*{
            fieldName: "姓名",
            fields: "clerkName"
          }*/
        ],
        defineList: [
          /* {
            fieldName: "姓名",
            fields: "clerkName"
          },*/
        ]
      },
      // 门店架构'
      storeStruct: {
        name: '门店架构通讯录员工详情字段',
        fixedList: [
          /* {
            fieldName: "姓名",
            fields: "clerkName"
          },*/
        ],
        defineList: [
          /* {
            fieldName: "姓名",
            fields: "clerkName"
          }*/
        ]
      },
      showCustomDialog: false, // 自定义弹框显示标志
      detailData: [], // 已选数据 '类型：1行政架构，2门店架构'
      dataType: null //'类型：1行政架构，2门店架构'
    };
  },
  computed: {},
  methods: {
    /**
     * 自定义弹窗显示事件
     */
    showDialogLayer(type) {
      const that = this;
      that.showCustomDialog = true;
      that.dataType = type;
      if (type === 1) {
        that.detailData = that.adminStruct.fixedList.map(item => item.fields).concat(that.adminStruct.defineList.map(item => item.fields));
      } else {
        that.detailData = that.storeStruct.fixedList.map(item => item.fields).concat(that.storeStruct.defineList.map(item => item.fields));
      }
    },

    /**
     * 自定义弹框触发事件
     */
    customHandleConfirm(val) {
      const that = this;
      that.showCustomDialog = false;
      if (!!val) {
        return false;
      }
      that.getSaveFields(that.dataType);
    },

    /**
     * 删除字段
     */
    delField(index, item, list, flag) {
      const that = this;
      that
        .$alert('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          that.postDlField(item.fields, flag, list, index);
        })
        .catch(() => {});
    },

    /**
     * 删除字段---api
     */
    postDlField(code, type, list, index) {
      const that = this;
      const para = {
        fields: code,
        type: type // 类型：1行政架构，2门店架构'
      };
      postRequest('/haoban-manage-web/record/employee-show-field-delete.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('删除成功', 'success');
            list.splice(index, 1);
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
     * 获取已经选择的字段
     */
    getSaveFields(type) {
      const that = this;
      if (type === 1) {
        that.adminStruct.fixedList = [];
        that.adminStruct.defineList = [];
      } else {
        that.storeStruct.fixedList = [];
        that.storeStruct.defineList = [];
      }
      const para = {
        type: type // 类型：1行政架构，2门店架构'
      };
      postRequest('/haoban-manage-web/record/employee-show-field-detail.json', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            resData.result.forEach(function(ele, index) {
              if (Number.parseInt(type) === 1) {
                that.fixData.includes(ele.fields) ? that.adminStruct.fixedList.push(ele) : that.adminStruct.defineList.push(ele);
              } else {
                that.fixDataStore.includes(ele.fields) ? that.storeStruct.fixedList.push(ele) : that.storeStruct.defineList.push(ele);
              }
            });
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
  mounted() {
    const that = this;
    Promise.all([that.getSaveFields(1), that.getSaveFields(2)]);
  },
  components: {
    navCrumb,
    staffDetailField
  }
};
</script>
<style lang="less" scoped>
.right-content {
  /*width: 100%;*/
  padding: 24px;
  min-height: calc(100% - 240px);

  .right-box {
    background: #fff;
    padding: 24px;
    min-height: 500px;

    h2 {
      font-size: 16px;
      color: #303133;
    }

    .m-l-8 {
      margin-left: 8px;
    }

    .m-r-20 {
      margin-left: 20px;
    }

    .m-b-25 {
      margin-bottom: 25px;
    }

    .staffDetails-cell {
      & + .staffDetails-cell {
        margin-top: 14px;
        padding-top: 36px;
        border-top: 1px solid #e4e7ed;
      }
    }

    .el-tag {
      position: relative;
      cursor: pointer;

      .el-icon-circle-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 16px;
        color: #808995;
        cursor: pointer;
        &:hover {
          color: #f56c6c;
        }
      }
    }

    .staffDetails-cell-btn {
      width: 110px;
      height: 32px;
      padding: 0;
      margin: 0 20px 20px 0;
      text-align: center;
      vertical-align: top;
      font-size: 12px;
    }
  }
}
</style>
