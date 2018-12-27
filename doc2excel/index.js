var WordExtractor = require("word-extractor")
var xlsx = require('node-xlsx')
var fs = require('fs');
var extractor = new WordExtractor()

const srcPath = './doc/'
const sheetName = '工作联系单'
const title = [
    '编号',
    '发文时间',
    '事由',
    '责任单位',
    '文件名称'
]

fs.readdir(srcPath, function (err, files) {
    if (err) throw err
    console.log('共' + files.length + '个文件需要处理')
    var tasks = [];
    for (var i = 0; i < files.length; i++) {
        var filePath = srcPath + files[i]
        var extracted = extractor.extract(filePath);
        (function (index) {
            tasks.push(extracted.then(function (doc) {
                return parseFile(doc, index + 1, files[index])
            }));
        })(i)
    }
    Promise.all(tasks).then(function (data) {
        data.unshift(title)
        genExcel(data)
    }).catch(function (err) {
        throw err
    })
})

function parseFile(doc, index, fileName) {
    var res = doc.getBody();
    var idReg = /GD\d*/; // 取[GD及随后任意位数字]
    var id = res.match(idReg) ? res.match(idReg)[0].trimAll() : ''
    var toReg = /致：(.*)/; // 取[致：到换行之前]的所有字符
    var to = toReg.exec(res) ? toReg.exec(res)[1].trimAll() : ''
    var eventReg = /事\s*由：(.*)/; // 取[事由：到换行之前]的所有字符
    var event = eventReg.exec(res) ? eventReg.exec(res)[1].trimAll() : ''
    if(event[event.length - 1] === '。') {
        event = event.slice(0, -1)
    }
    var dateReg = /日\s*期\s*：\s*(.*日)/; // 取[日期：到日及之前]的所有字符
    var date = dateReg.exec(res) ? dateReg.exec(res)[1].trimAll() : ''
    console.log('处理第' + index + '个文件完成')
    return [id, date, event, to, fileName]
}

function genExcel(data) {
    console.log('begin to write xlsx')
    var excelData = [{
        name: sheetName,
        data: data
    }]
    var buffer = xlsx.build(excelData);
    fs.writeFile('./xlsx/result.xlsx', buffer, function (err) {
        if (err) throw err
        console.log('write to xls has finished')
    })
}

String.prototype.trimAll = function () {
    return this.replace(/\s*/g, "")
}