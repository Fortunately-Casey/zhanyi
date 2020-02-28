/* eslint-disable no-undef */
/* eslint-disable no-console */
<template>
  <div class="punch-content">
    <div class="punch" ref="punch" v-show="!isShowMap">
      <div class="header">
        企业员工复工信息填写
        <div class="back" @click="goBack">
          首页
          <div class="back-icon"></div>
        </div>
      </div>
      <div class="top">
        <div class="item">
          <div class="name">姓名</div>
          <div class="value">
            <input type="text" v-model="username" @blur="lostblur()" />
          </div>
        </div>
        <div class="item">
          <div class="name">联系电话</div>
          <div class="value">
            <input
              type="text"
              v-model="phoneNumber"
              @blur="lostblur('phone')"
            />
          </div>
        </div>
        <div class="item">
          <div class="name">身份证号</div>
          <div class="value">
            <input
              type="text"
              v-model="idCard"
              @blur="lostblur('usernumber')"
            />
          </div>
        </div>
        <div class="item">
          <div class="name">年龄</div>
          <div class="value">
            <input type="text" v-model="age" @blur="lostblur('temp')" />
          </div>
        </div>
        <div class="item">
          <div class="name">所在企业</div>
          <div class="value"></div>
        </div>
        <div class="item">
          <input
            type="text"
            v-model="enterpriseName"
            disabled="disabled"
            placeholder="输入企业名称"
            @blur="lostblur"
            class="addressDetail"
          />
        </div>
      </div>
      <div class="first">
        <div class="item temp">
          <div class="name">体温</div>
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
        <div class="item">
          <div class="name">
            <div class="cross-title">有无咳嗽状况</div>
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in coughList"
          :key="index"
          @click="choseCough(index)"
        >
          <div class="name">
            <div class="cross-item">
              {{ item.value }}
              <div
                class="chosed-icon"
                v-if="chosedCough === index ? true : false"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="second">
        <div class="item">
          <div class="name">
            <div class="cross-title">1月23日至今是否离开过南通</div>
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in crossList"
          :key="index"
          @click="choseLeave(index)"
        >
          <div class="name">
            <div class="cross-item">
              {{ item.value }}
              <div
                class="chosed-icon"
                v-if="chosedLeaveIndex === index ? true : false"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="third" v-if="chosedLeaveIndex === 1">
        <div class="item" @click="showArea()">
          <div class="name">
            <div class="cross-title">
              返通前地址
              <div class="chosedValue" v-if="isShowSelectValue">
                <div class="value">{{ chosedValues.province }}</div>
                <div class="value">{{ chosedValues.city }}</div>
                <div class="value">{{ chosedValues.area }}</div>
              </div>
            </div>

            <div class="icon-cross" v-if="isShowCrossIcon">></div>
          </div>
        </div>
        <div class="item">
          <input
            type="text"
            v-model="beforeBackAddress"
            placeholder="详细地址：道路、门牌号、楼栋号、单元号"
            class="addressDetail"
            @blur="lostblur"
          />
        </div>
      </div>
      <div class="fourth">
        <div class="item" v-if="chosedLeaveIndex === 1">
          <div class="name">返通日期</div>
          <div class="value">
            <div class="date" @click="openPicker">
              {{ returnDate(dateValue) }}
            </div>
          </div>
        </div>
        <div class="item">
          <div class="name">
            {{ chosedLeaveIndex === 0 ? "现居住地" : "返通居住地" }}
          </div>
          <div class="value"></div>
        </div>
        <div class="item">
          <input
            type="text"
            v-model="nantongAddress"
            placeholder="详细地址：道路、门牌号、楼栋号、单元号"
            class="addressDetail"
            @blur="lostblur"
          />
        </div>
      </div>
      <div class="fifth">
        <div class="item">
          <div class="name">
            <div class="cross-title">是否复工</div>
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in crossList"
          :key="index"
          @click="choseRework(index)"
        >
          <div class="name">
            <div class="cross-item">
              {{ item.value }}
              <div
                class="chosed-icon"
                v-if="choseReworkIndex === index ? true : false"
              ></div>
            </div>
          </div>
        </div>
        <div class="item reworkTime" v-if="choseReworkIndex === 1">
          <div class="name">复工日期</div>
          <div class="value">
            <div class="date" @click="openRework">
              {{ returnDate(reworkDate) }}
            </div>
          </div>
        </div>
      </div>
      <div class="seventh">
        <div class="item">
          <div class="name">
            <div class="cross-title">目前状态</div>
          </div>
        </div>
        <div
          class="item"
          v-for="(item, index) in seekMedicalList"
          :key="index"
          @click="choseSeeMedical(index)"
        >
          <div class="name">
            <div class="cross-item">
              {{ item.value }}
              <div
                class="chosed-icon"
                v-if="chosedSeeMedicalIndex === index ? true : false"
              ></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sixth" v-if="chosedSeeMedicalIndex === 1">
        <div class="item">
          <div class="name">
            <div class="cross-title">隔离方式</div>
          </div>
        </div>
        <div class="item" @click="choseQuarantine(0)">
          <div class="name">
            <div class="cross-item">
              {{ quarantineList[0].value }}
              <div
                class="chosed-icon"
                v-if="chosedQuarantineIndex === 0 ? true : false"
              ></div>
            </div>
          </div>
        </div>
        <div class="item" v-show="chosedQuarantineIndex === 0">
          <input
            type="text"
            v-model="enterpriseAddress"
            placeholder="企业地址：道路、门牌号、楼栋号、单元号"
            class="addressDetail"
            @blur="lostblur"
          />
        </div>
        <div class="item" @click="choseQuarantine(1)">
          <div class="name">
            <div class="cross-item">
              {{ quarantineList[1].value }}
              <div
                class="chosed-icon"
                v-if="chosedQuarantineIndex === 1 ? true : false"
              ></div>
            </div>
          </div>
        </div>
        <div class="item" v-if="chosedQuarantineIndex === 1">
          <mt-radio
            v-model="chosedQuarant"
            :options="options"
            @change="check"
          ></mt-radio>
        </div>
        <div class="item" @click="choseQuarantine(2)">
          <div class="name">
            <div class="cross-item">
              {{ quarantineList[2].value }}
              <div
                class="chosed-icon"
                v-if="chosedQuarantineIndex === 2 ? true : false"
              ></div>
            </div>
          </div>
        </div>
        <div class="item" v-show="chosedQuarantineIndex === 2">
          <input
            type="text"
            v-model="nantongAddress"
            placeholder="家庭地址：道路、门牌号、楼栋号、单元号"
            class="addressDetail"
            @blur="lostblur"
          />
        </div>
      </div>
      <div class="sixth" v-if="chosedSeeMedicalIndex === 2">
        <div class="item" @click="isShowOutpatient = true">
          <div class="name">
            <div class="cross-title">
              发热门诊
              <div
                class="chosedValue"
                style="height:40px"
                v-if="chosedOutpatient.value"
              >
                <div class="value">{{ chosedOutpatient.value }}</div>
              </div>
            </div>
            <div class="icon-cross" v-if="isShowMedicaIcon">></div>
          </div>
        </div>
      </div>
      <div class="sixth" v-if="chosedSeeMedicalIndex === 3">
        <div class="item" @click="isShowHospital = true">
          <div class="name">
            <div class="cross-title">
              定点医院
              <div
                class="chosedValue"
                style="height:40px"
                v-if="chosedHospital.value"
              >
                <div class="value">{{ chosedHospital.value }}</div>
              </div>
            </div>
            <div class="icon-cross" v-if="isShowHospitalIcon">></div>
          </div>
        </div>
      </div>
      <div class="sixth" v-if="chosedSeeMedicalIndex === 4">
        <div class="item">
          <div class="name">
            <div class="cross-title">其他</div>
          </div>
        </div>
        <div class="item">
          <input
            type="text"
            v-model="otherInfo"
            placeholder="请输入其他信息"
            class="addressDetail"
            @blur="lostblur"
          />
        </div>
      </div>
      <div class="bottom">
        <div class="punch-button" @click="saveEnterprisePeriodPlace">提交</div>
      </div>
      <mt-datetime-picker
        ref="datepicker"
        v-model="pickerValue"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        :closeOnClickModal="false"
        :endDate="new Date()"
        :startDate="new Date('2020/1/1')"
        @confirm="confirmDate"
        @cancel="closeDate"
      ></mt-datetime-picker>
      <mt-datetime-picker
        ref="reworkPicker"
        v-model="reworkValue"
        type="date"
        year-format="{value} 年"
        month-format="{value} 月"
        date-format="{value} 日"
        :endDate="new Date()"
        :closeOnClickModal="false"
        :startDate="new Date('2020/1/1')"
        @confirm="confirmRework"
        @cancel="closeRework"
      ></mt-datetime-picker>
      <div class="modal" v-if="isShowAddressList">
        <div class="city-list">
          <div class="city-top">
            选择地区
            <div class="icon-close" @click="closeAddress"></div>
          </div>
          <div class="select-province" v-if="isShowProvinceList">
            <div class="select-title">选择省份/地区</div>
            <div v-for="(item, index) in provinceList" :key="index">
              <div
                class="province"
                v-for="(v, i) in item.items"
                :key="i"
                @click="choseProvince(v)"
              >
                <div class="label">{{ i === 0 ? v.key : "" }}</div>
                <div class="name">{{ v.name }}</div>
              </div>
            </div>
          </div>
          <div class="selected" v-if="!isShowProvinceList">
            <span class="seleted-province" @click="selectProvince">{{
              chosedProvinceName
            }}</span>
            <span class="selectCityButton" v-if="!chosedCityName"
              >选择城市</span
            >
            <span class="selectedCityButton" v-else @click="selectCity">{{
              chosedCityName
            }}</span>
            <span class="selectCityButton" v-if="isShowAreaSelect"
              >选择区域</span
            >
          </div>
          <div class="select-city" v-if="isShowCityList">
            <div v-for="(item, index) in cityList" :key="index">
              <div
                class="city"
                v-for="(v, i) in item.items"
                :key="i"
                @click="choseCity(v)"
                v-if="v.name !== '直辖县'"
              >
                <div class="label">{{ i === 0 ? v.key : "" }}</div>
                <div class="name">{{ v.short_name + "市" }}</div>
              </div>
            </div>
          </div>
          <div class="select-area" v-if="isShowAreaList">
            <div v-for="(item, index) in areaList" :key="index">
              <div
                class="area"
                v-for="(v, i) in item.items"
                :key="i"
                @click="choseArea(v)"
                v-if="v.name !== '市辖区'"
              >
                <div class="label">{{ i === 0 ? v.key : "" }}</div>
                <div class="name">{{ v.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" v-if="isShowOutpatient">
        <div class="city-list">
          <div class="city-top">
            选择门诊
            <div class="icon-close" @click="closeOutpatient"></div>
          </div>
          <div class="select-city">
            <div v-for="(item, index) in outpatientList" :key="index">
              <div class="city" @click="choseOutPatient(item)">
                <div class="name">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal" v-if="isShowHospital">
        <div class="city-list">
          <div class="city-top">
            选择医院
            <div class="icon-close" @click="closeHospital"></div>
          </div>
          <div class="select-city">
            <div v-for="(item, index) in hospitalList" :key="index">
              <div class="city" @click="choseHospital(item)">
                <div class="name">{{ item.value }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Todate, blur, Totime } from "@/common/tool/tool.js";
import { Toast, Indicator, Radio } from "mint-ui";
import {
  saveEnterprisePeriodPlace,
  getEnterprise,
  getEnterpriseUser
} from "@/api/enterprisePunch.js";
import wx from "weixin-js-sdk";
import axios from "axios";
import { getURL } from "@/common/tool/tool";
import AddressName from "@/common/tool/tool";
import { getCityList, getProvinceList } from "@/api/aliApi";
export default {
  data() {
    return {
      weixin: "",
      username: "",
      idCard: "",
      age: "",
      enterpriseName: "",
      temperature: "",
      chosedCough: 0,
      chosedLeaveIndex: 0,
      beforeBackAddress: "",
      nantongAddress: "",
      choseReworkIndex: 0,
      chosedQuarantineIndex: "",
      chosedSeeMedicalIndex: 0,
      enterpriseAddress: "",
      reworkDate: new Date(),
      otherInfo: "",
      isShowOutpatient: false,
      isShowHospital: false,
      chosedQuarant: "",
      isShowHospitalIcon: true,
      isShowMedicaIcon: true,
      outpatientList: [
        {
          value: "南通瑞慈医院"
        }
      ],
      hospitalList: [
        {
          value: "南通市第三人民医院"
        },
        {
          value: "南通大学附属医院"
        }
      ],
      options: [
        {
          label: "嘉福宾馆",
          value: "嘉福宾馆"
        },
        {
          label: "工业博览城格林豪泰酒店",
          value: "工业博览城格林豪泰酒店"
        },
        {
          label: "金桥公寓",
          value: "金桥公寓"
        }
      ],
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
      coughList: [
        {
          value: "无"
        },
        {
          value: "有"
        }
      ],
      quarantineList: [
        {
          value: "企业隔离"
        },
        {
          value: "集中隔离"
        },
        {
          value: "居家隔离"
        }
      ],
      seekMedicalList: [
        {
          value: "正常"
        },
        {
          value: "隔离中"
        },
        {
          value: "发热门诊留观"
        },
        {
          value: "定点医院就诊"
        },
        {
          value: "其他"
        }
      ],
      chosedOutpatient: {},
      chosedHospital: {},
      pickerValue: new Date(),
      reworkValue: new Date(),
      phoneNumber: "",
      dateValue: new Date(),
      timeValue: this.returnTime(new Date()),
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
      addressDetail: "",
      nowAddress: "",
      chosedNowAddress: {
        province: "",
        city: "",
        area: ""
      },
      isShowSelectedNow: false,
      // 地址类型flag
      addressType: 0,
      isShowNowIcon: true
    };
  },
  created() {
    var vm = this;
    document.getElementsByTagName("title")[0].innerText = "辅助复工 • 南通";
    this.shareList(
      "https://yqfk.ntschy.com/swnt.png",
      window.location.href,
      "落实外防输入，推动精准复工。版权所有：南通市疾病预防控制中心开发区站",
      "辅助复工 • 南通"
    );
    getEnterprise({
      enterpriseID: vm.$route.query.enterpriseID
    }).then(resp => {
      if (resp.data.success && resp.data.data) {
        vm.enterpriseName = resp.data.data.enterpriseName;
        // vm.phoneNumber = resp.data.data.mobile;
        // vm.createWxID = resp.data.data.createWxID;
      } else {
        Toast({
          message: "获取信息失败!",
          iconClass: "icon icon-success"
        });
      }
    });
    // 获取用户信息
    getEnterpriseUser({
      wxID: vm.$route.query.WxId
    }).then(resp => {
      if (resp.data.success && resp.data.data) {
        vm.username = resp.data.data.name;
        vm.phoneNumber = resp.data.data.mobile;
        vm.idCard = resp.data.data.idCard;
        vm.age = resp.data.data.age;
      }
    });
    //获取省会列表
    this.getProvinceList();
  },
  mounted() {
    // alert(this.$route.query)
  },
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
    check() {
      console.log(this.chosedQuarant);
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
      if (
        !vm.chosedValues.province ||
        !vm.chosedValues.city ||
        !vm.chosedValues.area ||
        !vm.addressDetail
      ) {
        Toast({
          message: "请填写完整的来自地区!",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (
        !vm.chosedNowAddress.province ||
        !vm.chosedNowAddress.city ||
        !vm.chosedNowAddress.area ||
        !vm.nowAddress
      ) {
        Toast({
          message: "请填写完整的现居住地!",
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
        epidemicArea: false,
        fromProvince: vm.chosedValues.province,
        fromCity: vm.chosedValues.city,
        fromCounty: vm.chosedValues.area,
        fromAddress: vm.addressDetail,
        currLiveProvince: vm.chosedNowAddress.province,
        currLiveCity: vm.chosedNowAddress.city,
        currLiveCounty: vm.chosedNowAddress.area,
        currLiveAddress: vm.nowAddress
      };
      Indicator.open();
      savePeriodPlace(params).then(resp => {
        Indicator.close();
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
    // 企业打卡
    saveEnterprisePeriodPlace() {
      var vm = this;
      var isolationAddress, seekMedicalAddress;
      if (vm.chosedSeeMedicalIndex !== 1) {
        isolationAddress = "";
        vm.chosedQuarantineIndex = "";
      } else {
        if (vm.chosedQuarantineIndex === 0) {
          isolationAddress = vm.enterpriseAddress;
        } else if (vm.chosedQuarantineIndex === 1) {
          isolationAddress = vm.chosedQuarant;
        } else if (vm.chosedQuarantineIndex === 2) {
          isolationAddress = vm.nantongAddress;
        }
      }
      if (vm.chosedSeeMedicalIndex !== 2 || vm.chosedSeeMedicalIndex !== 3) {
        seekMedicalAddress = "";
      } else {
        if (vm.chosedSeeMedicalIndex === 2) {
          seekMedicalAddress = vm.chosedOutpatient.value;
        } else if (vm.chosedSeeMedicalIndex === 3) {
          seekMedicalAddress = vm.chosedHospital.value;
        }
      }
      if (vm.chosedSeeMedicalIndex !== 4) {
        vm.otherInfo = "";
      }
      if (!vm.username) {
        Toast({
          message: "姓名不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.idCard) {
        Toast({
          message: "身份证不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.age) {
        Toast({
          message: "年龄不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.age) {
        Toast({
          message: "年龄不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.enterpriseName) {
        Toast({
          message: "企业名称不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.temperature) {
        Toast({
          message: "体温不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.nantongAddress) {
        Toast({
          message: "居住地不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.nantongAddress) {
        Toast({
          message: "居住地不能为空！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (vm.chosedLeaveIndex === 1) {
        if (
          !vm.chosedValues.province ||
          !vm.chosedValues.city ||
          !vm.chosedValues.area ||
          !vm.beforeBackAddress
        ) {
          Toast({
            message: "请填写完整的返通前地区!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }
      if (vm.chosedSeeMedicalIndex === 1 && vm.chosedQuarantineIndex === 0) {
        if (!vm.enterpriseAddress) {
          Toast({
            message: "请填写完整的隔离地址!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }
      if (vm.chosedSeeMedicalIndex === 1 && vm.chosedQuarantineIndex === 1) {
        if (!vm.chosedQuarant) {
          Toast({
            message: "请填写完整的隔离地址!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }
      if (vm.chosedSeeMedicalIndex === 1 && vm.chosedQuarantineIndex === 2) {
        if (!vm.nantongAddress) {
          Toast({
            message: "请填写完整的隔离地址!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }
      if (vm.chosedSeeMedicalIndex === 2) {
        if (!vm.chosedOutpatient.value) {
          Toast({
            message: "请填写完整的就诊地址!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }

      if (vm.chosedSeeMedicalIndex === 3) {
        if (!vm.chosedHospital.value) {
          Toast({
            message: "请填写完整的就诊地址!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }

      if (vm.chosedSeeMedicalIndex === 4) {
        if (!vm.otherInfo) {
          Toast({
            message: "请填写完整的其他信息!",
            iconClass: "icon icon-success"
          });
          return;
        }
      }

      var params = {
        name: vm.username,
        mobile: vm.phoneNumber,
        idCard: vm.idCard,
        age: vm.age,
        wxID: vm.$route.query.WxId,
        enterpriseID: vm.$route.query.enterpriseID,
        enterpriseName: vm.enterpriseName,
        temp: vm.temperature,
        cough: vm.chosedCough === 0 ? false : true,
        leaveNT: vm.chosedLeaveIndex === 0 ? false : true,
        ntAddress: vm.nantongAddress,
        returnNTDate:
          vm.chosedLeaveIndex === 0 ? "" : vm.returnDate(vm.dateValue),
        beforeReturnNtProvince: vm.chosedValues.province,
        beforeReturnNtCity: vm.chosedValues.city,
        beforeReturnNtCounty: vm.chosedValues.area,
        beforeReturnNtAddress: vm.beforeBackAddress,
        recoveryWork: vm.choseReworkIndex === 0 ? false : true,
        recoveryWorkDate:
          vm.choseReworkIndex === 0 ? "" : vm.returnDate(vm.reworkDate),
        isolationType:
          vm.chosedQuarantineIndex === ""
            ? ""
            : vm.quarantineList[vm.chosedQuarantineIndex].value,
        isolationAddress: isolationAddress,
        seekMedicalAddress: seekMedicalAddress,
        other: vm.otherInfo,
        currStatus: vm.seekMedicalList[vm.chosedSeeMedicalIndex].value
      };
      console.log(params);
      Indicator.open();
      saveEnterprisePeriodPlace(params).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        } else {
          Toast({
            message: "打卡失败!",
            iconClass: "icon icon-success"
          });
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
    choseOutPatient(value) {
      this.chosedOutpatient = value;
      this.isShowMedicaIcon = false;
      this.isShowOutpatient = false;
    },
    choseHospital(value) {
      this.chosedHospital = value;
      this.isShowHospitalIcon = false;
      this.isShowHospital = false;
    },
    openPicker() {
      this.$refs.datepicker.open();
      this.closeTouch();
    },
    openRework() {
      this.$refs.reworkPicker.open();
      this.closeTouch();
    },
    closeDate() {
      this.openTouch();
    },
    closeRework() {
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
    confirmRework(value) {
      this.reworkDate = value;
      this.openTouch();
    },
    confirmTime(value) {
      this.timeValue = value;
      this.openTouch();
    },
    // 是否咳嗽
    choseCough(index) {
      this.chosedCough = index;
    },
    // 是否离开南通
    choseLeave(index) {
      this.chosedLeaveIndex = index;
    },
    // 是否复工
    choseRework(index) {
      this.choseReworkIndex = index;
    },
    // 选择隔离方式
    choseQuarantine(index) {
      this.chosedQuarantineIndex = index;
    },
    //选择就诊方式
    choseSeeMedical(index) {
      this.chosedSeeMedicalIndex = index;
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
          passive: true
        }); //打开默认事件
    },
    showArea(index) {
      // this.addressType = index;
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
      this.isShowCrossIcon = false;
      this.isShowAddressList = false;
    },
    closeAddress() {
      this.isShowAddressList = false;
    },
    closeOutpatient() {
      this.isShowOutpatient = false;
    },
    closeHospital() {
      this.isShowHospital = false;
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
        const key = item.pinyin.substr(0, 1);
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new AddressName({
            id: item.id,
            name: item.name,
            short_name: item.short_name,
            key: key
          })
        );
      });
      let ret = [];
      for (let key in map) {
        ret.push(map[key]);
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return ret;
    }
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
.punch-content {
  height: 100%;
  position: relative;
  .punch {
    width: 100%;
    height: 100%;
    background-color: #eee;
    overflow-y: auto;
    left: 0;
    top: 0;
    z-index: 999;
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

    .top,
    .fourth {
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
        .addressDetail {
          width: 250px;
          height: 25px;
          font-size: 13px;
          margin-left: 18px;
        }
      }

      // .item:first-child {
      //   .name {
      //     letter-spacing: 28px;
      //   }
      // }
      .now-address {
        min-height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #f2f2f2;
        font-weight: bold;
        display: flex;
        .name {
          font-size: 14px;
          width: 95%;
          padding-left: 20px;
          box-sizing: border-box;
          text-align: left;
          letter-spacing: 2px;
          position: relative;
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
      }
    }
    .fourth {
      margin-top: 15px;
    }
    .first,
    .fifth,
    .sixth,
    .seventh {
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
          border-top: 1px solid #efefef;
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
          height: 25px;
          font-size: 13px;
        }
      }
      .temp {
        display: flex;
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
      .reworkTime {
        display: flex;
        .name {
          width: 30%;
        }
        .value {
          width: 70%;
          text-align: right;
          display: flex;
          justify-content: flex-end;
          // input {
          //   font-size: 13px;
          //   text-align: right;
          //   text-align: end;
          //   width: 55px;
          //   padding-right: 5px;
          // }
        }
      }
    }
    .second,
    .third {
      margin-top: 15px;
      background-color: #fff;
      .item {
        min-height: 40px;
        line-height: 40px;
        padding: 0 20px;
        font-weight: bold;
        // display: flex;
        font-size: 14px;
        .name {
          position: relative;
          .cross-title {
            border-bottom: 1px solid #efefef;
            border-top: 1px solid #efefef;
            span {
              font-size: 11px;
              color: #c7c7c7;
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
          .chosedValue {
            height: 75px;
            .value {
              width: 100%;
              text-align: right;
              height: 25px;
              line-height: 25px;
              font-weight: 100;
            }
          }
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
        }
        .addressDetail {
          width: 250px;
          height: 25px;
          font-size: 13px;
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

      .punch-button {
        width: 285px;
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
