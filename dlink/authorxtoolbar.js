// ==UserScript==
// @name         author标注工具
// @version      20221111-1
// @updateURL    https://helper.log.cx/dlink/authorxtoolbar.js
//== @require    https://code.jquery.com/jquery-latest.js
//== @require    https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/bootstrap-v4-rtl/4.6.0-1/css/bootstrap.min.css
// @description  20221114-1初始化
// @author       You
// @match        http*://task.online/1111/*
//@run-at        document-end
// @grant        none
// ==/UserScript==
var xpathtoolbarlocal_status;
(function () {
    unlockcontextmenu(); //部分页面在body标签上用on事件屏蔽右键
    //$("meta[http-equiv='Content-Security-Policy']").remove();
    //document.querySelector("meta[http-equiv='Content-Security-Policy']").remove();
    //document.querySelector("meta[name='web-experience-app/config/environment']").remove();
    const pageid = window.location.href.replace(/.*\/|\.html?$/ig, "");
    if (typeof (jQuery) != 'undefined') {
        try {
            var $jquery_old = $.noConflict(true);
            console.log($jquery_old().jquery);
        } catch (e) {}
    }
    loadJs("https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js", function () {
        console.log(jQuery().jquery);
        afterreloadjq();
    });
    addstyle();
    window.addEventListener('message', function (e) { // 监听 message 事件
        //console.log( "从"+ e.origin +"收到消息： "+pageid);
        var msgobj = e.data;
        //console.log(msgobj);
        if (msgobj.id == pageid) {
            if ("null" != msgobj.xpath) xpathcheck(msgobj.xpath, "xpathcss", msgobj.type);
        } else if ("removecss" == msgobj.cmd) {
            $(".xpathcss").removeClass("xpathcss");
        } else if ("zoom.5" == msgobj.cmd) {
            document.getElementById("xpathtoolbarlocal").style.zoom = 2;
            document.getElementsByTagName('body')[0].style.zoom = 0.5;
        } else if ("zoom1" == msgobj.cmd) {
            document.getElementById("xpathtoolbarlocal").style.zoom = 1;
            document.getElementsByTagName('body')[0].style.zoom = 1;
        } else if ("page.close" == msgobj.cmd) {
            window.close();
        } else if ("iframe_loaded" == msgobj.onload) {
            var receiver = document.getElementById('xpathFrame').contentWindow;
            //let pageid = window.location.href.replace(/.*\/|\_.*$/g,"");
            receiver.postMessage({
                "pageid": pageid
            }, '*');
            //console.log("postmessage:"+pageid);
        } else if ("gettitle" == msgobj.cmd) {
            var pagetitle = document.getElementsByTagName('title')[0].innerText;
            receiver = document.getElementById('xpathFrame').contentWindow;
            receiver.postMessage({
                "pagetitle": pagetitle
            }, '*');
        }
    });
})();
document.addEventListener("visibilitychange", function () {
    //console.log(document.visibilityState);
    if (document.visibilityState == "hidden") {
        //console.log('隐藏');
    } else if (document.visibilityState == "visible") {
        //console.log('显示')
        var receiver = document.getElementById('xpathFrame').contentWindow;
        receiver.postMessage({
            "cmd": "onfocus"
        }, '*');
    }
});
function afterreloadjq() {
    //const pageid = window.location.href.replace(/.*\/|\_.*$/g,"");
    addbtn();
    var pagehref = "<span class='oddr'><span id='basehref'><a target='_blank' href=" + jQuery("base").attr("href") +
        ">" + jQuery("base").attr("href") +
        "</a></span><span onclick=$('#basehref').toggle()><svg style='padding: 0px;vertical-align: middle;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='871' width='32' height='32'><path d='M746.986667 307.2l100.096-100.117333a21.333333 21.333333 0 0 0-30.165334-30.165334l-112.853333 112.853334A562.858667 562.858667 0 0 0 512 256C220.416 256 42.666667 477.653333 42.666667 512c0 23.765333 85.248 137.173333 234.346666 204.8l-100.096 100.117333a21.333333 21.333333 0 1 0 30.165334 30.165334l112.853333-112.853334A562.858667 562.858667 0 0 0 512 768c291.584 0 469.333333-221.653333 469.333333-256 0-23.765333-85.248-137.173333-234.346666-204.8zM86.869333 512A541.354667 541.354667 0 0 1 512 298.666667a513.664 513.664 0 0 1 158.122667 25.045333l-69.12 69.12A147.904 147.904 0 0 0 512 362.666667a149.504 149.504 0 0 0-149.333333 149.333333 147.904 147.904 0 0 0 30.144 89.024l-83.093334 83.093333A532.992 532.992 0 0 1 86.869333 512zM618.666667 512a106.496 106.496 0 0 1-165.397334 88.896l147.626667-147.626667A105.941333 105.941333 0 0 1 618.666667 512z m-213.333334 0a106.496 106.496 0 0 1 165.397334-88.896l-147.626667 147.626667A105.941333 105.941333 0 0 1 405.333333 512z m106.666667 213.333333a513.685333 513.685333 0 0 1-158.122667-25.045333l69.12-69.12A147.904 147.904 0 0 0 512 661.333333a149.504 149.504 0 0 0 149.333333-149.333333 147.904 147.904 0 0 0-30.144-89.024l83.093334-83.093333A532.992 532.992 0 0 1 937.130667 512 541.354667 541.354667 0 0 1 512 725.333333z' fill='#646464' p-id='872'></path></svg>源地址</span></span>"
    //console.log(pagehref);
    jQuery("body").append(pagehref);
    $("body").on('dblclick', function () { //"#xpathtoolbarlocal",
        if (!xpathtoolbarlocal_status) {
            xpathtoolbarlocal_status = 1;
            $("#xpathtoolbarlocal").animate({
                height: '+400px'
            }, "100");
        } else {
            xpathtoolbarlocal_status = 0;
            $("#xpathtoolbarlocal").animate({
                height: '50px'
            }, "100");
        }
    })
}
function xpathcheck(xpath, csstype, type) {
    var allElements, thisElement;
    try {
        allElements = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null);
        for (var i = 0; i < allElements.snapshotLength; i++) {
            //console.log(i);
            thisElement = allElements.snapshotItem(i);
            if ("xpathcss" == csstype) thisElement.className += ' xpathcss';
            $('.xpathcss').append("<style>.xpathcss::before{content: '" + type + "'}</style>");
            //thisElement.setAttribute('style', 'border: 5px dashed #e9686b;background-color:#b0c4de;opacity:0.6;');
        }
    } catch (e) {}
}
function unlockcontextmenu() {
    function R(a) {
        let ona = "on" + a;
        if (window.addEventListener) {
            window.addEventListener(a, function (e) {
                for (var n = e.originalTarget; n; n = n.parentNode) {
                    n[ona] = null;
                }
            }, true);
        }
        window[ona] = null;
        document[ona] = null;
        if (document.body) {
            document.body[ona] = null;
        }
    }
    R("contextmenu");
    R("click");
    R("mousedown");
    R("mouseup");
    R("selectstart");
}
function loadJs(src, callback) {
    //得到html的头部dom
    var theHead = document.getElementsByTagName('head').item(0);
    //创建脚本的dom对象实例
    var myScript = document.createElement('script');
    myScript.src = src;
    myScript.type = 'text/javascript';
    myScript.defer = true; //程序下载完后再解析和执行
    theHead.appendChild(myScript);
    if (typeof callback === "function") {
        myScript.onload = function () {
            callback();
        };
    }
}
function loadcss(path) {
    if (!path || path.length === 0) {
        throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
}
function addframe() {
    var xpathtoolbarlocal = document.getElementById("xpathtoolbarlocal");
    var iframe = document.createElement('iframe');
    iframe.src = "http://tool.task.online/authorxtoolbar.html"; //+?vMath.random();
    iframe.frameborder = "0";
    iframe.id = "xpathFrame";
    iframe.width = "100%";
    iframe.height = "40px";
    iframe.scrolling = "no";
    xpathtoolbarlocal.appendChild(iframe);
    document.getElementById("xpathFrame").setAttribute("frameborder", "0");
    iframe.onload = function () {
    };
}
function addstyle() {
    var style = document.createElement("style");
    style.type = "text/css";
    let cssstr =
        '.xpathcss{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .xpathcss::before{content: "主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;}';
    cssstr +=
        '#xpathtoolbarlocal{position:fixed;left:0;bottom:0;width:100%;height:50px;padding:12px 2px;text-align:left;box-sizing:border-box;z-index:99999999999999999 !important;border:2px;border-color:grey;background:#fff;color:#dc3545 !important;box-shadow:0 -10px 20px 0 rgba(0,0,0,.05);}';
    cssstr +=
        '.oddr { font-size: 24px;margin: 2px 0;line-height: 1.8em;position:fixed; top:0;right:0;text-align: right;z-index: 77777777777777777;color: #0c5460;background-color: #d1ecf1;border-color: #bee5eb;border: 1px solid transparent;opacity:0.6 !important;';
    style.appendChild(document.createTextNode(cssstr));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}
function str2json(str) {
    let jsonobj = {
        "id": "",
        "tuwenstr": "null",
        "linksstr": "null",
        "otherstr": "null",
        "delstr": "null",
        "wrstatus": 0,
        "author": "",
        "day": ""
    };
    let arr2 = str.split(/\t/);
    if (7 == arr2.length && 32 == arr2[0].length) {
        //console.log(arr2.length+"_"+arr2[0].length+"_"+arr2[0]);
        jsonobj.id = arr2[0];
        if ("null" != arr2[1]) jsonobj.tuwenstr = arr2[1].replace(/,|，/g, "|");
        if ("null" != arr2[2]) jsonobj.linksstr = arr2[2].replace(/,|，/g, "|");
        if ("null" != arr2[3]) jsonobj.otherstr = arr2[3].replace(/,|，/g, "|");
        if ("null" != arr2[4]) jsonobj.delstr = arr2[4].replace(/,|，/g, "|");
        if ("null" != arr2[5]) jsonobj.author = arr2[5].replace(/,|，/g, "|");
        if ("null" != arr2[6]) jsonobj.day = arr2[6].replace(/,|，/g, "|");
    }
    return (jsonobj);
}
function addbtn() {
    jQuery("body:eq(0)").append('<span id="xpathtoolbarlocal" style=""></span>');
    addframe();
}
