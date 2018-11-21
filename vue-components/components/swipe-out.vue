<template>
    <div class="swipe-out" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
        <div class="l" v-el:l>
            我是隐藏在左边的大惊喜
        </div>
        <div class="m" v-el:m>
            这是一个测试
        </div>
        <div class="r" v-el:r>
            我是隐藏在右边的大惊喜
        </div>
    </div>
</template>
<script>
import { prefixStyle } from 'common/dom'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
    data() {
        return {
            flag: 0 // 显示左边滑块（-1）| 正常显示（0）| 显示右边滑块（1）
        }
    },
    ready() {
        this.touch = {}
        this.rWidth = this.$els.r.offsetWidth
        this.lWidth = this.$els.l.offsetWidth
    },
    methods: {
        middleTouchStart(e) {
            this.touch.initiated = true
            const touch = e.touches[0]
            this.touch.startX = touch.pageX
            this.touch.startY = touch.pageY
        },
        middleTouchMove(e) {
            if(!this.touch.initiated) {
                return
            }
            const touch = e.touches[0]
            const deltaX = touch.pageX - this.touch.startX
            const deltaY = touch.pageY - this.touch.startY
            // 垂直方向移动比水平方向还大，取消操作
            if(Math.abs(deltaY) > Math.abs(deltaX)) {
                return
            }
            const direction = this.direction = deltaX < 0 ? 'left' : 'right'
            // 根据显示情况，判断当前位置
            let left = this.flag === 0 ? 0 : this.flag === 1 ? -this.rWidth : this.lWidth
            // 判断当前位置操作哪个滑块，跟当前显示情况和方向有关
            let target = direction === 'left' ? this.flag == -1 ? 'l' : 'r' : this.flag == 1 ? 'r' : 'l'
            // 不能超过隐藏空间实际宽度
            let offsetWidth, targetWidth
            if(target == 'r') {
                offsetWidth = Math.min(0, Math.max(-this.rWidth, left + deltaX))
                targetWidth = this.rWidth
            } else {
                offsetWidth = Math.max(0, Math.min(this.lWidth, left + deltaX))
                targetWidth = this.lWidth
            }
            // 超过多少比例自动显示
            this.touch.percent = Math.abs(offsetWidth / targetWidth)
            this._handleTransform(offsetWidth, target, 0)
        },
        middleTouchEnd(e) {
            let offsetWidth, target;
            // 自动还原与显示
            if(this.flag === 0) {
                target = this.direction === 'left' ? 'r' : 'l'
                if(this.touch.percent > 0.1) {
                    if(this.direction === 'left') {
                        offsetWidth = -this.rWidth
                        this.flag = 1
                    } else {
                        offsetWidth = this.lWidth
                        this.flag = -1
                    }
                } else {
                    offsetWidth = 0
                }
            } else {
                target = this.flag === 1 ? 'r' : 'l'
                if(this.touch.percent < 0.9) {
                    offsetWidth = 0
                    this.flag = 0
                } else {
                    offsetWidth = this.flag === 1 ? -this.rWidth : this.lWidth
                }
            }
            this._handleTransform(offsetWidth, target, 300)
        },
        _handleTransform(offsetWidth, target, time) {
            if(target === 'l') {
                // 因为左滑块本身通过translate3d隐藏，因此移动距离特别处理
                this.$els.l.style[transform] = `translate3d(${offsetWidth - this.lWidth}px,0,0)`
            } else {
                this.$els.r.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            }
            this.$els[target].style[transitionDuration] = `${time}ms`
            this.$els.m.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            this.$els.m.style[transitionDuration] = `${time}ms`
        }
    }
}
</script>
<style lang="scss" scoped>
.swipe-out {
    font-size: 0;
    white-space: nowrap;
    background-color: #fff;
    .l {
        display: inline-block;
        vertical-align: top;
        font-size: 24px;
        line-height: 88px;
        transform: translate3d(-100%, 0, 0);
        position: absolute;
    }
    .m {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        overflow: hidden;
        font-size: 24px;
        line-height: 88px;
    }
    .r {
        display: inline-block;
        vertical-align: top;
        font-size: 24px;
        line-height: 88px;

    }
}
</style>
