<template>
  <div class="manage">
    <div class="header">
      教职工缺课
      <div class="back" @click="goBack">
        首页
        <div class="back-icon"></div>
      </div>
      <span class="teacher-punchList">新增缺课</span>
    </div>
    <div class="content">
      <div class="date" @click="openDate">
        {{ returnDate(date) }}
        <span class="cart"></span>
      </div>
      <div class="people-number">
        <div class="should-be">
          <div class="name">当日应到学生数</div>
          <div class="value">
            <input type="number" oninput="if (value.length>4) value=value.slice(0,4)" />
          </div>
        </div>
        <div class="actual-arrival">
          <div class="name">当日实到学生数</div>
          <div class="value">
            <input type="number" oninput="if (value.length>4) value=value.slice(0,4)" />
          </div>
        </div>
      </div>
      <div class="people-content">
        <!-- <div class="tab-bar"></div> -->
        <div class="people-header">
          <div class="index">序号</div>
          <div class="name">姓名</div>
          <div class="type">缺课类型</div>
          <div class="isReClass">是否复课</div>
        </div>
        <div class="people-list">
          <div class="item" v-for="(item,index) in 8" :key="index">
            <div class="index">1</div>
            <div class="name">邱佳佳</div>
            <div class="type">发热</div>
            <div class="isReClass">否</div>
          </div>
        </div>
      </div>
      <div class="pagenation">
        <span @click="prev"><</span>
        {{ page }}页
        <span @click="next">></span>
      </div>
      <div class="commit-button">提交</div>
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
  </div>
</template>
<script>
import { Todate } from "@/common/tool/tool.js";
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
  created() {},
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
    .date {
      height: 40px;
      border-bottom: 1px solid #efefef;
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
    .people-number {
      height: 80px;
      background-color: #fff;
      .should-be,
      .actual-arrival {
        height: 40px;
        border-bottom: 1px solid #efefef;
        display: flex;
        .name {
          line-height: 40px;
          padding-left: 10px;
          font-size: 14px;
          width: 150px;
        }
        .value {
          flex: 1;
          display: flex;
          flex-direction: row-reverse;
          input {
            width: 40px;
            text-align: right;
            text-align: end;
          }
        }
      }
    }
    .people-content {
      margin-top: 10px;
      background-color: #fff;
      .people-header {
        height: 40px;
        display: flex;
        border-bottom: 1px solid #efefef;
        font-weight: bold;
        .index,
        .name,
        .type,
        .isReClass {
          text-align: center;
          line-height: 40px;
        }
        .index {
          width: 60px;
        }
        .name {
          flex: 1;
        }
        .type {
          flex: 1;
        }
        .isReClass {
          flex: 1;
        }
      }
      .people-list {
        .item {
          height: 40px;
          display: flex;
          .index,
          .name,
          .type,
          .isReClass {
            text-align: center;
            line-height: 40px;
          }
          .index {
            width: 60px;
          }
          .name {
            flex: 1;
          }
          .type {
            flex: 1;
          }
          .isReClass {
            flex: 1;
          }
        }
      }
    }
    .commit-button {
      width: 280px;
      height: 42px;
      background-color: #16d0a0;
      text-align: center;
      line-height: 40px;
      border-radius: 20px;
      margin: 0 auto;
      letter-spacing: 15px;
      text-indent: 15px;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
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
