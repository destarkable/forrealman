//---------------------定了的东西，不用改-----------------------------
var express = require('express');
var app = express();

var handlebars = require('express3-handlebars') 	//
	.create({ defaultLayout:'main' });			//设置handlebars视图引擎
app.engine('handlebars', handlebars.engine);	//
app.set('view engine', 'handlebars');			//

app.use(express.static(__dirname+'/public'));	//用static中间件制定包含静态资源的默认目录

app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
	console.log('Express started on http:/\/localhost:'+app.get('port')+';\npress Contrl + c to terminate.');
});
//------------------------------------------------------------------

//变量、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
var lyrics=[
	"我会发着呆，然后忘记你，接着紧紧闭上眼",
	"刮风这天，我试过握着你手，但偏偏，雨渐渐，大到我看你不见",
	"你说把爱渐渐放下会走更远，又何必去改变已走过的时间",
	"而我听见下雨的声音，想起你用唇语说爱情",
	"缓缓飘落的枫叶像思念，我点燃烛火温暖岁末的秋天",
]
var links=[
	"http://music.163.com/#/song?id=186010",
	"http://music.163.com/#/song?id=186016",
	"http://music.163.com/#/song?id=185868",
	"http://music.163.com/#/song?id=29822014",
	"http://music.163.com/#/song?id=185912",
]
//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

//所有路由处理函数*****************************************************
var homeHandler=function(req,res){
	res.render('home');
}
var aboutHandler=function(req,res){
	var num=Math.floor(Math.random()*lyrics.length);
	var randomLyrics=lyrics[num];
	var randomLink=links[num];
	res.render('about',{lyrics:randomLyrics, link:randomLink});
}
var a404Handler=function(req,res,next){
	res.render('404');
	res.status(404);
}
var a500Handler=function(err,res,req,next){
	console.log(err.stack);
	res.render('500');
	res.status(500);
}
//*********************************************************************

//所有路由>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.get('/',homeHandler);				//home
app.get('/about',aboutHandler);			//about
app.use(a404Handler);					//404
app.use(a500Handler);					//500
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

