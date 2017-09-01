//---------------------定了的东西，不用改-----------------------------
var express = require('express');
var app = express();
var fortune=require('./lib/fortune.js');
var weather=require('./lib/weather.js');
var credentials = require('./credentials.js');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');
var Vacation = require('./models/vacation.js');
var Attraction = require('./models/attraction.js'); //API
var vhost = require('vhost');                       //子域名插件


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

//发送邮件完整的，记得先把email.js放在lib里面，当然还有credeatials.js
//先把它封印在这，不然每一次开服务器都要发封邮件
//````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

/*var emailService=require('./lib/email.js')(credentials);
emailService.send('destarkable@163.com','Hood River tour is on sale today!','Go get it while hot!');*/

//````````````````````````````````````````````````````````````````````````````````````````````````````````````````````

//MongoDB/////////////////////////////////////////////////////////////////////////////////////////////////////////////

//建立数据库配置
var options = {
    server: {
       socketOptions: { keepAlive: 1 } 
    }
};
switch(app.get('env')){
    case 'development':
        mongoose.connect(credentials.mongo.development.connectionString, options);
        break;
    case 'production':
        mongoose.connect(credentials.mongo.production.connectionString, options);
        break;
    default:
        throw new Error('Unknown execution environment: ' + app.get('env'));
}

//初始化数据库
Vacation.find(function(err, vacations){
    if(vacations.length) return;

    new Vacation({
        name: 'Hood River Day Trip',
        slug: 'hood-river-day-trip',
        category: 'Day Trip',
        sku: 'HR199',
        description: 'Spend a day sailing on the Columbia and ' + 
            'enjoying craft beers in Hood River!',
        priceInCents: 9995,
        tags: ['day trip', 'hood river', 'sailing', 'windsurfing', 'breweries'],
        inSeason: true,
        maximumGuests: 16,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Oregon Coast Getaway',
        slug: 'oregon-coast-getaway',
        category: 'Weekend Getaway',
        sku: 'OC39',
        description: 'Enjoy the ocean air and quaint coastal towns!',
        priceInCents: 269995,
        tags: ['weekend getaway', 'oregon coast', 'beachcombing'],
        inSeason: false,
        maximumGuests: 8,
        available: true,
        packagesSold: 0,
    }).save();

    new Vacation({
        name: 'Rock Climbing in Bend',
        slug: 'rock-climbing-in-bend',
        category: 'Adventure',
        sku: 'B99',
        description: 'Experience the thrill of rock climbing in the high desert.',
        priceInCents: 289995,
        tags: ['weekend getaway', 'bend', 'high desert', 'rock climbing', 'hiking', 'skiing'],
        inSeason: true,
        requiresWaiver: true,
        maximumGuests: 4,
        available: false,
        packagesSold: 0,
        notes: 'The tour guide is currently recovering from a skiing accident.',
    }).save();
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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
};
var a500Handler=function(err,res,req,next){
	console.log(err.stack);
	res.render('500');
	res.status(500);
};

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
var contestvacationHandler = function(req, res){
	var now = new Date();
	res.render('contest/vacation-photo', { year: now.getFullYear(), month: now.getMonth() });
};

var dataDir = __dirname + '/data';
var vacationPhotoDir = dataDir + '/vacation-photo';
var contestvacationprocessorHandler = function(req, res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        if(err) {
            req.session.flash = {
                type: 'danger',
                intro: 'Oops!',
                message: 'There was an error processing your submission. ' +
                    'Pelase try again.',
            };
            return res.redirect(303, '/contest/vacation-photo');
        }
        var photo = files.photo;
        var dir = vacationPhotoDir + '/' + Date.now();
        var path = dir + '/' + photo.name;
        fs.mkdirSync(dir);
        fs.renameSync(photo.path, dir + '/' + photo.name);

        req.session.flash = {
            type: 'success',
            intro: 'Good luck!',
            message: 'You have been entered into the contest.',
        };
        return res.redirect(303, '/contest/vacation-photo/entries');
    });
};
var caontestvacationentriesHandler= function(req, res){
	res.render('contest/vacation-photo/entries');
};
var vacationHandler=function(req, res){
    Vacation.find({ available: true }, function(err, vacations){
        var currency = req.session.currency || 'USD';
        var context = {
            vacations: vacations.map(function(vacation){
                return {
                    sku: vacation.sku,
                    name: vacation.name,
                    description: vacation.description,
                    inSeason: vacation.inSeason,
                    price: vacation.getDisplayPrice(),
                }
            })
        };
        res.render('vacations', context);
    });
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
app.use('/api',require('cors')());                              //cors中间件，用于跨域资源共享


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
app.get('/contest/vacation-photo', contestvacationHandler);
app.get('/contest/vacation-photo/entries', caontestvacationentriesHandler);
app.get('/vacations', vacationHandler);

app.post('/contest/vacation-photo/:year/:month', contestvacationprocessorHandler);
app.post('/process',processHandler);
app.post('/subscribeprocessor',subscribeprocessorHandler);		//subscribe的post


app.use(a404Handler);											//404
app.use(a500Handler);											//500



//==============================================================================================================================


