/**
 * 聊天室
 * @author dodo
 * @date 2020.04.27
 */

import core from "./Core";
import { EVENT_RECV_DATA, EVENT_CONNECT_CLOSE } from "./Events";
import ChatUser from "./ChatUser";
import Dev from "../utils/Dev";
import db from "../db/DataBase";
import DBUser from "../db/DBUser";
import {
    ResponseLogin,
    RequestLogin,
    ChatUserStatus,
    NetPackage,
    ChatClient,
    RequestSendMessage,
    ResponseSendMessage,
    RequestHeartbeat,
    ResponseHeartbeat,
    RequestPullMessages,
    ResponsePullMessages,
    IChatMessage,
} from "./ProtocolTypes";
import DBMessage from "../db/DBMessage";

export default class ChatRoom {
    public run(): void {
        core.on(EVENT_RECV_DATA, (client: ChatClient, strjson: string) => {
            try {
                const tdata = JSON.parse(strjson) as NetPackage;
                switch (tdata.cmd) {
                    case "login":
                        this.login(tdata.request, client).then((res) => {
                            this.response(tdata, res, client);
                        });
                        break;
                    case "sendMessage":
                        this.sendMessage(tdata.request, client).then((res) => {
                            this.response(tdata, res, client);

                            if (res.success && res.message) {
                                this.pushMessage(res.message);
                            }
                        });
                        break;
                    case "pullMessages":
                        this.pullMessages(tdata.request, client).then((res) => {
                            this.response(tdata, res, client);
                        });
                        break;
                    case "uploadFile":
                        break;
                    case "uploadImage":
                        break;
                    case "heartbeat":
                        this.heartbeat(tdata.request, client).then((res) => {
                            this.response(tdata, res, client);
                        });
                        break;
                }
            } catch (e) {
                Dev.print("Chat Room Error", e.toString());
            }
        });

        core.on(EVENT_CONNECT_CLOSE, (client: ChatClient) => {
            Dev.print("Chat Room", "connect close");

            const chatUser = this.m_id2Users.get(client.clientId);
            if (chatUser) {
                this.m_id2Users.delete(client.clientId);
                this.m_id2Clients.delete(client.clientId);
                this.m_uid2Users.delete(chatUser.uid);
                DBUser.logout(db, chatUser);
                this.pushChatUserStatus(chatUser, ChatUserStatus.OFFLINE);
            }
        });
    }

    public async login(request: RequestLogin, client: ChatClient): Promise<ResponseLogin> {
        try {
            const chatUser = await DBUser.login(db, request.nickname, request.password);
            if (this.m_uid2Users.has(chatUser.uid)) {
                return { errString: "用户已登录" };
            }
            this.m_id2Users.set(client.clientId, chatUser);
            this.m_id2Clients.set(client.clientId, client);
            this.m_uid2Users.set(chatUser.uid, chatUser);
            this.pushChatUserStatus(chatUser, ChatUserStatus.ONLINE);
            return { chatUser: chatUser.toData() };
        } catch (e) {
            return { errString: e.message };
        }
    }

    public async heartbeat(
        request: RequestHeartbeat,
        client: ChatClient
    ): Promise<ResponseHeartbeat> {
        return {};
    }

    public async sendMessage(
        request: RequestSendMessage,
        client: ChatClient
    ): Promise<ResponseSendMessage> {
        const chatUser = this.m_id2Users.get(client.clientId);
        if (chatUser) {
            try {
                const chatMessage = await DBMessage.add(db, request.elem, chatUser);
                return { success: true, message: chatMessage };
            } catch (e) {
                Dev.print("Chat Room sendMessage error", e.message);
                return { success: false };
            }
        }
        return { success: false };
    }

    public async pullMessages(
        request: RequestPullMessages,
        client: ChatClient
    ): Promise<ResponsePullMessages> {
        const messages = await DBMessage.get(db, request.count, request.mid);
        return { messages };
    }

    public uploadFile(request: { base64String: string }, client: ChatClient) {}

    public uploadImage(request: { base64String: string }, client: ChatClient) {}

    public pushMessage(message: IChatMessage) {
        this.m_id2Clients.forEach((v) => {
            this.push("pushMessage", { message }, v);
        });
    }

    public pushChatUserStatus(chatUser: ChatUser, status: ChatUserStatus) {
        this.m_id2Users.forEach((v, k) => {
            if (v !== chatUser) {
                const client = this.m_id2Clients.get(k);
                if (client) {
                    this.push(
                        "pushChatUserStatus",
                        { chatUser: chatUser.toData(), status },
                        client
                    );
                }
            }
        });
    }

    /**
     * 响应消息
     */
    private response(tdata: NetPackage, response: any, client: ChatClient) {
        client.sendString(JSON.stringify({ cmd: tdata.cmd, session: tdata.session, response }));
    }

    /**
     * 推送消息
     */
    private push(cmd: string, request: any, client: ChatClient) {
        client.sendString(
            JSON.stringify({
                cmd,
                session: ++this.m_session,
                request,
            })
        );
    }

    private m_uid2Users: Map<number, ChatUser> = new Map();
    private m_id2Users: Map<string, ChatUser> = new Map();
    private m_id2Clients: Map<string, ChatClient> = new Map();
    private m_roomName: string = "寄叶部队-O2组";
    private m_roomId: number = 7;
    private m_session: number = 0;
}
