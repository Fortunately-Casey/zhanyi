<template>
  <div class="query">
    <h1>111</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // alert("空白页")
    // window.localStorage.setItem("WXID", JSON.stringify(this.$route.query.WxId));
    console.log(this.$route.query);
  },
  mounted() {
    this.$router.push({
      path: "/punch"
    });
  }
};
</script>

<style lang="less" scoped>
</style>