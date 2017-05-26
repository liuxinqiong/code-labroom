var sCharts = (function() {
    /**
     * @author SKY
     * @optimization
     * 1.配置参数合法性判断
     * 2.默认option
     * 3.扩展，1.传入百分比 2.传入各部分数据
     * 4.字体根据容器大小按照比例自动伸缩
     */

    //扩展方法
    Array.prototype.max = function() {
        return Math.max.apply({}, this)
    };

    Array.prototype.min = function() {
        return Math.min.apply({}, this)
    };

    //初始化全局参数
    var paper, pointCenter, maxRadiu;

    var option={
        labels:[],
        series:[],
        circles:[]
    };

    //绘制环
    function drawPieArray() {
        var series = option.series;
        for (var i = 0; i < series.length; i++) {
            var serie = series[i];
            //radius的参照都是最大半径
            var strokeWidth = (Math.abs(serie.radius[1] - serie.radius[0])) * maxRadiu;
            //取较小值作为实际半径
            var radiu = serie.radius.min() * maxRadiu;
            var data = serie.data;
            var totalData = 0;
            for (var j = 0; j < data.length; j++) {
                totalData += data[j].value;
            }
            var startAngle = 0;
            for (var z = 0; z < data.length; z++) {
                var percent = data[z].value / totalData * 100;
                var path = figureEndPoint(startAngle, radiu, percent);
                serie.style[z]["stroke-width"] = strokeWidth;
                drawPath(path, serie.style[z]);
                startAngle += 360 * percent / 100;
            }
        }
    }


    //目标：实现智能计算位置与确定大小
    function drawTextArray() {
        //计算可用高度和偏移量
        var freeHeight = getFreeHeight();
        var offset = maxRadiu - freeHeight / 2;
        //大约计算需要高度，实现自动居中
        var needHeight = getNeedHeight();
        var startHeight = 0;
        //in order to expand later!
        var bit = 1 || freeHeight / needHeight;
        if (bit > 1) {
            startHeight = offset + Math.abs(freeHeight - needHeight) / 2 / bit;
        } else {
            startHeight = offset + Math.abs(freeHeight - needHeight) / 2 * bit;
        }
        var labels = option.labels;
        for (var j = 0; j < labels.length; j++) {
            var text = {
                x: pointCenter.x,
                y: startHeight,
                content: labels[j].text
            };
            var textObj = drawText(text, labels[j].style, bit);
            //接着上一个进行绘制文本，累加高度
            startHeight += textObj[0].clientHeight;
        }
    }

    //绘制圆圈
    function drawCircleArray() {
        var circles = option.circles;
        for (var n = 0; n < circles.length; n++) {
            drawCircle(circles[n], circles[n].radiu * maxRadiu);
        }
    }

    //得到需要的高度
    function getNeedHeight() {
        var needHeight = 0;
        var labels = option.labels;
        for (var i = 0; i < labels.length; i++) {
            var fontSize = labels[i].style["font-size"] || 10;
            if (typeof fontSize === "string" && fontSize.indexOf('px') > -1) {
                fontSize = fontSize.substring(0, fontSize.length - 2);
            }
            try {
                needHeight += parseInt(fontSize);
            } catch (e) {
                console.log("类型转换错误");
            }
        }
        return needHeight;
    }

    //得到最小圆的空白区域多高，除去stroke-width值
    function getFreeHeight() {
        var series = option.series;
        var temp = [];
        for (var i = 0; i < series.length; i++) {
            var radius = series[i].radius;
            temp.push({
                min: radius.min(),
                radius: radius
            });
        }
        var min;
        for (var j = 0; j < temp.length - 1; j++) {
            min = temp[j];
            if (temp[j].min > temp[j + 1].min) {
                min = temp[j + 1];
            }
        }
        var result = 0;
        if (min.radius instanceof Array && min.radius.length === 2) {
            result = min.min * maxRadiu * 2;
            result -= maxRadiu * Math.abs(min.radius[1] - min.radius[0]);
        }
        return result;
    }

    //计算弧线两点位置
    function figureEndPoint(startAngle, radiu, percent) {
        var x1, x2, y1, y2;
        var angular = 360 * percent / 100;
        var endAngle = startAngle + angular;
        var rad = Math.PI / 180;
        x1 = pointCenter.x + radiu * Math.cos((startAngle - 90) * rad);
        y1 = pointCenter.y + radiu * Math.sin((startAngle - 90) * rad);
        x2 = pointCenter.x + radiu * Math.cos((endAngle - 90) * rad);
        y2 = pointCenter.y + radiu * Math.sin((endAngle - 90) * rad);
        return {
            startPoint: {
                x: x1,
                y: y1
            },
            endPoint: {
                x: x2,
                y: y2
            },
            bigArc: endAngle - startAngle > 180 ? 1 : 0,
            radiu: radiu
        };
    }

    //绘制路径
    function drawPath(path, style) {
        var pathStr = "M" + path.startPoint.x + " " + path.startPoint.y + " A " + path.radiu + " " + path.radiu + ",0" + "," + path.bigArc + "," + "1" + "," + path.endPoint.x + " " + path.endPoint.y;
        paper.path(pathStr).attr(style);
    }

    //绘制圆圈
    function drawCircle(circle, radiu) {
        paper.circle(pointCenter.x, pointCenter.y, radiu).attr(circle.style);
    }

    //绘制文本，实现自动伸缩,计算字体大于默认字体大小造成的偏移
    function drawText(text, style, bit) {
        var defaultFontSize = 10;
        var offSetY = 0;
        var fontSize = style["font-size"] || 10;
        if (!!fontSize && fontSize.indexOf('px') > -1) {
            fontSize = fontSize.substring(0, fontSize.length - 2);
        }
        fontSize = parseInt(fontSize) * bit;
        if (fontSize > defaultFontSize) {
            offSetY = (fontSize - defaultFontSize) / 2;
        }
        style["font-size"] = fontSize + "px";
        return paper.text(text.x, text.y + offSetY, text.content).attr(style);
    }

    function calcDomHeightAndWidth(dom) {
        return {
            height: dom.clientHeight,
            width: dom.clientWidth
        };
    }

    function extend(dst,src){
        for(var property in src){
            dst[property] = src[property];
        }
        return dst;
    }

    var SCharts = function() {

    };
    SCharts.fn = SCharts.prototype = {
        init: function(dom) {
            size = calcDomHeightAndWidth(dom);
            paper = Raphael(dom, size.width, size.height);
            pointCenter = {
                x: size.width / 2,
                y: size.height / 2
            };
            maxRadiu = size.width > size.height ? size.height / 2 : size.width / 2;
        },
        setOption: function(ops, autoDraw) {
            option=extend(option,ops);
            if (!!autoDraw) {
                this.draw();
            }
        },
        draw: function() {
            //绘制环
            drawPieArray();
            //绘制文本
            drawTextArray();
            //绘制圆圈
            drawCircleArray();
        }
    };
    return new SCharts(arguments);
})();

//测试数据，为展示数据结果
var ops = {
    labels: [{
        text: "能耗%",
        style: {
            "font-size": "12px",
            "fill": "#777"
        }
    }, {
        text: "72",
        style: {
            "font-size": "12px",
            "fill": "#3C617F",
            "font-weight": "bold"
        }
    }, {
        text: "产量%",
        style: {
            "font-size": "12px",
            "fill": "#777"
        }
    }, {
        text: "59",
        style: {
            "font-size": "30px",
            "fill": "#2ebc12",
            "font-weight": "bold"
        }
    }, {
        text: "时间%",
        style: {
            "font-size": "12px",
            "fill": "#777"
        }
    }, {
        text: "54",
        style: {
            "font-size": "12px",
            "fill": "#605a80",
            "font-weight": "bold"
        }
    }],
    //绘制圆圈的数目
    series: [{
        name: "能耗",
        radius: [0.95, 1],
        data: [{
            value: 80,
            name: "能耗值"
        }, {
            value: 20,
            name: "能耗%"
        }],
        style: [{
            "stroke": "#3C617F"
        }, {
            "stroke": "transparent"
        }]
    }, {
        name: "产量",
        radius: [0.85, 0.9],
        data: [{
            value: 70,
            name: "产量%"
        }, {
            value: 30,
            name: "产量%"
        }],
        style: [{
            "stroke": "#2ebc12"
        }, {
            "stroke": "transparent"
        }]
    }, {
        name: "时间",
        radius: [0.75, 0.8],
        data: [{
            value: 60,
            name: "时间%"
        }, {
            value: 40,
            name: "时间%"
        }],
        style: [{
            "stroke": "#605a80"
        }, {
            "stroke": "transparent"
        }]
    }],
    circles: [{
        radiu: 1,
        style: {
            "stroke": "#0E0F0F",
            "stroke-width": 1
        }
    }]
};

sCharts.init(document.getElementById("MyPie"));
sCharts.setOption(ops,true);