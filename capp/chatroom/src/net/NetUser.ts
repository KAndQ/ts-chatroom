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
} from "../model/ProtocolTypes";

export default class NetUser {
    /**
     * 登录
     */
    public static async login(request: RequestLogin): Promise<ResponseLogin> {
        return new Promise((resolve) => {
            core.client.request("login", request, (resp: ResponseLogin) => {
                if (resp.chatUser) {
                    core.defaultUser = resp.chatUser;
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
}
