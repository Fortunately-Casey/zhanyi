<template>
  <div class="register">
    <h1>222</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    console.log(this.$route.query);
  },
  mounted() {
    this.$router.push({
      path: "/register",
      query: {
        WXID: this.$route.query.WxId
      }
    });
  }
};
</script>

<style lang="less" scoped>
</style>