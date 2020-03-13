<template>
  <div class="student-punch">
    <div class="header"></div>
    <scroll
      ref="wrapper"
      :listenScroll="true"
      :pullup="true"
      :data="arrList"
      @scrollToEnd="scrollToEnd"
      @setScroll="setScroll"
      @beforeScroll="beforeScroll"
      @scroll="scroll"
      class="wrapper"
    >
      <ul class="content">
        <li v-for="(item, i) in 5" :key="i">测试数据</li>
      </ul>
    </scroll>
    <!-- <div class="modal">
      <scroll
        :listenScroll="true"
        :pullup="true"
        :data="arrList"
        @scrollToEnd="scrollToEnd"
        @setScroll="setScroll"
        @beforeScroll="beforeScroll"
        @scroll="scroll"
        class="top-wrapper"
      >
        <ul class="content">
          <li v-for="(item,i) in 50" :key="i" @click="clickThings">测试数据</li>
        </ul>
      </scroll>
    </div>-->
  </div>
</template>
<script>
import Scroll from "../../components/Scroll";
export default {
  components: {
    Scroll
  },
  data() {
    return {
      arrList: [
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据",
        "测试数据"
      ]
      // scroll: null
    };
  },
  methods: {
    scrollToEnd(scroll) {
      this.scroll = scroll;
      console.log("下拉到最底下");
    },
    setScroll(scroll) {
      this.scroll = scroll;
      console.log("scroll创建成功");
    },
    scroll(pos) {
      console.log(pos); //监听滚动坐标
    },
    beforeScroll() {
      console.log("滚动之前");
    },
    clickThings() {
      alert("1111");
    }
  }
};
</script>
<style lang="less" scoped>
.student-punch {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .header {
    height: 40px;
    background-color: #2e55d6;
    color: #fff;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    position: relative;
  }
  .wrapper {
    height: 100%;
    overflow: hidden;
  }
  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(59, 58, 58, 0.623);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .top-wrapper {
      height: 300px;
      width: 300px;
      overflow: hidden;
      // background-color: #fff;
      ul {
        li {
          text-align: center;
          color: red;
        }
      }
    }
  }
  ul {
    // height: 300px;
    list-style: none;
    margin: 0;
  }
}
</style>
