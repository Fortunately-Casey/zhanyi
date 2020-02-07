<template>
    <div>
        <div class="head">健康报告
            <i @click="back"></i>
        </div>
        <template v-if="!isDetail">
            <div>
                <div class="li" v-for="item in List1" @click="Detail">
                    <div class="type">{{item.stime.substring(0,4)+'年'+item.stime.substring(5,7)+'月'+item.stime.substring(8,10)+'日'}}</div>
                    <i class="jian"></i>
                </div>
            </div>
            <div class="page">
                <i class="page-left" @click="pageDel"></i>
                <div class="pag">{{page}}页</div>
                <i class="page-right" @click="pageAdd"></i>
            </div>
        </template>
        <template v-else>
            <div class="line">
                <div class="mes_left">姓名</div>
                <div class="mes_right">{{name}}</div>
            </div>
            <div class="line">
                <div class="mes_left">体温</div>
                <div class="mes_right">{{temperature}}</div>
            </div>
            <div class="line">
                <div class="mes_left">症状</div>
                <div class="mes_right">{{symptom}}</div>
            </div>
            <div class="tips">
                <i></i>
                <div class="content">
                    根据分析，您昨日上午10:32可能与确诊人员同时出现在顶顶顶顶。<br><br>
                    友情提示注意自我隔离，加强防护，关注体温变化必要时请就医
                </div>
            </div>
        </template>
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
                name:'',
                temperature:'',
                symptom:'',
                isDetail:false,
                List:[],
                count:0,
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
            back(){
                this.$router.go(-1);
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
                        vm.List = resp.data.data;
                        vm.count = resp.data.page.pageCount;
                    } else {
                        Toast({
                            message: resp.data.data,
                            iconClass: "icon icon-success"
                        })
                    }
                })
            },
            //健康详情
            Detail(){
                var vm = this;
                vm.isDetail = true;

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
        color: #0dac0b;
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
        .type {
            width: calc(100% - 50px);
            height: 40px;
            line-height: 40px;
            background: url("../../../assets/image/health1.png") 20px 13px no-repeat;
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
    .tips{
        width: calc(100% - 30px);
        margin: 15px;
        background-color: rgba(255,153,82,0.2);
        color: #FF9952;
        font-size: 12px;
        display: flex;
        flex-direction: row;
        border-radius: 3px;
        i{
            width: 30px;
            background: url("../../../assets/image/health2.png") 10px 15px no-repeat;
        }
        .content{
            width: calc(100% - 40px);
            padding: 15px;
        }
    }
</style>