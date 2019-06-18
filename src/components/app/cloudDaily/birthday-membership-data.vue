<!--
<birthday-membership-data
:fieldName="fieldName">
</birthday-membership-data>
 -->
<template>
  <div class="birth-number-contain">
    <h3 class="build-title title-flag">
      <span>{{ fieldName }}</span>
    </h3>
    <div class="data-list">
      <div class="data-item">
        <div class="data-progress">
          <span class="data-item-title">订单数占比</span>
          <div class="data-bottom">
            <div class="data-num">80.00%</div>
            <div class="data-percent"><span class="data-percent-first">8000</span>/<span class="data-percent-second">10000</span></div>
            <div class="data-top"></div>
          </div>
        </div>
        <div class="data-title">
          <p class="gic-pull-right">环比<span class="data-ratio">50.55%</span></p>
        </div>
      </div>
      <div class="data-item">
        <div class="data-progress">
          <span class="data-item-title">消费人数占比</span>
          <div class="data-bottom">
            <div class="data-num">80.00%</div>
            <div class="data-percent"><span class="data-percent-first">8000</span>/<span class="data-percent-second">10000</span></div>
            <div class="data-top"></div>
          </div>
        </div>
        <div class="data-title">
          <p class="gic-pull-right">环比<span class="data-ratio">50.55%</span></p>
        </div>
      </div>
      <div class="data-item">
        <div class="data-progress">
          <span class="data-item-title">消费金额占比</span>
          <div class="data-bottom">
            <div class="data-num">80.00%</div>
            <div class="data-percent"><span class="data-percent-first">8000</span>/<span class="data-percent-second">10000</span></div>
            <div class="data-top"></div>
          </div>
        </div>
        <div class="data-title">
          <p class="gic-pull-right">环比<span class="data-ratio">50.55%</span></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'birthday-membership-data',
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
.birth-number-contain {
  background: #fff;
  padding: 0 12px;
  position: relative;

  .build-title {
    height: 56px;
    line-height: 56px;
    padding-left: 10px;
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

  .data-item {
    margin-top: 10px;

    .data-item-title {
      width: 90px;
      display: inline-block;
    }

    .data-bottom {
      width: 204px;
      height: 10px;
      background: #f3f3f9;
      display: inline-block;
      position: relative;
      margin-top: 20px;
      border-radius: 2px;
    }

    .data-num {
      position: absolute;
      color: #508cee;
      top: -21px;
      left: 0;
      font-size: 14px;
      font-weight: 600;
    }

    .data-percent {
      position: absolute;
      top: -20px;
      right: 0;
    }

    .data-top {
      background: #508cee;
      height: 10px;
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      border-radius: 2px;
    }

    .data-ratio {
      font-size: 14px;
      font-weight: 600;
      margin-left: 5px;
    }

    .data-percent-first {
      margin-right: 5px;
    }

    .data-percent-second {
      margin-left: 5px;
    }

    .data-title {
      height: 30px;
    }

    .gic-pull-right {
      float: right;
    }
  }
}
</style>
