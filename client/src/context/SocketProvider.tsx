import React,{useContext,createContext,useState,useCallback} from 'react'


const SocketContext = createContext<null|{
  socket:null|WebSocket,
  connect:(roomid:string)=>void
}>(null);


export const useSocket=()=>{
  const context = useContext(SocketContext);
  return context;
}


const SocketProvider = ({children}:{
    children:React.ReactNode
}) => {
  const [socket,setSocket] = useState<null|WebSocket>(null);

    

    const connect = useCallback(function(roomid:string){
      
      const newSocket =new WebSocket(`ws://localhost:3000?roomid=${roomid}`);
      setSocket(newSocket);
      
    },[])

  return (
    <SocketContext.Provider value={{socket,connect}}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider

//connect -> state update -> useEffect -> socket -> update