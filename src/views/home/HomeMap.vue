<template>
  <div class="home-map">
    <div class="home-header">
      <div class="title">截止{{ date }} 南通市疫情统计数据</div>
      <div class="open" @click="isShowMore = !isShowMore">
        {{ isShowMore ? "收起数据" : "展开区县数据" }}
      </div>
      <div class="cart"></div>
      <div class="tabs">
        <div class="item confirm">
          <div class="value">{{ patient }}</div>
          <div class="text">确诊</div>
        </div>
        <div class="item area">
          <div class="value">{{ region }}</div>
          <div class="text">疫情点</div>
        </div>
        <div class="item add-people">
          <div class="value">
            <span>昨日</span>
            +{{ patientGain }}
          </div>
          <div class="text">新增确诊</div>
        </div>
        <div class="item add-area">
          <div class="value">
            <span>昨日</span>
            +{{ regionGain }}
          </div>
          <div class="text">新增疫情点</div>
        </div>
      </div>
      <div class="table" v-if="isShowMore">
        <div class="header">
          <div class="area">区县</div>
          <div class="confirm-number">确诊人数</div>
          <div class="quarters">疫情点数</div>
          <div class="people-number">昨日新增确诊总人数</div>
          <div class="quarters-number">昨日新增疫情点数</div>
        </div>
        <ul>
          <li v-for="(item, index) in dateList" :key="index">
            <div class="area">{{ item.cityName }}</div>
            <div class="confirm-number">{{ item.patient }}</div>
            <div class="quarters">{{ item.region }}</div>
            <div class="people-number">{{ item.patientGain }}</div>
            <div class="quarters-number">{{ item.regionGain }}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="ch-logo"></div>
    <div class="my-location" @click="clickMyLocation">
      <div class="location-icon"></div>
      我的位置
    </div>
    <div class="area-infowindow" v-if="isShowArea">
      <div class="top">
        疫情点一览
        <div class="select">
          <drop-down
            :dropList="areaList"
            :chosedOption="chosedArea"
            :dropDownType="'selectArea'"
            @changeChoose="changeChoose"
          ></drop-down>
        </div>
      </div>
      <div class="table-title">
        {{ chosedArea.name }} ({{ patientList.length }}个小区)
      </div>
      <div class="info-table">
        <div class="header">
          <div class="index">序号</div>
          <div class="name">小区名称</div>
          <div class="option">操作</div>
        </div>
        <ul class="list">
          <li class="item" v-for="(item, index) in patientList" :key="index">
            <div class="index">{{ item.id }}</div>
            <div class="name">{{ item.regionName }}</div>
            <div class="option" @click="lookAt(item)">查看</div>
          </li>
        </ul>
      </div>
      <div class="close-button" @click="isShowArea = false">关闭</div>
    </div>
    <div
      :class="isShowSearchList ? 'sortList act' : 'sortList'"
      v-if="isShowSort"
    >
      <div class="link">
        <span>附近疫情点</span>
        <div class="search-input">
          <input
            type="text"
            class="searh"
            @input="keywordSearch"
            @click="onblur"
            @blur="lostblur"
            placeholder="输入地址并选择要查看的地点"
            v-model="keyword"
          />
        </div>
      </div>
      <div class="search-list" v-if="isShowSearchList">
        <div
          v-for="(item, index) in searchList"
          :key="index"
          class="search-item"
          @click="setTo(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="list-wrap">
        <div
          class="sort-item"
          v-for="(item, index) in sortList"
          :key="index"
          @click="locationTo(item, index, true)"
          :class="clickIndex === index ? 'clickChosed' : ''"
        >
          <div class="name">
            {{ item.id.regionName }}
            <div class="address">{{ item.id.address }}</div>
          </div>

          <div :class="index == 0 ? 'length1' : 'length'">
            <template v-if="index == 0">
              <span>距您最近</span>
              &nbsp;&nbsp;&nbsp;{{ (item.length / 1000).toFixed(2) + "km" }}
            </template>
            <template v-else>
              {{ (item.length / 1000).toFixed(2) + "km" }}
            </template>
          </div>
        </div>
      </div>
      <div class="close">
        技术合作：南通市测绘院有限公司
        <i @click="showNantongCH"></i>
        <div class="chy-name" v-if="isShowName">南通市测绘院有限公司</div>
      </div>
    </div>
    <m-map></m-map>
  </div>
</template>
<script>
import MMap from "../map/Map.vue";
import DropDown from "@/components/DropDown.vue";
import {
  getDayStatisticsTotal,
  getDayStatisticsDetails,
  getRegionData,
  getPatientTrail
} from "@/api/homeMap.js";
import {
  getCenterPoint,
  compare,
  blur,
  chinaDateTime
} from "@/common/tool/tool.js";
import startIcon from "@/assets/image/startIcon.png";
import locIcon from "@/assets/image/blue-loc1.png";
import blueIcon from "@/assets/image/shan.gif";
import wx from "weixin-js-sdk";
import axios from "axios";
import { getURL } from "@/common/tool/tool";
import icon1 from "@/assets/image/v1.png";
import icon2 from "@/assets/image/v2.gif";
import $ from "jquery";

export default {
  data() {
    return {
      isShowMore: false,
      isshowEpidemic: false,
      isShowTrajectory: false,
      isShowArea: false,
      isShowNearTrajectory: false,
      isShowNearArea: false,
      patient: "",
      patientGain: "",
      region: "",
      regionGain: "",
      //   isShowWindow:false,
      date: "",
      dateList: [],
      markList: [],
      isShowSort: false,
      areaList: [
        {
          name: "崇川区"
        },
        {
          name: "开发区"
        },
        {
          name: "港闸区"
        },
        {
          name: "通州区"
        },
        {
          name: "启东市"
        },
        {
          name: "海门市"
        },
        {
          name: "海安市"
        },
        {
          name: "如皋市"
        },
        {
          name: "如东县"
        }
      ],
      chosedArea: {
        name: "崇川区"
      },

      patientList: [],
      sortList: [],
      keyword: "",
      searchList: [],
      isShowSearchList: false,
      isShowName: false,
      pointOne: {},
      pointTwo: {},
      clickIndex: "",
      bluePoint: "",
      pointCollection2: "",
      smallPoint: "",
      localPoint: ""
    };
  },
  created() {
    var arr = chinaDateTime(new Date())
      .split(" ")[0]
      .split("-");
    document.getElementsByTagName(
      "title"
    )[0].innerText = `南通市“战疫图”:${arr[1] + "-" + arr[2]}最新数据`;
    this.getDayStatisticsTotal();
    this.getDayStatisticsDetails();
  },
  mounted() {
    var vm = this;
    setTimeout(function() {
      vm.location();
      vm.drawPloy();
      vm.showNearArea();
    }, 1000);
  },
  methods: {
    shareList(imgUrl, link, desc, title) {
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
    onblur() {
      var vm = this;
      vm.isShowSearchList = false;
    },
    lostblur() {
      blur();
    },
    openInfo: function(content, mk) {
      var opts = {
        width: 100, // 信息窗口宽度
        height: 70, // 信息窗口高度
        title: "详情", // 信息窗口标题
        enableMessage: true, //设置允许信息窗发送短息,
        enableAutoPan: false
      };
      var p = mk;
      var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      var infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象
      window.baseMap.openInfoWindow(infoWindow, point); //开启信息窗口
    },
    drawPloy() {
      var vm = this;
      getRegionData().then(resp => {
        var data = resp.data.data;
        var locPoint1 = new BMap.Icon(icon1, new BMap.Size(15, 15), {
          // anchor: new BMap.Size(0, 0),
          imageSize: new BMap.Size(15, 15)
        });
        var locPoint2 = new BMap.Icon(icon2, new BMap.Size(15, 15), {
          // anchor: new BMap.Size(25, 25),
          imageSize: new BMap.Size(15, 15)
        });

        for (var i = 0; i < data.length; i++) {
          var pt = new BMap.Point(data[i].bdx, data[i].bdy);
          var mk = new BMap.Marker(pt, {
            icon: locPoint1
          });
          mk.id = data[i].id;
          vm.markList.push(mk);
          var values = "";
          data[i].remarks.split("|").map((v, i) => {
            if ((i = 0)) {
              values += `<div class='title'>${v}</div>`;
            } else {
              values += `<div>${v}</div>`;
            }
          });
          window.baseMap.addOverlay(mk);
          addClickHandler(values, mk);
          var options = {
            position: pt,
            offset: new BMap.Size(10, -30) //设置文本偏移量
          };
          var label = new BMap.Label(data[i].regionName, options); // 创建文本标注对象
          label.setStyle({
            color: "#D22D2D",
            fontSize: "14px",
            padding: "0 8px",
            height: "24px",
            lineHeight: "24px",
            borderRadius: "12px",
            fontFamily: "微软雅黑"
          });
          label.hide();
          window.baseMap.addOverlay(label);
        }
        function addClickHandler(content, marker) {
          marker.addEventListener("click", function() {
            for (var i = 0; i < vm.markList.length; i++) {
              vm.markList[i].setIcon(locPoint1);
            }
            for (var j = 0; j < vm.sortList.length; j++) {
              if (vm.sortList[j].id.id == marker.id) {
                vm.clickIndex = j;
                window.baseMap.panTo(
                  new BMap.Point(vm.sortList[j].id.bdx, vm.sortList[j].id.bdy)
                );
                break;
              }
            }
            marker.setIcon(locPoint2);
            vm.openInfo(content, marker);
          });
        }
      });
    },
    scrollToText: function() {
      var st = $(".sort-item").height() * this.clickIndex;
      console.log(st);
      $(".sortList").scrollTop(st);
    },
    changeChoose(val) {
      var vm = this;
      this.chosedArea = val.value;
      var param = {
        cityName: vm.chosedArea.name
      };
      getRegionData(param).then(resp => {
        vm.patientList = resp.data.data;
      });
    },
    showArea() {
      var vm = this;
      this.isshowEpidemic = false;
      this.isShowTrajectory = false;
      this.isShowNearTrajectory = false;
      this.isShowNearArea = false;
      if (this.isShowArea) {
        this.isShowArea = !this.isShowArea;
      } else {
        var param = {
          cityName: vm.chosedArea.name
        };
        getRegionData(param).then(resp => {
          vm.patientList = resp.data.data;
          this.isShowArea = !this.isShowArea;
        });
      }
    },
    getDayStatisticsTotal() {
      var vm = this;
      getDayStatisticsTotal().then(resp => {
        vm.date = resp.data.data.dateString;
        vm.patient = resp.data.data.patient;
        vm.patientGain = resp.data.data.patientGain;
        vm.region = resp.data.data.region;
        vm.regionGain = resp.data.data.regionGain;
        this.shareList(
          "https://yqfk.ntschy.com/swnt.png",
          window.location.href,
          "关注南通疫情，判断您是否为密接者。数据来源：南通市疾病预防控制中心",
          "战疫图 • 南通（持续更新）"
        );
      });
    },
    getDayStatisticsDetails() {
      var vm = this;
      getDayStatisticsDetails().then(resp => {
        vm.dateList = resp.data.data;
      });
    },
    showEpidemic() {
      this.isShowTrajectory = false;
      this.isShowArea = false;
      this.isShowNearTrajectory = false;
      this.isShowNearArea = false;
      this.isshowEpidemic = !this.isshowEpidemic;
    },
    showTrajectory() {
      this.isshowEpidemic = false;
      this.isShowArea = false;
      this.isShowNearTrajectory = false;
      this.isShowNearArea = false;
      this.isShowTrajectory = !this.isShowTrajectory;
    },
    showNearTrajectory() {
      var vm = this;
      this.isshowEpidemic = false;
      this.isShowTrajectory = false;
      this.isShowArea = false;
      this.isShowNearArea = false;
      if (this.isShowNearTrajectory) {
        this.isShowNearTrajectory = !this.isShowNearTrajectory;
      } else {
        getPatientTrail().then(resp => {
          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(
            function(r) {
              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var lengthList = [];
                resp.data.data.map(v => {
                  if (v) {
                    var pointA = new BMap.Point(r.point.lng, r.point.lat);
                    var pointB = new BMap.Point(v.bdx, v.bdy);
                    lengthList.push({
                      id: v.id,
                      placeName: v.placeName,
                      length: window.baseMap
                        .getDistance(pointA, pointB)
                        .toFixed(2),
                      bdx: v.bdx,
                      bdy: v.bdy
                    });
                  }
                });
                var max = lengthList.sort(function(a, b) {
                  return a.length < b.length;
                })[0];
                var myIcon = new BMap.Icon(startIcon, new BMap.Size(45, 45), {
                  anchor: new BMap.Size(0, 0), //这句表示图片相对于所加的点的位置mapStart
                  imageSize: new BMap.Size(30, 30) //图标所用的图片的大小，此功能的作用等同于CSS中的background-size属性。可用于实现高清屏的高清效果
                  // offset: new BMap.Size(-10, 45), // 指定定位位置
                  // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                });
                var marker = new BMap.Marker(new BMap.Point(max.bdx, max.bdy), {
                  icon: myIcon
                });
                var opts = {
                  position: new BMap.Point(max.bdx, max.bdy), // 指定文本标注所在的地理位置
                  offset: new BMap.Size(0, -20) //设置文本偏移量
                };
                var label = new BMap.Label(max.placeName, opts); // 创建文本标注对象
                label.setStyle({
                  color: "#D22D2D",
                  fontSize: "12px",
                  height: "20px",
                  lineHeight: "20px",
                  fontFamily: "微软雅黑"
                });
                window.baseMap.panTo(new BMap.Point(max.bdx, max.bdy));
                var allOverlay = window.baseMap.getOverlays();
              } else {
                // alert("failed" + this.getStatus());
              }
            },
            { enableHighAccuracy: true }
          );
          this.isShowNearTrajectory = !this.isShowNearTrajectory;
        });
      }
    },
    location() {
      var vm = this;
      vm.clickIndex = "";
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
              anchor: new BMap.Size(25, 25),
              imageSize: new BMap.Size(40, 40)
            });
            var mk = new BMap.Marker(r.point, {
              icon: locPoint
            });
            vm.localPoint = mk;
            vm.pointOne = r.point;
            window.baseMap.addOverlay(mk);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    clickMyLocation() {
      var vm = this;
      vm.clickIndex = 0;
      window.baseMap.removeOverlay(vm.smallPoint);
      window.baseMap.removeOverlay(vm.localPoint);
      vm.keyword = "";
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
              anchor: new BMap.Size(25, 25),
              imageSize: new BMap.Size(40, 40)
            });
            var mk = new BMap.Marker(r.point, {
              icon: locPoint
            });
            vm.pointOne = r.point;
            window.baseMap.panTo(r.point);
            window.baseMap.addOverlay(mk);
            getRegionData().then(resp => {
              var polyList = [];
              resp.data.data.map(item => {
                var path = [];
                path.push({
                  lng: item.bdx,
                  lat: item.bdy
                });
                polyList.push({
                  value: item,
                  centerPoint: getCenterPoint(path),
                  path: path
                });
              });
              var lengthList = [];
              polyList.map(v => {
                if (v) {
                  var pointA = r.point;
                  var pointB = new BMap.Point(
                    v.centerPoint.lng,
                    v.centerPoint.lat
                  );
                  lengthList.push({
                    id: v.value,
                    length: window.baseMap
                      .getDistance(pointA, pointB)
                      .toFixed(2),
                    path: v.path
                  });
                }
              });
              vm.sortList = lengthList.sort(compare("length"));
              $(".sortList").scrollTop(0);
              var bluePoint = new BMap.Point(
                getCenterPoint(vm.sortList[0].path).lng,
                getCenterPoint(vm.sortList[0].path).lat
              );
            });
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    showNearArea() {
      var vm = this;
      this.isshowEpidemic = false;
      this.isShowTrajectory = false;
      this.isShowArea = false;
      this.isShowNearTrajectory = false;
      if (this.isShowNearArea) {
        this.isShowNearArea = !this.isShowNearArea;
      } else {
        getRegionData().then(resp => {
          var polyList = [];
          resp.data.data.map(item => {
            var path = [];
            path.push({
              lng: item.bdx,
              lat: item.bdy
            });
            polyList.push({
              value: item,
              centerPoint: getCenterPoint(path),
              path: path
            });
          });
          var geolocation = new BMap.Geolocation();
          geolocation.getCurrentPosition(
            function(r) {
              if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                var lengthList = [];
                polyList.map(v => {
                  if (v) {
                    var pointA = new BMap.Point(r.point.lng, r.point.lat);
                    var pointB = new BMap.Point(
                      v.centerPoint.lng,
                      v.centerPoint.lat
                    );
                    lengthList.push({
                      id: v.value,
                      length: window.baseMap
                        .getDistance(pointA, pointB)
                        .toFixed(2),
                      path: v.path
                    });
                  }
                });

                vm.sortList = lengthList.sort(compare("length"));
                vm.locationTo(vm.sortList[0], 0);
                vm.isShowSort = true;
                this.isShowArea = false;
              } else {
                alert("failed" + this.getStatus());
              }
            },
            { enableHighAccuracy: true }
          );
          this.isShowNearArea = !this.isShowNearArea;
        });
      }
    },
    // 查看
    lookAt(item) {
      var pointList = [];
      var newStr = item.cors1.substr(0, item.cors1.length - 1);
      newStr.split("],").map(v => {
        pointList.push(
          new BMap.Point(v.substr(1).split(",")[0], v.substr(1).split(",")[1])
        );
      });
      var polygon = new BMap.Polygon(pointList, {
        strokeColor: "#FE8E00",
        strokeWeight: 2,
        strokeOpacity: 1,
        fillColor: "#FE8E00"
      }); //创建多边形
      var opts = {
        position: getCenterPoint(pointList), // 指定文本标注所在的地理位置
        offset: new BMap.Size(-60, -40) //设置文本偏移量
      };
      var label = new BMap.Label(item.regionName, opts); // 创建文本标注对象
      label.setStyle({
        color: "#D22D2D",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑"
      });
      polygon.regionID = item.id;
      polygon.addEventListener("click", function() {});
      this.isShowArea = false;
      window.baseMap.addOverlay(label);
      window.baseMap.setZoom(17);
      window.baseMap.panTo(getCenterPoint(pointList));
      window.baseMap.addOverlay(polygon); //增加多边形
    },
    drawBlue(point) {
      var vm = this;
      // window.baseMap.removeOverlay(vm.pointCollection2);
      window.baseMap.removeOverlay(vm.bluePoint);
      // var points2 = [point];
      // window.baseMap.removeOverlay(vm.blueMaker);
      // var allOverlay = window.baseMap.getOverlays();
      var opts = {
        position: point, // 指定文本标注所在的地理位置
        offset: new BMap.Size(10, -30) //设置文本偏移量
      };
      var locPoint = new BMap.Icon(blueIcon, new BMap.Size(20, 20), {
        anchor: new BMap.Size(10, 10),
        imageSize: new BMap.Size(20, 20)
      });
      var mk = new BMap.Marker(point, {
        icon: locPoint
      });
      vm.bluePoint = mk;
      window.baseMap.addOverlay(mk);
    },
    locationTo(item, index, isSetView) {
      var vm = this;
      vm.clickIndex = index;
      // window.baseMap.removeOverlay(vm.localPoint);
      var locPoint1 = new BMap.Icon(icon1, new BMap.Size(15, 15), {
        // anchor: new BMap.Size(25, 25),
        imageSize: new BMap.Size(15, 15)
      });
      var locPoint2 = new BMap.Icon(icon2, new BMap.Size(15, 15), {
        // anchor: new BMap.Size(25, 25),
        imageSize: new BMap.Size(15, 15)
      });
      var values = "";
      // var values = data[i].remarks.split("|").join("<br>");
      if (item.id.remarks != null) {
        item.id.remarks.split("|").map((v, i) => {
          if ((i = 0)) {
            values += `<div class='title'>${v}</div>`;
          } else {
            values += `<div>${v}</div>`;
          }
        });
      }

      for (var i = 0; i < this.markList.length; i++) {
        if (this.markList[i].id == item.id.id) {
          for (var j = 0; j < vm.markList.length; j++) {
            vm.markList[j].setIcon(locPoint1);
          }
          this.markList[i].setIcon(locPoint2);
          this.openInfo(values, this.markList[i]);
          break;
        }
      }
      var point = new BMap.Point(item.id.bdx, item.id.bdy);
      if (isSetView) {
        window.baseMap.setZoom(16);
      }
      window.baseMap.panTo(point);
    },
    closeSort() {
      this.isShowNearArea = false;
      this.isShowSort = false;
      window.baseMap.clearOverlays();
      this.drawPloy();
    },
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
            console.log(s);
            vm.searchList = s;
          }
        }
      };
      var local = new BMap.LocalSearch(window.baseMap, options);
      local.search(this.keyword);
      vm.isShowSearchList = true;
    },
    setTo(item) {
      var vm = this;
      vm.clickIndex = "";
      vm.keyword = item.name;
      vm.isShowSearchList = false;
      window.baseMap.removeOverlay(vm.localPoint);
      //周佳佳改，把之前一次的蓝色小标清除；
      if (vm.smallPoint != null) {
        window.baseMap.removeOverlay(vm.smallPoint);
      }

      // vm.drawPloy();
      var locPoint = new BMap.Icon(locIcon, new BMap.Size(25, 25), {
        anchor: new BMap.Size(5, 5),
        imageSize: new BMap.Size(25, 25)
      });
      //   console.log(new BMap.Point(item.lng,item.lat))
      var mk = new BMap.Marker(new BMap.Point(item.lng, item.lat), {
        icon: locPoint
      });
      vm.pointOne = new BMap.Point(item.lng, item.lat);
      vm.smallPoint = mk;
      window.baseMap.addOverlay(vm.smallPoint);
      window.baseMap.setZoom(9);
      window.baseMap.panTo(new BMap.Point(item.lng, item.lat));

      getRegionData().then(resp => {
        var polyList = [];
        resp.data.data.map(item => {
          var path = [];
          path.push({
            lng: item.bdx,
            lat: item.bdy
          });
          polyList.push({
            value: item,
            centerPoint: getCenterPoint(path),
            path: path
          });
        });
        var lengthList = [];
        polyList.map(v => {
          if (v) {
            var pointA = new BMap.Point(item.lng, item.lat);
            var pointB = new BMap.Point(v.centerPoint.lng, v.centerPoint.lat);
            lengthList.push({
              id: v.value,
              length: window.baseMap.getDistance(pointA, pointB).toFixed(2),
              path: v.path
            });
          }
        });

        vm.sortList = lengthList.sort(compare("length"));

        //因为搜索了一个地址后，默认的气泡还是原来的没边
        if (
          vm.sortList != null &&
          vm.sortList.length > 0 &&
          vm.sortList[0] != null &&
          vm.sortList[0].id != null
        ) {
          console.log(vm.sortList[0].id);

          var locPoint1 = new BMap.Icon(icon1, new BMap.Size(28, 28));
          var locPoint2 = new BMap.Icon(icon2, new BMap.Size(48, 48));
          var values = "";
          // var values = data[i].remarks.split("|").join("<br>");
          if (vm.sortList[0].id.remarks != null) {
            vm.sortList[0].id.remarks.split("|").map((v, i) => {
              if ((i = 0)) {
                values += `<div class='title'>${v}</div>`;
              } else {
                values += `<div>${v}</div>`;
              }
            });
          }

          for (var i = 0; i < this.markList.length; i++) {
            if (this.markList[i].id == vm.sortList[0].id.id) {
              for (var j = 0; j < vm.markList.length; j++) {
                vm.markList[j].setIcon(locPoint1);
              }
              this.markList[i].setIcon(locPoint2);
              this.openInfo(values, this.markList[i]);
              break;
            }
          }

          var point = new BMap.Point(
            vm.sortList[0].id.bdx,
            vm.sortList[0].id.bdy
          );
          window.baseMap.panTo(point);
        }

        vm.isShowNearArea = !vm.isShowNearArea;
      });
    },
    showNantongCH() {
      this.isShowName = true;
      setTimeout(() => {
        this.isShowName = false;
      }, 2000);
    },
    setMapArea() {
      getRegionData().then(resp => {
        var polyList = [];
        resp.data.data.map(item => {
          var path = [];
          path.push({
            lng: item.bdx,
            lat: item.bdy
          });
          polyList.push(getCenterPoint(path));
        });
        window.baseMap.setViewport(polyList, {
          margins: [90, 30, 220, 30]
        });
      });
    }
  },
  components: {
    MMap,
    DropDown
  },
  watch: {
    keyword() {
      if (this.keyword === "") {
        this.isShowSearchList = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.home-map {
  height: 100%;
  position: relative;
  .home-header {
    width: 90%;
    background-color: #fff;
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1999;
    box-shadow: 2px 2px 3px #ccdbec;
    border-radius: 5px;
    padding-top: 30px;
    .title {
      font-size: 12px;
      position: absolute;
      left: 8px;
      top: 6px;
    }
    .open {
      font-size: 12px;
      color: #d73d3f;
      position: absolute;
      right: 12px;
      top: 6px;
    }
    .cart {
      width: 0;
      position: absolute;
      top: 11px;
      right: 2px;
      height: 0;
      margin-left: 2px;
      vertical-align: middle;
      border-top: 4px dashed;
      border-top: 4px solid #d73d3f;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
    }
    .tabs {
      height: 45px;
      display: flex;
      .item {
        width: 25%;
        height: 45px;
        text-align: center;
        .value {
          height: 27px;
          line-height: 25px;
          font-size: 24px;
          border-right: 1px solid rgba(216, 214, 214, 0.712);
          span {
            font-size: 12px;
          }
        }
        .text {
          font-size: 10px;
        }
      }
      .item:last-child {
        .value {
          border: none;
        }
      }
      .confirm {
        color: #d22c2c;
      }
      .area {
        color: #ff8d00;
      }
      .add-people {
        color: #d22c2c;
      }
      .add-area {
        color: #fe8e00;
      }
    }
    .table {
      transition: all 0.5s;
      margin-top: 10px;
      .header {
        height: 35px;
        div {
          float: left;
          font-size: 12px;
          width: 20%;
          text-align: center;
        }
      }
      ul {
        margin: 0;
        padding: 0;
        list-style: none;
        li {
          height: 20px;
          line-height: 20px;
          div {
            float: left;
            font-size: 12px;
            width: 20%;
            text-align: center;
          }
        }
      }
    }
  }
  .ch-logo {
    width: 30px;
    height: 30px;
    background: url("../../assets/image/CHY-logo.png") no-repeat;
    background-size: 100% 100%;
    position: absolute;
    right: 10px;
    bottom: 10px;
    z-index: 999;
  }
  .red-chosed {
    background-color: #fff !important;
    color: #d22c2c !important;
  }
  .yellow-chosed {
    background-color: #fff !important;
    color: #fe8d00 !important;
  }
  .button {
    width: 80px;
    height: 30px;
    border-radius: 15px;
    font-size: 12px;
    line-height: 30px;
    text-align: right;
    padding-right: 8px;
    box-sizing: border-box;
    position: absolute;
    .icon {
      width: 12px;
      height: 12px;
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .epidemic-button {
    right: 20px;
    top: 100px;
    z-index: 999;
    color: #fff;
    background-color: #fe8d00;
    border: 1px solid#FE8D00;
    .open {
      width: 14px;
      height: 7px;
      background: url("../../assets/image/显示2.png") no-repeat;
      background-size: 100% 100%;
    }
    .close {
      width: 14px;
      height: 7px;
      background: url("../../assets/image/不显示.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .trajectory-button {
    right: 20px;
    top: 140px;
    z-index: 999;
    color: #fff;
    background-color: #d22c2c;
    border: 1px solid#D22C2C;
    .open {
      width: 14px;
      height: 7px;
      background: url("../../assets/image/显示2.png") no-repeat;
      background-size: 100% 100%;
    }
    .close {
      width: 14px;
      height: 7px;
      background: url("../../assets/image/不显示.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .area-button {
    left: 20px;
    bottom: 120px;
    z-index: 999;
    color: #fff;
    background-color: #d22c2c;
    border: 1px solid#D22C2C;
    .open {
      width: 12px;
      height: 12px;
      background: url("../../assets/image/疫区查看.png") no-repeat;
      background-size: 100% 100%;
    }
    .close {
      width: 12px;
      height: 12px;
      background: url("../../assets/image/疫区查看1.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .near-trajectory {
    left: 20px;
    bottom: 80px;
    z-index: 999;
    color: #fff;
    background-color: #d22c2c;
    border: 1px solid#D22C2C;
    .open {
      width: 12px;
      height: 12px;
      background: url("../../assets/image/最近轨迹.png") no-repeat;
      background-size: 100% 100%;
    }
    .close {
      width: 12px;
      height: 12px;
      background: url("../../assets/image/最近轨迹1.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .near-area {
    left: 20px;
    bottom: 40px;
    z-index: 999;
    color: #fff;
    background-color: #fe8d00;
    border: 1px solid#FE8D00;
    .open {
      width: 12px;
      height: 12px;
      background: url("../../assets/image/最近疫区.png") no-repeat;
      background-size: 100% 100%;
    }
    .close {
      width: 12px;
      height: 12px;
      background: url("../../assets/image/最近疫区1.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .my-location {
    width: 80px;
    height: 30px;
    border-radius: 15px;
    font-size: 12px;
    line-height: 30px;
    text-align: right;
    padding-right: 8px;
    box-sizing: border-box;
    position: absolute;
    right: 15px;
    top: 100px;
    z-index: 999;
    background-color: #fff;
    border: 1px solid #3579f8;
    color: #3579f8;
    .location-icon {
      width: 15px;
      height: 15px;
      background: url("../../assets/image/loc-logo.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .area-infowindow {
    width: 80%;
    background-color: #fff;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2999;
    box-shadow: 2px 2px 3px #ccdbec;
    border-radius: 5px;
    .top {
      height: 50px;
      line-height: 60px;
      color: #d22c2c;
      font-size: 14px;
      padding-left: 10px;
      box-sizing: border-box;
      position: relative;
      .select {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .table-title {
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      padding-left: 20px;
    }
    .info-table {
      margin-top: 5px;
      width: 90%;
      margin: 0 auto;
      .header {
        display: flex;
        font-size: 12px;
        text-align: center;
        border: 1px solid #ededed;
        height: 20px;
        div {
          border-right: 1px solid #ededed;
        }
        div:last-child {
          border: none;
        }
        .index {
          width: 20%;
        }
        .name {
          width: 60%;
        }
        .option {
          width: 30%;
        }
      }
      .list {
        border-left: 1px solid #ededed;
        border-right: 1px solid #ededed;
        list-style: none;
        padding: 0;
        margin: 0;
        .item {
          display: flex;
          font-size: 12px;
          text-align: center;
          border-bottom: 1px solid #ededed;
          line-height: 20px;
          height: 20px;
          div {
            border-right: 1px solid #ededed;
          }
          div:last-child {
            border: none;
          }
          .index {
            width: 20%;
          }
          .name {
            width: 60%;
          }
          .option {
            width: 30%;
            color: #d22c2c;
          }
        }
      }
    }
    .close-button {
      width: 80px;
      height: 30px;
      background-color: #d22c2c;
      line-height: 30px;
      text-align: center;
      margin: 20px auto;
      font-size: 13px;
      color: #fff;
      border-radius: 15px;
    }
  }
  .sortList {
    width: 100%;
    height: 120px;
    padding-top: 40px;
    padding-bottom: 40px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
    background-color: #fff;
    border-top: 1px solid rgb(224, 223, 223);
    overflow-y: auto;
    .link {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      position: fixed;
      z-index: 999;
      bottom: 160px;
      background-color: #fff;
      span {
        width: 35%;
        color: #d22c2c;
        font-size: 14px;
        padding-left: 10px;
        line-height: 40px;
      }
    }
    .list-wrap {
      padding: 0 10px;
    }
    .sort-item {
      height: 30px;
      font-size: 14px;
      .name {
        padding-left: 10px;
        line-height: 30px;
        box-sizing: border-box;
        float: left;
        width: 65%;
        display: flex;
        flex-direction: row;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        .address {
          font-size: 12px;
          padding-left: 10px;
          color: #ccc;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .length {
        padding-right: 10px;
        text-align: right;
        line-height: 30px;
        box-sizing: border-box;
        float: left;
        width: 35%;
        position: relative;
      }
      .length1 {
        padding-right: 10px;
        text-align: right;
        line-height: 30px;
        box-sizing: border-box;
        float: left;
        width: 35%;
        // flex: 1;
        color: #d22c2c;
        position: relative;
        span {
          font-size: 12px;
          height: 30px;
          line-height: 30px;
          position: absolute;
          top: 0;
          right: 75px;
        }
      }
    }
    .clickChosed {
      background-color: #3579f8;
      border-radius: 15px;
      .name {
        color: #fff;
        .address {
          color: #eee;
        }
      }

      .length {
        color: #fff;
      }
      .length1 {
        color: #fff;
      }
    }
    .close {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #fff;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 999;
      font-size: 10px;
      color: #ccc;
      text-align: center;
      i {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 20px;
        margin-top: 10px;
        background: url("../../assets/image/CHY-logo.png") no-repeat;
        background-size: 20px 20px;
      }
      .chy-name {
        width: 180px;
        height: 20px;
        line-height: 20px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 999;
        color: gray;
        font-size: 14px;
        background-color: #fff;
      }
      .close-button {
        width: 100px;
        height: 28px;
        line-height: 28px;
        color: #fff;
        background-color: #e75a4f;
        border-radius: 14px;
        text-align: center;
        margin: 0 auto;
      }
    }
    .search-input {
      width: 65%;
      height: 30px;
      background-color: #fff;
      z-index: 999;
      input {
        margin-top: 12px;
        margin-left: 20px;
        width: 85%;
        font-size: 14px;
      }
      .search-icon {
        width: 20px;
        height: 20px;
        background: url("../../assets/image/search-icon.png") no-repeat;
        background-size: 100% 100%;
        float: right;
        margin-top: 8px;
        margin-right: 20px;
      }
    }
    .search-list {
      width: 90%;
      height: 162px;
      box-sizing: border-box;
      border: 1px solid rgb(190, 185, 185);
      overflow-y: auto;
      background-color: #fff;
      position: fixed;
      left: 20px;
      bottom: 0px;
      z-index: 1999;
      .search-item {
        font-size: 13px;
        padding-left: 4px;
      }
    }
  }
  .act {
    overflow: hidden;
  }
}
</style>
