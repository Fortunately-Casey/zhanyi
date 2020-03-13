<template>
  <div class="school-register">
    <div class="top-bg">
      <div class="top-box">
        <div class="ball"></div>
        <div class="book"></div>
        <div class="title"></div>
      </div>
    </div>
    <div class="title-message">{{ isLogin ? "欢迎您，请登录" : "请填写注册信息" }}</div>
    <div class="login" v-if="isLogin">
      <input type="text" placeholder="手机号码" @blur="blur" />
      <input type="text" placeholder="输入密码" @blur="blur" />
    </div>
    <div class="register" v-else>
      <input type="text" placeholder="手机号码" @blur="blur" />
      <input type="text" placeholder="输入密码" @blur="blur" />
      <input type="text" placeholder="确认密码" @blur="blur" />
    </div>
    <div class="register-text" v-if="isLogin" @click="register">注册</div>
    <div class="login-button" v-if="isLogin">登录</div>
    <div class="register-button" v-else>注册</div>
    <div class="bottom-logo"></div>
  </div>
</template>
<script>
import { blur } from "@/common/tool/tool";
export default {
  data() {
    return {
      isLogin: true
    };
  },
  methods: {
    register() {
      this.isLogin = false;
    },
    blur() {
      blur();
    }
  }
};
</script>
<style lang="less" scoped>
.school-register {
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
  .title-message {
    padding-left: 60px;
    margin-top: 100px;
    font-size: 15px;
    color: #16d0a0;
    font-weight: bold;
  }
  .login,
  .register {
    width: 65%;
    margin: 0 auto;
    input {
      width: 100%;
      font-size: 14px;
      margin-top: 30px;
    }
  }
  .register-text {
    width: 65%;
    margin: 0 auto;
    font-size: 13px;
    text-align: right;
    color: #16d0a0;
    font-weight: bold;
    margin-top: 10px;
    letter-spacing: 15px;
  }
  .login-button,
  .register-button {
    margin: 0 auto;
    margin-top: 30px;
    width: 280px;
    height: 42px;
    background-image: linear-gradient(270deg, #ed665b 0%, #d6362e 100%);
    background: #16d0a0;
    border-radius: 21px;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.89px;
    text-align: center;
    line-height: 42px;
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
