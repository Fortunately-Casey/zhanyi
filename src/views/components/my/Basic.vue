<template>
    <div>
        <div class="head">基本信息
            <i @click="back"></i>
            <div class="edit" @click="edit">修改</div>
        </div>
        <div>
            <div class="line">
                <div class="mes_left">姓名</div>
                <template v-if="!isEdit">
                    <div class="mes_right">{{name}}</div>
                </template>
                <template v-else>
                    <input type="text" class="name" placeholder="姓名" v-model="name"/>
                </template>
            </div>
            <div class="line">
                <div class="mes_left">身份证号</div>
                <div class="mes_right">{{id}}</div>
            </div>
            <div class="line">
                <div class="mes_left">联系方式</div>
                <template v-if="!isEdit">
                    <div class="mes_right">{{phone}}</div>
                </template>
                <template v-else>
                    <input type="text" class="name" placeholder="联系方式" v-model="phone"/>
                </template>
            </div>
            <div class="line">
                <div class="mes_left">现居住地</div>
                <template v-if="!isEdit">
                    <div class="mes_right">{{address}}</div>
                </template>
                <template v-else>
                    <textarea v-model="address"></textarea>
                </template>
            </div>
        </div>
        <template v-if="!isEdit">
            <div class="back" @click="back">返&nbsp;&nbsp;回</div>
        </template>
        <template v-else>
            <div class="back" @click="save">保&nbsp;&nbsp存</div>
        </template>
    </div>

</template>
<script>
    import Mine from "../Mine.vue";
    import {Toast} from "mint-ui";
    import {getUserInfo} from "@/api/register.js";
    import {updateUserInfo} from "@/api/register.js";
    import axios from "axios";

    export default {
        data() {
            return {
                isEdit: false,
                name: '',
                id: '',
                phone: '',
                address: '',
            };
        },
        computed: {},
        mounted() {
            var vm = this;
            var params = {idCard:"320"};
            getUserInfo(params).then((resp) => {
                if (resp.data.success) {
                    console.log(resp.data.data)
                    var Data = resp.data.data;
                    vm.name = Data.name;
                    vm.id = Data.idCard;
                    vm.phone = Data.mobile;
                    vm.address = Data.address;
                } else {
                    Toast({
                        message: resp.data.data,
                        iconClass: "icon icon-success"
                    })
                }
            })

        },
        components: {
            Mine,
        },
        methods: {

            back() {
                this.$router.go(-1);
            },
            edit() {
                var vm = this;
                vm.isEdit = true;
            },
            save() {
                var vm = this;
                var params = {
                    idCard: vm.id,
                    name: vm.name,
                    mobile: vm.phone,
                    address: vm.address
                }
                if (!(/^1[3456789]\d{9}$/.test(params.mobile))) {
                    alert("手机号码有误，请重填");
                    return false;
                }
                var vm = this;
                updateUserInfo(params).then((resp) => {
                    if (resp.data.success) {
                        var Data = resp.data.data;
                        console.log(Data)
                        Toast({
                            message: "修改成功！",
                            iconClass: "icon icon-success"
                        })
                    } else {
                        Toast({
                            message: resp.data.data,
                            iconClass: "icon icon-success"
                        })
                    }
                })
                vm.isEdit = false;
            }
        }
    };
</script>
<style lang="less">
    input {
        border: none;
        padding-left: 5px;
        border-radius: 0;
        width: 70%;
        font-size: 14px;
        text-align: right;
        margin-right: 20px;
        color: #555;
    }

    textarea {
        border: none;
        padding-left: 5px;
        border-radius: 0;
        width: 70%;
        line-height: 20px;
        font-size: 14px;
        text-align: right;
        margin-right: 20px;
        color: #555;
    }

    .head {
        width: 100%;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        color: #FD9550;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
        position: relative;
        i {
            position: absolute;
            width: 50px;
            height: 40px;
            left: 0;
            background: url("../../../assets/image/left.png") 20px no-repeat;
        }
        .edit {
            width: 65px;
            position: absolute;
            right: 0;
            top: 0;
            color: #D22C2C;
        }
    }

    .line {
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #ddd;
        color: #555;
        font-size: 14px;
        padding-top: 10px;
        padding-bottom: 10px;
        line-height: 20px;
        .mes_left {
            width: 30%;
            padding-left: 20px;
        }
        .mes_right {
            width: 70%;
            text-align: right;
            padding-right: 20px;
        }
    }

    .back {
        width: 80%;
        height: 45px;
        text-align: center;
        line-height: 45px;
        color: #fff;
        background-image: linear-gradient(to right, #e75a4f, #e7867a);;
        border-radius: 22.5px;
        position: absolute;
        bottom: 15px;
        margin-left: 10%;
    }

</style>