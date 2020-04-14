<template>
  <div class="school-miss-manage">
    <div class="header">
      <div class="back" @click="goBack">
        <div class="back-icon"></div>上一页
      </div>学校缺课上报情况
    </div>
    <div class="content">
      <div class="date" @click="openDate">
        {{ returnDate(date) }}
        <span class="cart"></span>
      </div>
      <div class="manage-table">
        <div class="manage-header">
          <div class="school-name">学校名称</div>
          <div class="miss-teacher">教职工缺课</div>
          <div class="miss-student">学生缺课</div>
          <div class="is-appear">是否上报</div>
        </div>
        <div class="manage-list">
          <div
            class="item"
            v-for="(item, index) in schoollist"
            :key="index"
            @click="choseDetail(item)"
          >
            <div class="school-name">{{ item.enterpriseName }}</div>
            <div class="miss-teacher">{{ item.facultySum }}</div>
            <div class="miss-student">{{ item.studentSum }}</div>
            <div class="is-appear">{{ item.studentSum ? "是" : "否" }}</div>
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
    <div class="modal" v-show="isShowDetail">
      <div class="punch-detail">
        <div class="icon-close" @click="isShowDetail = false"></div>
        <ul class="detail-list">
          <li>
            <div class="name">学校名称:</div>
            <div class="value">{{ chosedDetail.enterpriseName }}</div>
          </li>
          <li>
            <div class="name">教职工缺课:</div>
            <div class="value">{{ chosedDetail.facultySum }}</div>
          </li>
          <li>
            <div class="name">学生缺课:</div>
            <div class="value">{{ chosedDetail.studentSum }}</div>
          </li>
          <li>
            <div class="name">是否上报:</div>
            <div class="value">{{ chosedDetail.studentSum ? "是" : "否" }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import { Todate } from "@/common/tool/tool.js";
import { Indicator } from "mint-ui";
import { absenceStatistics } from "@/api/missClass";
export default {
  data() {
    return {
      pickerValue: new Date(),
      date: new Date(),
      handler: function(e) {
        e.preventDefault();
      },
      schoollist: [],
      page: 1,
      isShowDetail: false,
      chosedDetail: {},
      pageSize: 10,
      maxPage:4
    };
  },
  mounted() {
    // 获取学校上报情况
    this.absenceStatistics();
  },
  methods: {
    absenceStatistics() {
      let vm = this;
      Indicator.open();
      absenceStatistics({
        currPage: vm.page,
        pageSize: vm.pageSize,
        absentDate: vm.returnDate(vm.date)
      }).then(resp => {
        if (resp.data.success && resp.data.data) {
          Indicator.close();
          vm.schoollist = resp.data.data.obj;
        }
      });
    },
    choseDetail(item) {
      this.isShowDetail = true;
      this.chosedDetail = item;
    },
    returnDate(value) {
      return Todate(value);
    },
    goBack() {
      this.$router.go(-1);
    },
    openDate() {
      this.$refs.datepicker.open();
      this.closeTouch();
    },
    confirmDate(value) {
      this.date = value;
      this.page = 1;
      this.absenceStatistics();
      this.openTouch();
    },
    closeDate() {
      this.openTouch();
    },
    prev() {
      var vm = this;
      if (vm.page <= 1) {
        return;
      }
      vm.page--;
      vm.absenceStatistics();
    },
    next() {
      var vm = this;
      if (vm.page >= vm.maxPage) {
        return;
      }
      vm.page++;
      vm.absenceStatistics();
    },
    openTouch() {
      document
        .getElementsByTagName("body")[0]
        .removeEventListener("touchmove", this.handler, {
          passive: true
        }); //打开默认事件
    },
    closeTouch() {
      document
        .getElementsByTagName("body")[0]
        .addEventListener("touchmove", this.handler, {
          passive: false
        }); //阻止默认事件
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
.school-miss-manage {
  height: 100%;
  background-color: #eee;
  .header {
    height: 40px;
    background-color: #16d0a0;
    color: #fff;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    position: relative;
    text-align: center;
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
    .manage-table {
      background-color: #fff;
      .manage-header {
        height: 40px;
        display: flex;
        border-bottom: 1px solid #efefef;
        font-weight: bold;
        .school-name,
        .miss-teacher,
        .miss-student,
        .is-appear {
          text-align: center;
          line-height: 40px;
        }
        .school-name {
          flex: 1;
        }
        .miss-teacher {
          width: 80px;
        }
        .miss-student {
          width: 80px;
        }
        .is-appear {
          width: 60px;
        }
      }
      .manage-list {
        border-bottom: 1px solid #efefef;
        font-weight: bold;
        .item {
          display: flex;
          width: 100%;
          height: 40px;
          border-bottom: 1px solid #efefef;
          background-color: #fff;
          .school-name,
          .miss-teacher,
          .miss-student,
          .is-appear {
            text-align: center;
            line-height: 40px;
          }
          .school-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
            padding-left: 5px;
          }
          .miss-teacher {
            width: 80px;
          }
          .miss-student {
            width: 80px;
          }
          .is-appear {
            width: 60px;
          }
        }
      }
      .manage-list {
        font-weight: 400;
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
