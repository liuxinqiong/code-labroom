/**
 * 该组件问题，高耦合
   1. 使用是必须派发 loadPage 事件
   2. 限定滚动组件
   3. 底部文本不够智能
   4. 接口数据格式强要求
 */
<template>
    <slot></slot>
    <div class="no-more" v-if="model.length && noMore">
        已到页面最底端啦
    </div>
    <div class="loading" v-if="loading">
        加载中...
    </div>
</template>
<script>
    export default{
        props: {
            startNum: {
                type: Number,
                default: () => 0,
            },
            onData: null, // 获取数据
            model: {
                type: Array,
                twoWay: true,
            },
            pageSize: {
                type: Number,
                default: () => 10,
            },
            name: {
                type: String,
            }
        },
        data(){
            return {
                loading: false,
                noMore: false, //有下一页
            }
        },
        methods: {
            getData(startNum){
                this.loading = true
                var promise = this.onData({
                    startNum: startNum,
                    pageSize: this.pageSize
                })
                if (promise === undefined) return
                if (promise.then instanceof Function) {
                    promise.success(({ data }) => {
                        this.loading = false
                        if (!data) return
                        data.list = data.list || []
                        this.model = this.model.concat(data.list)
                        if (data.list.length < this.pageSize) { // 最后一页
                            this.noMore = true
                        }
                        this.startNum = data.startNum
                    })
                } else {
                    this.$router.go(promise)
                }
            },
            next(){
                this.getData(this.startNum)
            },
        },
        ready(){
            this.$on("loadPage", obj => {
                // 多个时
                if (obj && obj.name && obj.name !== this.name) {
                    return
                }
                this.model = []
                this.startNum = 0
                this.noMore = false
                if (obj && obj.hasOwnProperty('startNum')) {
                    this.startNum = obj.startNum
                }
                this.getData(this.startNum)
            })
            const elScroll = document.querySelector("#wrapper>.scroll") || document.querySelector("#wrapper") || document.body;
            //判断window或div.overflow滚动条
            let el = elScroll;
            if (elScroll == document.body) el = window;
            el.addEventListener('scroll', () => {
                if (window.innerHeight + elScroll.scrollTop + 50 >= elScroll.scrollHeight) {
                    if (!this.loading) { // 加载完了，才请求下一页
                        if (this.noMore) {  //  没有下一页
                            return
                        }
                        this.getData(this.startNum)
                    }
                }
            })
        },
    }
</script>

<style scoped>
    .no-more, .loading {
        padding: 40px;
        text-align: center;
    }
</style>
