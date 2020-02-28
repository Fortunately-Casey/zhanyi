<template>
  <div class="manage">
    <div class="header">
      数据管理
      <div class="back" @click="goBack">
        首页
        <div class="back-icon"></div>
      </div>
      <span class="qrcode" @click="isShowQrcode = true">打卡二维码</span>
    </div>
    <div class="content">
      <div class="date" @click="openDate">
        {{returnDate(date)}}
        <span class="cart"></span>
      </div>
      <div class="tab">
        <div class="item" :class="chosedIndex === 3?'active':''" @click="choseTab(3)">全部</div>
        <div class="item" :class="chosedIndex === 1?'active':''" @click="choseTab(1)">已打卡</div>
        <div class="item" :class="chosedIndex === 0?'active':''" @click="choseTab(0)">未打卡</div>
      </div>
      <div class="list">
        <div class="list-header">
          <div class="index">序号</div>
          <div class="name">姓名</div>
          <div class="temp">体温</div>
          <div class="isCough">是否咳嗽</div>
          <div class="phone">联系电话</div>
        </div>
        <div
          class="item"
          v-for="(item,index) in list"
          :class="item.temp >= 37?'hot':''"
          :key="index"
        >
          <div class="index">{{item.number}}</div>
          <div class="name">{{item.name}}</div>
          <div class="temp">{{item.temp}}</div>
          <div class="isCough">{{returnCough(item.cough)}}</div>
          <div class="phone">{{item.mobile}}</div>
        </div>
      </div>
      <div class="pagenation">
        <span @click="prev"><</span>
        {{page}}页
        <span @click="next">></span>
      </div>
      <div class="bottom">
        <!-- <div class="look-button" @click="download">数据下载</div> -->
        <div class="punch-button" @click="approvalPeriodPlace">审核</div>
      </div>
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
    <div class="modal" v-if="isShowQrcode">
      <div class="punch-success">
        <div class="icon-close" @click="isShowQrcode = false"></div>
        <div class="red-message">长按分享二维码</div>
        <img :src="imgUrl" alt width="200" height="200" />
      </div>
    </div>
    <div class="qrcode" v-show="false">
      <Qrcode :value="val" size="200"></Qrcode>
    </div>
  </div>
</template>
<script>
import { Todate, blur, Totime } from "@/common/tool/tool.js";
import {
  getEnterprisePeriodPlaceList,
  approvalPeriodPlace
} from "@/api/register";
import { Toast, Indicator } from "mint-ui";
import Qrcode from "qrcode.vue";
export default {
  data() {
    return {
      date: new Date(),
      pickerValue: new Date(),
      chosedIndex: 3,
      page: 1,
      pageSize: 10,
      list: [],
      maxPage: 0,
      imgUrl: "",
      isShowQrcode: false,
      handler: function(e) {
        e.preventDefault();
      }
    };
  },
  created() {
    document.getElementsByTagName("title")[0].innerText = "战疫图·数据管理";
    this.getList();
    this.val = `https://yqfk.ntschy.com/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%2Fapi%2Fweixin%2FgotoPeriodPlaceEnterprise%3FenterpriseID%3D${this.$route.query.enterpriseID}`;
  },
  mounted() {
    let myCanvas = document.getElementsByTagName("canvas");
    this.imgUrl = myCanvas[0].toDataURL("image/png");
  },
  methods: {
    returnDate(value) {
      return Todate(value);
    },
    goBack() {
      this.$router.push({
        path: "/enterprise"
      });
    },
    confirmDate(value) {
      this.date = value;
      this.getList();
      this.openTouch();
    },
    choseTab(index) {
      this.page = 1;
      this.chosedIndex = index;
      this.getList();
    },
    returnCough(value) {
      if (value === null) {
        return "";
      } else if (value === true) {
        return "是";
      } else if (value === false) {
        return "否";
      }
    },
    getList() {
      var vm = this;
      Indicator.open();
      getEnterprisePeriodPlaceList({
        enterpriseID: vm.$route.query.enterpriseID,
        periodPlaceDate: vm.returnDate(vm.date),
        status: vm.chosedIndex,
        page: vm.page,
        pageSize: vm.pageSize
      }).then(resp => {
        Indicator.close();
        vm.list = resp.data.data;
        vm.maxPage = resp.data.page.pageCount;
      });
    },
    prev() {
      var vm = this;
      if (vm.page <= 1) {
        return;
      }
      vm.page--;
      vm.getList();
    },
    next() {
      var vm = this;
      if (vm.page >= vm.maxPage) {
        return;
      }
      vm.page++;
      vm.getList();
    },
    download() {},
    approvalPeriodPlace() {
      var vm = this;
      Indicator.open();
      approvalPeriodPlace({
        enterpriseID: vm.$route.query.enterpriseID,
        periodPlaceDate: vm.returnDate(vm.date)
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          Toast({
            message: "审核成功",
            iconClass: "icon icon-success"
          });
        } else {
          Toast({
            message: "审核失败",
            iconClass: "icon icon-success"
          });
        }
      });
    },
    closeDate() {
      this.openTouch();
    },
    openDate() {
      this.$refs.datepicker.open();
      this.closeTouch();
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
    }
  },
  components: {
    Qrcode
  }
};
</script>
<style lang="less" scoped>
.manage {
  width: 100%;
  height: 100%;
  background-color: #eee;
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
    .qrcode {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #fff;
    }
  }
  .content {
    .date {
      height: 40px;
      border-bottom: 1px solid rgb(199, 197, 197);
      text-align: center;
      color: #d22d2d;
      font-size: 14px;
      line-height: 40px;
      background-color: #fff;
      .cart {
        width: 0;
        height: 0;
        position: relative;
        top: 10px;
        margin-left: 2px;
        vertical-align: middle;
        border-top: 5px dashed;
        border-top: 5px solid #d22d2d;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }
    }
    .tab {
      background-color: #fff;
      height: 40px;
      border-bottom: 1px solid rgb(199, 197, 197);
      .item {
        width: 60px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        // color: #fff;
        // background-color: rgb(226, 118, 118);
        border-radius: 15px;
        float: left;
        margin-top: 10px;
        letter-spacing: 2px;
        margin-left: 20px;
      }
      .active {
        color: #fff;
        background-color: rgb(246, 153, 153);
        color: #d22d2d;
      }
    }
    .list {
      height: 451px;
      background-color: #fff;
      .list-header,
      .item {
        border-bottom: 1px solid rgb(199, 197, 197);
        height: 40px;
        .index,
        .name,
        .temp,
        .isCough,
        .phone {
          float: left;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
        .index {
          width: 15%;
        }
        .name {
          width: 20%;
        }
        .temp {
          width: 15%;
        }
        .isCough {
          width: 25%;
        }
        .phone {
          width: 25%;
        }
      }
      .hot {
        background-color: rgb(246, 153, 153);
        .temp {
          color: #d22d2d;
        }
      }
    }
    .pagenation {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 15px;
      margin-top: 10px;
      span {
        display: inline-block;
        width: 50px;
        text-align: center;
      }
    }
    .bottom {
      background-color: #eee;
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
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
        margin: 0 auto;
        margin-top: 20px;
      }

      .look-button {
        margin-right: 15px;
      }
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
        margin: 0 auto;
        margin-top: 25px;
        margin-bottom: 20px;
        text-align: center;
      }
    }
  }
}
</style>