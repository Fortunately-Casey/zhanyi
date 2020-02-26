<template>
  <div class="register">
    <div class="logo"></div>
    <div class="title">单位注册，请填写信息</div>
    <div class="register-box">
      <input type="text" placeholder="手机号码" v-model="phoneNumber" @blur="lostblur('phone')" />
      <input type="text" placeholder="单位名称" v-model="factoryName" @blur="lostblur" />
      <input type="text" placeholder="人数" v-model="peopleCount" @blur="lostblur" />
      <input type="password" placeholder="查询密码" v-model="searchPassword" @blur="lostblur" />
      <input type="password" placeholder="确认密码" v-model="confirmPassword" @blur="lostblur" />
    </div>
    <div class="register-button" @click="register">注册</div>
    <!-- <div class="company-name">
      <div class="nantong-chy"></div>
      <div>技术支持：南通市测绘院有限公司</div>
    </div> -->
    <div class="modal" v-if="isShowQrcode">
      <div class="punch-success">
        <div class="icon-close" @click="isShowQrcode = false"></div>
        <div class="red-message">注册成功！</div>
        <div class="qrcode">
          <Qrcode :value="val" size="200"></Qrcode>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
import { Toast } from "mint-ui";
import { saveEnterprise } from "@/api/register";
import { getURL, blur } from "@/common/tool/tool";
import Qrcode from "qrcode.vue";
export default {
  data() {
    return {
      phoneNumber: "",
      factoryName: "",
      peopleCount: "",
      searchPassword: "",
      confirmPassword: "",
      isShowQrcode: false,
      val: ""
    };
  },
  computed: {},
  created() {
    document.getElementsByTagName("title")[0].innerText = "战疫图·企业注册";
    this.shareList(
      "https://yqfk.ntschy.com/swnt.png",
      window.location.href,
      "关注南通疫情，判断您是否为密接者。数据来源：南通市疾病预防控制中心",
      "战疫图 • 南通（持续更新）"
    );
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
    register() {
      var vm = this;
      if (vm.searchPassword != vm.confirmPassword) {
        Toast({
          message: "两次输入的密码不一致！",
          iconClass: "icon icon-success"
        });
        return;
      }
      var params = {
        enterpriseName: vm.factoryName,
        employeeCount: vm.peopleCount,
        mobile: vm.phoneNumber,
        password: vm.searchPassword,
        createWxID: vm.$route.query.WXID
      };
      saveEnterprise(params).then(resp => {
        if (resp.data.success) {
          vm.val = `https://yqfk.ntschy.com/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%2Fapi%2Fweixin%2FgotoPeriodPlaceEnterprise%3FenterpriseID%3D${resp.data.data.enterpriseID}`;
          vm.isShowQrcode = true;
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    lostblur(value) {
      var vm = this;
      if (value === "phone") {
        vm.phoneReg(vm.phoneNumber);
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
  components: {
    Qrcode
  },
  watch: {}
};
</script>
<style lang="less">
.register {
  height: 100%;
  width: 100%;
  background: url("../../assets/image/bg.png") no-repeat;
  background-size: contain;
  position: relative;
  .logo {
    width: 132px;
    height: 107px;
    position: absolute;
    left: 50%;
    top: 6%;
    transform: translateX(-50%);
    background: url("../../assets/image/logo.png") no-repeat;
  }
  .title {
    position: absolute;
    left: 50px;
    top: 160px;
    font-size: 14px;
    font-weight: 500;
    color: #e75a4f;
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
  }
  .register-button {
    width: 250px;
    height: 45px;
    text-align: center;
    line-height: 45px;
    color: #fff; 
    background-color: #e75a4f;
    border-radius: 22.5px;
    position: absolute;
    left: 50%;
    bottom: 11%;
    transform: translateX(-50%);
    font-size: 15px;
    letter-spacing: 10px;
  }
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