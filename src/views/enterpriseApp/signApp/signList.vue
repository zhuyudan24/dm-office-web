<template>
  <div class="notice-list-wrap">
    <div class="notice-list">
      <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
      <div class="notice-list-table">
        <div class="search-wrap">
          <el-input @keyup.native="value => searchPeople(value)" clearable class="search-input" placeholder="请输入姓名/员工代码" prefix-icon="el-icon-search" v-model="conditionObj.keyword" @clear="clearInput"> </el-input>
          <div class="flex-column item-cell-select inline-block m-l-10">
            <div class="depart-item-wrap">
              <div style="width:213px" class="el-select el-select--large depart-item-content" @click="showDialogLayer('store', conditionObj.storeGroup)">
                <span class="font-14 color-c0c4cc" v-if="!conditionObj.storeGroup.length">请选择门店分组</span>
                <div class="el-select__tags" style="max-width: 181px;">
                  <span>
                    <template v-for="(item, index) in conditionObj.storeGroup">
                      <span class="el-tag el-tag--info el-tag--small" :key="index">
                        <span class="el-select__tags-text">{{ item.name || item.storeName }}</span
                        ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index, conditionObj.storeGroup)"></i>
                      </span>
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <el-select v-model="conditionObj.signStatus" placeholder="请选择" class="w-112 m-l-10" @change="changeSelect"> <el-option v-for="item in signStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option> </el-select>
          <el-date-picker @change="changeDate" class="search-date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :editable="false" v-model="conditionObj.choiceDate" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          <el-button @click="exportData" class="fr" type="primary"><i class="iconfont icon-icon_yunxiazai p-r-6"></i>导出</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="storeName" label="门店名称" show-overflow-tooltip> </el-table-column>
          <el-table-column label="姓名" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.clerkName }}
            </template>
          </el-table-column>
          <el-table-column label="员工代码" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.clerkCode }}
            </template>
          </el-table-column>
          <el-table-column label="状态" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.signType == 1 ? '签退' : '签到' }}
            </template>
          </el-table-column>
          <el-table-column label="时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.signDay" class="time-wrap">
                <p :class="[scope.row.week == '星期六' || scope.row.week == '星期天' ? 'color-f56c6c' : '']">{{ scope.row.signDay | formatTimeYMD }} {{ scope.row.week }}</p>
                <p>{{ scope.row.signTime | formatTimeHMS }}</p>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="打卡坐标" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.signLongitude || '-' }} <span v-if="!!scope.row.signLatitude">,</span> {{ scope.row.signLatitude || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="门店坐标" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.storeLongitude || '-' }} <span v-if="!!scope.row.storeLatitude">,</span> {{ scope.row.storeLatitude || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="距离" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.distance || '--' }}
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="!!totalCount">
          <el-pagination background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="currentPage" layout="total, sizes, prev, pager, next" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
        </div>
      </div>
    </div>
    <vue-select-store ref="storeSelector" :currentBrand="activeGroup" :appScene="appScene" :treeSet="storeTreeSet" :selectType="'group-store'" :defaultList="defaultStoreList" @handleSelectedList="handleSelectedList"> </vue-select-store>
  </div>
</template>
<script>
import commonDetailTop from '@/components/app/common-detail-top.vue';
import vueSelectStore from 'components/common/vueSelectStore';
import { getRequest, postExcel } from '@/api/api';
import { _debounce } from '@/common/js/public';
import errMsg from '@/common/js/error';
export default {
  name: 'noticeList',
  props: {
    brandId: {
      type: String,
      default() {
        return '';
      }
    },
    activeGroupId: {
      type: String,
      default() {
        return '';
      }
    }
  },
  data() {
    return {
      topMenuData: [
        {
          id: '1',
          name: '签到记录'
        }
      ],
      activeId: '1',
      activeBrand: this.brandId, // 商户(品牌) id
      activeGroup: this.activeGroupId, // 商户(品牌) groupId
      conditionObj: {
        keyword: '',
        storeGroup: [],
        signStatus: '',
        choiceDate: []
      },
      signStatusOptions: [
        {
          value: '',
          label: '所有状态'
        },
        {
          value: '0',
          label: '签到'
        },
        {
          value: '1',
          label: '签退'
        }
      ],
      choiceDateCopy: [],
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.choiceDateCopy = [minDate.getTime()];
          if (maxDate) {
            this.choiceDateCopy = [];
          }
        },
        disabledDate: time => {
          if (this.choiceDateCopy.length) {
            const one = 30 * 24 * 3600 * 1000;
            const minTime = this.choiceDateCopy[0] - one;
            const maxTime = this.choiceDateCopy[0] + one;
            return time.getTime() < minTime || time.getTime() > maxTime || time.getTime() > Date.now() - 8.64e6;
          }
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      tableData: [],
      pageSize: 20,
      currentPage: 1,
      totalCount: 0,
      // 门店选择
      appScene: 2,
      defaultStoreList: [],
      storeTreeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      }
    };
  },
  filters: {
    formatTimeYMD(data) {
      let date = new Date(data);
      let month = date.getMonth() + 1;
      let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
      let newMonth = month < 10 ? '0' + month : month;
      return date.getFullYear() + '-' + newMonth + '-' + day;
    },
    formatTimeHMS(data) {
      let date = new Date(data);
      let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
      let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
      return hours + ':' + minutes;
    }
  },
  watch: {
    brandId: function(newData, oldData) {
      let that = this;
      if (!!newData) {
        that.activeBrand = newData;
        that.getTableList();
      }
    },
    activeGroupId: function(newData, oldData) {
      let that = this;
      if (!!newData) {
        that.activeGroup = newData;
      }
    }
  },
  mounted() {
    let that = this;
    that.activeBrand = this.brandId;
    let date = new Date();
    let nowTime = date.getTime() - 30 * 24 * 3600 * 1000;
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    let newMonth = month < 10 ? '0' + month : month;

    let startDate = new Date(nowTime);
    let startYear = startDate.getFullYear();
    let startMonth = startDate.getMonth() + 1;
    let startDay = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate();
    let startNewMonth = startMonth < 10 ? '0' + startMonth : startMonth;
    that.conditionObj.choiceDate = [`${startYear}-${startNewMonth}-${startDay}`, `${year}-${newMonth}-${day}`];
    if (!!that.brandId) {
      that.$nextTick(ele => {
        that.getTableList();
      });
    }
  },
  methods: {
    /**
     * 弹窗显示事件
     */
    showDialogLayer(type, selData) {
      const that = this;
      that.selectType = type;
      that.changed = type;
      that.defaultStoreList = selData;
      that.storeTreeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: false
      };
    },

    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      let that = this;
      // type:	1:员工,2:部门,3:门店;
      that.conditionObj.storeGroup = group;
      that.getTableList();
    },

    /**
     * 删除选的部门
     */
    delDepart(index, item) {
      let that = this;
      item.splice(index, 1);
      that.currentPage = 1;
      that.getTableList();
    },

    /**
     *  获取列表
     *
     */
    getTableList() {
      let that = this;
      that.loading = true;
      let storeGroups = [];
      let filterStoreIds = [];
      let weekData = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      that.conditionObj.storeGroup.forEach(ele => {
        if (ele.type == 2) {
          storeGroups.push(ele.groupId);
        }
        if (ele.type == 3) {
          filterStoreIds.push(ele.storeId);
        }
      });
      let para = {
        haobanEnterpriseId: !!localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).enterpriseId : '',
        search: that.conditionObj.keyword || '',
        haobanBrandId: that.activeBrand,
        storeIds: filterStoreIds.join(',') || '', // 门店分组, 门店,
        groupIds: storeGroups.join(',') || '', // 门店分组,分组,
        signType: that.conditionObj.signStatus || '',
        startDate: !!that.conditionObj && !!that.conditionObj.choiceDate[0] ? that.conditionObj.choiceDate[0] : '',
        endDate: !!that.conditionObj && !!that.conditionObj.choiceDate[1] ? that.conditionObj.choiceDate[1] : '',
        pageNum: that.currentPage,
        pageSize: that.pageSize
      };
      getRequest('/haoban-app-sign-web/sign/sign-list', para)
        .then(res => {
          let resData = res.data;
          that.loading = false;
          if (resData.errorCode == 1) {
            resData.result.list.forEach(ele => {
              ele.week = weekData[new Date(ele.signDay).getDay()];
            });
            that.tableData = resData.result.list || [];

            that.totalCount = resData.result.pageInfo.total;
            return false;
          }
          errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.loading = false;
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    },

    // 选择日期
    changeDate(val) {
      let that = this;
      if (!val) {
        that.choiceDateCopy = [];
        that.conditionObj.choiceDate = [];
      }
      that.currentPage = 1;
      that.getTableList();
    },
    // 搜索
    searchPeople: _debounce(function(value) {
      let that = this;
      that.currentPage == 1;
      that.getTableList();
    }, 500),

    // 搜索清除
    clearInput() {
      this.currentPage = 1;
      this.getTableList();
    },

    // 选择状态
    changeSelect() {
      let that = this;
      that.currentPage = 1;
      that.getTableList();
    },

    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getTableList();
    },

    /**
     *  导出
     *
     */
    exportData() {
      let that = this;
      if (!that.conditionObj.choiceDate || !that.conditionObj.choiceDate[0] || !that.conditionObj.choiceDate[1]) {
        that.$message.error({
          duration: 1000,
          message: '请选择日期区间'
        });
        return false;
      }
      that.postExportData();
    },
    postExportData() {
      let that = this;
      let storeGroups = [];
      let filterStoreIds = [];
      that.conditionObj.storeGroup.forEach(ele => {
        if (ele.type == 2) {
          storeGroups.push(ele.groupId);
        }
        if (ele.type == 3) {
          filterStoreIds.push(ele.storeId);
        }
      });
      let para = {
        haobanEnterpriseId: !!localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).enterpriseId : '',
        search: that.conditionObj.keyword || '', // 搜索字段
        storeIds: filterStoreIds.join(',') || '', // 门店分组, 门店,
        groupIds: storeGroups.join(',') || '', // 门店分组,分组,
        signType: that.conditionObj.signStatus || '', //门店类型
        startDate: !!that.conditionObj.choiceDate[0] ? that.conditionObj.choiceDate[0] : '',
        endDate: !!that.conditionObj.choiceDate[1] ? that.conditionObj.choiceDate[1] : '',
        haobanBrandId: that.activeBrand // 品牌 id
      };
      /* let urlSource = `search=${para.search}&storeIds=${para.storeIds}&groupIds=${para.groupIds}&signType=${para.signType}&startDate=${para.startDate}&endDate=${para.endDate}&haobanEnterpriseId=${para.haobanEnterpriseId}&haobanBrandId=${para.haobanBrandId}`;
      window.open(`${window.location.origin}/haoban-app-sign-web/sign/export-sign-list?${urlSource}`); */
      postExcel('/haoban-app-sign-web/sign/export-sign-list', para)
        .then(res => {
          if (!res.data) {
            errMsg.errorMsg('暂无数据');
            return false;
          }
          // let resData = res.data;
          const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
          const fileName = `${para.startDate.replace(/-/g, '')}-${para.endDate.replace(/-/g, '')}签到报表.xlsx`;
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
          // errMsg.errorMsg(resData);
        })
        .catch(function(error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          });
        });
    }
  },
  components: {
    vueSelectStore,
    commonDetailTop
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.notice-list-wrap {
  height: 100%;
  .notice-list {
    background: #fff;
    margin-bottom: 34px;
    // min-height: 100%;
    // min-height: calc(100% + 24px);
  }
}

.p-r-6 {
  padding-right: 6px;
}

.w-112 {
  width: 112px;
}

.color-c0c4cc {
  display: inline-block;
  line-height: 34px;
  padding-left: 10px;
  color: #c0c4cc;
}

.notice-list-table {
  padding: 22px 24px 24px;
  background-color: #fff;
}

.depart-item-content {
  width: 213px;
  height: 32px;
  overflow: hidden;
  white-space: nowrap;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  cursor: pointer;
}

.item-cell-select {
  /deep/ .el-select__tags {
    white-space: nowrap;
    overflow: hidden;
  }
}

.search-wrap {
  font-size: 0;
  margin-bottom: 22px;
  .search-input {
    width: 264px;
  }
  .search-date {
    width: 300px;
    margin-left: 10px;
  }
}
.pagination {
  margin-top: 24px;
  text-align: right;
}
</style>
