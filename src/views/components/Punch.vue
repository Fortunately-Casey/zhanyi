<template>
  <div class="punch">
    <div class="top-header">
      <div class="left">打卡方式</div>
      <div class="right">
        <div class="select-tab" :class="chosedType === 0? 'chosed':''" @click="choseType(0)">定点打卡</div>
        <div class="select-tab" :class="chosedType === 1? 'chosed':''" @click="choseType(1)">轨迹打卡</div>
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
    <mt-datetime-picker ref="startTime" type="datetime" v-model="startTime"></mt-datetime-picker>
    <mt-datetime-picker ref="endTime" type="datetime" v-model="endTime"></mt-datetime-picker>
  </div>
</template>
<script>
import DropDown from "@/components/DropDown.vue";
import { Toast } from "mint-ui";
import { Todate, chinaDateTime } from "@/common/tool/tool.js";
import { savePeriodPlace , startRoute } from "@/api/register.js";
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
      locationDetail:{
        routeName:"",
        bdx:"",
        bdy:""
      }
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
              self.bdx = result.point.lat;
              self.bdy = result.point.lng;
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
        publicShift: "苏F11111",
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
    getLocation() {
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
            console.log(result.surroundingPois)
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
    startRoute() {
      this.getLocation();
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
            background: url("../../assets/image/location.png") no-repeat;
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