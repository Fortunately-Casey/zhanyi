<template>
  <div class="punch">
    <div class="top-header">
      <div class="left">打卡方式</div>
      <div class="right">
        <div class="select-tab" :class="chosedType === 0? 'chosed':''" @click="choseType(0)">定点打卡</div>
        <div
          class="select-tab"
          :class="chosedType === 1||chosedType === 2? 'chosed':''"
          @click="choseType(1)"
        >轨迹打卡</div>
      </div>
    </div>
    <div class="main">
      <div class="item">
        <div class="left">体温</div>
        <div class="right">
          <input type="text" class="temperature" v-model="temp" />
          <span class="history-temperature">历史体温</span>
        </div>
      </div>
      <div class="item">
        <div class="left">症状</div>
        <div class="right">
          <div class="select" :class="health1?'chosed':''" @click="choseOne">正常</div>
          <div class="select" :class="health2?'chosed':''" @click="choseTwo">咳嗽</div>
          <div class="select" :class="health3?'chosed':''" @click="choseThree">发热</div>
          <div class="select" :class="health4?'chosed':''" @click="choseFour">其他</div>
        </div>
      </div>
      <div class="item">
        <div class="left"></div>
        <div class="right">
          <input
            type="text"
            placeholder="其他症状"
            class="address"
            v-model="otherHealth"
            :disabled="!health4"
          />
        </div>
      </div>
      <div v-if="chosedType === 0">
        <div class="item">
          <div class="left">出行方式</div>
          <div class="right">
            <div class="select" :class="trip === 0?'chosed':''" @click="choseTrip(0)">出入场所</div>
            <div class="select" :class="trip === 1?'chosed':''" @click="choseTrip(1)">使用交通</div>
          </div>
        </div>
        <div class="item">
          <div class="left"></div>
          <div class="right" v-if="trip === 0">
            <input type="text" placeholder="填写地址" class="address" v-model="address" />
            <div class="location" @click="addressDetail">
              <div class="icon"></div>当前定位
            </div>
          </div>
          <div class="right" v-if="trip === 1">
            <drop-down
              :dropList="carList"
              :chosedOption="chosedCar"
              :dropDownType="'car'"
              @changeChoose="changeChoose"
            ></drop-down>
            <input type="text" placeholder="车牌、班次信息" class="carInfo" v-model="publicShift" />
          </div>
        </div>
        <div class="item">
          <div class="left">进入时间</div>
          <div class="right">
            <button @click="choseStart">选择</button>
            <span class="time">{{startTime?returnDate(startTime):''}}</span>
            <span class="now" @click="startTime = new Date()">现在</span>
          </div>
        </div>
        <div class="item">
          <div class="left">离开时间</div>
          <div class="right">
            <button @click="choseEnd">选择</button>
            <span class="time">{{endTime?returnDate(endTime):''}}</span>
            <span class="now" @click="endTime = new Date()">现在</span>
          </div>
        </div>
      </div>
      <div class="item">
        <div class="left">其他</div>
        <div class="right">
          <input type="text" class="other" v-model="other" />
        </div>
      </div>
    </div>
    <div class="punch-button" v-if="chosedType === 0" @click="savePeriodPlace">点击打卡</div>
    <div class="punch-button" v-if="chosedType === 1" @click="startRoute">开始行使</div>
    <div class="punch-button" v-if="chosedType === 2" @click="endRoute">结束打卡</div>
    <mt-datetime-picker ref="startTime" type="datetime" v-model="startTime"></mt-datetime-picker>
    <mt-datetime-picker ref="endTime" type="datetime" v-model="endTime"></mt-datetime-picker>
  </div>
</template>
<script>
import DropDown from "@/components/DropDown.vue";
import { Toast } from "mint-ui";
import {
  Todate,
  chinaDateTime,
  addStartMarker,
  drowLine
} from "@/common/tool/tool.js";
import {
  savePeriodPlace,
  startRoute,
  saveRouteDetail,
  endRoute
} from "@/api/register.js";
// import locationIcon from "@/assets/image/location.png";
export default {
  data() {
    return {
      chosedType: 0,
      trip: 0,
      carList: [
        {
          name: "公交车"
        },
        {
          name: "出租"
        },
        {
          name: "火车"
        }
      ],
      chosedCar: {
        name: "公交车"
      },
      startTime: "",
      endTime: "",
      address: "",
      health1: false,
      health2: false,
      health3: false,
      health4: false,
      bdx: "",
      bdy: "",
      temp: "",
      other: "",
      otherHealth: "",
      publicShift: "",
      locationDetail: {
        routeName: "",
        bdx: "",
        bdy: "",
        routeID: ""
      },
      timer: "",
      PointArr: [
        // { lat: 36.10339957700999, lng: 120.4207801005104 },
        // { lat: 36.10349055332635, lng: 120.42113539348455 },
        // { lat: 36.10370795896673, lng: 120.42162977768736 },
        // { lat: 36.10411490190429, lng: 120.42166901055167 },
        // { lat: 36.104232027406695, lng: 120.42185015059275 },
        // { lat: 36.10425620255758, lng: 120.42202022562539 },
        // { lat: 36.104265908631284, lng: 120.42208225102176 },
        // { lat: 36.104399968669526, lng: 120.42187425183421 },
        // { lat: 36.10452708476511, lng: 120.42076268466177 },
        // { lat: 36.10480132817409, lng: 120.4196557913201 },
        // { lat: 36.10560773716036, lng: 120.418951386886 },
        // { lat: 36.10621159088823, lng: 120.41900182905378 },
        // { lat: 36.1064641068988, lng: 120.41992809616544 },
        // { lat: 36.10679444086644, lng: 120.42102125032955 },
        // { lat: 36.107010189089046, lng: 120.42182982905027 },
        // { lat: 36.107014665948654, lng: 120.42193587265254 },
        // { lng: 120.42201589513277, lat: 36.10700627324672 },
        // { lng: 120.42201589513277, lat: 36.10700627324672 },
        // { lng: 120.42236704579075, lat: 36.10708566579729 },
        // { lng: 120.42269817692573, lat: 36.107201270041955 },
        // { lng: 120.42239277578172, lat: 36.10812797579566 },
        // { lng: 120.42175457671763, lat: 36.10947659586882 },
        // { lng: 120.42144906678747, lat: 36.11028554037044 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.4213722360578, lat: 36.110547069787465 },
        // { lng: 120.42134433787885, lat: 36.110691285540966 },
        // { lng: 120.42234193234574, lat: 36.110931417305515 },
        // { lng: 120.42374305054953, lat: 36.11109804633305 },
        // { lng: 120.42478859440246, lat: 36.111102173671576 },
        // { lng: 120.42606467439863, lat: 36.11129314178323 },
        // { lng: 120.4274220550685, lat: 36.11148065963647 },
        // { lng: 120.42831965719076, lat: 36.111638311669736 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42839951065358, lat: 36.11164240198062 },
        // { lng: 120.42869196887202, lat: 36.1116737914188 },
        // { lng: 120.43031048017785, lat: 36.11190642360766 },
        // { lng: 120.43239173942534, lat: 36.11229570404404 },
        // { lng: 120.43368467575368, lat: 36.11281195352835 },
        // { lng: 120.43371757862009, lat: 36.11284016439977 },
        // { lng: 120.43379230066179, lat: 36.11284161798212 },
        // { lng: 120.43441423254144, lat: 36.113205746094536 },
        // { lng: 120.43549342023326, lat: 36.11391074053337 },
        // { lng: 120.43637497341942, lat: 36.11441797319607 },
        // { lng: 120.4365024200745, lat: 36.11445405475196 },
        // { lng: 120.43670459776231, lat: 36.11458083085174 },
        // { lng: 120.43745246924915, lat: 36.11507070008782 },
        // { lng: 120.43821097991501, lat: 36.115416050767585 },
        // { lng: 120.43821097991501, lat: 36.115416050767585 },
        // { lng: 120.43821097991501, lat: 36.115416050767585 },
        // { lng: 120.43821097991501, lat: 36.115416050767585 },
        // { lng: 120.43821097991501, lat: 36.115416050767585 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43823585473245, lat: 36.11541929557907 },
        // { lng: 120.43859812511984, lat: 36.115583971494395 },
        // { lng: 120.43901701857004, lat: 36.115714318017346 },
        // { lng: 120.43928467292172, lat: 36.11582517772885 },
        // { lng: 120.43959708522435, lat: 36.115963587312805 },
        // { lng: 120.43986466921422, lat: 36.116047547858166 },
        // { lng: 120.44007952157578, lat: 36.11611896447754 },
        // { lng: 120.440167025596, lat: 36.11612294605039 },
        // { lng: 120.440167025596, lat: 36.11612294605039 },
        // { lng: 120.44024360205321, lat: 36.116138815526504 },
        // { lng: 120.44024360205321, lat: 36.116138815526504 },
        // { lng: 120.44024360205321, lat: 36.116138815526504 },
        // { lng: 120.44026150723737, lat: 36.11614702160796 },
        // { lng: 120.44027344364953, lat: 36.11615215895656 },
        // { lng: 120.44027344364953, lat: 36.11615215895656 },
        // { lng: 120.44028836484941, lat: 36.1161593311561 },
        // { lng: 120.44034209724579, lat: 36.116201960713745 },
        // { lng: 120.44048233691922, lat: 36.116254585044935 },
        // { lng: 120.44048233691922, lat: 36.116254585044935 },
        // { lng: 120.4405738257871, lat: 36.116276646228826 },
        // { lng: 120.44073595695149, lat: 36.11635856195875 },
        // { lng: 120.44115463412841, lat: 36.11652357056175 },
        // { lng: 120.44118546544034, lat: 36.11653994619434 },
        // { lng: 120.44118546544034, lat: 36.11653994619434 },
        // { lng: 120.44121529948468, lat: 36.1165533090833 }
      ]
    };
  },
  methods: {
    // 选择打卡类型
    choseType(index) {
      this.chosedType = index;
    },
    // 选择出行方式
    choseTrip(index) {
      this.trip = index;
    },
    changeChoose(val) {
      if (val.type === "car") {
        this.chosedCar = val.value;
      }
    },
    returnDate(value) {
      return chinaDateTime(value.toString());
    },
    choseStart() {
      this.$refs.startTime.open();
    },
    choseEnd() {
      this.$refs.endTime.open();
    },
    addressDetail() {
      //获取地理位置
      var self = this;
      //全局的this在方法中不能使用，需要重新定义一下
      var geolocation = new BMap.Geolocation();
      //调用百度地图api 中的获取当前位置接口
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //获取当前位置经纬度
          var myGeo = new BMap.Geocoder();
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(
            result
          ) {
            if (result.address) {
              var mk = new BMap.Marker(r.point);
              window.baseMap.addOverlay(mk);
              window.baseMap.panTo(r.point);
              Toast({
                message: "定位成功！",
                iconClass: "icon icon-success"
              });
              self.address = result.address;
              self.bdx = result.point.lng;
              self.bdy = result.point.lat;
            }

            // if (result) {
            //   //根据当前位置经纬度解析成地址
            //   self.ADDRESS_DETAIL(
            //     result.addressComponents.district +
            //       result.addressComponents.street
            //   );

            //   self.geohash = result.point.lat + "," + result.point.lng;
            //   self.SAVE_GEOHASH(self.geohash);

            //   self.latitude = result.point.lat;
            //   self.longitude = result.point.lng;
            //   // console.log(result.point.lat); self.RECORD_ADDRESS({'latitude':result.point.lat,'longitude':result.point.lng});
            // }
          });
        }
      });
    },
    choseOne() {
      if (this.health2 || this.health3 || this.health4) {
        Toast({
          message: "正常和有症状不能同时选择!",
          iconClass: "icon icon-success"
        });
        return;
      } else {
        this.health1 = !this.health1;
      }
    },
    choseTwo() {
      if (this.health1) {
        Toast({
          message: "正常和有症状不能同时选择!",
          iconClass: "icon icon-success"
        });
        return;
      } else {
        this.health2 = !this.health2;
      }
    },
    choseThree() {
      if (this.health1) {
        Toast({
          message: "正常和有症状不能同时选择!",
          iconClass: "icon icon-success"
        });
        return;
      } else {
        this.health3 = !this.health3;
      }
    },
    choseFour() {
      if (this.health1) {
        Toast({
          message: "正常和有症状不能同时选择!",
          iconClass: "icon icon-success"
        });
        return;
      } else {
        this.health4 = !this.health4;
      }
    },
    savePeriodPlace() {
      var vm = this;
      var params = {
        idCard: vm.$route.query.IDCard,
        placeName: vm.address,
        publicType: vm.chosedCar.name,
        publicShift: vm.publicShift,
        posX: "",
        posY: "",
        bdx: vm.bdx,
        bdy: vm.bdy,
        stime: vm.returnDate(vm.startTime),
        etime: vm.returnDate(vm.endTime),
        healthy1: vm.health1,
        healthy2: vm.health2,
        healthy3: vm.health3,
        healthy4: vm.otherHealth,
        temp: vm.temp,
        remarks: vm.other
      };
      // var local = new BMap.LocalSearch(window.baseMap, {
      //   renderOptions: { map: window.baseMap }
      // });
      // local.search("大润发", res => {
      //   console.log(res);
      // });
      savePeriodPlace(params).then(resp => {
        if (resp.data.success) {
          Toast({
            message: "打卡成功！",
            iconClass: "icon icon-success"
          });
          vm.$emit("closePunch");
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    getLocation(value) {
      //获取地理位置
      var self = this;
      //全局的this在方法中不能使用，需要重新定义一下
      var geolocation = new BMap.Geolocation();
      //调用百度地图api 中的获取当前位置接口
      geolocation.getCurrentPosition(function(r) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
          //获取当前位置经纬度
          var myGeo = new BMap.Geocoder();
          myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), function(
            result
          ) {
            if (result.surroundingPois.length > 0) {
              self.locationDetail.routeName = result.surroundingPois[0].title;
              self.locationDetail.bdx = result.surroundingPois[0].point.lng;
              self.locationDetail.bdy = result.surroundingPois[0].point.lat;
              self.PointArr.push({
                lng: result.surroundingPois[0].point.lng,
                lat: result.surroundingPois[0].point.lat
              });
            } else {
              self.locationDetail.routeName = "";
              self.locationDetail.bdx = result.point.lng;
              self.locationDetail.bdy = result.point.lat;
              self.PointArr.push({
                lng: result.point.lng,
                lat: result.point.lat
              });
            }
            value();
            // console.log(self.locationDetail.routeName)
            // self.locationDetail.routeName = result.surroundingPois
            // if (result.address) {
            //   // var mk = new BMap.Marker(r.point);
            //   // window.baseMap.addOverlay(mk);
            //   // window.baseMap.panTo(r.point);
            //   // Toast({
            //   //   message: "定位成功！",
            //   //   iconClass: "icon icon-success"
            //   // });
            //   // self.address = result.address;
            //   // self.bdx = result.point.lat;
            //   // self.bdy = result.point.lng;
            // }
          });
        }
      });
    },
    // 开始打卡请求
    startRequest() {
      var vm = this;
      console.log(vm.locationDetail.routeName);
      var params = {
        idCard: vm.$route.query.IDCard,
        routeName: vm.locationDetail.routeName,
        healthy1: vm.health1,
        healthy2: vm.health2,
        healthy3: vm.health3,
        healthy4: vm.otherHealth,
        temp: vm.temp,
        status: 1
      };
      startRoute(params).then(resp => {
        if (resp.data.success) {
          vm.locationDetail.routeID = resp.data.data.routeID;
          window.baseMap.centerAndZoom(vm.PointArr, 14); // 根据经纬度显示地图的范围

          vm.getLocation(vm.saveRouteDetail);
          console.log(vm.PointArr);
          window.baseMap.setViewport(vm.PointArr); // 根据提供的地理区域或坐标设置地图视野
          addStartMarker(
            new BMap.Point(vm.PointArr[0].lng, vm.PointArr[0].lat),
            "起点",
            window.baseMap
          );
          var carMk; //先将终点坐标展示的mark对象定义
          var i = 0;
          vm.timer = setInterval(() => {
            vm.getLocation(vm.saveRouteDetail);
            console.log(vm.PointArr);
            if (i >= vm.PointArr.length) {
              clearInterval(interval);
              return;
            }
            drowLine(
              window.baseMap,
              vm.PointArr[i],
              vm.PointArr[i + 1],
              carMk
            ); //画线调用
            i = i + 1;
          }, 10000);
          Toast({
            message: "打卡开始！",
            iconClass: "icon icon-success"
          });
          vm.$emit("closePunch");
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    // 开始打卡
    startRoute() {
      var vm = this;
      vm.chosedType = 2;
      vm.getLocation(vm.startRequest);
    },
    // 发送坐标请求
    saveRouteDetail() {
      var vm = this;
      var params = {
        routeID: vm.locationDetail.routeID,
        bdx: vm.locationDetail.bdx,
        bdy: vm.locationDetail.bdy
      };
      saveRouteDetail(params).then(resp => {
        if (resp.data.success) {
          Toast({
            message: resp.data.data,
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
    // 打卡结束
    endRoute() {
      var vm = this;
      vm.chosedType = 1;
      var params = {
        routeID: vm.locationDetail.routeID
      };
      // 关闭定时器
      clearInterval(vm.timer);
      endRoute(params).then(resp => {
        if (resp.data.success) {
          Toast({
            message: "打卡成功!",
            iconClass: "icon icon-success"
          });
        } else {
          Toast({
            message: "打卡失败!",
            iconClass: "icon icon-success"
          });
        }
      });
    }
  },
  components: {
    DropDown
  }
};
</script>
<style lang="less">
.punch {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 999;
  width: 100%;
  display: block;
  /* height: 60%; */
  padding: 0 30px;
  box-sizing: border-box;
  background-color: #fff;
  .top-header,
  .item {
    height: 30px;
    margin-top: 5px;
    font-size: 13px;
    display: flex;

    .left {
      height: 30px;
      color: #696969;
      line-height: 30px;
      width: 25%;
      text-align: center;
    }

    .right {
      height: 30px;
      width: 75%;
      display: flex;
      justify-content: flex-start;

      .select-tab {
        color: #cbcbcb;
        width: 65px;
        height: 26px;
        border: 1px solid #cbcbcb;
        text-align: center;
        line-height: 26px;
        margin-left: 10px;
        margin-top: 2px;
        border-radius: 5px;
      }

      .chosed {
        border-color: #dc534c;
        color: #dc534c;
      }
    }
  }

  .main {
    .item {
      height: 30px;
      margin-top: 5px;
      font-size: 13px;

      .right {
        .temperature {
          width: 80px;
        }

        .time {
          width: 120px;
          text-align: center;
          line-height: 30px;
          padding-left: 5px;
        }

        .now {
          line-height: 30px;
          color: #dc534c;
        }

        .history-temperature {
          line-height: 30px;
          color: #dc534c;
        }

        .select {
          color: #cbcbcb;
          height: 26px;
          border: 1px solid #cbcbcb;
          text-align: center;
          line-height: 26px;
          margin-left: 10px;
          margin-top: 2px;
          border-radius: 5px;
          padding: 0 3px;
        }

        .chosed {
          border-color: #dc534c;
          color: #dc534c;
        }

        .address {
          width: 170px;
        }

        .carInfo {
          width: 100px;
        }

        .other {
          width: 150px;
        }

        .location {
          width: 65px;
          height: 30px;
          line-height: 30px;
          /* background-color: red; */
          font-size: 12px;
          text-align: right;
          color: #dc534c;

          .icon {
            width: 16px;
            height: 14px;
            background: url("../../../assets/image/location.png") no-repeat;
            float: left;
            margin-top: 7px;
          }
        }
      }
    }
  }

  .punch-button {
    width: 290px;
    height: 40px;
    background-color: #e6584e;
    color: #fff;
    line-height: 40px;
    text-align: center;
    border-radius: 20px;
    margin: 10px auto;
  }
}
</style>