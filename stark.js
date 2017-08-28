//---------------------定了的东西，不用改-----------------------------
var express = require('express');
var app = express();
var fortune=require('./lib/fortune.js');
var weather=require('./lib/weather.js');
var credentials = require('./credentials.js');

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

app.set('port',process.env.PORT||3000);
app.listen(app.get('port'),function(){
	console.log('Express started on http:/\/localhost:'+app.get('port')+';\npress Contrl + c to terminate.');
});
//------------------------------------------------------------------

//发送邮件完整的，记得先把email.js放在lib里面，当然还有credeatials.js、、、、、、、、、、、
//先把它封印在这，不然每一次开服务器都要发封邮件
/*var emailService=require('./lib/email.js')(credentials);
emailService.send('destarkable@163.com','Hood River tour is on sale today!','Go get it while hot!');*/
//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

//所有路由处理函数和中间件函数*****************************************************
var homeHandler=function(req,res){
	res.render('home');
};
var aboutHandler=function(req,res){
	res.render('about',{
		
		pageTestScript:'/qa/tests-about.js'
	});
};
var contactHandler=function(req,res){
	res.render('contact');
};
var hoodriverHandler=function(req,res){
	var come=fortune.getFortune();
	res.render('tours/hood-river',{
		lyrics:come[0],
		link:come[1]
	});
};
var requestgrouprateHandler=function(req,res){
	res.render('tours/request-group-rate');
};
var avengersgrandHandler=function(req,res){
	res.render('tours/avengers-grand');
};
var nurseryrhymeHandler=function(req,res){
	res.render('nursery-rhyme');
};
var datanurseryrhymeHandler=function(req,res){
	res.json({
		animal:'squirrel',
		body:'tail',
		adjective:'bushy',
		noun:'heck',
	});
};
var processHandler=function(req, res){
    if(req.xhr || req.accepts('json,html')==='json'){
        res.send({ success: true });
    } else {
        res.redirect(303, '/thank-you');
    }
};
var thankyouHandler=function(req, res){
	res.render('thank-you');
};
var newsletterHandler=function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('newsletter', { csrf: 'CSRF token goes here' });
};
var subscribeHandler=function(req, res){
    // we will learn about CSRF later...for now, we just
    // provide a dummy value
    res.render('subscribe', { csrf: 'CSRF token goes here' });
};

// for now, we're mocking NewsletterSignup:
function NewsletterSignup(){
};
NewsletterSignup.prototype.save = function(cb){
	cb();
};
var VALID_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
var subscribeprocessorHandler=function(req, res){
	var name = req.body.name || '', email = req.body.email || '';
	// input validation
	if(!email.match(VALID_EMAIL_REGEX)) {
		if(req.xhr) return res.json({ error: 'Invalid name email address.' });
		req.session.flash = {
			type: 'danger',
			intro: 'Validation error!',
			message: 'The email address you entered was  not valid.',
		};
		return res.redirect(303, '/subscribe');
	}
	new NewsletterSignup({ name: name, email: email }).save(function(err){
		if(err) {
			if(req.xhr) return res.json({ error: 'Database error.' });
			req.session.flash = {
				type: 'danger',
				intro: 'Database error!',
				message: 'There was a database error; please try again later.',
			};
			return res.redirect(303, '/thank-you');
		}
		if(req.xhr) return res.json({ success: true });
		req.session.flash = {
			type: 'success',
			intro: 'Thank you!',
			message: 'You have now been signed up for the newsletter.',
		};
		return res.redirect(303, '/thank-you');
	});
};
var a404Handler=function(req,res,next){
	res.render('404');
	res.status(404);
};/*
var a500Handler=function(err,res,req,next){
	console.log(err.stack);
	res.render('500');
	res.status(500);
};*/

var testMiddle=function(req,res,next){
	res.locals.showTests=app.get('env')!='production'&&req.query.test==='1';
	next();
};
var weatherMiddle=function(req,res,next){
	if(!res.locals.partials) res.locals.partials = {};
 	res.locals.partials.weatherContext = weather.getWeatherData();
 	next();
};
var flashMiddle=function(req,res,next){
	res.locals.flash=req.session.flash;
	delete req.session.flash;								
	next();
};
//*********************************************************************

//管子==============================================================================================================================
//app.use是中间件
//app.get是路由
//app.post是表单提交处理

app.use(express.static(__dirname+'/public'));					//用static中间件制定包含静态资源的默认目录(相当于一个已经定义好的函数)
app.use(testMiddle);											//自定义中间件，用来判定是否显示测试页面(是自定函数)
app.use(weatherMiddle);											//又是一个中间件，用来加载天气组件(也是自定函数)
app.use(require('body-parser')());								//body-parser中间件
app.use(require('cookie-parser')(credentials.cookieSecret));	//cookie-parser中间件
app.use(require('express-session')());							//express-session中间件
app.use(flashMiddle);											//自定义中间件，如果有flash消息就交给上下文，再清除


app.get('/',homeHandler);										//home
app.get('/about',aboutHandler);									//about
app.get('/contact',contactHandler);								//contact
app.get('/tours/hood-river',hoodriverHandler);					//hood-river
app.get('/tours/request-group-rate',requestgrouprateHandler);	//request-group-rate
app.get('/tours/avengers-grand',avengersgrandHandler);			//avengers-grand
app.get('/nursery-rhyme',nurseryrhymeHandler);					//nursery-rhyme
app.get('/data/nursery-rhyme',datanurseryrhymeHandler);			//data-nursery-rhyme
app.get('/thank-you',thankyouHandler);							//thank-you
app.get('/newsletter',newsletterHandler);						//newsletter
app.get('/subscribe',subscribeHandler);							//subscribe

app.post('/process',processHandler);
app.post('/subscribeprocessor',subscribeprocessorHandler);		//subscribe的post

app.use(a404Handler);											//404
//app.use(a500Handler);											//500



//==============================================================================================================================


