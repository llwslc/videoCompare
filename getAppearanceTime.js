// 将某些文件夹内文件格式转为时间
// 如果时间相邻, 则只计算第一次出现的时间

var fs = require('fs');

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

var formatTime = function(video, time) {
  return videoDate[(video - 1)] + "-" + secondToTimemark(time)
}

var secondToTimemark = function(seconds) {
  if (typeof timemark === 'string') {
    return timemark;
  }

  var sec_num = parseInt(seconds, 10); // don't forget the second param
  var hours   = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0" + hours;}
  if (minutes < 10) {minutes = "0" + minutes;}
  if (seconds < 10) {seconds = "0" + seconds;}
  var time    = hours + ':' + minutes + ':' + seconds;

  return time;
};

var filePath = 'c:/joker/audience_/观众/'
var videoDate = [20160117, 20160124, 20160131, 20160214, 20160221, 20160228, 20160306, 20160313, 20160320, 20160327]
var peopleDirArr = ['黑黑女','白粉黑','白黑粉','黄衣三人组']
var peopleTimeArr = []

for (var i = 0; i < peopleDirArr.length; i++) {
  var picArr = fs.readdirSync(filePath + peopleDirArr[i]);
  picArr = picArr.sort(sortFileArr)
  var peopleArr = []
  var peopleCode = peopleDirArr[i];
  for (var k = peopleDirArr[i].length; k < 10; k++) {
    peopleCode += "  "
  };
  peopleArr.push(peopleCode)
  var preVideo = 0;
  var curVideo = 0;
  var preTime = 0;
  var curTime = 0;
  for (var j = 0; j < picArr.length; j++) {
    var picName = picArr[j].split("-");
    curVideo = parseInt(picName[0])
    curTime = parseInt(picName[1])
    if (curVideo !== preVideo) {
      peopleArr.push(formatTime(curVideo, curTime))
      preVideo = curVideo
    } else {
      if (curTime !== (preTime + 1)) {
        peopleArr.push(formatTime(curVideo, curTime))
      }
    }
    preTime = curTime
  };
  peopleTimeArr.push(peopleArr)
};

console.log(peopleTimeArr)

