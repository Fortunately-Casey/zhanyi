<template>
  <div class="school-main">
    <div class="top-bg">
      <div class="title"></div>
    </div>
    <scroll
      ref="wrapper"
      :listenScroll="true"
      :pullup="true"
      :data="childList"
      class="wrapper"
    >
      <ul class="child-list">
        <li class="child" v-for="(item, index) in childList" :key="index">
          <div class="left" @click="editChildren(item)">
            <div class="child-name">
              <div
                class="child-logo"
                :class="item.sex === '男' ? 'boy' : 'girl'"
              ></div>
              <div class="name">{{ item.name }}</div>
            </div>
            <div class="child-values">
              <div class="value">
                {{ item.enterpriseName }}
                <span
                  class="punch-status"
                  :class="
                    returnPunchStatus(item.lastPeriodplaceTime) === '已打卡'
                      ? 'isPunch'
                      : ''
                  "
                  >{{ returnPunchStatus(item.lastPeriodplaceTime) }}</span
                >
              </div>
              <div class="value schoolName">
                {{ item.parentEnterpriseName }}
              </div>
              <div class="value">{{ item.idCard }}</div>
            </div>
          </div>
          <div class="right" @click="childPunch(item.idCard)">
            <div class="punch-icon"></div>
          </div>
        </li>
      </ul>
    </scroll>
    <div class="add-button" @click="addChild"></div>
    <van-overlay :show="show">
      <div class="advertising"></div>
      <div class="close">
        <van-icon name="cross" size="40" @click="closeAdvertising" />
      </div>
      <p @click="goToUrl">
        共同关注宝宝健康，4.25预防接种日南通疾控邀您答题抢红包！
      </p>
    </van-overlay>
  </div>
</template>
<script>
import Scroll from "../../components/Scroll";
import { getEnterpriseUserBySysUserID } from "@/api/schoolRegister.js";
import { Indicator } from "mint-ui";
import { Todate } from "@/common/tool/tool";
export default {
  data() {
    return {
      childList: [],
      show: false
    };
  },
  created() {
    this.getEnterpriseUserBySysUserID();
  },
  methods: {
    // 获取子女列表
    getEnterpriseUserBySysUserID() {
      var vm = this;
      Indicator.open();
      getEnterpriseUserBySysUserID({
        sysUserID: vm.$route.query.userID
      }).then(resp => {
        Indicator.close();
        if (resp.data.success) {
          vm.childList = resp.data.data;
        }
      });
    },
    // 修改子女信息
    editChildren(item) {
      this.$router.push({
        path: "/childrenEdit",
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
    // 添加子女
    addChild() {
      this.$router.push({
        path: "/childrenEdit",
        query: {
          type: "add",
          userID: this.$route.query.userID
        }
      });
    },
    // 子女打卡
    childPunch(idCard) {
      this.$router.push({
        path: "/enterprisePunch",
        query: {
          idCard: idCard
        }
      });
    },
    closeAdvertising() {
      this.show = false;
    },
    goToUrl() {
      window.location.href =
        "https://e554723823435.fengchuanba.com/index.html?from=singlemessage&isappinstalled=0#554723823435-7moudWwxlpTWbGeXPasI7jZilVUfqTMG_1040165432_2";
    }
  },
  components: {
    Scroll
  }
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
      background: url("../../assets/image/children-title.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .wrapper {
    height: 248px;
    overflow: hidden;
    .child-list {
      margin: 0;
      padding: 0 0 10px 0;
      list-style: none;
      .child {
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
          .child-name {
            width: 70px;
            .child-logo {
              width: 40px;
              height: 40px;
              margin: 15px auto;
            }
            .boy {
              background: url("../../assets/image/boy-logo.png") no-repeat;
              background-size: 100% 100%;
            }
            .girl {
              background: url("../../assets/image/girl-logo.png") no-repeat;
              background-size: 100% 100%;
            }
            .name {
              text-align: center;
              font-size: 14px;
              color: #16d0a0;
              font-weight: bold;
            }
          }
          .child-values {
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
    }
  }
  .add-button {
    width: 335px;
    height: 60px;
    background: url("../../assets/image/add-button.png") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 20px;
  }
  .advertising {
    width: 90%;
    height: 70%;
    background: url("../../assets/image/advertising.jpg") no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
    margin-top: 20%;
  }
  .close {
    width: 100px;
    height: 30px;
    margin: 0 auto;
    margin-top: 15px;
    text-align: center;
    i {
      color: #fff;
    }
  }
  p {
    font-size: 14px;
    color: #fff;
    padding: 5px 20px 0 20px;
  }
}
</style>
