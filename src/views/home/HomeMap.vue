<template>
  <div class="home-map">
    <div class="home-header">
      <div class="title">截止{{date}} 12:00 南通数据统计</div>
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
    <div
      class="button near-trajectory"
      :class="isShowNearTrajectory?'red-chosed':''"
      @click="showNearTrajectory"
    >
      <div class="icon" :class="isShowNearTrajectory?'open':'close'"></div>最近轨迹
    </div>
    <div class="button near-area" :class="isShowNearArea?'yellow-chosed':''" @click="showNearArea">
      <div class="icon" :class="isShowNearArea?'open':'close'"></div>最近疫区
    </div>
    <div class="my-location" @click="location">
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
    <div class="sortList" v-if="isShowSort">
      <div>
        <div
          class="sort-item"
          v-for="(item,index) in sortList"
          :key="index"
          @click="locationTo(item)"
        >
          <div class="name">{{item.id.regionName}}</div>
          <div class="length">
            <div class="location"></div>
            {{(item.length/1000).toFixed(2)+ "km"}}
          </div>
        </div>
      </div>
      <div class="close">
          <div class="close-button" @click="closeSort">关闭</div>
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
import { getCenterPoint, compare } from "@/common/tool/tool.js";
import startIcon from "@/assets/image/startIcon.png";
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
      sortList: []
    };
  },
  created() {
    this.getDayStatisticsTotal();
    this.getDayStatisticsDetails();
    this.drawPoint();
    this.drawPloy();
  },
  methods: {
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
        console.log(points);
        var pointCollection = new BMap.PointCollection(points, options);
        window.baseMap.addOverlay(pointCollection);
      });
      //   for (; i < MAX; i++) {
      //     pt = new BMap.Point(Math.random() * 40 + 85, Math.random() * 30 + 21);
      //     markers.push(new BMap.Marker(pt));
      //   }
      //   //最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
      //   var markerClusterer = new BMapLib.MarkerClusterer(map, {
      //     markers: markers
      //   });
    },
    drawPloy() {
      getRegionData().then(resp => {
        var polyList = [];
        resp.data.data.map(item => {
          var path = [];
          var newStr = item.cors1.substr(0, item.cors1.length - 1);
          newStr.split("],").map(v => {
            path.push({
              lng: v.substr(1).split(",")[0],
              lat: v.substr(1).split(",")[1]
            });
          });
          //   console.log(item)
          //   var pt = new BMap.Point(getCenterPoint(path).lng, getCenterPoint(path).lat);
          //   points.push(pt);
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
            fontSize: "12px",
            height: "20px",
            lineHeight: "20px",
            fontFamily: "微软雅黑"
          });
          window.baseMap.addOverlay(label);
          polyList.push(getCenterPoint(path));
        });
        var options = {
          size: BMAP_POINT_SIZE_BIG,
          shape: BMAP_POINT_SHAPE_CIRCLE,
          color: "red"
        };
        console.log(polyList);
        var pointCollection = new BMap.PointCollection(polyList, options);
        window.baseMap.addOverlay(pointCollection);
      });
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
                console.log(max);
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
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition(
        function(r) {
          if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMap.Marker(r.point);
            window.baseMap.addOverlay(mk);
            window.baseMap.panTo(r.point);
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
        window.baseMap.clearOverlays();
      } else {
        getRegionData().then(resp => {
          //   console.log(resp.data.data);
          var polyList = [];
          resp.data.data.map(item => {
            var path = [];
            var newStr = item.cors1.substr(0, item.cors1.length - 1);
            newStr.split("],").map(v => {
              path.push({
                lng: v.substr(1).split(",")[0],
                lat: v.substr(1).split(",")[1]
              });
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
                // window.baseMap.setZoom(16);
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
          console.log(polyList);

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
      console.log(item.id);
      polygon.regionID = item.id;
      polygon.addEventListener("click", function() {
        //   alert(this.regionID)
        alert("1111");
      });
      this.isShowArea = false;
      window.baseMap.addOverlay(label);
      window.baseMap.panTo(getCenterPoint(pointList));
      window.baseMap.setZoom(16);
      window.baseMap.addOverlay(polygon); //增加多边形
      // getPatient({
      //     regionID:item.id
      // }).then((resp) => {
      //     console.log(resp)
      // })
    },
    locationTo(item) {
      var point = new BMap.Point(
        getCenterPoint(item.path).lng,
        getCenterPoint(item.path).lat
      );
      window.baseMap.panTo(point);
      window.baseMap.setZoom(16);
    },
    closeSort() {
        this.isShowNearArea = false;
        this.isShowSort = false;
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
      font-size: 10px;
      position: absolute;
      left: 8px;
      top: 6px;
    }
    .open {
      font-size: 10px;
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
          line-height: 25px;
          font-size: 22px;
          border-right: 1px solid rgba(216, 214, 214, 0.712);
          span {
            font-size: 14px;
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
          font-size: 10px;
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
            font-size: 10px;
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
    height: 20px;
    line-height: 20px;
    text-align: right;
    position: absolute;
    right: 15px;
    top: 100px;
    z-index: 999;
    font-size: 13px;
    color: #d22c2c;
    .location-icon {
      width: 15px;
      height: 12px;
      background: url("../../assets/image/location.png") no-repeat;
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
    height: 190px;
    padding-top: 10px;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 999;
    background-color: #fff;
    border-top: 1px solid rgb(224, 223, 223);
    overflow-y: auto;
    .sort-item {
      display: flex;
      height: 30px;
      font-size: 14px;
      .name {
        padding-left: 20px;
        line-height: 30px;
        box-sizing: border-box;
        flex: 1;
      }
      .length {
        padding-right: 20px;
        text-align: right;
        line-height: 30px;
        box-sizing: border-box;
        flex: 1;
        position: relative;
        .location {
          width: 12px;
          height: 12px;
          background: url("../../assets/image/record1.png") no-repeat;
          background-size: 100% 100%;
          position: absolute;
          top: 50%;
          right: 100px;
          transform: translateY(-50%);
        }
      }
    }
    .close {
      width: 100%;
      height: 40px;
      background-color: #fff;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 999;
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
  }
}
</style>