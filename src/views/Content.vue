<template>
  <div class="content">
    <div class="header">
      <div class="tab" @click="choseTab(0)" :class="chosedTab === 0 ?'chosed':''">出行打卡</div>
      <div class="tab" @click="choseTab(1)" :class="chosedTab === 1 ?'chosed':''">我的</div>
      <div class="tab" @click="choseTab(2)" :class="chosedTab === 2 ?'chosed':''">管理</div>
      <div class="header-logo"></div>
    </div>
    <router-view></router-view>
    <m-map></m-map>
  </div>
</template>
<script>
import MMap from "./map/Map.vue";
// import MPunch from "@/views/components/Punch.vue";
// import MAdministration from "@/views/components/Administration.vue";
// import MMine from "@/views/components/Mine.vue";
export default {
  data() {
    return {
      chosedTab: 0
    };
  },
  methods: {
    choseTab(index) {
      this.chosedTab = index;
      if (index === 0) {
        this.$router.push({
          path: "/index/punch"
        });
      } else if (index === 1) {
        this.$router.push({
          path: "/index/mine"
        });
      } else if (index === 2) {
        this.$router.push({
          path: "/index/administration"
        });
      }
    },
    closePunch() {
      this.chosedTab = "";
    }
  },
  components: {
    MMap,
    // MPunch,
    // MMine,
    // MAdministration
  }
};
</script> 
<style lang="less">
.content {
  width: 100%;
  height: 100%;
  .header {
    width: 100%;
    height: 40px;
    background-color: #d22c2c;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    padding: 0 10%;
    box-sizing: border-box;
    .tab {
      width: 33.33%;
      height: 40px;
      text-align: left;
      line-height: 40px;
      float: left;
      color: #fff;
      font-size: 13px;
    }
    .header-logo {
      width: 64px;
      height: 40px;
      background: url("../assets/image/come-up-nantong.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      right: 5px;
      top: 0;
      z-index: 999;
    }
    .chosed {
      color: #fd9550;
    }
  }
}
</style>