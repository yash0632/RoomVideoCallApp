"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Room = void 0;
const roommanager_1 = __importDefault(require("./roommanager"));
const messages_1 = require("./messages");
class Room {
    constructor(roomid) {
        this.user1 = null;
        this.user2 = null;
        this.roomid = roomid;
    }
    addUser(name, socket) {
        if (this.user1 == null) {
            this.user1 = {
                name,
                socket,
                connState: 0
            };
            console.log("user1 added");
        }
        else if (this.user2 == null) {
            this.user2 = {
                name,
                socket,
                connState: 0
            };
            console.log("user2 added");
        }
        this.addHandler(socket);
    }
    removeUser(socket) {
        var _a, _b;
        if (socket == ((_a = this.user1) === null || _a === void 0 ? void 0 : _a.socket)) {
            this.user1 = null;
            console.log("user1 deleted");
        }
        if (socket == ((_b = this.user2) === null || _b === void 0 ? void 0 : _b.socket)) {
            this.user2 = null;
            console.log("user2 deleted");
        }
        if (this.user1 == null && this.user2 == null) {
            roommanager_1.default.deleteRoom(this.roomid);
        }
    }
    startP2PConnection() {
        var _a, _b, _c;
        if (((_a = this.user1) === null || _a === void 0 ? void 0 : _a.socket) && ((_b = this.user2) === null || _b === void 0 ? void 0 : _b.socket)) {
            console.log(this.user1.name, this.user2.name);
            this.user1.socket.send(JSON.stringify({
                type: messages_1.Messages.CreateConnection
            }));
            (_c = this.user2) === null || _c === void 0 ? void 0 : _c.socket.send(JSON.stringify({
                type: messages_1.Messages.CreateConnection
            }));
            console.log('p2p connection started');
        }
        else {
            console.log("user1 and user2 do not have sockets");
        }
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
            const message = JSON.parse(data);
            switch (message.type) {
                case messages_1.Messages.SendOffer:
                    if (((_a = this.user1) === null || _a === void 0 ? void 0 : _a.socket) == socket) {
                        (_b = this.user2) === null || _b === void 0 ? void 0 : _b.socket.send(JSON.stringify({
                            type: messages_1.Messages.SendOffer,
                            data: {
                                offer: message.data.offer
                            }
                        }));
                    }
                    else if (((_c = this.user2) === null || _c === void 0 ? void 0 : _c.socket) == socket) {
                        (_d = this.user1) === null || _d === void 0 ? void 0 : _d.socket.send(JSON.stringify({
                            type: messages_1.Messages.SendOffer,
                            data: {
                                offer: message.data.offer
                            }
                        }));
                    }
                    break;
                case messages_1.Messages.SendAnswer:
                    if (((_e = this.user1) === null || _e === void 0 ? void 0 : _e.socket) == socket) {
                        (_f = this.user2) === null || _f === void 0 ? void 0 : _f.socket.send(JSON.stringify({
                            type: messages_1.Messages.SendAnswer,
                            data: {
                                answer: message.data.answer
                            }
                        }));
                    }
                    else if (((_g = this.user2) === null || _g === void 0 ? void 0 : _g.socket) == socket) {
                        (_h = this.user1) === null || _h === void 0 ? void 0 : _h.socket.send(JSON.stringify({
                            type: messages_1.Messages.SendAnswer,
                            data: {
                                answer: message.data.answer
                            }
                        }));
                    }
                    break;
                case messages_1.Messages.SendIceCandidates:
                    if (((_j = this.user1) === null || _j === void 0 ? void 0 : _j.socket) == socket) {
                        (_k = this.user2) === null || _k === void 0 ? void 0 : _k.socket.send(JSON.stringify({
                            type: messages_1.Messages.SendIceCandidates,
                            data: {
                                iceCandidates: message.data.iceCandidates
                            }
                        }));
                    }
                    else if (((_l = this.user2) === null || _l === void 0 ? void 0 : _l.socket) == socket) {
                        (_m = this.user1) === null || _m === void 0 ? void 0 : _m.socket.send(JSON.stringify({
                            type: messages_1.Messages.SendIceCandidates,
                            data: {
                                iceCandidates: message.data.iceCandidates
                            }
                        }));
                    }
                    break;
                case messages_1.Messages.StartConnection:
                    if (((_o = this.user1) === null || _o === void 0 ? void 0 : _o.socket) == socket) {
                        this.user1.connState = 1;
                    }
                    else if (((_p = this.user2) === null || _p === void 0 ? void 0 : _p.socket) == socket) {
                        this.user2.connState = 1;
                    }
                    if (((_q = this.user1) === null || _q === void 0 ? void 0 : _q.connState) == 1 && ((_r = this.user2) === null || _r === void 0 ? void 0 : _r.connState) == 1) {
                        this.user1.socket.send(JSON.stringify({
                            type: messages_1.Messages.StartConnection
                        }));
                    }
                    break;
                case messages_1.Messages.socketCreated: {
                    if (socket == ((_s = this.user1) === null || _s === void 0 ? void 0 : _s.socket)) {
                        this.user1.socket.send(JSON.stringify({
                            type: messages_1.Messages.CreateConnection
                        }));
                    }
                    else if (socket == ((_t = this.user2) === null || _t === void 0 ? void 0 : _t.socket)) {
                        this.user2.socket.send(JSON.stringify({
                            type: messages_1.Messages.CreateConnection
                        }));
                    }
                    break;
                }
                case messages_1.Messages.connectionCompleted:
                    if (socket == ((_u = this.user1) === null || _u === void 0 ? void 0 : _u.socket)) {
                        if (((_v = this.user1) === null || _v === void 0 ? void 0 : _v.connState) == 1 && ((_w = this.user2) === null || _w === void 0 ? void 0 : _w.connState) == 1) {
                            this.user2.socket.send(JSON.stringify({
                                type: messages_1.Messages.StartConnection
                            }));
                        }
                    }
                    break;
                default:
                    break;
            }
        });
    }
}
exports.Room = Room;
