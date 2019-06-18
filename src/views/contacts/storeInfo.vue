<template>
  <div class="common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box">
        <div>
          <div class="store-info">
            <div class="info-cell">
              <p class="title font-w-500">门店信息</p>
              <el-form :rules="rules" :model="storeInfo" ref="storeInfo" class="store-info-form info-form" label-width="100px">
                <el-form-item label="门店名称" prop="storeName">
                  <limitInput :inputWidth="500" :inputValue.sync="storeInfo.storeName" :holder="''" :maxLength="10"> </limitInput>
                </el-form-item>
                <el-form-item label="所属分组" prop="departmentName">
                  <el-input v-model="storeInfo.groupChainName" @focus="callSelector" :disabled="gicFlag">
                    <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
                  </el-input>
                </el-form-item>
                <el-form-item label="门店图片" prop="imageUrls">
                  <div class="member-upload-image">
                    <vue-office-upload-image projectName="haoban-manage-web" wxFlag="0" :actionUrl="uploadUrl" :imageList="storeInfo.imageUrls" :limitW="640" :limitH="340" :maxImageLength="10" @uploadOnSuccess="uploadOnSuccess" @sortImg="sortImg" @deleteImage="deleteImage"> </vue-office-upload-image>
                  </div>
                  <div class="tip font-12 color-909399 m-t-8 line-h-1">门店图片(640*340)，支持.jpg，.jepg，.png类型文件，最多添加10张图片</div>
                </el-form-item>
                <el-form-item label="联系电话" prop="phoneNumber">
                  <el-input v-model="storeInfo.phoneNumber"></el-input>
                </el-form-item>
                <el-form-item label="营业时间" prop="openTime">
                  <el-time-select
                    :editable="false"
                    placeholder="起始时间"
                    v-model="storeInfo.openTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:05',
                      end: '24:00'
                    }"
                  >
                  </el-time-select>
                  ~
                  <el-time-select
                    :editable="false"
                    placeholder="结束时间"
                    v-model="storeInfo.closeTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:05',
                      end: '24:00',
                      minTime: storeInfo.openTime
                    }"
                  >
                  </el-time-select>
                </el-form-item>
                <el-form-item label="门店类型" prop="storeType">
                  <el-radio-group v-model="storeInfo.storeType">
                    <el-radio :label="0">自营</el-radio>
                    <el-radio :label="1">联营</el-radio>
                    <el-radio :label="2">代理</el-radio>
                    <el-radio :label="3">代销</el-radio>
                    <el-radio :label="4">托管</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="门店地址" prop="areaId">
                  <vue-office-area :areaOptions="areaOptions" @selected="selected" projectName="haoban-web" postUrl="/haoban-manage-web/dict-district-list"> </vue-office-area>
                  <div class="m-t-15">
                    <limitInput :inputWidth="500" :inputValue.sync="storeInfo.postAddress" :holder="''" :maxLength="50"> </limitInput>
                  </div>
                </el-form-item>
                <el-form-item label="GPS坐标" prop="location">
                  <el-input v-model="storeInfo.location" class="m-r-10"></el-input>
                  <a href="http://m.gpsspg.com/maps.htm" class="a-href" target="_blank" rel="nofollow noopener noreferrer">经纬度测试工具</a>
                </el-form-item>
                <el-form-item prop="storeCode">
                  <template slot="label">
                    门店代码
                    <!-- <i class="el-icon-question" style="color:#C0C4CC;"></i> -->
                  </template>
                  <limitInput :inputWidth="500" :disflag="gicFlag" :inputValue.sync="storeInfo.storeCode" :holder="''" :maxLength="20" :getByType="'char'"> </limitInput>
                </el-form-item>
                <el-form-item label="门店面积"> <el-input v-model="storeInfo.storeArea" @blur="value => inputBlur(value)"></el-input><span class="font-14 p-l-10">平方米</span> </el-form-item>
              </el-form>
            </div>
            <div class="info-cell">
              <p class="title font-w-500">店长信息</p>
              <el-form ref="storeManager" :rules="rules" :model="storeInfo" class="store-manager-info-form info-form" label-width="100px">
                <el-form-item label="店长姓名" prop="managerName">
                  <limitInput :inputWidth="500" :disflag="gicFlag" :inputValue.sync="storeInfo.managerName" :holder="''" :maxLength="10"> </limitInput>
                </el-form-item>
                <el-form-item label="手机号码" prop="managerPhone">
                  <el-input v-model="storeInfo.managerPhone" :disabled="disableFlag || gicFlag"></el-input>
                </el-form-item>
                <el-form-item label="店长性别">
                  <el-radio-group v-model="storeInfo.managerSex" :disabled="gicFlag">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="店长代码" prop="managerCode">
                  <limitInput :inputWidth="500" :disflag="gicFlag" :inputValue.sync="storeInfo.managerCode" :holder="''" :maxLength="20" :getByType="'char'"> </limitInput>
                </el-form-item>
              </el-form>
            </div>
            <div class="info-cell">
              <p class="title font-w-500">经营信息</p>
              <el-form ref="storeOperate" :rules="rules" :model="storeInfo" class="operate-info-form info-form" label-width="90px">
                <el-form-item label="特色服务" prop="specialService">
                  <el-input type="textarea" :rows="2" v-model="storeInfo.specialService"></el-input>
                  <p class="counter t-rt c-909399 font-12">{{ (storeInfo.specialService || '').length }}/20</p>
                </el-form-item>
                <el-form-item label="人均消费" prop="personCost">
                  <limitInput :inputWidth="500" :inputValue.sync="storeInfo.personCost" :holder="''" :maxLength="10"> </limitInput>
                </el-form-item>
                <el-form-item label="推荐商品">
                  <el-input type="textarea" :rows="2" v-model="storeInfo.recommendGoods"></el-input>
                  <p class="counter t-rt c-909399 font-12">{{ (storeInfo.recommendGoods || '').length }}/100</p>
                </el-form-item>
                <el-form-item label="品牌介绍">
                  <el-input type="textarea" :rows="2" v-model="storeInfo.brandDes"></el-input>
                  <p class="counter t-rt c-909399 font-12">{{ (storeInfo.recommendGoods || '').length }}/200</p>
                </el-form-item>
              </el-form>
            </div>
            <div class="handle-area">
              <el-button type="primary" @click="clickToSave">保 存</el-button>
            </div>
          </div>
          <vue-select-store ref="storeSelector" :defaultList="defaultList" :treeSet="treeSet" selectType="group" :forbidenList="[storeInfo.storeGroupId]" @handleSelectedList="handleSelectedList"> </vue-select-store>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import limitInput from '@/components/limit-input.vue';
import { getRequest, postRequest } from '@/api/api';
// import { _debounce } from '@/common/js/public';
import vueSelectStore from 'components/common/vueSelectStore';
export default {
  name: 'store-info',
  components: {
    navCrumb,
    vueSelectStore,
    limitInput
  },
  data() {
    let validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入联系电话'));
      } else {
        let reg = /^1[34578]\d{9}$/;
        let regPhone = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/;
        if (!reg.test(value) && !regPhone.test(value)) {
          this.isNew = true;
          return callback(new Error('联系电话格式不正确'));
        } else {
          return callback();
        }
      }
    };
    let validateCellPhone = (rule, value, callback) => {
      if (value) {
        let reg = /^1[34578]\d{9}$/;
        if (!reg.test(value)) {
          return callback(new Error('手机号码格式不正确'));
        } else {
          return callback();
        }
      } else {
        return callback(new Error('请输入手机号码'));
      }
    };
    let validateCode = (rule, value, callback) => {
      if (value) {
        let reg = /[^\x00-\xff]/gi;
        if (value.match(reg)) {
          return callback(new Error('门店代码不能是中文或表情'));
        } else {
          return callback();
        }
      } else {
        return callback(new Error('请输入门店代码'));
      }
    };
    let validateMCode = (rule, value, callback) => {
      if (value) {
        let reg = /[^\x00-\xff]/gi;
        if (value.match(reg)) {
          return callback(new Error('店长代码不能是中文或表情'));
        } else {
          return callback();
        }
      } else {
        return callback(new Error('请输入店长代码'));
      }
    };
    let validateMoney = (rule, value, callback) => {
      if (value) {
        let reg = /^\d+(\.\d+)?$/;
        if (!reg.test(value * 1)) {
          return callback(new Error('人均消费只能为非负整数或者小数'));
        } else {
          return callback();
        }
      } else {
        return callback();
      }
    };
    let validateHours = (rule, value, callback) => {
      if (value) {
        if (!!this.storeInfo.closeTime) {
          return callback();
        } else {
          return callback(new Error('请选择营业时间'));
        }
      } else {
        return callback(new Error('请选择营业时间'));
      }
    };
    return {
      gicFlag: !this.$route.query.gicFlag || this.$route.query.gicFlag == 'false' ? false : true,
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '门店架构',
          path: '/storeFrame'
        },
        {
          name: '添加门店',
          path: ''
        }
      ],
      editpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '企业通讯录',
          path: '/administrativeFrame'
        },
        {
          name: '门店架构',
          path: '/storeFrame'
        },
        {
          name: '编辑门店',
          path: ''
        }
      ],
      treeSet: {
        isSelectPerson: false,
        dialogVisible: false,
        isSingle: true, // 是否单选
        groupId: '',
        openNextBool: true // 展开下级不调用接口
      },
      disableFlag: false,
      defaultList: [], // 分组回显
      storeInfo: {
        storeName: '', // 店铺名称
        storeGroupId: '', // 所属分组
        departmentName: '',
        /* enterpriseId: '', // 企业id, 后端 session 中取，保存不传
        brandId: '', // 品牌id, 暂时不用穿 */
        imageUrls: [], // 门店图片
        phoneNumber: '', // 联系电话
        openTime: '', // 营业开始时间
        closeTime: '', // 营业结束时间
        shopHours: '', //营业时间
        storeType: 0, //门店类型（0:自营,1:联营,2:代理(加盟),3:代销,4:托管）'
        countryId: '', // 国家id
        provinceId: '', // 省id
        cityId: '', // 市id
        areaId: '', // 区id
        postAddress: '', // 详细地址
        longitude: '', // 经度
        latitude: '', // 纬度
        location: '', // 经纬度
        storeArea: '', // 门店面积
        mangerName: '', // 店长姓名
        storeManagerId: '', // 店长id
        managerPhone: '', // 店长电话
        managerCode: '', // 店长code
        maangerSex: '', // 性别
        storeCode: '', // 门店编码
        storeId: '' // 门店id
      },
      areaChainName: '',
      areaOptions: {},
      imgs: [],
      uploadUrl: '/haoban-manage-web/upload-img',
      rules: {
        storeName: [{ required: true, message: '请输入门店名称', trigger: 'blur' }],
        departmentName: [{ required: true, message: '请选择所属分组', trigger: 'blur' }],
        groupChainName: [{ required: true, message: '请选择部门', trigger: 'change' }],
        imageUrls: [{ type: 'array', required: true, message: '请选择门店图片', trigger: 'change' }],
        areaId: [{ required: true, message: '请选择门店地址', trigger: 'blur' }],
        storeType: [{ required: true, message: '请选择门店类型', trigger: 'blur' }],
        openTime: [{ required: true, validator: validateHours, trigger: 'blur' }],
        location: [{ required: true, message: '请选择经纬度', trigger: 'blur' }],
        phoneNumber: [{ required: true, validator: validatePhone, trigger: 'blur' }],
        storeCode: [{ required: true, validator: validateCode, trigger: 'blur' }],
        managerName: [{ required: true, message: '请输入店长姓名', trigger: 'blur' }],
        managerPhone: [{ required: true, validator: validateCellPhone, trigger: 'blur' }],
        managerCode: [{ required: true, validator: validateMCode, trigger: 'blur' }],
        specialService: [{ max: 20, message: '长度在 20 个字符以内', trigger: 'blur' }],
        personCost: [{ validator: validateMoney, trigger: 'blur' }]
      }
    };
  },
  methods: {
    inputBlur: function(val) {
      let that = this;
      if (!that.storeInfo.storeArea) {
        that.storeInfo.storeArea = '';
      }
      that.storeInfo.storeArea = !!Number(that.storeInfo.storeArea.replace(/[^\d.]/g, '')) ? that.storeInfo.storeArea.replace(/[^\d+(.\d+)]/g, '') : '';
      that.storeInfo.storeArea = Number(that.storeInfo.storeArea).toFixed(2);
      if (that.storeInfo.storeArea >= 999999) {
        that.storeInfo.storeArea = Number(999999).toFixed(2);
      }
    },
    callSelector() {
      this.treeSet.dialogVisible = true;
    },
    handleSelectedList(list) {
      this.storeInfo.groupChainName = !!list.length ? list[0].chainName : '';
      this.storeInfo.departmentName = !!list.length ? list[0].label : '';
      this.storeInfo.storeGroupId = !!list.length ? list[0].id : '';
      if (this.storeInfo.departmentName) {
        this.$refs.storeInfo.clearValidate('departmentName');
      }
    },
    /**
     * 省市区选择
     */
    selected(val) {
      // 省市区选择之后更新店铺信息对应的字段
      let that = this;
      that.storeInfo.provinceId = val.province;
      that.storeInfo.cityId = val.city || '';
      that.storeInfo.areaId = val.areaId || '';
      // that.areaChainName = val.provinceName + '/' + val.cityName + '/' + val.countryName;
    },
    // 获取店铺信息
    getStoreInfo() {
      let that = this;
      let params = { storeId: that.$route.query.storeId };
      getRequest('/haoban-manage-web/store/findStoreById', params).then(res => {
        if (res.data.errorCode == 1) {
          that.showEmployee = 'store';
          that.defaultList = [
            {
              id: res.data.result.storeGroupId,
              label: res.data.result.departmentName
            }
          ];
          that.formatStoreInfo(res.data.result);
        } else {
          that.$message.error({
            message: res.data.message
          });
        }
      });
    },
    async clickToSave() {
      let that = this;
      let p1 = new Promise(function(resolve, reject) {
        that.$refs['storeInfo'].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      let p2 = new Promise(function(resolve, reject) {
        that.$refs['storeManager'].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      let p3 = new Promise(function(resolve, reject) {
        that.$refs['storeOperate'].validate(valid => {
          if (valid) {
            resolve();
          }
        });
      });
      Promise.all([p1, p2, p3]).then(function() {
        that.save();
      });
    },
    async formatStoreInfo(obj) {
      let that = this;
      let arr = (obj.areaChainName || '').split('/');
      // 将店铺地址信息拆分为省市区地址字段
      that.areaOptions = {
        provinceName: arr[0],
        provinceId: obj.provinceId,
        cityName: arr[1],
        cityId: obj.cityId,
        countryName: arr[2],
        countyId: obj.countryId
      };
      that.imgs = !obj.imageUrl ? [] : obj.imageUrl.split(',');
      let newImgs = [];
      that.imgs.forEach(img => {
        newImgs.push({ url: img });
      });
      // that.imgs = newImgs;
      // obj.imageUrls = !!obj.imageUrl ? obj.imageUrl : [];
      obj.imageUrls = newImgs;
      obj.location = !!obj.longitude ? obj.latitude + ',' + obj.longitude : '';
      that.storeInfo = obj;
      that.disableFlag = !that.isNew && !!that.storeInfo.managerPhone;
    },
    uploadOnSuccess(res, list) {
      // 店铺图片上传成功后拿到返回的URL做预览
      res.file.url = res.res.result[0].qcloudImageUrl;
      list.push(res.file);
    },
    /* eslint-disable */
    sortImg(val) {
      this.storeInfo.imageUrls = val;
    },
    deleteImage(i) {
      this.storeInfo.imageUrls.splice(i, 1);
    },
    save() {
      let that = this;
      let locationArr = that.storeInfo.location.split(',');
      that.storeInfo.longitude = locationArr[1];
      that.storeInfo.latitude = locationArr.length !== 2 ? '' : locationArr[0];
      // that.storeInfo.areaChainName = that.areaChainName;
      let params = JSON.parse(JSON.stringify(that.storeInfo));
      let imageUrls = [];
       that.storeInfo.imageUrls.forEach(img => {
        imageUrls.push(img.url);
      });
      params.imageUrls = imageUrls.join(',');
      let url = that.isNew ? '/haoban-manage-web/store/insert' : '/haoban-manage-web/store/update';
      postRequest(url, params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              message: res.data.message
            });
            window.history.go(-1);
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
    }
  },
  computed: {
    isNew() {
      if (this.$route.query.storeId) {
        return false;
      } else {
        return true;
      }
    }
  },
  beforeMount() {
    this.treeSet.groupId = this.$route.query.firstLevelId;
    if (!this.isNew) {
      this.getStoreInfo();
    }
  },
  mounted() {
    const that = this;
    if (that.$route.query.storeId) {
      that.navpath = that.editpath;
    }
  }
};
</script>
<style lang="scss">
.el-input__suffix-inner {
  font-size: 12px;
  color: #909399;
}

.store-info {
  .handle-area {
    position: fixed;
    left: 200px;
    bottom: 0;
    right: 0;
    border-top: #e4e7ed;
    z-index: 2;
  }

  .el-textarea {
    /deep/ .el-textarea__inner {
      font-size: 14px;
      color: #606266;
      background-color: rgba(255, 255, 255, 0.1);
      resize: none;
      font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
    }
  }
}
</style>
