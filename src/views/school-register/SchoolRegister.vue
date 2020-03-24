<template>
  <div class="school-register" :style="{ height: bodyHeight + 'px' }">
    <div class="top-bg">
      <div class="top-box">
        <div class="ball"></div>
        <div class="book"></div>
        <div class="title"></div>
      </div>
    </div>
    <div class="title-message">
      {{ isLogin ? "欢迎您，请登录" : "请填写注册信息" }}
    </div>
    <div class="login" v-if="isLogin">
      <input
        type="number"
        v-model="loginPhone"
        placeholder="手机号码"
        pattern="[0-9]*"
        @blur="blur"
      />
      <input
        type="password"
        v-model="loginPassword"
        placeholder="输入密码"
        @blur="blur"
      />
    </div>
    <div class="register" v-else>
      <input
        type="number"
        v-model="registerPhone"
        placeholder="手机号码"
        pattern="[0-9]*"
        @blur="blur"
      />
      <input
        type="password"
        v-model="registerPassword"
        placeholder="输入密码"
        @blur="blur"
      />
      <input
        type="password"
        v-model="confirmPassword"
        placeholder="确认密码"
        @blur="blur"
      />
    </div>
    <div class="register-text" v-if="isLogin" @click="register">注册</div>
    <div class="register-text" v-if="!isLogin" @click="login">登录</div>
    <div class="login-button" v-if="isLogin" @click="schoolLogin">登录</div>
    <div class="register-button" v-else @click="schoolRegister">注册</div>
    <div class="bottom-logo"></div>
  </div>
</template>
<script>
import { blur } from "@/common/tool/tool";
import { Toast, Indicator, MessageBox } from "mint-ui";
import {
  registerSysUser,
  sysUserLogin,
  teacherLogin
} from "@/api/schoolRegister.js";
export default {
  data() {
    return {
      isLogin: true,
      loginPhone: "",
      loginPassword: "",
      registerPhone: "",
      registerPassword: "",
      confirmPassword: "",
      bodyHeight: ""
    };
  },
  created() {
    if (this.$route.query.type === "teacher") {
      var teacherNumber = window.localStorage.getItem("teacherNumber");
      var teacherPassword = window.localStorage.getItem("teacherPassword");
      if (teacherNumber) {
        this.loginPhone = teacherNumber;
      }
      if (teacherPassword) {
        this.loginPassword = teacherPassword;
      }
    } else {
      var parentNumber = window.localStorage.getItem("parentNumber");
      var parentPassword = window.localStorage.getItem("parentPassword");
      if (parentNumber) {
        this.loginPhone = parentNumber;
      }
      if (parentPassword) {
        this.loginPassword = parentPassword;
      }
    }
  },
  mounted() {
    this.bodyHeight = document.documentElement.clientHeight;
  },
  methods: {
    register() {
      this.isLogin = false;
    },
    login() {
      this.isLogin = true;
    },
    schoolLogin() {
      if (this.$route.query.type === "teacher") {
        this.teacherLogin();
      } else {
        this.parentLogin();
      }
    },
    //教师登录
    teacherLogin() {
      var vm = this;
      if (!vm.loginPhone || !vm.loginPassword) {
        Toast({
          message: "手机号码跟密码不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }
      var phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(Number(vm.loginPhone))) {
        Toast({
          message: "请输入合法手机号！",
          iconClass: "icon icon-success"
        });
        return;
      }
      Indicator.open();
      teacherLogin({
        userID: vm.loginPhone,
        password: vm.loginPassword
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          Toast({
            message: "登录成功！",
            iconClass: "icon icon-success"
          });
          window.localStorage.setItem("teacherNumber", vm.loginPhone);
          window.localStorage.setItem("teacherPassword", vm.loginPassword);
          vm.$router.push({
            path: "teacherInfo",
            query: {
              userID: resp.data.data.userID
            }
          });
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    //家长登录
    parentLogin() {
      var vm = this;
      if (!vm.loginPhone || !vm.loginPassword) {
        Toast({
          message: "手机号码跟密码不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }
      var phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(Number(vm.loginPhone))) {
        Toast({
          message: "请输入合法手机号！",
          iconClass: "icon icon-success"
        });
        return;
      }
      sysUserLogin({
        userID: vm.loginPhone,
        password: vm.loginPassword
      }).then(resp => {
        if (resp.data.success) {
          Toast({
            message: "登录成功！",
            iconClass: "icon icon-success"
          });
          window.localStorage.setItem("parentNumber", vm.loginPhone);
          window.localStorage.setItem("parentPassword", vm.loginPassword);
          vm.$router.push({
            path: "childrenInfo",
            query: {
              userID: resp.data.data.userID
            }
          });
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    schoolRegister() {
      MessageBox.confirm(
        `确定以${this.registerPhone}手机号注册么?`,
        "账号注册"
      ).then(() => {
        var vm = this;
        if (!vm.registerPhone || !vm.registerPassword || !vm.confirmPassword) {
          Toast({
            message: "手机号码跟密码不能为空！",
            iconClass: "icon icon-success"
          });
          return;
        }
        if (vm.registerPassword != vm.confirmPassword) {
          Toast({
            message: "两次输入的密码不一致！",
            iconClass: "icon icon-success"
          });
          return;
        }
        var phoneReg = /^1[3456789]\d{9}$/;
        if (!phoneReg.test(Number(vm.registerPhone))) {
          Toast({
            message: "请输入合法手机号！",
            iconClass: "icon icon-success"
          });
          return;
        }
        registerSysUser({
          userID: vm.registerPhone,
          password: vm.registerPassword
        }).then(resp => {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
          if (resp.data.success) {
            vm.isLogin = true;
          }
        });
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
        width: 140px;
        height: 58px;
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
  .login-button {
    margin-bottom: 130px;
  }
  .register-button {
    margin-bottom: 85px;
  }
  .bottom-logo {
    width: 307px;
    height: 61px;
    background: url("../../assets/image/area-logo.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    // margin-top: 130px;
    // position: absolute;
    // left: 50%;
    // transform: translateX(-50%);
    // top: 88%;
  }
}
</style>
