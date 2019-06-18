<!--
  限制文本框组件
  <limit-textarea
    :inputWidth="500"
    :inputValue.sync="ruleForm.addressDetail"
    :holder="'请输入详细地址'"
    :getByType="'word'"
    :disinput=""
    :maxLength="40">
  </limit-textarea>
 -->
<template>
  <div class="input-line-cell" :style="{ width: inputWidth + 'px' }">
    <el-input :style="{ width: inputWidth + 'px' }" v-model="itemValue" :placeholder="holder" type="textarea" :rows="3" :disabled="disInput" @blur="inputBlur()" @focus="inputFocus()" @keyup.native="value => toInput(value)"> </el-input>
    <span class="tip"
      ><span class="len_span">{{ inputNum }}</span
      >/{{ limitLength }}</span
    >
  </div>
</template>
<script>
import strLength from '@/common/js/strlen';
export default {
  name: 'limittextarea',
  props: {
    inputValue: {
      // 传入 input value
      type: String,
      default: ''
    },

    maxLength: {
      // 限制长度
      type: Number,
      default: 10
    },

    inputWidth: {
      // input 长度
      type: Number,
      default: 500
    },

    getByType: {
      // 字或字符判断类型
      type: String,
      default: 'word' // word: 字, char: 字符
    },

    holder: {
      type: String,
      default: '请输入'
    },

    disInput: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputNum: 0,
      limitLength: 10,
      itemValue: ''
    };
  },
  methods: {
    /* eslint-disable */
    inputFocus(num) {},
    // 输入
    toInput: function(value) {
      const that = this;
      let temp = '';
      if (that.getByType == 'word') {
        temp = strLength.getByteVal(value.target.value, that.limitLength);
        that.itemValue = temp.trim();
        that.inputNum = strLength.getZhLen(that.itemValue);
      } else {
        temp = strLength.getCharVal(value.target.value, that.limitLength);
        that.itemValue = temp.trim();
        that.inputNum = strLength.getByteLen(that.itemValue);
      }
      that.$emit('update:inputValue', that.itemValue);
    },
    inputBlur() {
      const that = this;
      that.$emit('update:inputValue', that.itemValue);
    }
  },
  watch: {
    maxLength: function(newData, oldData) {
      const that = this;
      that.limitLength = newData;
    },
    inputValue: function(newData, oldData) {
      const that = this;
      that.itemValue = newData;
      if (that.getByType == 'word') {
        that.inputNum = strLength.getZhLen(that.itemValue);
      }else {
        that.inputNum = strLength.getByteLen(that.itemValue);
      }
    }
  },
  /* 接收数据 */
  mounted() {
    const that = this;
    that.limitLength = that.maxLength;
    that.itemValue = that.inputValue || '';
    if (that.getByType == 'word') {
      that.inputNum = strLength.getZhLen(that.inputValue);
    }else {
      that.inputNum = strLength.getByteLen(that.inputValue);
    }
  }
};
</script>
<style lang="less" scoped>
.input-line-cell {
  position: relative;
  display: inline-block;
}

.w-340 {
  width: 340px;
  /deep/ .el-input__inner {
    font-size: 14px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
  }
}

.el-textarea {
  /deep/ .el-textarea__inner {
    font-size: 14px;
    color: #606266;
    background-color: rgba(255, 255, 255, 0.1);
    resize: none;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '\5FAE\8F6F\96C5\9ED1', Arial, sans-serif;
  }

  &.is-disabled {
    opacity: 0.5;
  }
}

.el-input {
  .is-disabled {
    /deep/ .el-input__inner {
      font-size: 14px;
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.tip {
  position: absolute;
  bottom: -28px;
  right: 10px;
  display: inline-block;
  line-height: 32px;
  text-align: right;
  font-size: 12px;
  color: #909399;
}
</style>
