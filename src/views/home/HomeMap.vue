<template>
  <div class="home-map">
    <div class="home-header">
      <div class="title">截止{{date}} 南通市疫情统计数据</div>
      <div class="open" @click="isShowMore = !isShowMore">{{isShowMore?"收起数据":"展开区县数据"}}</div>
      <div class="cart"></div>
      <div class="tabs">
        <div class="item confirm">
          <div class="value">{{patient}}</div>
          <div class="text">确诊</div>
        </div>
        <div class="item area">
          <div class="value">{{region}}</div>
          <div class="text">疫情小区</div>
        </div>
        <div class="item add-people">
          <div class="value">
            <span>昨日</span>
            +{{patientGain}}
          </div>
          <div class="text">新增确诊</div>
        </div>
        <div class="item add-area">
          <div class="value">
            <span>昨日</span>
            +{{regionGain}}
          </div>
          <div class="text">新增小区</div>
        </div>
      </div>
      <div class="table" v-if="isShowMore">
        <div class="header">
          <div class="area">区县</div>
          <div class="confirm-number">确诊人数</div>
          <div class="quarters">疫情小区数</div>
          <div class="people-number">昨日新增确诊总人数</div>
          <div class="quarters-number">昨日新增疫情小区数</div>
          <!-- <div class="date">统计日期</div> -->
        </div>
        <ul>
          <li v-for="(item,index) in dateList" :key="index">
            <div class="area">{{item.cityName}}</div>
            <div class="confirm-number">{{item.patient}}</div>
            <div class="quarters">{{item.region}}</div>
            <div class="people-number">{{item.patientGain}}</div>
            <div class="quarters-number">{{item.regionGain}}</div>
            <!-- <div class="date">{{item.dateString}}</div> -->
          </li>
        </ul>
      </div>
    </div>
    <div class="ch-logo"></div>
    <!-- <div
      class="button epidemic-button"
      :class="isshowEpidemic?'yellow-chosed':''"
      @click="showEpidemic"
    >
      <div class="icon" :class="isshowEpidemic?'open':'close'"></div>疫情小区
    </div>
    <div
      class="button trajectory-button"
      :class="isShowTrajectory?'red-chosed':''"
      @click="showTrajectory"
    >
      <div class="icon" :class="isShowTrajectory?'open':'close'"></div>确诊轨迹
    </div>-->
    <!-- <div class="button area-button" @click="showArea" :class="isShowArea?'red-chosed':''">
      <div class="icon" :class="isShowArea?'open':'close'"></div>疫区查看
    </div>-->
    <!-- <div
      class="button near-trajectory"
      :class="isShowNearTrajectory?'red-chosed':''"
      @click="showNearTrajectory"
    >
      <div class="icon" :class="isShowNearTrajectory?'open':'close'"></div>最近轨迹
    </div>-->
    <!--<div class="button near-area" :class="isShowNearArea?'yellow-chosed':''" @click="showNearArea">-->
    <!--<div class="icon" :class="isShowNearArea?'open':'close'"></div>最近疫区-->
    <!--</div>-->
    <div class="my-location" @click="clickMyLocation">
      <div class="location-icon"></div>我的位置
    </div>
    <div class="area-infowindow" v-if="isShowArea">
      <div class="top">
        疫情小区一览
        <div class="select">
          <drop-down
            :dropList="areaList"
            :chosedOption="chosedArea"
            :dropDownType="'selectArea'"
            @changeChoose="changeChoose"
          ></drop-down>
        </div>
      </div>
      <div class="table-title">{{chosedArea.name}} ({{patientList.length}}个小区)</div>
      <div class="info-table">
        <div class="header">
          <div class="index">序号</div>
          <div class="name">小区名称</div>
          <div class="option">操作</div>
        </div>
        <ul class="list">
          <li class="item" v-for="(item,index) in patientList" :key="index">
            <div class="index">{{item.id}}</div>
            <div class="name">{{item.regionName}}</div>
            <div class="option" @click="lookAt(item)">查看</div>
          </li>
        </ul>
      </div>
      <div class="close-button" @click="isShowArea = false">关闭</div>
    </div>
    <div :class="isShowSearchList?'sortList act':'sortList'" v-if="isShowSort">
      <div class="link">
        <span>附近疫情小区</span>
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
          <!-- <div class="search-icon" @click="keywordSearch"></div> -->
        </div>
      </div>
      <!--<div class="kuai"></div>-->
      <div class="search-list" v-if="isShowSearchList">
        <div
          v-for="(item,index) in searchList"
          :key="index"
          class="search-item"
          @click="setTo(item)"
        >{{item.name}}</div>
      </div>
      <div>
        <div
          class="sort-item"
          v-for="(item,index) in sortList"
          :key="index"
          @click="locationTo(item,index)"
          :class="clickIndex === index?'clickChosed':''"
        >
          <div class="name">
            {{item.id.regionName}}
            <div class="address">{{splitName(item.id.address)}}</div>
          </div>

          <div :class="index==0?'length1':'length'">
            <!--<div class="location"></div>-->
            <template v-if="index==0">
              <span>距您最近</span>
              &nbsp;&nbsp;&nbsp;{{(item.length/1000).toFixed(2)+ "km"}}
            </template>
            <template v-else>{{(item.length/1000).toFixed(2)+ "km"}}</template>
          </div>
        </div>
      </div>
      <div class="close">
        <!--<div class="close-button" @click="closeSort">关闭</div>-->
        数据来源：南通市疾病预防控制中心
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
  getPatient,
  getPatientTrail
} from "@/api/homeMap.js";
import { getCenterPoint, compare, blur } from "@/common/tool/tool.js";
import startIcon from "@/assets/image/startIcon.png";
import locIcon from "@/assets/image/blue-loc1.png";
import wx from "weixin-js-sdk";
import axios from "axios";
import { getURL } from "@/common/tool/tool";
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
      blueMark:"",
      pointCollection2:""
    };
  },
  created() {
    this.getDayStatisticsTotal();
    this.getDayStatisticsDetails();
    //  this.shareList('https://yqfk.ntschy.com/swnt.png', window.location.href, '南通市“战疫图”:' + this.date + ' 最新数据', '南通市“战疫图”:' + this.date + ' 最新数据');

    // this.drawPoint();
    // this.drawPloy();
  },
  mounted() {
    var vm = this;
    setTimeout(function() {
      vm.location();
      vm.showNearArea();
      vm.drawPloy();
    }, 1000);
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
    drawPoint() {
      getPatientTrail().then(resp => {
        var points = [];
        var myIcon = new BMap.Icon(startIcon, new BMap.Size(45, 45), {
          anchor: new BMap.Size(0, 0), //这句表示图片相对于所加的点的位置mapStart
          imageSize: new BMap.Size(30, 30) //图标所用的图片的大小，此功能的作用等同于CSS中的background-size属性。可用于实现高清屏的高清效果
          // offset: new BMap.Size(-10, 45), // 指定定位位置
          // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
        });
        // console.log(resp.data.data);
        resp.data.data.map(v => {
          if (v) {
            var pt = new BMap.Point(v.bdx, v.bdy);
            points.push(pt);
            var opts = {
              position: new BMap.Point(v.bdx, v.bdy), // 指定文本标注所在的地理位置
              offset: new BMap.Size(10, -30) //设置文本偏移量
            };
            var label = new BMap.Label(v.placeName, opts); // 创建文本标注对象
            label.setStyle({
              color: "red",
              fontSize: "12px",
              height: "20px",
              lineHeight: "20px",
              fontFamily: "微软雅黑"
            });
            window.baseMap.addOverlay(label);
          }
        });
        var options = {
          size: BMAP_POINT_SIZE_BIG,
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: "red"
        };
        var pointCollection = new BMap.PointCollection(points, options);
        window.baseMap.addOverlay(pointCollection);
      });
    },
    onblur() {
      var vm = this;
      vm.isShowSearchList = false;
    },
    lostblur() {
      blur();
    },
    drawPloy(point) {
      var vm = this; 
      getRegionData().then(resp => {
        var polyList = [];
        resp.data.data.map(item => {
          var path = [];
          path.push({
            lng: item.bdx,
            lat: item.bdy
          });
          var opts = {
            position: new BMap.Point(
              getCenterPoint(path).lng,
              getCenterPoint(path).lat
            ), // 指定文本标注所在的地理位置
            offset: new BMap.Size(10, -30) //设置文本偏移量
          };
          var label = new BMap.Label(item.regionName, opts); // 创建文本标注对象
          label.setStyle({
            color: "red",
            fontSize: "14px",
            padding: "0 8px",
            height: "24px",
            lineHeight: "24px",
            borderRadius: "12px",
            fontFamily: "微软雅黑"
          });
          window.baseMap.addOverlay(label);
          polyList.push(getCenterPoint(path));
          window.titleLabel = label;
        });
        var options = {
          size: BMAP_POINT_SIZE_BIGGER,
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: "red"
        };
        var pointCollection = new BMap.PointCollection(polyList, options);
        window.baseMap.addOverlay(pointCollection);
        if(point) {
          vm.drawBlue(point);
        }
      });
    },
    splitName(name) {
        return name.slice(3)
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
        this.shareList('https://yqfk.ntschy.com/swnt.png', window.location.href, '关注南通疫情，定位离你最近的疫区\n一图在手，疫情我有', '战疫图 • 南通');
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
        // window.baseMap.clearOverlays();
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
                  color: "red",
                  fontSize: "12px",
                  height: "20px",
                  lineHeight: "20px",
                  fontFamily: "微软雅黑"
                });
                window.baseMap.panTo(new BMap.Point(max.bdx, max.bdy));
                // window.baseMap.addOverlay(label);
                // window.baseMap.addOverlay(marker);
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
              anchor: new BMap.Size(5, 5),
              imageSize: new BMap.Size(40, 40)
            });
            var mk = new BMap.Marker(r.point, {
              icon: locPoint
            });
            vm.pointOne = r.point;
            window.baseMap.addOverlay(mk);
            window.baseMap.setZoom(17);
            window.baseMap.panTo(r.point);
          } else {
            alert("failed" + this.getStatus());
          }
        },
        { enableHighAccuracy: true }
      );
    },
    clickMyLocation() {
       var vm = this;
       vm.clickIndex = "";
       window.baseMap.clearOverlays();
       vm.drawPloy();
       vm.keyword = "";
      var geolocation = new BMap.Geolocation();
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
            vm.pointOne = r.point;
            window.baseMap.addOverlay(mk);
            window.baseMap.setZoom(17);
            window.baseMap.panTo(r.point);
            getRegionData().then(resp => {
              //   console.log(resp.data.data);
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
                  var pointB = new BMap.Point(v.centerPoint.lng, v.centerPoint.lat);
                  lengthList.push({
                    id: v.value,
                    length: window.baseMap.getDistance(pointA, pointB).toFixed(2),
                    path: v.path
                  });
                }
              });

              vm.sortList = lengthList.sort(compare("length"));
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
        // window.baseMap.clearOverlays();
      } else {
        getRegionData().then(resp => {
          //   console.log(resp.data.data);
          var polyList = [];
          resp.data.data.map(item => {
            var path = [];
            // var newStr = item.cors1.substr(0, item.cors1.length - 1);
            // newStr.split("],").map(v => {
            //   path.push({
            //     lng: v.substr(1).split(",")[0],
            //     lat: v.substr(1).split(",")[1]
            //   });
            // });
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
                vm.isShowSort = true;
                // console.log(sortList);
                // var max = lengthList.sort(function(a, b) {
                //   return a.length < b.length;
                // })[0];
                // console.log(max);
                // var maxList = [];
                // // var newStr = item.cors1.substr(0, item.cors1.length - 1);
                // max.path.map(v => {
                //   maxList.push(new BMap.Point(v.lng, v.lat));
                // });
                // var polygon = new BMap.Polygon(maxList, {
                //   strokeColor: "#FE8E00",
                //   strokeWeight: 2,
                //   strokeOpacity: 1,
                //   fillColor: "#FE8E00"
                // }); //创建多边形
                // var opts = {
                //   position: getCenterPoint(maxList), // 指定文本标注所在的地理位置
                //   offset: new BMap.Size(-60, -40) //设置文本偏移量
                // };
                // var label = new BMap.Label(max.id.regionName, opts); // 创建文本标注对象
                // label.setStyle({
                //   color: "red",
                //   fontSize: "12px",
                //   height: "20px",
                //   lineHeight: "20px",
                //   fontFamily: "微软雅黑"
                // });
                // polygon.regionID = item.id;

                this.isShowArea = false;
                // window.baseMap.addOverlay(label);
                // window.baseMap.panTo(getCenterPoint(maxList));
                // window.baseMap.setZoom(17);
                // window.baseMap.addOverlay(polygon); //增加多边形
                // var myIcon = new BMap.Icon(startIcon, new BMap.Size(45, 45), {
                //   anchor: new BMap.Size(0, 0), //这句表示图片相对于所加的点的位置mapStart
                //   imageSize: new BMap.Size(20, 20) //图标所用的图片的大小，此功能的作用等同于CSS中的background-size属性。可用于实现高清屏的高清效果
                //   // offset: new BMap.Size(-10, 45), // 指定定位位置
                //   // imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移
                // });
                // var marker = new BMap.Marker(new BMap.Point(max.bdx, max.bdy), {
                //   icon: myIcon
                // });
                // window.baseMap.panTo(new BMap.Point(max.bdx, max.bdy));
                // window.baseMap.addOverlay(marker);
                // var allOverlay = window.baseMap.getOverlays();
              } else {
                // alert("failed" + this.getStatus());
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
        color: "red",
        fontSize: "12px",
        height: "20px",
        lineHeight: "20px",
        fontFamily: "微软雅黑"
      });
      polygon.regionID = item.id;
      polygon.addEventListener("click", function() {
        //   alert(this.regionID)
        alert("1111");
      });
      this.isShowArea = false;
      window.baseMap.addOverlay(label);
      window.baseMap.setZoom(17);
      window.baseMap.panTo(getCenterPoint(pointList));
      window.baseMap.addOverlay(polygon); //增加多边形
      // getPatient({
      //     regionID:item.id
      // }).then((resp) => {
      //     console.log(resp)
      // })
    },
    drawBlue(point,name) {
        var vm = this;
        window.baseMap.removeOverlay(vm.pointCollection2);
        var points2 = [point]; 
        // window.baseMap.removeOverlay(vm.blueMaker);
        var allOverlay = window.baseMap.getOverlays();
        var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(10, -30) //设置文本偏移量
        };
        var options2 = {
            size: BMAP_POINT_SIZE_BIGGER,
            shape: BMAP_POINT_SHAPE_CIRCLE,
            color: 'blue'
        }
        var locPoint = new BMap.Icon(locIcon, new BMap.Size(40, 40), {
              anchor: new BMap.Size(20, 10),
              imageSize: new BMap.Size(40, 40)
            });
        vm.blueMark = new BMap.Marker(point, {
            icon: locPoint
        });
        vm.blueMark.name = "blueMark";
        vm.pointCollection2 = new BMap.PointCollection(points2, options2);
         //  pointCollection2.setTop(true);
        window.baseMap.addOverlay(vm.pointCollection2);
    },
    locationTo(item,index) {
      var vm = this;
      vm.clickIndex = index;
      if (vm.isShowSearchList) {
        vm.isShowSearchList = false;
      } else {
        var point = new BMap.Point(
          getCenterPoint(item.path).lng,
          getCenterPoint(item.path).lat
        );
        vm.pointTwo = point;
        vm.drawBlue(point);
        window.baseMap.setViewport([vm.pointOne, vm.pointTwo], {
          margins: [90, 30, 220, 30]
        });
        var allOverlay = window.baseMap.getOverlays();
        var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(10, -30) //设置文本偏移量
        };
        for (var i = 0; i < allOverlay.length -1; i++){
          if(allOverlay[i].getLabel) {
            console.log(allOverlay[i].getLabel());
            if(allOverlay[i].getLabel()&&allOverlay[i].getLabel().content == item.id.regionName){
              console.log(allOverlay[i].getLabel().content,'11111')
              return false;
            }
          }
        }
      }
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
            // document.getElementById("r-result").innerHTML = s.join("<br/>");
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
      window.baseMap.clearOverlays();
      vm.drawPloy();
      var locPoint = new BMap.Icon(locIcon, new BMap.Size(25, 25), {
        anchor: new BMap.Size(5, 5),
        imageSize: new BMap.Size(25, 25)
      });
      //   console.log(new BMap.Point(item.lng,item.lat))
      var mk = new BMap.Marker(new BMap.Point(item.lng, item.lat), {
        icon: locPoint
      });
      vm.pointOne = new BMap.Point(item.lng, item.lat);
      window.baseMap.addOverlay(mk);
      window.baseMap.setZoom(17);
      window.baseMap.panTo(new BMap.Point(item.lng, item.lat));

      getRegionData().then(resp => {
        //   console.log(resp.data.data);
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
        console.log(polyList);

        vm.isShowNearArea = !vm.isShowNearArea;
      });
    },
    showNantongCH() {
      this.isShowName = true;
      setTimeout(() => {
        this.isShowName = false;
      }, 2000);
    }
  },
  components: {
    MMap,
    DropDown
  }
};
</script>
<style lang="less" scoped>
.home-map {
  height: 100%;
  position: relative;
  .home-header {
    width: 90%;
    // height: 75px;
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
          height:30px;
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
      // background-color: red;
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
    background-color: #d22d2d;
    color: #fff;
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
    // height: 250px;
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
        padding-left: 10px;
        line-height: 40px;
      }
    }

    .sort-item {
      //   display: flex;
      height: 30px;
      font-size: 14px;
      .name {
        padding-left: 10px;
        line-height: 30px;
        box-sizing: border-box;
        // flex: 1;
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
        // flex: 1;
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
      background-color: rgb(39, 39, 253);
      border-radius: 15px;
      .name {
        color: #fff;
      }
      .length {
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
      /*position: fixed;*/
      /*left: 40%;*/
      /*bottom: 160px;*/
      z-index: 999;
      input {
        /*float: left;*/
        margin-top: 12px;
        margin-left: 20px;
        width: 85%;
        font-size:14px;
        // width: calc(100% - 85px);
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
      //   box-shadow: 2px 2px 3px #ccdbec;
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