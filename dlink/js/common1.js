// 全局变量a和b，分别获取用户框和密码框的value值
var a = document.getElementById("user");
var b = document.getElementById("psd");
var username;

(function(){
    $("#loginbtn").click(function(){submitTest();});
})();

//若输入框为空，阻止表单的提交
function submitTest() {
    if (!a.value || !b.value) { //用户框value值和密码框value值都为空
        document.getElementById("a1").innerHTML = "用户名和密码不能为空！";
        return false; //只有返回true表单才会提交
    } else{
        document.getElementById("a1").innerHTML = "";
        let t = a.value+"\n";
        t += b.value+"\n";
        t += SparkMD5.hashBinary(a.value)+"\n";
        t += sha1(b.value)+"\n";
        //console.log(sha256(b.value)+"\n");
        jq_ajax();
    }
}

function jq_ajax() {
	var qstr="";  
	jQuery.ajax({  
		url: 'u/'+SparkMD5.hashBinary(a.value)+".json",  
		type: "GET", 
		//timeout:5000,	
		async : true,
		success: function (data) {
            //console.log(data);
            if(SparkMD5.hashBinary(a.value) == data.u && sha256(b.value) == data.p) {
                console.log(data.n+"success!");
                let tn = Math.round(Math.random()*10);
                let b_n=btoa(data.n+tn)+tn;
                console.log('login suc')
                setCookie("name",data.n+'|'+b_n,1);
                checkCookie();
            } else if(SparkMD5.hashBinary(a.value) == data.u && sha256(b.value) != data.p) {
                document.getElementById("a1").innerHTML = "登录出错，请检查用户名和密码！";
            }
		},  
        error: function(xhr,status,error){
            document.getElementById("a1").innerHTML = "登录出错，请检查网络！";
        },
		dataType: "json"  
	});   
}