<template>
  <div class="register">
    <div class="logo"></div>
    <div class="title">管理员注册，请填写信息</div>
    <div class="register-box">
      <input
        type="text"
        placeholder="管理员手机号码"
        v-model="phoneNumber"
        @blur="lostblur('phone')"
      />
      <input
        type="text"
        placeholder="企业名称"
        v-model="factoryName"
        @blur="lostblur"
        @input="keywordSearch"
      />
      <div class="factory">
        <input
          type="text"
          placeholder="拟用工人数"
          v-model="peopleCount"
          @blur="lostblur('number')"
        />
        <div class="factory-list" v-if="isShowList">
          <div
            class="search-item"
            v-for="(item, index) in searchList"
            :key="index"
            @click="choseFactory(item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <input
        type="text"
        placeholder="企业隔离床位数"
        v-model="bedCount"
        @blur="lostblur('bed')"
      />
      <input
        type="password"
        placeholder="查询密码"
        v-model="searchPassword"
        @blur="lostblur"
      />
      <input
        type="password"
        placeholder="确认密码"
        v-model="confirmPassword"
        @blur="lostblur"
      />
    </div>
    <div class="register-button" @click="register">注册</div>
    <div class="modal" v-show="isShowQrcode">
      <div class="punch-success">
        <div class="icon-close" @click="isShowQrcode = false"></div>
        <div class="red-message">注册成功!（长按分享二维码）</div>
        <vue-qr
          :text="text"
          :logoScale="50"
          :size="250"
          :logoSrc="imageUrl"
        ></vue-qr>
      </div>
    </div>
  </div>
</template>
<script>
import wx from "weixin-js-sdk";
import axios from "axios";
import { Toast } from "mint-ui";
import { saveEnterprise, selectEnterpriseNameLib } from "@/api/register";
import { getURL, blur, debounce } from "@/common/tool/tool";
import VueQr from "vue-qr";
export default {
  data() {
    return {
      phoneNumber: "",
      factoryName: "",
      peopleCount: "",
      searchPassword: "",
      confirmPassword: "",
      isShowQrcode: false,
      imgUrl: "",
      searchList: [],
      isShowList: false,
      isWatch: true,
      bedCount: "",
      imageUrl: require("../../assets/image/zhanyi-logo.png"), //默认二维码中间图片
      text: ""
    };
  },
  computed: {},
  created() {
    var vm = this;
    document.getElementsByTagName("title")[0].innerText = "辅助复工 • 南通";
    this.shareList(
      "https://yqfk.ntschy.com/swnt.png",
      window.location.href,
      "落实外防输入，推动精准复工。版权所有：南通市疾病预防控制中心开发区站",
      "辅助复工 • 南通"
    );
    this.$watch(
      "factoryName",
      debounce((newValue, oldValue) => {
        if (!vm.isWatch) {
          return;
        }
        vm.search();
      }, 500)
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
        createWxID: vm.$route.query.WXID,
        isolatedBedCount: vm.bedCount
      };
      saveEnterprise(params).then(resp => {
        if (resp.data.success) {
          vm.isShowQrcode = true;
          vm.text = `https://yqfk.ntschy.com/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%2Fapi%2Fweixin%2FgotoPeriodPlaceEnterprise%3FenterpriseID%3D${resp.data.data.enterpriseID}`;
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
      } else if (value === "number") {
        vm.numberReg(vm.peopleCount);
      } else if (value === "bed") {
        vm.numberReg(vm.bedCount);
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
    },
    numberReg(value) {
      var numberReg = /^[0-9]*$/;
      if (!numberReg.test(Number(value))) {
        Toast({
          message: "请输入合法数量！",
          iconClass: "icon icon-success"
        });
        return;
      }
    },
    choseFactory(item) {
      this.isWatch = false;
      this.factoryName = item;
      this.isShowList = false;
    },
    keywordSearch() {
      this.isWatch = true;
      // this.isShowList = true;
    },
    search() {
      var vm = this;
      selectEnterpriseNameLib({
        enterpriseName: vm.factoryName
      }).then(resp => {
        vm.searchList = resp.data.data;
      });
    }
  },
  components: {
    VueQr
  },
  watch: {
    factoryName() {
      if (this.factoryName === "") {
        this.isShowList = false;
      }
    },
    searchList() {
      if (this.searchList.length === 0) {
        this.isShowList = false;
      } else {
        this.isShowList = true;
      }
    }
  }
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
      margin-top: 10px;
      height: 30px;
      width: 100%;
      border-bottom: 1px solid rgb(214, 211, 211);
      font-size: 13px;
    }
    .factory {
      width: 100%;
      position: relative;
      .factory-list {
        width: 100%;
        height: 200px;
        position: absolute;
        left: 0;
        top: 0;
        border: 1px solid rgb(190, 185, 185);
        overflow-y: auto;
        background-color: #fff;
        .search-item {
          height: 20px;
          left: 20px;
          font-size: 13px;
          padding-left: 4px;
        }
      }
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
    top: 600px;
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
      text-align: center;
      padding-bottom: 10px;
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
        width: 200px;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
