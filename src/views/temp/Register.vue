<template>
  <div class="register">
    <h1></h1>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    // console.log(this.$route.query);
  },
  mounted() {
    // this.$router.push({
    //   path: "/register",
    //   query: {
    //     WXID: this.$route.query.WxId
    //   }
    // });
    // ios下SPA history跳转后，长按图片无法「发送给朋友」和「识别二维码」改为href跳转模式
    window.location.href = `https://yqfk.ntschy.com/register?WXID=${this.$route.query.WxId}`;
  }
};
</script>

<style lang="less" scoped></style>
