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
    public static getInstance() {
        if (this.s_instance === undefined) {
            this.s_instance = new Entry();
        }
        return this.s_instance;
    }

    private constructor() {}

    public run(): void {
        if (this.m_isInit) {
            return;
        }

        this.m_isInit = true;

        Dev.print("SocketIO Server Entry", "run");

        const io = SocketIO(SOCKET_IO_PORT);
        io.on("connect", (socket) => {
            Dev.print("SocketIO Server Connection");

            const client = new Client(socket);
            socket.on("message", (data) => {
                if (data === "ping") {
                    Dev.print("SocketIO Server Recv", "PING");
                    client.pong();
                } else if (data === "pong") {
                    Dev.print("SocketIO Server Recv", "PONG");
                } else {
                    if (data instanceof String) {
                        core.emit(EVENT_RECV_DATA, client, data);
                    } else if (data instanceof ArrayBuffer) {
                        const buf = Buffer.from(data);
                        core.emit(EVENT_RECV_DATA, client, buf.toString());
                    } else if (data instanceof Buffer) {
                        core.emit(EVENT_RECV_DATA, client, data.toString());
                    } else {
                        Dev.print("SocketIO Server Recv Error", "Unknown data type");
                        console.log(data);
                    }
                }
            });
            socket.on("disconnect", (reason) => {
                Dev.print("SocketIO Server Disconnect", reason);
                core.emit(EVENT_CONNECT_CLOSE, client);
            });
        });
    }

    private static s_instance: Entry | undefined;
    private m_isInit: boolean = false;
}

const socketIOEntry = Entry.getInstance();
export default socketIOEntry;
