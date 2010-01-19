function getCityId(){
if(!localStorage.cityId){
var cityId='';
var pc = [];
if (typeof IPData != 'undefined'){
    if(IPData[3]){	
	pc[0] = IPData[2];
	pc[1] = IPData[3];
	if(pc[0].length>3)pc[0] = pc[0].substring(0,3);
    	pc[0] = pc[0].replace('省','');  
    	pc[1] = pc[1].replace('市','');
    }else{
	pc[0] = IPData[2].replace('市','');  
    	pc[1] = pc[0];
    }
}
$.ajax({  
    url: 'http://service.weather.com.cn/plugin/data/city.xml',
    async: false,
    dataType: 'text',  
    success: function(text){
    var arr = text.split(',');  
    for(var i=0;i <arr.length;i++){
    var arr2 = arr[i].split('|');
    var pid = 0;
    if(arr2[1] == pc[0]){
      pid = arr2[0];
      break;  
    }
    }
    if(pid){
    $.ajax({  
    url: 'http://service.weather.com.cn/plugin/data/city'+pid+'.xml',
    async: false,
    dataType: 'text',  
    success: function(text){
    var arr = text.split(',');  
    for(var i=0;i <arr.length;i++){
    var arr2 = arr[i].split('|');
    if(arr2[1] == pc[1]){
      cityId = arr2[0];
      break;  
    }
    }
    }  
  });
    } 
    }  
 });
cityId = '101'+cityId+(/^0[1-4].*$/.exec(cityId)?'00':'01');
localStorage.cityId = cityId;
}
return localStorage.cityId;
}

function getWeather(cityId){
$.ajax({  
    url: 'http://www.weather.com.cn/html/weather/'+cityId+'.shtml',
    async: false,
    dataType: 'html',  
    success: function(html){
    html = html.replace(/<script(.|\s)*?\/script>/g, "");
    var div = $("<div/>").append(html);
    $('#weather').html($('div.weatherYubao',div).html());
    div.remove();
    $('#weather img').attr('src',function(i,v){return 'http://www.weather.com.cn'+v});
    $('#weather h1.weatheH1 span').remove();
    $('#weather td').removeAttr('style').each(function(){if($('a',this).length)$(this).html($('a',this).html())});
    $('#weather table.yuBaoTable').each(function(i){$(this).addClass('day'+(i+1))});
    $('#weather table.yuBaoTable tr').hover(function(){$(this).addClass('highlight')},function(){$(this).removeClass('highlight')});
    } 
  });
}

function refresh(){
$('#weather').text('数据加载中...');
delete(localStorage.cityId);
getWeather(getCityId());
}

getWeather(getCityId());
