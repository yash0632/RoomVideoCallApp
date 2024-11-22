
import { Room } from "./room";
import { WebSocket } from "ws";


class RoomManager {
    
    private roomToUserMap:Map<string,Room>;
    static Instance :RoomManager

    private constructor(){
        
        this.roomToUserMap = new Map<string,Room>
    }

    static createInstance(){
        if(!RoomManager.Instance){
            RoomManager.Instance = new RoomManager();
        }
        return RoomManager.Instance;
    }

    createRoom(roomid:string,name:string,socket:WebSocket){
        
        if(!this.roomToUserMap.has(roomid)){
            const room = new Room(roomid)
            this.roomToUserMap.set(roomid,room);
            room.addUser(name,socket) 
            
        }
        else{
            const room = this.roomToUserMap.get(roomid);
            if(room == undefined){
                socket.send("room is not created")
                return
            }
            room.addUser(name,socket)
            
        }
        
    }

    deleteRoom(roomid:string){
        if(this.roomToUserMap.has(roomid)){
            this.roomToUserMap.delete(roomid);
        }
        console.log(`room with roomid ${roomid} is deleted`)
        console.log('close p2p connection')
    }

    getRoom(roomid:string){
        const room = this.roomToUserMap.get(roomid);
        return room
    }
    

}

const roomManager = RoomManager.createInstance();
export default roomManager;