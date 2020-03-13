<template>
  <div class="children-edit">
    <div class="header">
      <div class="back" @click="goBack">
        <div class="back-icon"></div>首页
      </div>
      <div class="delete">删除</div>添加子女
    </div>
    <div class="content">
      <div class="item">
        <div class="name">姓名</div>
        <div class="edit-value">
          <input type="text" placeholder="输入姓名" />
        </div>
      </div>
      <div class="item">
        <div class="name">性别</div>
        <div class="edit-value">
          <input type="text" placeholder="选择性别" disabled />
        </div>
      </div>
      <div class="item">
        <div class="name userId">身份证号</div>
        <div class="edit-value">
          <input type="number" pattern="[0-9]*" placeholder="输入身份证号" />
        </div>
      </div>
      <div class="item" @click="showSchoolList">
        <div class="name">学校</div>
        <div class="edit-value">
          <input type="text" placeholder="选择学校" disabled />
        </div>
      </div>
      <div class="item">
        <div class="name">班级</div>
        <div class="edit-value">
          <input type="text" placeholder="选择班级" disabled />
        </div>
      </div>
    </div>
    <div class="now-address">
      <div class="address">
        <div class="click-value">
          <div class="name">现居住地</div>
          <div class="icon-cross" @click="openNanTong">></div>
        </div>
      </div>
      <div class="chosedvalue" v-show="chosedValue">
        <div class="item">{{chosedValue.area}}</div>
        <div class="item">{{chosedValue.xian}}</div>
      </div>
      <input type="text" placeholder="详细地址：道路、门牌号、楼栋号、单元号" />
    </div>
    <div class="save-button">保存</div>
    <div class="modal" v-if="isShowSchoolList">
      <div class="list">
        <div class="list-top">
          选择学校
          <div class="icon-close" @click="closeSchoolList"></div>
        </div>
        <scroll class="wrapper">
          <ul>
            <li v-for="(item, index) in 30" :key="index">{{ index + 1 + "学校" }}</li>
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
export default {
  data() {
    return {
      schoolList: ["学校"],
      isShowSchoolList: false,
      isShowNantongList: false,
      chosedValue: ""
    };
  },
  methods: {
    goBack() {
      this.$router.push({
        path: "/childrenInfo"
      });
    },
    showSchoolList() {
      var vm = this;
      vm.isShowSchoolList = true;
    },
    closeSchoolList() {
      this.isShowSchoolList = false;
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
        align-items: flex-end;
        input {
          text-align: right;
          text-align: end;
          padding-right: 15px;
          font-size: 14px;
          transform: translateY(1px);
          margin: 0;
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
  }
}
</style>
