/**
 * 消息网络相关处理
 * @author dodo
 * @date 2020.05.11
 */

import core from "../model/Core";
import {
    ChatMessageElemType,
    ResponseSendMessage,
    IChatMessage,
    ResponsePullMessages,
    RequestPushMessage,
} from "../model/ProtocolTypes";
import Consts from "../const/Consts";
import { EVENT_PULL_MESSAGES, EVENT_PUSH_MESSAGE } from "../model/Events";

export default class NetMessage {
    /**
     * 发送文本信息
     */
    public static async sendText(text: string): Promise<boolean> {
        return new Promise((resolve) => {
            core.client.request(
                "sendMessage",
                { elem: { elemType: ChatMessageElemType.TEXT, text: text } },
                (resp: ResponseSendMessage) => {
                    resolve(resp.success);
                }
            );
        });
    }

    /**
     * 从服务器拉取历史消息数据
     */
    public static async pullMessages(isFirst?: boolean): Promise<IChatMessage[]> {
        return new Promise((resolve) => {
            const mid = core.store.messages.length > 0 ? core.store.messages[0].mid : undefined;
            core.client.request(
                "pullMessages",
                { mid, count: Consts.PULL_MESSAGES_MAX_COUNT },
                (resp: ResponsePullMessages) => {
                    resp.messages.forEach((m) => {
                        core.store.messages.splice(0, 0, m);
                    });
                    core.emit(EVENT_PULL_MESSAGES, isFirst, resp.messages.length);
                    resolve(resp.messages,);
                }
            );
        });
    }

    /**
     * 订阅消息的推送
     */
    public static subscribePushMessage() {
        core.client.subscribe("pushMessage", (req: RequestPushMessage) => {
            core.store.messages.push(req.message);
            core.emit(EVENT_PUSH_MESSAGE);
        });
    }
}
