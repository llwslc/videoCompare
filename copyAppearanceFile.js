// 将文件夹内第一次出现的文件拷贝到另一个文件夹内,便于截图
// 如果时间相邻, 则只计算第一次出现的时间

var fs = require('fs');
var async = require('async');

var deleteFolderRecursive = function(path) {
  var files = [];
  if( fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach(function(file,index){
      var curPath = path + '/' + file;
      if(fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

var copyFile = function(sourceFilePath, targetFilePath, callback)
{
  var rs = fs.createReadStream(sourceFilePath)
  var wr = fs.createWriteStream(targetFilePath)
  wr.on("close", function(res) {
    callback(null, null)
  });
  rs.pipe(wr);
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

var filePath = 'c:/joker/audience_/'
var sourcePath = '观众'
var targetPath = '整理观众'
var sourceFullPath = filePath + sourcePath + '/'
var targetFullPath = filePath + targetPath + '/'
var peopleDirArr = fs.readdirSync(sourceFullPath);
var copyFilePathArr = []

deleteFolderRecursive(targetFullPath);
fs.mkdirSync(targetFullPath)

for (var i = 0; i < peopleDirArr.length; i++) {
  fs.mkdirSync(targetFullPath + peopleDirArr[i] + '/')
};

for (var i = 0; i < peopleDirArr.length; i++) {
  var picArr = fs.readdirSync(sourceFullPath + peopleDirArr[i]);
  picArr = picArr.sort(sortFileArr)
  var preVideo = 0;
  var curVideo = 0;
  var preTime = 0;
  var curTime = 0;
  for (var j = 0; j < picArr.length; j++) {
    var picName = picArr[j].split("-");
    curVideo = parseInt(picName[0])
    curTime = parseInt(picName[1])
    if (curVideo !== preVideo) {
      copyFilePathArr.push(peopleDirArr[i] + '/' + picArr[j])
      preVideo = curVideo
    } else {
      if (curTime !== (preTime + 1)) {
        copyFilePathArr.push(peopleDirArr[i] + '/' + picArr[j])
      }
    }
    preTime = curTime
  };
};

var copyFileIndex = 0;
var copyFileFuncArr = [];
var emptyFunc = function(cb) {
  cb(null, null)
}
copyFileFuncArr.push(emptyFunc)

for (var i = 0; i < copyFilePathArr.length; i++) {
  var copyFileFunc = function(cbRes, cb) {
    var sourceFilePath = sourceFullPath + copyFilePathArr[copyFileIndex]
    var targetFilePath = targetFullPath + copyFilePathArr[copyFileIndex]
    copyFileIndex++
    copyFile(sourceFilePath, targetFilePath, cb)
  }
  copyFileFuncArr.push(copyFileFunc)
};

var startTime = new Date().getTime()
async.waterfall(copyFileFuncArr,
  function(err, res) {
    if (!!err) {
      console.log("err:", err)
    } else {
      var endTime = new Date().getTime();
      console.log("All files copy finish! time: " + parseInt((endTime - startTime)/1000) + " s");
    }
  });
