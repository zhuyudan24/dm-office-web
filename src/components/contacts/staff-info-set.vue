<template>
  <div class="staff-info-panel">
    <div class="info-title m-b-50 font-16 color-303133">员工档案信息将应用在以下两个地方</div>
    <div class="flex flex-align-center">
      <div class="flex-1">
        <img src="../../assets/guid4.png" alt="" />
        <p class="m-t-20 font-14 color-606266">个人信息页展示</p>
      </div>
      <div class="flex-1">
        <img src="../../assets/guid5.png" alt="" />
        <p class="m-t-20 font-14 color-606266">员工档案</p>
      </div>
    </div>
    <div class="info-btn m-t-60 font-14">
      <el-button type="primary" @click="$router.push('/staffRecordsTemplate')">进入档案设置</el-button>
    </div>
  </div>
</template>
<script>
// import showMsg from '@/common/js/showmsg';
// import errMsg from '@/common/js/error';
// import strLength from '@/common/js/strlen';
// import { _debounce, formatDate } from '@/common/js/public';
// import { getRequest, postRequest, postJson, postForm } from '@/api/api';
export default {
  name: 'staff-info-set',
  data() {
    return {};
  },

  methods: {
    /**
     * 表格---多选
     */
  },
  // mounted() {},
  components: {}
};
</script>
<style lang="less" scoped>
.bg-82C5FF {
  background: #82c5ff;
}

.color-303133 {
  color: #303133;
}

.color-606266 {
  color: #606266;
}

.font-14 {
  font-size: 14px;
}

.font-16 {
  font-size: 16px;
}

.w-80 {
  width: 80px;
}

.w-130 {
  display: inline-block;
  width: 130px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.m-b-50 {
  margin-bottom: 50px;
}

.m-t-20 {
  margin-top: 20px;
}

.m-t-60 {
  margin-top: 60px;
}

.common-wrap__page {
  margin-top: 24px;
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

.flex-wrap {
  -webkit-flex-wrap: wrap;
  -moz-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  -o-flex-wrap: wrap;
  flex-wrap: wrap;
}

.flex-space-between {
  -webkit-justify-content: space-between;
  -moz-justify-content: space-between;
  -ms-justify-content: space-between;
  -o-justify-content: space-between;
  justify-content: space-between;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.staff-info-panel {
  width: 600px;
  margin: 0 auto;
  text-align: center;

  img {
    width: 68px;
  }
}
</style>
