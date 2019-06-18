<template>
  <div class="store-info">
    <div class="info-cell">
      <p class="title">门店信息</p>
      <el-form class="store-info-form info-form" label-width="90px">
        <el-form-item label="门店名称" prop="name">
          <el-input v-model="storeInfoData.storeName">
            <template slot="suffix">
              {{ storeInfoData.storeName ? storeInfoData.storeName.length : 0 }}/20
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="所属分组" prop="departmentName">
          <el-input v-model="storeInfoData.groupChainName" @focus="callSelector" :disabled="gicFlag">
            <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="门店图片(640*340)" prop="imageUrls">
          <div class="member-upload-image">
            <vue-office-upload-image projectName="haoban-manage-web" wxFlag="0" :actionUrl="uploadUrl" :imageList="imgs" :limitW="640" :limitH="340" :maxImageLength="10" @uploadOnSuccess="uploadOnSuccess" @sortImg="sortImg" @deleteImage="deleteImage"> </vue-office-upload-image>
          </div>
          <div class="tip font-12 color-909399 m-t-8 line-h-1">门店图片(640*340)，支持.jpg，.jepg，.png类型文件，最多添加10张图片</div>
        </el-form-item>
        <el-form-item label="联系电话" prop="phoneNumber">
          <el-input v-model="storeInfoData.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="phoneNumber">
          <el-time-select
            placeholder="起始时间"
            v-model="storeInfoData.openTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '24:00'
            }"
          >
          </el-time-select>
          ~
          <el-time-select
            placeholder="结束时间"
            v-model="storeInfoData.closeTime"
            :picker-options="{
              start: '00:00',
              step: '00:05',
              end: '24:00',
              minTime: storeInfoData.openTime
            }"
          >
          </el-time-select>
        </el-form-item>
        <el-form-item label="门店类型">
          <el-radio-group v-model="storeInfoData.storeType">
            <el-radio :label="0">自营</el-radio>
            <el-radio :label="1">联营</el-radio>
            <el-radio :label="2">代理</el-radio>
            <el-radio :label="3">代销</el-radio>
            <el-radio :label="4">托管</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="门店地址">
          <vue-office-area :areaOptions="areaOptions" @selected="selected" projectName="haoban-web" postUrl="/api-admin/dict-district-list"></vue-office-area>
          <el-input v-model="storeInfoData.postAddress">
            <template slot="suffix"
              >{{ (storeInfoData.postAddress || '').length }}/50</template
            >
          </el-input>
        </el-form-item>
        <el-form-item label="GPS坐标">
          <el-input v-model="location" class="m-r-10"></el-input>
          <a href="http://m.gpsspg.com/maps.htm" class="a-href" target="_blank">经纬度测试工具</a>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            门店代码
            <!-- <i class="el-icon-question" style="color:#C0C4CC;"></i> -->
          </template>
          <el-input v-model="storeInfoData.storeCode" :disabled="gicFlag">
            <template slot="suffix"
              >{{ (storeInfoData.storeCode || '').length }}/20</template
            >
          </el-input>
        </el-form-item>
        <el-form-item label="门店面积"> <el-input v-model="storeInfoData.storeArea" @blur="value => inputBlur(value)"></el-input><span class="font-14 p-l-10">平方米</span> </el-form-item>
      </el-form>
    </div>
    <div class="info-cell">
      <p class="title">店长信息</p>
      <el-form class="store-manager-info-form info-form" label-width="90px">
        <el-form-item label="店长姓名" prop="name">
          <el-input v-model="storeInfoData.managerName" :disabled="gicFlag">
            <template slot="suffix"
              >{{ (storeInfoData.managerName || '').length }}/10</template
            >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="storeInfoData.managerPhone" :disabled="disableFlag || gicFlag"></el-input>
        </el-form-item>
        <el-form-item label="店长性别">
          <el-radio-group v-model="storeInfoData.managerSex" :disabled="gicFlag">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="店长代码">
          <el-input v-model="storeInfoData.managerCode" :disabled="gicFlag">
            <template slot="suffix">
              {{ (storeInfoData.managerCode || '').length }}/20
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="info-cell">
      <p class="title">经营信息</p>
      <el-form class="operate-info-form info-form" label-width="90px">
        <el-form-item label="特色服务">
          <el-input type="textarea" :rows="2" v-model="storeInfoData.specialService"></el-input>
          <p class="counter t-rt c-909399">{{ (storeInfoData.specialService || '').length }}/20</p>
        </el-form-item>
        <el-form-item label="人均消费">
          <el-input v-model="storeInfoData.personCost">
            <template slot="suffix"
              >{{ (storeInfoData.personCost + '').length }}/10</template
            >
          </el-input>
        </el-form-item>
        <el-form-item label="推荐商品">
          <el-input type="textarea" :rows="2" v-model="storeInfoData.recommendGoods"></el-input>
          <p class="counter t-rt c-909399">{{ (storeInfoData.recommendGoods || '').length }}/100</p>
        </el-form-item>
        <el-form-item label="品牌介绍">
          <el-input type="textarea" :rows="2" v-model="storeInfoData.brandDes"></el-input>
          <p class="counter t-rt c-909399">{{ (storeInfoData.recommendGoods || '').length }}/200</p>
        </el-form-item>
      </el-form>
    </div>
    <div class="handle-area">
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
    <vue-select-store ref="storeSelector" :defaultList="defaultList" :treeSet="treeSet" :selectType="selectType" :forbidenList="[storeInfoData.storeGroupId]" @handleSelectedList="handleSelectedList"> </vue-select-store>
  </div>
</template>
<script>
import { postRequest } from '@/api/api';
import vueSelectStore from 'components/common/vueSelectStore';
export default {
  name: 'store-detail',
  components: {
    vueSelectStore
  },
  props: {
    storeInfo: {
      type: Object,
      default() {
        return {};
      }
    },
    gicFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      areaChainName: '',
      location: '',
      areaOptions: {},
      imgs: [],
      uploadUrl: '/haoban-manage-web/upload-img',
      defaultList: [], // 分组回显
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true, // 是否单选
        groupId: this.storeInfo.brandId,
        openNextBool: true // 展开下级不调用接口
      },
      selectType: 'group',
      disableFlag: false,
      storeInfoData: this.storeInfo
    };
  },
  methods: {
    inputBlur: function(val) {
      let that = this;
      if (!that.storeInfoData.storeArea) {
        that.storeInfoData.storeArea = '';
      }
      that.storeInfoData.storeArea = !!Number(that.storeInfoData.storeArea.replace(/[^\d.]/g, '')) ? that.storeInfoData.storeArea.replace(/[^\d+(.\d+)]/g, '') : '';
      that.storeInfoData.storeArea = Number(that.storeInfoData.storeArea).toFixed(2);
      if (that.storeInfoData.storeArea >= 999999) {
        that.storeInfoData.storeArea = Number(999999).toFixed(2);
      }
    },
    callSelector() {
      this.treeSet = {
        isSelectPerson: false,
        dialogVisible: true,
        isSingle: true, // 是否单选
        groupId: this.storeInfoData.brandId,
        openNextBool: true // 展开下级不调用接口
      };
    },
    handleSelectedList(list) {
      this.storeInfoData.groupChainName = !!list.length ? list[0].chainName : '';
      this.storeInfoData.departmentName = !!list.length ? list[0].label : '';
      this.storeInfoData.storeGroupId = !!list.length ? list[0].id : '';
    },
    selected(val) {
      let that = this;
      that.areaChainName = val.provinceName + '/' + val.cityName + '/' + val.countryName;
    },
    uploadOnSuccess(res, list) {
      res.file.url = res.res.result[0].qcloudImageUrl;
      list.push(res.file);
    },
    /* eslint-disable */
    sortImg(val) {
      this.imgs = val;
    },
    deleteImage(i) {
      this.imgs.splice(i, 1);
    },
    save() {
      let that = this;
      let locationArr = that.location.split(',');
      // 将门店经纬度信息拆分成两个字段
      that.storeInfoData.longitude = locationArr[1];
      that.storeInfoData.latitude = locationArr.length !== 2 ? '' : locationArr[0];
      that.storeInfoData.managerPhone = that.storeInfoData.managerPhone;
      that.storeInfoData.areaChainName = that.areaOptions.provinceName + '/' + that.areaOptions.cityName + '/' + that.areaOptions.countryName;
      let params = that.storeInfoData;
      let imageUrls = [];
      that.imgs.forEach(img => {
        imageUrls.push(img.url);
      });
      params.imageUrls = imageUrls.join(',');
      postRequest('/haoban-manage-web/store/update', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: '操作成功！'
            });
          } else {
            that.$message.error({
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.$message.error({
            message: e.message
          });
        });
    },
    formatStoreInfo(obj) {
      let that = this;
      that.defaultList = [
        {
          id: obj.storeGroupId,
          label: obj.departmentName
        }
      ];
      let arr = (obj.areaChainName || '').split('/');
      // 将门店地址信息的省市区地址拆分
      that.areaOptions = {
        provinceName: arr[0],
        provinceId: obj.provinceId,
        cityName: arr[1],
        cityId: obj.cityId,
        countryName: arr[2],
        countyId: obj.countyId
      };
      that.imgs = !obj.imageUrl ? [] : obj.imageUrl.split(',');
      let newImgs = [];
      that.imgs.forEach(img => {
        newImgs.push({ url: img });
      });
      that.imgs = newImgs;
      that.location = !!obj.longitude ? obj.latitude + ',' + obj.longitude : '';
      that.disableFlag = !!obj.managerPhone? true : false;
    }
  },
  watch: {
    storeInfo: function(newData) {
      this.treeSet.groupId = newData.brandId;
      this.storeInfoData = newData;
      this.formatStoreInfo(this.storeInfoData);
    }
  },
  beforeMount() {
    this.treeSet.groupId = this.storeInfo.brandId;
  },
  mounted() {
    this.storeInfoData = JSON.parse(JSON.stringify(this.storeInfo));
    this.formatStoreInfo(this.storeInfoData);
  }
};
</script>
<style lang="scss">

</style>
