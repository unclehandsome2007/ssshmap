$('#google-form').submit(function (e) {
    //在這裡我們要先擋掉form默認事件
    e.preventDefault(); 
    if ($('#email').val() && $('#reply').val()!="請選擇是否需要回覆您" &&  $('#question').val()) {//需要先確認必填欄位是否填寫
      $.ajax({
        // url為Google Form按下submit的aciotn
        url: "https://docs.google.com/forms/u/0/d/e/1FAIpQLScoup_SJ0zOJmqUcKTnlFvEFo6xfJjtifMluRdr7TzQNu4ZZQ/formResponse",
        crossDomain: true,//解決跨網域CORS的問題
        data: {// entry.xxxxx 這些需要填寫您表單裡面的值，與其相互對應
          "entry.125099693": $('#email').val(),
          "entry.395706881": $('#reply').val(),
          "entry.1421612348": $('#question').val()
        },
        type: "POST", //因為是要進行insert的動作，故事用POST
        dataType: "JSONP",
        complete: function () {
          //完成後把這些欄位清空
          $('#email').val('')
          $('#reply').val('請選擇是否需要回覆您')
          $('#question').val("")
          //最後跳轉到感謝的頁面
          window.alert("已送出!")
          window.location.href='index.html';
        }
      });
    }
    else{
        window.alert("請填寫必填項目")
    }
  });