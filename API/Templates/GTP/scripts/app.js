console.log('Running...')
var canvas = document.getElementById('canvasObj')
var ctx = canvas.getContext('2d') // Con esto podemos manipulas las imagenes del canvas.

var video = document.getElementById('videoObj')
var video_main_res = 200

var model = null
(async () => {
    model = await tf.loadLayersModel('../Models/98/model-98.json')
})()



// Después de que se cargue la pestaña, la WEB.
window.onload() = function () {
    seeWebCam()
}



function seeWebCam(){

    var constraints = {
        audio: false,
        video: {
            height: video_main_res, width: video_main_res,
            facingMode: 'environment'
        }
    }

}