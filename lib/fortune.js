var lyrics=[
	"Oh your eyes make the stars look like they're not shining.",
	"You're all that I need in every single way, girl you got me lip syncing your beauty is to blame.",
	"Every time we say goodbye I wish we had one more kiss. I wait for you I promise you, I will.",
	"Baby don't pretend that you don't know it's true cause you can see it when I look at you.",
	"Hold on and listen for the sound, of my love it's on the way.",
]
var links=[
	"<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=298 height=52 src=\"//music.163.com/outchain/player?type=2&id=5093684&auto=1&height=32\"></iframe>",
	"<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=298 height=52 src=\"//music.163.com/outchain/player?type=2&id=28188175&auto=1&height=32\"></iframe>",
	"<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=298 height=52 src=\"//music.163.com/outchain/player?type=2&id=26797847&auto=1&height=32\"></iframe>",
	"<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=298 height=52 src=\"//music.163.com/outchain/player?type=2&id=22064632&auto=1&height=32\"></iframe>",
	"<iframe frameborder=\"no\" border=\"0\" marginwidth=\"0\" marginheight=\"0\" width=298 height=52 src=\"//music.163.com/outchain/player?type=2&id=20519400&auto=1&height=32\"></iframe>",
]

exports.getFortune=function(req,res){
	var num=Math.floor(Math.random()*lyrics.length);
	var randomLyrics=lyrics[num];
	var randomLink=links[num];
	return [randomLyrics,randomLink];
};