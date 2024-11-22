import {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketProvider';
import { Messages } from '../messages/messages';

const LobbyPage = () => {
    
    const [emailId,setEmailId] = useState<string>(""); 
    const [roomId,setRoomId] = useState<string>("")
    const navigate = useNavigate();
    //@ts-ignore
    const {socket,connect}= useSocket();

    useEffect(()=>{
        if(socket != null){
            socket.onopen=()=>{
                socket.send(JSON.stringify({
                    type:Messages.CreateRoom,
                    data:{
                        name:emailId,
                        roomid:roomId
                    }
                }))
                navigate(`/room/:${roomId}`,{replace:true})
            }
        }
    },[socket])
    

    function handleSubmitForm(){

        if(connect == undefined){
            console.log('context is not properly set')
            return;
        }

        connect(roomId);
    }
    


  return (
    <div style={{display:"flex",width:"100vw",justifyContent:"center",height:"100vh"}}>
        <div style={{display:"flex",flexDirection:"column",marginTop:"4rem",alignItems:"center"}}>
        <div>
            LOBBY
        </div>
        <div>
            <form onSubmit={async(e)=>{
                e.preventDefault();
                handleSubmitForm();
                
            }} 
            style={{display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignItems:"center"}}>
                <div style={{padding:"1rem"}}>
                    <label htmlFor="emailid">Email Id : </label>
                    <input type="text" onChange={(e)=>{
                        setEmailId(e.target.value);
                    }} style={{height:"2rem"}}></input>
                </div>
                <div style={{padding:"1rem"}}>
                    <label htmlFor="roomid">Room Id : </label>

                    <input type="string" onChange={(e)=>{
                        setRoomId(e.target.value)
                    }} style={{height:"2rem"}}></input>
                </div>
                <div style={{padding:"1rem"}}>
                    <button type="submit">
                        Enter
                    </button>
                </div>
            </form>
        </div>
        </div>
    </div>
  )
}

export default LobbyPage