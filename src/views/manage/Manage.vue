<template>
  <div class="manage">
    <div class="header">
      {{ type === "Group" ? "班级管理" : "学校管理" }}
      <div class="back" @click="goBack">
        首页
        <div class="back-icon"></div>
      </div>
      <!-- <span class="qrcode" @click="isShowQrcode = true">打卡二维码</span> -->
      <span
        class="teacher-punchList"
        @click="teacherPunchList"
        v-if="isShowTeacherList"
        >教职工打卡记录</span
      >
    </div>
    <div class="content">
      <div class="class-name">{{ titleName }}</div>
      <div class="date" @click="openDate">
        {{ returnDate(date) }}
        <span class="cart"></span>
      </div>
      <div class="school-type" v-if="type === 'Root' ? true : false">
        <div
          class="school-item"
          :class="chosedSchoolType === index ? 'chosed-schooltype' : ''"
          v-for="(item, index) in enterpriseList"
          :key="index"
          @click="choseSchoolType(index)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="list">
        <div class="list-header">
          <div class="index">序号</div>
          <div class="name">{{ type === "Group" ? "班级" : "学校" }}</div>
          <div class="shouldPunch">应打卡</div>
          <div class="punchCount">实打卡</div>
          <div class="warning">异常</div>
        </div>
        <div
          class="item"
          v-for="(item, index) in list"
          :class="returnHot(item)"
          :key="index"
          @click="choseItem(item)"
        >
          <div class="index">{{ index + 1 }}</div>
          <div class="name">{{ item.enterpriseName }}</div>
          <div class="shouldPunch">{{ item.allCount }}</div>
          <div class="punchCount">{{ item.periodPlaceCount }}</div>
          <div class="warning" :class="item.dangerousCount == 0 ? '' : 'error'">
            {{ item.dangerousCount }}
          </div>
        </div>
      </div>
      <div class="pagenation">
        <span @click="prev"><</span>
        {{ page }}页
        <span @click="next">></span>
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
    <div class="modal" v-if="isShowErrorList">
      <div class="warning-list">
        <div class="icon-close" @click="isShowErrorList = false"></div>
        <div class="red-message">异常人员</div>
        <div class="error-header">
          <div class="name">姓名</div>
          <div class="temp">体温</div>
          <div class="symptom">组织</div>
          <div class="status">状态</div>
          <div class="phone">电话</div>
        </div>
        <scroll class="wrapper">
          <div class="error-list">
            <div
              class="error-item"
              v-for="(item, index) in errorList"
              :key="index"
              @click="choseErrorDetail(item)"
            >
              <div class="name">{{ item.name }}</div>
              <div class="temp">{{ item.temp }}</div>
              <div class="symptom">{{ item.enterpriseName }}</div>
              <div class="status">{{ item.currStatus }}</div>
              <div class="phone">{{ item.sysUserID }}</div>
            </div>
          </div>
        </scroll>
      </div>
    </div>
    <div class="modal" v-show="isShowDetail">
      <div class="punch-detail">
        <div class="icon-close" @click="isShowDetail = false"></div>
        <ul class="detail-list">
          <li>
            <div class="name">名字:</div>
            <div class="value">{{ chosedDetail.name }}</div>
          </li>
          <li>
            <div class="name">手机号:</div>
            <div class="value">{{ chosedDetail.sysUserID }}</div>
          </li>
          <li>
            <div class="name">密码:</div>
            <div class="value">{{ chosedDetail.sysPassword }}</div>
          </li>
          <li>
            <div class="name">体温:</div>
            <div class="value">{{ chosedDetail.temp }}</div>
          </li>
          <li>
            <div class="name">是否咳嗽:</div>
            <div class="value">{{ chosedDetail.cough ? "是" : "否" }}</div>
          </li>
          <li>
            <div class="name">状态:</div>
            <div class="value">{{ chosedDetail.currStatus }}</div>
          </li>
        </ul>
        <div
          class="option-button"
          :class="
            chosedDetail.dangerousFlag == 'Dangerous' ? 'dangerous' : 'normal'
          "
          @click="changeStatus"
        >
          {{ chosedDetail.dangerousFlag == "Dangerous" ? "异常" : "正常" }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Todate } from "@/common/tool/tool.js";
import {
  getEnterpriseBaseList,
  getEnterpriseGroupList,
  getEnterprisePeriodPlaceListV2,
  getEnterprisePeriodPlaceListV3,
  updateEnterprisePeriodPlaceDangerousFlag
} from "@/api/manage.js";
import { Toast, Indicator } from "mint-ui";
import Scroll from "@/components/Scroll.vue";
export default {
  data() {
    return {
      date: new Date(),
      pickerValue: new Date(),
      isShowTeacherList: true,
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
      isShowDetail: false,
      chosedDetail: "",
      isShowDownload: false,
      downloadUrl: "",
      isShowImport: false,
      importUrl: "",
      phoneNumber: "",
      password: "",
      titleName: "",
      type: "",
      isShowErrorList: false,
      errorList: [],
      chosedEnterpriseID: "",
      chosedSchoolType: 0,
      enterpriseList: [
        {
          id: 1,
          name: "幼儿园"
        },
        {
          id: 2,
          name: "小学"
        },
        {
          id: 3,
          name: "初中"
        },
        {
          id: 4,
          name: "高中"
        },
        {
          id: 5,
          name: "综合"
        }
      ]
    };
  },
  created() {
    var vm = this;
    this.phoneNumber = window.localStorage.getItem("schoolNumber");
    this.password = window.localStorage.getItem("schoolPassword");
    this.titleName = this.$route.query.enterpriseName;
    this.type = this.$route.query.type;
    vm.getList();
  },
  mounted() {},
  methods: {
    returnDate(value) {
      return Todate(value);
    },
    goBack() {
      this.$router.push({
        path: "/schoolMain"
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
    choseItem(item) {
      this.chosedEnterpriseID = item.enterpriseID;
      if (this.$route.query.type === "Root") {
        this.getManageErrorList(item);
      } else {
        this.getSchoolErrorList(item);
      }
    },
    choseErrorDetail(item) {
      this.chosedDetail = item;
      this.isShowDetail = true;
    },
    getManageErrorList(item) {
      var vm = this;
      Indicator.open();
      getEnterprisePeriodPlaceListV3({
        paramPeriodPlaceDate: vm.returnDate(vm.date),
        paramStatus: 6,
        paramPage: 1,
        paramPageSize: 5000,
        paramEnterpriseAdminUserId: vm.phoneNumber,
        paramEnterpriseAdminPassword: vm.password,
        paramEnterpriseID: item.enterpriseID,
        paramParentEnterpriseID: vm.$route.query.enterpriseID
      }).then(resp => {
        Indicator.close();
        vm.errorList = resp.data.data;
        this.isShowErrorList = true;
      });
    },
    getSchoolErrorList(item) {
      var vm = this;
      Indicator.open();
      getEnterprisePeriodPlaceListV2({
        paramPeriodPlaceDate: vm.returnDate(vm.date),
        paramStatus: 6,
        paramPage: 1,
        paramPageSize: 5000,
        paramEnterpriseAdminUserId: vm.phoneNumber,
        paramEnterpriseAdminPassword: vm.password,
        paramEnterpriseID: item.enterpriseID,
        paramParentEnterpriseID: vm.$route.query.enterpriseID
      }).then(resp => {
        Indicator.close();
        vm.errorList = resp.data.data;
        this.isShowErrorList = true;
      });
    },
    changeStatus() {
      var vm = this;
      updateEnterprisePeriodPlaceDangerousFlag({
        enterprisePeriodPlaceID: vm.chosedDetail.id,
        enterpriseID: vm.chosedDetail.enterpriseID,
        dangerousFlag:
          vm.chosedDetail.dangerousFlag === "Dangerous" ? "Normal" : "Dangerous"
      }).then(resp => {
        if (resp.data.success) {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
          vm.isShowDetail = false;
          vm.isShowErrorList = false;
          vm.getList();
        } else {
          Toast({
            message: "更新失败",
            iconClass: "icon icon-success"
          });
        }
      });
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
    choseSchoolType(index) {
      this.chosedSchoolType = index;
      this.getList();
    },
    importValue() {
      this.importUrl = `http://119.3.194.191:8089/#/importStaff?name=${this.list[0].enterpriseName}&id=${this.$route.query.enterpriseID}`;
      this.isShowImport = true;
    },
    getList() {
      if (this.$route.query.type === "Group") {
        this.isShowTeacherList = true;
        this.getSchoolManage();
      } else if (this.$route.query.type === "Root") {
        this.isShowTeacherList = false;
        this.getControlManage();
      }
    },
    getSchoolManage() {
      var vm = this;
      Indicator.open();
      getEnterpriseBaseList({
        paramEnterpriseID: vm.$route.query.enterpriseID,
        paramEnterpriseAdminUserId: vm.phoneNumber,
        paramEnterpriseAdminPassword: vm.password,
        paramPeriodPlaceDate: vm.returnDate(vm.date),
        page: vm.page,
        pageSize: vm.pageSize
      }).then(resp => {
        Indicator.close();
        vm.list = resp.data.data;
        vm.maxPage = resp.data.page.pageCount;
        vm.count = resp.data.page.totalCount;
      });
    },
    getControlManage() {
      var vm = this;
      Indicator.open();
      getEnterpriseGroupList({
        paramEnterpriseType: vm.chosedSchoolType + 1,
        paramEnterpriseID: vm.$route.query.enterpriseID,
        paramCenterAdminUserId: vm.phoneNumber,
        paramCenterAdminPassword: vm.password,
        paramPeriodPlaceDate: vm.returnDate(vm.date),
        page: vm.page,
        pageSize: vm.pageSize
      }).then(resp => {
        Indicator.close();
        vm.list = resp.data.data;
        vm.maxPage = resp.data.page.pageCount;
        vm.count = resp.data.page.totalCount;
      });
    },
    teacherPunchList() {
      this.$router.push({
        path: "/teacherPunchList",
        query: {
          enterpriseID: this.$route.query.enterpriseID
        }
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
    returnHot(item) {
      if (
        item.temp >= 37.3 ||
        item.cough ||
        item.currStatus === "定点医院就诊" ||
        item.currStatus === "发热门诊留观"
      ) {
        return "hot";
      } else {
        return "";
      }
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
    Scroll
  }
};
</script>
<style lang="less" scoped>
.manage {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #eee;
  .header {
    height: 40px;
    background-color: #16d0a0;
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
    .teacher-punchList {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 12px;
      color: #fff;
    }
  }
  .content {
    .date,
    .class-name {
      height: 40px;
      border-bottom: 1px solid rgb(199, 197, 197);
      text-align: center;
      color: #16d0a0;
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
        border-top: 5px solid #16d0a0;
        border-right: 5px solid transparent;
        border-left: 5px solid transparent;
      }
    }
    .school-type {
      height: 40px;
      border-bottom: 1px solid rgb(199, 197, 197);
      text-align: center;
      font-size: 14px;
      line-height: 40px;
      background-color: #fff;
      display: flex;
      .school-item {
        flex: 1;
      }
      .chosed-schooltype {
        color: #16d0a0;
      }
    }
    .wrapper {
      width: 100%;
      overflow: hidden;
      .tab {
        width: 450px;
        background-color: #fff;
        height: 40px;
        border-bottom: 1px solid rgb(199, 197, 197);
        .item {
          width: 75px;
          padding: 3px 3px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 12px;
          float: left;
          color: #aaa;
          border-radius: 15px;
          float: left;
          margin-top: 10px;
          letter-spacing: 2px;
          margin-left: 5px;
        }
        .active {
          color: #fff;
          background-color: #dcfff6;
          color: #16d0a0;
          font-weight: bold;
        }
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
        .shouldPunch,
        .punchCount,
        .warning {
          float: left;
          height: 40px;
          line-height: 40px;
          text-align: center;
          .delete-button {
            margin: 0 auto;
            width: 35px;
            height: 25px;
            line-height: 25px;
            background-color: rgb(45, 127, 233);
            color: #fff;
            margin-top: 7.5px;
            border-radius: 5px;
          }
        }
        .index {
          width: 15%;
        }
        .name {
          width: 43%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .shouldPunch {
          width: 15%;
        }
        .punchCount {
          width: 15%;
        }
        .warning {
          width: 12%;
        }
        .error {
          color: #16d0a0;
        }
      }
      .hot {
        background-color: #f65235;
        .temp {
          color: #16d0a0;
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
      .look-button,
      .punch-button,
      .import-button {
        width: 95px;
        height: 40px;
        border-radius: 20px;
        background-color: #16d0a0;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 15px;
        margin: 20px auto;
      }

      .look-button {
        margin: 20px auto;
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
    .punch-detail {
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
      .detail-list {
        list-style: none;
        padding: 0;
        padding-top: 20px;
        li {
          font-size: 13px;
          display: flex;
          .name {
            width: 80px;
          }
          .value {
          }
        }
      }
      .option-button {
        margin: 0 auto;
        width: 60px;
        height: 25px;
        line-height: 25px;
        border-radius: 12.5px;
      }
      .dangerous {
        background-color: rgb(238, 70, 70);
        color: #fff;
      }
      .normal {
        background-color: rgb(20, 119, 231);
        color: #fff;
      }
      .download-message {
        margin-top: 30px;
        padding: 0 15px;
        text-align: left;
        font-size: 14px;
      }
      .url-message {
        font-size: 14px;
        margin-top: 20px;
        margin-bottom: 10px;
        padding: 0 15px;
        word-break: break-all;
        color: #16d0a0;
        text-align: left;
      }
    }
    .warning-list {
      width: 100%;
      height: 400px;
      background-color: #fff;
      border: 1px solid rgb(196, 193, 193);
      border-radius: 5px;
      position: absolute;
      left: 50%;
      top: 20%;
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
      .error-header {
        height: 20px;
        .name,
        .temp,
        .symptom,
        .status,
        .phone {
          float: left;
          height: 20px;
          line-height: 20px;
          font-size: 8px;
          text-align: center;
        }
        .name {
          width: 15%;
        }
        .temp {
          width: 10%;
        }
        .symptom {
          width: 25%;
        }
        .status {
          width: 25%;
        }
        .phone {
          width: 25%;
        }
      }
      .wrapper {
        height: 300px;
        overflow: hidden;
        .error-list {
          .error-item {
            height: 30px;
            .name,
            .temp,
            .symptom,
            .status,
            .phone {
              float: left;
              height: 30px;
              line-height: 30px;
              font-size: 10px;
              text-align: center;
            }
            .name {
              width: 15%;
            }
            .temp {
              width: 10%;
            }
            .symptom {
              width: 25%;
            }
            .status {
              width: 25%;
            }
            .phone {
              width: 25%;
            }
          }
        }
      }
    }
  }
}
</style>
