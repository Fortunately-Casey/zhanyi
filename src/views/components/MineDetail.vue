<template>
  <div class="mine-detail">
    <div class="top">
      <div class="arrow-icon" @click="back"></div>
      <div class="title">基本信息</div>
      <div class="edit" v-if="isEdit" @click="isEdit = false">修改</div>
      <div class="save" v-else @click="isEdit = true">保存</div>
    </div>
    <div class="detail-box">
      <div class="item">
        <div class="label">姓名</div>
        <input type="text" v-if="!isEdit" class="value" v-model="editData.name" />
        <div class="value" v-else>{{detailData.name}}</div>
      </div>
      <div class="item">
        <div class="label">身份证号</div>
        <input type="text" v-if="!isEdit" class="value" v-model="editData.userNumber" />
        <div class="value" v-else>{{detailData.userNumber}}</div>
      </div>
      <div class="item">
        <div class="label">联系方式</div>
        <input type="text" v-if="!isEdit" class="value" v-model="editData.phone" />
        <div class="value" v-else>{{detailData.phone}}</div>
      </div>
      <div class="item">
        <div class="label">现居住地</div>
        <input type="text" v-if="!isEdit" class="value" v-model="editData.address" />
        <div class="value" v-else>{{detailData.address}}</div>
      </div>
    </div>
    <div class="back-button" @click="back">返 回</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isEdit: true,
      detailData: {
        name: "冯云飞",
        userNumber: "320623199509244538",
        phone: "18662858322",
        address: "棕榈湾"
      },
      editData: {
        name: "冯云飞",
        userNumber: "320623199509244538",
        phone: "18662858322",
        address: "棕榈湾"
      }
    };
  },
  methods: {
    back() {
        this.$router.push({
            path:"/index/mine/minetab"
        })
    }
  }
};
</script>
<style lang="less" scoped>
.mine-detail {
  height: 100px;
  .top {
    height: 40px;
    border-bottom: 1px solid #e6e6e6;
    position: relative;
    .arrow-icon {
      width: 8px;
      height: 13px;
      background: url("../../assets/image/左.png") no-repeat;
      background-size: 100% 100%;
      position: absolute;
      left: 25px;
      top: 12px;
    }
    .title {
      line-height: 40px;
      margin: 0 auto;
      font-size: 14px;
      width: 200px;
      text-align: center;
      color: #feb682;
    }
    .edit {
      color: #d94243;
      font-size: 14px;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .save {
      color: #4a98f1;
      font-size: 14px;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .detail-box {
    .item {
      height: 40px;
      border-bottom: 1px solid #e6e6e6;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      .label,
      .value {
        margin: 0;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
      }
    }
  }
  .back-button {
    width: 250px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    color: #fff;
    background-color: #e75a4f;
    border-radius: 22.5px;
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>