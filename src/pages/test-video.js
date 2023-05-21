import { useState } from "react";
import { useRef } from "react"
import api from '../api.json'
import { useEffect } from "react";
import { AuthContext } from "../context/datacontext";
import { useContext } from "react";

function useMediaRecorder({ ws }) {
    const videoRef = useRef(null);
    let mediaStream = useRef({});
    let mediaRecorder = useRef({});
    let sendVideoInterval = null;

    useEffect(() => {
        const initializeMedia = async () => {
            try {
                mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                videoRef.current.srcObject = mediaStream.current;

                mediaRecorder.current = new MediaRecorder(mediaStream.current, {
                    audioBitsPerSecond: 128000,
                    mimeType: 'video/webm;codecs=vp8,opus',
                    videoBitsPerSecond: 2500000
                });

                mediaRecorder.current.addEventListener('dataavailable', (event) => {
                    ws.send(event.data)
                });

                sendVideoInterval = setInterval(() => {
                    if (mediaRecorder.current.state === 'recording') {
                        mediaRecorder.current.requestData();
                    }
                }, 1000);

                mediaRecorder.current.start();
            } catch (error) {
                console.error('Error al inicializar el MediaStream y el MediaRecorder:', error);
            }
        };


        initializeMedia();

        return () => {
            clearInterval(sendVideoInterval);
            if (mediaRecorder.current) {
                mediaRecorder.current.stop();
            }
            if (mediaStream.current) {
                mediaStream.current.getTracks().forEach((track) => {
                    track.stop();
                });
            }
        };
    }, []);

    // useEffect(() => {
    //     console.warn(chunks)
    //     if (chunks.length) {
    //         let blob = new Blob(chunks, { type: 'video/webm;codecs=vp8,opus' })
    //         v2.current.src = URL.createObjectURL(blob)
    //     }
    // }, [chunks]);


    return {mediaRecorder, videoRef };
}

function MediaElement({ ws, v2 }) {
    const { mediaRecorder, videoRef } = useMediaRecorder({ ws })

    function generateBlob({ data }) {
        mediaRecorder.current.requestData()
    }

    return (
        <div style={{ width: 100, height: 100, padding: 5, background: 'blue' }}>
            <video style={{ width: '100%' }} ref={videoRef} autoPlay></video>
            <button onClick={generateBlob}>gen</button>
        </div>
    );
};

function VideoMessage() {
    let src
    let mediaSourceRef
    let sourceBufferRef

    useEffect(() => {
        mediaSourceRef = new MediaSource();
        src = URL.createObjectURL(mediaSourceRef);

        // Evento para manejar el evento 'sourceopen' del MediaSource
        const handleSourceOpen = () => {
            // Crear el SourceBuffer
            console.warn("creando buffer??");
            sourceBufferRef = mediaSourceRef.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');

        };

        mediaSourceRef.addEventListener('sourceopen', handleSourceOpen);

        console.log('open')
        return () => {
            console.log('closed?')
            if (sourceBufferRef) {
                sourceBufferRef.abort();
            }
            if (mediaSourceRef) {
                mediaSourceRef.removeEventListener('sourceopen', handleSourceOpen);
                mediaSourceRef.endOfStream();
            }
        };
    }, []);

    return { src, sourceBufferRef }
}

export default function VideoPage() {
    const [active, setActive] = useState(false)
    /**
     * @type {[WebSocket]}
     */
    const [ws, setWs] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState()
    const { auth } = useContext(AuthContext);
    let [chunks, setChunks] = useState([])
    // const { src, sourceBufferRef } = VideoMessage()

    const videoRef2 = useRef(null);
    const mediaSourceRef = useRef(null);
    const sourceBufferRef = useRef(null);

    const handleUpdateEnd = () => {
        // Si el SourceBuffer no está actualmente actualizando, inicia la reproducción
        if (!sourceBufferRef.current.updating && mediaSourceRef.current.readyState === 'open') {
            mediaSourceRef.current.endOfStream();
            videoRef2.current.play();
        }
    };

    const handleSourceOpen = () => {
        // Crear el objeto SourceBuffer
        sourceBufferRef.current = mediaSourceRef.current.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');

        // Evento 'updateend' del SourceBuffer para manejar la finalización de las actualizaciones
        sourceBufferRef.current.addEventListener('updateend', handleUpdateEnd);
    };

    // const handleWebSocketMessage =


    useEffect(() => {
        let mediaSource;
        let sourceBuffer;
    
        const initVideoSource = async ()=>{
            mediaSource = new MediaSource();
            videoRef2.current.src = URL.createObjectURL(mediaSource);

            mediaSource.addEventListener('sourceopen', () => {
                sourceBuffer = mediaSource.addSourceBuffer('video/webm;codecs=vp8,opus');
              });
        }
        initVideoSource()



        // Evento 'sourceopen' para manejar la apertura del MediaSource
        // mediaSourceRef.current.addEventListener('sourceopen', handleSourceOpen);

        const socket = new WebSocket(api.ws + `video-chat/?room_id=${1}&token=${auth.token}`)
        socket.onopen = (e) => {
            console.warn('WebSocket Connected');
            setConnectionStatus(socket.readyState)
        }
        socket.onmessage =  (event) => {
            const videoBlobPart = event.data;
            const reader = new FileReader();

            reader.onload = () => {
                const videoArrayBuffer = reader.result;
                sourceBuffer.appendBuffer(videoArrayBuffer);
              };
              reader.readAsArrayBuffer(videoBlobPart);
            
            // Obtener los bytes del mensaje WebSocket
            // const bytes = event.data;
    
            // // Agregar los bytes al SourceBuffer
            // if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
            //     if (chunks.length > 4 ){
    
            //         setChunks(prev=>[].concat(bytes))
            //     } else {
            //         setChunks(prev=>prev.concat(bytes))
            //     }
            // }
        };
        socket.onclose = () => {
            console.warn('WebSocket Disconnected');
            setConnectionStatus(socket.readyState)
        }
        setWs(socket)

        return ()=>{
            socket.close()
            mediaSource && mediaSource.endOfStream();
        }


    }, []);

    //  useEffect(() => {
    //     if (chunks.length) {
    //         console.log('len_chinks', chunks.length)
    //         let blob = new Blob(chunks, { type: 'video/webm;codecs=vp8,opus' })
    //         videoRef2.current.src = URL.createObjectURL(blob)
    //         console.log(URL.createObjectURL(blob))
    //     }
    // }, [chunks]);

    function reproducirVideo() {
        console.log("current", chunks)
        if (chunks.length === 0) {
            return; // No hay fragmentos de video para reproducir
        }

        const videoBlob = new Blob(chunks, { type: 'video/x-matroska;codecs=avc1,opus' });
        const videoUrl = URL.createObjectURL(videoBlob);

        videoRef2.current.src = videoUrl;
        videoRef2.current.play();

        // Limpiar los fragmentos de video almacenados
        chunks = [];
    }

    const handleCamera = () => {
        setActive(!active)
    }



    return <div className="video-page">
        <button onClick={handleCamera}>Start</button>
        <div className="video-container">
            {active && <MediaElement ws={ws} v2={videoRef2} />}
            {/* {active && <VideoMessage ws={ws}></VideoMessage>}
             */}
            <div style={{ width: 100, height: 100, padding: 5, background: 'red' }}><video style={{ width: '100%' }} ref={videoRef2} autoPlay></video></div>

        </div>
    </div>
}

