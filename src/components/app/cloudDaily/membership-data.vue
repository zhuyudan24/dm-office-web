<!--
<membership-data
:fieldName="fieldName">
</membership-data>
 -->
<template>
  <div class="data-number-contain">
    <h3 class="build-title title-flag">
      <span>{{ fieldName }}</span>
    </h3>
    <table class="data-number-table">
      <thead>
        <tr>
          <th class="w_22"></th>
          <th class="w_26">日</th>
          <th class="w_26">月</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colspan="1">会员总数</td>
          <td colspan="2">9,000,000</td>
        </tr>
        <tr>
          <td>新增会员</td>
          <td>473,960</td>
          <td>473,960</td>
        </tr>
        <tr>
          <td>同比</td>
          <td>100%</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>环比</td>
          <td>100%</td>
          <td>100%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  name: 'membership-data',
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
.data-number-contain {
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

  .data-number-table {
    width: 323px;
    text-align: center;

    thead {
      font-weight: 700;
      tr {
        height: 50px;
        line-height: 50px;
        background: #f3f4f8;
        font-size: 12px;
        text-align: left;
      }
      th {
        text-align: center;
      }
      .w_22 {
        width: 22%;
      }
      .w_26 {
        width: 26%;
      }
    }

    tbody {
      tr {
        height: 50px;
        line-height: 50px;
        font-size: 12px;
        td:first-child {
          font-size: 13px;
          font-weight: 600;
        }
      }
      tr:first-child {
        font-weight: 600;
        color: #7ca5f1;
      }
      tr:nth-child(odd) {
        background: #fff;
      }
    }
  }
}
</style>
