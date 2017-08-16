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

exports.getFortune=function(req,res){
	var num=Math.floor(Math.random()*lyrics.length);
	var randomLyrics=lyrics[num];
	var randomLink=links[num];
	return [randomLyrics,randomLink];
};