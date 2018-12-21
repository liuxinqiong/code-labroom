<template>
    <div class="mask" v-show="showMask"></div>
    <div class="password-keyboard">
        <number-keyboard v-ref:keyboard :value.sync="pwd" :maxlength="6" @input="change">
            <div class="pwd-container">
                <p>请输入支付密码，以确认身份<i class="iconfont close" @click="hide">&#xe607;</i></p>
                <div class="list">
                    <div v-for="i in 6" class="item">{{pwd[i] ? '●' : ''}}</div>
                </div>
            </div>
        </number-keyboard>
    </div>
</template>
<script>
    import NumberKeyboard from './number-keyboard.vue'
    export default {
        components: {
            NumberKeyboard
        },
        data() {
            return {
                pwd: '',
                showMask: false
            }
        },
        methods: {
            change() {
                if(this.pwd.length === 6) {
                    this.$emit('over', this.pwd)
                }
            },
            reset() {
                this.pwd = ''
            },
            show() {
                this.showMask = true
                this.$refs.keyboard.show()
            },
            hide() {
                this.showMask = false
                this.$refs.keyboard.hide()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .mask {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, .3);
    }
    .pwd-container {
        background-color: #fff;
        padding-bottom: 60px;
        border-bottom: 1px solid #D8D8D8;/*no*/
        p {
            margin: 0;
            padding: 44px 0;
            color: #1F1F1F;
            text-align: center;
            font-size: 30px;
            position: relative;
        }
        .close {
            position: absolute;
            right: 24px;
            top: 24px;
        }
        .list {
            display: flex;
            border: 1px solid #000;
            width: 600px;
            margin: auto;
            >.item {
                flex: 1;
                line-height: 100px;
                height: 100px;
                font-size: 32px;
                text-align: center;
            }

            .item+.item {
                border-left: 1px solid #000;
            }
        }
    }
</style>