<template>
  <div class="register">
    <div class="logo"></div>
    <div class="title" v-show="isRegister">欢迎您，请注册</div>
    <div class="title" v-show="!isRegister">欢迎您，请登录</div>
    <div class="register-box" v-if="isRegister">
      <input type="number" placeholder="手机号码" v-model="phoneNumber1" @blur="lostblur" />
      <input type="password" placeholder="密码" v-model="password1" @blur="lostblur" />
      <input type="password" placeholder="确认密码" v-model="password2" @blur="lostblur" />
      <span @click="isRegister = false">登录</span>
    </div>
    <div class="register-box" v-else>
      <input type="number" placeholder="手机号码" v-model="phoneNumber2" @blur="lostblur" />
      <input type="password" placeholder="密码" v-model="loginPassword" @blur="lostblur" />
      <span @click="isRegister = true">注册</span>
      <span style="margin-right:10px;float:left;color:red" @click="forgetPassWord">忘记密码</span>
    </div>
    <div class="register-button" v-if="isRegister" @click="register">注 册</div>
    <div class="login-button" v-if="!isRegister" @click="login">登 录</div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
import { Toast } from "mint-ui";
import { registerUser, userLogin } from "@/api/punchLogin";
import { getURL, blur } from "@/common/tool/tool";
import { MessageBox } from "mint-ui";
export default {
  data() {
    return {
      phoneNumber1: "",
      phoneNumber2: "",
      password1: "",
      password2: "",
      isRegister: true,
      loginPassword: ""
    };
  },
  computed: {},
  created() {
    document.getElementsByTagName("title")[0].innerText =
      "开发区企业员工健康申报系统";
    this.shareList(
      "https://yqfk.ntschy.com/swnt.png",
      window.location.href,
      "落实外防输入，推动精准复工。版权所有：南通市疾病预防控制中心开发区分中心",
      "开发区企业员工健康申报系统"
    );
    var phoneNumber = window.localStorage.getItem("userID");
    var password = window.localStorage.getItem("userPassword");
    if (phoneNumber) {
      this.isRegister = false;
      this.phoneNumber2 = phoneNumber;
    }
    if (password) {
      this.loginPassword = password;
    }
  },
  methods: {
    shareList(imgUrl, link, desc, title) {
      // var url = encodeURIComponent(link)
      var url = link;
      // 分享
      const signUrl = getURL("/weixin/getSignPackage");
      axios
        .post(signUrl, { url: url })
        .then(res => {
          res = res.data.data;
          wx.config({
            debug: false, // true:是调试模式,调试时候弹窗,会打印出日志
            appId: res.appId, // 微信appid
            timestamp: res.timestamp, // 时间戳
            nonceStr: res.nonceStr, // 随机字符串
            signature: res.signature, // 签名
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              "updateTimelineShareData",
              "updateAppMessageShareData"
            ]
          });
          wx.checkJsApi({
            jsApiList: [
              // 所有要调用的 API 都要加到这个列表中
              "updateTimelineShareData",
              "updateAppMessageShareData"
            ],
            success: function(res) {
              // alert("checkJsApi:success");
            }
          });

          wx.ready(function() {
            // 微信分享的数据
            var shareData = {
              imgUrl: imgUrl, // 分享显示的缩略图地址
              link: link, // 分享地址
              desc: desc, // 分享描述
              title: title, // 分享标题
              success: function() {
                // 分享成功可以做相应的数据处理
                // alert('分享成功')
                // alert('appId:' + res.appId)
                // alert('timestamp:' + res.timestamp)
                // alert('nonceStr:' + res.nonceStr)
                // alert('signature:' + res.signature)
                console.log("调用成功");
              },
              fail: function() {
                // alert('调用失败')
                console.log("失败");
              },
              complete: function() {
                // alert('调用结束')
                console.log("调用结束");
              }
            };
            wx.updateAppMessageShareData(shareData);
            wx.updateTimelineShareData(shareData);
          });
          wx.error(function(res) {
            // config信息验证失败会执行error函数，如签名过期导致验证失败，
            // 具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，
            // 对于SPA可以在这里更新签名。
            console.log(res);
            //alert('分享失败')
          });
        })
        .catch(err => {
          console.log(err);
        });
    },
    forgetPassWord() {
      Toast({
        message: "请联系企业管理员进行账号修改！",
        iconClass: "icon icon-success"
      });
    },
    login() {
      var vm = this;
      if (vm.loginPassword && vm.phoneNumber2) {
        var phoneReg = /^1[3456789]\d{9}$/;
        if (!phoneReg.test(Number(vm.phoneNumber2))) {
          Toast({
            message: "请输入合法手机号！",
            iconClass: "icon icon-success"
          });
          return;
        }
        userLogin({
          userId: vm.phoneNumber2,
          password: vm.loginPassword
        }).then(resp => {
          if (resp.data.success) {
            Toast({
              message: "登录成功",
              iconClass: "icon icon-success"
            });
            window.localStorage.setItem("userID", vm.phoneNumber2);
            window.localStorage.setItem("userPassword", vm.loginPassword);
            vm.$router.push({
              path: "/enterprisePunch",
              query: {
                enterpriseID: resp.data.data.enterpriseID,
                WxId: vm.phoneNumber2
              }
            });
          } else {
            Toast({
              message: resp.data.data,
              iconClass: "icon icon-success"
            });
          }
        });
      } else {
        Toast({
          message: "手机号和密码不能为空",
          iconClass: "icon icon-success"
        });
      }
    },
    register() {
      var vm = this;
      if (vm.password1 && vm.phoneNumber1 && vm.password2) {
        var phoneReg = /^1[3456789]\d{9}$/;
        if (!phoneReg.test(Number(vm.phoneNumber1))) {
          Toast({
            message: "请输入合法手机号！",
            iconClass: "icon icon-success"
          });
          return;
        }
        if (vm.password1 !== vm.password2) {
          Toast({
            message: "两次输入的密码不一致！",
            iconClass: "icon icon-success"
          });
          return;
        }
        MessageBox.confirm(`确认使用${vm.phoneNumber1}手机号注册吗?`, "账号注册").then(() => {
          registerUser({
            userId: vm.phoneNumber1,
            password: vm.password1,
            enterpriseID: vm.$route.query.enterpriseID
          }).then(resp => {
            if (resp.data.success) {
              Toast({
                message: "注册成功",
                iconClass: "icon icon-success"
              });
              vm.isRegister = false;
            } else {
              Toast({
                message: resp.data.data,
                iconClass: "icon icon-success"
              });
            }
          });
        });
      } else {
        Toast({
          message: "手机号和密码不能为空",
          iconClass: "icon icon-success"
        });
      }
    },
    lostblur(value) {
      var vm = this;
      if (value === "phone1") {
        vm.phoneReg(vm.phoneNumber1);
      } else if (value === "phone2") {
        vm.phoneReg(vm.phoneNumber2);
      }
      blur();
    },
    phoneReg(value) {
      var phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(Number(value))) {
        Toast({
          message: "请输入合法手机号！",
          iconClass: "icon icon-success"
        });
        return;
      }
    }
  },
  watch: {}
};
</script>
<style lang="less">
.register {
  height: 100%;
  width: 100%;
  background: url("../../assets/image/blue-bg.png") no-repeat;
  background-size: contain;
  position: relative;
  .logo {
    width: 132px;
    height: 107px;
    position: absolute;
    left: 50%;
    top: 6%;
    transform: translateX(-50%);
    background: url("../../assets/image/zhanyi-logo1.png") no-repeat;
  }
  .title {
    position: absolute;
    left: 50px;
    top: 160px;
    font-size: 14px;
    font-weight: 500;
    color: #2e55d6;
  }
  .register-box {
    position: absolute;
    left: 0;
    top: 190px;
    width: 100%;
    padding: 10px 50px;
    box-sizing: border-box;
    input {
      margin-top: 20px;
      width: 100%;
      border-bottom: 1px solid rgb(214, 211, 211);
      font-size: 13px;
    }
    span {
      font-size: 13px;
      margin-top: 15px;
      line-height: 15px;
      float: right;
    }
  }
  .register-button,
  .login-button {
    width: 120px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    color: #fff;
    background-color: #2e55d6;
    border-radius: 22.5px;
    position: absolute;
    top: 450px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 15px;
  }
  // .register-button {
  //   left: 50px;
  // }
  // .login-button {
  //   right: 50px;
  // }
  .nantong-chy {
    width: 223px;
    height: 29px;
    background: url("../../assets/image/jkzx-logo.png") no-repeat;
    background-size: 100% 100%;
    margin-bottom: 5px;
    // position: absolute;
    // left: 50%;
    // transform: translateX(-50%);
    // bottom: 10%;
  }
  .company-name {
    width: 220px;
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
    font-size: 12px;
    text-align: center;
    > div {
      color: gray;
    }
  }
  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(59, 58, 58, 0.623);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .punch-success {
      width: 75%;
      /* height: 20%; */
      background-color: #fff;
      border: 1px solid rgb(196, 193, 193);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 30%;
      transform: translateX(-50%);
      z-index: 999;
      .icon-close {
        width: 20px;
        height: 20px;
        background: url("../../assets/image/icon-close.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 10px;
        top: 10px;
      }
      .red-message {
        width: 100%;
        text-align: center;
        /* padding-left: 20px; */
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: red;
        margin-top: 15px;
      }
      .qrcode {
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 20px;
        text-align: center;
      }
    }
  }
}
</style>
