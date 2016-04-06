var fs = require('fs');
var path = require('path');
var async = require("async");
var resemble = require('node-resemble-js');
var mysql = require("mysql");
var heapdump = require('heapdump');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : "127.0.0.1",
    port            : 3306,
    user            : "root",
    password        : "",
    database        : "joker"
});

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

var pauseFunc = function() {
  console.log('Press any key to exit');

  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on('data', process.exit.bind(process, 0));
}


var filePath = 'C:/joker/audience_/'
var fileArr = fs.readdirSync(filePath);
var dirArr = [];
var picPathArr = [];
var dirCompareFuncArr = [];
var compareImg1DirIndex = process.argv[2];
var compareImg2DirIndex = process.argv[3];
var compareImg1PicIndex = 0;
var compareImg2PicIndex = 0;
var compareIndex = 0;
var compareCount = 0;
var compareLogIndex = 100;
var compareStartTime = new Date().getTime();
var emptyFunc = function(cb) {
  console.log("start compare!", compareImg1DirIndex, ":", compareImg2DirIndex)
  cb(null, null)
}
dirCompareFuncArr.push(emptyFunc)

for (var i = 0; i < fileArr.length; i++) {
  if (fs.statSync(filePath + fileArr[i]).isDirectory())
  {
    dirArr.push(fileArr[i]);
  }
};

for (var i = 0; i < dirArr.length; i++) {
  picPathArr.push([]);
  var picArr = fs.readdirSync(filePath + dirArr[i]);
  for (var j = 0; j < picArr.length; j++) {
    picPathArr[i].push(filePath + dirArr[i] + '/' + picArr[j])
  };
};

// 根据输入的参数确定比较哪两个文件夹
for (var m = 0; m < picPathArr[compareImg1DirIndex].length; m++) {
  for (var n = 0; n < picPathArr[compareImg2DirIndex].length; n++) {
    compareCount++
    var picCompareFunc = function(cbRes, cb) {
      compareIndex++
      if ((compareIndex % compareLogIndex) === 0) {
        var compareEndTime = new Date().getTime();
        console.log("process", compareIndex, "/", compareCount, "time pass:", parseInt((compareEndTime - compareStartTime)/1000), "s");
        compareStartTime = new Date().getTime();
      }
      var img1 = fs.readFileSync(picPathArr[compareImg1DirIndex][compareImg1PicIndex]);
      var img2 = fs.readFileSync(picPathArr[compareImg2DirIndex][compareImg2PicIndex]);
      resemble(img1).compareTo(img2).onComplete(function(data) {
        img1 = 0
        img2 = 0

        var img1Name = path.parse(picPathArr[compareImg1DirIndex][compareImg1PicIndex]).name
        var img2Name = path.parse(picPathArr[compareImg2DirIndex][compareImg2PicIndex]).name
        var sqlStr = 'INSERT INTO diffrate (path1, time1, path2, time2, diff) VALUES ("'
                     + img1Name + '", "' + secondToTimemark(img1Name.split("-")[1]) + '", "'
                     + img2Name + '", "' + secondToTimemark(img2Name.split("-")[1]) + '", '
                     + data.misMatchPercentage + ')'
        pool.query(sqlStr, function (err, res) {
          if (!!err) {
            cb(err, null)
          } else {

            compareImg2PicIndex++
            if (compareImg2PicIndex == picPathArr[compareImg2DirIndex].length) {
              compareImg2PicIndex = 0
              compareImg1PicIndex++
              if (compareImg1PicIndex == picPathArr[compareImg1DirIndex].length) {
                compareImg1PicIndex = 0
              }
            }
            cb(null, null)
          }
        });
      });
    }
    dirCompareFuncArr.push(picCompareFunc)
  }
}


var startTime = new Date().getTime()
async.waterfall(dirCompareFuncArr,
  function(err, res) {
    if (!!err) {
      console.log(err.message)
    } else {
      var endTime = new Date().getTime();
      console.log("All image compared! time: " + parseInt((endTime - startTime)/1000) + " s");
      pool.end(function (err) {
        if (!!err) {
          console.log(err.message)
        } else {
          console.log("disconnect mysql")
          pauseFunc()
        }
      });
    }
  });