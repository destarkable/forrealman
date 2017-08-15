# forrealman
This time is for real man

static中间件是用来指定默认的静态资源目录的。
vendor文件夹是指那些需要放在public目录下被客户端访问的，由第三方开发的包，不需要修改，用来做特殊区分。

chapter5 QA
res.local是要传送给视图的上下文的一部分。
1.做页面测试
	首先确定思想，页面测试不应该时时刻刻都在做，也不应该时时刻刻都显示在被测试主页面上。所以在url中用test是否为1来判断要不要做测试。在主js文件stark.js中 用自己写的中间件来实现。这个中间件在res.locals上挂了一个showTests（res.locals.showTests）用来作为在js和视图中传递的判断变量。主文件中只是得到了它的值，真正页面如何显示是在页面里面来判断的。
	然后在main.handlebars里面用showTests进行判断。{{ }}里面放的到目前为止我发现都是在js和视图之间传递的变量和它的逻辑部分。
		先是在<head>里判断有没有showTests是否为True，这里需要引入jquery，直接把scrip的src设为官网js地址就好。如果True则把CSS设为mocha.css
		再是在<body>里判断showTests，True的话会加进来一些html用来显示测试结果，这里我删掉了一个判断 pageTestsScript的，上下文里好像没用到它，删掉也没什么影响发现。之后要用的话就加上吧，应该是引入更多页面测试js文件的一个判断。这里的global-test为了便于扩展单独写成了一个js，放在/qa里，以suite开头。
	之后做非全局的页面测试，发现了pageTestScript的用处，果然是写单独页面测试的东西。嗯推理很准确，哈哈哈哈哈哈。嗯，同样是再写一个about-tests.js放在／qa里面，刚才定义的是全局测试，是写到main.handlebars里，现在个性化单独页面测试也在main.handlebars里写好了，有判断。很全面，嗯。
2.跨页测试
	哈哈哈，搞笑，zombie不支持windows哈哈哈。看来这本书选的很对啊，很棒啊。记住这个作者，以后多看看他的书。
	