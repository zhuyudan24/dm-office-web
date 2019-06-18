<template>
  <div class="app-detail-wrap common-right-wrap">
    <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
    <div class="day-set-content boder-box">
      <div class="day-set-title m-b-20">
        <span class="font-18 color-303133">{{ yearMonth }}</span
        ><span class="font-14 color-606266 p-l-18">{{ brandName }}商户统一日权重</span>
        <el-tooltip class="item" effect="dark" placement="right">
          <div slot="content">首次设置提交即下发门店月指标任务；<br />门店月指标将依照日权重自动分配，日指标=当月月指标*（日权重/∑当月日权重）；</div>
          <i class="el-icon-info font-8 color-c0c4cc p-l-8"></i>
        </el-tooltip>
      </div>
      <section>
        <div class="week">
          <div class="week-head day w-p-14">周日</div>
          <div class="week-head day w-p-14">周一</div>
          <div class="week-head day w-p-14">周二</div>
          <div class="week-head day w-p-14">周三</div>
          <div class="week-head day w-p-14">周四</div>
          <div class="week-head day w-p-14">周五</div>
          <div class="week-head day w-p-14">周六</div>
        </div>
        <div class="week week-body">
          <!-- 空格 -->
          <template v-if="myObject.hasEmptyGrid">
            <div class="day grid white-color" v-for="(it, index) in myObject.empytGrids" :key="index + 'empytGrids'"></div>
          </template>
          <div class="day w-p-14 selectable" :class="day == 0 ? 'hide' : ''" v-for="(day, index) in myObject.days" :key="index">
            <div class="w-120 font-14 color-909399 day-performance">{{ day.month + '-' + day.performanceDay }}</div>
            <div class="target-value ">
              <el-input class="w-120" v-model="day.weightValue" placeholder="请输入权重值" :disabled="settingAble == 0"></el-input>
            </div>
          </div>
          <template v-if="myObject.hasLastEmptyGrid">
            <div class="day grid white-color" v-for="(it, index) in myObject.lastEmpytGrids" :key="index + 'lastEmpytGrids'"></div>
          </template>
        </div>
      </section>
      <div class="day-set-btn m-t-24 text-center" v-if="settingAble == 1"><el-button type="primary" plain @click="resetData">重置</el-button><el-button type="primary" @click="saveSet">提交</el-button></div>
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
      brandName: '', // 商户(品牌) 名
      activeBrand: this.brandId, // 商户(品牌) id
      yearMonth: '',
      topMenuData: [
        {
          id: '1',
          name: '指标管理',
          path: `/monthList?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '2',
          name: '月指标',
          path: `/monthList?appIcon=${this.$route.query.appIcon}`
        },
        {
          id: '3',
          name: '商户统一日权重',
          path: ''
        }
      ],
      activeId: '3',
      myObject: {
        hasEmptyGrid: false,
        empytGrids: [],
        days: [],
        hasLastEmptyGrid: false,
        lastEmpytGrids: [],
        beginDate: '',
        endDate: ''
      },
      performanceWeightSettingList: [],
      settingStatus: 1, // 权重设置状态（0：未设置，1：已设置）
      settingAble: 1 // 是否可设置权重（0：不可设置，1：可设置）
    };
  },
  computed: {},
  methods: {
    /*
     * 判断闰年还是平年
     * @param year 年份
     */
    is_leap: function(year) {
      return year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0) ? true : false;
    },

    /*
     * 获取某一年各月的天数
     * @param year 年份
     */
    m_days: function(year) {
      return [31, 28 + this.is_leap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    },

    /*
     * 一位数添加 0
     * @param num (如:1-9)
     */
    addZero(num) {
      return num < 10 ? '0' + parseInt(num) : num;
    },
    // =============获取当月有多少天（下个月月初是多少）==========
    getThisMonthDays(year, month) {
      return new Date(year, month, 0).getDate();
    },
    // =============获取当月第一周第一天是周几===========
    getFirstDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },
    // =============获取当月最后一天是周几===========
    getLastDayOfWeek(year, month) {
      return new Date(Date.UTC(year, month - 1, this.getThisMonthDays(year, month))).getDay();
    },
    // =============获取当年月日是周几===========
    getYearMonthDayWeek(year, month, day) {
      return new Date(year, month - 1, day).getDay();
    },
    // =============== 判断是否跨月 ============
    isOverMonth(beginDate, endDate) {
      return beginDate.split('-')[1] == endDate.split('-')[1];
    },
    //====================计算当前年月空的几天 =============
    async calculateEmptyGrids(year, month) {
      const firstDayOfWeek = await this.getFirstDayOfWeek(year, month);
      let empytGrids = [];
      if (firstDayOfWeek > 0) {
        for (let i = 0; i < firstDayOfWeek; i++) {
          empytGrids.push(i);
        }
      }
      return empytGrids;
    },
    //====================计算当前年月日 之前空的几天 =============
    async calDayEmptyGrids(year, month, day) {
      const beginDayOfWeek = await this.getYearMonthDayWeek(year, month, day);
      let beginEmpytGrids = [];
      if (beginDayOfWeek > 0) {
        for (let i = 0; i < beginDayOfWeek; i++) {
          beginEmpytGrids.push(i);
        }
      }
      return beginEmpytGrids;
    },
    //====================计算当前年月最后几天空的几天 =============
    async calculateLastEmptyGrids(year, month) {
      const lastDayOfWeek = await this.getLastDayOfWeek(year, month);
      let lastEmpytGrids = [];
      if (lastDayOfWeek >= 0) {
        for (let i = 0; i < 6 - lastDayOfWeek; i++) {
          lastEmpytGrids.push(i);
        }
      }
      return lastEmpytGrids;
    },
    //====================计算当前年月日 后空的几天 =============
    async calLastEmptyGrids(year, month, day) {
      const endDayOfWeek = await this.getYearMonthDayWeek(year, month, day);
      let endEmpytGrids = [];
      if (endDayOfWeek >= 0) {
        for (let i = 0; i < 6 - endDayOfWeek; i++) {
          endEmpytGrids.push(i);
        }
      }
      return endEmpytGrids;
    },

    async calculateDays(year, month, beginDate, endDate) {
      let that = this;
      let myObject = {}; //月对象
      myObject['beginDate'] = beginDate; // 开始日期
      myObject['endDate'] = endDate; // 结束日期
      myObject['year'] = year;
      myObject['month'] = await that.addZero(month);

      let startDayArr = beginDate.split('-');
      let endDayArr = endDate.split('-');
      let isOverFlag = await that.isOverMonth(beginDate, endDate); // 是否跨月
      //计算当前开始日期 年月日空的几天
      let empytGrids = await that.calDayEmptyGrids(startDayArr[0], startDayArr[1], startDayArr[2]);
      if (empytGrids.length > 0) {
        myObject['hasEmptyGrid'] = true;
        myObject['empytGrids'] = empytGrids;
      } else {
        myObject['hasEmptyGrid'] = false;
        myObject['empytGrids'] = [];
      }
      // 最后空格
      let lastEmpytGrids = await that.calLastEmptyGrids(endDayArr[0], endDayArr[1], endDayArr[2]);
      if (lastEmpytGrids.length > 0) {
        myObject['hasLastEmptyGrid'] = true;
        myObject['lastEmpytGrids'] = lastEmpytGrids;
      } else {
        myObject['hasLastEmptyGrid'] = false;
        myObject['lastEmpytGrids'] = [];
      }

      if (!!isOverFlag) {
        // 不跨月
        myObject['days'] = await that.setCurrentMonth(startDayArr[0], startDayArr[1], startDayArr[2], endDayArr[2]);
      } else {
        // 跨月（先计算当月+再计算下月）
        let thisMonthDays = await that.getThisMonthDays(startDayArr[0], startDayArr[1]); //这个月有多少天
        let currentDays = await that.setCurrentMonth(startDayArr[0], startDayArr[1], startDayArr[2], thisMonthDays);
        let nextDays = await that.setCurrentMonth(endDayArr[0], endDayArr[1], 1, endDayArr[2]);
        myObject['days'] = [...currentDays, ...nextDays];
      }

      that.myObject = myObject;
      return myObject;
    },
    /**
     * 设置权重
     *
     */
    setCurrentMonth(year, month, startDay, endDay) {
      let that = this;
      let days = [];
      for (let i = startDay; i <= endDay; i++) {
        let day = {};
        /* 判断权重值 */
        if (!!that.performanceWeightSettingList.length) {
          that.performanceWeightSettingList.forEach(function(ele, index) {
            if (parseInt(ele.date.split('-')[2]) == i) {
              day['weightValue'] = Number(ele.weightValue).toFixed(2);
            }
          });
        } else {
          let dayWeek = that.getYearMonthDayWeek(year, month, i);
          if (dayWeek == 5) {
            day['weightValue'] = Number(1.8).toFixed(2);
          } else if (dayWeek == 6 || dayWeek == 0) {
            day['weightValue'] = Number(2.0).toFixed(2);
          } else {
            day['weightValue'] = Number(1.0).toFixed(2);
          }
        }
        day['performanceDay'] = that.addZero(i);
        day['date'] = year + '-' + that.addZero(month) + '-' + that.addZero(i);
        day['month'] = that.addZero(month);
        days.push(day);
      }
      return days;
    },
    /**
     * 重置
     */
    resetData() {
      let that = this;
      that.performanceWeightSettingList = [];
      let yearMonthArr = that.yearMonth.split('-');
      that.calculateDays(yearMonthArr[0], yearMonthArr[1], that.myObject.beginDate, that.myObject.endDate);
    },
    /**
     * 保存
     */
    saveSet: _debounce(function() {
      let that = this;
      let flagTip = true;
      that.myObject.days.forEach(ele => {
        if (!ele.weightValue || ele.weightValue <= 0 || !Number(ele.weightValue)) {
          flagTip = false;
        }
      });
      if (!flagTip) {
        this.$confirm('每日的权重不能为空,必须为数字,且不小于 0 ?', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {});
        return false;
      }
      that
        .$confirm(that.settingStatus == 0 ? '点击即下发门店月指标任务，请确认是否提交？' : '此次提交只影响日指标值，不会触发月指标任务，请确认是否提交？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          that.postSave(that.myObject.days);
        })
        .catch(() => {});
    }, 500),
    postSave(data) {
      let that = this;
      let para = {
        brandId: that.activeBrand,
        yearMonth: that.yearMonth,
        performanceWeightSettingList: JSON.stringify(data)
      };
      postRequest('/haoban-app-performance-web/performance/save-performance-weight-setting', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('保存成功', 'success');
            // 重新获取设置数据，有些设置后不可修改
            that.getData();
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
        yearMonth: that.yearMonth
      };
      postRequest('/haoban-app-performance-web/performance/query-performance-weight-setting', para)
        .then(res => {
          let resData = res.data;
          let yearMonthArr = that.yearMonth.split('-');
          if (resData.errorCode == 1) {
            that.performanceWeightSettingList = resData.result.performanceWeightSettingList || [];
            that.settingStatus = resData.result.settingStatus;
            that.settingAble = resData.result.settingAble;
            that.brandName = resData.result.brandName;
            that.myObject.beginDate = resData.result.beginDate;
            that.myObject.endDate = resData.result.endDate;
            // 计算 填充日期和权重值
            that.calculateDays(yearMonthArr[0], yearMonthArr[1], resData.result.beginDate, resData.result.endDate);
            return;
          }
          errMsg.errorMsg(resData);
          // 未与 GIC 商户关联 处理
          that.settingAble = 0;
          // that.calculateDays(yearMonthArr[0], yearMonthArr[1]);
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
        that.yearMonth = that.$route.query.yearMonth;
        that.getData();
      }
    }
  },
  mounted() {
    let that = this;
    document.documentElement.style.backgroundColor = '#f0f2f5';
    that.$emit('showTab', '11');
    if (!!that.brandId) {
      that.yearMonth = that.$route.query.yearMonth;
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
.day-set-content {
  padding: 10px 40px 40px 40px;
  .w-p-14 {
    width: 14%;
  }
  .w-120 {
    width: 120px;
  }
  .m-t-16 {
    margin-top: 16px;
  }
  .m-t-24 {
    margin-top: 24px;
  }
  .p-l-18 {
    padding-left: 18px;
  }
  .p-l-8 {
    padding-left: 8px;
  }
  .font-8 {
    font-size: 8px;
  }
  .color-c0c4cc {
    color: #c0c4cc;
  }
  .week {
    display: block;
    clear: both;
    overflow: hidden;

    .week-head {
      height: 44px;
      border: 1px solid #e3e5e9;
      background: #f1f3f7;
      justify-content: center;
      & + .week-head {
        border-left: none;
      }
    }
    &.week-body {
      .white-color {
        width: 14%;
        height: 80px;
      }
      .day-performance {
        margin: 5px 0 16px 0;
      }
      .day {
        border: 1px solid #e3e5e9;
        height: 80px;
        border-top: none;
        &.day:nth-child(7n + 1) {
          border-left: 1px solid #e3e5e9;
        }
        & + .day {
          border-left: none;
        }
      }
    }
    .day {
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      &.week-head {
        justify-content: center;
      }
    }
    .target-value {
      height: 20px;
      line-height: 20px;
    }
  }
  .el-icon-info {
    cursor: pointer;
  }
}
</style>
