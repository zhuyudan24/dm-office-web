<template>
  <div class="tip-area">
    <img src="../../../assets/guid6.png" />
    <p v-if="!groupInfo.isMine">暂无成员，联系建立共享企业的管理员，对方添加后即可查看</p>
    <template v-else>
      <p v-if="!!groupInfo.level">暂无成员，开始添加成员吧</p>
      <p v-if="!groupInfo.level">暂无成员，开始添加子分组吧</p>
      <el-button class="add-new-btn" @click="addNew" v-if="!!groupInfo.level">添加成员</el-button>
    </template>
  </div>
</template>
<script>
export default {
  name: 'addNewGuid',
  props: {
    groupInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    addNew() {
      let isStoreGroup = this.groupInfo.isStoreGroup;
      if (!isStoreGroup) {
        this.$emit('addEmployee');
      } else {
        this.$emit('addStoreEmployee');
      }
    }
  }
};
</script>
<style lang="scss">
.tip-area {
  width: 100%;
  text-align: center;
  padding: 150px 0 50px 0;
  p {
    font-size: 14px;
    font-weight: 400;
    color: rgba(128, 137, 149, 1);
  }
  .add-new-btn {
    border: 1px solid #409eff;
    color: #409eff;
    margin-top: 24px;
  }
}
</style>
