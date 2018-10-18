<template>
    <div class="message-box">
        <div class="item" v-for="item in messages">{{item.message}}</div>
    </div>
</template>
<script>
export default {
    props: ['messages']
}
</script>
<style scoped>
.message-box {
    position: absolute;
    top: 82px;
    left: 49px;
    right: 49px;
    z-index: 2;
}

.message-box .item {
    height: 71px;
    background: url('') no-repeat;
    background-size: 100%;
    font-size:37px;
    margin-bottom: 10px;
    color: #fff;
    line-height: 71px;
    padding: 0 49px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap
}
</style>
