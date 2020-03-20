<template>
  <div class="register">
    <div class="logo"></div>
    <div class="search-button" @click="toSearchMap"></div>
    <div class="health-button" @click="toWeiXin"></div>
    <div class="company-name">
      <div class="nantong-chy"></div>
      <div>技术支持：南通市测绘院有限公司</div>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
import { getURL } from "@/common/tool/tool";
import { weixinTransform } from "@/common/data.js";
export default {
  data() {
    return {};
  },
  computed: {},
  created() {
    document.getElementsByTagName("title")[0].innerText = "战疫图 • 南通";
    this.shareList(
      "https://yqfk.ntschy.com:10000/swnt.png",
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
    toSearchMap() {
      this.$router.push({
        path: "/homeMap"
      });
    },
    toWeiXin() {
      window.location.href = `${weixinTransform}/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%3A10000%2Fapi%2Fweixin%2FgotoPeriodPlace`;
    },
    toRegister() {
      window.location.href = `${weixinTransform}/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%3A10000%2Fapi%2Fweixin%2FgotoPeriodPlaceEnterpriseRegister`;
    },
    toQuery() {
      this.$router.push({
        path: "/login"
      });
    }
  },
  components: {},
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
  .search-button,
  .health-button,
  .registration-button,
  .infoManage-button {
    width: 280px;
    height: 70px;
  }
  .search-button {
    background: url("../../assets/image/searchButton.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 200px;
    transform: translateX(-50%);
  }
  .health-button {
    background: url("../../assets/image/healthButton.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 290px;
    transform: translateX(-50%);
  }
  .registration-button {
    background: url("../../assets/image/registration.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 200px;
    transform: translateX(-50%);
  }
  .infoManage-button {
    background: url("../../assets/image/infoManage.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    top: 290px;
    transform: translateX(-50%);
  }
  .nantong-chy {
    width: 230px;
    height: 29px;
    background: url("../../assets/image/main-logo.png") no-repeat;
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
}
</style>
