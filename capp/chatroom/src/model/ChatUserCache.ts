/**
 * 用户信息缓存
 * @author dodo
 * @date 2020.05.12
 */

import { IChatUser } from "./ProtocolTypes";
import NetUser from "../net/NetUser";

export default class ChatUserCache {
    /**
     * 查询用户数据, 如果没有缓存则会自动从网络获取
     */
    public async get(uid: number): Promise<IChatUser | undefined> {
        if (this.m_uid2User.has(uid)) {
            return Promise.resolve(this.m_uid2User.get(uid));
        } else {
            const chatUser = await NetUser.getUserInfo({ uid });
            if (chatUser) {
                this.m_uid2User.set(uid, chatUser);
            }
            return chatUser;
        }
    }

    private m_uid2User: Map<number, IChatUser> = new Map();
}
