// 将文件夹下的视频文件每隔1s截图一次并保存
// 文件名如 "1-20160117.mkv"
// 截图文件夹为名为 "1"
// 截图文件名为 "1-" + 所在秒数 + ".png" 如 "1-3601.png"

var ffmpeg = require('fluent-ffmpeg');
var async = require('async');
var fs = require('fs');

ffmpeg.setFfmpegPath('ffmpeg-20160322-git-30d1213-win64-static/bin/ffmpeg.exe');
ffmpeg.setFfprobePath('ffmpeg-20160322-git-30d1213-win64-static/bin/ffprobe.exe');

var videoScreenshotPreSecond = function(fileName, videoFilePath, screenshotsDir, callback) {
  var screenshotCount = 0;
  var eachScreenshotCount = 100;

  var waterfallFuncArr = [];
  var getScreenshotCountFunc = function(cb)
  {
    ffmpeg(videoFilePath).ffprobe(0, function(err, data) {
      if(!!err) {
        cb(err, null)
      } else {
        screenshotCount = parseInt(data.format.duration);
        cb(null, {screenshotCount: screenshotCount})
      }
    });
  };

  waterfallFuncArr.push(getScreenshotCountFunc)

  var calcScreenshotFuncCount = function(cbRes, cb) {
    var mScreenshotCount = cbRes.screenshotCount
    var mWaterfallFuncArr = [];
    var screenshotFuncCount = Math.ceil(mScreenshotCount / 100)
    var funcIndex = 0;

    var emptyFunc = function(cbFunc) {
      cbFunc(null, null)
    }
    mWaterfallFuncArr.push(emptyFunc)

    for (var i = 0; i < screenshotFuncCount; i++) {
      var screenshotFunc = function(cbRes, cbFunc) {
        var screenshotTimeArr = [];
        for (var i = 0; i < eachScreenshotCount; i++) {
          screenshotTimeArr.push((eachScreenshotCount * funcIndex) + i)
        };
        ffmpeg(videoFilePath)
        .on('end', function() {
          console.log(fileName + " process " + funcIndex + " / " + screenshotFuncCount);
          funcIndex++;
          cbFunc(null, null)
        })
        .on('error', function(err) {
          cbFunc(err, null)
        }).screenshots({
          filename: fileName + '-%s',
          timemarks: screenshotTimeArr,
          folder: screenshotsDir,
          size: '50%'
        });
      }
      mWaterfallFuncArr.push(screenshotFunc)
    };

    var screenshotLastFunc = function(cbRes, cbFunc) {
      screenshotFuncCount--;
      var lastScreenshotCount = mScreenshotCount - eachScreenshotCount * screenshotFuncCount;
      if (lastScreenshotCount === 0) {
        cbFunc(null, null)
      } else {
        var screenshotTimeArr = [];
        for (var i = 0; i < lastScreenshotCount; i++) {
          screenshotTimeArr.push((eachScreenshotCount * screenshotFuncCount) + i)
        };

        ffmpeg(videoFilePath)
        .on('end', function() {
          cbFunc(null, null)
        })
        .on('error', function(err) {
          cbFunc(err, null)
        }).screenshots({
          filename: fileName + '-%s',
          timemarks: screenshotTimeArr,
          folder: screenshotsDir,
          size: '50%'
        });
      }
    }
    mWaterfallFuncArr.push(screenshotLastFunc)

    async.waterfall(mWaterfallFuncArr,
      function(err, cbRes) {
        if (!!err) {
          cb(err, null)
        } else {
          cb(null, null)
        }
      });
  }

  waterfallFuncArr.push(calcScreenshotFuncCount)

  var startTime = new Date().getTime()
  async.waterfall(waterfallFuncArr,
    function(err, res) {
      if (!!err) {
        callback({err: err, file: videoFilePath}, null)
      } else {
        var endTime = new Date().getTime();
        console.log(fileName + " screenshot finish! time: " + parseInt((endTime - startTime)/1000) + " s");
        callback(null, null)
      }
    });
}

var filePath = 'c:/joker/'
var fileArr = fs.readdirSync(filePath);
var fileIndex = 0;
var fileFuncArr = [];
var emptyFunc = function(cb) {
  cb(null, null)
}
fileFuncArr.push(emptyFunc)

for (var i = 0; i < fileArr.length; i++) {
  var fileFunc = function(cbRes, cb) {
    var videoFilePath = filePath + fileArr[fileIndex];
    var fileName = fileArr[fileIndex].split("-")[0];
    var screenshotsDir = filePath + fileName;
    videoScreenshotPreSecond(fileName, videoFilePath, screenshotsDir, function(err, res) {
      if (!!err) {
        cb(err, null)
      } else {
        fileIndex++
        cb(null, null)
      }
    })
  }
  fileFuncArr.push(fileFunc)
};

var startTime = new Date().getTime()
async.waterfall(fileFuncArr,
  function(err, res) {
    if (!!err) {
      console.log("file: " + err.file + " || err: " + err.err.message)
      callback({err: err, file: videoFilePath}, null)
    } else {
      var endTime = new Date().getTime();
      console.log("All screenshot finish! time: " + parseInt((endTime - startTime)/1000) + " s");
    }
  });