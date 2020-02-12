<template>
    
</template>

<script>
export default {
    data() {
        return {

        }
    },
    created() {
        window.localStorage.setItem('WXID',JSON.stringify(this.$route.query.WxId));
        this.$router.push({
            path:'/punch'
        })
    }
}
</script>

<style lang="less" scoped>

</style>