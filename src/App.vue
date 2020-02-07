<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  mounted() {
    // setInterval(() => {
    //   this.addressDetail();
    // }, 2000);
  }
};
</script>
<style lang="less">
html {
  height: 100%;
}
body {
  height: 100%;
  margin: 0px;
  padding: 0px;
  //  overflow:hidden;
}
.anchorBL {
  display: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  height: 100%;
}

input {
  border: none;
  border-bottom: 1px solid #e4e4e4;
  background-color: transparent;
  padding-left: 5px;
  margin-top: 5px;
  border-radius: 0;
}

input[type="text"]:focus {
  outline: none;
  border-bottom: 1px solid #d6362e;
}
</style>
