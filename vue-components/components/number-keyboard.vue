<template>
    <div class="number-keyboard" :class="{show: flag}">
        <slot></slot>
        <div class="board">
            <a class="item" v-for="i in 9" href="javascript: void(0)" @click="handle">{{i+1}}</a>
            <a class="item gray"></a>
            <a class="item" href="javascript: void(0)" @click="handle">0</a>
            <a class="item gray" href="javascript: void(0)"><i class="iconfont" @click="delete">&#xe631;</i></a>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            maxlength: {
                type: Number,
                default: () => 0
            },
            value: {
                type: String,
                default: () => ''
            }
        },
        data() {
            return {
                flag: false
            }
        },
        methods: {
            handle(e) {
                if (this.value.length >= this.maxlength) {
                    return
                }
                var text = e.currentTarget.innerText
                this.value += text
                this.$emit('input')
            },
            delete() {
                if (this.value.length === 0) {
                    return
                }
                var sValue = this.value.toString()
                this.value = sValue.substring(0, sValue.length - 1)
                this.$emit('input')
            },
            show() {
                this.flag = true
            },
            hide() {
                this.flag = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .number-keyboard {
        position: fixed;
        width: 100%;
        bottom: 0;
        background-color: #fff;
        font-size: 48px;
        transform: translate3d(0, 100%, 0);
        transition: transform .5s;

        &.show {
            transform: translate3d(0, 0, 0);
        }

        .gray {
            background-color: #F4F4F4;
        }

        .board {
            display: flex;
            flex-wrap: wrap;
        }

        .item {
            width: 33.33333%;
            line-height: 130px;
            box-sizing: border-box;
            text-align: center;
            border-right: 1px solid #E7E7E7;/*no*/
            border-bottom: 1px solid #E7E7E7;/*no*/
            color: #1F1F1F;
            text-decoration: none;
        }

        .item:nth-child(3n) {
            border-right: 0;
        }
    }
</style>