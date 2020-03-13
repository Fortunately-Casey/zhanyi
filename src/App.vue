<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { chinaDateTime } from "@/common/tool/tool.js";
import $ from "jquery";
export default {
  created() {},
  mounted() {}
};
</script>
<style lang="less">
html {
  height: 100%;
}
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0px;
  // position: fixed;
  //  overflow:hidden;
}
.anchorBL {
  display: none;
}
.picker-items {
  width: 100%;
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
  border-bottom: 1px solid #f2f2f2;
  background-color: transparent;
  padding-left: 5px;
  margin-top: 5px;
  border-radius: 0;
}

input[type="text"]:focus {
  outline: none;
  border-bottom: 1px solid #16d0a0;
}
input[type="password"]:focus {
  outline: none;
  border-bottom: 1px solid #16d0a0;
}
input[type="number"]:focus {
  outline: none;
  border-bottom: 1px solid #16d0a0;
}

/*地图标题*/
.BMap_bubble_title {
  color: white;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  padding-top: 5px;
  // border-bottom:1px solid gray;
  background-color: #fff;
  display: none;
}
/* 消息内容 */
.BMap_bubble_content {
  background-color: white;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 10px;
  // border:1px solid red;
  border-radius: 8px;
  // height:60px!important;
  overflow-y: auto;
  div {
    text-align: center;
  }
  div:first-child {
    color: red;
    font-size: 14px;
    font-weight: bold;
  }
  div:nth-child(2) {
    text-align: left;
  }
}

.BMap_pop div:nth-child(8) {
  height: 50px !important;
  overflow-y: auto !important;
}

.mint-indicator-wrapper {
  z-index: 1000 !important;
}

.mint-indicator-mask {
  z-index: 1000 !important;
}
.mint-radiolist-title {
  display: none !important;
}
.mint-checklist-title {
  display: none !important;
}
.mint-radio-label {
  font-size: 13px !important;
  font-weight: 40 !important;
}
.mint-checklist-label {
  font-size: 13px !important;
  font-weight: 40 !important;
}
</style>
