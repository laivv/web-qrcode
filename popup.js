var scale = chrome.extension.getBackgroundPage().scale;
if(typeof scale === 'undefined')
{
	scale = 1;
}
else
{
	$("#size").val(scale);
}
var scaleDict=[200,200,250,300,350,400];
var url;
var toUtf8 = chrome.extension.getBackgroundPage().toUtf8;
 chrome.tabs.query({active: true},function(tab){
 	url = tab[0].url
 	code($("#code"),scale,url);
 	// $("#title").text("已生成当前网址二维码");
 	$("#content").val(url);
});

function code(c,s,str)
{

	s = typeof s === 'undefined'?200:scaleDict[s];
	$("#wraper").width(s);

	c.empty().qrcode({width:s,height:s,text:str});
}

	
$("#size").on("change",function(){
	scale = chrome.extension.getBackgroundPage().scale = $(this).val();

	code($("#code"),scale,url);
});

$("#render").on("click",function(){
	url = toUtf8($("#content").val());
	code($("#code"),scale,url);
	// $("#title").text("已生成自定义内容二维码");
});

$("#clear").on("click",function(){
	$("#content").val("").focus();
});