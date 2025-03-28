//$(document).ready(function() {
    function getHash() {
        if (location.hash)
            return location.hash.substring(1);
        return '';
    }
    function getSearch() {
        if (location.search)
            return location.search.substring(3);
        return '';
    }
    //常用变量
    var soinput_obj = $('#soinput'),
        objProgress = $('div.progress>div'),
        obja = $('#a'),
        objb = $('#b'),
        objc = $('#c'),
        obj_autoSO = $('#autoSO'),
        autoSO = false;
    var need_respond = true;
    var obj_list1_buttons = $("td.set-list-1 button"),
        obj_list2_buttons = $("td.set-list-2 button");
        obj_list3_buttons = $("td.set-list-3 button");
    var set_url = [],
        set_top = [0, 0],
        set_left = [0, 0],
        set_foot = [0, 0];
    load_local();
    load_allso_state();
    respond(); //启动后的第一次响应式
    if (localStorage["allso_autoSO"] === undefined) {
        localStorage["allso_autoSO"] = false;
        obj_autoSO[0].checked = false;
        autoSO = false;
    } else {
        obj_autoSO[0].checked = localStorage["allso_autoSO"] === 'true';
        autoSO = obj_autoSO[0].checked;
    }
    /* 设置搜索引擎 */
    function load_local() {
        if (localStorage["allso_0"] == undefined) {
            set(0, 1);
            obj_list1_buttons.eq(3).removeClass("btn-default").addClass("btn-success");
        } else {
            set(0, localStorage["allso_0"]);
            obj_list1_buttons.eq(localStorage["allso_0"]).removeClass("btn-default").addClass("btn-success");
        }
        if (localStorage["allso_1"] == undefined) {
            set(1, 0);
            obj_list2_buttons.eq(1).removeClass("btn-default").addClass("btn-success");
        } else {
            set(1, localStorage["allso_1"]);
            obj_list2_buttons.eq(localStorage["allso_1"]).removeClass("btn-default").addClass("btn-success");
        }
        if (localStorage["allso_2"] == undefined) {
            set(2, 4);
            obj_list3_buttons.eq(3).removeClass("btn-default").addClass("btn-success");
        } else {
            set(2, localStorage["allso_2"]);
            obj_list3_buttons.eq(localStorage["allso_2"]).removeClass("btn-default").addClass("btn-success");
        }
    }
    //load_local();
    function set(a0b1, set_so) {
        localStorage["allso_" + a0b1] = set_so;
        if (set_so == 0) {
            set_url[a0b1] = "https://www.baidu.com/s?wd=";
            set_top[a0b1] = -55;
            set_left[a0b1] = -100;
            set_foot[a0b1] = 70;
        } else if (set_so == 1) {
            set_url[a0b1] = "https://www.so.com/s?ie=utf-8&fr=360sou_newhome&src=360sou_newhome&q=";
            set_top[a0b1] = -60;
            set_left[a0b1] = -90;
            set_foot[a0b1] = 80;
        } else if (set_so == 2) {
            set_url[a0b1] = "https://cn.bing.com/search?setmkt=zh-cn&setlang=zh-cn&q=";
            set_top[a0b1] = -95;
            set_left[a0b1] = -0;
            set_foot[a0b1] = 60;
        } else if (set_so == 3) {
            set_url[a0b1] = "https://so.toutiao.com/search?dvpf=pc&source=input&keyword=";
            set_top[a0b1] = -65;
            set_left[a0b1] = -135;
            set_foot[a0b1] = 80;
        } else if (set_so == 4) {
            set_url[a0b1] = "https://www.google.com/search?newwindow=1&q=";
            set_top[a0b1] = -85;
            set_left[a0b1] = 0;
            set_foot[a0b1] = 120;
        } else if (set_so == 5) {
            set_url[a0b1] = "https://www.sogou.com/web?query=";
            set_top[a0b1] = -55;
            set_left[a0b1] = -100;
            set_foot[a0b1] = 80;
        }
        need_respond = true;
    }
    //设置按钮点击后颜色变化
    obj_list1_buttons.click(function () {
        obj_list1_buttons.removeClass("btn-success").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-success");
    });
    obj_list2_buttons.click(function () {
        obj_list2_buttons.removeClass("btn-success").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-success");
    });
    obj_list3_buttons.click(function () {
        obj_list3_buttons.removeClass("btn-success").addClass("btn-default");
        $(this).removeClass("btn-default").addClass("btn-success");
    });
    // 实时搜索开关
    obj_autoSO.change(function () {
        localStorage['allso_autoSO'] = this.checked;
        autoSO = this.checked;
    });
    /* 响应 Hash */
    if (location.hash) {
        var hash = getHash();
        hash = decodeURIComponent(hash).replace(/\+/g, ' ');
        soinput_obj[0].value = hash;
        so();
    }
    /* 	    if (getSearch()) {
            var query = getSearch();
            query = decodeURIComponent(query);
            soinput_obj[0].value = query;
            console.log(query);
            //so();
        }*/
    /* 窗口状态加载 0:三分 1:只显示第一家引擎 2:只显示第2家引擎 3:只显示第3家引擎 */
    function load_allso_state() {
        if (localStorage["allso_state"] == undefined)
            localStorage["allso_state"] = 0;
    }
    /*状态点击改变*/
    function change_state(state) {
        if (localStorage["allso_state"] != state)
            localStorage["allso_state"] = state;
        else
            localStorage["allso_state"] = 0;
        respond();
    }
    /* 响应式 */
    $(window).resize(function () {
        respond();
    });
    respond();
    function respond() {
        var winw = $('body').width(),
            winh = $(window).height(),
            navh = $("header").height(),
            abx = winw / 3;
        if (localStorage["allso_state"] == 0) {
            obja.fadeIn('fast').animate({
                "margin-left": set_left[0],
                "width": abx - set_left[0]
            }, 'fast');
            objb.fadeIn('fast').animate({
                "margin-left": abx + set_left[1],
                "width": abx - set_left[1]
            }, 'fast');
            objc.fadeIn('fast').animate({
                "margin-left": 2 * abx + set_left[2],
                "width": abx - set_left[2]
            }, 'fast');
            objProgress[0].style.width = '34%';
            objProgress[1].style.width = '33%';
            objProgress[2].style.width = '33%';
        } else if (localStorage["allso_state"] == 1) {
            obja.fadeIn('fast').animate({
                "margin-left": set_left[0] - set_left[0],
                "width": winw - set_left[0]
            }, 'fast');
            objb.fadeOut('fast');
            objc.fadeOut('fast');
            objProgress[0].style.width = '50%';
            objProgress[1].style.width = '25%';
            objProgress[2].style.width = '25%';
        } else if (localStorage["allso_state"] == 2) {
            obja.fadeOut('fast');
            objb.fadeIn('fast').animate({
                "margin-left": set_left[1],
                "width": winw - set_left[0]
            }, 'fast');
            objc.fadeOut('fast');
            objProgress[0].style.width = '25%';
            objProgress[1].style.width = '50%';
            objProgress[2].style.width = '25%';
        } else {
            obja.fadeOut('fast');
            objb.fadeOut('fast');
            objc.fadeIn('fast').animate({
                "margin-left": set_left[2],
                "width": winw - set_left[0]
            }, 'fast');
            objProgress[0].style.width = '25%';
            objProgress[1].style.width = '25%';
            objProgress[2].style.width = '50%';
        }
        obja.animate({
            "margin-top": set_top[0] + navh,
            "height": winh - set_top[0] - navh + set_foot[0]
        }, 'fast');
        objb.animate({
            "margin-top": set_top[1] + navh,
            "height": winh - set_top[1] - navh + set_foot[1]
        }, 'fast');
        objc.animate({
            "margin-top": set_top[2] + navh,
            "height": winh - set_top[2] - navh + set_foot[2]
        }, 'fast');
        need_respond = false;
    }
    $('.quickdelete').click(function () {
        $("#soinput").val("").focus();
    });
    /* 搜索按钮事件 */
    soinput_obj.on('input', function () {
        if (autoSO) so();
    });
    function so() {
        if ($.trim(soinput_obj[0].value) !== '') {
            var sowhat_str = soinput_obj[0].value,
                sowhat = encodeURIComponent(sowhat_str);
            if (obja[0].src) {
                location.hash = sowhat; //sowhat_str;
                window.document.title = sowhat_str + ' - 对比搜索';
                location.reload();
                return;
            }
            obja[0].src = set_url[0] + sowhat;
            objb[0].src = set_url[1] + sowhat;
            objc[0].src = set_url[2] + sowhat;
            location.hash = sowhat; //sowhat_str;
            window.document.title = sowhat_str + ' - 对比搜索';
        } else {
            location.hash = '';
            window.document.title = '对比搜索';
        }
        if (need_respond)
            respond();
        objProgress.addClass('progress-bar-striped active');
        window.setTimeout(function () {
            objProgress.removeClass('progress-bar-striped active');
        }, 2000);
    }
    //console.log(localStorage["allso_state"]);
    $('div.spinner').fadeOut('fast');
//});
