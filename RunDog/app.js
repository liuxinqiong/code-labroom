function throttle(func, wait) {
    var timeout;

    return function () {
        context = this;
        args = arguments;
        if (!timeout) {
            timeout = setTimeout(function () {
                timeout = null;
                func.apply(context, args)
            }, wait)
        }
    }
}

class DogAnimation {
    constructor(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = 200;

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // 记录上一帧的时间
        this.lastWalkingTime = Date.now();

        // 记录当前画的图片索引
        this.keyFrameIndex = -1;

        this.dog = {
            // 一步10px
            stepDistance: 10,
            // 狗的速度
            speed: 0.15,
            // 鼠标的x坐标
            mouseX: -1,
            // 往前走停留的位置
            frontStopX: -1,
            // 往回走停留的位置,
            backStopX: window.innerWidth,
        }

        this.dogPics = [];
        this.RES_PATH = './dog';
        this.IMAGE_COUNT = 9;
        this.start();
    }

    async start() {
        await this.loadResources();
        this.pictureWidth = this.dogPics[0].naturalWidth / 2;
        this.recordMousePosition();
        // window.requestAnimationFrame，这个函数在浏览器画它自己的动画的下一帧之前会先调一下这个函数，理想情况下，1s有60帧，即帧率为60 fps
        window.requestAnimationFrame(this.walk.bind(this));
    }

    recordMousePosition() {
        window.addEventListener('mousemove', throttle(event => {
            // 图像左上角表示为止
            this.dog.frontStopX = event.clientX - this.pictureWidth;
            this.dog.backStopX = event.clientX;
        }, 100))
    }

    walk() {
        let now = Date.now();
        // 控制速度
        let distance = (now - this.lastWalkingTime) * this.dog.speed;
        // 没有达到最小步数，重新注册 直接return
        if (distance < this.dog.stepDistance) {
            window.requestAnimationFrame(this.walk.bind(this));
            return;
        }
        // 先清掉上一次画的内容
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // 获取下一张图片的索引
        let keyFrameIndex = ++this.keyFrameIndex % this.IMAGE_COUNT;
        // 判断方向
        let direct = -1,
            stopWalking = false;

        // 如果鼠标在狗的前面则往前走
        if (this.dog.frontStopX > this.dog.mouseX) {
            direct = 1;
        } else if (this.dog.backStopX < this.dog.mouseX) {
            direct = -1;
        } else {
            stopWalking = true;
            // 调整狗头方向，停留位置减去已经移动位置大于图片一半则狗头向右，否则向左
            direct = this.dog.backStopX - this.dog.mouseX >
                this.pictureWidth / 2 ? 1 : -1;
            // 停止用0号照片
            keyFrameIndex = 0;
        }

        // 没有停止，则计算为止
        if (!stopWalking) {
            this.dog.mouseX += this.dog.stepDistance * direct;
        }

        // save之后，可以调用Canvas的平移、放缩、旋转、错切、裁剪等操作。
        this.ctx.save();
        if (direct === -1) {
            // 左右翻转绘制
            this.ctx.scale(direct, 1);
        }

        let img = this.dogPics[keyFrameIndex];

        // 左右翻转绘制的位置需要计算一下，因为反转，drawX会为负数
        let drawX = this.dog.mouseX * direct -
            (direct === -1 ? this.pictureWidth : 0);
        /**
         * param1：指定图片
         * param2-5：对原图像进行裁剪
         * param6-7：画布上的位置
         * param8-9：伸展或缩小图像
         */
        this.ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, drawX, 20, 186, 162); // 372 * 324
        this.ctx.restore();
        // 重置最近时间
        this.lastWalkingTime = now;
        // 继续给下一帧注册一个函数
        window.requestAnimationFrame(this.walk.bind(this));
    }

    loadResources() {
        let imagePath = [];
        for (let i = 0; i < this.IMAGE_COUNT; i++) {
            imagePath.push(`${this.RES_PATH}/${i}.png`);
        }

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
            Promise.all(works).then(dogPics => {
                this.dogPics = dogPics;
                resolve();
            })
        })
    }
}

let canvas = document.querySelector("#dog-walking");
let dogAnimation = new DogAnimation(canvas);
dogAnimation.start();