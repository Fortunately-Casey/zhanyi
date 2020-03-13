<template>
  <div class="school-main">
    <div class="top-bg">
      <div class="title"></div>
    </div>
    <scroll ref="wrapper" :listenScroll="true" :pullup="true" :data="childList" class="wrapper">
      <ul class="child-list">
        <li class="child" v-for="(item,index) in 5" :key="index">
          <div class="left">
            <div class="child-name">
              <div class="child-logo boy"></div>
              <div class="name">王子易</div>
            </div>
            <div class="child-values">
              <div class="value">三年级2班</div>
              <div class="value">南通市东方小学</div>
              <div class="value">320623199509244538</div>
            </div>
          </div>
          <div class="right" @click="childPunch">
            <div class="punch-icon" ></div>
          </div>
        </li>
      </ul>
    </scroll>
    <div class="add-button" @click="addChild"></div>
  </div>
</template>
<script>
import Scroll from "../../components/Scroll";
export default {
  data() {
    return {
      childList: []
    };
  },
  methods: {
    addChild() {
      this.$router.push({
        path: "/childrenEdit"
      });
    },
    childPunch() {
      this.$router.push({
        path:"/enterprisePunch"
      })
    }
  },
  components: {
    Scroll
  }
};
</script>
<style lang="less" scoped>
.school-main {
  height: 100%;
  background: url("../../assets/image/bottom-bg.png") no-repeat;
  background-size: contain;
  background-position: left bottom;
  .top-bg {
    width: 100%;
    height: 152px;
    background: url("../../assets/image/children-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      width: 74px;
      height: 18px;
      background: url("../../assets/image/children-title.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .wrapper {
    height: 248px;
    overflow: hidden;
    .child-list {
      margin: 0;
      padding: 0;
      list-style: none;
      .child {
        width: 335px;
        height: 108px;
        margin: 10px auto;
        background: #ffffff;
        box-shadow: 0 0 5px 2px rgba(99, 163, 141, 0.5);
        border-radius: 8px;
        display: flex;
        transform: translateY(10px);
        .left {
          width: 255px;
          border-radius: 8px 0 0 8px;
          display: flex;
          .child-name {
            width: 70px;
            .child-logo {
              width: 40px;
              height: 40px;
              margin: 15px auto;
            }
            .boy {
              background: url("../../assets/image/boy-logo.png") no-repeat;
              background-size: 100% 100%;
            }
            .girl {
              background: url("../../assets/image/girl-logo.png") no-repeat;
              background-size: 100% 100%;
            }
            .name {
              text-align: center;
              font-size: 14px;
              color: #16d0a0;
              font-weight: bold;
            }
          }
          .child-values {
            width: 185px;
            padding-top: 10px;
            .value {
              height: 30px;
              line-height: 30px;
              font-size: 14px;
            }
          }
        }
        .right {
          width: 80px;
          border-radius: 0 8px 8px 0;
          background-color: #35d89d;
          display: flex;
          justify-content: center;
          align-items: center;
          .punch-icon {
            width: 24px;
            height: 24px;
            background: url("../../assets/image/punch-icon.png") no-repeat;
            background-size: 100% 100%;
          }
        }
      }
    }
  }
  .add-button {
    width: 335px;
    height: 60px;
    background: url("../../assets/image/add-button.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
