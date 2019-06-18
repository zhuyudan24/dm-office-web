<template>
  <div class="app-detail-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="task-set-content boder-box">
      <div class="task-set-cell">
        <div class="font-16 color-606266 m-b-20 font-w-500">话务任务逾期时间设置</div>
        <div class="set-line-item">
          <span class="set-line-item_title font-14 color-606266">话务任务下发</span>
          <el-input class="w-55" v-model="setObj.overDayJudge" placeholder="请输入内容"></el-input><span class="font-14 color-606266 p-l-10">天</span>
          <span class="font-14 color-909399 p-l-15">注：0天即为当天下发，当天完成，1天即为当天下发，次日24：00之前完成</span>
        </div>
        <div class="set-line-item">
          <span class="set-line-item_title font-14 color-606266">话务任务下发</span>
          <el-radio v-model="setObj.distributeTypeJudge" :label="0">分配给主门店的店长</el-radio>
          <el-radio v-model="setObj.distributeTypeJudge" :label="1">分配给专属导购</el-radio>
        </div>
        <div class="set-line-item">
          <span class="set-line-item_title font-14 color-606266">话务任务放弃前提</span>
          <el-input class="w-55" v-model="setObj.giveUpJudge" placeholder="请输入内容"></el-input><span class="font-14 color-606266 p-l-10">次</span>
          <span class="font-14 color-606266">呼叫后无响应</span>
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
      activeId: '1',
      activeBrand: this.brandId, // 商户(品牌) id
      topMenuData: [
        {
          id: '1',
          name: '话务任务设置'
        }
      ],
      setObj: {
        taskType: 1,
        overDayJudge: '',
        distributeTypeJudge: '',
        giveUpJudge: ''
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
        taskType: 1,
        overDayJudge: that.setObj.overDayJudge,
        giveUpJudge: that.setObj.giveUpJudge,
        distributeTypeJudge: that.setObj.distributeTypeJudge
      };
      postRequest('/haoban-app-tel-task-web/setting/save-task-setting', para)
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
        brandId: that.activeBrand,
        taskType: 1
      };
      postRequest('/haoban-app-tel-task-web/setting/find-task-setting', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.setObj = resData.result;
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
    that.$emit('showTab', '2');
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
.w-55 {
  width: 55px;
}
.task-set-content {
  padding: 0 40px 40px 40px;
  .task-set-cell {
    padding: 30px 0;

    .el-date-editor.el-input {
      width: 118px;
    }
  }

  .set-line-item {
    margin-bottom: 21px;
    .set-line-item_title {
      display: inline-block;
      width: 140px;
    }
  }
}
</style>
