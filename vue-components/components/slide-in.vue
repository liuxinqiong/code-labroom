<template>
    <div class="slide-in" :class="{'active': active}" @click="hide" v-el:slide>
        <div :style="{ width: direction == 'right' ? toRem(width) : 0 }"></div>
        <div class="slot" @click.stop>
            <slot></slot>
        </div>
        <div :style="{ width: direction == 'left' ? toRem(width) : 0 }"></div>
    </div>
</template>
<script>
    import {
        prefixStyle
    } from '../utils/dom'
    const transform = prefixStyle('transform')

    export default {
        data() {
            return {
                active: false
            }
        },
        props: {
            width: {
                type: Number,
                default: () => 0
            },
            direction: {
                type: String,
                default: () => 'left'
            }
        },
        compiled() {
            if (this.direction === 'right') {
                this.$els.slide.style[transform] = 'translate3d(100%, 0, 0)'
            }
        },
        methods: {
            toRem(px){
                return window.baseLib.flexible.px2rem(px) + 'rem'
            },
            show() {
                this.active = true
            },
            hide() {
                this.active = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    .slide-in {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        transform: translate3d(-100%, 0, 0);
        transition: all cubic-bezier(0.1, 0.7, 0.1, 1) 400ms;
        z-index: 1;
        .slot {
            flex: 1;
            background-color: #FFFFFF;
        }

        &.active {
            transform: translate3d(0, 0, 0) !important;
        }

    }
</style>