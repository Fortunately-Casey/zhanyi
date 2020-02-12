<template>
    <div class="punch">
        <h1>打卡页</h1>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
        
    },
    mounted() {
       var wxid = window.localStorage.getItem("WXID");
       alert("微信ID：" + wxid);
    }
}
</script>

<style lang="less" scoped>
    .punch {
        
    }
</style>