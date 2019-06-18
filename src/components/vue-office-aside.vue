<template>
<div class="left-aside-contain" :style="{height: asideHeight}">
  <div class="leftBar-wrap" >
    <div class="cardmenu" :class="{collapse: leftCollapse}">
     <!--  <div class="cardtitle" v-show="!leftCollapse">
          <span>{{leftModuleName}}</span>
      </div> -->
      <div class="cardmenu-item">
        <el-menu :default-active="selectMenu" :data-path="'/' + $route.path" style="border-right: 0;" class="el-menu-vertical-demo cardmenupanel" :router="true"  text-color="#606266" active-text-color="#1890ff" :collapse="leftCollapse" unique-opened  @open="handleOpen" @select="handleSelect">
        <!--:default-openeds="defaultSub"-->
          <template v-for="(menuItem,index) in menuLeftRouter" >
            <el-submenu :index="index+''" v-if="menuItem.children.length>0 && !menuItem.levelFlag" :key="index">
              <template slot="title" >
                <i :class="['iconfont','menu-icon',menuItem.iconUrl]"></i>
                <span slot="title">{{menuItem.rightName}}</span>
              </template>
              <!-- <el-menu-item-group > -->
                <el-menu-item v-for="(childMenu,cindex) in menuItem.children" :key="cindex" :index="childMenu.url"  style="padding-left: 53px;"><label slot="title" :data-index="$route.path == childMenu.url? $route.path:false" :data-path="childMenu.url">{{childMenu.rightName}}</label></el-menu-item>
              <!-- </el-menu-item-group> -->
            </el-submenu>
            <el-menu-item :key="index" :index="menuItem.url"  v-if="!menuItem.children.length || (menuItem.children.length>0 && !!menuItem.levelFlag)">
              <i :class="['iconfont','menu-icon',menuItem.iconUrl]"></i>
              <span slot="title">{{menuItem.rightName}}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  import qs from 'qs';
  export default {
    name: 'vue-office-aside',
    props: ['collapseFlag','projectName'],//'leftMenuRouter','leftModulesName',
    data () {
      return {
        repProjectName: 'haoban-manage-web', // 项目名
        asideHeight: '0px', // 高度
        pathName: '', // 路由名
        leftCollapse: false, // 是否收起左侧
        leftModuleName: '',
        // defaultSub: ['1','2','3','4','5','6','7','8','9'], // 默认打开子菜单
        menuLeftRouter: [],
        // 获取 location origin
        baseUrl: '',
        //已选菜单
        selectMenu: '',
      }
    },
    beforeMount() {
      const that = this
      let host = window.location.origin;
      if (host.indexOf('localhost') != -1) {
        that.baseUrl = 'http://www.gicdev.com';
      }else {
        that.baseUrl = host
      }
    },
    methods: {

      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },

      handleSelect(key, keyPath){
        const that = this;
        that.selectMenu = key;
      },

      // 设置新数据
      setNewData(newData) {
        const that = this;
        // 处理成需要的路由
        newData.forEach(function(ele,index){
          // 设置 url
          ele.url = '/'+ ele.url;
          ele.levelFlag = false; // 有子级
          if (!!ele.children && !!ele.children.length) {
            let displayList = ele.children.map(item=>item.display)
            if (displayList.includes(1)) {
              ele.levelFlag = false; // 有子级
            }else {
              ele.levelFlag = true; // 有子级，单独路由
            }
            ele.children.forEach(function(el,key){
              // 设置 url
              el.url = '/'+ el.url;
            })
          }
        })
        that.menuLeftRouter = newData;
        that.setSelectMenu(newData);
      },

      setSelectMenu(data) {
        const that = this;
        data.forEach(function(ele,index){
          try {
            if (('/' + that.pathName) == ele.url) {
              that.selectMenu = '/' + that.pathName;
            }else {
              ele.children.forEach(function(el,key){
                if (('/' + that.pathName) ==  el.url) {
                  that.selectMenu = !!el.display? el.url : ele.url;
                }
                if (!!el.children.length) {
                  el.children.forEach(function(item,k){
                    if (item.url == that.pathName) {
                      that.selectMenu = el.url;
                      if (!that.$route.query.type) {
                        throw "break"; // 跳出循环，避免重复路由判断
                      }
                    }
                  })
                }
              })
            }
          } catch(err) {
            // console.log(err)
          }
        })
      },

      // 触发父组件路由
      toRouter(path) {
        const that = this;
        that.$emit('toLeftRouterView', '/'+path)
      },

      // 刷新路由
      refreshRoute() {
        const that = this;
        //获取项目名 pathname (路由的hash)
        that.routePathName = window.location.hash.split('/')[1];
        if (that.routePathName.indexOf('?')!= -1) {
          that.routePathName = that.routePathName.split('?')[0];
        }
        if (that.routePathName.indexOf('/')!= -1) {
          that.routePathName = that.routePathName.split('/')[0];
        }
        that.pathName = that.routePathName;
        that.getLeftMenu();
      },

      /**
       * 简单数组-->父子数组对象
       */
      treeData(data){
        let tree = data.filter((father)=>{                  //循环所有项
          let branchArr = data.filter((child)=>{
            return father.haobanMenuRightId == child.parentRightId;    //返回每一项的子级数组
          });
          if(branchArr.length>0){
            father.children = branchArr;    //如果存在子级，则给父级添加一个children属性，并赋值
          }else {
            father.children = [];
          }
          return father.level == 1;        //返回第一层
        });
        tree.sort(function(a,b){
          return a.sort - b.sort;
        });
        return tree;
      },

      /**
       *  获取左侧菜单
       */
      getLeftMenu() {
        const that = this;
        let para = {
          project: that.repProjectName,
          router: that.pathName,
          requestProject: that.repProjectName
        }
        that.axios.post(that.baseUrl+'/haoban-manage-web/menu-detail',qs.stringify(para))
        .then((res) => {
          let resData = res.data;
          if (resData.errorCode == 1) {
            if (!resData.result) {
              that.$message.error({
                duration: 1000,
                message: '暂无数据'
              })
              return;
            }
            that.setNewData(that.treeData(resData.result.leftMenu));
            return;
          }
          that.$message.error({
            duration: 1000,
            message: resData.message
          })
        })
        .catch(function (error) {
          that.$message.error({
            duration: 1000,
            message: error.message
          })
        });
      }
    },
    watch: {
      $route: {
        handler: function(val, oldVal){

        },
        // 深度观察监听
        deep: true
      },

      collapseFlag: function(newData,oldData){
        const that = this;
        that.leftCollapse = newData;
      },

      projectName: function(newData,oldData){
        const that = this;
        that.repProjectName = newData || 'haoban-manage-web';
      },
    },

    /* 接收数据 */
    mounted(){
      const that = this;
      that.repProjectName = that.projectName || 'haoban-manage-web'; // 获取项目名
      // 获取高度
      that.asideHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 64 +'px';
      //获取项目名 pathname (路由的hash)
      that.pathName = window.location.hash.split('/')[1];
      if (that.pathName.indexOf('?')!= -1) {
        that.pathName = that.pathName.split('?')[0];
      }
      // 获取菜单
      that.getLeftMenu();
      //折叠参数
      that.leftCollapse = that.collapseFlag;
    }
  }
</script>

<style lang="less" scoped>
.attention-wrap{
  .item-label{
    font-size: 14px;
    color: #606266;
    margin-bottom: 30px;
    span{
      display: inline-block;
      width: 80px;
    }
  }
}

.left-aside-contain {
  /*width: 200px;*/
  display: inline-block;
  /*overflow: auto;
  overflow-x: hidden;*/
  &::-webkit-scrollbar{
    width: 0;
    height: 0;
  }

  /deep/ .el-submenu .el-submenu__title:hover {
    background-color: rgba(249,250,252,1);
  }
}
.leftBar-wrap /deep/ {
  height: 100%;
  display: inline-block;
  overflow: auto;
  &::-webkit-scrollbar{
    width: 0;
    height: 0;
  }

  .cardmenu{
    flex: 0 0 200px;
    width: 200px;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: rgba(249,250,252,1);
    cursor: pointer;
    transition: all .2s ease;

    &::-webkit-scrollbar{
      width: 0;
      height: 0;
    }
   }

  .collapse{
    transition: all .3s ease;
    flex: 0 0 64px;
    width: 64px;
    /*transform: translateX(-8px);*/
    overflow: hidden;
  }

  .cardtitle{
    font-size: 20px;
    color: #fff;
    padding-left: 20px;
    height: 56px;
    line-height: 56px;
  }

  /deep/ .el-submenu__title:hover {
    /*background-color: #020b21;*/
  }
}

  .leftBar-wrap .el-menu .el-menu-item,.el-menu .el-submenu{
    /*background: #020b21;*/
  }
  .leftBar-wrap {
    /deep/ .el-submenu__title:hover {
      /*background-color: #020b21;*/
    }
  }
  .leftBar-wrap .cardmenu-item /deep/ .el-menu-item-group .el-menu-item-group__title{
    /*background-color: #020b21;*/
    display: none;
  }
  .leftBar-wrap .cardmenu-item /deep/ .el-submenu__title i {
    color: #606266;
  }

  .leftBar-wrap .cardmenu-item /deep/ .el-menu-item span {
    color: #606266;
  }

  .leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item label {
     color: #606266;
  }

  .leftBar-wrap .cardmenu-item .el-menu-item.is-active {
      color: #1890ff;
      border-right: 3px solid #1890ff;
      background-color: transparent;
  }

  .leftBar-wrap .cardmenu-item /deep/ .el-menu-item.is-active span {
    color: #1890ff;
  }

  .leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item.is-active label {
     color: #1890ff;
  }

  .el-menu.el-menu--popup {
    background: #020b21;
    border-radius: 4px;
  }

  .el-menu--popup .el-menu-item {
    height: 40px;
    line-height: 40px;
  }

  .el-menu--popup .el-menu-item label{
    display: block;
    margin-left: -34px;
    color: #c0c4cc;
    cursor: pointer;
  }

  .el-menu--popup .el-menu-item:hover {
    background-color: #020b21;
  }

  .el-menu--popup .el-menu-item:hover label {
    color: #fff;
  }

  .leftBar-wrap .cardmenu-item /deep/ .el-submenu__title,.leftBar-wrap .cardmenu-item /deep/ .el-menu-item,.leftBar-wrap .cardmenu-item /deep/ .el-submenu .el-menu-item{
    height: 40px;
    line-height: 40px;
  }

  .leftBar-wrap .cardmenu-item /deep/ li.el-menu-item:hover {
    background: transparent;
  }

  .leftBar-wrap .cardmenu-item /deep/ li.el-menu-item:hover i{
    /*background-color: #1890ff;*/
    color: #1890ff;
  }

  .leftBar-wrap .cardmenu-item /deep/ li.el-menu-item:hover span{
    /*background-color: #1890ff;*/
    color: #1890ff;
  }

  .leftBar-wrap .cardmenu-item /deep/ li.el-submenu:hover i{
    /*background-color: #1890ff;*/
    color: #1890ff;
  }

  .leftBar-wrap .cardmenu-item /deep/ li.el-submenu:hover span{
    /*background-color: #1890ff;*/
    color: #1890ff;
  }

  .leftBar-wrap .cardmenu-item /deep/ li.el-submenu .el-menu-item:hover label{
    /*background-color: #1890ff;*/
    color: #1890ff;
    cursor: pointer;
  }

  .leftBar-wrap .el-submenu .el-menu-item-group .el-menu-item {
    position: relative;

  }
  .leftBar-wrap .el-submenu .el-menu-item::before{
     position: absolute;
     content: '●';
     left: 35px;
     top: 0px;
     font-size: 10px;
    /* color: #fff;*/
  }

  .leftBar-wrap .el-submenu .el-menu-item:hover::before{
    color: #1890ff;
  }


  .leftBar-wrap .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .leftBar-wrap .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .leftBar-wrap .cardmenu-item .menu-icon{
    /*margin-right: 5px;*/
    width: 24px;
    text-align: center;
    font-size: 14px;
    vertical-align: middle;
    display: inline-block;
    color: #808995;
  }
  .leftBar-wrap .cardmenu-item .el-menu-item.is-active .menu-icon {
    color: #1890ff;
  }

.el-menu-item-group {
    .el-menu-item{
      height: 40px;
      line-height: 40px;
    }
}
</style>
