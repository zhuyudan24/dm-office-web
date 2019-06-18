<template>
  <div class="companyAddress-wrap common-set-wrap">
    <nav-crumb :navpath="navpath"></nav-crumb>
    <div class="right-content">
      <div class="right-box" :style="{ 'min-height': $store.state.bgHeight }">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="角色名称" prop="roleName" class="">
            <limitInput :inputWidth="500" :inputValue.sync="ruleForm.roleName" :disflag="!!showFlag" :holder="'请输入角色名称'" :maxLength="20"> </limitInput>
          </el-form-item>
          <el-form-item label="角色说明" prop="remark" class="">
            <limitTextarea :inputWidth="500" :inputValue.sync="ruleForm.remark" :holder="'请输入角色说明'" :disInput="!!showFlag" :maxLength="50"> </limitTextarea>
          </el-form-item>
          <el-form-item label="菜单权限" prop="leftChecked" class="m-t-44">
            <div class="w-500 border-1 p-10 border-box el-form-item_menu" :style="{ 'max-height': menuH }">
              <el-tree :data="ruleForm.menuTree" show-checkbox default-expand-all node-key="rightId" ref="tree" highlight-current :props="defaultProps"> </el-tree>
              <!-- <div class="mask" v-if="!!showFlag"></div> -->
            </div>
          </el-form-item>
          <el-form-item label="应用权限" prop="" class="">
            <div class="apps-content">
              <ul class="flex flex-row flex-wrap">
                <li v-for="(item, index) in appDataList" :key="index" :class="['flex flex-align-center border-box flex', !!item.check ? 'border-active' : '']" @click="selectApp(item)">
                  <span class="square-item flex flex-align-center flex-pack-center" :style="{ background: item.appBackgroudColor }">
                    <img :src="item.appIcon" alt="" />
                  </span>
                  <span class="color-303133 font-14 p-l-8">{{ item.appName }}</span>
                  <div class="common-cell_radio" v-if="!!item.check">
                    <!-- 新增选中 -->
                    <div class="box-triangle">
                      <div class="wrap__box__outer">
                        <i class="el-icon-upload-success el-icon-check"></i>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="!!showFlag" type="primary" @click="submitForm('ruleForm')">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <vue-gic-footer></vue-gic-footer>
  </div>
</template>
<script>
import navCrumb from '@/components/nav/nav.vue';
import limitInput from '@/components/limit-input.vue';
import limitTextarea from '@/components/limit-textarea.vue';
import showMsg from '@/common/js/showmsg';
import errMsg from '@/common/js/error';
import { _debounce } from '@/common/js/public';
import { postRequest } from '@/api/api';
export default {
  name: 'addAdminRole',
  data() {
    return {
      menuH: window.screen.availHeight - 695 + 'px',
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
          name: '新增管理员角色',
          path: ''
        }
      ],
      showFlag: false, // 是否可保存
      ruleForm: {
        roleId: '',
        roleName: '',
        remark: '角色说明',
        leftChecked: [],
        menuTree: [],
        left: [
          // {
          //   key: 'index',
          //   label: '首页'
          // },
        ],
        rightChecked: [],
        right: [
          // {
          //   key: 'index',
          //   label: '首页'
          // },
        ],
        leftCheckedApp: [],
        leftApp: [
          // {
          //   key: 'index',
          //   label: '首页'
        ],
        rightCheckedApp: [],
        rightApp: [
          // {
          //   key: 'index',
          //   label: '首页'
          // },
        ],
        appRightList: []
      },
      rules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        remark: [{ required: true, message: '请填写角色说明', trigger: 'blur' }]
        /* leftChecked: [
          { required: true, message: '请选择菜单权限', trigger: 'change' }
        ], */
      },
      defaultProps: {
        children: 'children',
        label: 'rightName'
      },
      appDataList: [
        {
          appId: '1', //应用id
          appName: '签到', //应用名称
          appDesc: '签到', //应用介绍
          appBackgroudColor: '#1890ff',
          appIcon: 'icon-hangzhengjiagou',
          appType: 0, //应用类型 0 企业自用 1 第三方
          status: 3, //状态 0删除 1待上架 2 审核 3上架 4 拒绝'
          remark: '',
          check: false
        }
      ]
    };
  },
  computed: {},
  methods: {
    /**
     * 选择 APP
     */
    selectApp(item) {
      let that = this;
      if (!!that.showFlag) {
        return false;
      }
      item.check = !!item.check ? false : true;
    },
    /**
     * 保存
     */
    submitForm: _debounce(function(formName) {
      const that = this;
      that.$refs[formName].validate(valid => {
        if (valid) {
          let concatArray = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys());
          let data = [];
          concatArray.forEach(function(ele, index) {
            data.push({ rightId: ele });
          });
          that.ruleForm.appRightList = [];
          that.appDataList.forEach(ele => {
            if (ele.check == true) {
              that.ruleForm.appRightList.push(ele.appId);
            }
          });
          /* if (!that.ruleForm.appRightList.length) {
            that.$message.error({
              duration: 1000,
              message: ' 请选择应用权限'
            });
            return false;
          } */
          that.postSave(data);
        } else {
          return false;
        }
      });
    }, 500),

    /**
     * 保存---api
     */
    postSave(data) {
      const that = this;
      const para = {
        data: JSON.stringify(data),
        roleId: that.ruleForm.roleId,
        roleName: that.ruleForm.roleName,
        remark: that.ruleForm.remark,
        brandId: that.ruleForm.brandId,
        appRightList: that.ruleForm.appRightList.join(',')
      };
      postRequest('/haoban-manage-web/save-role', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            showMsg.showmsg('操作成功', 'success');
            that.$router.push('/setChildAdmin');
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
     * 获取菜单列表
     */
    getMenuList() {
      const that = this;
      const para = {};
      postRequest('/haoban-manage-web/menu-list', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              let result = [];
              // 只显示 display == 1 的
              resData.result.forEach(function(ele, index) {
                !!that.ruleForm.roleId && !!that.showFlag ? (ele.disabled = true) : '';
                if (!!ele.display) {
                  result.push(ele);
                }
              });
              that.ruleForm.menuTree = that.treeData(result);
            }

            if (!!that.ruleForm.roleId) {
              that.getRoleDetail(that.ruleForm.roleId);
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
     * 简单数组-->父子数组对象
     */
    treeData(data) {
      let tree = data.filter(father => {
        //循环所有项
        let branchArr = data.filter(child => {
          return father.haobanMenuRightId == child.parentRightId; //返回每一项的子级数组
        });
        if (branchArr.length > 0) {
          father.children = branchArr; //如果存在子级，则给父级添加一个children属性，并赋值
        }
        return father.parentRightId == -1; //返回第一层
      });
      return tree;
    },

    /**
     * 获取角色详情
     */
    getRoleDetail(roleId) {
      const that = this;
      const para = {
        roleId: roleId
      };
      postRequest('/haoban-manage-web/role-detail', para)
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            that.ruleForm.roleId = resData.result.role.roleId;
            that.ruleForm.roleName = resData.result.role.roleName;
            that.ruleForm.roleCode = resData.result.role.roleCode;
            that.ruleForm.remark = resData.result.role.remark;
            that.ruleForm.appRightList = resData.result.appRightList || [];
            if (!!that.ruleForm.right.length) {
              let list = that.ruleForm.right.map(item => item.rightId);
              let rightChecked = [];
              resData.result.menuRightList.forEach(function(ele, index) {
                if (list.includes(ele.rightId)) {
                  rightChecked.push(ele.rightId);
                }
              });
              that.ruleForm.rightChecked = rightChecked;
            }
            let newList = resData.result.menuRightList;
            let ids = [];
            newList.forEach(function(ele, index) {
              if (!!that.$refs.tree.getNode(ele.rightId).isLeaf) {
                ids.push(ele.rightId);
              }
            });
            that.$refs.tree.setCheckedKeys(ids);
            // 设置已选
            that.appDataList.forEach(ele => {
              if (that.ruleForm.appRightList.includes(ele.appId)) {
                ele.check = true;
              }
            });
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
     * 选择
     */
    leftChange(value, direction) {
      const that = this;
      that.ruleForm.leftChecked = value;
      let selFlag = value.includes(direction[0]); // true: 选中；false: 未选
      value.includes(direction[0]) ? replaceData() : replaceData();
      function replaceData() {
        that.ruleForm.right = [];
        that.ruleForm.left.forEach(function(ele, index) {
          // 确定选择哪一个一级菜单，设置右侧数据
          if (ele.rightId.includes(direction[0])) {
            // 未选择设置 check
            if (!selFlag) {
              ele.check = false;
            } else {
              ele.check = true;
            }
            if (!!ele.children && !!ele.children.length) {
              ele.children.forEach(function(el, key) {
                that.ruleForm.right.push(el);
              });
            }
          }
        });
      }
      // 设置右侧已选
      that.ruleForm.rightChecked = that.ruleForm.right.map(item => {
        if (item.check === true) {
          return item.rightId;
        }
      });
    },

    /**
     * 选择
     */
    rightChange(value, direction) {
      const that = this;
      let selFlag = value.includes(direction[0]); // true: 选中；false: 未选
      that.ruleForm.rightChecked = value;
      that.ruleForm.left.forEach(function(ele, index) {
        if (!!ele.children && !!ele.children.length) {
          ele.children.forEach(function(el, key) {
            // 确定选择哪一个一级菜单，设置右侧数据
            if (el.rightId.includes(direction[0])) {
              // 未选择设置 check
              if (!selFlag) {
                el.check = false;
              } else {
                el.check = true;
              }
            }
          });
        }
      });
    },

    /**
     * 获取应用列表
     */
    getAppList() {
      let that = this;
      postRequest('/haoban-manage-web/application-list', {})
        .then(res => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!!resData.result && !!resData.result.length) {
              resData.result.forEach(ele => {
                ele.check = false;
              });
            }
            that.appDataList = resData.result || [];
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
    if (!!that.$route.query.hasOwnProperty('roleId')) {
      that.ruleForm.roleId = that.$route.query.roleId;
      that.navpath[3].name = '管理员角色';
      if (that.$route.query.type === 'show') {
        that.showFlag = true;
      }
      // that.getRoleDetail(that.ruleForm.roleId)
    }
    if (!!that.$route.query.hasOwnProperty('brandId')) {
      that.ruleForm.brandId = that.$route.query.brandId;
    }
    Promise.all([that.getAppList()])
      .then(function(posts) {
        that.getMenuList();
      })
      .catch(function(error) {
        // ...
      });
  },
  components: {
    navCrumb,
    limitInput,
    limitTextarea
  }
};
</script>
<style lang="less" scoped>
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

    .w-380 {
      width: 380px;
    }

    .w-500 {
      width: 500px;
    }

    .border-1 {
      border: 1px solid #dcdfe6;
    }

    .p-10 {
      padding: 10px;
    }

    .border-box {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
    }

    .el-form-item_menu {
      position: relative;
      border-radius: 2px;
      max-height: 516px;
      overflow-x: hidden;
      overflow-y: auto;
      .mask {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background: rgba(176, 176, 176, 0.5);
        z-index: 1;
      }
    }
    .apps-content {
      li {
        position: relative;
        width: 235px;
        height: 44px;
        padding-left: 24px;
        background: #fff;
        border: 1px solid #dcdfe6;
        border-radius: 6px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;

        &.border-active {
          border-color: #1890ff;
        }

        .common-cell_radio {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          cursor: pointer;

          .box-triangle {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;

            .wrap__box__outer {
              position: absolute;
              right: -16px;
              bottom: -6px;
              width: 40px;
              height: 20px;
              background: #1890ff;
              text-align: center;
              -webkit-transform: rotate(-45deg);
              -moz-transform: rotate(-45deg);
              transform: rotate(-45deg);
              i {
                position: absolute;
                top: 1px;
                left: 15px;
                font-size: 12px;
                color: #fff;
                -webkit-transform: rotate(45deg);
                -moz-transform: rotate(45deg);
                transform: rotate(45deg);
              }
            }
          }
        }
        .square-item {
          width: 25px;
          height: 25px;
          border-radius: 8px;
          img {
            max-width: 25px;
            max-height: 25px;
          }
          i {
            font-size: 14px;
            color: #fff;
          }
        }
      }
    }

    .el-transfer {
      display: inline-block;
      vertical-align: top;
      /deep/ .el-transfer-panel:last-child {
        display: none;
      }
      /deep/ .el-transfer__buttons {
        padding: 0 5px;
        .el-button {
          display: none;
        }
      }
      &.el-transfer-check {
        /deep/ .el-transfer-panel__item {
          &:hover {
            background: #f5f7fa;
          }
          &:active {
            background: #f5f7fa;
          }
        }
      }
    }
  }
}
</style>
