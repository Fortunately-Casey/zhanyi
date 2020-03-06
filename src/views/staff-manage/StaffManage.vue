<template>
  <div class="manage">
    <div class="header">
      账户管理
      <div class="back" @click="goBack">
        首页
        <div class="back-icon"></div>
      </div>
    </div>
    <div class="top">
      <div class="item">
        <div class="name">名字</div>
        <input type="text" v-model="paramEMPName" @blur="lostblur()" />
      </div>
      <div class="item">
        <div class="name">联系电话</div>
        <input type="number" v-model="paramEMPMobile" @blur="lostblur()" />
      </div>
      <div class="item">
        <div class="name">身份证</div>
        <input type="text" v-model="paramEMPIdCard" @blur="lostblur()" />
      </div>
    </div>
    <div class="search-button" @click="search">查&nbsp;&nbsp;&nbsp;&nbsp;询</div>
    <div class="content">
      <div class="list">
        <div class="list-header">
          <div class="name">姓名</div>
          <div class="phone">联系电话</div>
          <div class="idCard">身份证</div>
          <div class="password">密码</div>
        </div>
        <div
          class="item"
          v-for="(item, index) in list"
          :key="index"
          @click="choseItem(item,index)"
          :class="index === chosedIndex?'chosed':''"
        >
          <div class="name">{{ item.name }}</div>
          <div class="phone">{{ item.userId?item.userId:item.mobile }}</div>
          <div class="idCard">{{ returnIdCard(item.idCard) }}</div>
          <div class="password" @click.stop="showPassWord(item)">
            <div class="password-button">查看密码</div>
          </div>
        </div>
      </div>
      <div class="pagenation">
        <span @click="prev"><</span>
        {{ page }}页
        <span @click="next">></span>
      </div>
      <div class="bottom">
        <div class="delete-button" @click="deleteUser">删&nbsp;&nbsp;&nbsp;&nbsp;除</div>
        <div class="edit-button" @click="editUser">修&nbsp;&nbsp;&nbsp;&nbsp;改</div>
      </div>
      <div class="modal" v-if="isShowEdit">
        <div class="punch-success">
          <div class="icon-close" @click="closeEdit"></div>
          <div class="title">账号修改</div>
          <div class="edit-content">
            <div class="edit-item">
              <span>名字</span>
              <input type="text" v-model="chosedDetail.name" @blur="lostblur()" />
            </div>
            <div class="edit-item">
              <span>年龄</span>
              <input
                type="number"
                v-model="chosedDetail.age"
                oninput="if (value.length>3) value=value.slice(0,3)"
                @blur="lostblur()"
              />
            </div>
            <div class="edit-item">
              <span>身份证号</span>
              <input type="text" v-model="chosedDetail.idCard" @blur="lostblur()" />
            </div>
            <div class="edit-item">
              <span>账号</span>
              <input type="number" v-model="chosedDetail.userId" @blur="lostblur()" />
            </div>
            <!-- <div class="edit-item">
              <span>密码</span>
              <input type="text" v-model="chosedDetail.password" />
            </div>-->
            <div class="edit-button" @click="editConfirm">修改</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Todate, blur } from "@/common/tool/tool.js";
import { MessageBox } from "mint-ui";
import { Toast, Indicator, Popup } from "mint-ui";
import {
  getEnterpriseUserFullInfo,
  updateEnterpriseEMPUser,
  deleteEnterpriseEMPUser
} from "@/api/staffManage.js";
export default {
  data() {
    return {
      list: [],
      page: 1,
      pageSize: 5,
      paramEMPName: "",
      paramEMPMobile: "",
      paramEMPIdCard: "",
      chosedIndex: "",
      maxPage: "",
      isShowEdit: false,
      oldMobile: "",
      chosedDetail: "",
      handler: function(e) {
        e.preventDefault();
      },
      chosedPassword: "",
      popupVisible: false
    };
  },
  created() {
    var vm = this;
    document.getElementsByTagName("title")[0].innerText =
      "开发区企业员工健康申报系统";
    vm.getList();
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
    choseItem(item, index) {
      this.chosedIndex = index;
      this.chosedDetail = JSON.parse(JSON.stringify(item));
      this.oldMobile = item.userId;
    },
    search() {
      var vm = this;
      //   if (!vm.paramEMPName && !vm.paramEMPMobile && !vm.paramEMPIdCard) {
      //     Toast({
      //       message: "请输入查询信息!",
      //       iconClass: "icon icon-success"
      //     });
      //     return;
      //   }
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
    closeEdit() {
      this.isShowEdit = false;
      this.openTouch();
      this.chosedIndex = "";
      this.chosedDetail = "";
    },
    deleteUser() {
      var vm = this;
      MessageBox.confirm("确定执行此操作?", "删除当前账号").then(() => {
        deleteEnterpriseEMPUser({
          paramEnterpriseAdminUserId: vm.$route.query.userID,
          paramEnterpriseAdminPassword: vm.$route.query.password,
          paramEnterpriseID: vm.$route.query.enterpriseID,
          paramEMPMobile: vm.chosedDetail.userId
            ? vm.chosedDetail.userId
            : vm.chosedDetail.mobile
        }).then(resp => {
          if (resp.data.success) {
            vm.isShowEdit = false;
            Toast({
              message: "账号删除成功!",
              iconClass: "icon icon-success"
            });
            vm.getList();
            vm.chosedIndex = "";
            vm.chosedDetail = "";
          } else {
            Toast({
              message: resp.data.data,
              iconClass: "icon icon-success"
            });
          }
        });
      });
    },
    showPassWord(item) {
      this.chosedPassword = item.password;
      MessageBox("密码", this.chosedPassword);
    },
    editConfirm() {
      var vm = this;
      if (!vm.chosedDetail.enterpriseID) {
        Toast({
          message: "该用户还未进行基本信息登记，无法修改,可直接删除重新注册!",
          iconClass: "icon icon-success"
        });
        return;
      }
      var userNumberReg = /^[0-9a-zA-Z]*$/g;
      if (!userNumberReg.test(vm.chosedDetail.idCard)) {
        Toast({
          message: "请输入合法身份证号/护照！",
          iconClass: "icon icon-success"
        });
        return;
      }
      var phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(Number(vm.chosedDetail.userId))) {
        Toast({
          message: "请输入合法手机号！",
          iconClass: "icon icon-success"
        });
        return;
      }
      MessageBox.confirm("确定执行此操作?", "修改当前账号").then(() => {
        updateEnterpriseEMPUser({
          paramEnterpriseAdminUserId: vm.$route.query.userID,
          paramEnterpriseAdminPassword: vm.$route.query.password,
          paramEnterpriseID: vm.$route.query.enterpriseID,
          paramEMPNewMobile: vm.chosedDetail.userId,
          paramEMPOldMobile: vm.oldMobile,
          paramEMPName: vm.chosedDetail.name,
          paramEMPIdCard: vm.chosedDetail.idCard,
          paramEMPAge: vm.chosedDetail.age
        }).then(resp => {
          if (resp.data.success) {
            vm.openTouch();
            Toast({
              message: "账号修改成功!",
              iconClass: "icon icon-success"
            });
            vm.oldMobile = vm.chosedDetail.userId;
            vm.getList();
            vm.isShowEdit = false;
            vm.chosedIndex = "";
            vm.chosedDetail = "";
          } else {
            Toast({
              message: resp.data.data,
              iconClass: "icon icon-success"
            });
          }
        });
      });
    },
    getList() {
      var vm = this;
      Indicator.open();
      getEnterpriseUserFullInfo({
        paramEnterpriseAdminUserId: vm.$route.query.userID,
        paramEnterpriseAdminPassword: vm.$route.query.password,
        paramEnterpriseID: vm.$route.query.enterpriseID,
        paramEMPMobile: vm.paramEMPMobile,
        paramEMPName: vm.paramEMPName,
        paramEMPIdCard: vm.paramEMPIdCard,
        page: vm.page,
        pageSize: vm.pageSize
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          vm.list = resp.data.data;
          vm.maxPage = resp.data.page.pageCount;
        }
      });
    },
    editUser() {
      var vm = this;
      if (vm.chosedDetail) {
        vm.isShowEdit = true;
        vm.closeTouch();
      } else {
        Toast({
          message: "请选中要修改的人员！",
          iconClass: "icon icon-success"
        });
      }
    },
    lostblur(value) {
      var vm = this;
      if (value === "phone") {
        vm.phoneReg(vm.paramEMPMobile);
      } else if (value === "usernumber") {
        vm.userNumberReg(vm.paramEMPIdCard);
      }
      blur();
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
    returnIdCard(value) {
      if (value) {
        let start = value.substr(0, 6);
        let end = value.substr(value.length - 4, 4);
        return start + "*****" + end;
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
    userNumberReg(value) {
      var userNumberReg = /^[0-9a-zA-Z]*$/g;
      if (!userNumberReg.test(value)) {
        Toast({
          message: "请输入合法身份证号/护照！",
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
    }
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
  }
  .top {
    background-color: #fff;
    .item {
      height: 40px;
      border-bottom: 1px solid rgb(196, 193, 193);
      position: relative;
      .name {
        height: 40px;
        line-height: 40px;
        float: left;
        font-size: 14px;
        font-weight: bold;
        padding: 0 15px;
      }
      input {
        position: absolute;
        bottom: 0;
        right: 0;
        text-align: right;
        text-align: end;
        padding-right: 5px;
        width: 220px;
        font-size: 14px;
      }
    }
  }
  .search-button {
    width: 200px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
    background-color: #2e55d6;
    border-radius: 15px;
    margin: 15px auto;
    font-size: 14px;
  }
  .content {
    .list {
      height: 245px;
      background-color: #fff;
      .list-header,
      .item {
        border-bottom: 1px solid rgb(199, 197, 197);
        height: 40px;
        .name,
        .phone,
        .idCard,
        .password {
          float: left;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          .password-button {
            margin: 0 auto;
            width: 55px;
            height: 25px;
            line-height: 25px;
            background-color: rgb(45, 127, 233);
            color: #fff;
            font-size: 12px;
            margin-top: 7.5px;
            border-radius: 5px;
          }
        }
        .name {
          width: 15%;
        }
        .phone {
          width: 23%;
        }
        .idCard {
          width: 40%;
        }
        .password {
          width: 22%;
          word-wrap: break-word;
          word-break: break-all;
        }
      }
      .chosed {
        background-color: rgba(10, 87, 202, 0.5);
        color: #fff;
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
      .delete-button,
      .edit-button {
        width: 95px;
        height: 40px;
        border-radius: 20px;
        background-color: #2e55d6;
        text-align: center;
        line-height: 40px;
        color: #fff;
        font-size: 15px;
        margin: 20px auto;
      }
      .delete-button {
        background-color: rgb(236, 72, 72);
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
      .title {
        height: 30px;
        line-height: 30px;
        font-size: 14px;
      }
      .edit-content {
        width: 100%;
        .edit-item {
          height: 40px;
          text-align: left;
          span {
            display: inline-block;
            width: 60px;
            padding-left: 5px;
            font-size: 14px;
          }
          input {
            font-size: 14px;
          }
        }
        .edit-button {
          width: 100px;
          height: 35px;
          line-height: 35px;
          border-radius: 17.5px;
          margin: 0 auto;
          background-color: #2e55d6;
          color: #fff;
          font-size: 14px;
        }
      }
    }
  }
}
</style>
