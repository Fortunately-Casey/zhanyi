<template>
  <div class="register">
    <div class="logo"></div>
    <div class="search-button" @click="toSearchMap"></div>
    <div class="health-button" @click="toWeiXin"></div>
    <div class="nantong-chy"></div>
    <div class="company-name">
      <div>技术合作：南通市测绘院有限公司</div>
      <div>数据来源：南通市疾病预防控制中心</div>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {

    };
  },
  computed: {

  },
  methods: {
    toSearchMap() {
      this.$router.push({
        path:"/homeMap"
      })
    },
    toWeiXin() {
      window.location.href = "https://yqfk.ntschy.com/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%2Fapi%2Fweixin%2FgotoPeriodPlace"
    }
  },
  components: {
    
  },
  watch: {}
};
</script>
<style lang="less">
.register {
  height: 100%;
  width: 100%;
  background: url("../../assets/image/bg.png") no-repeat;
  background-size: contain;
  position: relative;
  .logo {
    width: 132px;
    height: 107px;
    position: absolute;
    left: 50%;
    top: 6%;
    transform: translateX(-50%);
    background: url("../../assets/image/logo.png") no-repeat;
  }
  .search-button,.health-button {
      width:280px;
      height:70px;
  }
  .search-button {
      background: url("../../assets/image/searchButton.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 50%;
      top: 200px;
      transform: translateX(-50%);
  }
  .health-button {
      background: url("../../assets/image/healthButton.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 50%;
      top: 290px;
      transform: translateX(-50%);
  }
  .nantong-chy {
    width: 223px;
    height: 29px;
    background: url("../../assets/image/chy-logo2.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60px;
  }
  .company-name {
    width: 200px;
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    >div {
      color:gray;
    }
  }
}
</style>