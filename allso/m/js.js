function getHash() {
    if(location.hash)
        return location.hash.substring(1);
    return '';
}
function getSearch() {
    if(location.search)
        return location.search.substring(3);
    return '';
}


//常用变量
var soinput_obj = $('#soinput');

load_local();



/* 设置搜索引擎 */
/* 设置搜索引擎 */
function load_local(){
    if(localStorage.engine_status) {
        localStorage.engine_status.split(',').forEach(function(status, index) {
            $('[name="engine"]').eq(index).prop('checked', status == '1').triggerHandler('click');
            $('.col').eq(index)[status == '1' ? 'show' : 'hide']();
        });
    }
}

function set(a0b1, set_so) {
    localStorage["allso_" + a0b1] = set_so;
    if (set_so == 0) {
        set_url[a0b1] = "https://www.baidu.com/s?wd=";
        set_top[a0b1] = -55; set_left[a0b1] = -100; set_foot[a0b1] = 70;
    }
    else if (set_so == 1) {
        set_url[a0b1] = "https://m.so.com/s?src=home_next&srcg=home_next&q=";
        set_top[a0b1] = -60; set_left[a0b1] = -90; set_foot[a0b1] = 80;
    }
    else if (set_so == 2) {
        set_url[a0b1] = "https://cn.bing.com/search?setmkt=zh-cn&setlang=zh-cn&q=";
        set_top[a0b1] = -95; set_left[a0b1] = -80; set_foot[a0b1] = 60;
    }
    else if (set_so == 3) {
        set_url[a0b1] = "https://www.sogou.com/web?query=";
        set_top[a0b1] = -55; set_left[a0b1] = -100; set_foot[a0b1] = 80;
    }

}


/* 响应 Hash */
(function () {
    if (location.hash) {
        var hash = getHash();
        hash = decodeURIComponent(hash).trim();
        soinput_obj[0].value = hash;
        if(!hash) return;
        so();
    } 
/* 	    if (getSearch()) {
        var query = getSearch();
        query = decodeURIComponent(query);
        soinput_obj[0].value = query;
		console.log(query);
        //so();
    }*/
})();



/* 搜索按钮事件 */
function so() {
    if ($.trim(soinput_obj[0].value) !== '') {
        var sowhat_str = soinput_obj[0].value,
            sowhat = encodeURIComponent(sowhat_str);
      		
        var urls = [
            'https://m.so.com/s?src=home_next&srcg=home_next&q=',
            'https://www.baidu.com/from=844b/s?pu=sz%401320_480&ms=1&word=',
            'https://m.toutiao.com/search/?pd=synthesis&source=input&traffic_source=&original_source=&in_tfs=&in_ogs=&keyword=',
            'https://quark.sm.cn/s?tomode=advanced&q=',
            'https://wap.sogou.com/web/searchList.jsp?ua=Mozilla/5.0%20(Linux;%20Android%204.2.1;%20en-us;%20Nexus%204%20Build/JOP40D)%20AppleWebKit/535.19%20(KHTML,%20like%20Gecko)%20Chrome/18.0.1025.166%20Mobile%20Safari/535.19&keyword='
        ];

        for(var i = 0; i < urls.length; i++) {
            var url = urls[i]+sowhat;
        
            if($('.col').eq(i).is(':visible')) {
                $('#iframe' + i).attr('src', url);
                $('.col .url').eq(i).html('&nbsp;&nbsp;&nbsp;<a href="' + url + '" target="_blank">打开</a>');
            }
        }
        location.hash = sowhat; //sowhat_str;
		//location.search = "?q="+sowhat;
        window.document.title = sowhat_str + ' - 移动对比搜索';
    }
    else {
        location.hash = '';
        window.document.title = '移动对比搜索';
    }
}


//二维码
$(function() {
	var preview;
	var timer;

	$('body').on('mouseover', '.qrcode',  function() {
		var el = $(this);
		var url = el.prev('a').attr('href');
		var offset = el.offset();
		var pos = el.position();

		if(preview) {
			preview.remove();
        }
        
        preview = $('<div class="qr-preview"></div>').appendTo(el.parents('.col'));

		preview.qrcode({text : url});

		setTimeout(function() {
			if(offset.left < 650) {
				preview.css({top : pos.top + el.height(), left : 0});
			} else {
				preview.css({top : pos.top + el.height(), right : 0});
			}
		}, 100);
	}).on('mouseout', '.qrcode', function() {
		timer = setTimeout(function() {
			preview.remove();
			preview = null;
		}, 100);
	}).on('mouseover', '.qr-preview', function() {
		clearTimeout(timer);
	}).on('mouseout', '.qr-preview', function() {
		preview.remove();
		preview = null;
	});
});


//console.log(localStorage["allso_state"]);
$('div.spinner').fadeOut('fast');
