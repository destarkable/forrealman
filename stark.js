//---------------------定了的东西，不用改-----------------------------
var express = require('express');
var app = express();
var fortune=require('./lib/fortune.js');
var weather=require('./lib/weather.js');

var handlebars = require('express3-handlebars') 	//
	.create({ defaultLayout:'main2',				//
	helpers:{										//
		section:function(name,options){				//
			if(!this._sections) this._sections={};	//
			this._sections[name]=options.fn(this);	//
			return null;							//设置handlebars视图引擎
		}											//
	}												//
});													//
app.engine('handlebars', handlebars.engine);		//
app.set('view engine', 'handlebars');				//

app.use(express.static(__dirname+'/public'));		//用static中间件制定包含静态资源的默认目录(相当于一个已经定义好的函数)
app.use(function(req,res,next){
	res.locals.showTests=app.get('env')!='production'&&req.query.test==='1';
	next();
});													//自定义中间件，用来判定是否显示测试页面(是自定函数)

app.use(function(req,res,next){
	if(!res.locals.partials) res.locals.partials = {};
 	res.locals.partials.weatherContext = weather.getWeatherData();
 	next();
});													//又是一个中间件，用来加载天气组件(也是自定函数)

app.use(require('body-parser')());					//body-parser中间件

app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
	console.log('Express started on http:/\/localhost:'+app.get('port')+';\npress Contrl + c to terminate.');
});
//------------------------------------------------------------------

//变量、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、
//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

//所有路由处理函数*****************************************************
var homeHandler=function(req,res){
	res.render('home');
}
var aboutHandler=function(req,res){
	var come=fortune.getFortune();
	res.render('about',{
		lyrics:come[0],
		link:come[1],
		song:"<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=304 height=52 src=\"//music.163.com/outchain/player?type=2&id=33599620&auto=1&height=32\"></iframe>",
		pageTestScript:'/qa/tests-about.js'
	});
}
var contactHandler=function(req,res){
	res.render('contact');
}
var hoodriverHandler=function(req,res){
	res.render('tours/hood-river');
}
var requestgrouprateHandler=function(req,res){
	res.render('tours/request-group-rate');
}
var avengersgrandHandler=function(req,res){
	res.render('tours/avengers-grand');
}
var nurseryrhymeHandler=function(req,res){
	res.render('nursery-rhyme');
}
var datanurseryrhymeHandler=function(req,res){
	res.json({
		animal:'squirrel',
		body:'tail',
		adjective:'bushy',
		noun:'heck',
	});
}
var processHandler=function(req, res){
    if(req.xhr || req.accepts('json,html')==='json'){
        res.send({ success: true });
    } else {
        res.redirect(303, '/thank-you');
    }
}
var thankyouHandler=function(req, res){
	res.render('thank-you');
}
var newsletterHandler=function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
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
app.get('/contact',contactHandler);		//contact
app.get('/tours/hood-river',hoodriverHandler);//hood-river
app.get('/tours/request-group-rate',requestgrouprateHandler);//request-group-rate
app.get('/tours/avengers-grand',avengersgrandHandler);//avengers-grand
app.get('/nursery-rhyme',nurseryrhymeHandler);//nursery-rhyme
app.get('/data/nursery-rhyme',datanurseryrhymeHandler);//data-nursery-rhyme
app.get('/thank-you',thankyouHandler);//thank-you
app.get('/newsletter',newsletterHandler);//newsletter
app.post('/process',processHandler);

app.use(a404Handler);					//404
app.use(a500Handler);					//500
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

