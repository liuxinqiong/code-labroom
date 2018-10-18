<template>
    <div class="confirm" v-show="isShow">
        <div class="confirm-wrapper">
            <!-- <i class="icon-close" @click="hide"></i> -->
            <div class="bg title">{{title}}</div>
            <div class="content">
                <slot></slot>
            </div>
            <div class="bg btnWrapper" :style="btnWrapperStyle">
                <span class="btnw left" @click="leftHandler" v-if="leftBtnText">{{leftBtnText}}</span>
                <span class="btnw right" @click="rightHandler" v-if="rightBtnText">{{rightBtnText}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['title','leftBtnText','rightBtnText'],
        data() {
            return {
                isShow: false
            }
        },
        computed: {
            btnWrapperStyle() {
                if(!(this.rightBtnText && this.leftBtnText)) {
                    return {
                        textAlign: 'center'
                    }
                }
            }
        },
        methods: {
            show() {
                this.isShow = true
            },
            hide() {
                this.isShow = false
            },
            leftHandler() {
                this.hide()
                this.$emit('lefthandler')
            },
            rightHandler() {
                this.hide()
                this.$emit('righthandler')
            }
        }
    }
</script>
<style scoped>
    .confirm {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 2;
        background: url('') no-repeat;
        background-size: 100%;
    }

    .confirm-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 612px;
        transform: translate(-50%, -50%);
    }

    .confirm-wrapper .icon-close {
        position: absolute;
        margin-top: -20px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: url('') no-repeat;
        background-size: 100%;
    }

    .confirm-wrapper .bg {
        background: url('') no-repeat;
        background-size: 100%;
        overflow: hidden;
    }

    .confirm-wrapper .title {
        height: 197px;
        font-size: 42px;
        text-align: center;
        color: #fff;
        box-sizing: border-box;
        padding: 108px 64px 48px;
        margin-bottom: -1px;/*no*/
    }

    .confirm-wrapper .content {
        box-sizing: border-box;
        padding: 0 64px;
        background: url('') repeat-y;
        background-size: 100%;
        max-height: 440px;
        overflow: auto;
    }

    /* .confirm-wrapper 不能省略，加重权值 */
    .confirm-wrapper .btnWrapper {
        height: 195px;
        box-sizing: border-box;
        padding: 41px 64px 0;
        background-position: bottom;
        margin-top: -1px; /*no*/
    }

    .btnWrapper .btnw {
        display: inline-block;
        width: 207px;
        line-height: 60px;
        border-radius: 8px;
        color: #fff;
        font-size: 26px;
        text-align: center;
    }

    .btnWrapper .left {
        background-color: #9A4BC3;
        box-shadow:0 4px 0 #6A298B;
    }

    .btnWrapper .right {
        float: right;
        background-color: #BC0159;
        box-shadow:0 4px 0 #8C0243;
    }
</style>