<template>
  <div class="children-edit">
    <div class="header">
      <div class="back" @click="goBack">
        <div class="back-icon"></div>
        首页
      </div>
      <!-- <div class="delete" v-if="isShowDelete" @click="deleteChild">删除</div> -->
      {{ title }}
    </div>
    <div class="content">
      <div class="item">
        <div class="name">姓名</div>
        <div class="edit-value">
          <input
            type="text"
            v-model="childName"
            @blur="blur"
            placeholder="输入姓名"
          />
        </div>
      </div>
      <div class="item" @click="isShowSexList = true">
        <div class="name">性别</div>
        <div class="edit-value">
          <input type="text" v-model="sex" placeholder="选择性别" disabled />
        </div>
      </div>
      <div class="item">
        <div class="name userId">身份证号</div>
        <div class="edit-value">
          <input v-model="idCard" @blur="blur" placeholder="输入身份证号" />
        </div>
      </div>
      <div class="item" @click="showSchoolList">
        <div class="name">学校</div>
        <div class="edit-value">
          <input
            type="text"
            style="width:260px"
            placeholder="选择学校"
            v-model="schoolName"
            disabled
          />
        </div>
      </div>
      <div class="item" @click="showClassList">
        <div class="name">班级</div>
        <div class="edit-value">
          <input
            type="text"
            placeholder="选择班级"
            v-model="classInfo.enterpriseName"
            disabled
          />
        </div>
      </div>
    </div>
    <div class="now-address">
      <div class="address">
        <div class="click-value">
          <div class="name">在通居住地</div>
          <div class="icon-cross" @click="openNanTong">></div>
        </div>
      </div>
      <div class="chosedvalue" v-show="chosedValue">
        <div class="item">{{ chosedValue.area }}</div>
        <div class="item">{{ chosedValue.xian }}</div>
      </div>
      <input
        type="text"
        v-model="nowAddress"
        placeholder="详细地址：道路、门牌号、楼栋号、单元号"
        @blur="blur"
      />
    </div>
    <div class="save-button" @click="saveInfo">保存</div>
    <div class="modal" v-if="isShowSchoolList">
      <div class="list">
        <div class="list-top">
          选择学校
          <div class="icon-close" @click="closeSchoolList"></div>
        </div>
        <scroll class="wrapper">
          <ul>
            <li
              v-for="(item, index) in schoolList"
              @click="choseSchool(item)"
              :key="index"
            >
              {{ item.enterpriseName }}
            </li>
          </ul>
        </scroll>
      </div>
    </div>
    <div class="modal" v-if="isShowClassList">
      <div class="list">
        <div class="list-top">
          选择班级
          <div class="icon-close" @click="closeClassList"></div>
        </div>
        <scroll class="wrapper">
          <ul>
            <li
              v-for="(item, index) in classList"
              @click="choseClass(item)"
              :key="index"
            >
              {{ item.enterpriseName }}
            </li>
          </ul>
        </scroll>
      </div>
    </div>
    <div class="modal" v-if="isShowSexList">
      <div class="sex">
        <div class="list-top">
          选择性别
          <div class="icon-close" @click="closeSexList"></div>
        </div>
        <scroll class="wrapper">
          <ul>
            <li
              v-for="(item, index) in sexList"
              @click="choseSex(item)"
              :key="index"
            >
              {{ item }}
            </li>
          </ul>
        </scroll>
      </div>
    </div>
    <nantong-area
      :isShow="isShowNantongList"
      @choseNantong="choseNantong"
      @closeNantong="closeNantong"
    ></nantong-area>
  </div>
</template>
<script>
import Scroll from "../../components/Scroll";
import NantongArea from "@/components/NantongArea.vue";
import {
  getEnterpriseUser,
  updateTeacherInfo,
  deleteEnterpriseEMPUser,
  addDirectEnterpriseUser,
  getEnterpriseList
} from "@/api/schoolRegister.js";
import { blur } from "@/common/tool/tool";
import { Indicator, Toast, MessageBox } from "mint-ui";
export default {
  data() {
    return {
      title: "添加个人信息",
      schoolList: [],
      classList: [],
      schoolName: "",
      childName: "",
      idCard: "",
      oldParentEnterpriseID: "",
      oldEnterpriseID: "",
      parentEnterpriseID: "",
      enterpriseID: "",
      isShowSchoolList: false,
      classInfo: {},
      isShowClassList: false,
      isShowNantongList: false,
      chosedValue: "",
      sexList: ["男", "女"],
      sex: "",
      isShowSexList: false,
      isShowDelete: false,
      nowAddress: ""
    };
  },
  created() {
    if (this.$route.query.type == "edit") {
      this.title = "修改个人信息";
      this.isShowDelete = true;
      this.getEnterpriseUser();
    } else {
      this.title = "添加个人信息";
      this.isShowDelete = false;
    }
    var vm = this;
    // 获取学校列表
    getEnterpriseList({
      level: "Group"
    }).then(resp => {
      vm.schoolList = resp.data.data;
    });
  },
  methods: {
    // 获取个人信息
    getEnterpriseUser() {
      var vm = this;
      Indicator.open();
      getEnterpriseUser({
        idCard: vm.$route.query.idCard
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          vm.childName = resp.data.data.name;
          vm.sex = resp.data.data.sex;
          vm.idCard = resp.data.data.idCard;
          vm.schoolName = resp.data.data.parentEnterpriseName;
          vm.classInfo.enterpriseName = resp.data.data.enterpriseName;
          vm.oldParentEnterpriseID = resp.data.data.parentEnterpriseID;
          vm.oldEnterpriseID = resp.data.data.enterpriseID;
          vm.parentEnterpriseID = resp.data.data.parentEnterpriseID;
          vm.enterpriseID = resp.data.data.enterpriseID;
          vm.chosedValue = {
            area: resp.data.data.currCounty,
            xian: resp.data.data.currStreet
          };
          vm.nowAddress = resp.data.data.currAddress;
        } else {
          Toast({
            message: "获取子女信息失败，请联系技术人员!",
            iconClass: "icon icon-success"
          });
        }
      });
    },
    // 保存
    saveInfo() {
      MessageBox.confirm("", {
        message: "确定要执行此操作吗？",
        title: "个人信息"
      }).then(() => {
        if (this.$route.query.type == "edit") {
          this.editTeacherInfo();
        } else {
          this.addTeacherInfo();
        }
      });
    },
    // 新增个人信息
    addTeacherInfo() {
      var vm = this;
      if (!vm.idCard) {
        Toast({
          message: "身份证不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.sex) {
        Toast({
          message: "性别不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.childName) {
        Toast({
          message: "姓名不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.schoolName) {
        Toast({
          message: "学校不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.classInfo.enterpriseName) {
        Toast({
          message: "班级不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.chosedValue.area || !vm.chosedValue.xian || !vm.nowAddress) {
        Toast({
          message: "请填写完整的现居住地!",
          iconClass: "icon icon-success"
        });
        return;
      }
      addDirectEnterpriseUser({
        idCard: vm.idCard,
        name: vm.childName,
        sex: vm.sex,
        currProvince: "江苏省",
        currCity: "南通市",
        currCounty: vm.chosedValue.area,
        currStreet: vm.chosedValue.xian,
        currAddress: vm.nowAddress,
        sysUserID: vm.$route.query.userID,
        enterpriseID: vm.classInfo.enterpriseID,
        enterpriseName: vm.classInfo.enterpriseName,
        parentEnterpriseID: vm.parentEnterpriseID,
        parentEnterpriseName: vm.schoolName
      }).then(resp => {
        if (resp.data.success) {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
          vm.goBack();
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    // 修改老师信息
    editTeacherInfo() {
      var vm = this;
      var parentPassword = window.localStorage.getItem("teacherPassword");
      if (!vm.idCard) {
        Toast({
          message: "身份证不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.sex) {
        Toast({
          message: "性别不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.childName) {
        Toast({
          message: "姓名不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.schoolName) {
        Toast({
          message: "学校不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }

      if (!vm.classInfo.enterpriseName) {
        Toast({
          message: "班级不能为空!",
          iconClass: "icon icon-success"
        });
        return;
      }
      var userNumberReg =
        // /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
        // /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        /^[0-9a-zA-Z]*$/g;
      if (!userNumberReg.test(vm.idCard)) {
        Toast({
          message: "请输入合法身份证号！",
          iconClass: "icon icon-success"
        });
        return;
      }
      if (!vm.chosedValue.area || !vm.chosedValue.xian || !vm.nowAddress) {
        Toast({
          message: "请填写完整的现居住地!",
          iconClass: "icon icon-success"
        });
        return;
      }

      updateTeacherInfo({
        paramOldEnterpriseID: vm.oldEnterpriseID,
        paramOldParentEnterpriseID: vm.oldParentEnterpriseID,
        paramNewEnterpriseID: vm.enterpriseID,
        paramNewParentEnterpriseID: vm.parentEnterpriseID,
        paramNewEnterpriseName: vm.classInfo.enterpriseName,
        paramNewParentEnterpriseName: vm.schoolName,
        paramSysUserID: vm.$route.query.userID,
        paramPassword: parentPassword,
        paramEMPOldIdCard: vm.$route.query.idCard,
        paramEMPNewIdCard: vm.idCard,
        paramEMPName: vm.childName,
        paramEMPSex: vm.sex,
        paramCurrProvince: "江苏省",
        paramCurrCity: "南通市",
        paramCurrCounty: vm.chosedValue.area,
        paramCurrStreet: vm.chosedValue.xian,
        paramCurrAddress: vm.nowAddress
      }).then(resp => {
        if (resp.data.success) {
          Toast({
            message: "修改成功!",
            iconClass: "icon icon-success"
          });
          vm.goBack();
        } else {
          Toast({
            message: resp.data.data,
            iconClass: "icon icon-success"
          });
        }
      });
    },
    // 删除子女
    deleteChild() {
      var vm = this;
      var parentPassword = window.localStorage.getItem("parentPassword");
      MessageBox.confirm("确定执行此操作?", "删除当前子女").then(() => {
        Indicator.open();
        deleteEnterpriseEMPUser({
          paramEnterpriseID: vm.oldEnterpriseID,
          paramParentEnterpriseID: vm.oldParentEnterpriseID,
          paramSysUserID: vm.$route.query.userID,
          paramPassword: parentPassword,
          paramIdCard: vm.idCard
        }).then(resp => {
          Indicator.close();
          if (resp.data.success) {
            Toast({
              message: "删除成功!",
              iconClass: "icon icon-success"
            });
            vm.goBack();
          } else {
            Toast({
              message: resp.data.data,
              iconClass: "icon icon-success"
            });
          }
        });
      });
    },
    blur() {
      blur();
    },
    // 返回首页
    goBack() {
      this.$router.push({
        path: "/teacherInfo",
        query: {
          userID: this.$route.query.userID
        }
      });
    },
    choseSex(item) {
      this.sex = item;
      this.isShowSexList = false;
    },
    choseSchool(item) {
      var vm = this;
      this.schoolName = item.enterpriseName;
      this.parentEnterpriseID = item.enterpriseID;
      this.isShowSchoolList = false;
      Indicator.open();
      // this.className = "";
      getEnterpriseList({
        parentEnterpriseID: vm.parentEnterpriseID,
        level: "Base"
      }).then(resp => {
        Indicator.close();
        vm.classInfo = resp.data.data[0];
        vm.enterpriseID = resp.data.data[0].enterpriseID;
      });
    },
    choseClass(item) {
      this.className = item.enterpriseName;
      this.enterpriseID = item.enterpriseID;
      this.isShowClassList = false;
    },
    showSchoolList() {
      var vm = this;
      vm.isShowSchoolList = true;
    },
    showClassList() {
      var vm = this;
      if (!vm.schoolName) {
        Toast({
          message: "请先选择学校！",
          iconClass: "icon icon-success"
        });
        return;
      }
    },
    closeSchoolList() {
      this.isShowSchoolList = false;
    },
    closeClassList() {
      this.isShowClassList = false;
    },
    closeSexList() {
      this.isShowSexList = false;
    },
    openNanTong() {
      this.isShowNantongList = true;
    },
    choseNantong(value) {
      this.isShowNantongList = value.isShow;
      this.chosedValue = value.chosedValue;
    },
    closeNantong(value) {
      this.isShowNantongList = value.isShow;
    }
  },
  components: {
    Scroll,
    NantongArea
  }
};
</script>
<style lang="less" scoped>
.children-edit {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: #eee;
  .header {
    height: 40px;
    background-color: #16d0a0;
    color: #fff;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    position: relative;
    .back,
    .delete {
      width: 60px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      .back-icon {
        width: 8px;
        height: 13px;
        background: url("../../assets/image/back-icon.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        top: 48%;
        transform: translateY(-50%);
      }
    }
    .back {
      left: 15px;
    }
    .delete {
      right: 0px;
    }
  }
  .content {
    background-color: #fff;
    .item {
      height: 40px;
      border-bottom: 1px solid #efefef;
      display: flex;
      .name,
      .userId {
        width: 80px;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
        letter-spacing: 18px;
        text-align: center;
        text-indent: 15px;
      }
      .userId {
        letter-spacing: 0px;
        text-indent: 0px;
      }
      .edit-value {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        input {
          text-align: right;
          text-align: end;
          padding-right: 15px;
          font-size: 14px;
          margin: 0;
          height: 40px;
          width: 200px;
        }
      }
    }
  }
  .now-address {
    // height: 115px;
    margin-top: 20px;
    background-color: #fff;
    text-align: center;
    .address {
      height: 40px;
      .click-value {
        width: 346px;
        margin: 0 auto;
        height: 40px;
        border-bottom: 1px solid #eee;
        position: relative;
        .name {
          width: 80px;
          text-align: center;
          line-height: 40px;
          font-size: 14px;
          text-align: left;
        }
        .icon-cross {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          float: right;
          position: absolute;
          font-size: 16px;
          font-weight: bold;
          right: 0;
          top: 10px;
        }
      }
    }
    .chosedvalue {
      .item {
        height: 30px;
        line-height: 30px;
        text-align: right;
        font-size: 14px;
        padding-right: 20px;
        font-weight: 100;
      }
    }
    input {
      width: 346px;
      margin: 0 auto;
      margin-top: 10px;
      margin-bottom: 30px;
      height: 40px;
      font-size: 14px;
    }
  }
  .save-button {
    margin: 0 auto;
    margin-top: 150px;
    width: 280px;
    height: 42px;
    background-image: linear-gradient(270deg, #ed665b 0%, #d6362e 100%);
    background: #16d0a0;
    border-radius: 21px;
    font-size: 16px;
    color: #ffffff;
    letter-spacing: 0.89px;
    text-align: center;
    line-height: 42px;
  }
  .modal {
    width: 100%;
    height: 100%;
    background-color: rgba(59, 58, 58, 0.623);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    .list {
      width: 100%;
      height: 450px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #fff;
      border-radius: 8px 8px 0 0;
      .list-top {
        height: 45px;
        width: 100%;
        text-align: center;
        font-size: 15px;
        line-height: 45px;
        position: relative;
        background-color: #fff;
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
      .wrapper {
        height: 400px;
        overflow: hidden;
        ul {
          list-style: none;
          li {
            height: 35px;
            line-height: 35px;
            font-size: 14px;
          }
        }
      }
    }
    .sex {
      width: 100%;
      height: 150px;
      position: absolute;
      left: 0;
      bottom: 0;
      background-color: #fff;
      border-radius: 8px 8px 0 0;
      .list-top {
        height: 45px;
        width: 100%;
        text-align: center;
        font-size: 15px;
        line-height: 45px;
        position: relative;
        background-color: #fff;
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
      .wrapper {
        height: 100px;
        overflow: hidden;
        ul {
          list-style: none;
          li {
            height: 35px;
            line-height: 35px;
            font-size: 14px;
          }
        }
      }
    }
  }
}
</style>
