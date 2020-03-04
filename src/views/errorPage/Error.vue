<template>
  <div class="error-page">
    <div class="title">
      微信接口繁忙，请稍后再试
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
  }
}
</style>
