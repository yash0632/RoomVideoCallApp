import { WebSocket } from "ws";
import roomManager from "./roommanager";
import { Messages } from "./messages";

export interface User{
    name:string,
    socket:WebSocket
    connState:number
}

export class Room{
    private user1 :User|null;
    private user2 :User|null;
    private roomid :string

    constructor(roomid : string){
        this.user1 = null;
        this.user2 = null;
        this.roomid = roomid
        
    }

    addUser(name:string,socket:WebSocket){
        if(this.user1 == null){
            this.user1 = {
                name,
                socket,
                connState:0
            }
            console.log("user1 added");
        }
        else if(this.user2 == null){
            this.user2 = {
                name,
                socket,
                connState:0
            }
            console.log("user2 added")
        }
        this.addHandler(socket);
        
        
    }

    removeUser(socket:WebSocket){
        if(socket == this.user1?.socket){
            this.user1 = null;
            console.log("user1 deleted")
        }
        if(socket == this.user2?.socket){
            this.user2 = null;
            console.log("user2 deleted")
        }
        if(this.user1 == null && this.user2 == null){
            roomManager.deleteRoom(this.roomid);
        }
    }



    private startP2PConnection(){
        if(this.user1?.socket && this.user2?.socket){
            console.log(this.user1.name,this.user2.name)
            
            this.user1.socket.send(JSON.stringify({
                type:Messages.CreateConnection
            }))
            this.user2?.socket.send(JSON.stringify({
                type:Messages.CreateConnection
            }))
            
            console.log('p2p connection started')
        }
        else{
            console.log("user1 and user2 do not have sockets")
        } 
    }


    

    private addHandler(socket:WebSocket){
        socket.on("message",(data:string)=>{
            const message = JSON.parse(data);

            
            switch (message.type){

                case Messages.SendOffer:
                    if(this.user1?.socket == socket){
                        this.user2?.socket.send(JSON.stringify({
                            type:Messages.SendOffer,
                            data:{
                                offer:message.data.offer
                            }
                        }))
                    }
                    else if(this.user2?.socket == socket){
                        this.user1?.socket.send(JSON.stringify({
                            type:Messages.SendOffer,
                            data:{
                                offer:message.data.offer
                            }
                        }))
                    }
                    break;

                case Messages.SendAnswer:
                    if(this.user1?.socket == socket){
                        this.user2?.socket.send(JSON.stringify({
                            type:Messages.SendAnswer,
                            data:{
                                answer:message.data.answer
                            }
                        }))
                    }
                    else if(this.user2?.socket == socket){
                        this.user1?.socket.send(JSON.stringify({
                            type:Messages.SendAnswer,
                            data:{
                                answer:message.data.answer
                            }
                        }))
                    }
                    break;

                case Messages.SendIceCandidates :

                    if(this.user1?.socket == socket){
                        this.user2?.socket.send(JSON.stringify({
                            type:Messages.SendIceCandidates,
                            data:{
                                iceCandidates:message.data.iceCandidates
                            }
                        }))
                    }
                    else if(this.user2?.socket == socket){
                        this.user1?.socket.send(JSON.stringify({
                            type:Messages.SendIceCandidates,
                            data:{
                                iceCandidates:message.data.iceCandidates
                            }
                        }))
                    }
                    break;

                case Messages.StartConnection:
                    if(this.user1?.socket == socket){
                        this.user1.connState=1;
                    }
                    else if(this.user2?.socket == socket){
                        this.user2.connState=1;
                    }
                    if(this.user1?.connState == 1 && this.user2?.connState == 1){
                        this.user1.socket.send(JSON.stringify({
                            type:Messages.StartConnection
                        }))
                    }
                    break;

                case Messages.socketCreated:{
                    if(socket == this.user1?.socket){
                        this.user1.socket.send(JSON.stringify({
                            type:Messages.CreateConnection
                        }))
                    }
                    else if(socket == this.user2?.socket){
                        this.user2.socket.send(JSON.stringify({
                            type:Messages.CreateConnection
                        }))
                    }
                    break;
                }
                case Messages.connectionCompleted:
                    if(socket == this.user1?.socket){
                        if(this.user1?.connState == 1 && this.user2?.connState == 1){
                            this.user2.socket.send(JSON.stringify({
                                type:Messages.StartConnection
                            }))
                        }
                    }
                    
                    break;
                
                default:
                    break;
                    
            }
        })
    }

}