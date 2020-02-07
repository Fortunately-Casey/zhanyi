<template>
  <div class="drop-down" ref="dropdown">
    <div class="dropdown-toggle" @click="showDropDown = !showDropDown">
      <span>{{chosedOption.name}}</span>
      <span class="cart"></span>
    </div>
    <!-- <el-collapse-transition> -->
    <ul class="dropdown-menu" v-show="showDropDown">
      <li v-for="(option,index) in dropList" :key="index">
        <a href="javascript:void(0)" @click="updateOption(option,index)">{{ option.name }}</a>
      </li>
    </ul>
    <!-- </el-collapse-transition> -->
  </div>
</template>
<script>
export default {
  props: {
    dropList: {
      type: Array,
      default: []
    },
    chosedOption: {
      type: Object,
      default: {}
    },
    dropDownType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      showDropDown: false
    };
  },
  mounted() {
    document.addEventListener("click", this.hidePandel, false);
  },
  methods: {
    updateOption(option, index) {
      this.$emit("changeChoose", {
        value: option,
        type: this.dropDownType,
        index: index
      });
      this.showDropDown = false;
      // if(this.dropDownType === "city") {
      //   this.$emit("choseCity",option);
      // }else if(this.dropDownType === "area") {
      //   this.$emit("choseArea",option);
      // }else if(this.dropDownType === "street") {
      //   this.$emit("choseStreet",option);
      // }
    },
    hidePandel(e) {
      if (!this.$refs.dropdown) {
        return;
      }
      if (!this.$refs.dropdown.contains(e.target)) {
        //点击除弹出层外的空白区域
        this.showDropDown = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.drop-down {
  float: left;
  position: relative;
  .dropdown-toggle {
    text-align: left;
    cursor: pointer;
    font-family: PingFangSC-Semibold;
    list-style-type: none;
    color: #5a5a5a;
    // width: 60px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    text-transform: none;
    padding-left: 5px;
    font-weight: 300;
    border-radius: 0;
    font-size: 13px;
    span {
      display: inline-block;
      // width: 50px;
      // overflow: hidden;
      // white-space: nowrap;
      // text-overflow: ellipsis;
    }
    .cart {
      width: 0;
      position: relative;
      top: 13px;
      right:-3px;
      height: 0;
      margin-left: 2px;
      vertical-align: middle;
      border-top: 4px dashed;
      border-top: 4px solid gray;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
      float: right;
    }
  }
  .dropdown-menu {
    position: absolute;
    top: 38px;
    left: 0;
    // width: 60px;
    z-index: 1000;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    font-size: 14px;
    background-color: #fff;
    opacity: 0.9;
    border: 1px solid #ccc;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);

    li {
      text-align: left;

      a {
        padding: 10px 5px 10px 5px;
        display: block;
        clear: both;
        font-weight: normal;
        line-height: 1;
        color: #727272;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-decoration: none;
        text-align: left;
        font-size: 13px;
      }

      a:hover {
        color: #fff;
        text-decoration: none;
      }

      overflow: hidden;
      width: 100%;
      position: relative;
      margin: 0;
    }

    li:hover {
      background-color: #4785fe;
    }
  }
}
</style>