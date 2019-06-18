<template>
  <div class="guid-div">
    <div class="guid">
      <p class="title">共享通讯录操作引导</p>
      <div class="flex-div">
        <div class="step">
          <img src="../../../assets/guid1.png" />
          <p>点击建立共享企业，下载二维码 发给所要建立共享的企业</p>
        </div>
        <div class="step">
          <img src="../../../assets/guid2.png" />
          <p>从企业通讯录中添加对方可见我方 企业的成员及门店</p>
        </div>
        <div class="step">
          <img src="../../../assets/guid3.png" />
          <p>添加完成之后必须点击发布，所添加或 修改的信息才会同步至对方共享通讯录中</p>
        </div>
      </div>
    </div>
    <div class="guid">
      <p class="des">应用场景</p>
      <p class="des">适用于集团公司与子公司建立通讯录部分成员共享机制</p>
      <p class="des">适用于总部与代理商、加盟商建立通讯录部分成员共享机制</p>
    </div>
    <div style="text-align: center;margin-top:50px;">
      <a href="#/shareCode">
        <el-button type="primary">建立共享企业</el-button>
      </a>
    </div>
  </div>
</template>
<style lang="scss">
.guid-div {
  width: 100%;
  height: 690px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 1);
  border-radius: 2px;
  padding: 30px;

  .guid {
    width: 100%;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(235, 238, 245, 1);
    border-radius: 4px;
    padding: 30px;
    margin-bottom: 24px;
    font-size: 14px;
    color: rgba(96, 98, 102, 1);

    .des {
      text-align: center;
      margin-bottom: 30px;

      &:first-child {
        font-size: 16px;
        margin-bottom: 44px;
      }
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      color: rgba(48, 49, 51, 1);
      margin-bottom: 50px;
      text-align: center;
    }

    .flex-div {
      display: flex;

      .step {
        flex: 1;
        text-align: center;
        height: 200px;

        img {
          height: 96px;
        }

        p {
          width: 260px;
          height: 34px;
          line-height: 24px;
          margin: 40px auto 0;
        }
      }
    }
  }
}
</style>
