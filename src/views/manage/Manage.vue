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
        {{ returnDate(date) }}
        <span class="cart"></span>
      </div>
      <div class="tab">
        <div
          class="item"
          :class="chosedIndex === 3 ? 'active' : ''"
          @click="choseTab(3)"
        >
          全部{{ chosedIndex === 3 ? `(${count})` : "" }}
        </div>
        <div
          class="item"
          :class="chosedIndex === 1 ? 'active' : ''"
          @click="choseTab(1)"
        >
          已打卡{{ chosedIndex === 1 ? `(${count})` : "" }}
        </div>
        <div
          class="item"
          :class="chosedIndex === 0 ? 'active' : ''"
          @click="choseTab(0)"
        >
          未打卡{{ chosedIndex === 0 ? `(${count})` : "" }}
        </div>
      </div>
      <div class="list">
        <div class="list-header">
          <div class="index">序号</div>
          <div class="name">姓名</div>
          <div class="temp">体温</div>
          <div class="isCough">是否咳嗽</div>
          <div class="phone">联系电话</div>
          <div class="option">操作</div>
        </div>
        <div
          class="item"
          v-for="(item, index) in list"
          :class="item.temp >= 37 ? 'hot' : ''"
          :key="index"
        >
          <div class="index">{{ item.number }}</div>
          <div class="name">{{ item.name }}</div>
          <div class="temp">{{ item.temp }}</div>
          <div class="isCough">{{ returnCough(item.cough) }}</div>
          <div class="phone">{{ item.mobile }}</div>
          <div class="option">
            <span v-if="item.id === 0">未打卡</span>
            <mt-button
              type="primary"
              size="small"
              @click="deletePunch(item)"
              v-else
              >删除</mt-button
            >
          </div>
        </div>
      </div>
      <div class="pagenation">
        <span @click="prev"><</span>
        {{ page }}页
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
      :closeOnClickModal="false"
      :endDate="new Date()"
      :startDate="new Date('2020/1/1')"
      @confirm="confirmDate"
      @cancel="closeDate"
    ></mt-datetime-picker>
    <div class="modal" v-show="isShowQrcode">
      <div class="punch-success">
        <div class="icon-close" @click="isShowQrcode = false"></div>
        <div class="red-message">长按分享二维码</div>
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
import { Todate, blur, Totime } from "@/common/tool/tool.js";
import { MessageBox } from "mint-ui";
import {
  getEnterprisePeriodPlaceList,
  approvalPeriodPlace,
  deleteEnterprisePeriodPlace
} from "@/api/register";
import { Toast, Indicator } from "mint-ui";
import QRCode from "qrcodejs2";
import VueQr from "vue-qr";
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
      count: 0,
      isShowQrcode: false,
      handler: function(e) {
        e.preventDefault();
      },
      text: "",
      imageUrl: require("../../assets/image/zhanyi-logo.png")
    };
  },
  created() {
    var vm = this;
    document.getElementsByTagName("title")[0].innerText =
      "开发区企业员工健康申报系统";
    vm.getList();
    vm.text = `https://yqfk.ntschy.com/api/weixin/transponder?redirectUri=https%3A%2F%2Fyqfk.ntschy.com%2Fapi%2Fweixin%2FgotoPeriodPlaceEnterprise%3FenterpriseID%3D${this.$route.query.enterpriseID}`;
  },
  mounted() {},
  methods: {
    returnDate(value) {
      return Todate(value);
    },
    goBack() {
      this.$router.push({
        path: "/enterPrise"
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
    deletePunch(item) {
      var vm = this;
      MessageBox.confirm("确定执行此操作?", "删除当前记录").then(() => {
        var params = {
          enterprisePeriodPlaceID: item.id,
          enterpriseID: vm.$route.query.enterpriseID
        };
        deleteEnterprisePeriodPlace(params).then(resp => {
          if (resp.data.success) {
            Toast({
              message: "删除成功！",
              iconClass: "icon icon-success"
            });
            vm.page = 1;
            vm.getList();
          } else {
            Toast({
              message: "删除失败！",
              iconClass: "icon icon-success"
            });
          }
        });
      });
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
        vm.count = resp.data.page.totalCount;
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
    VueQr
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
    background-color: #2e55d6;
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
      color: #2e55d6;
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
        border-top: 5px solid #2e55d6;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }
    }
    .tab {
      background-color: #fff;
      height: 40px;
      border-bottom: 1px solid rgb(199, 197, 197);
      .item {
        // width: 80px;
        padding: 3px 10px;
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
        background-color: rgba(45, 85, 215, 0.3);
        color: #2e55d6;
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
        .phone,
        .option {
          float: left;
          height: 40px;
          line-height: 40px;
          text-align: center;
        }
        .index {
          width: 10%;
        }
        .name {
          width: 18%;
        }
        .temp {
          width: 12%;
        }
        .isCough {
          width: 20%;
        }
        .phone {
          width: 25%;
        }
        .option {
          width: 15%;
        }
      }
      .hot {
        background-color: ;
        .temp {
          color: #2e55d6;
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
        background-color: #2e55d6;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 15px;
        margin: 20px auto;
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
