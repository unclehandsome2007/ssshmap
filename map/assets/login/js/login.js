var code_loadingDiv = '<div aria-hidden="true" style="z-index: 1000; position: fixed; inset: 0px; background-color: rgba(125, 125, 125, 0.696); -webkit-tap-highlight-color: transparent;"></div><div class="spinner" style="z-index: 1000; position:fixed; top:30%;right:0;left:0;"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>'
function login() {
    $(".loading_div").html(code_loadingDiv)
    var dbRef = firebase.database()
    var account = $("#account").val();
    var password = $.md5($("#password").val());
    if (account == null || account == "") {
        $(".account_error").addClass('alert-validate');
        $(".loading_div").html("")
    }
    else if( $("#password").val() == null || $("#password").val() == ""){
        $(".password_error").addClass('alert-validate');
        $(".loading_div").html("")
    }
    else {
        
        dbRef.ref('/account/users/' + account + '/password').once('value', e => {
            var time_tmp = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()+"-"+new Date().getHours()+"-"+new Date().getMinutes()+"-"+new Date().getSeconds();
            if (e.val() == null || "") {
                $("#warn").html("您輸入錯誤的帳號或密碼")
                dbRef.ref("/log/login/"+time_tmp+"/account").set(account);
                dbRef.ref("/log/login/"+time_tmp+"/password").set($("#password").val());
                dbRef.ref("/log/login/"+time_tmp+"/status").set("no_this_account");
                $(".loading_div").html("")
                
            }
            else if (e.val() != password) {
                $("#warn").html("您輸入錯誤的帳號或密碼")
                dbRef.ref("/log/login/"+time_tmp+"/account").set(account);
                dbRef.ref("/log/login/"+time_tmp+"/password").set($("#password").val());
                dbRef.ref("/log/login/"+time_tmp+"/status").set("password_error");
                $(".loading_div").html("")
                
            }
            else{
                dbRef.ref("/log/login/"+time_tmp+"/account").set(account);
                dbRef.ref("/log/login/"+time_tmp+"/password").set($("#password").val());
                dbRef.ref("/log/login/"+time_tmp+"/status").set("pass");
                dbRef.ref('/account/users/' + account + '/last-login').set(time_tmp);
                $.cookie("user" , account, { expires: 3 })
                $.cookie("password" , password, { expires: 3 })
                window.location.href="index.html"
            }
        })
    }
    
}
