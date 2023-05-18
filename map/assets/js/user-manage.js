var account = ""
function user_search() {
    var dbRef = firebase.database();
    account = $("#search_account").val();
    dbRef.ref('/account/users/' + account + "/name").on('value', e => {
        dbRef.ref('/account/users/' + account + "/role").on('value', f => {
            if (e.val() == null || '' || f.val() == null || '') {
                alert("沒有此使用者")
            }
            else {
                $("#manage_user_name").val(e.val())
                $("#manage_user_role").val(f.val())
            }
        });
    });

}
function reset_password() {
    var dbRef = firebase.database();
    var password_tmp = prompt("請輸入要將密碼修改成什麼")
    if (password_tmp == "" || password_tmp == null || account == "" || account == null) {
        alert("請勿輸入空值")
    }
    else {
        dbRef.ref('/account/users/' + account + "/password").set($.md5(password_tmp));
        alert("已修改密碼為: " + password_tmp)
    }

}

function admin_reg_btn() {
    var time_tmp = new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "-" + new Date().getHours() + "-" + new Date().getMinutes() + "-" + new Date().getSeconds();
    var dbRef = firebase.database();
    var account_reg = $("#admin_reg_account").val();
    var name_reg = $("#admin_reg_name").val();
    var password_reg = $("#admin_reg_password").val();
    var role_reg = $("#admin_reg_role").val();
    var yes = confirm('您確定註冊嗎?');
    if (yes) {
        if (account_reg == null || account_reg == "" || name_reg == null || name_reg == "" || password_reg == null || password_reg == "" || role_reg == null || role_reg == "") {
            alert("項目有空，請再確認一下")
        }
        else{
            dbRef.ref('/account/users/' + account_reg + "/name").once('value', e => {
                if (e.val() != null && '') {
                    alert("此使用者名稱已註冊過，請再換一個")
                }
                else if (e.val() == null || '') {
                    dbRef.ref('/account/users/' + account_reg + "/reg_time").set(time_tmp);
                    dbRef.ref('/account/users/' + account_reg + "/last-login").set("");
                    dbRef.ref('/account/users/' + account_reg + "/name").set(name_reg);
                    dbRef.ref('/account/users/' + account_reg + "/password").set($.md5(password_reg));
                    dbRef.ref('/account/users/' + account_reg + "/role").set(role_reg);
                    alert("會員:" + account_reg + "註冊成功!密碼為:" + password_reg)
                }
                else{
                    alert("資料庫修改失敗，請再試一次");
                }
            });
        }
    }

}

function admin_edit_user_btn() {
    var dbRef = firebase.database();
    var name_edit = $("#manage_user_name").val();
    var role_edit = $("#manage_user_role").val();
    var yes = confirm('您確定編輯嗎?');
    if (yes) {
        if (name_edit == null || name_edit == "" || role_edit == null || role_edit == "") {
            alert("項目有空，請再確認一下")
        }
        else if(name_edit != null && name_edit != "" && role_edit != null && role_edit != ""){
            dbRef.ref('/account/users/' + account + "/name").once('value', e => {
                if (e.val() == null || '') {
                    alert("沒有這個使用者")
                }
                else if (e.val() != null && '') {
                    dbRef.ref('/account/users/' + account + "/name").set(name_edit);
                    dbRef.ref('/account/users/' + account + "/role").set(role_edit);
                    alert("會員:" + account + "已修改!")

                }
                else{
                    alert("資料庫修改失敗，請再試一次");
                }
            });
        }
    }

}