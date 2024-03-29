// ==UserScript==
// @name        web2xpath/质检工具
// @version      20230527_1
// @updateURL    
// @description  
// @author       You
// @match        http://ptool.task.online/web2/html/*
//@run-at        document-end
// @grant        none
// ==/UserScript==
var day=currentTime().replace(/月|日.*$/g,"");
(function () {
    //window.stop();
    const pageid = window.location.href.replace(/.*\_|\_.*$|\.html/g,"");
    try {jQuery("script").remove();}catch (e){}
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        if (scripts[i]) {
            scripts[i].parentNode.removeChild(scripts[i]);
        }
    }
    unlockcontextmenu();
    //if(typeof(jQuery) ==='undefined') loadJs();
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
    //loadcss("https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/bootstrap-v4-rtl/4.6.0-1/css/bootstrap.min.css");

    /*if(window.location.href.match("9aa34c44cf570dbabac58b64bb250fe5")){
        console.log("9aa34c44cf570dbabac58b64bb250fe5");
        xpathcheck("/html/body/div[2]/div/div/article/div/div/div/div/div[2]/ul/li/div[2]/div","xpath0str");
    }*/

})() ;


function afterreloadjq(){
    const pageid = window.location.href.replace(/.*\/|\_.*$/g,"");
    readdb(pageid,function(obj){
        if ("undefined"==typeof(obj)) {jQuery("#checkinfouserpanel").html("未查询到标记记录");}
        else{
            //console.log(obj);
            if ("null"!=obj.userarr)  xpathcheck(obj.userarr,"tuwenstr");
            if ("null"!=obj.contentarr)  xpathcheck(obj.contentarr,"linkstr");
            if ("del"==obj.delstr)  jQuery("#checkinfouserpanel").html("此页面被标记为删除");
            if ("right"==obj.checkinfo) jQuery("#checkinfouserpanel").html("质检标记为正确");
            if ("wrong"==obj.checkinfo) jQuery("#checkinfouserpanel").html("质检标记为错误");
        }
    });

    jQuery("body").on("click","#checkitsright",function(){
        //console.log("checkitsright btn clicked!");
        updatedb(pageid,"right");
    });

    jQuery("body").on("click","#checkitskuoda",function(){
        //console.log("checkitsright btn clicked!");
        updatedb(pageid,"kuoda");
    });
    jQuery("body").on("click","#checkitswrong",function(){
        //console.log("checkitsright btn clicked!");
        updatedb(pageid,"wrong");
    });
    jQuery("body").on("click","#checkitsbuquan",function(){
        //console.log("checkitsright btn clicked!");
        updatedb(pageid,"buquan");
    });

    jQuery("body").on("click","#savebtn",function(){
        downloadfunction(function(txt){
            //console.log(txt);
            download("质检-"+currentTime().replace(/月|日.*$/g,"")+"_导出数据_"+currentTime()+".txt",txt);
        });
    });

    addbtn();
    jQuery("#upfile").change(function(){
        //console.log(1);
        openFile(event);
    });

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
            if ("linkstr"==type) thisElement.className += ' linkstr';
            //if ("otherstr"==type) thisElement.className += ' otherstr';
            //if ("xpath0str"==type) thisElement.className += ' xpath0str';
            //thisElement.setAttribute('style', 'border: 5px dashed #e9686b;background-color:#b0c4de;opacity:0.6;');
        }
    }catch (e){
        console.log('some err'+e.message)
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

function loadJs(src,callback){
    //得到html的头部dom
    var theHead = document.getElementsByTagName('head').item(0);
    //创建脚本的dom对象实例
    var myScript = document.createElement('script');
    myScript.src = src;
    myScript.type = 'text/javascript';
    myScript.defer = true;              //程序下载完后再解析和执行
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
    var body = document.getElementsByTagName("body");
    var div = document.createElement("div");
    div.innerHTML = '<iframe id="idFrame" name="idFrame" src="http://helper.log.cx/" height = "0" width = "0" frameborder="0" scrolling="auto" style = "display:none;visibility:hidden" ></iframe>';
    document.body.appendChild(div);
    console.log(document.getElementById('idFrame').contentWindow.localstorage.getIteam("localjson"));
}

function addstyle(){
    var style = document.createElement("style");
    style.type = "text/css";
    let cssstr = '.tuwenstr{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;} .tuwenstr::before{content: "用户名";background-color:yellow;color:red;font-weight:bold;font-size:16;z-index:10000;position: absolute;}';
    cssstr += '.linkstr{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;} .linkstr::before{content: "内容";background-color:yellow;color:red;font-weight:bold;font-size:16;z-index:10000;position: absolute;}';
    //cssstr += '.otherstr{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;} .otherstr::before{content: "其他主体";background-color:yellow;color:red;font-weight:bold;font-size:24;z-index:10000;position: absolute;}';
    cssstr += '#upbtnbar button{position:relative;cursor: pointer;height: 25px;line-height: 25px;width:56px;border: 1px solid #777;border-radius: 0;display:inline-block !important;font-size:13px;font-weight:normal;padding: 1px 6px;margin:0;background-image: -webkit-gradient(linear, left top, left bottom, from(#eee), to(#ccc));font-family: sans-serif;}'
    //cssstr += '.xpath0str{display: inline-block;border: 10px dashed #e9686b !important;background-color:#b0c4de !important;opacity:0.6 !important;}'
    cssstr += '#upbtnbar span{display:inline-block !important;font-family: "Microsoft YaHei";}';
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

            writedb(arr,function(countsuc){console.log(countsuc)});
            //for (i in arr){
                //console.log(arr[i]);
            //    let obj = str2json(arr[i]);
            //    if (obj.id) writedb(obj);
            //}
        }
    };
    reader.readAsText(input.files[0]);
};

function str2json(str){
    let arr2 = str.split(/\t/);
    let jsonobj={
        "id":arr2[0],
        "userarr":arr2[1],
        "contentarr":arr2[2],
        "t":arr2[3],
        "author":arr2[4],
        "day":arr2[5],
        "checkinfo":""
    };
    return(jsonobj);
}

function addbtn(){
    var btnstr ='<button type="button" class=" " id="upload" onclick="upfile.click();" style="float:left !important;"><svg t="1627183528476" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12286" width="16" height="16"><path d="M763.424 841.152q0-14.848-10.848-25.728t-25.728-10.848-25.728 10.848-10.848 25.728 10.848 25.728 25.728 10.848 25.728-10.848 10.848-25.728zM909.728 841.152q0-14.848-10.848-25.728t-25.728-10.848-25.728 10.848-10.848 25.728 10.848 25.728 25.728 10.848 25.728-10.848 10.848-25.728zM982.848 713.152l0 182.848q0 22.848-16 38.848t-38.848 16l-841.152 0q-22.848 0-38.848-16t-16-38.848l0-182.848q0-22.848 16-38.848t38.848-16l244 0q12 32 40.288 52.576t63.136 20.576l146.272 0q34.848 0 63.136-20.576t40.288-52.576l244 0q22.848 0 38.848 16t16 38.848zM797.152 342.848q-9.728 22.848-33.728 22.848l-146.272 0 0 256q0 14.848-10.848 25.728t-25.728 10.848l-146.272 0q-14.848 0-25.728-10.848t-10.848-25.728l0-256-146.272 0q-24 0-33.728-22.848-9.728-22.272 8-39.424l256-256q10.272-10.848 25.728-10.848t25.728 10.848l256 256q17.728 17.152 8 39.424z" p-id="12287"></path></svg>导入</button><input type="file" id="upfile" accept="text/plain" style="display:none;">';
    jQuery("body:eq(0)").append('<span id="upbtnbar" style="position:fixed;left:0;bottom:0;width:100%;height:35px;text-align:left;box-sizing:border-box;z-index:99999999999999999 !important;border:2px;border-color:grey;background:#fff;color:#dc3545 !important;box-shadow:0 -10px 20px 0 rgba(0,0,0,.05);padding:5px 2px;"></span>');
    jQuery("#upbtnbar").html(btnstr);
    jQuery("#upbtnbar").append('<span id="localinfo" style="line-height: 25px;font-size: 20px;font-weight: bold;padding-left:12px;position:relative;"></span>');
    jQuery("#localinfo").html("当前页面为本地文件！");
    jQuery("#upbtnbar").append('<span id="checkinfouserpanel" style="line-height: 25px;font-size: 20px;font-weight: bold;padding-left:12px;"></span>');
    jQuery("#upbtnbar").append('<span id="checkinfo" style="line-height: 25px;font-size:20px;font-weight: bold;float:right;margin-right:12px;"></span>');
    jQuery("#checkinfo").append('<button type="button" class="" id="checkitsright" style="line-height: 25px;">正确</button>');
    let rsvgstr='<svg t="1627891706178" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8178" width="16" height="16"><path d="M954.857143 323.428571q0 22.857143-16 38.857143l-413.714286 413.714286-77.714286 77.714286q-16 16-38.857142 16t-38.857143-16l-77.714286-77.714286-206.857143-206.857143q-16-16-16-38.857143t16-38.857143l77.714286-77.714285q16-16 38.857143-16t38.857143 16l168 168.571428 374.857142-375.428571q16-16 38.857143-16t38.857143 16l77.714286 77.714286q16 16 16 38.857142z" p-id="8179" fill="#31b77a"></path></svg>';
    jQuery("#checkitsright").append(rsvgstr);
    //jQuery("#checkinfo").append('<button type="button" class="" id="checkitskuoda" style="line-height: 25px;">扩大</button>');
    jQuery("#checkinfo").append('<button type="button" class="" id="checkitswrong" style="margin-left:12px;">错误</button>');
    let wsvgstr='<svg t="1627891766395" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8385" width="16" height="16"><path d="M851.428571 755.428571q0 22.857143-16 38.857143l-77.714285 77.714286q-16 16-38.857143 16t-38.857143-16l-168-168-168 168q-16 16-38.857143 16t-38.857143-16l-77.714285-77.714286q-16-16-16-38.857143t16-38.857142l168-168-168-168q-16-16-16-38.857143t16-38.857143l77.714285-77.714286q16-16 38.857143-16t38.857143 16l168 168 168-168q16-16 38.857143-16t38.857143 16l77.714285 77.714286q16 16 16 38.857143t-16 38.857143l-168 168 168 168q16 16 16 38.857142z" p-id="8386" fill="#d81e06"></path></svg>';
    jQuery("#checkitswrong").append(wsvgstr);
    //jQuery("#checkinfo").append('<button type="button" class="" id="checkitsbuquan" style="line-height: 25px;">不全</button>');
   jQuery("#checkinfo").append('<button type="button" class="" id="savebtn" style="margin-left:48px;">导出</button>');
    var savebtnstr='<svg t="1627183789230" class="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8182" width="16" height="16"><path d="M768 768q0-14.857143-10.857143-25.714286t-25.714286-10.857143-25.714285 10.857143-10.857143 25.714286 10.857143 25.714286 25.714285 10.857143 25.714286-10.857143 10.857143-25.714286z m146.285714 0q0-14.857143-10.857143-25.714286t-25.714285-10.857143-25.714286 10.857143-10.857143 25.714286 10.857143 25.714286 25.714286 10.857143 25.714285-10.857143 10.857143-25.714286z m73.142857-128v182.857143q0 22.857143-16 38.857143t-38.857142 16H91.428571q-22.857143 0-38.857142-16t-16-38.857143v-182.857143q0-22.857143 16-38.857143t38.857142-16h265.714286l77.142857 77.714286q33.142857 32 77.714286 32t77.714286-32l77.714285-77.714286h265.142858q22.857143 0 38.857142 16t16 38.857143z m-185.714285-325.142857q9.714286 23.428571-8 40l-256 256q-10.285714 10.857143-25.714286 10.857143t-25.714286-10.857143L230.285714 354.857143q-17.714286-16.571429-8-40 9.714286-22.285714 33.714286-22.285714h146.285714V36.571429q0-14.857143 10.857143-25.714286t25.714286-10.857143h146.285714q14.857143 0 25.714286 10.857143t10.857143 25.714286v256h146.285714q24 0 33.714286 22.285714z" p-id="8183"></path></svg>';
    jQuery("#savebtn").append(savebtnstr);
    //console.log("insert upbtnbar suc!");
}


function writedb(arr,callback){ //indexdb
    /*创建indexdb*/
    var request = indexedDB.open("zhijiandb", 1);
    request.onerror = function(e) {
        console.log(e.currentTarget.error.message);
    };

    request.onsuccess = function(e) {
       var db = e.target.result;
        console.log('成功打开DB');
    };

    request.addEventListener('upgradeneeded', e => {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('xpathzj')) {
            console.log("我需要创建一个新的存储对象");
            //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
            var objectStore = db.createObjectStore('xpathzj', {
                keyPath: "id",
                autoIncrement: false
            });
            console.log('创建对象仓库成功');
        }
    });
    request.addEventListener('success', e => {
        var db = e.target.result;
        let countsuc = 0;
        for (let i in arr){
            var tx = db.transaction('xpathzj', 'readwrite');
            var store = tx.objectStore('xpathzj');
            //console.log(typeof arr[i]);
            let jsonobj = str2json(arr[i]);
            if (jsonobj.id) {
                var reqAdd = store.add({
                    'id': jsonobj.id,
                   'userarr': jsonobj.userarr,
                    'contentarr': jsonobj.contentarr,
                    't':jsonobj.t,
                    'author':jsonobj.author,
                    'day':jsonobj.day,
                    'checkinfo':jsonobj.checkinfo
                });
                reqAdd.addEventListener('success', e => {
                    countsuc +=1;
                    //jQuery("#localinfo").html("正在导入数据，请勿关闭页面"+(parseInt(i)+1)+"/"+arr.length);
                    jQuery("#localinfo").html("成功导入"+countsuc+"/"+arr.length+"条数据");
                })
                reqAdd.addEventListener('error', err => {
                    //counterr += 1;
                })
            }
        }
        if(typeof callback ==="function"){callback(countsuc)}
    });
}

function readdb(id,callback){
    var request = indexedDB.open("zhijiandb", 1);

    request.addEventListener('upgradeneeded', e => {
        var db = e.target.result;
        if (!db.objectStoreNames.contains('xpathzj')) {
            console.log("我需要创建一个新的存储对象");
            //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
            var objectStore = db.createObjectStore('xpathzj', {
                keyPath: "id",
                autoIncrement: false
            });
            console.log('创建对象仓库成功');
        }
    });


    request.addEventListener('success', e => {
        var db = e.target.result;
        var tx = db.transaction('xpathzj', 'readwrite');
        var store = tx.objectStore('xpathzj');
        var reqGet = store.get(id);
        reqGet.addEventListener('success', e => {
            //console.log(reqGet.result);
            let reobj = reqGet.result;
            //return(reobj);
            if (typeof callback ==="function") {
                callback(reobj);
            }
        })
        var allRecords = store.getAll();
        allRecords.onsuccess = function() {
            //console.log(allRecords.result.length);
            jQuery("#localinfo").html("共"+allRecords.result.length+"条数据");
        };
    });

}

function updatedb(pageid,checkinfo,callback){
    var request = indexedDB.open("zhijiandb", 1);
    request.onsuccess = function(e) {
        var db = e.target.result;
        //console.log('成功打开DB');
        var transaction = db.transaction('xpathzj', 'readwrite');
        var store = transaction.objectStore('xpathzj');
        var reqUp = store.get(pageid);
        reqUp.onsuccess = function(e) {
            var data = e.target.result;
            //for (a in newData) {
            //除了keypath之外
            //    data.a = newData.a;
            //}
            console.log(data);
            data.checkinfo = checkinfo;
            data.checkday = day;
            store.put(data);
            if (typeof callback ==="function") {
                callback(reobj);
            }
            if ("right"==checkinfo) jQuery("#checkinfouserpanel").html("质检标记为正确");
            if ("wrong"==checkinfo) jQuery("#checkinfouserpanel").html("质检标记为错误");
            if ("kuoda"==checkinfo) jQuery("#checkinfouserpanel").html("质检标记为扩大");
            if ("buquan"==checkinfo) jQuery("#checkinfouserpanel").html("质检标记为不全");
        };
    };
}

function downloadfunction(callback){
    var request = indexedDB.open("zhijiandb", 1);
    request.onsuccess = function(e) {
        var db = e.target.result;
        var transaction = db.transaction('xpathzj');
        var store = transaction.objectStore('xpathzj');
        var reqCur = store.openCursor();//打开游标
        var dataList = new Array();
        let txt ="";
        var i = 0;
        reqCur.onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                //console.log(cursor.key);
                dataList[i] = cursor.value;
                //console.log(dataList[i].checkinfo);
                if(dataList[i].checkday==day){
                    txt+=dataList[i].id+"\t"+dataList[i].userarr+"\t"+dataList[i].contentarr+"\t"+dataList[i].t+"\t"+dataList[i].author+"\t"+dataList[i].day+"\t"+dataList[i].checkinfo+"\n";
                }
                i++;
                cursor.continue();
            }else{
                //data = dataList;
                if (typeof callback ==="function") {
                    callback(txt);
                }
            }
        };
        //console.log(txt);
    }
}

/*下载*/
function download(filename,content,contentType) {
    if (!contentType) contentType = 'application/octet-stream';
    var a = document.createElement('a');
    var blob = new Blob([content], { 'type': contentType });
    a.href = window.URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    /*var uri = new Blob(['\ufeff' + content], {type:"text/csv,charset=UTF-8"});
    var link = document.createElement("a");
    //link.href = uri;
    link.href = URL.createObjectURL(uri);
    link.style = "visibility:hidden";
    link.download = filename ;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);*/
}

/*获取当前时间*/
function currentTime(){
    var d = new Date(),str = '';
    //str += d.getFullYear()+'年';
    str  += (d.getMonth() + 1 <10)?'0'+(d.getMonth() + 1)+'月':d.getMonth() + 1+'月';
    str  += (d.getDate()<10)?'0'+d.getDate()+'日':d.getDate()+'日';
    str += d.getHours()+'时';
    str  += d.getMinutes()+'分';
    str+= d.getSeconds()+'秒';
    return str;
}
