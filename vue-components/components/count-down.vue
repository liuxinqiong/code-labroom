<template>
    <div class="count-down" v-if="second > 0">
        <div class="wrapper">
            <div class="container">
                {{second}}
            </div>
            <canvas v-el:canvas class="canvas"></canvas>
        </div>
    </div>
</template>
<script>
    export default {
        props: ['second'],
        created() {
            this.timer = null
            this.ctx = null
            this.r = null
            this.deg = 270
        },
        ready() {
            var canvas = this.$els.canvas
            // canvas必须显示指定容器大小
            canvas.width = canvas.height = canvas.parentNode.clientWidth
            this.ctx = canvas.getContext("2d")
            this.r = canvas.clientWidth / 2
            if (this.timer) {
                clearInterval(this.timer)
            }
            this.timer = setInterval(() => {
                this.second--
                if(this.second === 0) {
                    clearInterval(this.timer) 
                    this.timer = null
                    this.$emit('go')
                }
            }, 1000)
            this._render()
        },
        methods: {
            _render() {
                var deg = this.deg -= 120 / 1000 * 16.6
                var ctx = this.ctx
                var r = this.r, w = 2 * r;
                ctx.clearRect(0, 0, w, w);
                ctx.beginPath()
                ctx.moveTo(r, r)
                ctx.arc(r, r, r, -90 * Math.PI / 180, deg * Math.PI / 180, true);
                ctx.closePath();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
                ctx.fill();
                if(deg > -90) {
                    requestAnimationFrame(this._render)
                }
            }
        }
    }
</script>
<style scoped>
    .count-down {
        position: fixed;
        z-index: 3;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
    }

    .count-down .wrapper {
        width: 371px;
        height: 371px;
        border-radius: 50%;
        border: 5px solid #fff;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%, -50%, 0)
    }

    .count-down .container {
        width: 327px;
        height: 327px;
        border-radius: 50%;
        margin: auto;
        margin-top: 17px;
        border: 5px solid #fff;
        box-sizing: border-box;
        font-size: 260px;
        color: #fff;
        text-align: center;
        line-height: 327px;
    }

    .canvas {
        position: absolute;
        top: 0;
    }
</style>