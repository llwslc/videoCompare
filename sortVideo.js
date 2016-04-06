//排序出现的期数

var fs = require('fs');

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
  for (var k = dirArr[j].length; k < 10; k++) {
    peopleCode += "  "
  };
  peopleArr.push(peopleCode)
  for (var i = 0; i < picArr.length; i++) {
    var video = picArr[i].split("-")[0]
    peopleObj[video] = 0
  };
  for (key in peopleObj) {
    peopleArr.push(key)
  };
  peopleVideoArr.push(peopleArr)
};

peopleVideoArr.sort(sortPeopleVideo)

console.log(peopleVideoArr)


