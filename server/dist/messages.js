"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = void 0;
var Messages;
(function (Messages) {
    Messages["CreateRoom"] = "create-room";
    Messages["SendOffer"] = "send-offer";
    Messages["SendAnswer"] = "send-answer";
    Messages["SendIceCandidates"] = "send-ice-candidates";
    Messages["CreateConnection"] = "create-connection";
    Messages["StartConnection"] = "start-connection";
    Messages["SendPeer"] = "send-peer";
    Messages["socketCreated"] = "socket-created";
    Messages["connectionCompleted"] = "user1done";
})(Messages || (exports.Messages = Messages = {}));
