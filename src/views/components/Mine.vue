<template>
  <div class="mine">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {

    };
  }
};
</script>
<style lang="less" scoped>
.mine {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 40px;
  box-sizing: border-box;
}
</style>