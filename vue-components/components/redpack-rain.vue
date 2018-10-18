<template>
    <div>
        <div class="redpack-rain-1">
            <div class="item">
                <span class="title"></span>
            </div>
            <div class="item">
                <span class="btn1" @click="showPage">点此下红包雨</span>
            </div>
            <div class="item">
                <span class="btn2" @click="toRule">活动规则</span>
                <span class="btn2" :style="{ marginRight:0 }" @click="myGifts">我的奖品</span>
            </div>
        </div>
        <div class="rain-wrapper" v-show="showRedPage">
            <ul v-el:wrapper>
                <template v-for="(index, item) in redpacks">
                    <li :style="{ left: item.left, animationDuration: item.durTime, webkitAnimationDuration: item.durTime }"
                        @click="lottery(index)">
                        <i :style="{ transform: item.transforms, webkitTransform: item.transforms}"></i>
                    </li>
                </template>
            </ul>
            <div class="wxtips-mark" v-show="showShareTip">
                <div class="wxtips-img" @click="cancleShare"></div>
            </div>
        </div>
        <count-down :second="3" @go="startRedpack" v-if="showRedPage"></count-down>
        <confirm v-ref:confirm :title="confirmTitle" left-btn-text="返回活动页面" right-btn-text="炫耀一下" @lefthandler="back" @righthandler="share">
            <div class="result-item" v-for="r in results">
                {{r.title}}一{{local[r.prizeNo].link ? '份':'张'}}
                <a :href="local[r.prizeNo].link" v-if="local[r.prizeNo].link" class="link">去使用</a>
            </div>
            <div class="result-item" v-if="!results.length" :style="{textAlign: 'center'}">
                运气差了点, 明天再来!
            </div>
        </confirm>
        <confirm v-ref:confirm2 title="我的奖品" left-btn-text="知道了">
            <div class="result-item" v-for="r in records">
                {{r.title}}一{{local[r.prizeNo].link ? '份':'张'}}
                <a :href="local[r.prizeNo].link" v-if="local[r.prizeNo].link" class="link">去使用</a>
            </div>
            <div class="result-item" v-if="!records.length" :style="{textAlign: 'center'}">
                您还没获得奖品哦, 继续加油!
            </div>
        </confirm>
    </div>
</template>
<script>
    import MessageBox from './message-box/message-box1'
    import CountDown from './count-down.vue'
    import Redpack from '../utils/redpack'
    import Confirm from './confirm.vue'
    import local from '../mock/local'

    const CHANNEL = 'redshower'

    export default {
        data() {
            return {
                redpacks: [],
                duration: 10000,
                timer: null,
                count: 0,
                showRedPage: false,
                confirmTitle: '',
                results: [],
                records: [],
                local: local,
                showShareTip: false
            }
        },
        components: {
            CountDown,
            Confirm
        },
        methods: {
            toRule() {
                location.href = ''
            },
            myGifts() {
                this.$http.get('/', {
                    channel: CHANNEL,
                    startNum: 0,
                    pageSize: 100
                }).success(({ code, data }) => {
                    if (code === -1) {
                        // to login page
                    } else {
                        this.records = data.list
                        this.$refs.confirm2.show()
                    }
                })
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            back() {
                this.showRedPage = false
            },
            cancleShare(){
                this.showShareTip = false;
                this.back()
            },
            share() {

            },
            showPage() {
                this.$http.get('', {
                    channel: CHANNEL
                }).success(({ code, data }) => {
                    if (code === -1) {
                        // to login page
                    } else {
                        if(data) {
                            this.showRedPage = true
                        } else {
                            messBox.tips('明日再来')
                        }
                    }
                })
            },
            toast(message) {
                MessageBox.notice({
                    message: message,
                    duration: 1500
                })
            },
            lottery(index) {
                this.count++
                // this.removeDom(e)
                this.redpacks.splice(index, 1)
                this.drawLottery()
            },
            drawLottery() {
                // 频率控制一下
                if(this.count === 1 || this.count % 5 === 0){
                    this.$http.get(``, {}, {
                        hideLoading: true,
                        noTips: true
                    }).then(({ data }) => {
                        if(data.code === -1) {
                            // to login page
                        } else {
                            var data = data.data;
                            // 谢谢参与
                            if(data && data.prizeNo !== 1) {
                                this.toast(`恭喜你！获得${data.title}一份`)
                                this.results.push(data)
                            }
                        }
                    });
                }
            },
            removeDom(e) {
                let target = e.currentTarget;
                target && target.parentNode && target.parentNode.removeChild(target)
            },
            startRedpack() {
                console.log('游戏开始啦')
                this.count = 0;
                this.results = []
                if(this.timer) {
                    clearInterval(this.timer)
                }
                this.timer = setInterval(() => {
                    this.redpacks.push(new Redpack())
                }, 150)
                setTimeout(() => {
                    clearInterval(this.timer)
                    setTimeout(() => {
                        this.redpacks = []
                        this.confirmTitle = `哇! 抢到了${this.count}个红包哦`
                        this.showConfirm()
                    }, 2500)
                }, this.duration)
            }
        }
    }
</script>
<style scoped>
    .redpack-rain {
        box-sizing: border-box;
        padding: 44px 0 49px 0;
        height: 265px;
        background: url('') no-repeat;
        background-size: 100% 100%;
    }

    .redpack-rain-1 {
        box-sizing: border-box;
        padding: 178px 0 49px 0;
        height: 379px;
        background: url('') no-repeat;
        background-size: 100% 100%;
    }

    .result-item {
        font-size: 24px;
        color: #fff;
        line-height: 44px;
    }

    .result-item .link {
        float: right;
        color: #C83F74;
        font-size: 26px;
        text-decoration: underline;
    }

    .item {
        text-align: center;
        font-size: 0;
    }

    .title {
        display: inline-block;
        width: 216px;
        height: 29px;
        background: url('') no-repeat;
        background-size: 100%;
        margin-bottom: 15px;
    }

    .btn1 {
        display: inline-block;
        width: 369px;
        line-height: 59px;
        font-size: 26px; 
        background: #BC0159;
        color: #fff;
        margin-bottom: 12px;
        border-radius: 8px;
        box-shadow:0 4px 0 #730042;
    }

    .btn2 {
        display: inline-block;
        width: 176px;
        line-height: 49px;
        background: #99015A;
        color: #fff;
        font-size: 20px;
        border-radius: 8px;
        margin-right: 15px;
        box-shadow:0 4px 0 #6F0041;
    }

    .rain-wrapper {
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: url('') no-repeat;
        background-size: 100% 100%;
    }

    .rain-wrapper ul {
        display: block;
        position: relative;
        width: 100%;
        height: 100%;
        transform: rotate(45deg)
    }

    .rain-wrapper li {
        list-style-type: none;
        position: absolute;
        -webkit-animation: aim_move 5s linear 1 forwards;
        animation: aim_move 5s linear 1 forwards;
        top: -100px;
    }

    .rain-wrapper i {
        display: block;
        width: 119px;
        height: 125px;
        background: url('') no-repeat;
        background-size: 100% 100%;
    }

    @keyframes aim_move {
        0% {
            -webkit-transform: translateY(0);
            transform: translateY(0);
        }
        100% {
            -webkit-transform: translateY(120vh);
            transform: translateY(120vh);
        }
    }
</style>