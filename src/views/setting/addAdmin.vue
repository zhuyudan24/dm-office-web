<template>
  <div class="companyAddress-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ height: $store.state.bgHeight }">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="管理员角色" prop="roleName" class="">
            <el-input v-model="ruleForm.roleName" disabled placeholder="" class="w-380"></el-input>
          </el-form-item>
          <el-form-item :label="ruleForm.userId ? '' : '选择人员'" prop="name" class="">
            <div class="flex w-380 flex-wrap">
              <template v-for="(item, index) in ruleForm.peopleList">
                <div class="people-cell flex flex-align-center flex-pack-center flex-column" :key="index + item.name">
                  <div :class="['inline-block', 'img-wrap', 'flex', 'flex-align-center', 'flex-pack-center', !item.headPic ? 'img-wrap-bg' : '']">
                    <img v-if="item.headPic" :src="item.headPic" alt="headPic" />
                    <i v-else class="iconfont icon-yewuduanmorentouxian"></i>
                    <i class="el-icon-circle-close" v-if="!ruleForm.userId" @click.stop="delField(index, item, ruleForm.peopleList)"></i>
                  </div>
                  <p>{{ item.name }}</p>
                </div>
              </template>
              <div class="people-cell" v-if="!ruleForm.userId">
                <span class="add-icon" @click.stop="showDialogLayer('people', ruleForm.peopleList)"><i class="el-icon-plus"></i></span>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="选择管理范围" prop="name" class="m-b-0"> </el-form-item>
          <el-form-item label="行政架构" prop="name" class="m-b-0 m-t-10">
            <div class="flex w-380 flex-column item-cell-select">
              <div class="depart-item-wrap">
                <div class="el-select el-select--large depart-item-content" @click="showDialogLayer('depart', ruleForm.departList)">
                  <div class="el-select__tags" style="max-width: 181px;">
                    <span>
                      <template v-for="(item, index) in ruleForm.departList">
                        <span class="el-tag el-tag--info el-tag--small" :key="index">
                          <span class="el-select__tags-text">{{ item.name }}</span
                          ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index, ruleForm.departList)"></i>
                        </span>
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="门店架构" prop="name" class="m-t-22">
            <div class="flex w-380 flex-column item-cell-select">
              <div class="store-item-wrap" v-if="ruleForm.roleCode == 'admin'">
                <el-select v-model="ruleForm.brandValue" multiple placeholder="请选择" style="width:213px">
                  <el-option v-for="item in ruleForm.brandOptions" :key="item.groupId" :label="item.name" :value="item.groupId"> </el-option>
                </el-select>
              </div>
              <!-- 子管理员添加门店 -->
              <div class="depart-item-wrap" v-if="ruleForm.roleCode == 'child_admin'">
                <div style="width:213px" class="el-select el-select--large depart-item-content" @click="showDialogLayer('store', ruleForm.brandValue)">
                  <div class="el-select__tags" style="max-width: 181px;">
                    <span>
                      <template v-for="(item, index) in ruleForm.brandValue">
                        <span class="el-tag el-tag--info el-tag--small" :key="index">
                          <span class="el-select__tags-text">{{ item.name || item.storeName }}</span
                          ><i class="el-tag__close el-icon-close" @click.stop="delDepart(index, ruleForm.brandValue)"></i>
                        </span>
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item class="m-t-24">
            <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
    <vue-select-employee :defaultSelection="defaultSelection" :onlyPerson="onlyPerson" :treeSet="treeSet" :changed="changed" @handleSelectedList="handleSelectedList"> </vue-select-employee>
    <vue-select-store ref="storeSelector" :treeSet="storeTreeSet" :selectType="'group-store'" :defaultList="defaultStoreList" @handleSelectedList="handleSelectedList"> </vue-select-store>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import vueSelectEmployee from '@/components/common/vueSelectEmployee.vue';
import vueSelectStore from 'components/common/vueSelectStore';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: 'addAdminRole',
  data() {
    return {
      // 面包屑参数
      navpath: [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '设置',
          path: '/companyAddress'
        },
        {
          name: '设置子管理员',
          path: '/setChildAdmin'
        },
        {
          name: '添加成员',
          path: ''
        }
      ],
      ruleForm: {
        brandId: '',
        roleId: '',
        roleCode: 'admin',
        roleName: '企业管理员',
        peopleList: [
          // {
          //   id: '1',
          //   name: '张三',
          //   headPic: 'http://thirdwx.qlogo.cn/mmopen/j7nX4OeBsXRNyvh6micCywssVEYCaWiaicUZq5Vn2zWktWLAyRvEAH7icQmUhLze8rrQYpM5ptwZ2RL7cX0icyBbiavhYFNTIZhibKu/0'
          // }
        ],
        departList: [
          // {
          //   id: '1',
          //   name: '张三张三',
          // },
        ],
        brandValue: [],
        brandOptions: [
          // {
          //   name: 'A品牌',
          //   brandId: '1',
          // }
        ]
      },
      rules: {},
      treeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      },
      treeData: {},
      defaultSelection: [],
      changed: '',
      onlyPerson: false, // 控制只能选人(true)
      selectType: '',

      defaultStoreList: [],
      storeTreeSet: {
        isSelectPerson: false, // 控制只能选部门(false)
        dialogVisible: false, // 控制显示/隐藏
        isSingle: false // 是否单选
      }
    };
  },
  computed: {},
  methods: {
    /**
     * 路由跳转
     */
    changeRoute(route) {
      this.$router.push(route);
    },

    /**
     * 保存
     */
    submitForm: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          let data = [];
          let flag = that.ruleForm.peopleList.length; // && that.ruleForm.brandValue.length; // that.ruleForm.departList.length &&
          if (!flag) {
            that.$message.error({
              message: '请完善信息'
            });
            return;
          }
          flag = null;
          that.ruleForm.departList.forEach(function(item) {
            data.push({ groupId: item.groupId });
          });
          that.ruleForm.brandValue.forEach(function(item) {
            // 品牌只有 brandId 无 storeId  , 如：['57b303dff06c4e758e26951f5e9c5e97']
            // 如果是企业管理员
            if (that.ruleForm.roleCode === 'admin') {
              data.push({ groupId: item });
            } else {
              // 如果是子管理员
              item.storeId ? data.push({ storeId: item.storeId }) : data.push({ groupId: item.groupId });
            }
          });
          let clerks = that.ruleForm.peopleList.map(item => item.employeeClerkId).join(',');
          that.postSave(data, clerks);
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 保存---api
     */
    postSave(data, clerks) {
      const that = this;
      let para = {
        data: JSON.stringify(data),
        roleId: that.ruleForm.roleId,
        brandId: that.ruleForm.brandId,
        clerkIds: clerks
      };
      postRequest('/haoban-manage-web/save-clerk-role', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('添加成功', 'success');
            that.changeRoute('/setChildAdmin');
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
    },

    /**
     * 删除字段
     */
    delField(index, item, list) {
      const that = this;
      that
        .$alert('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(({ value }) => {
          list.splice(index, 1);
        })
        .catch(() => {});
    },

    /**
     * 删除选的部门
     */
    delDepart(index, item) {
      item.splice(index, 1);
    },

    /**
     * 弹窗显示事件
     */
    showDialogLayer(type, selData) {
      const that = this;
      that.selectType = type;
      that.changed = type;
      if (type === 'store') {
        that.defaultStoreList = selData;
        that.storeTreeSet = {
          dialogVisible: true,
          isSingle: false,
          isSelectPerson: true
        };
        return;
      }
      that.treeSet = {
        dialogVisible: true,
        isSingle: false,
        isSelectPerson: false
      };
      if (type === 'people') {
        that.onlyPerson = true;
        that.treeSet = {
          dialogVisible: true,
          isSingle: false,
          isSelectPerson: true
        };
      } else {
        that.onlyPerson = false;
      }
      that.defaultSelection = selData;
      if (!!that.treeData.hasOwnProperty('treeData')) {
        return;
      }
    },

    /**
     * 处理已选部门
     */
    handleSelectedList(group) {
      const that = this;
      if (that.selectType === 'people') {
        that.ruleForm.peopleList = group;
      } else if (that.selectType === 'store') {
        that.ruleForm.brandValue = group;
      } else {
        that.ruleForm.departList = group;
      }
    },

    /**
     * 获取品牌--门店架构
     */
    getBrandData() {
      const that = this;
      postRequest('/haoban-manage-web/brand/list', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              that.ruleForm.brandOptions = resData.result;
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
    },

    /**
     * 获取用户已有数据
     */
    getUserData() {
      const that = this;
      let para = {
        roleId: that.ruleForm.roleId,
        userId: that.ruleForm.userId,
        brandId: that.ruleForm.brandId
      };
      postRequest('/haoban-manage-web/find-clerk-role', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result) {
              that.ruleForm.peopleList = [resData.result.user];
              resData.result.admList.forEach(function(ele, index) {
                ele.id = ele.groupId;
                ele.label = ele.name;
              });
              that.ruleForm.departList = resData.result.admList || [];

              resData.result.storeList.forEach(function(ele, index) {
                ele.id = ele.groupId ? ele.groupId : ele.storeId;
                ele.label = ele.name;
              });

              that.ruleForm.brandValue = that.ruleForm.roleCode === 'admin' ? resData.result.storeList.map(item => item.groupId) : resData.result.storeList || [];
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
  mounted() {
    const that = this;
    that.getBrandData();
    that.ruleForm.brandId = that.$route.query.brandId;
    if (!!that.$route.query.hasOwnProperty('roleId')) {
      that.ruleForm.roleId = that.$route.query.roleId;
    }
    if (!!that.$route.query.hasOwnProperty('roleCode')) {
      that.ruleForm.roleCode = that.$route.query.roleCode;
      that.ruleForm.roleName = that.$route.query.roleCode === 'admin' ? '企业管理员' : '子管理员';
    }
    if (!!that.$route.query.hasOwnProperty('userId')) {
      that.ruleForm.userId = that.$route.query.userId;
      that.navpath = [
        {
          name: '首页',
          path: '/index'
        },
        {
          name: '设置',
          path: '/companyAddress'
        },
        {
          name: '设置子管理员',
          path: '/setChildAdmin'
        },
        {
          name: '编辑成员',
          path: ''
        }
      ];
      that.getUserData();
    }
  },
  components: {
    navCrumb,
    vueSelectEmployee,
    vueSelectStore
  }
};
</script>
<style lang="less" scoped>
/* display */
.inline-block {
  display: inline-block;
}

.block {
  display: block;
}

.top {
  vertical-align: top;
}

.middle {
  vertical-align: middle;
}

.right-content {
  /*width: 100%;*/
  padding: 24px;
  min-height: calc(100% - 240px);

  .right-box {
    background: #fff;
    padding: 24px;
    min-height: 500px;

    h2 {
      font-size: 16px;
      color: #303133;
    }

    p {
      font-size: 14px;
      color: #909399;
    }

    .m-t-24 {
      margin-top: 24px;
    }

    .m-b-0 {
      margin-bottom: 0;
    }

    .w-380 {
      width: 380px;
    }

    .people-cell {
      position: relative;
      margin-right: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .img-wrap {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 4px;
        text-align: center;
        &.img-wrap-bg {
          background: #82c5ff;
        }
      }
      img {
        width: 100%;
        max-width: 40px;
        max-height: 40px;
        border-radius: 4px;
      }

      .icon-yewuduanmorentouxian {
        font-size: 20px;
        color: #e5f3ff;
      }

      .el-icon-circle-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 16px;
        color: #808995;
        cursor: pointer;
      }
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

    .depart-cell {
      position: relative;
      margin: 0 24px 24px 0;

      .el-icon-circle-close {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 16px;
        color: #808995;
        cursor: pointer;
      }
    }

    .add-icon {
      display: block;
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 50%;
      border: 1px dashed #c0ccda;
      cursor: pointer;
      i {
        font-size: 16px;
        color: #8c939d;
      }
      &:hover {
        border-color: #409eff;
        i {
          color: #409eff;
        }
      }
    }
  }
}
</style>
