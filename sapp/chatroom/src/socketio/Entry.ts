/**
 * Socket.IO 程序入口
 * @author dodo
 * @date 2020.04.27
 */

import SocketIO from "socket.io";
import { SOCKET_IO_PORT } from "../const/Consts";
import Client from "./Client";
import core from "../core/Core";
import { EVENT_RECV_DATA, EVENT_CONNECT_CLOSE } from "../core/Events";
import Dev from "../utils/Dev";

export class Entry {
    public run(): void {
        Dev.print("SocketIO Server Entry", "run");

        const io = SocketIO(SOCKET_IO_PORT);
        io.on("connect", (socket) => {
            Dev.print("SocketIO Server Connection");

            const client = new Client(socket);
            socket.on("message", (data) => {
                if (data === "ping") {
                    Dev.print("SocketIO Server Recv", "PING");
                    client.pong();
                } else {
                    core.emit(EVENT_RECV_DATA, client, data);
                }
            });
            socket.on("disconnect", (reason) => {
                Dev.print("SocketIO Server Disconnect", reason);
                core.emit(EVENT_CONNECT_CLOSE, client);
            });
        });
    }
}

const socketIOEntry = new Entry();
export default socketIOEntry;
