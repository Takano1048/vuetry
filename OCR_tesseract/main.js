
var app = new Vue({
    el: '#app',
    data: {
        image:"image/cosmic.jpg",
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
                ]
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
                    alert(img);
                    Tesseract.recognize(img[0])
                    .then(function(result){
//                        alert(result);
                        console.log(result)
                        app.resultData =  result.text;
                    })
                    
    
                };
                reader.readAsDataURL(file);
            }        
        },
        onMouseEnter:function($event) {

            var img = document.getElementsByClassName("img");
            Tesseract.recognize(img[0])
            .then(function(result){
                console.log(result);
                app.resultData =  result.text;
            })

            this.googleOCR();
        },
        googleOCR: async function () {
            try {
                // base64
                var img = document.getElementById("img1");
                var base64 = this.ImageToBase64(img, "image/jpeg");
//                console.log(base64);
                this.request.requests[0].image.content = base64;
//                console.log(JSON.stringify(this.request));
//                console.log(this.request);
                const res = await axios.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBwa0_GjvjOnEi4g2hf6dnEdvw3b9_ILNQ', this.request)
                var jsonData = JSON.stringify(res.data);
//                console.log(jsonData);
//                console.log(JSON.stringify(res.data.responses[0].textAnnotations.length));
                var result = res.data.responses[0].textAnnotations[0].description;
//                for (i = 0; i < res.data.responses[0].textAnnotations.length; i++) {
//                    console.log(JSON.stringify(res.data.responses[0].textAnnotations[i]));
//                    result = result + " " + res.data.responses[0].textAnnotations[i].description;
//                }
                this.resultDataGoogle = result;

//                await this.refresh()
/*
                this.$message({
                    showClose: true,
                    message: 'Add Currency Success!',
                    type: 'success'
                })
*/                
            } catch(error) {
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