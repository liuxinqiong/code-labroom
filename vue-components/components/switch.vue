<template>
    <div class="switch" :class="{active: opened}" @click="switch">
        <div class="bar"></div>
    </div>
</template>
<script>
export default {
    props: {
        opened: {
            type: Boolean,
            default: () => false
        }
    },
    methods: {
        switch() {
            this.opened = !this.opened
            this.$emit('switch', this.opened)
        }
    }
}
</script>
<style lang="scss" scoped>
.switch {
    font-size: 0;
    width: 104px;
    height: 52px;
    background-color: #fff;
    border: 3px solid #E5E5E5;/*no*/
    border-radius: 26px;
    position: relative;
    transition: .25s;
    &.active {
        background: #C6BC9F;
        border-color: #C6BC9F;
        .bar {
            left: 54px;
        }
    }
    .bar {
        position: absolute;
        width: 47px;
        height: 47px;
        background-color: #fff;
        border-radius: 50%;
        border: 2px solid #E5E5E5;/*no*/
        left: 0;
        transition: .25s;
    }
}
</style>
