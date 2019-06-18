<!--
<error-mointor
:fieldName="fieldName">
</error-mointor>
 -->
<template>
  <div class="anomal-monitor-contain">
    <h3 class="build-title title-flag">
      <span>{{ fieldName }}</span>
    </h3>
    <div class="progress-contain">
      <div class="progress-center">
        <div id="container_progress1" class="container-progress" style="position: relative;">
          <svg viewBox="0 0 100 100" style="display: block; width: 100%;">
            <path d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke="#eee" stroke-width="8" fill-opacity="0"></path>
            <path d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke="#1890ff" stroke-width="8" fill-opacity="0" style="stroke-dasharray: 289.067, 289.067; stroke-dashoffset: 72.2668; transition: stroke-dashoffset 1.5s ease-in;"></path>
          </svg>
          <div class="progressbar-text progressbar-text-left" style="position: absolute; left: 50%; top: 50%; padding: 0px; margin: 0px; transform: translate(-50%, -50%); color: #1890ff; font-size: 16px; font-weight: 600;">75.00%</div>
        </div>
        <p class="progress-text">无导购率</p>
      </div>
      <div class="progress-center">
        <div id="container_progress2" class="container-progress" style="position: relative;">
          <svg viewBox="0 0 100 100" style="display: block; width: 100%;">
            <path d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke="#eee" stroke-width="8" fill-opacity="0"></path>
            <path d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke="#1890ff" stroke-width="8" fill-opacity="0" style="stroke-dasharray: 289.067, 289.067; stroke-dashoffset: 216.8; transition: stroke-dashoffset 1.5s ease-in;"></path>
          </svg>
          <div class="progressbar-text progressbar-text-mid" style="position: absolute; left: 50%; top: 50%; padding: 0px; margin: 0px; transform: translate(-50%, -50%); color: #1890ff; font-size: 16px; font-weight: 600;">25.00%</div>
        </div>
        <p class="progress-text">退单率</p>
      </div>
      <div class="progress-center">
        <div id="container_progress3" class="container-progress" style="position: relative;">
          <svg viewBox="0 0 100 100" style="display: block; width: 100%;">
            <path d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke="#eee" stroke-width="8" fill-opacity="0"></path>
            <path d="M 50,50 m 0,-46 a 46,46 0 1 1 0,92 a 46,46 0 1 1 0,-92" stroke="#1890ff" stroke-width="8" fill-opacity="0" style="stroke-dasharray: 289.067, 289.067; stroke-dashoffset: 14.4534; transition: stroke-dashoffset 1.5s ease-in;"></path>
          </svg>
          <div class="progressbar-text progressbar-text-right" style="position: absolute; left: 50%; top: 50%; padding: 0px; margin: 0px; transform: translate(-50%, -50%); color: #1890ff; font-size: 16px; font-weight: 600;">95.00%</div>
        </div>
        <p class="progress-text">凭空退单率</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'error-mointor',
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
.progress-contain {
  display: flex;
  background: #fff;
  padding: 15px 0 30px 0;

  .progress-center {
    display: flex;
    align-items: center;
    flex-flow: column;
    flex: 1;
    .progress-text {
      margin-top: 10px;
      font-size: 12px;
    }
    .container-progress {
      position: relative;
      width: 80px;
      height: 80px;
      svg {
        display: block;
        width: 100%;
      }
      svg:not(:root) {
        overflow: hidden;
      }

      .progressbar-text-left {
        position: absolute;
        left: 50%;
        top: 50%;
        padding: 0px;
        margin: 0px;
        transform: translate(-50%, -50%);
        color: #1890ff;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
