import {useRef} from 'react'


export default function Predictor() {
    
    const video = useRef(null)
    const main_resolution = 200

    // const canvas = document.getElementById('webcam_canvas')

    const constraints = {
        audio: false,
        video: {
            width: main_resolution, height: main_resolution,
            facingMode: {
                exact: 'environment'
            }
        }
    }

    
    async function init() {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        handleAccess(stream)
    }
    
    

    async function handleAccess(stream) {
        video.current.srcObject = stream

    }


    init()

    const prediction = () => {
        if (model != null) {

        }

        setTimeout(prediction, 150) // Time to bucle. Modified????
    }


    return(
        <div className="keyPredictor_div">

            <video className="video_webcam" id='video_webcam_id' ref={video} playsInline autoPlay></video>

            <canvas className="canvas_cam_predictor" height={main_resolution} width={main_resolution} id='webcam_canvas'></canvas>

        </div>
    )
}