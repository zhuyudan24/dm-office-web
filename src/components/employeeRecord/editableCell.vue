<template>
  <div class="editable-cell-container">
    <div class="title-div">
      <span class="font-w-500">{{ title }}</span>
      <div class="hurdle"></div>
      <a class="a-href" @click="showEdit = true">编辑</a>
    </div>
    <el-form class="info-form record-edit-rorm" :rules="rules" inline label-width="150px" ref="cell_form" :model="fieldsInfo">
      <template v-for="(item, idx) in fieldList">
        <el-form-item :label="item.title + '：'" class="item-width" :key="item.fieldCode + '_' + idx" :prop="item.fieldCode">
          <template v-if="showEdit">
            <el-input v-model="fieldsInfo[item.fieldCode]" v-if="item.fieldType == 0" :placeholder="item.fieldDescription" :disabled="item.fieldEdited != '1'"> </el-input>
            <el-input v-model="fieldsInfo[item.fieldCode]" v-if="item.fieldType == 6" :placeholder="item.fieldDescription" :disabled="item.fieldEdited != '1'"> </el-input>
            <el-input v-model="fieldsInfo[item.fieldCode]" v-else-if="item.fieldType == 1" type="textarea" autosize :disabled="item.fieldEdited != '1'"> </el-input>
            <template v-else-if="item.fieldType == 2 || item.fieldType == 3"
              ><!-- 针对员工状态做特殊处理 -->
              <el-select v-if="item.systemFlag == 1" v-model="fieldsInfo[item.fieldCode]" :disabled="item.fieldEdited != '1' || (item.fieldCode == 'clerkStatus' && fieldsInfo[item.fieldCode] == 3)" :multiple="item.fieldType == 3" :collapse-tags="item.fieldType == 3" :placeholder="item.fieldDescription">
                <el-option v-for="cho in item.fieldOperations.fieldContent" :key="cho.key" :label="cho.name" :value="cho.key" :disabled="item.fieldCode == 'clerkStatus' && cho.key == 3"> </el-option>
              </el-select>
              <el-select v-else v-model="fieldsInfo[item.fieldCode]" :disabled="item.fieldEdited != '1'" :multiple="item.fieldType == 3" :collapse-tags="item.fieldType == 3" :placeholder="item.fieldDescription">
                <el-option v-for="(cho, index) in item.fieldOperations.fieldContent" :key="cho.key + '_' + index" :label="cho.name" :value="cho.name"> </el-option>
              </el-select>
            </template>
            <el-date-picker v-else-if="item.fieldType == 4" v-model="fieldsInfo[item.fieldCode]" type="date" :disabled="item.fieldEdited != '1'" :format="item.fieldOperations.typeValue" :value-format="item.fieldOperations.typeValue" :placeholder="item.fieldDescription"> </el-date-picker>
            <el-date-picker v-else-if="item.fieldType == 5" v-model="fieldsInfo[item.fieldCode]" type="daterange" range-separator="至" :disabled="item.fieldEdited != '1'" :format="item.fieldOperations.typeValue" :value-format="item.fieldOperations.typeValue" :start-placeholder="item.fieldOperations.startDescription" :end-placeholder="item.fieldOperations.endDescription"> </el-date-picker>
            <!-- <vue-office-upload-image v-else-if="item.fieldType == 7" projectName="haoban-manage-web" wxFlag="0" :actionUrl="uploadUrl" :imageList="fieldsInfo[item.fieldCode]" :limitW="500" :limitH="500" :maxImageLength="5" @uploadOnSuccess="uploadOnSuccess" @sortImg="sortImg" @deleteImage="deleteImage"> </vue-office-upload-image> -->
            <uploadImage v-else-if="item.fieldType == 7" projectName="haoban-manage-web" wxFlag="0" :actionUrl="uploadUrl" :imageList.sync="fieldsInfo[item.fieldCode]" :maxImageLength="3" @uploadOnSuccess="uploadOnSuccess" @sortImg="sortImg" @deleteImage="deleteImage"></uploadImage>
          </template>
          <template v-else>
            <div v-if="item.fieldType == 0 || item.fieldType == 1 || item.fieldType == 6" class="field-value color-606266">
              {{ fieldsInfo[item.fieldCode] }}
            </div>
            <template v-else-if="item.fieldType == 2">
              <div v-if="item.systemFlag == 1" class="field-value color-606266">
                <!-- 针对 -1 的 key 做判断 -->
                {{ !!item.fieldOperations.fieldContent[fieldsInfo[item.fieldCode] * 1 - 1] ? item.fieldOperations.fieldContent[fieldsInfo[item.fieldCode] * 1 - 1].name : fieldsInfo[item.fieldCode] !== '' && fieldsInfo[item.fieldCode] !== null && item.fieldOperations.fieldContent.length ? item.fieldOperations.fieldContent[item.fieldOperations.fieldContent.length - 1].name : '' }}
              </div>
              <div v-else class="field-value color-606266">{{ fieldsInfo[item.fieldCode] }}</div>
            </template>
            <div v-else-if="item.fieldType == 3" class="field-value color-606266"></div>
            <div v-else-if="item.fieldType == 4" class="field-value color-606266">
              {{ fieldsInfo[item.fieldCode] | formatDate(item.fieldOperations.typeValue) }}
            </div>
            <div v-else-if="item.fieldType == 5" class="field-value color-606266">
              {{ fieldsInfo[item.fieldCode].join('至') }}
            </div>
            <div v-else-if="item.fieldType == 7" class="img-box">
              <div class="item-imgs" v-for="(img, index) in fieldsInfo[item.fieldCode]" :key="index + img.url">
                <a><img :src="img.url"/></a>
              </div>
            </div>
          </template>
        </el-form-item>
      </template>
    </el-form>
    <div class="handle-form-btns t-ct m-b-60" v-if="showEdit">
      <el-button type="primary" @click="saveEdit">保存</el-button>
      <el-button @click="cancelEdit">取消</el-button>
    </div>
  </div>
</template>
<script>
import uploadImage from 'components/employeeRecord/uploadImage';
import { formatDate, deepClone } from '@/utils/index';
import { getRequest } from '@/api/api';
export default {
  name: 'editableCell',
  props: {
    info: {
      type: Object,
      required: true
    },
    staticInfo: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    fieldList: {
      type: Array,
      required: true
    }
  },
  /* eslint-disable */
  components: {
    uploadImage
  },
  filters: {
    formatDate
  },
  data() {
    return {
      showEdit: false,
      uploadUrl: '/haoban-manage-web/upload-img',
      fieldsInfo: {}
    };
  },
  methods: {
    // 图片上传成功回掉，拿区返回的图片URL渲染预览图
    uploadOnSuccess(res, list) {
      res.file.url = res.res.result[0].qcloudImageUrl;
      list.push(res.file);
    },
    // 删除图片 返回图片列表的索引 你可以根据这个索引去找对应图片的id
    deleteImage(i) {
      this.imageList = this.imageList? this.imageList : [];
      this.imageList.splice(i, 1);
    },
    // 排序图片
    sortImg(val) {
      this.imageList = val;
    },
    // 保存编辑
    saveEdit() {
      let that = this;
      that.$refs.cell_form.validate(valid => {
        // 表单验证
        if (valid) {
          let newInfo = deepClone(that.fieldsInfo);
          let params = {};
          let regFlag = [];
          let fieldList = that.fieldList;
          // let defineObj = JSON.parse(that.staticInfo.defineString);
          let objToString = [];
          fieldList.forEach(field => {
            // 将当前单元格的所有自定义字段抽离出来转化成json字符串
            params[field.fieldCode] = newInfo[field.fieldCode];
            // 字段类型0：单行输入框，1：多行输入框，2：单选框 3:多选框 4:日期 5:日期区间 6：数字输入框 7：图片上传
            if (field.fieldType == 5) {
              params[field.fieldCode] = newInfo[field.fieldCode].join(',');
            }
            if (field.fieldType == 7) {
              let arr = [];
              newInfo[field.fieldCode].forEach(img => {
                arr.push(img.url);
              });
              params[field.fieldCode] = arr.join(',');
            }
            if (field.systemFlag != 1) {
              objToString.push({ fieldCode: field.fieldCode, fieldValue: newInfo[field.fieldCode] });
              if (field.fieldType == 5) {
                objToString.push({
                  fieldCode: field.fieldCode,
                  fieldValue: newInfo[field.fieldCode].join(',')
                });
              }
              if (field.fieldType == 7) {
                let arr = [];
                newInfo[field.fieldCode].forEach(img => {
                  arr.push(img.url);
                });
                objToString.push({ fieldCode: field.fieldCode, fieldValue: arr.join(',') });
              }
              delete params[field.fieldCode];
            }
            // 校验规则
            if (!!field.regular && newInfo[field.fieldCode] !== '') {
              regFlag.push(eval(`/${field.regular}/`).test(newInfo[field.fieldCode]));
            }
          });
          if (!!regFlag.length && regFlag.includes(false)) {
            that.$message.error('请输入正确格式的字段值！');
            return false;
          }
          params['jsonString'] = JSON.stringify(objToString) == '[]' ? '' : JSON.stringify(objToString);
          params['recordId'] = that.$route.query.recordId;
          that.submitEdit(params);
        }
      });
    },
    submitEdit(params) {
      let that = this;
      getRequest('/haoban-manage-web/record/save-record-detail', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.showEdit = false;
            that.$emit('subSuccess');
            that.$message({
              message: res.data.message,
              type: 'success'
            });
          } else {
            that.$message.error( res.data.message );
          }
        })
        .catch(e => {
          that.$message.error(e.message);
        });
    },
    cancelEdit() {
      this.showEdit = false;
      this.$refs.cell_form.clearValidate(); // 清楚表单验证
      let nowObj = this.fieldsInfo;
      let oldObj = this.staticInfo;
      for (let key in nowObj) {
        nowObj[key] = oldObj[key];
      }
    }
  },
  computed: {
    defineObj() {
      return JSON.parse(this.clerkInfo.defineString);
    },
    rules() {
      let that = this;
      let obj = {};
      let fields = that.fieldList;
      let onlyNum = (rule, value, callback) => {
        if (value) {
          let reg = /^[0-9]*$/;
          if (!reg.test(value * 1)) {
            return callback(new Error('请输入数字!'));
          } else {
            return callback();
          }
        } else {
          return callback();
        }
      };
      fields.forEach(field => {
        let arr = [];
        if (field.fieldType == 0 || field.fieldType == 1) {
          if (!!field.minCount && field.maxCount) {
            arr.push({
              min: field.minCount,
              message: '至少填写' + field.minCount + '个字符',
              trigger: 'change'
            });
          }
          if (!field.minCount && !!field.maxCount) {
            arr.push({
              max: field.maxCount,
              message: '至多填写' + field.maxCount + '个字符',
              trigger: 'change'
            });
          }
          if (!!field.minCount && !!field.maxCount) {
            arr.push({
              min: field.minCount,
              max: field.maxCount,
              message: '长度在 ' + field.minCount + ' 到 ' + field.maxCount + '个字符',
              trigger: 'change'
            });
          }
        }
        if (field.fieldType == 6 && field.fieldCode != "identifyNo") {
          arr.push({ validator: onlyNum, message: field.fieldName + '必须为数字', trigger: 'change' });
        }
        obj[field.fieldCode] = arr;
      });
      return obj;
    }
  },
  beforeMount() {
    let that = this;
    let middleData = JSON.parse(JSON.stringify(that.info));
    for (let item in middleData) {
      middleData[item] = middleData[item] == null? '': typeof(middleData[item]) === 'object'? middleData[item] : String(middleData[item]);
    }
    that.fieldsInfo = middleData;
  }
};
</script>
<style lang="scss">
.editable-cell-container {
  .title-div {
    width: 100%;
    display: flex;
    height: 16px;
    margin-bottom: 45px;

    .hurdle {
      flex: 1;
      height: 0;
      border-top: 1px solid #e4e7ed;
      margin: 8px 10px 0;
    }

    .a-href {
      font-size: 14px;
      margin-top: 1px;
    }
  }

  .info-form {
    margin-bottom: 50px;

    .item-width {
      width: 49%;

      .el-input,
      .el-textarea {
        width: 350px;
      }

      .img-box {
        display: flex;
        width: 360px;
        flex-wrap: wrap;

        .item-imgs {
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
          margin-bottom: 8px;
          width: 104px;
          height: 104px;
          box-sizing: border-box;
          border: 1px solid #dcdfe6;
          border-radius: 4px;
          cursor: pointer;

          a {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 8px;
            height: 86px;
            width: 86px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            border-radius: 0;

            img {
              position: static;
              display: block;
              max-width: 86px;
              max-height: 86px;
            }
          }
        }
      }
    }
  }
}
</style>
