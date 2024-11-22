import {useRef,useEffect,useCallback} from 'react'

import { useSocket } from '../context/SocketProvider';
import { Messages } from '../messages/messages';
import { usePeer } from '../context/PeerProvider';


const RoomPage = () => {

    
    
    
    const senderVideoRef = useRef(null);
    const receiverVideoRef = useRef(null);

    const socketcontext = useSocket();
    if(socketcontext == null)return;
    const {socket} = socketcontext;
    if(!socket)return;


    const peerContext = usePeer();
    if(peerContext == null)return;
    const {peer,connect} = peerContext;
    

    useEffect(()=>{
        if(peer != null){
            socket.send(JSON.stringify({
                type:Messages.StartConnection
            }))
            socket.onmessage=async(event)=>{
                const eventData = event.data;
                const message = JSON.parse(eventData);
                let data = null;
    
                switch(message.type){
                    case Messages.StartConnection:
                        startPeerConnection(peer);
                        break;
    
                    case Messages.SendOffer:
                        //srd offer
                            
                            if(peer == null)return;
                            data = message.data;
                            await peer.setRemoteDescription(data.offer);
                            
                            const answer = await peer.createAnswer();
                            await peer.setLocalDescription(answer);
                            socket.send(JSON.stringify({
                                type:Messages.SendAnswer,
                                data:{
                                    answer:answer
                                }
                            }))
                            break;
                        
                        
    
                    case Messages.SendAnswer:
                        
                        if(peer == null)return;
                        data = message.data;
                        
                        await peer.setRemoteDescription(data.answer);
                        
                        socket.send(JSON.stringify({
                            type:Messages.connectionCompleted
                        }))
                        break;
    
                    case Messages.SendIceCandidates:
                        if(peer == null)return;
                        data = message.data;
                        await peer.addIceCandidate(data.iceCandidates);
                        break;
                    
    
                    default:
                        break;     
                }
    
                
            }
        }
    },[peer])

    

    useEffect(()=>{
        console.log(socket);
        getUserMediaAndStream();
        socket.onmessage=async(event)=>{
            const eventData = event.data;
            const message = JSON.parse(eventData);
            

            switch(message.type){
                case Messages.CreateConnection:
                    //create a rtc peer connection object
                    
                    
                    
                    createPeerConnection();
                    
                    
                    break;                

                default:
                    break;     
            }

            
        }
        
        socket.send(JSON.stringify({
            type:Messages.socketCreated
        }))
    },[])

    const startPeerConnection = useCallback(async(peer:RTCPeerConnection)=>{
        console.log(peer);
        if(peer != null){
            const offer =await peer.createOffer();
            await peer.setLocalDescription(offer);
            if(socket == null)return;
            socket.send(JSON.stringify({
                type:Messages.SendOffer,
                data:{
                    offer:offer
                }
            }))

            peer.onnegotiationneeded=async()=>{
                const offer = await peer.createOffer();
                await peer.setLocalDescription(offer);
                if(socket == null)return;
                socket.send(JSON.stringify({
                    type:Messages.SendOffer,
                    data:{
                        offer:offer
                    }
                }))
            }

            peer.onicecandidate=(event)=>{
                if(socket == null)return;
                socket.send(JSON.stringify({
                    type:Messages.SendIceCandidates,
                    data:{
                        iceCandidates:event.candidate
                    }
                }))
               
            }

            peer.ontrack=(event)=>{
                //@ts-ignore
                receiverVideoRef.current.srcObject = new MediaStream([event.track])
                //@ts-ignore
                receiverVideoRef.current.play();
            }
        }
    },[])

    function createPeerConnection(){
        connect();
    }

    async function getUserMediaAndStream(){
        const mediaStream =await navigator.mediaDevices.getUserMedia({video:true});
        //@ts-ignore
        
        senderVideoRef.current.srcObject=mediaStream
        //@ts-ignore
        senderVideoRef.current.play();
    }
    
    async function sendUserMediaAndStream(peer:RTCPeerConnection){
        
        const mediaStream =await navigator.mediaDevices.getUserMedia({
            video:true,
            audio:false
        })

        mediaStream.getTracks().forEach((track)=>{
            peer.addTrack(track)
        })

    }

    

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:"100vw",gap:"2rem"}}>
        
            <div>
                ROOM
            </div>
            
            <div>
                <button onClick={()=>{
                    if(peer == null){
                        alert("peer is null");
                        return;
                    }
                    sendUserMediaAndStream(peer);
                }}>
                    send stream
                </button>
                <button onClick={()=>{
                    if(peer == null){
                        alert("peer is null")
                        return;
                    }
                    //removeUserMediaAndStream(peer);
                }}>
                    remove stream
                </button>
            </div>
            
            <div style={{display:"flex"}}>
                <div>
                    <div>
                        Remote Stream
                    </div>
                    <div>
                        <video ref={receiverVideoRef}>

                        </video>
                    </div>
                </div>
                <div>
                    <div>
                        My Stream
                    </div>
                    <div>
                        <video ref={senderVideoRef}
                        
                        ></video>
                    </div>
                </div>
            </div>
        

    </div>
  )
}

export default RoomPage