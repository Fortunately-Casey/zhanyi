<template>
  <div class="manage">
    <div class="header">
      教职工打卡管理
      <div class="back" @click="goBack">
        返回
        <div class="back-icon"></div>
      </div>
      <!-- <span class="qrcode" @click="isShowQrcode = true">打卡二维码</span> -->
    </div>
    <div class="content">
      <div class="class-name">{{ className }}</div>
      <div class="date" @click="openDate">
        {{ returnDate(date) }}
        <span class="cart"></span>
      </div>
      <scroll class="wrapper">
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
            :class="chosedIndex === 5 ? 'active' : ''"
            @click="choseTab(5)"
          >
            已审核{{ chosedIndex === 5 ? `(${count})` : "" }}
          </div>
          <div
            class="item"
            :class="chosedIndex === 4 ? 'active' : ''"
            @click="choseTab(4)"
          >
            未审核{{ chosedIndex === 4 ? `(${count})` : "" }}
          </div>
          <div
            class="item"
            :class="chosedIndex === 0 ? 'active' : ''"
            @click="choseTab(0)"
          >
            未打卡{{ chosedIndex === 0 ? `(${count})` : "" }}
          </div>
          <div
            class="item"
            :class="chosedIndex === 6 ? 'active' : ''"
            @click="choseTab(6)"
          >
            异常{{ chosedIndex === 6 ? `(${count})` : "" }}
          </div>
        </div>
      </scroll>
      <div class="list">
        <div class="list-header">
          <div class="index">序号</div>
          <div class="name">姓名</div>
          <div class="temp">体温</div>
          <div class="isCough">有无症状</div>
          <div class="phone">联系电话</div>
          <div class="option">操作</div>
        </div>
        <div
          class="item"
          v-for="(item, index) in list"
          :class="returnHot(item)"
          :key="index"
          @click="choseItem(item)"
        >
          <div class="index">{{ item.number }}</div>
          <div class="name">{{ item.name }}</div>
          <div class="temp">{{ item.temp }}</div>
          <div class="isCough">{{ returnCough(item.cough) }}</div>
          <div class="phone">{{ item.sysUserID }}</div>
          <div class="option">
            <div
              class="dangerStatus"
              :class="item.dangerousFlag === 'Dangerous' ? 'error' : 'normal'"
              v-if="chosedIndex === 6"
              @click.stop="changeDanger(item)"
            >
              {{ item.dangerousFlag === "Dangerous" ? "异常" : "正常" }}
            </div>
            <div v-else>
              <span v-if="item.id === 0">未打卡</span>
              <div class="delete-button" @click.stop="deletePunch(item)" v-else>
                删除
              </div>
            </div>
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
        <div
          class="punch-button"
          @click="approvalPeriodPlace"
          v-show="chosedIndex === 5 ? false : true"
        >
          审核
        </div>
        <!-- <div class="import-button" @click="importValue">导入数据</div> -->
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
          <li>
            <div class="name">返通居住地:</div>
            <div class="value">
              {{
                chosedDetail.currCity +
                  chosedDetail.currCounty +
                  chosedDetail.currStreet +
                  chosedDetail.currAddress
              }}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="modal" v-show="isShowDownload">
      <div class="punch-detail">
        <div class="icon-close" @click="isShowDownload = false"></div>
        <div class="download-message">
          下载今日健康报告信息请复制以下链接到浏览器中打开
        </div>
        <div class="url-message">{{ downloadUrl }}</div>
        <button
          class="btn"
          :data-clipboard-text="downloadUrl"
          @click="copyAlert"
        >
          复制链接
        </button>
      </div>
    </div>
    <div class="modal" v-show="isShowImport">
      <div class="punch-detail">
        <div class="icon-close" @click="isShowImport = false"></div>
        <div class="download-message">导入数据请复制以下链接到浏览器中打开</div>
        <div class="url-message">{{ importUrl }}</div>
        <button
          class="btn"
          :data-clipboard-text="importUrl"
          @click="copyImport"
        >
          复制链接
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { Todate } from "@/common/tool/tool.js";
import { MessageBox } from "mint-ui";
import {
  getEnterprisePeriodPlaceList,
  deleteEnterprisePeriodPlace,
  updateEnterprisePeriodPlaceDangerousFlag,
  approvalPeriodPlace
} from "@/api/manage.js";
import { getSpecialEnterprise } from "@/api/schoolRegister.js";
import { Toast, Indicator } from "mint-ui";
import VueQr from "vue-qr";
import Clipboard from "clipboard";
import Scroll from "@/components/Scroll.vue";
import { weixinTransform } from "@/common/data.js";
export default {
  data() {
    return {
      date: new Date(),
      pickerValue: new Date(),
      enterpriseID: "",
      parentEnterpriseID: "",
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
      imageUrl: require("../../assets/image/zhanyi-logo.png"),
      isShowDetail: false,
      chosedDetail: "",
      isShowDownload: false,
      downloadUrl: "",
      isShowImport: false,
      importUrl: "",
      phoneNumber: "",
      password: "",
      className: ""
    };
  },
  created() {
    var vm = this;
    vm.getSpecialEnterprise();
  },
  mounted() {
    const clipboard = new Clipboard(".btn");
  },
  methods: {
    getSpecialEnterprise() {
      var vm = this;
      Indicator.open();
      getSpecialEnterprise({
        enterpriseID: this.$route.query.enterpriseID
      }).then(resp => {
        Indicator.close();
        vm.className = resp.data.data.enterpriseName;
        vm.phoneNumber = resp.data.data.adminUserID;
        vm.password = resp.data.data.password;
        vm.enterpriseID = resp.data.data.enterpriseID;
        vm.parentEnterpriseID = resp.data.data.parentEnterpriseID;
        vm.getList();
      });
    },
    returnDate(value) {
      return Todate(value);
    },
    goBack() {
      this.$router.go(-1);
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
      this.chosedDetail = item;
      this.isShowDetail = true;
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
    importValue() {
      this.importUrl = `http://119.3.194.191:8089/#/importStaff?name=${this.list[0].enterpriseName}&id=${this.$route.query.enterpriseID}`;
      this.isShowImport = true;
    },
    deletePunch(item) {
      var vm = this;
      MessageBox.confirm("确定执行此操作?", "删除当前记录").then(() => {
        var params = {
          enterprisePeriodPlaceID: item.id,
          enterpriseID: vm.enterpriseID
        };
        Indicator.open();
        deleteEnterprisePeriodPlace(params).then(resp => {
          Indicator.close();
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
    changeDanger(item) {
      var vm = this;
      Indicator.open();
      updateEnterprisePeriodPlaceDangerousFlag({
        enterprisePeriodPlaceID: item.id,
        enterpriseID: vm.enterpriseID,
        dangerousFlag:
          item.dangerousFlag === "Dangerous" ? "Normal" : "Dangerous"
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          Toast({
            message: "修改成功！",
            iconClass: "icon icon-success"
          });
          vm.page = 1;
          vm.getList();
        } else {
          Toast({
            message: "修改失败！",
            iconClass: "icon icon-success"
          });
        }
      });
    },
    getList() {
      var vm = this;
      Indicator.open();
      getEnterprisePeriodPlaceList({
        paramPeriodPlaceDate: vm.returnDate(vm.date),
        paramStatus: vm.chosedIndex,
        paramPage: vm.page,
        paramPageSize: vm.pageSize,
        paramEnterpriseAdminUserId: vm.phoneNumber,
        paramEnterpriseAdminPassword: vm.password,
        paramEnterpriseID: vm.enterpriseID,
        paramParentEnterpriseID: vm.parentEnterpriseID
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
    download() {
      // var vm = this;
      // Indicator.open();
      // exportEnterprisePeriodPlaceList({
      //   enterpriseID: vm.$route.query.enterpriseID,
      //   periodPlaceDate: vm.returnDate(vm.date),
      //   status: vm.chosedIndex
      // }).then(resp => {
      //   Indicator.close();
      //   this.isShowDownload = true;
      //   vm.downloadUrl = "https://yqfk.ntschy.com:10000" + resp.data.data;
      // });
    },
    copyAlert() {
      Toast({
        message: "复制成功！",
        iconClass: "icon icon-success"
      });
    },
    copyImport() {
      Toast({
        message: "复制成功！",
        iconClass: "icon icon-success"
      });
    },
    approvalPeriodPlace() {
      var vm = this;
      Indicator.open();
      approvalPeriodPlace({
        paramEnterpriseAdminUserId: vm.phoneNumber,
        paramEnterpriseAdminPassword: vm.password,
        paramEnterpriseID: vm.enterpriseID,
        paramPeriodPlaceDate: vm.returnDate(vm.date)
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          Toast({
            message: resp.data.data,
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
    VueQr,
    Scroll
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
        .temp,
        .isCough,
        .phone,
        .option {
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
          .dangerStatus {
            margin: 0 auto;
            width: 35px;
            height: 25px;
            line-height: 25px;
            color: #fff;
            margin-top: 7.5px;
            border-radius: 5px;
          }
          .normal {
            background-color: rgb(45, 217, 233);
          }
          .error {
            background-color: rgb(245, 27, 27);
          }
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
        background-color: rgb(245, 122, 100);
        .temp {
          color: #fff;
        }
      }
    }
    .pagenation {
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 15px;
      background-color: #eee;
      padding-top: 10px;
      span {
        height: 30px;
        line-height: 30px;
        width: 50px;
        padding: 0 10px;
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
  }
}
</style>
