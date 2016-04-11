// 按照出现的次数排序
// 1-123, 1-124, 1-225 算一次

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

var sortFileArr = function(file1, file2) {
  var fileName1 = file1.split("-")
  var fileName2 = file2.split("-")
  var video1 = parseInt(fileName1[0])
  var video2 = parseInt(fileName2[0])
  var time1 = parseInt(fileName1[1])
  var time2 = parseInt(fileName2[1])
  var resFlag = 0
  if (video1 === video2) {
    resFlag = time1 - time2
  } else {
    resFlag = video1 - video2
  }

  return resFlag
}

var sortPeopleArr = function(people1, people2) {
  return people2[1] - people1[1]
}

var filePath = 'c:/joker/audience_/观众/'
var fileArr = fs.readdirSync(filePath);
var dirArr = []
var peopleTimeArr = [];

for (var i = 0; i < fileArr.length; i++) {
  if (fs.statSync(filePath + fileArr[i]).isDirectory())
  {
    dirArr.push(fileArr[i]);
  }
};

for (var i = 0; i < dirArr.length; i++) {
  var picArr = fs.readdirSync(filePath + dirArr[i]);
  picArr = picArr.sort(sortFileArr)
  var peopleArr = []
  var peopleCode = dirArr[i];
  for (var k = getStringLength(dirArr[i]); k < 16; k++) {
    peopleCode += " "
  };
  peopleArr.push(peopleCode)
  var preVideo = 0;
  var curVideo = 0;
  var preTime = 0;
  var curTime = 0;
  var time = 0;
  for (var j = 0; j < picArr.length; j++) {
    var picName = picArr[j].split("-");
    curVideo = parseInt(picName[0])
    curTime = parseInt(picName[1])
    if (curVideo !== preVideo) {
      time++
      preVideo = curVideo
    } else {
      if (curTime !== (preTime + 1)) {
        time++
      }
    }
    preTime = curTime
  };
  peopleArr.push(time)
  peopleTimeArr.push(peopleArr)
};

peopleTimeArr = peopleTimeArr.sort(sortPeopleArr)


console.log(peopleTimeArr)

