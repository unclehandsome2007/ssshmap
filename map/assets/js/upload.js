img_upload_pre = '<img src="{{link}}">'
uploadBtn.addEventListener("change", event => {
    msg.textContent = "";
    // 取得檔案資訊
    const file = event.target.files[0];
    const path = $.md5(file.name) + Date.now();

    // 取得 storage 對應的位置
    const storageReference = firebase.storage().ref("steps/" + path);

    // .put() 方法把東西丟到該位置裡
    const task = storageReference.put(file);
    // .on()監聽並連動 progress 讀取條
    task.on(
        "state_changed",
        function progress(snapshot) {
            let uploadValue = snapshot.bytesTransferred / snapshot.totalBytes * 100;
            uploader.value = uploadValue;
        },
        function error(err) {
            msg.textContent = "上傳失敗";
        },
        function complete() {
            msg.textContent = "上傳成功";
            $("#file_info").val(path);
            const fileRef = firebase.storage().ref("steps/" + path)
            fileRef.getDownloadURL().then(function (url) {
                $(".img_upload_pre").html(img_upload_pre.replace("{{link}}",url));
            })
        }
    );
});