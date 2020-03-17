<template>
  <div class="school-main">
    <div class="top-bg">
      <div class="title"></div>
    </div>
    <div class="teacher" v-if="!isShowAddButton">
      <div class="left" @click="editTeacher(teacherInfo)">
        <div class="teacher-name">
          <div
            class="teacher-logo"
            :class="teacherInfo.sex === '男' ? 'man' : 'women'"
          ></div>
          <div class="name">{{ teacherInfo.name }}</div>
        </div>
        <div class="teacher-values">
          <div class="value">
            教职工
            <span
              class="punch-status"
              :class="
                returnPunchStatus(teacherInfo.lastPeriodplaceTime) === '已打卡'
                  ? 'isPunch'
                  : ''
              "
              >{{ returnPunchStatus(teacherInfo.lastPeriodplaceTime) }}</span
            >
          </div>
          <div class="value schoolName">
            {{ teacherInfo.parentEnterpriseName }}
          </div>
          <div class="value">{{ teacherInfo.idCard }}</div>
        </div>
      </div>
      <div class="right" @click="teacherPunch(teacherInfo.idCard)">
        <div class="punch-icon"></div>
      </div>
    </div>
    <div class="add-button" @click="addInfo" v-if="isShowAddButton"></div>
  </div>
</template>
<script>
import { getTeacherBySysUserID } from "@/api/schoolRegister.js";
import { Indicator } from "mint-ui";
import { Todate } from "@/common/tool/tool";
export default {
  data() {
    return {
      teacherInfo: {},
      isShowAddButton: true
    };
  },
  created() {
    this.getTeacherBySysUserID();
  },
  methods: {
    // 获取个人信息
    getTeacherBySysUserID() {
      var vm = this;
      Indicator.open();
      getTeacherBySysUserID({
        sysUserID: vm.$route.query.userID
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          if (resp.data.data.length > 0) {
            vm.isShowAddButton = false;
            vm.teacherInfo = resp.data.data[0];
          }
        }
      });
    },
    // 修改个人信息
    editTeacher(item) {
      this.$router.push({
        path: "/teacherEdit",
        query: {
          type: "edit",
          userID: this.$route.query.userID,
          idCard: item.idCard
        }
      });
    },
    returnPunchStatus(date) {
      if (date) {
        let nowDate = Todate(new Date());
        let punchDate = date.substr(0, 10);
        if (nowDate == punchDate) {
          return "已打卡";
        } else {
          return "未打卡";
        }
      } else {
        return "未打卡";
      }
    },
    // 添加个人信息
    addInfo() {
      this.$router.push({
        path: "/teacherEdit",
        query: {
          type: "add",
          userID: this.$route.query.userID
        }
      });
    },
    // 教师打卡
    teacherPunch(idCard) {
      this.$router.push({
        path: "/enterprisePunch",
        query: {
          idCard: idCard,
          type: "teacher"
        }
      });
    }
  },
  components: {}
};
</script>
<style lang="less" scoped>
.school-main {
  height: 100%;
  background: url("../../assets/image/bottom-bg.png") no-repeat;
  background-size: contain;
  background-position: left bottom;
  .top-bg {
    width: 100%;
    height: 152px;
    background: url("../../assets/image/children-bg.png") no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      width: 74px;
      height: 18px;
      background: url("../../assets/image/teacher-title.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .teacher {
    width: 335px;
    height: 108px;
    margin: 10px auto;
    background: #ffffff;
    box-shadow: 0 0 5px 2px rgba(99, 163, 141, 0.5);
    border-radius: 8px;
    display: flex;
    transform: translateY(10px);
    .left {
      width: 255px;
      border-radius: 8px 0 0 8px;
      display: flex;
      .teacher-name {
        width: 70px;
        .teacher-logo {
          width: 40px;
          height: 40px;
          margin: 15px auto;
        }
        .man {
          background: url("../../assets/image/man-logo.png") no-repeat;
          background-size: 100% 100%;
        }
        .women {
          background: url("../../assets/image/women-logo.png") no-repeat;
          background-size: 100% 100%;
        }
        .name {
          text-align: center;
          font-size: 14px;
          color: #16d0a0;
          font-weight: bold;
        }
      }
      .teacher-values {
        width: 185px;
        padding-top: 10px;
        .schoolName {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .value {
          height: 30px;
          line-height: 30px;
          font-size: 14px;
          position: relative;
          .punch-status {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-40%);
            font-size: 13px;
          }
          .isPunch {
            color: #16d0a0;
          }
        }
      }
    }
    .right {
      width: 80px;
      border-radius: 0 8px 8px 0;
      background-color: #35d89d;
      display: flex;
      justify-content: center;
      align-items: center;
      .punch-icon {
        width: 24px;
        height: 24px;
        background: url("../../assets/image/punch-icon.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  .add-button {
    width: 335px;
    height: 60px;
    background: url("../../assets/image/add-teacherInfo.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
