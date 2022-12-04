console.log('Running...')
var consults = new XMLHttpRequest();

var canvas = document.getElementById('canvasObj')
var ctx = canvas.getContext('2d') // Con esto podemos manipulas las imagenes del canvas.

var video = document.getElementById('videoObj')
var video_main_res = 200

var model = null
async function loadModel() {
    model = await tf.loadLayersModel('/GTP/Files/ModelTrain/json/98')
}
loadModel()




// Después de que se cargue la pestaña, la WEB.
window.onload = function () {
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

    var webCamPermissions = navigator.mediaDevices.getUserMedia(constraints)
    video.srcObject = webCamPermissions
    // process_camera()
    // prediction()
}