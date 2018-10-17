<template>
    <div class="tab-list">
        <ul v-el:items>
            <li v-for="(index, item) in tabs">
                <a :class="{active: curIndex === index}" @click="changeIndex($event, index)">{{item}}</a>
            </li>
        </ul>
        <div class="tip-bar" v-el:tipbar v-show="tabs.length"></div>
    </div>
</template>
<script>
    export default {
        props: ['tabs'],
        data() {
            return {
                curIndex: 0
            }
        },
        ready() {
            this.$nextTick(() => {
                if(this.$els.items) {
                    var init = this.$els.items.getElementsByTagName('a')[this.curIndex]
                    this.$els.tipbar.style.width = init.clientWidth + 'px'
                    this.$els.tipbar.style.left = init.offsetLeft + 'px'
                }
            })
        },
        methods: {
            changeIndex(e, index) {
                const left = e.target.offsetLeft;
                this._move(left, index)
            },
            slideTo(index) {
                var target = this.$els.items.getElementsByTagName('a')[index]
                this._move(target.offsetLeft, index)
            },
            _move(left, index) {
                this.$els.tipbar.style.left = left + 'px'
                this.curIndex = index
                this.$emit('tabclick',index)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .tab-list {
        height: 88px;
        background-color: #fff;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        position: relative;
        ul {
            display: flex;
            list-style-type: none;
            margin: 0;
            padding: 0;
            height: 100%;
        }

        li {
            text-align: center;
            flex: 1;
            height: 100%;
            a {
                color: #999;
                font-size: 28px;
                font-weight: 400;
                padding: 0 10px;
                display: inline-block;
                line-height: 88px;
                transition: color .5s;
                &.active {
                    color: #E72410;
                }
            }
        }

        .tip-bar {
            height: 4px;
            width: 100px;
            background-color: #E72410;
            position: absolute;
            bottom: 0;
            transition: left .5s;
        }
    }
</style>