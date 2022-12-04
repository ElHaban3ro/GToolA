import React,{useRef, useEffect} from 'react'
import ModelJson from '../../Models/model-98.json'
import * as tf from '@tensorflow/tfjs'


export default function Predictor() {
    
    const video = useRef(null)
    const canvas = useRef(null)

    const main_resolution = 200

    const model = null

    const constraints = {
        audio: false,
        video: {
            width: main_resolution, height: main_resolution,
            facingMode: {
                exact: 'environment'
            }
        }
    }

    
    async function Init() {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)

        useEffect(() => {

            handleAccess(stream)

        })
    }
    
    

    async function handleAccess(stream) {
        video.current.src = stream

    }


    (async () => {
        const model = await tf.loadLayersModel(ModelJson)
    })();

    const prediction = () => {
        if (model != null) {

        }

        setTimeout(prediction, 150) // Time to bucle. Modified????
    }


    return(
        <div className="keyPredictor_div">
            
            <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js"></script>

            <video className="video_webcam" id='video_webcam_id' ref={video} playsInline autoPlay></video>

            <canvas className="canvas_cam_predictor" ref={canvas} height={main_resolution} width={main_resolution} id='webcam_canvas'></canvas>

        </div>
    )
}