<template>
  <div class="notice-list-wrap">
    <div class="notice-list">
      <common-detail-top :topMenuData="topMenuData" :activeId="activeId"></common-detail-top>
      <div class="notice-list-table">
        <div class="search-wrap">
          <el-input @keyup.enter.native="searchNotice" clearable class="search-input" placeholder="请输入公告标题" prefix-icon="el-icon-search" v-model="searchTitle" @clear="clearInput"> </el-input>
          <el-date-picker @change="changeDate" class="search-date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="dateValue" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
          <el-button @click="addNotice" class="fr" type="primary">新建公告</el-button>
        </div>
        <el-table :data="tableData" style="width: 100%" v-loading="loading">
          <el-table-column prop="title" label="公告标题" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="name" label="公告封面">
            <template slot-scope="scope">
              <div class="notice-img">
                <img :src="scope.row.imgUrl ? scope.row.imgUrl : defaultImg" alt="" @mouseover="showImage(scope.row.imgUrl)" />
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="content" label="公告内容" show-overflow-tooltip>
            <template slot-scope="scope">
              <p class="notice-content-wrap" :title="scope.row.content">{{ scope.row.content }}</p>
            </template>
          </el-table-column> -->
          <el-table-column prop="address" label="读取情况">
            <template slot-scope="scope">
              <el-button @click="readDetail(scope.row.announcementId)" type="text">{{ scope.row.readCount }}/{{ scope.row.noReadCount }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="发布时间">
            <template slot-scope="scope">
              <div v-if="scope.row.sendTime" class="time-wrap">
                <p>{{ scope.row.sendTime | formatTimeYMD }}</p>
                <p>{{ scope.row.sendTime | formatTimeHMS }}</p>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column prop="opr" label="操作">
            <template slot-scope="scope">
              <el-button @click="handlePreview(scope.row.announcementId)" type="text">预览</el-button>
              <el-button @click="delNotice(scope.row.announcementId, scope.$index)" type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="totalCount > 0">
          <el-pagination background :page-sizes="[20, 40, 60, 80]" :page-size="pageSize" :current-page="currentPage" layout="total, sizes, prev, pager, next" :total="totalCount" @size-change="handleSizeChange" @current-change="handleCurrentChange"> </el-pagination>
        </div>
      </div>
    </div>
    <!-- 企业公告读取情况 -->
    <el-dialog title="读取情况" :visible.sync="dialogNoticeVisible" width="618px">
      <div class="read-list-wrap">
        <div class="read-list-lt">
          <div class="read-list-title">已读（{{ readCount }}）</div>
          <ul v-if="!!readList.length" class="read-list">
            <li v-for="(item, index) in readList" :key="index">{{ item }}</li>
          </ul>
          <div v-else class="no-read-list-data">暂无数据</div>
          <div class="load-data load-read-data" @click="loadMore(1)">{{ readCount == readList.length ? '已加载全部已读人员' : '点击加载更多' }}</div>
        </div>
        <div class="read-list-rt">
          <div class="read-list-title">未读（{{ noReadCount }}）</div>
          <ul v-if="!!noReadList.length" class="read-list">
            <li v-for="(item, index) in noReadList" :key="index">{{ item }}</li>
          </ul>
          <div v-else class="no-read-list-data">暂无数据</div>
          <div class="load-data load-unread-data" @click="loadMore(0)">{{ noReadCount == noReadList.length ? '已加载全部未读人员' : '点击加载更多' }}</div>
        </div>
      </div>
    </el-dialog>
    <!-- 预览 -->
    <qrcode-dialog ref="qrcodePreview" v-model="dialogVisible"></qrcode-dialog>
    <vue-gic-img-preview :imgUrl="imgUrl" :imgShowFlag="imgShowFlag" @hideImage="hideImage"></vue-gic-img-preview>
  </div>
</template>
<script>
import commonDetailTop from '@/components/app/common-detail-top.vue';
import qrcodeDialog from '@/components/app/qrcode-dialog.vue';
import { getRequest } from '@/api/api';
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
          name: '企业公告列表'
        }
      ],
      activeId: '1',
      activeBrand: this.brandId, // 商户(品牌) id
      activeGroup: this.activeGroupId, // 商户(品牌) groupId
      searchTitle: '',
      dateValue: '',
      startTime: '',
      endTime: '',
      tableData: [],
      pageSize: 20,
      currentPage: 1,
      totalCount: 0,
      noReadCount: 0, // 未读人数
      readCount: 0, // 已读人数
      readList: [], //  已读人
      noReadList: [], // 未读人
      loading: false,
      dialogNoticeVisible: false,
      dialogVisible: false,
      // eslint-disable-next-line
      defaultImg: require('../../../../static/img/head_default.jpg'),
      // 预览
      imgUrl: '',
      imgShowFlag: false,

      // 读取分页参数
      readId: '',
      readPageSize: 20,
      readPageNum: 1,
      unreadPageSize: 20,
      unreadPageNum: 1
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
        that.getNoticeList();
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
    this.activeBrand = this.brandId;
    if (!!this.brandId) {
      this.getNoticeList();
    }
  },
  methods: {
    // 预览
    showImage(src) {
      let that = this;
      if (!src || src == '') {
        return false;
      }
      that.imgShowFlag = true;
      that.imgUrl = src;
    },
    hideImage(val) {
      let that = this;
      that.imgShowFlag = val;
    },
    // 获取公告列表
    getNoticeList() {
      this.loading = true;
      let para = {
        startTime: this.startTime,
        brandId: this.activeBrand,
        title: this.searchTitle,
        endTime: this.endTime,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      getRequest('/haoban-app-announcement-web/announcement-list', para).then(res => {
        let data = res.data;
        this.loading = false;
        if (data.errorCode == 1) {
          this.tableData = data.result.list;
          this.totalCount = data.result.total;
        }
      });
    },
    // 选择日期
    changeDate(val) {
      if (!val) {
        val = [];
      }
      this.startTime = val[0];
      this.endTime = val[1];
      this.currentPage = 1;
      this.getNoticeList();
    },
    // 搜索
    searchNotice() {
      this.currentPage = 1;
      this.getNoticeList();
    },
    // 搜索清除
    clearInput() {
      this.currentPage = 1;
      this.getNoticeList();
    },
    // 删除公告
    delNotice(id, index) {
      this.$confirm('是否要删除选中的公告?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let para = {
            announcementId: id
          };
          getRequest('/haoban-app-announcement-web/announcement-delete', para).then(res => {
            let data = res.data;
            if (data.errorCode == 1) {
              this.totalCount--;
              this.tableData.splice(index, 1);
              if (this.tableData.length == 0) {
                if (this.currentPage > 1) {
                  this.currentPage--;
                  this.getNoticeList();
                } else {
                  if (this.totalCount > 0) {
                    this.getNoticeList();
                  }
                }
              }
              this.$message.success('删除成功');
            } else {
              this.$message.error(data.message);
            }
          });
        })
        .catch(() => {});
    },
    // 加载更多读取人数
    loadMore(readStatus) {
      let that = this;
      if (readStatus == 1) {
        if (that.readList.length >= that.readCount) {
          return false;
        }
        that.readPageNum++;
        that.getDetailApi(that.readId, {
          pageSize: that.readPageSize,
          pageNum: that.readPageNum,
          readStatus: 1 // 0 未读; 1 已读
        });
      } else {
        if (that.noReadList.length >= that.noReadCount) {
          return false;
        }
        that.unreadPageNum++;
        that.getDetailApi(that.readId, {
          pageSize: that.unreadPageSize,
          pageNum: that.unreadPageNum,
          readStatus: 0 // 0 未读; 1 已读
        });
      }
    },
    // 读取详情
    readDetail(id) {
      let that = this;
      that.readList = [];
      that.noReadList = [];
      that.readPageNum = 1;
      that.unreadPageNum = 1;
      that.readId = id;
      that.dialogNoticeVisible = true;
      // 获取已读取人数和未读人数
      Promise.all([
        that.getDetailApi(id, {
          pageSize: that.readPageSize,
          pageNum: that.readPageNum,
          readStatus: 1 // 0 未读; 1 已读
        })
      ]).then(function() {
        that.getDetailApi(id, {
          pageSize: that.unreadPageSize,
          pageNum: that.unreadPageNum,
          readStatus: 0 // 0 未读; 1 已读
        });
      });
    },
    getDetailApi(id, data) {
      let that = this;
      let para = {
        announcementId: id,
        pageSize: data.pageSize,
        pageNum: data.pageNum,
        readStatus: data.readStatus
      };
      getRequest('/haoban-app-announcement-web/announcement-detail', para).then(res => {
        let data = res.data;
        if (data.errorCode == 1) {
          if (para.readStatus == 1) {
            if (!!data.result.list && !!data.result.list.length) {
              data.result.list.forEach(ele => {
                that.readList.push(ele);
              });
            }
            that.readCount = data.result.total;
          } else {
            if (!!data.result.list && !!data.result.list.length) {
              data.result.list.forEach(ele => {
                that.noReadList.push(ele);
              });
            }
            that.noReadCount = data.result.total;
          }
        } else {
          that.$message.error(data.message);
        }
      });
    },
    // 分页
    handleSizeChange(val) {
      this.pageSize = val;
      this.getNoticeList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getNoticeList();
    },
    // 预览
    handlePreview(id) {
      this.$refs.qrcodePreview.qrcode(id, 'announcement');
      this.dialogVisible = true;
    },
    // 新建公告
    addNotice() {
      this.$router.push(`/addNotice?appIcon=${this.$route.query.appIcon}`);
    }
  },
  components: {
    commonDetailTop,
    qrcodeDialog
  },
  beforeDestroy() {
    let that = this;
    that.readList = [];
    that.noReadList = [];
    that.readPageNum = 1;
    that.unreadPageNum = 1;
  }
};
</script>
<style type="text/scss" lang="scss" scoped>
.notice-list-wrap {
  height: 100%;
  .notice-list {
    background: #fff;
    margin-bottom: 34px;
    min-height: 100%;
    // min-height: calc(100% + 24px);
  }
}
.notice-list-table {
  padding: 9px 24px 24px;
  background-color: #fff;
}
.notice-img {
  width: 40px;
  height: 40px;
  img {
    width: 100%;
    height: 100%;
    max-width: 40px;
    max-height: 40px;
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
.read-list-wrap {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  .read-list {
    position: relative;
    padding: 15px 0 15px 10px;
    height: 346px;
    overflow: auto;
    li {
      height: 32px;
      line-height: 32px;
      color: #909399;
      padding: 0 15px;
      border-radius: 4px;
      margin-right: 10px;
      margin-bottom: 10px;
      box-sizing: border-box;
      float: left;
    }
  }
  .read-list-title {
    height: 32px;
    line-height: 32px;
    background: #ebeef5;
    text-align: center;
    color: #303133;
  }
  .load-data {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    line-height: 24px;
    text-align: center;
    font-size: 14px;
    color: #606266;
    background: #f3f6f9;
    cursor: pointer;
  }
  .read-list-lt {
    position: relative;
    flex: 0 0 283px;
    width: 283px;
    border: 1px solid #e4e7ed;
    border-top: none;
    li {
      background: #f3f6f9;
    }
  }
  .read-list-rt {
    position: relative;
    flex: 1;
    border-bottom: 1px solid #e4e7ed;
    border-right: 1px solid #e4e7ed;
    li {
      border: 1px solid #e4e7ed;
      color: #303133;
    }
  }
}
.time-wrap p {
  line-height: 14px;
}
.notice-content-wrap {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.no-read-list-data {
  text-align: center;
  height: 346px;
  line-height: 346px;
}
</style>
