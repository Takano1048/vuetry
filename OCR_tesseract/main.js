
var app = new Vue({
    el: '#app',
    data: {
        image:"",
        resultData: "結果がここに表示されます。",
        resultDataGoogle : "結果がここに表示されます。",
        request: {
            requests:[
            {
                image: {
                    content: undefined
                },
                features : [
                    {
                        type : "TEXT_DETECTION"
                    }
                ],
                imageContext : {
                    languageHints:['jp','en','ko']
                }
            }]
        }
    },
    methods: {
        onChange:function($event) {
            const files = $event.target.files;
            if (files.length > 0) {
                const file = files[0];
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.image = e.target.result;
                    var img = document.getElementsByClassName("img");

                    Tesseract.recognize(img[0])
                    .then(function(result){
                        console.log(result)
                        app.resultData =  result.text;
                    })
                };
                reader.readAsDataURL(file);
            }
        },
        onMouseEnter:function($event) {
/*
            var img = document.getElementsByClassName("img");
            Tesseract.recognize(img[0])
            .then(function(result){
                console.log(result);
                app.resultData =  result.text;
            })
*/
            this.googleOCR();
        },
        googleOCR: async function () {
            try {
                // base64
                // https://cloud.google.com/vision/docs/reference/rest/v1/images/annotate?hl=ja
                var img = document.getElementById("outputImage");
                img.crossOrigin = 'anonymous';
                var base64 = this.ImageToBase64(img, "image/jpeg");
                this.request.requests[0].image.content = base64;


                const res = await axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBwa0_GjvjOnEi4g2hf6dnEdvw3b9_ILNQ', this.request)
                var jsonData = JSON.stringify(res.data);
                var result = res.data.responses[0].textAnnotations[0].description;
                this.resultDataGoogle = result;

            } catch(error) {
                console.log(error.message);
                const {
                    status,
                    statusText
                  } = error.response;
                  console.log(`Error! HTTP Status: ${status} text:${statusText}`);
                  console.log(error);
            }
        },
        ImageToBase64: function (img, mime_type) {
            // New Canvas
            var canvas = document.createElement('canvas');
            canvas.width  = img.width;
            canvas.height = img.height;
            // Draw Image
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            var base64 = canvas.toDataURL(mime_type);
//            base64.replace()
            // To Base64
            base64 = base64.replace("data:image/jpeg;base64,", "");
            return base64;
        }
    },
})

//
// 画像貼り付け処理
//

var element =  document.querySelector("[contenteditable]");
element.addEventListener("paste", function(e){
    // 画像の場合
    // e.clipboardData.types.length == 0
    // かつ
    // e.clipboardData.types[0] == "Files"
    // となっているので、それ以外を弾く
    if (!e.clipboardData
            || !e.clipboardData.types
            || (e.clipboardData.types.length != 1)
            || (e.clipboardData.types[0] != "Files")) {
            return true;
    }

    // ファイルとして得る
    // (なぜかgetAsStringでは上手くいかなかった)
    var imageFile = e.clipboardData.items[0].getAsFile();

    // FileReaderで読み込む
    var fr = new FileReader();
    fr.onload = function(e) {
        // onload内ではe.target.resultにbase64が入っているのであとは煮るなり焼くなり
        var base64 = e.target.result;
        document.querySelector("#outputImage").src = base64;
        document.querySelector("#outputText").textContent = base64;
    };
    fr.readAsDataURL(imageFile);

    // 画像以外がペーストされたときのために、元に戻しておく
    this.innerHTML = "paste image here";
});
