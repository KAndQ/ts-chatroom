/**
 * 对网络连接的客户端封装
 * @author dodo
 * @date 2020.05.09
 */

import io from "socket.io-client";
import Consts from "../const/Consts";
import { NetPackage } from "../model/ProtocolTypes";
import Dev from "../utils/Dev";
import * as binconv from "binconv";
import utf8 from "utf8";

interface RespCallback {
    (res: any): void;
}

interface ReqCallback {
    (req: any): void;
}

export default class NetClient {
    public constructor() {
        this.m_sock = io(Consts.SOCKET_IO_HOST, {
            autoConnect: false,
        });
    }

    public async connect(callback?: () => void) {
        this.m_sock.connect();

        this.m_sock.on("connect", () => {
            this.m_queue = [];
            this.m_session2Callback = new Map();
            this.m_cmd2Calbacks = new Map();
            this.schedule();

            if (callback) {
                callback();
            }

            this.m_sock.off("connect");
        });

        this.m_sock.on("connect_error", (error: Error) => {});

        this.m_sock.on("connect_timeout", (timeout: number) => {});

        this.m_sock.on("error", (error: Error) => {});

        this.m_sock.on("disconnect", (reason: string) => {
            this.m_sock = io(Consts.SOCKET_IO_HOST, {
                autoConnect: false,
            });
        });

        this.m_sock.on("reconnect", (attemptNumber: number) => {});

        this.m_sock.on("reconnect_attempt", (attemptNumber: number) => {});

        this.m_sock.on("reconnecting", (attemptNumber: number) => {});

        this.m_sock.on("reconnect_error", (error: Error) => {});

        this.m_sock.on("reconnect_failed", () => {});

        this.m_sock.on("ping", () => {});

        this.m_sock.on("pong", () => {});

        this.m_sock.on("message", (rawdata: any) => {
            if (rawdata === "ping") {
                Dev.print("NetClient Recv From Server", "ping");
                this.pong();
            } else if (rawdata === "pong") {
                Dev.print("NetClient Recv From Server", "pong");
            } else {
                if (rawdata instanceof String) {
                    Dev.print("NetClient Recv", rawdata.toString());
                    this.m_queue.push(JSON.parse(rawdata.toString()));
                } else if (rawdata instanceof ArrayBuffer) {
                    const strjson = binconv.uint8ArrayToString(new Uint8Array(rawdata));
                    Dev.print("NetClient Recv", strjson);
                    this.m_queue.push(JSON.parse(strjson));
                } else if (rawdata instanceof Blob) {
                    rawdata = rawdata as any;
                    rawdata.arrayBuffer().then((data: ArrayBuffer) => {
                        const strjson = JSON.parse(
                            binconv.uint8ArrayToString(new Uint8Array(data))
                        );
                        Dev.print("NetClient Recv", strjson);
                        this.m_queue.push(JSON.parse(strjson));
                    });
                } else {
                    Dev.print("SocketIO Recv Message Error", "Unknown data type");
                    console.log(rawdata);
                }
            }
        });
    }

    /**
     * 发送二进制内容
     */
    public sendBuffer(buf: ArrayBuffer) {
        this.m_sock.send(buf);
    }

    /**
     * 发送字符串内容
     */
    public sendString(s: string) {
        this.sendBuffer(binconv.stringToArrayBuffer(s));
    }

    /**
     * 发送 ping 消息
     */
    public ping() {
        this.m_sock.send("ping");
    }

    /**
     * 发送 pong 消息
     */
    public pong() {
        this.m_sock.send("pong");
    }

    /**
     * 给服务器发送请求数据
     */
    public request(cmd: string, req: any, callback?: RespCallback) {
        const netPackage: NetPackage = {
            cmd,
            session: ++this.m_session,
            request: req,
        };
        const strjson = utf8.encode(JSON.stringify(netPackage));
        Dev.print("NetClient Send", strjson);
        this.sendString(strjson);

        if (callback) {
            this.m_session2Callback.set(netPackage.session, callback);
        }
    }

    /**
     * 订阅服务器的推送
     */
    public subscribe(cmd: string, callback: ReqCallback) {
        let callbacks = this.m_cmd2Calbacks.get(cmd);
        if (callbacks === undefined) {
            callbacks = [];
            this.m_cmd2Calbacks.set(cmd, callbacks);
        }
        callbacks.push(callback);
    }

    public schedule() {
        if (this.m_handler !== undefined) {
            clearInterval(this.m_handler);
            this.m_handler = undefined;
        }

        this.m_handler = setInterval(() => {
            if (this.m_queue.length > 0) {
                const netPackage = this.m_queue.splice(0, 1)[0];
                if (netPackage.response) {
                    const callback = this.m_session2Callback.get(netPackage.session);
                    if (callback) {
                        callback(netPackage.response);
                    }
                } else if (netPackage.request) {
                    const callbacks = this.m_cmd2Calbacks.get(netPackage.cmd);
                    if (callbacks) {
                        callbacks.forEach((v) => {
                            v(netPackage.request);
                        });
                    }
                }
            }
        }, 0);
    }

    public close() {
        this.m_sock.close();
        this.m_sock = this.m_sock = io(Consts.SOCKET_IO_HOST, {
            autoConnect: false,
        });
    }

    private m_sock: SocketIOClient.Socket;
    private m_queue: NetPackage[] = [];
    private m_session: number = 0;
    private m_session2Callback: Map<number, RespCallback> = new Map();
    private m_cmd2Calbacks: Map<string, ReqCallback[]> = new Map();
    private m_handler: NodeJS.Timeout | undefined;
}
