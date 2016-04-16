// 将图片按照高度排序并重命名

var fs = require('fs')
var sizeOf = require('image-size');

var sortFileArr = function(file1, file2) {
    var sortFlag = file2[1] - file1[1];
    if (sortFlag == 0) {
        sortFlag = parseInt(file1[0].split('_')[1]) - parseInt(file2[0].split('_')[1])
    };
    return sortFlag
}

var filePath = 'c:/Users/linux/Desktop/123/'
var fileArr = fs.readdirSync(filePath);
var fileObjArrs = []

for (var i = 0; i < fileArr.length; i++) {
    var dimensions = sizeOf(filePath + fileArr[i]);
    var fileObjArr = []
    fileObjArr.push(fileArr[i])
    fileObjArr.push(dimensions.height)
    fileObjArrs.push(fileObjArr)
};

fileObjArrs = fileObjArrs.sort(sortFileArr)

console.log(fileObjArrs)

for (var i = 0; i < fileArr.length; i++) {
    var oldPath = filePath + fileObjArrs[i][0]
    var newPath = filePath + i + '.png'
    fs.renameSync(oldPath, newPath)
}

