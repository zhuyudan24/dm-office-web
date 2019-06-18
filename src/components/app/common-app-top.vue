<!--
  应用公共顶部：
  <common-app-top
    :appName="appName"
    :appIcon="appIcon"
    @selectBrandId="selectBrandId">
  </common-app-top>
 -->
<template>
  <div class="app-top-wrap app-detail-wrap">
    <div class="my-customer-top">
      <div class="my-customer-name">
        <span class="app-icon "><img class="" :src="appIcon"/></span><span class="p-l-8">{{ appName }}</span>
      </div>
      <el-button class="border-radius-18 my-customer-return" @click="returnBack">返回</el-button>
      <div class="my-customer-brand">
        <el-select v-model="activeBrand" placeholder="请选择" @change="changeSelect">
          <el-option v-for="item in brandListData" :key="item.brandId" :label="item.name" :value="item.brandId"> </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import errMsg from '@/common/js/error';
import { postRequest } from '@/api/api';
export default {
  name: 'common-app-top',
  props: {
    appName: {
      type: String,
      default() {
        return '';
      }
    },
    appIcon: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      projectName: '', // 当前项目名
      activeBrand: '',
      brandListData: []
    };
  },

  methods: {
    /**
     * 返回
     */
    returnBack() {
      let that = this;
      that.$router.push('appcenter');
    },

    /**
     * 选择品牌
     */
    changeSelect(val) {
      let that = this;
      let groupId = '';
      that.brandListData.forEach(ele => {
        if (ele.brandId == val) {
          groupId = ele.groupId;
        }
      });
      that.$emit('selectBrandId', val, groupId);
    },

    /**
     * 获取品牌
     */
    getBrandData() {
      const that = this;
      postRequest('/haoban-manage-web/application-brand-list', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              that.brandListData = resData.result;
              if (!!that.$route.query.brandId) {
                that.activeBrand = that.$route.query.brandId;
                that.$emit('selectBrandId', that.$route.query.brandId);
                return false;
              }
              that.activeBrand = that.brandListData[0].brandId;
              // 由于门店选择组件中没有品牌id ,只有 groupId
              that.$emit('selectBrandId', that.brandListData[0].brandId, that.brandListData[0].groupId);
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
  watch: {
    brandId: function(newData, oldData) {
      const that = this;
      that.getBrandData();
    }
  },
  mounted() {
    const that = this;
    that.getBrandData();
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.w-500 {
  width: 500px;
}

.color-1890ff {
  color: #1890ff;
}

.app-detail-wrap {
  .my-customer-top {
    position: relative;
    height: 43px;
    line-height: 43px;
    .my-customer-return {
      position: absolute;
      left: 0px;
      bottom: 10px;
      width: 78px;
      height: 32px;
      border-radius: 18px;
    }

    .my-customer-brand {
      position: absolute;
      right: 0;
      bottom: 18px;
      width: 93px;
      height: 32px;
    }

    .my-customer-name {
      width: 200px;
      margin: 0 auto;

      i {
        font-size: 14px;
        color: #fff;
      }
      span {
        font-size: 16px;
        color: #000;
      }

      .app-icon {
        display: inline-block;
        width: 22px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        border-radius: 4px;
        /* background: -webkit-gradient(linear, right top, left top, from(#7ab6fb), to(#508bfe));
        background: -webkit-linear-gradient(right, #7ab6fb, #508bfe);
        background: -moz-linear-gradient(right, #7ab6fb, #508bfe);
        background: linear-gradient(right, #7ab6fb, #508bfe);
        background: -webkit-linear-gradient(right, #7ab6fb, #508bfe); */
        img {
          display: inline-block;
          max-width: 22px;
          max-height: 22px;
          vertical-align: bottom;
        }
      }
    }
  }
}
</style>
