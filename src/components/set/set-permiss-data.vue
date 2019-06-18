<template>
  <div class="select-area">
    <div class="setting-name" style="font-size: 14px;color: #606266;">
      {{ title }}
    </div>
    <ul class="particular-list">
      <template v-for="(item, index) in defaultSelection">
        <li class="item person-item" v-if="item.type == 1" :key="index + '_' + item.employeeClerkId">
          <div :class="['img-wrap', 'flex', 'flex-align-center', 'flex-pack-center', !item.headPic ? 'img-wrap-bg' : '']">
            <img v-if="item.headPic" :src="item.headPic" alt="headPic" />
            <i v-else class="iconfont icon-yewuduanmorentouxian"></i>
            <i class="el-icon-circle-close" @click="delCurrent(index, defaultSelection)"></i>
          </div>
          <p class="name">{{ item.name || item.label }}</p>
        </li>
        <li class="item group-item" v-if="item.type == 2 || item.type == 3" :key="index + '_' + item.groupId">
          {{ item.name || item.label }}
          <i class="el-icon-circle-close" @click="delCurrent(index, defaultSelection)"></i>
        </li>
      </template>
      <li class="item J_add-btn flex flex-align-center flex-pack-center" @click="showSelector">
        <i class="el-icon-plus"></i>
      </li>
    </ul>
    <!-- <vue-select-employee
      :defaultSelection="defaultSelection"
      :treeSet="treeSet"
      :treeData="treeData"
      :onlyPerson="onlyPerson"
      @handleSelectedList="handleSelectedList">
    </vue-select-employee> -->
  </div>
</template>
<script>
// import { deepCopy } from '@/utils/index';
// import vueSelectEmployee from "@/components/common/vueSelectEmployee";
// import strLength from '@/common/js/strlen';
// import showMsg from '@/common/js/showmsg';
// import errMsg from '@/common/js/error';
// import { _debounce } from '@/common/js/public';
// import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'set-permiss-data',
  components: {
    // vueSelectEmployee
  },
  props: {
    value: {
      type: [Object, Array],
      default() {
        return [];
      }
    },
    title: {
      type: String
    }
  },
  data() {
    return {
      // type: 1:人，2：部门，3：门店
      /*treeSet: {
        isSelectPerson: true, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      },
      treeData: {},*/
      defaultSelection: this.value || [] // 已选数据
      // onlyPerson: false, // 控制只能选人(true)
    };
  },
  methods: {
    /**
     * 删除选中的人
     */
    delCurrent(index, list) {
      list.splice(index, 1);
    },

    updateList(data) {
      const that = this;
      that.$emit('input', data);
    },

    /**
     * 处理树形控件选择的数据
     */
    handleSelectedList(list) {
      /*const that = this;
      console.log(list);
      that.defaultSelection = list
      that.$emit('input',list)
      that.updateList(list)*/
    },

    /**
     * 显示弹层
     */
    showSelector() {
      const that = this;
      that.$emit('showSelect');
      /*that.treeSet = {
                    dialogVisible: true,
                    isSingle: false,
                    isSelectPerson: true
                };
      console.log("参数:",that.value,that.defaultSelection,that.treeData)*/
      /*that.defaultSelection = that.value
      if (!!that.treeData.hasOwnProperty('treeData')) {
        return;
      }
      that.getDepartData(that.defaultSelection);*/
    }

    /**
     * 获取行政架构
     */
    /*getDepartData(selData) {
      const that = this;
      postRequest('/haoban-manage-web/dept/deptListForCompany',{})
      .then((res) => {
        let resData = res.data;
        if (resData.errorCode == 1) {
          if (!!resData.result) {
            let treeData = [];
            let personData = [];
            if (res.data.errorCode == 1) {
              treeData = res.data.result.departmentList || [];
              personData = res.data.result.searchList || [];
            }
            // _this.formatGroupData(treeData, personData);
            that.treeData = {
              treeData,
              personData
            };
            that.defaultSelection = selData;
            that.$forceUpdate();
          }else {
            that.$message.error({
              duration: 1000,
              message: '暂无数据'
            })
          }
          return;
        }
        errMsg.errorMsg(resData);
      })
      .catch(function (error) {
        that.$message.error({
          duration: 1000,
          message: error.message
        })
      });
    },*/
  },
  watch: {
    value: function(newData, oldData) {
      let that = this;
      that.defaultSelection = newData;
    }
  },
  mounted() {
    let that = this;
    that.defaultSelection = that.value;
  }
};
</script>
<style lang="scss">
.flex {
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
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
.select-area {
  .setting-name {
    .a-href {
      font-size: 12px;
      margin-left: 10px;
    }
  }

  .particular-list {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;

    .item {
      position: relative;
      margin-right: 24px;
      margin-top: 30px;
      width: 40px;

      .el-icon-circle-close {
        position: absolute;
        font-size: 16px;
        color: #808995;
        right: -8px;
        top: -8px;
        cursor: pointer;
        &:hover {
          color: #f56c6c;
        }
      }

      .img-wrap {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 4px;
        &.img-wrap-bg {
          background: #82c5ff;
        }
      }

      .icon-yewuduanmorentouxian {
        font-size: 20px;
        color: #e5f3ff;
      }

      img {
        width: 100%;
        border-radius: 4px;
      }

      .name {
        width: 100%;
        font-size: 12px;
        text-align: center;
        margin-top: 20px;
        overflow: hidden;
      }

      &.group-item {
        padding: 0 10px;
        width: auto;
        height: 30px;
        line-height: 32px;
        background: rgba(236, 245, 255, 1);
        border: 1px solid rgba(217, 236, 255, 1);
        border-radius: 4px;
        font-size: 12px;
        color: rgba(64, 158, 255, 1);
        margin-top: 34px;
      }

      &.J_add-btn {
        height: 40px;
        background: rgba(251, 253, 255, 1);
        border: 1px dashed rgba(192, 204, 218, 1);
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        box-sizing: border-box;
        cursor: pointer;
        &:hover {
          color: #1890ff;
          border-color: #1890ff;
          i {
            color: #1890ff;
          }
        }
      }
    }
  }

  .check-more {
    color: #409eff;
    margin: 20px 0;
    cursor: pointer;
  }
}
</style>
