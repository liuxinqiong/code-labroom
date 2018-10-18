<template>
    <div class="wheel-container">
        <div class="content">
            <div class="red-circle">
                <div class="wheel" :style="{transform:rotate_degree}"></div>
                <a href="javascript:void(0)" class="go" @click="start"></a>
            </div>
        </div>
    </div>
</template>
<script>
export default {

    data() {
        return {
            playTimes: 0,
            useTimes: 0,
            start_rotating_degree: 0,
            rotate_degree: 0,
            enable: true,
            showDialog: false,
            selected: {}
        }
    },
    methods: {
        show() {
            this.showDialog = !this.showDialog;
        },
        start() {
            if(!this.enable) {
                return
            }
            this.$http.get(``).then(({ data }) => {
                if( data.code === -1){
                    // go login page
                } else {
                    const {playTimes} = data.data;
                    if(playTimes <= 0) {
                        // '今日次数已用完，明日再来
                        return;
                    }
                    return this.$http.get('');
                }
            }).then(({ data }) => {
                let { desc, prizeNo, title } = data.data;
                if(prizeNo === 6) {
                    prizeNo = 0;
                }
                this.selected = list[prizeNo]
                this.ratate(prizeNo, desc)
            })
        },
        ratate(result_index, desc) {
            const result_degree = [360, 300, 240, 180, 120, 60];
            const circle_count = 8; // 转8圈
            this.enable = false;
            const rotate_angle = this.start_rotating_degree + circle_count * 360 + result_degree[result_index] - this.start_rotating_degree % 360;
            this.start_rotating_degree = rotate_angle;
            this.rotate_degree = "rotate(" + rotate_angle + "deg) translateZ(0)";
            setTimeout( () => {
                this.enable = true;
                this.showDialog = true;
            }, 6500)
        }
    },
    ready() {

    }
}
</script>
<style scoped>

.content {
    height: 636px;
    background: url('') no-repeat;
    background-size: 100%;
    padding: 0 71px;
}

.content .red-circle {
    background: url('') no-repeat;
    background-size: 100%;
    width: 608px;
    height: 608px;
    box-sizing: border-box;
    padding: 37px;
    position: relative;
}

.content .wheel {
    background: url('') no-repeat;
    background-size: 100%;
    width: 534px;
    height: 534px;
    transition: transform 6s ease-in-out;
}

.content .go {
    background: url('') no-repeat;
    background-size: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-left: -60px;
    margin-top: -98px;
    display: inline-block;
    width: 119px;
    height: 158px;
}

.title {
    background: #F9B31F;
    color: #FD3D66;
    font-size: 24px;
    padding: 23px 37px 23px 23px;
}

.title .des {
    display: inline-block;
}

.title .des > p {
    font-size: 24px;
}

.title .view-rule {
    background: #FD3D66;
    color: white;
    float: right;
    padding: 8px 21px;
    border-radius: 25px;
}

.result-dialog {
    width: 279px;
    height: 353px;
    background: url('') no-repeat;
    background-size: 100%;
}

.result-dialog h3 {
    font-size:30px;
    color: #fff;
    text-align: center;
    padding: 33px 0 20px;
}

.result-dialog .get {
    width:150px;
    height:150px;
    background-color: #fff;
    border-radius: 50%;
    margin: 0 auto;
}

.result-dialog .get img {
    width: 100px;
    margin-left: 25px;
    margin-top: 10px;
}

.result-dialog a {
    position: absolute;
    bottom: 23px;
    left: 48px;
    padding: 2px 35px;
    border-radius:17px;
    text-decoration: none;
    color: #EA3E3E;
    background:#fff;
}
</style>
