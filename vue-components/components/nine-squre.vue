<template>
    <!-- :style="bgStyle" 用CSS切换背景图会闪烁-->
    <div class="nine-squre">
        <img class="bg" :src="bgImage" alt="">
        <div class="main-panel" v-if="loaded">
            <img :src="key[1] == index ? item.urling : item.url" alt="" v-for="(key, item) in initData" @click="key==='e8' ? start() : ''">
        </div>
        <div class="loading-tip" v-if="!loaded">
            游戏资源加载中...
        </div>
        <div class="dialog" v-show="showDialog" @click="showDialog = false">
            <div class="container" @click.stop="goDetail">
                <img :src="selected.alert" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import initData, { keys } from '../mock/nine-squre.js'

export default {
    data() {
        return {
            bgList: [],
            bgIndex: 0,
            index: -1,
            loaded: false,
            enable: true,
            showDialog: false,
            selected: initData['e8'], // 默认没机会
            animation: {
                initSpeed: 500, // 起始速度
                deg: 0, // 角度，应用三角函数
                duration: 5000, // 持续时间
                liner: 100
            },
            initData, // 初始数据
        }
    },
    computed: {
        bgStyle() {
            return {
                'background-image': `url(${this.bgList[this.bgIndex]})`,
                'background-size': '100% 100%'
            }
        },
        bgImage() {
            return this.bgList[this.bgIndex]
        },
        speed() {
            // 避免超级快
            if (this.animation.deg > 60 && this.animation.deg < 120) {
                return 100
            }
            // return Math.abs(this.animation.initSpeed * Math.cos(2 * Math.PI / 360 * this.animation.deg))
            return Math.abs(this.animation.initSpeed * Math.cos(this.animation.deg / 180 * Math.PI) * Math.PI * 0.25)
        }
    },
    methods: {
        goDetail() {
            if(this.selected.link) {
                location.href = this.selected.link
            } else {
                this.showDialog = false
            }
        },
        start() {
            // 防止旋转时候被点击
            if (!this.enable) {
                return
            }
            this.enable = false
            this.$http.get(``).then(({ data }) => {
                if (data.code === -1) {
                    // to login page
                } else {
                    const { playTimes } = data.data;
                    if (playTimes <= 0) {
                        this.showDialog = true
                        this.enable = true
                        return;
                    }
                    return this.$http.get('');
                }
            }).then(({ data }) => {
                if(data.code === 1) {
                    let { desc, prizeNo, title } = data.data;
                    this.selected = this.initData[keys[prizeNo]]
                    this._go(prizeNo)
                } else {
                    this.enable = true
                }
            })
        },
        _go(prizeNo) {
            if (this.stopTimer) {
                clearTimeout(this.stopTimer)
                this.stopTimer = null
            }
            if (this.linerTimer) {
                clearTimeout(this.linerTimer)
                this.linerTimer = null
            }
            this.linerTimer = setInterval(() => {
                if (this.animation.deg < 180) {
                    this.animation.deg += 180 / this.animation.duration * this.animation.liner
                }
            }, this.animation.liner)
            this.stopTimer = setTimeout(() => {
                // 游戏结束
                if (this.gameTimer) {
                    clearTimeout(this.gameTimer)
                    this.gameTimer = null
                }
                this.gameTimer = setTimeout(() => {
                    this._changeIndex(prizeNo)
                }, this.speed);
            }, this.animation.duration)
            // 游戏开始
            this._changeIndex()
        },
        _changeIndex(target) {
            if (typeof target === 'number' && target === this.index) {
                clearInterval(this.linerTimer)
                this.enable = true
                this.animation.deg = 0
                if (this.gameTimer) {
                    clearTimeout(this.gameTimer)
                    this.gameTimer = null
                }
                this.showDialog = true
                return
            }
            // 游戏状态切换，开始立即执行一次
            this.index++
            if (this.index == 8) {
                this.index = 0
            }
            this.gameTimer = setTimeout(() => {
                this._changeIndex(target)
            }, this.speed);
        },
        _initTimer() {
            // 背景闪烁
            if (this.bgTimer) {
                clearInterval(this.bgTimer)
                this.bgTimer = null
            }
            this.bgTimer = setInterval(() => {
                this.bgIndex = Number(!this.bgIndex)
            }, 2000)
        },
        // 资源预加载
        _loadResources() {
            let imagePath = [];
            this.bgList.forEach(item => {
                imagePath.push(item);
            })
            Object.keys(this.initData).forEach(item => {
                imagePath.push(this.initData[item].url)
                this.initData[item].urling && imagePath.push(this.initData[item].urling)
                this.initData[item].alert && imagePath.push(this.initData[item].alert)
            })
            let works = [];
            imagePath.forEach(imgPath => {
                works.push(new Promise(resolve => {
                    let img = new Image();
                    img.onload = function () {
                        resolve(img);
                    }
                    img.src = imgPath;
                }))
            })
            return new Promise(resolve => {
                Promise.all(works).then(pics => {
                    resolve();
                })
            })
        }
    },
    ready() {
        this._loadResources().then(() => {
            this.loaded = true
            this._initTimer()
        })
    },
    beforeCompile() {
        console.log('beforeCompile')
        this.bgTimer = null
        this.gameTimer = null
        this.stopTimer = null
        this.linerTimer = null
    }
}
</script>
<style scoped>
.nine-squre {
  width: 100%;
  height: 588px;
  box-sizing: border-box;
  padding: 62px 60px;
  position: relative;
  background-color: #FCBB36;
  z-index: 0;
}
.bg {
  position: absolute;
  width: 100%;
  left: 0;
  top: 0;
  z-index: -1;
}

.main-panel img {
  width: 33.33%;
}

.loading-tip {
  color: #fff;
  text-align: center;
  margin-top: 200px;
}

.dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}
.dialog .container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.dialog img {
  width: 420px;
  max-width: none;
}
</style>