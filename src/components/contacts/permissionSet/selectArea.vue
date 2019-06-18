<template>
  <div class="select-area">
    <div class="setting-name">
      个别员工不设置该权限
    </div>
    <ul class="particular-list">
      <template v-for="(li, index) in butList">
        <li class="item person-item" v-if="li.employeeClerkId" :key="index + '_' + li.employeeClerkId">
          <img :src="li.headPic" v-if="!!li.headPic" />
          <div class="replace-head-img" v-else>
            <i class="iconfont icon-yewuduanmorentouxian"></i>
          </div>
          <p class="name">{{ li.label }}</p>
          <i class="el-icon-circle-close" @click="delCurrent(li, 'butList')"></i>
        </li>
        <li class="item group-item" v-else :key="index + '_' + li.groupId">
          {{ li.label }}
          <i class="el-icon-circle-close" @click="delCurrent(li, 'butList')"></i>
        </li>
      </template>
      <li class="item J_add-btn" @click="callSelector('but', butList)"><i class="el-icon-plus"></i></li>
    </ul>
    <div class="setting-name">
      允许指定部门/人员可见
    </div>
    <ul class="particular-list">
      <template v-for="(li, index) in specialList">
        <li class="item person-item" v-if="li.employeeClerkId" :key="index + '_' + li.employeeClerkId">
          <img :src="li.headPic" v-if="!!li.headPic" />
          <div class="replace-head-img" v-else>
            <i class="iconfont icon-yewuduanmorentouxian"></i>
          </div>
          <p class="name">{{ li.label }}</p>
          <i class="el-icon-circle-close" @click="delCurrent(li, 'specialList')"></i>
        </li>
        <li class="item group-item" v-else :key="index + '_' + li.groupId">
          {{ li.label }}
          <i class="el-icon-circle-close" @click="delCurrent(li, 'specialList')"></i>
        </li>
      </template>
      <li class="item J_add-btn" @click="callSelector('special', specialList)">
        <i class="el-icon-plus"></i>
      </li>
    </ul>
  </div>
</template>
<script>
import vueSelectEmployee from 'components/common/vueSelectEmployee';
export default {
  name: 'select-area',
  components: {
    vueSelectEmployee
  },
  props: {
    treeData: {
      type: Object,
      default() {
        return {};
      }
    },
    butList: {
      type: Array,
      default() {
        return [];
      }
    },
    specialList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      copyTreeData: JSON.parse(JSON.stringify(this.treeData))
    };
  },
  methods: {
    /**
     * 删除选中的人
     */
    delCurrent(person, listName) {
      let that = this;
      let list = that[listName];
      list.splice(list.indexOf(person), 1);
    },
    /**
     * 处理树形控件选择的数据
     */
    handleSelectedList(list) {
      this.butList = list;
    },
    /**
     * 唤起选人插件
     */
    callSelector(type, list) {
      this.$emit('callPerSelector', type, list);
    }
  }
};
</script>
<style lang="scss">
.select-area {
  .setting-name {
    .a-href {
      font-size: 12px;
      margin-left: 10px;
    }
  }

  /deep/ .icon-yewuduanmorentouxian {
    font-size: 20px;
  }

  .particular-list {
    .replace-head-img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      background: rgba(64, 158, 255, 1);
    }
  }

  // .particular-list {
  //     display: flex;
  //     flex-wrap: wrap;
  //     margin-bottom: 30px;
  //     .item {
  //         position: relative;
  //         margin-right: 24px;
  //         margin-top: 30px;
  //         width:40px;
  //         .el-icon-circle-close {
  //             position: absolute;
  //             font-size: 16px;
  //             color: #808995;
  //             right: -8px;
  //             top: -8px;
  //             cursor: pointer;
  //         }
  //         img {
  //             width: 100%;
  //             border-radius:4px;
  //         }
  //         .name {
  //             font-size: 12px;
  //             text-align: center;
  //             margin-top: 20px;
  //         }
  //         &.group-item {
  //             padding: 0 10px;
  //             width: auto;
  //             height:30px;
  //             line-height: 32px;
  //             background:rgba(236,245,255,1);
  //             border:1px solid rgba(217,236,255,1);
  //             border-radius:4px;
  //             font-size:12px;
  //             color:rgba(64,158,255,1);
  //             margin-top: 34px;
  //         }
  //         &.J_add-btn {
  //             height:40px;
  //             background:rgba(251,253,255,1);
  //             border:1px dashed rgba(192,204,218,1);
  //             border-radius:50%;
  //             text-align: center;
  //             line-height: 40px;
  //             font-size: 16px;
  //             box-sizing: border-box;
  //             cursor: pointer;
  //         }
  //     }
  // }
}
</style>
