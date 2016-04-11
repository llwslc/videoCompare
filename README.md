# screenshots.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/screenshotjs.png)


* 将一个文件夹下的视频文件每隔1s截图一次并分别保存在文件夹下
* 文件名如 "1-20160117.mkv"
* 截图文件夹为名为 "1"
* 截图文件名为 "1-" + 所在秒数 + ".png", 如: "1-3601.png"



# main.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/main.png)


* 根据输入的参数比较某两个文件夹中的图片相似度
* 如 node main.js 0 1 是指通过 fs.readdirSync 读取得到的文件夹数组中的下标为 0 和 1 的文件夹下的图片两两比较
* 并将比较结果存入mysql数据库中
* 在 CPU T9600 单核跑满的情况下平均每 0.1s 比较一次


# main_.js 和 main__.js

* 不需要输入参数的比较方式, 不同的写法, 效果是一样的



# sortVideo.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/sortVideo.png)


* 按照出现的次数排序
* 如 1-123, 1-124, 1-225 算一次



# sortTime.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/sortTime.png)


* 排序出现的期数
* 如 1-123 表示在第一期出现过



# getEveryTime.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/getEveryTime.png)


* 将某些文件夹内文件格式转为时间, 即将秒数转为 hh:mm:ss 格式



# getAppearanceTime.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/getAppearanceTime.png)


* 将某些文件夹内文件格式转为时间
* 如果时间相邻, 则只计算第一次出现的时间



# copyAppearanceFile.js


![image](https://github.com/llwslc/VideoCompare/blob/master/Screenshots/copyAppearanceFile.png)


* 将文件夹内第一次出现的文件拷贝到另一个文件夹内,便于截图
* 如果时间相邻, 则只计算第一次出现的时间

