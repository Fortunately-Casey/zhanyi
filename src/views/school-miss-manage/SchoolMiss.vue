<template>
  <div class="school-miss-manage">
    <div class="header">
      <div class="back" @click="goBack">
        <div class="back-icon"></div>上一页
      </div>学校缺课情况上报
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
          <div v-for="(item, index) in 10" :key="index">
            <left-slider :index="index" @deleteItem="deleteItem(index)">
              <div class="item">
                <div class="school-name">天星湖中学</div>
                <div class="miss-teacher">2</div>
                <div class="miss-student">1</div>
                <div class="is-appear">是</div>
              </div>
            </left-slider>
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
  </div>
</template>
<script>
import { Todate } from "@/common/tool/tool.js";
import LeftSlider from "@/components/LeftSlider.vue";
export default {
  data() {
    return {
      pickerValue: new Date(),
      date: new Date(),
      handler: function(e) {
        e.preventDefault();
      },
      page: 1
    };
  },
  methods: {
    returnDate(value) {
      return Todate(value);
    },
    goBack() {},
    openDate() {
      this.$refs.datepicker.open();
      this.closeTouch();
    },
    confirmDate(value) {
      this.date = value;
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
    },
    deleteItem(index) {
      console.log(index);
    }
  },
  components: {
    LeftSlider
  }
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
          width: 100px;
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
            flex: 1;
          }
          .miss-teacher {
            width: 100px;
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
}
</style>
