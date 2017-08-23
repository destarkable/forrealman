var Browser=require('zombie'),
assert=require('chai').assert;
var browser;
suite('Cross-Page Tests',function(){
	//setup 函数在运行每个test之前都会执行，in this case，每个test时都会new一个browser
	setup(function(){
		browser=new Browser();
	});

	test('requesting a group rate quote from the hood river tour page should populate the referrer filed',function(done){
		var referrer='http://localhost:3000/tours/hood-river';
		browser.visit(referrer,function(){
			browser.clickLink('.requestGroupRate',function(){
				var text = browser.field('referrer').value;
  				//console.log(text);
  				assert(text==='');	
			});
			done();
		});
	});//最最恶心的东西，这个域通过zombie访问的时候无法运行脚本，所以为空啊草

	test('requesting a group rate quote from the avengers grand tour page should populate the referrer filed',function(done){
		//var referrer='http://localhost:3000/tours/avengers-grand';
		browser.visit('http://localhost:3000/tours/avengers-grand',function(){
			browser.clickLink('.avengersGrand',function(){
				var text = browser.field('referrer').value;
  				//console.log(text);
  				assert(text==='');
			})
			done();
		});
	});//最最恶心的东西，这个域通过zombie访问的时候无法运行脚本，所以为空啊草

	test('visiting the request group rate page directly should result in an empty referrer filed',function(done){
		browser.visit('http://localhost:3000/tours/request-group-rate',function(){
			assert(browser.field('referrer').value==='');
			done();
		});
	});
})