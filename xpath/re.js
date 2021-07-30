// ==UserScript==
// @name         xpathcheck
// @namespace    http://tampermonkey.net/
// @version      0.1
//== @require    https://code.jquery.com/jquery-latest.js
// @description  try to take over the world!
// @author       You
// @match        file:///D:/*
//@run-at        document-end
// @grant        none
// ==/UserScript==

(function () {
    //window.stop();
    //console.log(document.URL+window.location.href);
    try {$("script").remove();}catch (e){}
    unlockcontextmenu();
    if(typeof(jQuery) ==='undefined') loadJs();
    //
    addstyle();

    let pageid = window.location.href.replace(/.*\/|\_.*$/g,"");
    readdb(pageid,function(obj){
        console.log(obj);
        if ("null"!=obj.tuwenstr)  xpathcheck(obj.tuwenstr,"tuwenstr");
        if ("null"!=obj.linksstr)  xpathcheck(obj.linksstr,"linksstr");
        if ("null"!=obj.otherstr)  xpathcheck(obj.otherstr,"otherstr");
    });
    //console.log(xpathobj);  //异步，所以不能取到值。需要像上边这样使用回调函数

    //if(window.location.href.match("00edf186baf0912cba0a8b99f8188ec8")){
    //    xpathcheck("/html/body/div[3]/div[3]/div[1]");
   // }
    addbtn();
    $("#upfile").change(function(){
        //console.log(1);
        openFile(event);
    });

})() ;

function xpathcheck(xpath,type){
    var allElements, thisElement;
    allElements = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);
    for (var i = 0; i < allElements.snapshotLength; i++) {
        thisElement = allElements.snapshotItem(i);
        if ("tuwenstr"==type) thisElement.className += ' tuwenstr';
        if ("linksstr"==type) thisElement.className += ' linksstr';
        if ("otherstr"==type) thisElement.className += ' otherstr';
        //thisElement.setAttribute('style', 'border: 5px dashed #e9686b;background-color:#b0c4de;opacity:0.6;');
    }
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

function loadJs(){
    //得到html的头部dom
    var theHead = document.getElementsByTagName('head').item(0);
    //创建脚本的dom对象实例
    var myScript = document.createElement('script');
    myScript.src = 'https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js';
    myScript.type = 'text/javascript';
    myScript.defer = true;              //程序下载完后再解析和执行
    theHead.appendChild(myScript);
  }

function addframe(){
    var body = document.getElementsByTagName("body");
    var div = document.createElement("div");
    div.innerHTML = '<iframe id="idFrame" name="idFrame" src="http://helper.log.cx/" height = "0" width = "0" frameborder="0" scrolling="auto" style = "display:none;visibility:hidden" ></iframe>';
    document.body.appendChild(div);
    console.log(document.getElementById('idFrame').contentWindow.localstorage.getIteam("localjson"));
}

function addstyle(){
    var style = document.createElement("style");
    style.type = "text/css";
    let cssstr = '.tuwenstr{border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .tuwenstr::before{content: "图文主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    cssstr += '.linksstr{border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .linksstr::before{content: "链接主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    cssstr += '.otherstr{border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .otherstr::before{content: "其他主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    style.appendChild(document.createTextNode(cssstr));
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
}

var openFile = function(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function() {
        if(reader.result) {
            //显示文件内容
            //$("#output").html(reader.result);
            //console.log(reader.result);
            let arr = reader.result.split(/\r?\n/);
            for (i in arr){
                //console.log(arr[i]);
                let obj = str2json(arr[i]);
                if (obj.id) writedb(obj);
            }
        }
    };
    reader.readAsText(input.files[0]);
};

function str2json(str){
    let jsonobj={"id":"","tuwenstr":"null","linksstr":"null","otherstr":"null","delstr":"null","wrstatus":0};
    let arr2 = str.split(/\t/);
    if(5==arr2.length && 32==arr2[0].length){
        //console.log(arr2.length+"_"+arr2[0].length+"_"+arr2[0]);
        jsonobj.id = arr2[0];
        if("null" != arr2[1]) jsonobj.tuwenstr = arr2[1].replace(/,|，/g,"|");
        if("null" != arr2[2]) jsonobj.linksstr = arr2[2].replace(/,|，/g,"|");
        if("null" != arr2[3]) jsonobj.otherstr = arr2[3].replace(/,|，/g,"|");
        if("null" != arr2[4]) jsonobj.delstr = arr2[4].replace(/,|，/g,"|");
    }
    return(jsonobj);
}

function addbtn(){
    var btnstr ='<button type="button" class="btn btn-sm btn-outline-secondary rounded-0" id="upload" onclick="upfile.click();" style="float:left !important;display:block !important;"><svg t="1627183528476" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12286" width="16" height="16"><path d="M763.424 841.152q0-14.848-10.848-25.728t-25.728-10.848-25.728 10.848-10.848 25.728 10.848 25.728 25.728 10.848 25.728-10.848 10.848-25.728zM909.728 841.152q0-14.848-10.848-25.728t-25.728-10.848-25.728 10.848-10.848 25.728 10.848 25.728 25.728 10.848 25.728-10.848 10.848-25.728zM982.848 713.152l0 182.848q0 22.848-16 38.848t-38.848 16l-841.152 0q-22.848 0-38.848-16t-16-38.848l0-182.848q0-22.848 16-38.848t38.848-16l244 0q12 32 40.288 52.576t63.136 20.576l146.272 0q34.848 0 63.136-20.576t40.288-52.576l244 0q22.848 0 38.848 16t16 38.848zM797.152 342.848q-9.728 22.848-33.728 22.848l-146.272 0 0 256q0 14.848-10.848 25.728t-25.728 10.848l-146.272 0q-14.848 0-25.728-10.848t-10.848-25.728l0-256-146.272 0q-24 0-33.728-22.848-9.728-22.272 8-39.424l256-256q10.272-10.848 25.728-10.848t25.728 10.848l256 256q17.728 17.152 8 39.424z" p-id="12287"></path></svg>导入</button><input type="file" id="upfile" accept="text/plain" style="display:none;">';
    $("body").append('<span id="upbtn" style="position: fixed;top:0;zindex:10000;"></span>');
    $("#upbtn").html(btnstr);
}


function writedb(jsonobj){ //indexdb
    /*创建indexdb*/
    var request = indexedDB.open("mydb", 1);
    request.onerror = function(e) {
        console.log(e.currentTarget.error.message);
    };

    request.onsuccess = function(e) {
       var db = e.target.result;
        console.log('成功打开DB');
    };

    request.addEventListener('upgradeneeded', e => {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('xpath')) {
            console.log("我需要创建一个新的存储对象");
            //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
            var objectStore = db.createObjectStore('xpath', {
                keyPath: "id",
                autoIncrement: false
            });
            console.log('创建对象仓库成功');
        }
    });
    request.addEventListener('success', e => {
        var db = e.target.result;
        var tx = db.transaction('xpath', 'readwrite');
        var store = tx.objectStore('xpath');
        var reqAdd = store.add({
            'id': jsonobj.id,
            'tuwenstr': jsonobj.tuwenstr,
            'linksstr': jsonobj.linksstr,
            'otherstr':jsonobj.otherstr,
            'delstr':jsonobj.delstr
        });
        reqAdd.addEventListener('success', e => {
            console.log('保存成功')
        })
    });
}

function readdb(id,callback){
    var request = indexedDB.open("mydb", 1);

    request.addEventListener('upgradeneeded', e => {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('xpath')) {
            console.log("我需要创建一个新的存储对象");
            //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
            var objectStore = db.createObjectStore('xpath', {
                keyPath: "id",
                autoIncrement: false
            });
            console.log('创建对象仓库成功');
        }
    });

    request.addEventListener('success', e => {
        var db = e.target.result;
        var tx = db.transaction('xpath', 'readwrite');
        var store = tx.objectStore('xpath');
        var reqGet = store.get(id);
        reqGet.addEventListener('success', e => {
            //console.log(reqGet.result);
            let reobj = reqGet.result;
            //return(reobj);
            if (typeof callback ==="function") {
                callback(reobj);
            }
        })
    });

}
