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
            <li
              v-for="(item, index) in nantongList"
              :key="index"
              v-if="index !== 0"
            >
              <div class="province" @click="choseNanTong(item)">
                <div class="label" style="width:0"></div>
                <div class="name">{{ item.name }}</div>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="selected" v-show="!isShowNTArea">
        <span class="seleted-province" @click="selectNTArea">
          {{ selectNantongValue.chosedNantongArea }}
        </span>
        <span class="selectCityButton">选择镇</span>
      </div>
      <div class="select-city" v-if="!isShowNTArea">
        <scroll class="wrapper2">
          <ul>
            <li v-for="(item, index) in nantongXian" :key="index">
              <div class="city" @click="choseXian(item)">
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
      nantongList: [],
      selectNantongValue: {
        chosedNantongArea: "",
        chosedXian: ""
      },
      nantongXian: []
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
        vm.nantongXian = resp.data.data;
        this.selectNantongValue.chosedNantongArea = item.name;
        this.isShowNTArea = false;
      });
    },
    selectNTArea() {
      this.isShowNTArea = true;
      this.selectNantongValue.chosedNantongArea = "";
    },
    choseXian(item) {
      this.selectNantongValue.chosedXian = item.name;
      this.isShowNantongIcon = false;
      this.chosedNantongValue = {
        chosedNantongArea: this.selectNantongValue.chosedNantongArea,
        chosedXian: this.selectNantongValue.chosedXian
      };
      this.$emit("choseNantong", {
        isShow: false,
        chosedValue: {
          area: this.selectNantongValue.chosedNantongArea,
          xian: this.selectNantongValue.chosedXian
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
    .select-city,
    .select-area {
      height: 400px;
      box-sizing: border-box;
      .wrapper1 {
        height: 400px;
        overflow: hidden;
      }
      .wrapper2 {
        height: 400px;
        overflow: hidden;
      }
      .wrapper1,
      .wrapper2 {
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
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
    .select-city,
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
      .seleted-province,
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
