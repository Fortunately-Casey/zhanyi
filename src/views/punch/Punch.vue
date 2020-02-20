<template>
  <div class="punch-content">
    <div class="punch" ref="punch" v-show="!isShowMap">
      <div class="header">
        健康分析
        <div class="back" @click="goBack">
          首页
          <div class="back-icon"></div>
        </div>
      </div>
      <div class="top">
        <div class="item">
          <div class="name">日期</div>
          <div class="value">
            <div class="date" @click="openPicker">{{returnDate(dateValue)}}</div>
          </div>
        </div>
        <div class="item">
          <div class="name">身份证号</div>
          <div class="value">
            <input type="text" v-model="idCard" @blur="lostblur('usernumber')" />
          </div>
        </div>
        <div class="item">
          <div class="name">电话号码</div>
          <div class="value">
            <input type="text" v-model="phoneNumber" @blur="lostblur('phone')" />
          </div>
        </div>
        <!-- <div class="item">
          <div class="name">短信验证</div>
          <div class="value">
            <input
              type="text"
              style="width:100px"
              v-model="messageNumber"
              placeholder="请输入验证码"
              @blur="lostblur('phone')"
            />
            <span class="getVerification" @click="getVerification" v-if="isShowGetMessage">获取验证码</span>
            <span class="timeValue" v-else>{{timer}}</span>
          </div>
        </div>-->
      </div>
      <div class="first">
        <div class="item">
          <div class="cross-address">
            1. 途经地点
            <div class="local-icon" @click="showMap"></div>
          </div>
        </div>
        <div class="item">
          <div class="address">{{addressValue}}</div>
        </div>
      </div>
      <div class="second">
        <div class="item">
          <div class="name">2. 途经时间</div>
          <div class="value">
            <div class="date" @click="choseTime">{{timeValue}}</div>
          </div>
        </div>
      </div>
      <div class="third">
        <div class="item">
          <div class="name">3. 体温读数</div>
          <div class="value">
            <input
              type="text"
              oninput="if (value.length>4) value=value.slice(0,4)"
              placeholder="输入体温"
              v-model="temperature"
              @blur="lostblur('temp')"
            />
          </div>
        </div>
      </div>
      <div class="fourth">
        <div class="item">
          <div class="name">
            <div class="health-title">4. 健康症状</div>
          </div>
        </div>
        <div class="item">
          <div class="name">
            <div class="health-item" @click="choseHealth(0)">
              健康
              <div class="chosed-icon" v-if="isChosedHealth"></div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="name">
            <div class="health-item" @click="choseHealth(1)">
              咳嗽
              <div class="chosed-icon" v-if="isChosedCough"></div>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="name">
            <div class="health-item" @click="choseHealth(2)">
              发热
              <div class="chosed-icon" v-if="isChosedHot"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="fifth">
        <div class="item">
          <div class="name">
            <div class="cross-title">
              5. 14天内是否经过疫区？
              <span>(湖北省、武汉市、温州市等)</span>
            </div>
          </div>
        </div>
        <div class="item" v-for="(item,index) in crossList" :key="index" @click="choseCross(index)">
          <div class="name">
            <div class="cross-item">
              {{item.value}}
              <div class="chosed-icon" v-if="chosedCrossIndex === index?true:false"></div>
            </div>
          </div>
        </div>
      </div>-->
      <div class="fifth">
        <div class="item" @click="showArea">
          <div class="name">
            <div class="cross-title">
              5. 您来自的地区
              <div class="chosedValue" v-if="isShowSelectValue">
                <div class="value">{{chosedValues.province}}</div>
                <div class="value">{{chosedValues.city}}</div>
                <div class="value">{{chosedValues.area}}</div>
              </div>
            </div>

            <div class="icon-cross" v-if="isShowCrossIcon">></div>
          </div>
        </div>
        <div class="item">
          <input
            type="text"
            v-model="addressDetail"
            placeholder="详细地址：道路、门牌号、楼栋号、单元号"
            class="addressDetail"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="look-button" @click="searchReport">查询报告</div>
        <div class="punch-button" @click="punchTo">打卡</div>
      </div>
      <mt-datetime-picker
        ref="datepicker"
        v-model="pickerValue"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        :endDate="new Date()"
        :startDate="new Date('2020/1/1')"
        @confirm="confirmDate"
        @cancel="closeDate"
      ></mt-datetime-picker>
      <mt-datetime-picker
        ref="timepicker"
        type="time"
        v-model="timepicker"
        @confirm="confirmTime"
        @cancel="closeTime"
      ></mt-datetime-picker>
      <!-- <div class="map" v-show="isShowMap">

      </div>-->
      <div class="modal" v-if="isShowSuccess">
        <div class="punch-success">
          <div class="icon-close" @click="closeSuccess"></div>
          <div class="red-message">恭喜您，打卡成功!</div>
          <div class="message">
            勤打卡有助于您获取更加精准的健康分析结果
            <span>(此前有途经点未打卡，可补打哦！)</span>
          </div>
        </div>
      </div>
      <div class="modal" v-if="isShowReport">
        <div class="search-report">
          <div class="icon-close" @click="closeReport"></div>
          <div class="result">查看结果</div>
          <div v-if="periodPlace14">
            <div class="report-list">
              <div
                class="health"
                v-if="!this.epidemicArea&&this.reportList.length === 0?true:false"
              >
                <div class="health-icon"></div>依据现有确诊人员数据及您的打卡信息，您非密切接触人员
              </div>
              <div class="bad" v-if="epidemicArea">
                <div class="bad-icon"></div>您14天内经过疫区
              </div>
              <div class="bad" v-for="(item,index) in reportList" :key="index">
                <div class="bad-icon"></div>
                {{item.date}}{{item.time}}您经过{{item.placeName}}，5天内确诊者也在此逗留
              </div>
            </div>
          </div>
          <div class="tips" v-if="!periodPlace14">
            <div class="tips-icon"></div>温馨提示:您14天内并未进行打卡，无法分析数据
          </div>
          <div class="tips" v-else>
            <div class="tips-icon"></div>
            温馨提示:{{epidemicArea||reportList.length > 0?"需在家隔离14天，如有症状请及时就医":"减少外出，加强防护，关注体温"}}
          </div>
          <div class="function" @click="isShowFunction = !isShowFunction">
            <span class="left">分析方法</span>
            <div class="plus" v-if="!isShowFunction"></div>
            <div class="minus" v-else></div>
            <span class="right">（点击查看详情）</span>
            <div class="function-message" v-if="isShowFunction">依据南通市确诊人员轨迹，及您前14天打卡数据进行对比分析</div>
          </div>
          <div class="bottom-message">确诊轨迹来源于南通市疾病预防控制中心</div>
        </div>
      </div>
      <div class="modal" v-if="isShowAddressList">
        <div class="city-list">
          <div class="city-top">
            选择地区
            <div class="icon-close" @click="closeAddress"></div>
          </div>
          <div class="select-province" v-if="isShowProvinceList">
            <div class="select-title">选择省份/地区</div>
            <div v-for="(item,index) in provinceList" :key="index">
              <div
                class="province"
                v-for="(v,i) in item.items"
                :key="i"
                @click="choseProvince(v)"
              >
                <div class="label">{{i === 0?v.key:''}}</div>
                <div class="name">{{v.name}}</div>
              </div>
            </div>
          </div>
          <div class="selected" v-if="!isShowProvinceList">
            <span class="seleted-province" @click="selectProvince">{{chosedProvinceName}}</span>
            <span class="selectCityButton" v-if="!chosedCityName">选择城市</span>
            <span class="selectedCityButton" v-else @click="selectCity">{{chosedCityName}}</span>
            <span class="selectCityButton" v-if="isShowAreaSelect">选择区域</span>
          </div>
          <div class="select-city" v-if="isShowCityList">
            <div v-for="(item,index) in cityList" :key="index">
              <div
                class="city"
                v-for="(v,i) in item.items"
                :key="i"
                @click="choseCity(v)"
                v-if="v.name !== '直辖县'"
              >
                <div class="label">{{i === 0?v.key:''}}</div>
                <div class="name">{{v.short_name + '市'}}</div>
              </div>
            </div>
          </div>
          <div class="select-area" v-if="isShowAreaList">
            <div v-for="(item,index) in areaList" :key="index">
              <div
                class="area"
                v-for="(v,i) in item.items"
                :key="i"
                @click="choseArea(v)"
                v-if="v.name !== '市辖区'"
              >
                <div class="label">{{i === 0?v.key:''}}</div>
                <div class="name">{{v.name}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="click-box" v-if="isShowMap">
      <div class="map-title">
        <input type="text" v-model="clickValue" placeholder="图中没有想找的点?手动输入添加地点" @blur="lostblur" />
      </div>
      <div class="confirm" @click="confirmAddress">确 认</div>
    </div>
    <div class="search-box" v-show="isShowMap">
      <div class="icon"></div>
      <input
        type="text"
        placeholder="输入地点查询或点击地图自动识别"
        @input="keywordSearch"
        v-model="keyword"
        @blur="lostblur"
      />
      <div class="search-list" v-if="isShowSearchList">
        <div
          class="item"
          v-for="(item,index) in searchList"
          :key="index"
          @click="sendTo(item)"
        >{{item.name}}</div>
      </div>
    </div>
    <m-map @clickAddress="clickAddress"></m-map>
  </div>
</template>
<script>
import { Todate, blur, Totime } from "@/common/tool/tool.js";
import locIcon from "@/assets/image/blue-loc1.png";
import MMap from "../map/Map.vue";
import { Toast } from "mint-ui";
import {
  getHistoryIDCardMobile,
  savePeriodPlace,
  healthAnalysis
} from "@/api/punch.js";
import wx from "weixin-js-sdk";
import axios from "axios";
import { getURL } from "@/common/tool/tool";
import AddressName from "@/common/tool/tool";
import { getCityList, getProvinceList } from "@/api/aliApi";
export default {
  data() {
    return {
      weixin: "",
      date: "2020/02/11",
      healthList: [
        {
          value: "健康"
        },
        {
          value: "咳嗽"
        },
        {
          value: "发热"
        }
      ],
      crossList: [
        {
          value: "否"
        },
        {
          value: "是"
        }
      ],
      pickerValue: new Date(),
      timepicker: "",
      idCard: "",
      phoneNumber: "",
      dateValue: new Date(),
      timeValue: this.returnTime(new Date()),
      temperature: "",
      chosedHealthIndex: 0,
      chosedCrossIndex: 0,
      isChosedHealth: true,
      isChosedHot: false,
      isChosedCough: false,
      isShowMap: false,
      localPoint: "",
      clickValue: "",
      addressValue: "",
      bdx: "",
      bdy: "",
      isShowSuccess: false,
      isShowReport: false,
      epidemicArea: "",
      isShowFunction: false,
      reportList: [],
      periodPlace14: "",
      keyword: "",
      searchList: [],
      handler: function(e) {
        e.preventDefault();
      },
      isShowSearchList: false,
      messageNumber: "",
      isShowGetMessage: true,
      timer: "",
      isShowAreaList: false,
      isShowProvinceList: true,
      chosedProvinceName: "",
      isShowCityList: false,
      chosedCityName: "",
      isShowAreaList: false,
      isShowAreaSelect: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      isShowCrossIcon: true,
      isShowSelectValue: false,
      isShowAddressList: false,
      chosedValues: {
        province: "",
        city: "",
        area: ""
      },
      addressDetail: ""
    };
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "战疫图·南通";
    this.shareList(
      "https://yqfk.ntschy.com/swnt.png",
      window.location.href,
      "关注南通疫情，判断您是否为密接者。数据来源：南通市疾病预防控制中心",
      "战疫图 • 南通（持续更新）"
    );
    var wxid = window.localStorage.getItem("WXID");
    if (wxid) {
      this.weixin = wxid;
    } else {
      window.location.href = "https://yqfk.ntschy.com/main";
    }

    this.getHistoryIDCardMobile();
    setTimeout(() => {
      this.getLocalAddress();
    }, 1000);
    //获取省会列表
    this.getProvinceList();
  },
  mounted() {},
  methods: {
    shareList(imgUrl, link, desc, title) {
      // var url = encodeURIComponent(link)
      var url = link;
      // 分享
      const signUrl = getURL("/weixin/getSignPackage");
      axios
        .post(signUrl, {
          url: url
        })
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
    // 获取是否有打卡记录
    getHistoryIDCardMobile() {
      var vm = this;
      getHistoryIDCardMobile({
        wxID: vm.weixin
      }).then(resp => {
        if (resp.data.data.length > 0) {
          vm.idCard = resp.data.data[0].idCard;
          vm.phoneNumber = resp.data.data[0].mobile;
        }
      });
    },
    // 打卡
    punchTo() {
      var vm = this;
      if (!vm.temperature) {
        Toast({
          message: "请输入体温读数！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.idCard) {
        Toast({
          message: "请输入身份证号！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.phoneNumber) {
        Toast({
          message: "请输入电话号码！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.addressValue) {
        Toast({
          message: "请选取途径地点！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.isChosedHealth && !vm.isChosedCough && !vm.isChosedHot) {
        Toast({
          message: "请填写健康症状!",
          iconClass: "icon icon-success"
        });
        return;
      }
      var params = {
        wxID: vm.weixin,
        idCard: vm.idCard,
        mobile: vm.phoneNumber,
        placeName: vm.addressValue,
        bdx: vm.bdx.toString(),
        bdy: vm.bdy.toString(),
        stime: vm.returnDate(vm.dateValue) + " " + vm.timeValue,
        healthy1: vm.isChosedHealth,
        healthy2: vm.isChosedCough,
        healthy3: vm.isChosedHot,
        temp: vm.temperature,
        epidemicArea: vm.chosedCrossIndex === 0 ? false : true
      };
      savePeriodPlace(params).then(resp => {
        if (resp.data.success) {
          vm.closeTouch();
          vm.isShowSuccess = true;
        } else {
          Toast({
            message: "打卡失败!",
            iconClass: "icon icon-success"
          });
        }
      });
    },
    // 健康报告
    searchReport() {
      var vm = this;
      if (!vm.idCard) {
        Toast({
          message: "当前账号并未打卡!",
          iconClass: "icon icon-success"
        });
        return;
      }
      healthAnalysis({
        idCard: vm.idCard
        // idCard:"320683199002280019"
      }).then(resp => {
        if (!resp.data.success) {
          Toast({
            message: "查询失败!",
            iconClass: "icon icon-success"
          });
          vm.isShowReport = false;
        } else {
          vm.isShowReport = true;
          vm.epidemicArea = resp.data.data.epidemicArea;
          vm.periodPlace14 = resp.data.data.periodPlace14;
          if (resp.data.data.healthAnalysisList.length > 0) {
            var arr = [];
            resp.data.data.healthAnalysisList.map(v => {
              var date = v.selfPeriodPlaceTime.split(" ")[0];
              var time = v.selfPeriodPlaceTime.split(" ")[1];
              date = vm.changeStr(date, 4, "年");
              date = vm.changeStr(date, 7, "月");
              date = date + "日";
              arr.push({
                placeName: v.selfPlaceName,
                time: time.substring(0, time.length - 5),
                date: date
              });
            });
            vm.reportList = arr;
          } else {
            vm.reportList = [];
          }
        }
      });
    },
    // 获取短信验证码
    getVerification() {
      this.isShowGetMessage = false;
      this.timer = 60;
      var timer = setInterval(() => {
        if (this.timer === 0) {
          clearInterval(timer);
          this.isShowGetMessage = true;
        }
        this.timer--;
      }, 1000);
    },
    openPicker() {
      this.$refs.datepicker.open();
      this.closeTouch();
    },
    closeDate() {
      this.openTouch();
    },
    choseTime() {
      this.$refs.timepicker.open();
      this.closeTouch();
    },
    closeTime() {
      this.openTouch();
    },
    returnDate(value) {
      return Todate(value);
    },
    returnTime(value) {
      return Totime(value);
    },
    confirmDate(value) {
      this.dateValue = value;
      this.openTouch();
    },
    confirmTime(value) {
      this.timeValue = value;
      this.openTouch();
    },
    choseCross(index) {
      this.chosedCrossIndex = index;
    },
    choseHealth(index) {
      if (index === 0) {
        this.isChosedHealth = true;
        this.isChosedCough = false;
        this.isChosedHot = false;
      }
      if (index === 1) {
        this.isChosedCough = !this.isChosedCough;
        this.isChosedHealth = false;
      }
      if (index === 2) {
        this.isChosedHot = !this.isChosedHot;
        this.isChosedHealth = false;
      }
    },
    closeSuccess() {
      this.isShowSuccess = !this.isShowSuccess;
      this.openTouch();
    },
    closeReport() {
      this.isShowReport = !this.isShowReport;
      this.openTouch();
    },
    showMap() {
      window.baseMap.clearOverlays();
      this.location();
      this.isShowMap = true;
      // this.$refs.punch.style.overflowY = "hidden";
    },
    location() {
      var vm = this;
      var geolocation = new BMap.Geolocation();
      window.baseMap.removeOverlay(vm.localPoint);
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
              anchor: new BMap.Size(5, 5),
              imageSize: new BMap.Size(40, 40)
            });
            var mk = new BMap.Marker(r.point, {
              icon: locPoint
            });
            vm.localPoint = mk;
            window.baseMap.addOverlay(mk);
            window.baseMap.setZoom(17);
            window.baseMap.panTo(r.point);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        {
          enableHighAccuracy: true
        }
      );
    },
    getLocalAddress() {
      var vm = this;
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var gc = new BMap.Geocoder();
            gc.getLocation(r.point, rs => {
              vm.addressValue = rs.surroundingPois[0].title;
              vm.bdx = rs.surroundingPois[0].point.lng;
              vm.bdy = rs.surroundingPois[0].point.lat;
            });
          } else {
            alert("failed" + this.getStatus());
          }
        },
        {
          enableHighAccuracy: true
        }
      );
    },
    lostblur(value) {
      var vm = this;
      if (value === "phone") {
        vm.phoneReg(vm.phoneNumber);
      } else if (value === "usernumber") {
        vm.userNumberReg(vm.idCard);
      } else if (value === "temp") {
        vm.tempReg(vm.temperature);
      }
      blur();
    },
    clickAddress(address) {
      console.log(address);
      this.clickValue = address.address;
      this.bdx = address.bdx;
      this.bdy = address.bdy;
    },
    confirmAddress() {
      if (this.clickValue === "") {
        Toast({
          message: "请选择兴趣点!",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (this.clickValue.length > 15) {
        Toast({
          message: "兴趣点名称不能超过15个字符!",
          iconClass: "icon icon-success"
        });
        return;
      }
      // this.$refs.punch.style.overflowY = "auto";
      this.addressValue = this.clickValue;
      this.isShowMap = false;
      this.clickValue = "";
    },
    goBack() {
      this.$router.push({
        path: "/main"
      });
    },
    changeStr(str, index, changeStr) {
      return (
        str.substr(0, index) + changeStr + str.substr(index + changeStr.length)
      );
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
    tempReg(value) {
      var tempReg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if (!tempReg.test(Number(value))) {
        Toast({
          message: "请输入合法体温！",
          iconClass: "icon icon-success"
        });
        return;
      }
    },
    userNumberReg(value) {
      var userNumberReg =
        // /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!userNumberReg.test(value)) {
        Toast({
          message: "请输入合法身份证号！",
          iconClass: "icon icon-success"
        });
        return;
      }
    },
    closeTouch() {
      document
        .getElementsByTagName("body")[0]
        .addEventListener("touchmove", this.handler, {
          passive: false
        }); //阻止默认事件
    },
    openTouch() {
      document
        .getElementsByTagName("body")[0]
        .removeEventListener("touchmove", this.handler, {
          passive: false
        }); //打开默认事件
    },
    // isShowHealthy(){
    //     alert("2222")
    //     console.log(this.epidemicArea,this.reportList.length);
    //     if() {
    //         return true;
    //     }else {
    //         return false;
    //     }
    // },
    keywordSearch() {
      var vm = this;
      var options = {
        onSearchComplete: function(results) {
          // 判断状态是否正确
          if (local.getStatus() == BMAP_STATUS_SUCCESS) {
            var s = [];
            for (var i = 0; i < results.getCurrentNumPois(); i++) {
              s.push({
                name: results.getPoi(i).title,
                address: results.getPoi(i).address,
                lng: results.getPoi(i).point.lng,
                lat: results.getPoi(i).point.lat
              });
            }
            // console.log(s);
            vm.searchList = s;
            // document.getElementById("r-result").innerHTML = s.join("<br/>");
          }
        }
      };
      var local = new BMap.LocalSearch(window.baseMap, options);
      local.search(this.keyword);
      vm.isShowSearchList = true;
    },
    sendTo(item) {
      window.baseMap.clearOverlays();
      var vm = this;
      vm.keyword = item.name;
      vm.clickValue = item.name;
      vm.isShowSearchList = false;
      vm.bdx = item.lng;
      vm.bdy = item.lat;
      var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
        anchor: new BMap.Size(20, 32),
        imageSize: new BMap.Size(40, 40)
      });
      var point = new BMap.Point(item.lng, item.lat);
      var mk = new BMap.Marker(point, {
        icon: locPoint
      });
      window.baseMap.addOverlay(mk);
      window.baseMap.panTo(point);
    },
    showArea() {
      this.isShowAddressList = true;
      this.isShowProvinceList = true;
      this.isShowCityList = false;
      this.isShowAreaList = false;
      this.chosedProvinceName = "";
      this.chosedCityName = "";
      this.isShowAreaSelect = false;
    },
    getProvinceList() {
      var vm = this;
      getProvinceList({
        level: 0,
        page: 1,
        size: 50
      }).then(resp => {
        if (resp.status === 200) {
          vm.provinceList = vm._normalizeCity(resp.data.data);
        }
      });
    },
    // 选择省份
    choseProvince(item) {
      var vm = this;
      vm.chosedProvinceName = item.name;
      getCityList({
        parent_id: item.id
      }).then(resp => {
        if (resp.status === 200) {
          vm.cityList = vm._normalizeCity(resp.data.data);
        }
      });
      this.isShowProvinceList = false;
      this.isShowCityList = true;
    },
    // 选择城市
    choseCity(item) {
      this.chosedCityName = item.short_name + "市";
      var vm = this;
      getCityList({
        parent_id: item.id
      }).then(resp => {
        if (resp.status === 200) {
          vm.areaList = vm._normalizeCity(resp.data.data);
        }
      });
      this.isShowProvinceList = false;
      this.isShowCityList = false;
      this.isShowAreaList = true;
      this.isShowAreaSelect = true;
    },
    choseArea(item) {
      this.chosedAreaName = item.name;
      this.chosedValues.province = this.chosedProvinceName;
      this.chosedValues.city = this.chosedCityName;
      this.chosedValues.area = item.name;
      this.isShowSelectValue = true;
      this.isShowAddressList = false;
      this.isShowCrossIcon = false;
    },
    closeAddress() {
      this.isShowAddressList = false;
    },
    selectProvince() {
      this.isShowProvinceList = true;
      this.isShowCityList = false;
      this.isShowAreaList = false;
      this.chosedCityName = "";
      this.isShowAreaSelect = false;
    },
    selectCity() {
      this.isShowCityList = true;
      this.isShowProvinceList = false;
      this.isShowAreaList = false;
      this.chosedCityName = "";
      this.isShowAreaSelect = false;
    },
    // 城市字母排序处理
    _normalizeCity(list) {
      let map = {};
      list.forEach((item, index) => {
        const key = item.pinyin.substr(0,1);
        if(!map[key]) {
          map[key] = {
            title:key,
            items:[]
          }
        }
        map[key].items.push(new AddressName({
          id:item.id,
          name:item.name,
          short_name:item.short_name,
          key:key
        }))
      });
      let ret = [];
      for(let key in map) {
        ret.push(map[key])
      }
      ret.sort((a,b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return ret;
    }
  },
  watch: {
    keyword() {
      if (this.keyword === "") {
        this.isShowSearchList = false;
      }
    }
  },
  components: {
    MMap
  }
};
</script>

<style lang="less" scoped>
.punch-content {
  height: 100%;
  position: relative;
  .punch {
    width: 100%;
    height: 100%;
    background-color: #eee;
    position: fixed;
    overflow-y: auto;
    left: 0;
    top: 0;
    z-index: 999;
    .map {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 50%;
      top: 0;
      z-index: 999;
      transform: translateX(-50%);
      box-sizing: border-box;
      border: 1px solid #eee;
    }
    .header {
      height: 40px;
      background-color: #d22d2d;
      color: #fff;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      position: relative;

      .back {
        width: 60px;
        height: 30px;
        line-height: 30px;
        font-size: 14px;
        position: absolute;
        left: 15px;
        top: 50%;
        transform: translateY(-50%);

        .back-icon {
          width: 8px;
          height: 13px;
          background: url("../../assets/image/back-icon.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }

    .top {
      background-color: #fff;

      .item {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f2f2f2;
        font-weight: bold;
        display: flex;

        .name {
          font-size: 14px;
          width: 35%;
          padding-left: 20px;
          box-sizing: border-box;
          text-align: left;
          letter-spacing: 2px;
        }

        .value {
          width: 65%;
          display: flex;
          padding-right: 15px;
          justify-content: flex-end;
          font-size: 14px;

          input {
            transform: translateY(1px);
            text-align: right;
            text-align: end;
            font-size: 14px;
          }
          .getVerification {
            color: #d22d2d;
            font-weight: 200;
            padding-left: 5px;
            // line-height: 40px;
            padding-top: 2px;
            width: 75px;
            text-align: center;
          }
          .timeValue {
            width: 75px;
            text-align: center;
            color: gray;
            font-weight: 200;
            padding-left: 5px;
            // line-height: 40px;
            padding-top: 2px;
          }
        }
      }

      .item:first-child {
        .name {
          letter-spacing: 28px;
        }
      }
    }

    .first,
    .fourth,
    .fifth {
      margin-top: 15px;
      background-color: #fff;

      .item {
        min-height: 40px;
        line-height: 40px;
        padding: 0 20px;
        font-weight: bold;
        font-size: 14px;
        .name {
          position: relative;
        }
        .cross-address {
          border-bottom: 1px solid #efefef;
          position: relative;

          .local-icon {
            width: 20px;
            height: 28px;
            background: url("../../assets/image/red-local.png") no-repeat;
            background-size: 10px 14px;
            background-position: center center;
            position: absolute;
            right: 5px;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .health-item,
        .cross-item {
          border-bottom: 1px solid #efefef;
          padding-left: 10px;
          color: #585858;
          position: relative;

          .chosed-icon {
            background: url("../../assets/image/green-chosed.png") no-repeat;
            width: 16px;
            height: 16px;
            background-size: 100% 100%;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
          }
        }

        .health-title,
        .cross-title {
          border-bottom: 1px solid #efefef;
          span {
            font-size: 11px;
            color: #c7c7c7;
          }
          .chosedValue {
            height: 75px;
            .value {
              text-align: right;
              height: 25px;
              line-height: 25px;
              font-weight: 100;
            }
          }
        }

        .icon-cross {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          float: right;
          position: absolute;
          right: 0;
          top: 15px;
        }

        .address {
          color: #585858;
          padding-left: 10px;
        }
        .addressDetail {
          width: 250px;
          font-size: 13px;
        }
      }
    }

    .second,
    .third {
      margin-top: 15px;
      background-color: #fff;

      .item {
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        font-weight: bold;
        display: flex;
        font-size: 14px;

        .name {
          width: 30%;
        }

        .value {
          width: 70%;
          text-align: right;
          display: flex;
          justify-content: flex-end;

          input {
            font-size: 13px;
            text-align: right;
            text-align: end;
            width: 55px;
            padding-right: 5px;
          }
        }
      }
    }

    .bottom {
      height: 80px;
      background-color: #eee;
      display: flex;
      justify-content: center;

      .look-button,
      .punch-button {
        width: 155px;
        height: 40px;
        border-radius: 20px;
        background-color: #d22d2d;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 15px;
        margin-top: 20px;
      }

      .look-button {
        margin-right: 15px;
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
      .punch-success,
      .search-report {
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

        .message {
          padding: 0 15px 15px 15px;
          font-size: 14px;
          span {
            font-size: 13px;
            color: rgb(172, 169, 169);
          }
        }

        .result {
          width: 150px;
          padding-left: 20px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          font-weight: bold;
        }

        .health,
        .bad,
        .tips {
          width: 90%;
          padding-left: 25px;
          padding-right: 10px;
          margin: 0 auto;
          line-height: 25px;
          box-sizing: border-box;
          margin-bottom: 5px;
          margin-top: 5px;
          border-radius: 5px;
          font-size: 12px;
          color: #fff;
        }

        .health {
          background-color: #3cc77b;
          position: relative;

          .health-icon {
            width: 14px;
            height: 16px;
            background: url("../../assets/image/安全.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 5px;
            top: 5px;
          }
        }

        .bad {
          background-color: #ff9952;
          position: relative;

          .bad-icon {
            width: 16px;
            height: 15px;
            background: url("../../assets/image/警告.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 5px;
            top: 5px;
          }
        }

        .report-list {
          max-height: 160px;
          overflow-y: auto;
        }

        .tips {
          border: 1px solid #e56969;
          color: #e56969;
          position: relative;

          .tips-icon {
            width: 14px;
            height: 13px;
            background: url("../../assets/image/爱心.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            left: 5px;
            top: 5px;
          }
        }

        .function {
          padding: 0 15px;
          margin-top: 20px;
          margin-bottom: 15px;
          .left {
            color: #e56969;
            font-weight: bold;
          }

          .right {
            font-size: 11px;
            color: rgba(153, 148, 148, 0.623);
          }

          .plus {
            width: 12px;
            height: 12px;
            background: url("../../assets/image/加.png") no-repeat;
            background-size: 100% 100%;
            display: inline-block;
            transform: translateY(2px);
            margin-left: 5px;
          }

          .minus {
            width: 12px;
            height: 3px;
            background: url("../../assets/image/减.png") no-repeat;
            background-size: 100% 100%;
            display: inline-block;
            transform: translateY(-3px);
            margin-left: 5px;
          }

          .function-message {
            margin-top: 5px;
            line-height: 20px;
            color: #000;
          }
        }

        .bottom-message {
          font-size: 11px;
          color: rgb(161, 156, 156);
          text-align: center;
          margin: 10px 0 5px 0;
        }
      }
      .city-list {
        width: 100%;
        height: 70%;
        position: absolute;
        left: 0;
        bottom: 0;
        background-color: #fff;
        border-radius: 8px 8px 0 0;
        .city-top {
          height: 45px;
          width: 100%;
          text-align: center;
          font-size: 15px;
          line-height: 45px;
          position: absolute;
          background-color: #fff;
          left: 0;
          top: 0;
          .icon-close {
            width: 20px;
            height: 20px;
            background: url("../../assets/image/icon-close.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .select-province,
        .select-city,
        .select-area {
          height: 100%;
          overflow-y: auto;
          box-sizing: border-box;
          .select-title {
            height: 25px;
            line-height: 25px;
            font-size: 12px;
            padding-left: 20px;
            color: rgb(199, 197, 197);
          }
          .province,
          .city,
          .area {
            height: 30px;
            line-height: 30px;
            display: flex;
            .label {
              width: 20px;
              text-align: center;
              margin-left: 15px;
              font-size: 14px;
              color: rgb(199, 197, 197);
            }
            .name {
              font-size: 14px;
              padding-left: 15px;
            }
          }
        }
        .select-province {
          padding-top: 45px;
        }
        .select-city,
        .select-area {
          padding-top: 75px;
        }
        .selected {
          height: 30px;
          width: 100%;
          line-height: 35px;
          position: absolute;
          background-color: #fff;
          left: 0;
          top: 45px;
          .seleted-province,
          .selectCityButton,
          .selectedCityButton {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border-radius: 12.5px;
            background-color: #eee;
            font-size: 12px;
            padding: 1px 10px;
            margin-left: 20px;
            letter-spacing: 1px;
          }
          .selectCityButton {
            color: #d22d2d;
          }
        }
      }
    }
  }
  .click-box {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
    height: 42px;
    width: 100%;
    background-color: #fff;

    .map-title {
      position: absolute;
      left: 5%;
      top: 50%;
      z-index: 999;
      transform: translateY(-50%);
      input {
        font-size: 14px;
        width: 260px;
      }
    }

    .confirm {
      width: 65px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      border-radius: 10px;
      font-size: 14px;
      background-color: rgb(235, 56, 39);
      color: #fff;
      letter-spacing: 4px;
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .search-box {
    position: absolute;
    left: 50%;
    top: 10px;
    z-index: 999;
    height: 42px;
    width: 345px;
    border: 1px solid red;
    border-radius: 20px;
    background-color: #fff;
    transform: translateX(-50%);
    .icon {
      width: 18px;
      height: 18px;
      background: url("../../assets/image/search-icon.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    input {
      margin: 0;
      font-size: 14px;
      width: 250px;
      height: 30px;
      border: none;
      position: absolute;
      left: 35px;
      top: 50%;
      transform: translateY(-50%);
    }
    .search-list {
      width: 254px;
      max-height: 250px;
      margin-left: 10px;
      background-color: #fff;
      border: 1px solid rgb(230, 224, 224);
      overflow-y: auto;
      position: absolute;
      left: 20px;
      top: 42px;
      .item {
        height: 30px;
        line-height: 30px;
        padding-left: 10px;
      }
    }
  }
}
</style>