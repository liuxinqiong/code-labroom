/**
 * 实用性待考验，仅供参考
 * TODO     
 */


<template>
    <div style="overflow: hidden;">
        <div v-el:scroll_up @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" class="scroll_up">
            <div v-el:down class="pull_reload"></div>

            <slot></slot>

            <div @click="clickLoad" v-el:up class="pull_more"></div>
        </div>
    </div>
</template>

<script type="es6">
    var start,
            end,
            isLock = false,//是否锁定整个操作
            isCanDo = false,//是否移动滑块
            isUpPull = false,//是否是上拉操作
            enableUpPull = true,
            tipMess = {
                down: "下拉刷新",
                downing: '<i class="am-icon-spinner am-icon-pulse"></i> 正在刷新...',
                up: "点击加载更多",
                uping: '<i class="am-icon-spinner am-icon-pulse"></i> 加载中...',
                noMore: "没有更多数据"
            },
            offset = 50,
            startDiff = 10, //启动偏差;
            body = document.body;

    export default{
        props: [],
        data(){
            return {
                noMore: false,
            }
        },
        methods: {
            onPullDown(){
                this.$dispatch('on-pull-down',()=>{
                    this.back();
                });
            },
            onPullUp(){
                this.$dispatch('on-pull-up',()=>{
                    this.back();
                });
            },
            clickLoad(){
                if (isLock) return;
                isLock = true;
                this.onPullUp();
            },
            translate (diff) {
                this.$els.scroll_up.style["-webkit-transform"] = "translate3d(0," + diff + "px,0)";
                this.$els.scroll_up.style["transform"] = "translate3d(0," + diff + "px,0)";
            },
            //设置效果时间 秒
            setTranslition (time) {
                this.$els.scroll_up.style["-webkit-transition"] = "all " + time + "s";
                this.$els.scroll_up.style["transition"] = "all " + time + "s";
            },
            //返回到初始位置
            back () {
                this.setTranslition(0.2);
                this.translate(0 - offset);
                //标识操作完成
                isLock = false;
                start = undefined;
                end = undefined;
                this.$els.down.innerHTML = tipMess.down;
                this.$els.up.innerHTML = (this.noMore ? tipMess.noMore : tipMess.up);
            },
            touchstart(event){
                var record = function (b /*isUpPull*/) {
                    //标识操作进行中
                    isLock = true;
                    isCanDo = true;
                    //保存当前鼠标Y坐标
                    start = event.touches[0].pageY;
                    //消除滑块动画时间
                    this.setTranslition(0);

                    isUpPull = b;
                }.bind(this);
                var scrollTop = document.body.scrollTop;
                var contentHeight = this.$el.offsetHeight;
                if (scrollTop <= startDiff && !isLock) {
                    //下拉
                    record(false);
                } else if (enableUpPull && scrollTop >= contentHeight - window.innerHeight - startDiff && !isLock) {
                    //上拉
                    //record(true);
                }
            },
            touchmove(event){
                var scrollTop = document.body.scrollTop;
                var contentHeight = this.$el.offsetHeight;
                if ((!isUpPull && isCanDo && scrollTop <= 0) || (isUpPull && isCanDo && scrollTop >= contentHeight - document.body.offsetHeight - startDiff) //上拉
                ) {
                    //保存当前鼠标Y坐标
                    end = event.touches[0].pageY;
                    if ((!isUpPull && start < end) || (isUpPull && start > end) //上拉
                    ) {
                        event.preventDefault();
                        //消除滑块动画时间
                        this.setTranslition(0);
                        //移动滑块
                        this.translate(end - start - offset);
                    }
                }
            },
            touchend(event){
                if (!isCanDo) return;

                isCanDo = false;
                //判断滑动距离是否大于等于指定值
                var b = (!isUpPull && end - start >= offset) || (isUpPull && start - end >= offset);
                if (!b) {
                    this.back();
                    return;
                }

                //设置滑块回弹时间
                this.setTranslition(1);

                if (isUpPull) {
                    this.translate(-offset);
                    this.$els.up.innerHTML = tipMess.uping;
                } else {
                    this.translate(0);
                    this.$els.down.innerHTML = tipMess.downing;
                }


                if(isUpPull){
                    this.onPullUp();
                }else{
                    this.onPullDown();
                }
            },
        },
        ready(){
            this.back();
        }
    }

</script>

<style>
    .pull_reload {
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 100%;
    }

    .pull_more {
        height: 50px;
        line-height: 50px;
        text-align: center;
        width: 100%;
        position: absolute;
    }
</style>