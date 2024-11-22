import {WebSocketServer} from 'ws'
import http from 'node:http'
import roomManager from './roommanager';
import {Room} from './room'
import { Messages } from './messages';
import { v4 as uuid } from 'uuid';

const httpServer = http.createServer().listen(3000);

const wss = new WebSocketServer({server:httpServer});




wss.on("connection",function connection(ws,req){
    
    ws.on("message",function message(data:string){
        const message = JSON.parse(data);
        if(message.type == Messages.CreateRoom){

            const {roomid,name} = message.data;
            
            roomManager.createRoom(roomid,name,ws)
        }
    })

    ws.on("close",()=>{
        //@ts-ignore
        const url = new URL(req.url,`http://${req.headers.host}`);
        const roomid = url.searchParams.get(`roomid`);
        if(roomid==null){
            console.log(`roomid is null`)
            return;
        }
        const room = roomManager.getRoom(roomid);
        room?.removeUser(ws);
        
    })
    
    ws.send("you are successfully connected");
    
    
})
