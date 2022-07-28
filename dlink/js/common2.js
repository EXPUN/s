function setCookie(cname,cvalue,exdays){
    var d = new Date();
    d.setTime(d.getTime()+(exdays*24*60*60*1000));
    var expires = "expires="+d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
function getCookie(cname){
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
    }
    return "";
}
function checkCookie(){
    var user=getCookie("name");
    if (user!=""){
        let t_u = user.split('|');
        let t_u1=t_u[1].replace(/^.*(.)$/,"$1");
        if (btoa(t_u[0]+t_u1)+t_u1 == t_u[1]){
            //console.log("欢迎 " + t_u[0] + " 再次访问");
            myid = t_u[0];
            if(window.location.pathname.match("login.html")) window.location.href="./deadhost.html";
        }else{
            //console.log(t_u[0]);
            //console.log(t_u[1]);
            //console.log(btoa(t_u[0]+t_u1)+t_u1);
            if(!window.location.pathname.match("login.html")) window.location.href="./login.html";
        }
    }
    else {
        //console.log("未登录");
        if(!window.location.pathname.match("login.html")) window.location.href=`./login.html?ref=${window.location.pathname}`;
    }
}
