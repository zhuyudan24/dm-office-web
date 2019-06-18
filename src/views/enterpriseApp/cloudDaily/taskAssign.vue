<template>
  <div class="app-detail-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="task-set-content boder-box">
      <div class="task-set-cell">
        <div class="font-16 color-606266 m-b-10 font-w-500">日报开关设置</div>
        <div class="font-14 color-606266 m-b-16">开启后，日报将定时发送</div>
        <div class="">
          <el-switch v-model="setData.status" active-text=" " inactive-text=" "> </el-switch>
        </div>
      </div>
      <div class="task-set-cell">
        <div class="font-16 color-606266 m-b-10 font-w-500">日报每日下发时间设置</div>
        <div class="font-14 color-606266 m-b-16">该事件设置将在次日生效，为避免影响当日日报的发送，请在日报发送后设置</div>
        <div>
          <el-time-select
            class="w-118"
            :editable="false"
            :clearable="false"
            v-model="setData.time"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:45'
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </div>
      </div>
      <div class="task-set-save m-t-30">
        <el-button type="primary" @click="saveSet">保 存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import appDetail from '@/components/app/app-detail.vue';
import commonDetailTop from '@/components/app/common-detail-top.vue';
import { _debounce } from '@/common/js/public';
import errMsg from '@/common/js/error';
import showMsg from '@/common/js/showmsg';
import { postRequest } from '@/api/api';
export default {
  name: 'reviewed',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      activeTab: '1',
      activeBrand: this.brandId, // 商户(品牌) id
      topMenuData: [
        {
          id: '1',
          name: '任务下发设置'
        }
      ],
      activeId: '1',
      setData: {
        status: false,
        time: '12:00'
      }
    };
  },
  computed: {},
  methods: {
    /**
     * 保存
     */
    saveSet: _debounce(function() {
      let that = this;
      that.postSave();
    }, 500),
    postSave() {
      let that = this;
      let para = {
        brandId: that.activeBrand,
        status: !!that.setData.status ? '1' : '0',
        time: that.setData.time
      };
      postRequest('/haoban-app-daily-web/daily/create-setting', para)
        .then(res => {
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
    },
    /**
     * 获取设置数据
     */
    getData() {
      let that = this;
      let para = {
        brandId: that.activeBrand
      };
      postRequest('/haoban-app-daily-web/daily/get-setting', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.setData.status = resData.result.status == 1 ? true : false;
            that.setData.time = resData.result.time;
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
    brandId: function(newData, oldData) {
      const that = this;
      if (!!newData) {
        that.activeBrand = newData;
        that.getData();
      }
    }
  },
  mounted() {
    let that = this;
    document.documentElement.style.backgroundColor = '#f0f2f5';
    that.$emit('showTab', '22');
    if (!!that.brandId) {
      that.getData();
    }
  },
  destroyed() {
    document.documentElement.style.backgroundColor = '#fff';
  },
  components: {
    appDetail,
    commonDetailTop
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.task-set-content {
  padding: 0 40px 40px 40px;
  .task-set-cell {
    padding: 30px 0;
    border-bottom: 1px solid #e4e7ed;

    .el-date-editor.el-input {
      width: 118px;
    }
  }
}
</style>
