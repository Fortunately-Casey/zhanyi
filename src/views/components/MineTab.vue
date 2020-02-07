<template>
  <div class="mine-tab">
    <div class="tab">
      <div class="icon-info icon"></div>
      <div class="title info-title">基本信息</div>
      <div class="arrow" @click="toDetail"></div>
    </div>
    <div class="tab">
      <div class="icon-punch icon"></div>
      <div class="title punch-title">打卡记录</div>
      <div class="arrow"></div>
    </div>
    <div class="tab">
      <div class="icon-health icon"></div>
      <div class="title health-title">健康报告</div>
      <div class="arrow"></div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    toDetail() {
        this.$router.push({
            path:"/index/mine/minedetail",
            
        })
    }
  }
};
</script>
<style lang="less" scoped>
.mine-tab {
  .tab {
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
    padding: 0 20px;
    box-sizing: border-box;
    display: flex;
    position: relative;
    .icon {
      width: 14px;
      height: 14px;
      margin-top: 12px;
    }
    .title {
      line-height: 40px;
      padding-left: 10px;
      font-size: 14px;
    }
    .icon-info {
      background: url("../../assets/image/信息.png") no-repeat;
      background-size: 100% 100%;
    }
    .icon-punch {
      background: url("../../assets/image/打卡记录.png") no-repeat;
      background-size: 100% 100%;
    }
    .icon-health {
      background: url("../../assets/image/健康报告.png") no-repeat;
      background-size: 100% 100%;
    }
    .info-title {
      color: #feb682;
    }
    .punch-title {
      color: #4eb1d1;
    }
    .health-title {
      color: #3cbc3a;
    }
    .arrow {
      width: 8px;
      height: 13px;
      background: url("../../assets/image/右.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 25px;
      top: 12px;
    }
  }
}
</style>