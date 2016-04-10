// 排序出现的期数
// 如 1-123 表示在第一期出现过

var fs = require('fs');

var getStringLength = function (str)
{
  var strLen = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      strLen++
    } else {
      strLen+=2
    }
  };
  return strLen;
}

var sortPeopleVideo = function(people1, people2) {
  return people2.length - people1.length
}

var videoDate = [20160117, 20160124, 20160131, 20160214, 20160221, 20160228, 20160306, 20160313, 20160320, 20160327]

var filePath = 'c:/joker/audience_/观众/'
var fileArr = fs.readdirSync(filePath);
var dirArr = []
var peopleVideoArr = [];

for (var i = 0; i < fileArr.length; i++) {
  if (fs.statSync(filePath + fileArr[i]).isDirectory())
  {
    dirArr.push(fileArr[i]);
  }
};

for (var j = 0; j < dirArr.length; j++) {
  var picArr = fs.readdirSync(filePath + dirArr[j])
  var peopleObj = {}
  var peopleArr = []
  var peopleCode = dirArr[j];
  for (var k = getStringLength(dirArr[j]); k < 16; k++) {
    peopleCode += " "
  };
  peopleArr.push(peopleCode)
  for (var i = 0; i < picArr.length; i++) {
    var video = picArr[i].split("-")[0]
    peopleObj[video] = 0
  };
  for (key in peopleObj) {
    if (key < 10) {
      key = key + " "
    }
    peopleArr.push(key)
  };
  peopleVideoArr.push(peopleArr)
};

peopleVideoArr.sort(sortPeopleVideo)

console.log(peopleVideoArr)


