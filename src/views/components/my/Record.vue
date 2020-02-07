<template>
    <div>
        <div class="head">打卡记录
            <i @click="back"></i>
        </div>
        <div>
            <div class="li" v-for="item in List1" @click="Detail">
                <div class="type2">{{item.stime.substring(0,4)+'年'+item.stime.substring(5,7)+'月'+item.stime.substring(8,10)+'日'}}</div>
                <i class="jian"></i>
            </div>
        </div>
        <div>
            <div class="li" v-for="item in List2" @click="Detail">
                <div class="type1">{{item.stime.substring(0,4)+'年'+item.stime.substring(5,7)+'月'+item.stime.substring(8,10)+'日'}}</div>
                <i class="jian"></i>
            </div>
        </div>
        <div class="page">
            <i class="page-left" @click="pageDel"></i>
            <div class="pag">{{page}}页</div>
            <i class="page-right" @click="pageAdd"></i>
        </div>
        <div class="back" @click="back">返&nbsp;&nbsp;回</div>

    </div>

</template>
<script>
    // import Mine from "../components/Mine.vue";
    import {Toast} from "mint-ui";
    import { getPeriodPlaceList } from "@/api/register.js";
    import { getRouteList } from "@/api/register.js";
    import axios from "axios";
    export default {
        data() {
            return {
                List1:[],
                List2:[],
                count1:0,
                count2:0,
                page:1
            };
        },
        computed: {

        },
        mounted() {
            var vm = this;
            vm.Load();

        },
        components: {
            // Mine,
        },
        methods: {
            //返回
            back(){
                this.$router.go(-1);
            },
            Detail(){
                alert(1)
            },
            Load(){
                var vm = this;
                var params = {
                    idCard:"123123213",
                    page:vm.page,
                    pageSize:10
                }
                getPeriodPlaceList(params).then((resp) => {
                    if (resp.data.success) {
                        console.log(resp.data.data)
                        vm.List1 = resp.data.data;
                        vm.count1 = resp.data.page.pageCount;
                        getRouteList(params).then((resp2) => {
                            if (resp2.data.success) {
                                console.log(resp2.data)
                                vm.List2 = resp2.data.data;
                                vm.count2 = resp2.data.page.pageCount;
                            } else {
                                Toast({
                                    message: resp2.data.data,
                                    iconClass: "icon icon-success"
                                })
                            }
                        })
                    } else {
                        Toast({
                            message: resp.data.data,
                            iconClass: "icon icon-success"
                        })
                    }
                })
            },
            pageAdd(){
                var vm = this;
                if (vm.page<vm.count1&&vm.page<vm.count2){
                    vm.page+=1;
                    vm.Load();
                }
            },
            pageDel(){
                var vm = this;
                if (vm.page>1){
                    vm.page-=1;
                    vm.Load();
                }
            }
        }
    };
</script>
<style lang="less">
    .head{
        width: 100%;
        text-align: center;
        height: 40px;
        line-height: 40px;
        font-weight: bold;
        color: #33a5cc;
        font-size: 14px;
        border-bottom: 1px solid #ddd;
        position: relative;
        i{
            position: absolute;
            width: 50px;
            height: 40px;
            left: 0;
            background: url("../../../assets/image/left.png") 20px no-repeat;
        }
    }
    .line{
        display: flex;
        flex-direction: row;
        border-bottom: 1px solid #ddd;
        color: #555;
        font-size: 14px;
        padding-top: 10px;
        padding-bottom: 10px;
        line-height: 20px;
        .mes_left{
            width: 30%;
            padding-left: 20px;
        }
        .mes_right{
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
        bottom:15px;
        margin-left: 10%;
    }
    .li {
        width: 100%;
        border-bottom: 1px solid #ddd;
        display: flex;
        flex-direction: row;
        position: relative;
        .type1 {
            width: calc(100% - 50px);
            height: 40px;
            line-height: 40px;
            background: url("../../../assets/image/record1.png") 20px 13px no-repeat;
            padding-left: 45px;
            color: #555;
            font-size: 14px;
        }
        .type2 {
            width: calc(100% - 50px);
            height: 40px;
            line-height: 40px;
            background: url("../../../assets/image/record2.png") 20px 13px no-repeat;
            padding-left: 45px;
            color: #555;
            font-size: 14px;
        }
        .jian {
            width: 50px;
            background: url("../../../assets/image/right.png") 10px no-repeat;
        }
    }
    .page{
        position: absolute;
        bottom: 80px;
        width: 100%;
        height: 30px;
        line-height: 30px;
        display: flex;
        flex-direction: row;
        .page-left{
            width: 30px;
            margin-left: calc(50% - 50px);
            background: url("../../../assets/image/left.png") 10px no-repeat;
        }
        .page-right{
            width: 30px;
            margin-right: calc(50% - 50px);
            background: url("../../../assets/image/right.png") 10px no-repeat;
        }
        .pag{
            width: 50px;
            text-align: center;
        }
    }
</style>