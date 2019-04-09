
var app = new Vue({
    el: '#app',
    data: {
        image:"image/cosmic.png",
        resultData: "結果がここに表示されます。"
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
                        this.resultData = result;
                    })
    
                };
                reader.readAsDataURL(file);


            }        
        },
        onMouseEnter:function($event) {
            var img = document.getElementsByClassName("img");
            Tesseract.recognize(img[0])
            .then(function(result){
//                        alert(result);
                this.resultData = result;
            })


        }

    },
})