<template>
  <div>
    <div class="common-right-button-box">
      <a :href="'#/storeInfo?firstLevelId=' + firstLevelId">
        <el-button type="primary" v-if="!gicFlag">添加门店</el-button>
      </a>
      <a :href="'#/storeIo?importCode=store&departmentId=' + departmentId + '&showChildMember=' + showChildMember * 1 + '&brandId=' + brandId"><el-button>批量导入/导出</el-button></a>
      <el-button v-if="!gicFlag" type="danger" @click="delStores" :disabled="disabledDel">批量删除</el-button>
      <span class="J_show-children el-button" size="small"> <el-checkbox class="m-r-10" v-model="showChildMember" @change="setChildMemberShow">显示子成员</el-checkbox><a class="a-href"></a> </span>
    </div>
    <el-table ref="table1" :data="tableData" @selection-change="selectMember">
      <el-table-column type="selection" width="42"></el-table-column>
      <el-table-column label="门店" prop="storeName" width="140"></el-table-column>
      <el-table-column label="代码" prop="storeCode" width="140"></el-table-column>
      <el-table-column label="类型" prop="storeType" width="100">
        <template slot-scope="scope">
          {{ typeArr[scope.row.storeType * 1 + 1] }}
        </template>
      </el-table-column>
      <el-table-column label="地区" prop="areaChainName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.areaChainName || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="所属分组" prop="groupChainName" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <a class="a-href m-r-20" :href="'#/storeInfo?gicFlag=' + gicFlag + '&storeId=' + scope.row.storeId + '&firstLevelId=' + firstLevelId">编辑</a>
          <!--  <a class="a-href" @click="delStores(scope.row, true)">删除</a> -->
          <el-popover placement="top" width="160" v-model="scope.row.popVisible" v-if="!gicFlag">
            <p style="line-height: 1.5; padding: 10px 10px 20px;">确认删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="cancelDelTag(scope.$index, scope.row)">取消</el-button>
              <el-button type="primary" size="mini" @click="toDelTag(scope.$index, scope.row)">确定</el-button>
            </div>
            <el-button slot="reference" class="p-l-10" type="text">
              删除
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getRequest } from '@/api/api';
export default {
  name: 'storeView',
  props: {
    tableData: {
      type: Array,
      default() {
        return [];
      }
    },
    departmentId: {
      type: [String, Number],
      default: ''
    },
    brandId: {
      type: [String, Number],
      default: ''
    },
    firstLevelId: {
      type: [String, Number],
      default: ''
    },
    gicFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      tableH: window.screen.availHeight - 440 - 180 - 70,
      selectedList: [],
      showChildMember: false, // 是否显示子成员
      typeArr: ['全部类型', '自营', '联营', '代理(加盟)', '代销', '托管'],
      statusArr: ['待审核', '正常', '审核失败', '停业整顿', '回收站', '删除']
    };
  },
  methods: {
    /**
     * 批量删除店铺
     */
    delStores(store, single = false) {
      let that = this;
      that
        .$confirm('是否删除所选店铺', '提示', {
          type: 'warning'
        })
        .then(() => {
          let ids = '';
          if (single) {
            ids = store.storeId;
          } else {
            let arr = [];
            that.selectedList.forEach(li => {
              arr.push(li.storeId);
            });
            ids = arr.join(',');
          }
          let params = {
            ids
          };
          that.postDel(params);
        });
    },

    /**
     * 删除 --- API
     */
    postDel(params, row) {
      const that = this;
      getRequest('/haoban-manage-web/store/delByIds', params)
        .then(res => {
          if (res.data.errorCode == 1) {
            that.$message.success({
              duration: 1000,
              message: '操作成功'
            });
            if (!!row) {
              row.popVisible = false;
            }
            that.$emit('getStoreList');
          } else {
            that.$message.error({
              duration: 1000,
              message: res.data.message
            });
          }
        })
        .catch(e => {
          that.$message.error({
            duration: 1000,
            message: e.message
          });
        });
    },

    selectMember(selection) {
      this.selectedList = selection;
    },
    // 是否显示子成员
    setChildMemberShow() {
      this.$emit('setChildMemberShow', this.showChildMember);
    },

    /**
     * 删除 -- 取消
     */
    cancelDelTag(index, row) {
      row.popVisible = false;
    },

    /**
     * 删除 -- 确定
     */
    toDelTag(index, row) {
      const that = this;
      let ids = '';
      ids = row.storeId;
      let params = {
        ids
      };
      that.postDel(params, row);
    }
  },
  computed: {
    disabledDel() {
      return this.selectedList.length < 1;
    }
  }
};
</script>
<style lang="scss">
.J_show-children {
  &.el-button {
    vertical-align: top;
    margin-left: 0;
    padding: 0 15px;
    line-height: 29px;
    height: 32px;
    .el-checkbox {
      vertical-align: -1px;
      &.is-checked {
        .el-checkbox__label {
          color: #409eff;
        }
      }
    }
    /deep/ .el-checkbox {
      &.is-checked {
        .el-checkbox__label {
          color: #409eff;
        }
      }
      .el-checkbox__input {
        vertical-align: -2px;
      }
    }
  }
}
</style>
