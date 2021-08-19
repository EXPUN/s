// ==UserScript==
// @name         xpath标记可视化工具
//== @namespace    http://tampermonkey.net/
// @version      20210819_1
// @updateURL    https://helper.log.cx/xpath/xpathtoolbar.js
//== @require    https://code.jquery.com/jquery-latest.js
//== @require    https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/bootstrap-v4-rtl/4.6.0-1/css/bootstrap.min.css
// @description  20210819_1填错后如果工具栏变形看不到重填按钮；可以在页面空白处__双击，将工具栏拉高
// @description  20210819_1工具条改为https
// @description  20210813_1修复了有同学反馈打开一批页面,做了几个,剩下页面今日完成数据更新慢(修复前要手动刷新或者完成后才更新)的问题
// @description  20210811_2修复了点击缩放按钮工具栏会闪一下等小问题
// @description  20210811_1修复了个别页面在body标签上用oncontextmenu="return false"的方式屏蔽右键
// @description  20210811_1在工具条底部新增了缩放按钮，点击后直接缩放到50%
// @description  20210811_1在工具条底部新增了关闭按钮，不用再把鼠标从页面底部拖到浏览器顶部的标签栏关闭
// @author       You
// @match        file:///*
//@run-at        document-end
// @grant        none
// ==/UserScript==

var xpathtoolbarlocal_status;
(function () {
    unlockcontextmenu(); //部分页面在body标签上用on事件屏蔽右键
    const pageid = window.location.href.replace(/.*\/|\_.*$/g,"");

    if(typeof(jQuery)!='undefined') {
        try{
        var $jquery_old = $.noConflict(true);
        console.log($jquery_old().jquery);} catch (e){}
    }
    loadJs("https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js",function(){
        console.log(jQuery().jquery);
        afterreloadjq();
    });

    addstyle();

    window.addEventListener('message', function (e) {  // 监听 message 事件

        //console.log( "从"+ e.origin +"收到消息： "+pageid);
        var msgobj = e.data;
        //console.log(msgobj);
        if (msgobj.id==pageid){
            if ("null"!=msgobj.tuwenstr)  xpathcheck(msgobj.tuwenstr,"tuwenstr");
            if ("null"!=msgobj.linksstr)  xpathcheck(msgobj.linksstr,"linksstr");
            if ("null"!=msgobj.otherstr)  xpathcheck(msgobj.otherstr,"otherstr");
        }
        else if ("removecss"==msgobj.cmd){
            $(".tuwenstr").removeClass("tuwenstr");
            $(".linksstr").removeClass("linksstr");
            $(".otherstr").removeClass("otherstr");
        }
        else if ("zoom.5"==msgobj.cmd){
            document.getElementById("xpathtoolbarlocal").style.zoom=2;
            document.getElementsByTagName('body')[0].style.zoom=0.5;
        }
        else if ("zoom1"==msgobj.cmd){
            document.getElementById("xpathtoolbarlocal").style.zoom=1;
            document.getElementsByTagName('body')[0].style.zoom=1;
        }
        else if ("page.close"==msgobj.cmd){
            window.close();
        }
        else if ("iframe_loaded"==msgobj.onload){
            var receiver = document.getElementById('xpathFrame').contentWindow;
            //let pageid = window.location.href.replace(/.*\/|\_.*$/g,"");
            receiver.postMessage({"pageid":pageid},'*');
            //console.log("postmessage:"+pageid);
        }
    });

})() ;

document.addEventListener("visibilitychange", function() {
    //console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        //console.log('隐藏');
    } else if (document.visibilityState == "visible") {
        //console.log('显示')
        var receiver = document.getElementById('xpathFrame').contentWindow;
        receiver.postMessage({"cmd":"onfocus"},'*');
    }
});

function afterreloadjq(){
    //const pageid = window.location.href.replace(/.*\/|\_.*$/g,"");
    addbtn();
    $("body").on('dblclick', function(){//"#xpathtoolbarlocal",
        if (!xpathtoolbarlocal_status) {
            xpathtoolbarlocal_status = 1;
            $("#xpathtoolbarlocal").animate({height: '+400px'}, "100");
        }else{
            xpathtoolbarlocal_status = 0;
            $("#xpathtoolbarlocal").animate({height: '50px'}, "100");
        }
    })
}

function xpathcheck(xpath,type){
    var allElements, thisElement;
    try{
        allElements = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        for (var i = 0; i < allElements.snapshotLength; i++) {
            //console.log(i);
            thisElement = allElements.snapshotItem(i);
            if ("tuwenstr"==type) thisElement.className += ' tuwenstr';
            if ("linksstr"==type) thisElement.className += ' linksstr';
            if ("otherstr"==type) thisElement.className += ' otherstr';
            //thisElement.setAttribute('style', 'border: 5px dashed #e9686b;background-color:#b0c4de;opacity:0.6;');
        }
    }catch (e){}
}

function unlockcontextmenu(){
    function R(a) {
        let ona = "on" + a;
        if (window.addEventListener){
            window.addEventListener(a, function (e) {
                for (var n = e.originalTarget; n; n = n.parentNode){
                    n[ona] = null;
                }
            }, true);
        }
        window[ona] = null;
        document[ona] = null;
        if (document.body){
            document.body[ona] = null;
        }
     }
    R("contextmenu");
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
}

function loadJs(src,callback){
    //得到html的头部dom
    var theHead = document.getElementsByTagName('head').item(0);
    //创建脚本的dom对象实例
    var myScript = document.createElement('script');
    myScript.src = src;
    myScript.type = 'text/javascript';
    myScript.defer = true; //程序下载完后再解析和执行
    theHead.appendChild(myScript);
    if (typeof callback ==="function") {
        myScript.onload=function(){callback();};
    }
  }

function loadcss(path){
  if(!path || path.length === 0){
  throw new Error('argument "path" is required !');
  }
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.href = path;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  head.appendChild(link);
  }

function addframe(){
    var xpathtoolbarlocal = document.getElementById("xpathtoolbarlocal");
    var iframe = document.createElement('iframe');
    iframe.src="https://helper.log.cx/xpath/xpathtoolbar.html";//+?vMath.random();
    iframe.frameborder="0";
    iframe.id="xpathFrame";
    iframe.width="100%";
    iframe.height="35px";
    iframe.scrolling="no";
    xpathtoolbarlocal.appendChild(iframe);
    document.getElementById("xpathFrame").setAttribute("frameborder","0");
    iframe.onload=function(){

    };
}

function addstyle(){
    var style = document.createElement("style");
    style.type = "text/css";
    let cssstr = '.tuwenstr{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .tuwenstr::before{content: "图文主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    cssstr += '.linksstr{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .linksstr::before{content: "链接主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    cssstr += '.otherstr{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .otherstr::before{content: "其他主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    cssstr += '#xpathtoolbarlocal{position:fixed;left:0;bottom:0;width:100%;height:50px;padding:12px 2px;text-align:left;box-sizing:border-box;z-index:99999999999999999 !important;border:2px;border-color:grey;background:#fff;color:#dc3545 !important;box-shadow:0 -10px 20px 0 rgba(0,0,0,.05);}';
    style.appendChild(document.createTextNode(cssstr));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}

function str2json(str){
    let jsonobj={"id":"","tuwenstr":"null","linksstr":"null","otherstr":"null","delstr":"null","wrstatus":0,"author":"","day":""};
    let arr2 = str.split(/\t/);
    if(7==arr2.length && 32==arr2[0].length){
        //console.log(arr2.length+"_"+arr2[0].length+"_"+arr2[0]);
        jsonobj.id = arr2[0];
        if("null" != arr2[1]) jsonobj.tuwenstr = arr2[1].replace(/,|，/g,"|");
        if("null" != arr2[2]) jsonobj.linksstr = arr2[2].replace(/,|，/g,"|");
        if("null" != arr2[3]) jsonobj.otherstr = arr2[3].replace(/,|，/g,"|");
        if("null" != arr2[4]) jsonobj.delstr = arr2[4].replace(/,|，/g,"|");
        if("null" != arr2[5]) jsonobj.author = arr2[5].replace(/,|，/g,"|");
        if("null" != arr2[6]) jsonobj.day = arr2[6].replace(/,|，/g,"|");
    }
    return(jsonobj);
}

function addbtn(){
    //var btnstr ='<button type="button" class=" " id="upload" onclick="upfile.click();" style="float:left !important;"><svg t="1627183528476" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12286" width="16" height="16"><path d="M763.424 841.152q0-14.848-10.848-25.728t-25.728-10.848-25.728 10.848-10.848 25.728 10.848 25.728 25.728 10.848 25.728-10.848 10.848-25.728zM909.728 841.152q0-14.848-10.848-25.728t-25.728-10.848-25.728 10.848-10.848 25.728 10.848 25.728 25.728 10.848 25.728-10.848 10.848-25.728zM982.848 713.152l0 182.848q0 22.848-16 38.848t-38.848 16l-841.152 0q-22.848 0-38.848-16t-16-38.848l0-182.848q0-22.848 16-38.848t38.848-16l244 0q12 32 40.288 52.576t63.136 20.576l146.272 0q34.848 0 63.136-20.576t40.288-52.576l244 0q22.848 0 38.848 16t16 38.848zM797.152 342.848q-9.728 22.848-33.728 22.848l-146.272 0 0 256q0 14.848-10.848 25.728t-25.728 10.848l-146.272 0q-14.848 0-25.728-10.848t-10.848-25.728l0-256-146.272 0q-24 0-33.728-22.848-9.728-22.272 8-39.424l256-256q10.272-10.848 25.728-10.848t25.728 10.848l256 256q17.728 17.152 8 39.424z" p-id="12287"></path></svg>导入</button><input type="file" id="upfile" accept="text/plain" style="display:none;">';
    jQuery("body:eq(0)").append('<span id="xpathtoolbarlocal" style=""></span>');
    //jQuery("#xpathtoolbarlocal").html(btnstr);
    //jQuery("#xpathtoolbarlocal").append('<span id="xpathlocalinfo" style="line-height: 25px;font-size: 20px;font-weight: bold;padding-left:12px;position:relative;"></span>');
    //jQuery("#xpathlocalinfo").html("当前页面为本地文件！");
    //jQuery("#xpathtoolbarlocal").append('<span id="checkinfouserpanel" style="line-height: 25px;font-size: 20px;font-weight: bold;padding-left:12px;"></span>');
    addframe();
    /*jQuery("#xpathtoolbarlocal").append('<span id="checkinfo" style="line-height: 25px;font-size:20px;font-weight: bold;float:right;margin-right:12px;"></span>');
    jQuery("#checkinfo").append('<button type="button" class="" id="checkitsright" style="line-height: 25px;">正确</button>');
    let rsvgstr='<svg t="1627891706178" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8178" width="16" height="16"><path d="M954.857143 323.428571q0 22.857143-16 38.857143l-413.714286 413.714286-77.714286 77.714286q-16 16-38.857142 16t-38.857143-16l-77.714286-77.714286-206.857143-206.857143q-16-16-16-38.857143t16-38.857143l77.714286-77.714285q16-16 38.857143-16t38.857143 16l168 168.571428 374.857142-375.428571q16-16 38.857143-16t38.857143 16l77.714286 77.714286q16 16 16 38.857142z" p-id="8179" fill="#31b77a"></path></svg>';
    jQuery("#checkitsright").append(rsvgstr);
    jQuery("#checkinfo").append('<button type="button" class="" id="checkitswrong" style="margin-left:12px;">错误</button>');
    let wsvgstr='<svg t="1627891766395" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8385" width="16" height="16"><path d="M851.428571 755.428571q0 22.857143-16 38.857143l-77.714285 77.714286q-16 16-38.857143 16t-38.857143-16l-168-168-168 168q-16 16-38.857143 16t-38.857143-16l-77.714285-77.714286q-16-16-16-38.857143t16-38.857142l168-168-168-168q-16-16-16-38.857143t16-38.857143l77.714285-77.714286q16-16 38.857143-16t38.857143 16l168 168 168-168q16-16 38.857143-16t38.857143 16l77.714285 77.714286q16 16 16 38.857143t-16 38.857143l-168 168 168 168q16 16 16 38.857142z" p-id="8386" fill="#d81e06"></path></svg>';
    jQuery("#checkitswrong").append(wsvgstr);
   jQuery("#checkinfo").append('<button type="button" class="" id="savebtn" style="margin-left:48px;">导出</button>');
    var savebtnstr='<svg t="1627183789230" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8182" width="16" height="16"><path d="M768 768q0-14.857143-10.857143-25.714286t-25.714286-10.857143-25.714285 10.857143-10.857143 25.714286 10.857143 25.714286 25.714285 10.857143 25.714286-10.857143 10.857143-25.714286z m146.285714 0q0-14.857143-10.857143-25.714286t-25.714285-10.857143-25.714286 10.857143-10.857143 25.714286 10.857143 25.714286 25.714286 10.857143 25.714285-10.857143 10.857143-25.714286z m73.142857-128v182.857143q0 22.857143-16 38.857143t-38.857142 16H91.428571q-22.857143 0-38.857142-16t-16-38.857143v-182.857143q0-22.857143 16-38.857143t38.857142-16h265.714286l77.142857 77.714286q33.142857 32 77.714286 32t77.714286-32l77.714285-77.714286h265.142858q22.857143 0 38.857142 16t16 38.857143z m-185.714285-325.142857q9.714286 23.428571-8 40l-256 256q-10.285714 10.857143-25.714286 10.857143t-25.714286-10.857143L230.285714 354.857143q-17.714286-16.571429-8-40 9.714286-22.285714 33.714286-22.285714h146.285714V36.571429q0-14.857143 10.857143-25.714286t25.714286-10.857143h146.285714q14.857143 0 25.714286 10.857143t10.857143 25.714286v256h146.285714q24 0 33.714286 22.285714z" p-id="8183"></path></svg>';
    jQuery("#savebtn").append(savebtnstr);*/
    //console.log("insert xpathtoolbarlocal suc!");
}
