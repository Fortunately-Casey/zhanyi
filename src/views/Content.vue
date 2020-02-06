<template>
    <div class="content">
        <div class="header">
            <div class="tab" @click="choseTab(0)" :class="chosedTab === 0 ?'chosed':''">
                打卡
            </div>
            <div class="tab" @click="choseTab(1)" :class="chosedTab === 1 ?'chosed':''">
                我的
            </div>
            <div class="tab" @click="choseTab(2)" :class="chosedTab === 2 ?'chosed':''">
                管理
            </div>
        </div>
        <m-punch v-if="chosedTab === 0"></m-punch>
        <m-mine v-if="chosedTab === 1"></m-mine>
        <m-administration v-if="chosedTab === 2"></m-administration>
        <m-map></m-map>
    </div>
</template>
<script>
    import MMap from "./map/Map.vue";
    import MPunch from "@/views/components/Punch.vue";
    import MAdministration from "@/views/components/Administration.vue";
    import MMine from "@/views/components/Mine.vue";
    export default {
        data() {
            return {
                chosedTab: 0
            }
        },
        methods: {
            choseTab(index) {
                this.chosedTab = index;
            }
        },
        components: {
            MMap,
            MPunch,
            MMine,
            MAdministration
        }
    }
</script>
<style lang="less">
    .content {
        width: 100%;
        height: 100%;

        .header {
            width: 100%;
            height: 40px;
            background-color: #D22C2C;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 999;

            .tab {
                width: 33.33%;
                height: 40px;
                text-align: center;
                line-height: 40px;
                float: left;
                color: #fff;
                font-size: 13px;
            }

            .chosed {
                color: #FD9550;
            }
        }
    }
</style>