<template>
    <div class="temp"></div>
</template>

<script>

export default {
    data() {
        return {

        }
    },
    created() {
        // alert("空白页")
        window.localStorage.setItem('WXID',JSON.stringify(this.$route.query.WxId));
    },
    mounted() {
        this.$router.push({
            path:'/punch'
        })
    }
}
</script>

<style lang="less" scoped>

</style>