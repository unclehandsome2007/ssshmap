var mapcode = "";
var steps_num = "";
var code = '<label>步驟{{step}}</label><input type="text" id="text{{step2}}"><label>步驟{{step3}}圖片位置</label><input type="text" id="img{{step4}}">';
var admin_web_setting_btn_code = '<a href="setting.html" class="button big primary" target="_blank">全網站設定</a><br>'
var admin_user_manage_btn_code = '<a href="user-manage.html" class="button big primary" target="_blank">使用者管理</a><br>'
var admin_map_edit_btn_code = '<a href="map-edit.html" class="button big primary" target="_blank">地圖內容修改</a><br>'
var admin_upload_btn_code = '<a href="upload.html" class="button big primary" target="_blank">圖片上傳系統</a><br>'
var admin_map_select_btn_code = '<a href="map-select.html" class="button big primary" target="_blank">前台選單修改</a><br>'
var tmp2 = '';
$("#submit").click(function () {
    var dbRef = firebase.database();
    mapcode = document.getElementById("code").value;
    var steps_num = 0;
    if (mapcode == "") {
        alert("請輸入代碼");
    }
    else {
        // 標題
        dbRef.ref('/mapdata/' + mapcode + "/title").on('value', e => {
            var tmp = e.val();
            $("#title_div").html('<h2>標題</h2><input type="text" id="title">')
            $("#title").val(tmp)
            $("#submit_div").html('<button onclick="add_step()">+</button><span>  </span><button onclick="del_step()">-</button><span>  </span><button onclick="edit_ok()">確定修改</button>')
        });
        // 內容
        dbRef.ref('/mapdata/' + mapcode + "/steps_num").on('value', e => {
            steps_num = e.val();
            $("#text").html("")
            var count = 1;
            var count2 = 1;
            for (var i = 1; i < steps_num + 1; i++) {
                tmp2 = code;
                tmp2 = tmp2.replace("{{step}}", i);
                tmp2 = tmp2.replace("{{step2}}", i);
                tmp2 = tmp2.replace("{{step3}}", i);
                tmp2 = tmp2.replace("{{step4}}", i);
                $("#text").append(tmp2);

                dbRef.ref('/mapdata/' + mapcode + "/steps/" + i).on('value', g => {
                    $("#text" + count).val(g.val());
                    count = count + 1;
                })
                dbRef.ref('/mapdata/' + mapcode + "/steps_img/" + i).on('value', g => {
                    $("#img" + count2).val(g.val());
                    count2 = count2 + 1;
                })
            };
        });


    }
});

function edit_ok() {
    var yes = confirm('您確定修改嗎?');
    if (yes) {
        var dbRef = firebase.database();
        dbRef.ref('/mapdata/' + mapcode + "/title").set($("#title").val());
        dbRef.ref('/mapdata/' + mapcode + "/steps_num").on('value', e => {
            steps_num = e.val();
            for (var i = 1; i < steps_num + 1; i++) {
                dbRef.ref('/mapdata/' + mapcode + "/steps/" + i).set($("#text" + i).val());
                dbRef.ref('/mapdata/' + mapcode + "/steps_img/" + i).set($("#img" + i).val());
            };
        });
        alert("已修改存檔!");
    }
}

function add_step() {
    var dbRef = firebase.database();
    dbRef.ref('/mapdata/' + mapcode + "/steps_num").on('value', e => {
        steps_num = e.val();
        for (var i = 1; i < steps_num + 1; i++) {
            dbRef.ref('/mapdata/' + mapcode + "/steps/" + i).set($("#text" + i).val());
            dbRef.ref('/mapdata/' + mapcode + "/steps_img/" + i).set($("#img" + i).val());
        };
    });
    dbRef.ref('/mapdata/' + mapcode + "/steps_num").once('value', e => {
        dbRef.ref('/mapdata/' + mapcode + "/steps_num").set(e.val() + 1);
    });
}

function del_step() {
    var dbRef = firebase.database();
    var yes = confirm('確定刪除嗎?將會刪除<<最後一個步驟>><<最後一個步驟>>');
    if (yes) {
        dbRef.ref('/mapdata/' + mapcode + "/steps_num").on('value', e => {
            steps_num = e.val();
            for (var i = 1; i < steps_num + 1; i++) {
                dbRef.ref('/mapdata/' + mapcode + "/steps/" + i).set($("#text" + i).val());
                dbRef.ref('/mapdata/' + mapcode + "/steps_img/" + i).set($("#img" + i).val());
            };
        });
        dbRef.ref('/mapdata/' + mapcode + "/steps_num").once('value', e => {
            dbRef.ref('/mapdata/' + mapcode + "/steps_num").set(e.val() - 1);
            dbRef.ref('/mapdata/' + mapcode + "/steps/" + e.val()).remove();
            dbRef.ref('/mapdata/' + mapcode + "/steps_img/" + e.val()).remove();
        });
    }
}

function onload() {
    // 網站開啟
    var dbRef = firebase.database();
    dbRef.ref('/setting/open').once('value', e => {
        if (e.val()) {
            $("#change_open").html("開放中")
        }
        else {
            $("#change_open").html("關閉中")
        }
    });
    // 公告區塊
    dbRef.ref('/setting/announcement/open').once('value', e => {
        if (e.val()) {
            $("#change_announcement_open").html("已開啟公告")
        }
        else {
            $("#change_announcement_open").html("已關閉公告")
        }
    });
    // 公告設定匯入
    dbRef.ref('/setting/announcement/announcement_map_title').on('value', e => {
        $("#announcement_map_title").val(e.val())
    });
    dbRef.ref('/setting/announcement/button_text').on('value', e => {
        $("#announcement_button_text").val(e.val())
    });
    dbRef.ref('/setting/announcement/link').on('value', e => {
        $("#announcement_link").val(e.val())
    });
    // 帳密輸入
    if ($.cookie('user') == null || $.cookie('password') == null) {
        window.location.href = "../login.html"
    }
    else {
        var account = $.cookie("user")
        var password = $.cookie("password")
        dbRef.ref('/account/users/' + account + '/password').on('value', e => {
            if (e.val() == null || account == null || password == null
            ) {
                location.replace("../index.html")
            }
            else if (e.val() != password) {
                location.replace("../index.html")
            }
            else {
                dbRef.ref('/account/users/' + account + "/role").on('value', i => {
                    if(i.val()=="admin"){
                        dbRef.ref('/account/users/' + account + '/name').on('value', g => {
                            $('#login_info').html("目前登入帳號: " + g.val() + ' (' + account + ')')
                            $('#logout').html('<a href="../logout.html" class="button small primary">登出</a><span> </span><a href="../" class="button small primary">回前台</a>')
                            $('#admin-btn').html(admin_map_edit_btn_code+admin_upload_btn_code+admin_user_manage_btn_code+admin_web_setting_btn_code+admin_map_select_btn_code)
                        });
                    }
                    else if(i.val()=="editor"){
                        dbRef.ref('/account/users/' + account + '/name').on('value', g => {
                            $('#login_info').html("目前登入帳號: " + g.val() + ' (' + account + ')')
                            $('#logout').html('<a href="../logout.html" class="button small primary">登出</a><span> </span><a href="../" class="button small primary">回前台</a>')
                            $('#admin-btn').html(admin_map_edit_btn_code+admin_upload_btn_code)
                        });
                    }
                    else{
                        location.replace("../index.html")
                    }
                })
                
            }
        });
    }

}

function change_open() {
    var dbRef = firebase.database();
    var yes = confirm('確定要修改嗎?');
    if (yes) {
        dbRef.ref('/setting/open').once('value', e => {
            if (e.val()) {
                dbRef.ref("/setting/open").set(false);
                $("#change_open").html("關閉中")
            }
            else {
                dbRef.ref("/setting/open").set(true);
                $("#change_open").html("開放中")
            }
        });
    }
}

function change_announcement_open() {
    var dbRef = firebase.database();
    var yes = confirm('確定要修改嗎?');
    if (yes) {
        dbRef.ref('/setting/announcement/open').once('value', e => {
            if (e.val()) {
                dbRef.ref("/setting/announcement/open").set(false);
                $("#change_announcement_open").html("已關閉公告")
            }
            else {
                dbRef.ref("/setting/announcement/open").set(true);
                $("#change_announcement_open").html("已開啟公告")
            }
        });
    }

}

function announcement_submit() {
    var dbRef = firebase.database();
    var yes = confirm('您確定修改嗎?');
    if (yes) {
        dbRef.ref('/setting/announcement/announcement_map_title').set($("#announcement_map_title").val());
        dbRef.ref('/setting/announcement/button_text').set($("#announcement_button_text").val());
        dbRef.ref('/setting/announcement/link').set($("#announcement_link").val());
        alert("已修改存檔!");
    }
}

function logout() {
    location.replace("../logout.html")
}