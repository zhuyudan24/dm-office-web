<template>
  <div class="staff-prob-panel">
    <div class="depart-cell">
      <!-- <div class="info-title font-16 color-303133">行政架构设置</div> -->
      <div class="m-t-24"><span class="font-14 color-606266 p-r-12">设置企业试用期时间</span><el-input-number v-model="probObj.probationDay" controls-position="right" @change="handleChange" :min="0" :max="31"> </el-input-number><span class="font-14 color-606266 p-l-12"> 天 </span><span class="font-14 color-606266 p-l-12 p-r-12"> + </span><el-input-number v-model="probObj.probationMonth" controls-position="right" @change="handleChange" :min="0" :max="6"> </el-input-number><span class="font-14 color-606266 p-l-12">月</span></div>
      <div class="p-l-138 m-t-24">
        <el-button type="primary" @click="saveSet">保 存</el-button>
      </div>
    </div>
    <!-- <div class="depart-cell">
      <div class="info-title m-b-50 font-16 color-303133">门店架构设置</div>
      <el-radio-group v-model="activeName" style="margin-bottom: 30px;">
        <template v-for="(item,index) in brandList">
          <el-radio-button label="top" :key="index+item.">top</el-radio-button>
        </template>

      </el-radio-group>
    </div> -->
  </div>
</template>
<script>
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: 'staff-info-set',
  data() {
    return {
      activeName: '',
      brandList: [],
      probObj: {
        probationDay: '',
        probationMonth: ''
      }
    };
  },

  methods: {
    /**
     * 值改变
     */
    /* eslint-disable */
    handleChange(value) {},

    /**
     * 保存
     */
    saveSet: _debounce(function() {
      const that = this;
      if (that.probObj.probationDay == '' || that.probObj.probationMonth == '') {
        that.$message.error({
          duration: 1000,
          message: '请设置时间'
        });
        return;
      }
      let para = {
        day: that.probObj.probationDay,
        month: that.probObj.probationMonth
      };
      postRequest('/haoban-manage-web/enterprise-probation-period-setting.json', para)
        .then(res => {
          // console.log(res,res.data,res.data.errorCode)
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
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
    }, 500),

    /**
     * 获取品牌列表
     */
    getBrandData() {
      const that = this;
      postRequest('/haoban-manage-web/brand/list', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              that.brandList = resData.result;
              that.activeName = resData.result[0].groupId;
              that.getStoreAuth(resData.result[0].groupId, 0);
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
     * 获取设置数据
     */
    getProbData() {
      const that = this;
      postRequest('/haoban-manage-web/find-enterprise-probation-period', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              that.probObj = resData.result;
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
  mounted() {
    const that = this;
    that.getProbData();
  },
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

.p-l-12 {
  padding-left: 12px;
}

.p-l-138 {
  padding-left: 138px;
}

.p-r-12 {
  padding-right: 12px;
}

.m-b-50 {
  margin-bottom: 50px;
}

.m-t-20 {
  margin-top: 20px;
}

.m-t-24 {
  margin-top: 24px;
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

.staff-prob-panel {
  /*width: 600px;*/
  /*margin: 0 auto;*/
  text-align: left;
  min-height: calc(100% - 240px);
}
</style>
