<!--
<time-progress
:fieldName="fieldName">
</time-progress>
 -->
<template>
  <div class="time-progress-contain">
    <div>
      <p class="build-title title-flag">
        <span>{{ fieldName }}</span>
      </p>
    </div>
    <div class="time-progress-item">
      <div class="time-progress-title">
        <p class="gic-pull-left">50.00%</p>
        <p class="gic-pull-right"><span>15</span>/<span>30</span></p>
      </div>
      <div class="time-progress-bottom">
        <div class="time-progress-top"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'time-progress',
  props: {
    fieldName: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {};
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.gic-pull-left {
  float: left;
}
.gic-pull-right {
  float: right;
}
.time-progress-contain {
  background: #fff;
  position: relative;
  .time-progress-item {
    padding: 0 15px 30px 15px;
    .time-progress-title {
      height: 30px;
    }
    .time-progress-bottom {
      position: relative;
      width: 100%;
      height: 10px;
      background: #f3f3f9;
      border-radius: 2px;
    }
    .time-progress-top {
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      height: 10px;
      background: #508cee;
      border-radius: 2px;
    }
  }
}

.build-title {
  padding-left: 10px;
  height: 56px;
  line-height: 56px;
  text-align: left;
  background: #fff;
  span {
    display: inline-block;
    height: 14px;
    line-height: 10px;
    border-left: 2px solid #2b3953;
    padding-left: 12px;
    font-size: 17px;
    font-weight: 600;
  }
}
</style>
