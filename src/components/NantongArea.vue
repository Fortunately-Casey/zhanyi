<template>
  <div class="modal" v-if="isShow">
    <div class="city-list">
      <div class="city-top">
        选择地区
        <div class="icon-close" @click="closeNantongList"></div>
      </div>
      <div class="select-province" v-show="isShowNTArea">
        <div class="select-title">选择区 / 县</div>
        <scroll class="wrapper1">
          <ul>
            <li v-for="(item, index) in nantongList" :key="index" v-if="index !== 0">
              <div class="province" @click="choseNanTong(item)">
                <div class="label" style="width:0"></div>
                <div class="name">{{ item.name }}</div>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="selected" v-show="isShowNTStreet">
        <span class="selected-area" @click="selectNTArea">{{ selectNantongValue.chosedNantongArea }}</span>
        <span class="selectCityButton">选择镇</span>
      </div>
      <div class="select-street" v-if="isShowNTStreet">
        <scroll class="wrapper2">
          <ul>
            <li v-for="(item, index) in nantongStreet" :key="index">
              <div class="city" @click="choseXian(item)">
                <div class="label" style="width:0"></div>
                <div class="name">{{ item.name }}</div>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="selected" v-show="isShowNTCommunity">
        <span class="selected-area" @click="selectNTArea">{{ selectNantongValue.chosedNantongArea }}</span>
        <span class="selected-street" @click="selectNTStreet">{{ selectNantongValue.chosedXian }}</span>
        <span class="selectCityButton">选择社区</span>
      </div>
      <div class="select-area" v-if="isShowNTCommunity">
        <scroll class="wrapper3">
          <ul>
            <li v-for="(item, index) in communityList" :key="index">
              <div class="city" @click="choseCommunity(item)">
                <div class="label" style="width:0"></div>
                <div class="name">{{ item.name }}</div>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
    </div>
  </div>
</template>
<script>
import { Indicator } from "mint-ui";
import { getCityList } from "@/api/aliApi";
import Scroll from "@/components/Scroll";
export default {
  props: ["isShow"],
  data() {
    return {
      isShowNTArea: true,
      isShowNTStreet: false,
      isShowNTCommunity: false,
      nantongList: [],
      selectNantongValue: {
        chosedNantongArea: "",
        chosedXian: "",
        chosedCommunity: ""
      },
      nantongStreet: [],
      communityList: []
    };
  },
  created() {
    var vm = this;
    //获取南通区县
    getCityList({
      parent_id: 176920
    }).then(resp => {
      vm.nantongList = resp.data.data;
    });
  },
  methods: {
    closeNantongList() {
      this.$emit("closeNantong", {
        isShow: false
      });
    },
    // 选择南通区县
    choseNanTong(item) {
      var vm = this;
      Indicator.open();
      getCityList({
        parent_id: item.id
      }).then(resp => {
        Indicator.close();
        vm.nantongStreet = resp.data.data;
        vm.selectNantongValue.chosedNantongArea = item.name;
        vm.isShowNTArea = false;
        vm.isShowNTStreet = true;
        vm.isShowNTCommunity = false;
      });
    },
    selectNTArea() {
      this.isShowNTArea = true;
      this.isShowNTStreet = false;
      this.isShowNTCommunity = false;
      this.selectNantongValue.chosedNantongArea = "";
      this.selectNantongValue.chosedXian = "";
      this.selectNantongValue.chosedCommunity = "";
    },
    selectNTStreet() {
      this.isShowNTArea = false;
      this.isShowNTStreet = true;
      this.isShowNTCommunity = false;
      this.selectNantongValue.chosedXian = "";
      this.selectNantongValue.chosedCommunity = "";
    },
    choseXian(item) {
      let vm = this;
      vm.isShowNTArea = false;
      vm.isShowNTStreet = false;
      Indicator.open();
      getCityList({
        parent_id: item.id
      }).then(resp => {
        Indicator.close();
        if (resp.data.data.length > 0) {
          vm.isShowNTCommunity = true;
          vm.communityList = resp.data.data;
          vm.selectNantongValue.chosedXian = item.name;
        } else {
          vm.selectNantongValue.chosedXian = item.name;
          vm.selectNantongValue.chosedCommunity = item.name + "社区";
          this.$emit("choseNantong", {
            isShow: false,
            chosedValue: {
              area: this.selectNantongValue.chosedNantongArea,
              xian: this.selectNantongValue.chosedXian,
              community: this.selectNantongValue.chosedCommunity
            }
          });
          this.selectNTArea();
        }
      });
    },
    choseCommunity(item) {
      this.selectNantongValue.chosedCommunity = item.name;
      this.$emit("choseNantong", {
        isShow: false,
        chosedValue: {
          area: this.selectNantongValue.chosedNantongArea,
          xian: this.selectNantongValue.chosedXian,
          community: this.selectNantongValue.chosedCommunity
        }
      });
      this.selectNTArea();
    }
  },
  components: {
    Scroll
  }
};
</script>
<style lang="less" scoped>
.modal {
  width: 100%;
  height: 100%;
  background-color: rgba(59, 58, 58, 0.623);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .city-list {
    width: 100%;
    height: 70%;
    position: absolute;
    left: 0;
    bottom: 0;
    background-color: #fff;
    border-radius: 8px 8px 0 0;
    .city-top {
      height: 45px;
      width: 100%;
      text-align: center;
      font-size: 15px;
      line-height: 45px;
      position: absolute;
      background-color: #fff;
      left: 0;
      top: 0;
      .icon-close {
        width: 20px;
        height: 20px;
        background: url("../assets/image/icon-close.png") no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .select-province,
    .select-street,
    .select-area {
      height: 100vh;
      box-sizing: border-box;
      .wrapper1 {
        height: 400px;
        overflow: hidden;
      }
      .wrapper2 {
        height: 400px;
        overflow: hidden;
      }
      .wrapper3 {
        height: 400px;
        overflow: hidden;
      }
      .wrapper1,
      .wrapper2,
      .wrapper3 {
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
          li {
            .province,
            .city,
            .area {
              height: 30px;
              line-height: 30px;
              display: flex;
              .label {
                width: 20px;
                text-align: center;
                margin-left: 15px;
                font-size: 14px;
                color: rgb(199, 197, 197);
              }
              .name {
                font-size: 14px;
                padding-left: 15px;
              }
            }
          }
          li:last-child {
            padding-bottom: 20px;
          }
        }
      }
      .select-title {
        height: 25px;
        line-height: 25px;
        font-size: 12px;
        padding-left: 20px;
        color: rgb(199, 197, 197);
      }
    }
    .select-province {
      padding-top: 45px;
    }
    .select-street,
    .select-area {
      padding-top: 75px;
    }
    .selected {
      height: 30px;
      width: 100%;
      line-height: 35px;
      position: absolute;
      background-color: #fff;
      left: 0;
      top: 45px;
      .selected-area,
      .selected-street,
      .selectCityButton,
      .selectedCityButton {
        display: inline-block;
        height: 20px;
        line-height: 20px;
        text-align: center;
        border-radius: 12.5px;
        background-color: #eee;
        font-size: 12px;
        padding: 1px 10px;
        margin-left: 20px;
        letter-spacing: 1px;
      }
      .selectCityButton {
        color: #2e55d6;
      }
    }
  }
}
</style>
