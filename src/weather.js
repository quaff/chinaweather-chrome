
function getProvinceAndCity(){
var arr = [];
if (typeof IPData != 'undefined'){  
    arr[0] = IPData[2].replace('Ê¡','');  
    arr[1] = IPData[3].replace('ÊÐ','')||province;
}
return arr.join(',');
}


function getCityId(provinceAndCity){
var pc = provinceAndCity.split(',');
var cityId = '';
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
return cityId;
}

function getWeather(cityId){
var fullCityId = '101'+cityId+(/^0[1-4].*$/.exec(cityId)?'00':'01');
$.ajax({  
    url: 'http://www.weather.com.cn/html/weather/'+fullCityId+'.shtml',
    async: false,
    dataType: 'html',  
    success: function(html){
    html = html.replace(/<script(.|\s)*?\/script>/g, "");
    var div = $("<div/>").append(html);
    $('#weather').html($('div.weatherYubao',div).html());
    div.remove();
    $('#weather img').each(function(){$(this).attr('src','http://www.weather.com.cn'+$(this).attr('src'))});
    $('#weather h1.weatheH1 span').remove();
    $('#weather td').each(function(){$(this).removeAttr('style').html($(this).text())});
    $('#weather table.yuBaoTable').each(function(i){$(this).addClass('day'+(i+1))});
    $('#weather table.yuBaoTable tr').hover(function(){$(this).addClass('highlight')},function(){$(this).removeClass('highlight')});
    } 
  });
}

getWeather(getCityId(getProvinceAndCity()));
