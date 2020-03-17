<template>
  <div class="school-main">
    <div class="top-bg">
      <div class="top-box">
        <div class="ball"></div>
        <div class="book"></div>
        <div class="title"></div>
      </div>
    </div>
    <div class="class-manage-button" @click="classManage"></div>
    <div class="teacger-punch-button" @click="teacherRegister"></div>
    <div class="school-manage-button" @click="schoolManage"></div>
    <div class="bottom-logo"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    classManage() {
      this.$router.push({
        path: "/schoolLogin",
        query: {
          type: "class"
        }
      });
    },
    // 教职工打卡
    teacherRegister() {
      this.$router.push({
        path: "/schoolRegitser",
        query: {
          type: "teacher"
        }
      });
    },
    schoolManage() {
      this.$router.push({
        path: "/schoolLogin",
        query: {
          type: "school"
        }
      });
    }
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
    height: 130px;
    background: url("../../assets/image/top-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    .top-box {
      width: 246px;
      height: 145px;
      background: url("../../assets/image/top-box.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 40px;
      position: relative;
      .ball {
        width: 90px;
        height: 90px;
        background: url("../../assets/image/ball.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: -45px;
        bottom: -10px;
      }
      .book {
        width: 98px;
        height: 77px;
        background: url("../../assets/image/book.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -40px;
        top: -5px;
      }
      .title {
        width: 176px;
        height: 24px;
        background: url("../../assets/image/school-title.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .class-manage-button,
  .school-manage-button,
  .teacger-punch-button {
    width: 294px;
    height: 84px;
    margin: 0 auto;
  }
  .class-manage-button {
    background: url("../../assets/image/class-manage.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 140px;
  }
  .teacger-punch-button {
    background: url("../../assets/image/teacher-register.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;
  }
  .school-manage-button {
    background: url("../../assets/image/school-manage.png") no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;
  }
  .bottom-logo {
    width: 307px;
    height: 61px;
    background: url("../../assets/image/area-logo.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 88%;
  }
}
</style>
