var Engine = {
    /** 
     * 使用正则，将我们规则进行替换
     * 将 %> 替换成 p.push('
     * 将 <% 替换成 ');
     * 将 <%=xxx%> 替换成 ');p.push(xxx);p.push('
     * 还需要加上头尾，去除可能存在的换行符
     * */
    templateEval: function (templateid) {
        var str = document.getElementById(templateid).innerHTML;
        var string = "var p = []; p.push('" + str
            .replace(/[\r\t\n]/g, "")// 取出可能存在的换行符
            .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
            .replace(/<%/g, "');")
            .replace(/%>/g, "p.push('")
            + "');";
        eval(string);
        return p.join('');
    },
    /**
     * var adder = new Function("a", "b", "return a + b");adder(2, 6); // 8
     */
    templateFunction: function (templateid) {
        var str = document.getElementById(templateid).innerHTML;
        var fn = new Function(
            "obj",
            "var p = []; p.push('" +
            str
                .replace(/[\r\t\n]/g, "")
                .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
                .replace(/<%/g, "');")
                .replace(/%>/g, "p.push('")
            + "');return p.join('');"
        );
        return fn(null);
    },
    /**
     * 我们觉得使用obj.attr的方式太繁琐了怎么办呢，同时模板的对象名称还必须和外部绑定，有没有什么办法呢，只用with语句
     * 使用规则：
     * with(person) {
     *  console.log('my name is ' + name + ', age is ' + age + '.')
     * }
     * 最后：不建议使用 with 语句，因为它可能是混淆错误和兼容性问题的根源，除此之外，也会造成性能低下，在这里还是先写一下
     */
    templateWith: function (templateid) {
        var str = document.getElementById(templateid).innerHTML;
        var fn = new Function(
            "obj",
            "var p = []; with(obj){p.push('" +
            str
                .replace(/[\r\t\n]/g, "")
                .replace(/<%=(.*?)%>/g, "');p.push($1);p.push('")
                .replace(/<%/g, "');")
                .replace(/%>/g, "p.push('")
            + "');}return p.join('');"
        );
        // 性能优化的地方，模板没有改变，数据变化了，则无需重复创建函数
        var template = function (data) {
            return fn.call(this, data)
        }
        return template;
    },
};

(function (target) {
    // underscore实现
    var settings = {
        // 求值
        evaluate: /<%([\s\S]+?)%>/g,
        // 插入
        interpolate: /<%=([\s\S]+?)%>/g,
    };

    var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
    };

    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

    target.template = function (templateid) {
        var text = document.getElementById(templateid).innerHTML;

        // 加上头
        var source = "var __p='';\n";
        source = source + "with(obj){\n"
        source = source + "__p+='";

        var main = text
            // 处理6个特殊字符
            .replace(escapeRegExp, function (match) {
                return '\\' + escapes[match];
            })
            // 处理<%=xxx%>标签
            .replace(settings.interpolate, function (match, interpolate) {
                // return "'+\n" + interpolate + "+\n'"
                // 处理interpolate值为空的情况
                return "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
            })
            // 处理<%xxx%>标签
            .replace(settings.evaluate, function (match, evaluate) {
                return "';\n " + evaluate + "\n__p+='"
            })

        // 加上尾
        source = source + main + "';\n }; \n return __p;";

        console.log(source)

        var render = new Function('obj', source);

        return render;
    };

    /**
     * 分段处理
     */
    target.template2 = function (text) {
        // 为什么还要加个 |$ 呢？我们之所以匹配 $，是为了获取最后一个字符串的位置，这样当我们 text.slice(index, offset)的时候，就可以截取到最后一个字符。
        var matcher = RegExp([
            (settings.interpolate).source,
            (settings.evaluate).source
        ].join('|') + '|$', 'g');

        var index = 0;
        var source = "__p+='";

        text.replace(matcher, function (match, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escapeRegExp, function (match) {
                return '\\' + escapes[match];
            });

            index = offset + match.length;

            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            } else if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }

            return match;
        });

        source += "';\n";

        source = 'with(obj||{}){\n' + source + '}\n'

        source = "var __t, __p='';" +
            source + 'return __p;\n';

        var render = new Function('obj', source);

        return render;
    };
})(Engine)
