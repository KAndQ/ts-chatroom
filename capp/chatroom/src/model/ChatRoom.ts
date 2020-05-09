/**
 * 聊天室的房间
 * @author dodo
 * @date 2020.05.09
 */

import { IChatUser, ChatMessageElemUnion } from "./ProtocolTypes";

export default class ChatRoom {
    private m_users: IChatUser[] = [];
    private m_messages: ChatMessageElemUnion[] = [];
}
