<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import { chinaDateTime } from "@/common/tool/tool.js";
import $ from 'jquery'
export default {
  created() {
    var arr = chinaDateTime(new Date())
      .split(" ")[0]
      .split("-");
    console.log();
    document.getElementsByTagName(
      "title"
    )[0].innerText = `南通市“战疫图”:${arr[1] + "-" + arr[2]}最新数据`;
  },
  mounted() {
    console.log($(".BMap_pop img"))
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

/*地图标题*/
.BMap_bubble_title {
	color:white;
	font-size:13px;
	font-weight:bold;
	text-align:left;
	padding-left:5px;
	padding-top:5px;
	// border-bottom:1px solid gray;
  background-color: #fff;
  display:none;
}
/* 消息内容 */
.BMap_bubble_content {
	background-color:white;
	padding-left:5px;
	padding-top:5px;
  padding-bottom:10px;
  // border:1px solid red;
  border-radius:8px;
  // height:60px!important;
  overflow-Y:auto;
  div {
    text-align:center;
  }
  div:first-child{
    color:red;
  }
}
// /* 内容 */
// .BMap_pop div:nth-child(9) {
// 	top:35px !important;
// }
// /* 左上角删除按键 */
// .BMap_pop img {
// 	top:43px !important;
// 	left:215px !important;
// }
// .BMap_pop img:nth-child(1) {
// 	background-color:red;
// }
// .BMap_top {
// 	display:none;
// }
// .BMap_bottom {
// 	display:none;
// }
// .BMap_center {
// 	display:none;
// }
// /* 隐藏边角 */
// .BMap_pop div:nth-child(1) div {
// 	display:none;
// }
// .BMap_pop div:nth-child(3) {
// 	display:none;
// }
// .BMap_pop div:nth-child(4) {
// 	display:none!important;
// }
// .BMap_pop div:nth-child(7) {
// 	display:none;
// }
.BMap_pop div:nth-child(8) {
  height:50px!important;
  overflow-Y:auto!important;
}
</style>
