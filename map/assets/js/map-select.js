var tmp5 = '';
var code_select = '<option value="{{code}}">{{name}}</option>';
var code_select_group = '<optgroup label="{{name}}">';
function onload2(){
    // 畫面預覽
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
    // 選單修改
    dbRef.ref('/setting/locate-select/start_list').on('value', e => {
        $("#map-select-start").val(e.val());
    });
    dbRef.ref('/setting/locate-select/end_list').on('value', e => {
        $("#map-select-end").val(e.val());
    });
}

function map_select_sequence(){
    var dbRef = firebase.database();
    var yes = confirm("確定修改嗎?(修改錯誤會導致無法選擇)");
    if(yes){
        dbRef.ref('/setting/locate-select/start_list').set($("#map-select-start").val());
        dbRef.ref('/setting/locate-select/end_list').set($("#map-select-end").val());
        alert("已修改!")
        location.reload();
    }
}

function map_select_search(){
    var method = $("input[name='map_check']:checked").val();
    if ($("#map_select_name").val() == "") {
        alert("請輸入代碼");
    }
    else {
        var dbRef = firebase.database();
        dbRef.ref('/setting/locate-select/'+method+'/'+$("#map_select_name").val()+"/value").on('value', e => {
            $("#map_select_value").val(e.val());
        });
        alert("查詢成功!")
    }
}

function map_select_edit(){
    var dbRef = firebase.database();
    var yes = confirm("確定修改嗎?");
    var method = $("input[name='map_check']:checked").val();
    if(yes){
        dbRef.ref('/setting/locate-select/'+method+'/'+$("#map_select_name").val()+"/name").set($("#map_select_name").val());
        dbRef.ref('/setting/locate-select/'+method+'/'+$("#map_select_name").val()+"/value").set($("#map_select_value").val());
        alert("已修改!");
    }
}