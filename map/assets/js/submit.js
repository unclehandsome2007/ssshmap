var code = '<span class="image main" id="result"><label>步驟{{step}}</label><p>{{content}}</p></span><span class="map_real_photo image main result_img{{count}}" id="result_img"></span>';
var code_result_img = '<img src="{{link}}">'
var code_img = '<span class="image main" id="result_img"><img src="{{link}}"></span>';
var code_loading = '<div class="spinner"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
var code_loadingDiv = '<div aria-hidden="true" style="z-index: 1000; position: fixed; inset: 0px; background-color: rgba(255, 255, 255, 1); -webkit-tap-highlight-color: transparent;"></div><div class="spinner" style="z-index: 1000; position:fixed; top:30%;right:0;left:0;"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
var announcement_top_code = '<div id="hellobar-bar" class="regular closable"><div class="hb-content-wrapper"><div class="hb-text-wrapper"><div class="hb-headline-text"><p><span>{{announcement_text}}</span></p></div></div><a href="{{link}}" target="_blank" class="hb-cta hb-cta-button"><div class="hb-text-holder"><p>{{button_text}}</p></div></a></div><div class="hb-close-wrapper"><a onclick="close_announcement()" class="icon-close">&#10006;</a></div></div>'
var tmp2 = '';
var tmp3 = '';
var tmp4 = '';
var code_select = '<option value="{{code}}">{{name}}</option>';
var code_select_group = '<optgroup label="{{name}}">';
var tmp5 = '';
async function replace_img(list1) {
    for (var i = 1; i < list1.length; i++) {
        if (list1[i] != "" || null) {
            const fileRef = firebase.storage().ref("steps/" + list1[i])
            list1[i] = await fileRef.getDownloadURL()
            $(".result_img" + i).html(code_result_img.replace("{{link}}", list1[i]));
        }
    }
    return list1
}

function submit() {
    var dbRef = firebase.database();
    var mapcode1 = document.getElementById("code1").value;
    var mapcode2 = document.getElementById("code2").value;
    var mapcode = mapcode1 + mapcode2;
    if (mapcode1 == "") {
        alert("請選擇起始點");
    } else if (mapcode2 == "") {
        alert("請選擇目的地")
    }
    else {
        $("#loading_div").html(code_loadingDiv)
        // 標題
        dbRef.ref('/mapdata/' + mapcode + "/title").on('value', e => {
            var tmp = e.val();
            $("#title").html('<h3>' + tmp + '</h3>')
        });
        // 內容
        dbRef.ref('/mapdata/' + mapcode + "/text").on('value', e => {
            var tmp = e.val();
            $("#search").html("");
            $("#result").html(tmp);
            $("#search_button").html('<button onclick="main()">返回查詢</button>')
        });


        dbRef.ref('/mapdata/' + mapcode + "/steps_num").on('value', e => {
            steps_num = e.val();
            $("#result").html("")
            var count = 1;
            const list1 = [null];
            for (var i = 1; i < steps_num + 1; i++) {
                dbRef.ref('/mapdata/' + mapcode + "/steps/" + i).on('value', g => {
                    tmp2 = code;
                    tmp2 = tmp2.replace("{{step}}", count);
                    tmp2 = tmp2.replace("{{count}}", count);
                    tmp2 = tmp2.replace("{{content}}", g.val());
                    count = count + 1;
                    $("#result_content").append(tmp2);

                })
                dbRef.ref('/mapdata/' + mapcode + "/steps_img/" + i).on('value', j => {
                    list1.push(j.val());
                    if (list1.length == e.val() + 1) {
                        replace_img(list1);
                    }
                })
            };
            $("#loading_div").html("")
        });


    }
};
function main() {
    location.replace("index.html")
}
function onload() {
    var dbRef = firebase.database();
    dbRef.ref('/setting/locate-select/start_list').on('value', e => {
        var start_list= e.val().split(",");
        for (i = 0; i < start_list.length; i++) {
            dbRef.ref('/setting/locate-select/start/' + start_list[i] + '/name').on('value', f => {
                tmp5 = code_select;
                tmp5 = tmp5.replace("{{name}}", f.val())
            });
            dbRef.ref('/setting/locate-select/start/' + start_list[i] + '/value').on('value', f => {
                if (f.val() == "disabled") {
                    tmp5 = tmp5.replace('<option value="{{code}}">','<optgroup label="')
                    tmp5 = tmp5.replace('</option>','">')
                    $("#code1").append(tmp5);
                }
                else {
                    tmp5 = tmp5.replace("{{code}}", f.val())
                    $("#code1").append(tmp5);
                }

            });
        }  
    });
    dbRef.ref('/setting/locate-select/end_list').on('value', e => {
        var end_list= e.val().split(",");
        for (i = 0; i < end_list.length; i++) {
            dbRef.ref('/setting/locate-select/end/' + end_list[i] + '/name').on('value', f => {
                tmp5 = code_select;
                tmp5 = tmp5.replace("{{name}}", f.val())
            });
            dbRef.ref('/setting/locate-select/end/' + end_list[i] + '/value').on('value', f => {
                if (f.val() == "disabled") {
                    tmp5 = tmp5.replace('<option value="{{code}}">','<optgroup label="')
                    tmp5 = tmp5.replace('</option>','">')
                    $("#code2").append(tmp5);
                }
                else {
                    tmp5 = tmp5.replace("{{code}}", f.val())
                    $("#code2").append(tmp5);
                }

            });
        }  
    });
    dbRef.ref('/setting/announcement/open').on('value', e => {
        if (e.val()) {
            dbRef.ref('/setting/announcement/announcement_map_title').on('value', g => {
                tmp3 = announcement_top_code;
                tmp3 = tmp3.replace("{{announcement_text}}", g.val());

            });
            dbRef.ref('/setting/announcement/button_text').on('value', h => {
                tmp3 = tmp3.replace("{{button_text}}", h.val());
            });
            dbRef.ref('/setting/announcement/link').on('value', i => {
                tmp3 = tmp3.replace("{{link}}", i.val());
                $("#announcement_top").html(tmp3);
            });
        }
    });
    // 帳密登入
    if ($.cookie('user') != null || $.cookie('password') != null) {
        var account = $.cookie("user")
        var password = $.cookie("password")
        dbRef.ref('/account/users/' + account + '/password').on('value', e => {
            if (e.val() == null || account == null || password == null
            ) {
                $('#login_btn').html('<a href="login.html" class="button small primary" style="position: relative;margin-left:80%;">登入</a>')
                check_role(null)
            }
            else if (e.val() != password) {
                $('#login_btn').html('<a href="login.html" class="button small primary" style="position: relative;margin-left:80%;">登入</a>')
                check_role(null)
            }
            else {
                dbRef.ref('/account/users/' + account + '/name').on('value', g => {
                    $('#login_btn').html('<a href="logout.html" class="button small primary" style="position: relative;margin-left:80%;">登出</a>')
                    $("#login_info").append("目前登入帳號: " + g.val() + ' (' + account + ')')
                    dbRef.ref('/account/users/' + account + "/role").on('value', i => {
                        if (i.val() == "admin" || i.val() == "editor") {
                            $("#login_info").append('<br><br><a href="admin/" class="button small primary" target="_blank">管理後臺</a>')
                        }
                        check_role(i.val())
                    })
                });
            }
        });
    }
    else {
        $('#login_btn').html('<a href="login.html" class="button small primary" style="position: relative;margin-left:80%;">登入</a>')
        check_role(null)
    }
}
function check_role(role) {
    var dbRef = firebase.database();
    dbRef.ref('/setting/open').on('value', e => {
        if (e.val() == false && role != "admin" && role != "editor" && role != "beta-user") {
            $("#search").html('<h2>管理員尚未開放</h2><h2>若有錯誤請聯繫管理員</h2>')
        }
        $("#loading_div").html("")
    });
}
function close_announcement() {
    $("#announcement_top").html("");
}

function change_map() {
    $(".map_img").html(code_loading)
    setTimeout(map_check, 100);
}
function map_check() {
    var method = $("input[name='map_check']:checked").val();
    // Get網址
    const fileRef = firebase.storage().ref("maps/" + method + ".png")
    fileRef.getDownloadURL().then(function (url) {
        tmp4 = code_img.replace("{{link}}", url)
        $(".map_img").html(tmp4)
    })

}