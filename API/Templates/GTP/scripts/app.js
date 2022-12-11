console.log('Running...')
var consults = new XMLHttpRequest();
var consultsWalk = new XMLHttpRequest();

var consultsAnyKey = new XMLHttpRequest();
var consultsDesbug = new XMLHttpRequest();

var consultsStop = new XMLHttpRequest();


var consultsPressVar = new XMLHttpRequest();
var pressVar = ''


var canvas = document.getElementById('canvas')
var otherCanvas = document.getElementById('otherCanvas')
var ctx = canvas.getContext('2d') // Con esto podemos manipulas las imagenes del canvas.

var video = document.getElementById('videoObj')
var video_main_res = 200

var pressVar = ''



var model = null
async function loadModel() {
    model = await tf.loadLayersModel('/GTP/Files/ModelTrain/json/98', )
}
loadModel()



// Después de que se cargue la pestaña, la WEB.
window.onload = function () {
    seeWebCam()
    
}


var hviId = setInterval(handlerVar, 1000)

function handlerVar() {
    consultsPressVar.open('GET', '/GTP/API/get/pressvar')
    consultsPressVar.send()
    consultsPressVar.onload = () => {
        
        pressVar = consultsPressVar.response
        console.log(consultsPressVar.response)
        
        if (consultsPressVar.response === 'True'){
            clearInterval(hviId)
            seeWebCam()
        }
    }
}





function seeWebCam(){

    var constraints = {
        audio: false,
        video: {
            height: video_main_res, width: video_main_res,
            facingMode: 'environment'
        }
    }

    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {

        video.srcObject = stream
        process_camera()
        prediction()
    })
    
}

var count = 0
var timeoutId = ''

function prediction() {

    if (pressVar === 'True'){
        if (model != null) {
        resample_single(canvas, 28, 28, otherCanvas)

        var ctx2 = otherCanvas.getContext('2d')
        ctx2.drawImage(video, 90, 90, 20, 20, 0, 0, 28, 28)

        var imgData = ctx2.getImageData(0, 0, 28, 28)
        var arr = []
        var arr28 = []

        for (var p=0, i=0; p < imgData.data.length; p += 4) {
            var red = imgData.data[p] / 255
            var green = imgData.data[p + 1] / 255
            var blue = imgData.data[p + 2] / 255

                arr28.push([red, green, blue]) 
                if (arr28.length === 28) {
                    arr.push(arr28)
                    arr28 = []
                }
            }
    
            arr = [arr] // Esto toma forma de tensor numpy, tal cual. No? entiendo.
            var tensor4 = tf.tensor4d(arr);
            var results = model.predict(tensor4).dataSync()
            var maxIndex = results.indexOf(Math.max.apply(null, results))
    
            var classes = ['alt', 'y', 'n', 'h']
            document.getElementById('result').innerHTML = classes[maxIndex]
    
            consults.open('GET', `/GTP/API/press/${classes[maxIndex]}`)
            consults.send()
        }
            
        timeoutId = setTimeout(prediction, 500) 

        if (count <= 40) {
            count ++
        } else {
            console.log('para eliminar')
            clearTimeout(timeoutId)

            consultsStop.open('GET', '/GTP/API/disable/press')
            consultsStop.send()
            hviId = setInterval(handlerVar, 1000)

            consultsStop.onload = () => {

                // consultsDesbug.open('GET', '/GTP/API/macros/desbug') // Se "desbuguea" primero.
                // consultsDesbug.send()

                consultsAnyKey.open('GET', '/GTP/API/press/a')
                consultsAnyKey.send()

                count = 0

            }

        }
    } else {
        consultsStop.open('GET', '/GTP/API/enable/press')
        consultsStop.send()
    }
        
}



function process_camera() {
    var ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, video_main_res, video_main_res, 0, 0, video_main_res, video_main_res)
    setTimeout(process_camera, 20)
    
    // var ctx2 = otherCanvas.getContext('2d')
    // ctx2.drawImage(video, 0, 0, 28, 28, 0, 0, 28, 28)
}


/**
     * Hermite resize - fast image resize/resample using Hermite filter. 1 cpu version!
     * 
     * @param {HtmlElement} canvas
     * @param {int} width
     * @param {int} height
     * @param {boolean} resize_canvas
*/

function resample_single(canvas, width, height, resize_canvas) {
var width_source = canvas.width;
var height_source = canvas.height;
width = Math.round(width);
height = Math.round(height);

var ratio_w = width_source / width;
var ratio_h = height_source / height;
var ratio_w_half = Math.ceil(ratio_w / 2);
var ratio_h_half = Math.ceil(ratio_h / 2);

var ctx = canvas.getContext("2d");
var ctx2 = resize_canvas.getContext("2d");
var img = ctx.getImageData(0, 0, width_source, height_source);
var img2 = ctx2.createImageData(width, height);
var data = img.data;
var data2 = img2.data;

for (var j = 0; j < height; j++) {
    for (var i = 0; i < width; i++) {
        var x2 = (i + j * width) * 4;
        var weight = 0;
        var weights = 0;
        var weights_alpha = 0;
        var gx_r = 0;
        var gx_g = 0;
        var gx_b = 0;
        var gx_a = 0;
        var center_y = (j + 0.5) * ratio_h;
        var yy_start = Math.floor(j * ratio_h);
        var yy_stop = Math.ceil((j + 1) * ratio_h);
        for (var yy = yy_start; yy < yy_stop; yy++) {
            var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
            var center_x = (i + 0.5) * ratio_w;
            var w0 = dy * dy; //pre-calc part of w
            var xx_start = Math.floor(i * ratio_w);
            var xx_stop = Math.ceil((i + 1) * ratio_w);
            for (var xx = xx_start; xx < xx_stop; xx++) {
                var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                var w = Math.sqrt(w0 + dx * dx);
                if (w >= 1) {
                    //pixel too far
                    continue;
                }
                //hermite filter
                weight = 2 * w * w * w - 3 * w * w + 1;
                var pos_x = 4 * (xx + yy * width_source);
                //alpha
                gx_a += weight * data[pos_x + 3];
                weights_alpha += weight;
                //colors
                if (data[pos_x + 3] < 255)
                    weight = weight * data[pos_x + 3] / 250;
                gx_r += weight * data[pos_x];
                gx_g += weight * data[pos_x + 1];
                gx_b += weight * data[pos_x + 2];
                weights += weight;
            }
        }
        data2[x2] = gx_r / weights;
        data2[x2 + 1] = gx_g / weights;
        data2[x2 + 2] = gx_b / weights;
        data2[x2 + 3] = gx_a / weights_alpha;
    }
}


ctx2.putImageData(img2, 0, 0);
}