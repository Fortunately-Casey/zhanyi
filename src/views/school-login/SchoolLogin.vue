<template>
  <div class="school-register">
    <div class="top-bg">
      <div class="top-box">
        <div class="ball"></div>
        <div class="book"></div>
        <div class="title"></div>
      </div>
    </div>
    <div class="title-message">欢迎您，请登录</div>
    <div class="login">
      <input
        type="text"
        placeholder="账号"
        v-model="phoneNumber"
        @blur="blur"
      />
      <input
        type="password"
        placeholder="输入密码"
        v-model="password"
        @blur="blur"
      />
    </div>
    <div class="login-button" @click="login">登录</div>
    <div class="bottom-logo"></div>
  </div>
</template>
<script>
import { blur } from "@/common/tool/tool";
import { loginEnterprise, loginManageEnterprise } from "@/api/schoolRegister";
import { Toast } from "mint-ui";
export default {
  data() {
    return {
      phoneNumber: "",
      password: ""
    };
  },
  created() {
    if (this.$route.query.type == "class") {
      this.phoneNumber = window.localStorage.getItem("classNumber");
      this.password = window.localStorage.getItem("classPassword");
    } else {
      this.phoneNumber = window.localStorage.getItem("schoolNumber");
      this.password = window.localStorage.getItem("schoolPassword");
    }
  },
  methods: {
    login() {
      var vm = this;
      if (!vm.phoneNumber || !vm.password) {
        Toast({
          message: "手机号跟密码不能为空！",
          iconClass: "icon icon-success"
        });
      }
      if (this.$route.query.type == "class") {
        this.loginEnterprise();
      } else {
        this.loginManageEnterprise();
      }
    },
    loginEnterprise() {
      var vm = this;
      loginEnterprise({
        mobile: vm.phoneNumber,
        password: vm.password
      }).then(resp => {
        if (resp.data.success) {
          window.localStorage.setItem("classNumber", vm.phoneNumber);
          window.localStorage.setItem("classPassword", vm.password);
          Toast({
            message: "登录成功！",
            iconClass: "icon icon-success"
          });
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    loginManageEnterprise() {
      var vm = this;
      loginManageEnterprise({
        mobile: vm.phoneNumber,
        password: vm.password
      }).then(resp => {
        if (resp.data.success) {
          window.localStorage.setItem("schoolNumber", vm.phoneNumber);
          window.localStorage.setItem("schoolPassword", vm.password);
          Toast({
            message: "登录成功！",
            iconClass: "icon icon-success"
          });
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
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
  .login {
    width: 65%;
    margin: 0 auto;
    input {
      width: 100%;
      font-size: 14px;
      margin-top: 30px;
    }
  }
  .login-button {
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
