<template>
  <div class="miss-punch">
    <div class="header">
      <div class="back" @click="goBack">
        <div class="back-icon"></div>
        首页
      </div>
      新增学生缺课
    </div>
    <scroll class="wrapper">
      <div class="miss-content">
        <div class="info-box">
          <div class="item">
            <div class="name space">名字</div>
            <div class="value">王子易</div>
          </div>
          <div class="item">
            <div class="name">学校名称</div>
            <div class="value">南通市开发区东方小学</div>
          </div>
          <div class="item">
            <div class="name space">年级</div>
            <div class="value">一年级</div>
          </div>
          <div class="item">
            <div class="name space">班级</div>
            <div class="value">三班</div>
          </div>
        </div>
        <div class="miss-type">
          <div class="title">缺课类型</div>
          <div
            class="type-item"
            v-for="(item, index) in missType"
            :key="index"
            @click="choseMissType(index)"
          >
            {{ item.name }}
            <div class="active" v-if="chosedType === index"></div>
          </div>
        </div>
        <div class="physical-condition">
          <div class="title">目前状况或体温</div>
          <input type="text" placeholder="输入状况或体温" />
        </div>
        <div class="physical-condition">
          <div class="title">治疗情况说明</div>
          <input type="text" placeholder="输入治疗情况" />
        </div>
        <div class="select-box">
          <div class="title">是否有流行病接触史</div>
          <div
            class="select-item"
            v-for="(item, index) in selectItems"
            :key="index"
            @click="selectEpidemic(index)"
          >
            {{ item.name }}
            <div class="active" v-if="chosedEpidemic === index"></div>
          </div>
        </div>
        <div class="select-box">
          <div class="title">是否新增</div>
          <div
            class="select-item"
            v-for="(item, index) in selectItems"
            :key="index"
            @click="selectAdd(index)"
          >
            {{ item.name }}
            <div class="active" v-if="chosedAdd === index"></div>
          </div>
        </div>
        <div class="select-box">
          <div class="title">是否复课</div>
          <div
            class="select-item"
            v-for="(item, index) in selectItems"
            :key="index"
            @click="selectReClass(index)"
          >
            {{ item.name }}
            <div class="active" v-if="chosedReClass === index"></div>
          </div>
        </div>
        <div class="reclass-examine">
          <div class="title">复课查验情况</div>
          <input type="text" placeholder="输入治疗情况" />
        </div>
        <div class="reclass-date">
          <div class="name">复课日期</div>
          <div class="date" @click="openDate">
            {{ returnDate(reclassDate) }}
          </div>
        </div>
        <div class="commit-button">提交</div>
      </div>
    </scroll>
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
import Scroll from "@/components/Scroll";
export default {
  data() {
    return {
      pickerValue: new Date(),
      missType: [
        {
          name: "在外地"
        },
        {
          name: "发热"
        },
        {
          name: "其他症状"
        },
        {
          name: "隔离中"
        },
        {
          name: "其他原因"
        }
      ],
      chosedType: "",
      chosedEpidemic: "",
      chosedAdd: "",
      chosedReClass: "",
      selectItems: [
        {
          name: "是"
        },
        {
          name: "否"
        }
      ],
      reclassDate: new Date(),
      handler: function(e) {
        e.preventDefault();
      }
    };
  },
  methods: {
    returnDate(value) {
      return Todate(value);
    },
    goBack() {},
    choseMissType(index) {
      this.chosedType = index;
    },
    selectEpidemic(index) {
      this.chosedEpidemic = index;
    },
    selectAdd(index) {
      this.chosedAdd = index;
    },
    selectReClass(index) {
      this.chosedReClass = index;
    },
    openDate() {
      this.$refs.datepicker.open();
      this.closeTouch();
    },
    confirmDate(value) {
      this.reclassDate = value;
      this.openTouch();
    },
    closeDate() {
      this.openTouch();
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
  components: {
    Scroll
  }
};
</script>

<style lang="less" scoped>
.miss-punch {
  height: 100%;
  display: flex;
  flex-direction: column;
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
  .wrapper {
    // height: 400px;
    flex: 1;
    overflow: hidden;
    .miss-content {
      padding-bottom: 1px;
      .info-box {
        background-color: #fff;
        .item {
          height: 40px;
          border-bottom: 1px solid #efefef;
          display: flex;
          .name {
            width: 105px;
            text-align: center;
            line-height: 40px;
            font-size: 14px;
            font-weight: bold;
            color: #222;
          }
          .space {
            letter-spacing: 25px;
            text-indent: 25px;
          }
          .value {
            flex: 1;
            line-height: 40px;
            text-align: right;
            padding-right: 10px;
          }
        }
      }
      .miss-type {
        margin-top: 10px;
        padding: 0 20px;
        background-color: #fff;
        .title {
          height: 40px;
          border-bottom: 1px solid #efefef;
          line-height: 40px;
          padding-left: 5px;
          font-weight: bold;
          color: #222;
        }
        .type-item {
          height: 40px;
          border-bottom: 1px solid #efefef;
          font-size: 14px;
          line-height: 40px;
          padding-left: 15px;
          position: relative;
          .active {
            width: 16px;
            height: 16px;
            background: url("../../assets/image/green-chosed.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .physical-condition {
        background-color: #fff;
        padding: 0 20px;
        margin-top: 10px;
        .title {
          height: 40px;
          border-bottom: 1px solid #efefef;
          line-height: 40px;
          padding-left: 5px;
          font-weight: bold;
          color: #222;
        }
        input {
          width: 100%;
          font-size: 14px;
          margin: 10px 0;
          height: 40px;
          padding-left: 15px;
        }
      }
      .select-box {
        background-color: #fff;
        padding: 0 20px;
        margin-top: 10px;
        .title {
          height: 40px;
          border-bottom: 1px solid #efefef;
          line-height: 40px;
          padding-left: 5px;
          font-weight: bold;
          color: #222;
        }
        .select-item {
          height: 40px;
          border-bottom: 1px solid #efefef;
          font-size: 14px;
          line-height: 40px;
          padding-left: 15px;
          position: relative;
          .active {
            width: 16px;
            height: 16px;
            background: url("../../assets/image/green-chosed.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }
      .reclass-examine {
        background-color: #fff;
        padding: 0 20px;
        .title {
          height: 40px;
          border-bottom: 1px solid #efefef;
          line-height: 40px;
          padding-left: 5px;
          font-weight: bold;
          color: #222;
        }
        input {
          width: 100%;
          font-size: 14px;
          margin: 10px 0;
          height: 40px;
          padding-left: 15px;
        }
      }
      .reclass-date {
        border-top: 1px solid #efefef;
        height: 40px;
        background-color: #fff;
        display: flex;
        .name {
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #222;
          font-size: 14px;
          font-weight: bold;
          padding-left: 5px;
        }
        .date {
          flex: 1;
          line-height: 40px;
          text-align: right;
          padding-right: 10px;
        }
      }
      .commit-button {
        width: 280px;
        height: 42px;
        background-color: #16d0a0;
        text-align: center;
        line-height: 40px;
        border-radius: 20px;
        margin: 20px auto;
        letter-spacing: 15px;
        text-indent: 15px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
