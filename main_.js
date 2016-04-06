var fs = require('fs');
var path = require('path');
var async = require("async");
var resemble = require('node-resemble-js');
var mysql = require("mysql");

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


var filePath = 'C:/joker/audience/'
var fileArr = fs.readdirSync(filePath);
var dirArr = [];
var picPathArr = [];
var compareFuncArr = [];
var compareImg1DirIndex = 0;
var compareImg2DirIndex = 1;
var compareImg1PicIndex = 0;
var compareImg2PicIndex = 0;
var compareIndex = 0;
var emptyFunc = function(cb) {
  var sqlStr = 'TRUNCATE diffrate'
  pool.query(sqlStr, function (err, res) {
    if (!!err) {
      cb(err, null)
    } else {
      cb(null, null)
    }
  });
}
compareFuncArr.push(emptyFunc)

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

// 生成所有文件两两比较函数
for (var i = 0; i < picPathArr.length; i++) {
  for (var j = i + 1; j < picPathArr.length; j++) {
    for (var m = 0; m < picPathArr[i].length; m++) {
      for (var n = 0; n < picPathArr[j].length; n++) {
        var compareFunc = function(cbRes, cb) {
          compareIndex++
          if (compareIndex === 1000) {
            gc() //每比较一千次进行一次垃圾回收
          }
          var img1 = fs.readFileSync(picPathArr[compareImg1DirIndex][compareImg1PicIndex]);
          var img2 = fs.readFileSync(picPathArr[compareImg2DirIndex][compareImg2PicIndex]);
          resemble(img1).compareTo(img2).ignoreAntialiasing().onComplete(function(data) {
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
                img1 = 0
                img2 = 0
                gc()

                compareImg2PicIndex++
                if (compareImg2PicIndex == picPathArr[compareImg2DirIndex].length) {
                  compareImg2PicIndex = 0
                  compareImg1PicIndex++
                  if (compareImg1PicIndex == picPathArr[compareImg1DirIndex].length) {
                    console.log(compareImg1DirIndex + " compare " + compareImg2DirIndex + " finish")

                    compareImg1PicIndex = 0
                    compareImg2DirIndex++
                    if (compareImg2DirIndex == picPathArr.length) {
                      compareImg1DirIndex++
                      if (compareImg1DirIndex == picPathArr.length) {
                        // over
                      } else {
                        compareImg2DirIndex = compareImg1DirIndex + 1
                      }
                    }
                  }
                }
                cb(null, null)
              }
            });
          });
        }
        compareFuncArr.push(compareFunc)
      };
    };
  };
};

var startTime = new Date().getTime()
async.waterfall(compareFuncArr,
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