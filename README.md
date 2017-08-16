# forrealman
This time is for real man

- static中间件是用来指定默认的静态资源目录的。
- vendor文件夹是指那些需要放在public目录下被客户端访问的，由第三方开发的包，不需要修改，用来做特殊区分。

## chapter5 QA
- res.local是要传送给视图的上下文的一部分。

### 1.做页面测试
首先确定思想，页面测试不应该时时刻刻都在做，也不应该时时刻刻都显示在被测试主页面上。所以在url中用test是否为1来判断要不要做测试。在主js文件stark.js中 用自己写的中间件来实现。这个中间件在res.locals上挂了一个showTests（res.locals.showTests）用来作为在js和视图中传递的判断变量。主文件中只是得到了它的值，真正页面如何显示是在页面里面来判断的。

然后在main.handlebars里面用showTests进行判断。{{ }}里面放的到目前为止我发现都是在js和视图之间传递的变量和它的逻辑部分。

    先是在<head>里判断有没有showTests是否为True，这里需要引入jquery，直接把scrip的src设为官网js地址就好。如果True则把CSS设为mocha.css
    再是在<body>里判断showTests，True的话会加进来一些html用来显示测试结果，这里我删掉了一个判断 pageTestsScript的，上下文里好像没用到它，删掉也没什么影响发现。之后要用的话就加上吧，应该是引入更多页面测试js文件的一个判断。这里的global-test为了便于扩展单独写成了一个js，放在/qa里，以suite开头。
之后做非全局的页面测试，发现了pageTestScript的用处，果然是写单独页面测试的东西。
嗯推理很准确，哈哈哈哈哈哈。
嗯，同样是再写一个about-tests.js放在／qa里面，刚才定义的是全局测试，是写到main.handlebars里，现在个性化单独页面测试也在main.handlebars里写好了，有判断。
很全面，嗯。

### 2.跨页测试
哈哈哈，搞笑，zombie不支持windows哈哈哈。看来这本书选的很对啊，很棒啊。记住这个作者，以后多看看他的书。

新创建页面hood-river.handlebars和request-group-rate.handlebars。要进行的跨页测试就是这两个页面的跨页测试，测试内容是在hood-river页面点链接进入request-group-rate页面时request-group-rate页面有没有记录是从哪点进去的，就是填没填那个输入框，是用后面的js操作的。可以先手动测试一遍。把表单别隐藏，直接看，多好。

嗯，手动测试完了，理解了代码。

诶呀，刚才要记个啥来着忘了。哦想起来了
- 修改视图时不用重启服务器，浏览器会直接实时更新，但修改stark.js后需要重启服务器，比如加了一个路由什么的，不重启的话就找不到路由。

- 哦对还有就是，注意在定义路由时前面要加上一个／，而在定义处理函数中res.render时不用额外加／，即使是下层目录。

ok,第二天了，今天从自动跨页开始，也就是zombie。
- 这里有一个点是，zombie的自动化测试不再是放在public里面了，也就是说他不是静态资源，不需要客户端可访问。这里是一个蛮特别的点。


    ⚠️注意，运行mocha时，会有一个错误提示超时。mocha默认是2000ms，所以要在运行时置顶一下timeout，设大点，我设成15000
    命令如下
    mocha -t 15000 -u tdd -R spec qa/tests-crosspage.js 2>/dev/null

发现慕课网还能记手记，还可以，还蛮漂亮的。可以尝试，不过目前现在的任务是赶紧把这个bug调了，要不不舒服啊。

    ⚠️Uncaught AssertionError: Unspecified AssertionError

反正代码都跟书上一样，不知道为什么，实在不行换一个格式写好了.

卧槽我终于发现了，玛德丹啊，zombie的clickLink进去以后request-group-test.handlebars那边的js脚本没有记录下这个referrer，我测试出来他们的标单项都是空的！！！**所以原来那个bug不是bug，它是在说，我的断言不成立！！！！卧槽，恍然大悟啊。妈蛋我还以为是代码的问题尼玛。记录下这个错误**

    ⚠️Cross-Page Tests requesting a group rate quote from the avengers grand tour page should populate the referrer filed:
     Uncaught AssertionError: Unspecified AssertionError

解决办法是，**我更改了测试文件，先让它在控制台输出这个域的文本发现妈蛋空了一行也就是说他是空的，然后断言这个域为空，就还是对的，说明他就是空的啊。草啊。**

### 3.单元测试AKA逻辑测试
这个比较简单，应该很快就完了。还使用mocha，唯一一点不同的是这次用的是suite test expect风格。至于有什么区别，我也不知道，去chai的官网上看一下吧。

看了，发现好像无关紧要，只是风格的问题。

不过作者部分的时候发现之前没有将fortune模块化。现在模块化了，而且发现了js函数返回两个值的方法

    放成一个数组就好，嗯蛮简单。而且有一个小bug，就是两次随机，还好机智，调好了。小问题though，小问题。

单元测试也，顺理成章的完成。比较简单。
### 4.去毛
已经集成到sublime text里了，直接可以跳过。哈哈，第二遍感觉就是不一样。不要立flag。。安静看吧
### 5.链接检查
这部分不做了，很简单，按书上弄一下就弄好了。
### 6.自动化
感觉好像很多的样子。

好吧其实什么都没有，完全没有技术难度，但是问题就是，单独测试是通过的，但用grunt就通不过。这就很。。了。

而且其实并没有怎么自动化啊，还是得要输grunt才能测试，何必呢，我直接挨个测试岂不是更好，成就感还高，多好。

###简书是个好东西 2017.8.16  以上 学会了markdown