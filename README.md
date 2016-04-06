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



# sortTime.js



# getEveryTime.js



# getAppearanceTime.js


