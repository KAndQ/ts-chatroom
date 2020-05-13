/**
 * 用户数据相关的网络接口
 * @author dodo
 * @date 2020.05.11
 */

import core from "../model/Core";
import {
    RequestLogin,
    ResponseLogin,
    RequestHeartbeat,
    ResponseHeartbeat,
    RequestGetUserInfo,
    ResponseGetUserInfo,
    IChatUser,
    RequestPushChatUserStatus,
    ChatUserStatus,
} from "../model/ProtocolTypes";
import { EVENT_OFFLINE_USER, EVENT_ONLINE_USER } from "../model/Events";

export default class NetUser {
    /**
     * 登录
     */
    public static async login(request: RequestLogin): Promise<ResponseLogin> {
        return new Promise((resolve) => {
            core.client.request("login", request, (resp: ResponseLogin) => {
                if (resp.chatUser) {
                    core.store.myself = resp.chatUser;
                }
                resolve(resp);
            });
        });
    }

    /**
     * 心跳
     */
    public static async heartbeat(request: RequestHeartbeat): Promise<void> {
        return new Promise((resolve) => {
            core.client.request("heartbeat", request, (resp: ResponseHeartbeat) => {
                resolve();
            });
        });
    }

    /**
     * 使用 uid 获取用户信息
     */
    public static async getUserInfo(request: RequestGetUserInfo): Promise<IChatUser | undefined> {
        return new Promise((resolve) => {
            core.client.request("getUserInfo", request, (resp: ResponseGetUserInfo) => {
                resolve(resp.chatUser);
            });
        });
    }

    /**
     * 订阅推送的玩家状态信息
     */
    public static subscribePushChatUserStatus() {
        core.client.subscribe("pushChatUserStatus", (req: RequestPushChatUserStatus) => {
            if (req.status === ChatUserStatus.OFFLINE) {
                core.emit(EVENT_OFFLINE_USER, req.chatUser);
            } else if (req.status === ChatUserStatus.ONLINE) {
                core.emit(EVENT_ONLINE_USER, req.chatUser);
            }
        });
    }
}
