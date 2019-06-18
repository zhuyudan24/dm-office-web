<template>
  <div class="jurisdiction-setting">
    <div class="only-visivble-there permission-div">
      <div class="permission-div-title">
        <span>本部门员工仅可见本部门员工</span>
        <el-switch v-model="visibleThere" @change="switchPermission(visibleThere, 'visibleThere', 'visibleSelf')" active-color="#409EFF" inactive-color="#DCDFE6"> </el-switch>
      </div>
      <div class="particular-setting" v-if="visibleThere">
        <select-area @callPerSelector="callPerSelector" :treeData="treeData" :butList="butList" :specialList="specialList"> </select-area>
      </div>
    </div>
    <div class="only-visivble-self permission-div">
      <div class="permission-div-title">
        <span>本部门员工仅可见自己</span>
        <el-switch v-model="visibleSelf" @change="switchPermission(visibleSelf, 'visibleSelf', 'visibleThere')" active-color="#409EFF" inactive-color="#DCDFE6"> </el-switch>
      </div>
      <div class="particular-setting" v-if="visibleSelf">
        <select-area @callPerSelector="callPerSelector" :treeData="treeData" :butList="selfButList" :specialList="selfSpecialList"> </select-area>
      </div>
    </div>
  </div>
</template>
<script>
import selectArea from 'components/contacts/permissionSet/selectArea';
export default {
  name: 'permissionSetting',
  components: {
    selectArea
  },
  props: {
    butList: {
      type: Array,
      default() {
        return [];
      }
    },
    specialList: {
      type: Array,
      default() {
        return [];
      }
    },
    selfButList: {
      type: Array,
      default() {
        return [];
      }
    },
    selfSpecialList: {
      type: Array,
      default() {
        return [];
      }
    },
    visibleSpecialLsit: {
      type: Array,
      default() {
        return [];
      }
    },
    onlySelfApartList: {
      type: Array,
      default() {
        return [];
      }
    },
    treeData: {
      type: Object,
      default() {
        return {};
      }
    },
    departInfo: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      visibleThere: false,
      visibleSelf: false
    };
  },
  methods: {
    /**
     * 切换权限设置
     */
    switchPermission(val, _this, _there) {
      val && (this[_there] = !val);
      if (this.visibleSelf) {
        this.departInfo.type = 2;
      } else if (this.visibleThere) {
        this.departInfo.type = 1;
      } else {
        this.departInfo.type = '';
      }
    },
    callPerSelector(type, list) {
      this.$emit('callPerSelector', type, list);
    }
  },
  mounted() {
    let type = this.departInfo.type;
    this.visibleThere = !!(type == 1);
    this.visibleSelf = !!(type == 2);
  },
  watch: {
    departInfo: {
      handler(newValue, oldValue) {
        let type = newValue.type;
        this.visibleThere = !!(type == 1);
        this.visibleSelf = !!(type == 2);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss">
.jurisdiction-setting {
  padding: 36px 32px 55px;
  font-size: 14px;

  .permission-div {
    margin-bottom: 30px;
    .permission-div-title {
      line-height: 20px;
    }

    .particular-setting {
      width: 480px;
      min-height: 300px;
      border-radius: 2px;
      background: #f5f7fa;
      margin: 32px 0;
      padding: 20px 20px 1px;
    }
  }

  .el-switch {
    padding-left: 12px;
  }
}
</style>
