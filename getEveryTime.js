// 将某些文件夹内文件格式转为时间

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
var videoDate = [20160117, 20160124, 20160131, 20160214, 20160221, 20160228, 20160306, 20160313, 20160320, 20160327, 20160403, 20160410]
var peopleDirArr = ['黑棉帽女','黑衣鼓掌女','眼镜女']

for (var i = 0; i < peopleDirArr.length; i++) {
  var picArr = fs.readdirSync(filePath + peopleDirArr[i]);
  console.log(peopleDirArr[i])
  picArr = picArr.sort(sortFileArr)
  for (var j = 0; j < picArr.length; j++) {
    var video = parseInt(picArr[j].split("-")[0])
    var time = secondToTimemark(parseInt(picArr[j].split("-")[1]))
    console.log(video + ":" + videoDate[video - 1] + "-" + time)
  };
  console.log("----------------------------")
};
