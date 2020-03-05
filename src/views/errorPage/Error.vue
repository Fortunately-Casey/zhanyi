<template>
  <div class="error-page">
    <div class="title">
      <img src="../../assets/image/网络繁忙.png" alt="" /><br />
      当前网络繁忙,请稍后再试
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.error-page {
  width: 100%;
  height: 100%;
  position: relative;
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    img {
      margin-bottom: 20px;
      width: 160px;
      height: 50px;
    }
  }
}
</style>
