var fortune=require('../lib/fortune.js');
var expect =require('chai').expect;

suite('Fortune music tests',function(){
	test('getFortune() should return an array of fortunes',function(){
		expect(typeof fortune.getFortune()[0]==='string');
	});
});