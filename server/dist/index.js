"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const node_http_1 = __importDefault(require("node:http"));
const roommanager_1 = __importDefault(require("./roommanager"));
const messages_1 = require("./messages");
const httpServer = node_http_1.default.createServer().listen(3000);
const wss = new ws_1.WebSocketServer({ server: httpServer });
wss.on("connection", function connection(ws, req) {
    ws.on("message", function message(data) {
        const message = JSON.parse(data);
        if (message.type == messages_1.Messages.CreateRoom) {
            const { roomid, name } = message.data;
            roommanager_1.default.createRoom(roomid, name, ws);
        }
    });
    ws.on("close", () => {
        //@ts-ignore
        const url = new URL(req.url, `http://${req.headers.host}`);
        const roomid = url.searchParams.get(`roomid`);
        if (roomid == null) {
            console.log(`roomid is null`);
            return;
        }
        const room = roommanager_1.default.getRoom(roomid);
        room === null || room === void 0 ? void 0 : room.removeUser(ws);
    });
    ws.send("you are successfully connected");
});
