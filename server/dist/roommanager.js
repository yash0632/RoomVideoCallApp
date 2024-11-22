"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_1 = require("./room");
class RoomManager {
    constructor() {
        this.roomToUserMap = new Map;
    }
    static createInstance() {
        if (!RoomManager.Instance) {
            RoomManager.Instance = new RoomManager();
        }
        return RoomManager.Instance;
    }
    createRoom(roomid, name, socket) {
        if (!this.roomToUserMap.has(roomid)) {
            const room = new room_1.Room(roomid);
            this.roomToUserMap.set(roomid, room);
            room.addUser(name, socket);
        }
        else {
            const room = this.roomToUserMap.get(roomid);
            if (room == undefined) {
                socket.send("room is not created");
                return;
            }
            room.addUser(name, socket);
        }
    }
    deleteRoom(roomid) {
        if (this.roomToUserMap.has(roomid)) {
            this.roomToUserMap.delete(roomid);
        }
        console.log(`room with roomid ${roomid} is deleted`);
        console.log('close p2p connection');
    }
    getRoom(roomid) {
        const room = this.roomToUserMap.get(roomid);
        return room;
    }
}
const roomManager = RoomManager.createInstance();
exports.default = roomManager;
