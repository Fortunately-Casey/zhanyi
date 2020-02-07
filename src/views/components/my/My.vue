<template>
  <div class="my">
    <div class="li" @click="goBasic">
      <div class="basic">基本信息</div>
      <i class="jian"></i>
    </div>
    <div class="li" @click="goRecord">
      <div class="record">打卡记录</div>
      <i class="jian"></i>
    </div>
    <div class="li" @click="goHealth">
      <div class="health">健康报告</div>
      <i class="jian"></i>
    </div>
  </div>
</template>
<script>
// import Mine from "../components/Mine.vue";
import { Toast } from "mint-ui";

export default {
  data() {
    return {};
  },
  computed: {},
  components: {
    // Mine,
  },
  methods: {
    goBasic() {
      var vm = this;
      vm.$router.push({
        path: "/index/mine/basic",
        // query: "casey"
      });
    },
    goRecord() {
      var vm = this;
      vm.$router.push({
        path: "/index/mine/record",
        // query: "casey"
      });
    },
    goHealth() {
      var vm = this;
      vm.$router.push({
        path: "/index/mine/health",
        // query: "casey"
      });
    }
  }
};
</script>
<style lang="less">
.my {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 998;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding-top: 40px;
  box-sizing: border-box;
  .li {
    width: 100%;
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    position: relative;
    .basic {
      width: calc(100% - 50px);
      height: 40px;
      line-height: 40px;
      background: url("../../../assets/image/message.png") 20px 13px no-repeat;
      padding-left: 45px;
      color: #ff9952;
      font-size: 14px;
    }
    .record {
      width: calc(100% - 50px);
      height: 40px;
      line-height: 40px;
      background: url("../../../assets/image/record.png") 20px 13px no-repeat;
      padding-left: 45px;
      color: #33a5cc;
      font-size: 14px;
    }
    .health {
      width: calc(100% - 50px);
      height: 40px;
      line-height: 40px;
      background: url("../../../assets/image/health.png") 20px 12px no-repeat;
      padding-left: 45px;
      color: #0dac0b;
      font-size: 14px;
    }
    .jian {
      width: 50px;
      background: url("../../../assets/image/right.png") 10px no-repeat;
    }
  }
}
</style>