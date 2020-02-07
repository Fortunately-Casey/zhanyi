<template>
  <div class="register">
    <div class="logo"></div>
    <div class="register-box">
      <div class="name-and-phone">
        <input
          type="text"
          class="name"
          placeholder="姓名"
          v-model="username"
          @blur="lostblur('username')"
        />
        <input type="text" class="phone" placeholder="电话" v-model="phone" @blur="lostblur('phone')" />
      </div>
      <input
        type="text"
        class="idNumber"
        placeholder="身份证号"
        v-model="usernumber"
        @blur="lostblur('usernumber')"
      />
      <div class="address">
        <div class="label">家庭住址</div>
        <div class="value">
          <div class="top">
            <drop-down
              :dropList="cityList"
              :chosedOption="chosedCity"
              :dropDownType="'city'"
              @changeChoose="changeChoose"
            ></drop-down>
            <drop-down
              :dropList="areaList"
              :chosedOption="chosedArea"
              :dropDownType="'area'"
              @changeChoose="changeChoose"
            ></drop-down>
            <drop-down
              :dropList="areaList[areaIndex].streets"
              :chosedOption="chosedStreet"
              :dropDownType="'street'"
              @changeChoose="changeChoose"
            ></drop-down>
          </div>
          <div class="bottom">
            <input
              type="text"
              placeholder="具体地址"
              class="specific-address"
              v-model="specificAddress"
              @blur="lostblur"
            />
          </div>
        </div>
      </div>
      <div class="cross">
        <div class="label">是否途径疫区？</div>
        <div class="value">
          <div class="top">
            <div
              class="city"
              v-for="(item,index) in citys"
              :key="index"
              :class="choosedCity===index?'chosed':''"
              @click="choseCity(index)"
            >{{item.name}}</div>
          </div>
          <div class="bottom">
            <input
              type="text"
              placeholder="途径地区"
              class="cross-city"
              v-model="crossCity"
              :disabled="choosedCity==3?false:true"
              @blur="lostblur"
            />
          </div>
        </div>
      </div>
      <div class="arrive-time">
        <div class="label">到通日期</div>
        <div class="value">
          <button @click="openPicker">选择</button>
          <span v-if="pickerValue">{{returnDate(pickerValue)}}</span>
        </div>
      </div>
      <div class="register-button" @click="saveUserInfo">注册</div>
    </div>
    <div class="bottom-box">
      <div class="little-left"></div>
      <div class="little-right"></div>
      <div class="logo-bottom"></div>
    </div>
    <mt-datetime-picker
      ref="picker"
      v-model="pickerValue"
      type="date"
      year-format="{value} 年"
      month-format="{value} 月"
      date-format="{value} 日"
    ></mt-datetime-picker>
  </div>
</template>
<script>
import DropDown from "@/components/DropDown.vue";
import { Toast } from "mint-ui";
import { Todate, blur, chinaDateTime } from "@/common/tool/tool.js";
import { saveUserInfo } from "@/api/register.js";
import { cityData } from "@/common/data.js";

export default {
  data() {
    return {
      citys: [
        {
          name: "湖北省"
        },
        {
          name: "武汉市"
        },
        {
          name: "温州市"
        },
        {
          name: "其他"
        }
      ],
      choosedCity: 0,
      cityList: [
        {
          name: "南通"
        }
      ],
      areaList: cityData,
      areaIndex: 0,
      chosedCity: {
        name: "南通"
      },
      chosedArea: {
        name: "崇川区"
      },
      chosedStreet: {
        name: "观音山街道"
      },
      pickerValue: "",
      username: "",
      phone: "",
      usernumber: "",
      specificAddress: "",
      crossCity: "",
      isOther: false
    };
  },
  computed: {},
  methods: {
    choseCity(index) {
      this.choosedCity = index;
    },
    changeChoose(val) {
      if (val.type === "city") {
        this.chosedCity = val.value;
      } else if (val.type === "area") {
        this.chosedArea = val.value;
        this.areaIndex = val.index;
        this.chosedStreet = this.areaList[val.index].streets[0];
      } else if (val.type === "street") {
        this.chosedStreet = val.value;
      }
    },
    openPicker() {
      this.$refs.picker.open();
    },
    returnDate(value) {
      return Todate(value);
    },
    lostblur(value) {
      var vm = this;
      if (value === "username") {
        vm.nameReg(vm.username);
      } else if (value === "phone") {
        vm.phoneReg(vm.phone);
      } else if (value === "usernumber") {
        vm.userNumberReg(vm.usernumber)
      }
      blur();
    },
    saveUserInfo() {
      var vm = this;
      var importArea =
        vm.choosedCity === 3 ? vm.crossCity : vm.citys[vm.choosedCity].name;
      var params = {
        idCard: vm.usernumber,
        name: vm.username,
        city: vm.chosedCity.name,
        country: vm.chosedArea.name,
        street: vm.chosedStreet.name,
        address: vm.specificAddress,
        mobile: vm.phone,
        wxID: vm.$route.query.WxId,
        importArea: importArea ? importArea : "",
        dtDate: vm.pickerValue ? vm.returnDate(vm.pickerValue) : ""
      };
      saveUserInfo(params).then(resp => {
        if (resp.data.success) {
          Toast({
            message: "注册成功！",
            iconClass: "icon icon-success"
          });
          vm.$router.push({
            path: "/index/punch",
            query: {
              IDCard:vm.$route.query.IDCard,
              WxId:vm.$route.query.IDCard
            }
          });
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    nameReg(value) {
      var nameReg = /^[\u4e00-\u9fa5]{2,6}$/;
      if (!nameReg.test(value)) {
        Toast({
          message: "请输入合法中文姓名！",
          iconClass: "icon icon-success"
        });
        return;
      }
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
    userNumberReg(value) {
      var userNumberReg = /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (!userNumberReg.test(Number(value))) {
        Toast({
          message: "请输入合法身份证号！",
          iconClass: "icon icon-success"
        });
        return;
      }
    }
  },
  components: {
    DropDown
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

  .bottom-box {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 150px;

    .little-left,
    .little-right {
      width: 66px;
      height: 14px;
      position: absolute;
      bottom: 5px;
    }

    .little-left {
      background: url("../../assets/image/china.png") no-repeat;
      left: 20px;
    }

    .little-right {
      background: url("../../assets/image/nantong.png") no-repeat;
      right: 20px;
    }

    .logo-bottom {
      width: 91px;
      height: 114px;
      position: absolute;
      left: 50%;
      background: url("../../assets/image/comeup.png") no-repeat;
      transform: translateX(-50%);
      bottom: 0;
    }
  }

  .logo {
    width: 132px;
    height: 107px;
    position: absolute;
    left: 50%;
    top: 6%;
    transform: translateX(-50%);
    background: url("../../assets/image/logo.png") no-repeat;
  }

  .register-box {
    width: 265px;
    /* position: absolute; */
    /* left: 50%;
      top: 30%; */
    /* transform: translateX(-50%); */
    margin: 0 auto;
    padding-top: 150px;

    .name-and-phone {
      height: 30px;

      .name {
        width: 90px;
        height: 30px;
        float: left;
      }

      .phone {
        width: 140px;
        margin-left: 5%;
        height: 30px;
        float: right;
      }
    }

    input {
      border: none;
      border-bottom: 1px solid #e4e4e4;
      background-color: transparent;
      padding-left: 5px;
      margin-top: 5px;
      border-radius: 0;
    }

    input[type="text"]:focus {
      outline: none;
      border-bottom: 1px solid #d6362e;
    }

    .idNumber {
      width: 260px;
      height: 30px;
    }

    .address,
    .cross,
    .arrive-time {
      height: 80px;

      .label {
        width: 65px;
        padding-left: 3px;
        padding-top: 3px;
        height: 77px;
        font-size: 14px;
        float: left;
      }

      .value {
        width: 195px;
        height: 80px;
        float: left;

        .top {
          height: 40px;
        }

        .bottom {
          height: 40px;
          line-height: 40px;

          input {
            height: 28px;
            width: 190px;
          }
        }
      }
    }

    .cross {
      .value {
        .top {
          .city {
            float: left;
            font-size: 13px;
            width: 44px;
            height: 25px;
            line-height: 25px;
            text-align: center;
            border: 1px solid #e4e4e4;
            border-radius: 15%;
            margin: 0 1px;
          }

          .chosed {
            border: 1px solid #d6362e;
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
      margin: 0 auto;
    }
  }
}
</style>